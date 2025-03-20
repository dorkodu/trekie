import { ulid } from "ulidx"
import { z } from "zod"
import { db } from "./db"
import { Game, GameMutations, ReadOnlyGame } from "./game"
import { IStatus, status, Sync } from "./sync"

export const CommitReward = z.strictObject({
  xp: z.number(),
  coins: z.number(),
})
export type ICommitReward = z.infer<typeof CommitReward>

export const WithData =
  <T extends z.ZodTypeAny>
    (schema: T) => z.strictObject({
      data: schema
    })

export type WithData<T> = { data: T }

export const CommitMessage = z.strictObject({
  id: z.string().ulid(),
  event: z.string(),
  kind: z.string(),
  instanceId: z.string().ulid(),
  timestamp: z.number().int(),
})

export const CommitSchema = <T extends z.ZodTypeAny>(schema: T) => CommitMessage.merge(WithData(schema))

// extending CommitSchema with reward
// we return this to the client
export const CommitResult =
  <T extends z.ZodTypeAny>(schema: T) =>
    CommitSchema(schema).merge(
      z.strictObject({
        reward: CommitReward
      }))

// extending CommitResult with userId
// we sync this to API as a verifiable record
export const CommitRecord =
  <T extends z.ZodTypeAny>(schema: T) =>
    CommitResult(schema).merge(
      z.strictObject({
        userId: z.string().ulid()
      }))

// typescript helper types for in module use only
export type ICommitMessage<T> = z.infer<typeof CommitMessage> & WithData<T>
export type ICommitResult<T> = ICommitMessage<T> & { reward: ICommitReward }
export type ICommitRecord<T> = ICommitResult<T> & { userId: string }

// the action that runs on commit & returns rewards
export type ICommitAction<T> = (message: ICommitMessage<T>) => ICommitReward

//? COMMITS

export const CommitEvent = <T>(action: ICommitAction<T>): ICommitAction<T> => action

//? COMMITMENTS

export type ICommitmentKind = ReturnType<typeof Commitment>
export type ICommitmentTemplate = {
  name: string
  events: Record<any, ICommitAction<any>>
}

export const CommitmentInstance = z.strictObject({
  id: z.string().ulid(),
  kind: z.string(),
  completedAt: z.number().nullable(),
  createdAt: z.number(),
  lastActivity: z.number(),
  isDeleted: z.boolean(),
})
export type ICommitmentInstance = z.infer<typeof CommitmentInstance>

export interface ICommitmentStaticTemplate {
  name: string
  events: Record<string, ICommitReward>
}

export function Commitment
  <TEvents extends ICommitmentTemplate['events'], TKind extends keyof TEvents>
  (name: string, events: TEvents) {
  return {
    name,
    events,

    status: (kind: TKind, instanceId: string, data?: Parameters<TEvents[TKind]>[0]['data']): ICommitMessage<typeof data> =>
    ({
      id: ulid(),
      event: kind.toString(),
      kind: name,
      instanceId,
      timestamp: Date.now(),
      data
    }),

    commit(event: TKind, instanceId: string, data: Parameters<TEvents[TKind]>[0]['data']): ICommitResult<typeof data> {
      // create status object
      let status = this.status(event, instanceId, data)
      // run the action with status object as parameter
      let reward = events[event]!(status)

      return { ...status, reward }
    },

    create(): ICommitmentInstance {
      return {
        id: ulid(),
        kind: name,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        completedAt: null,
        isDeleted: false
      }
    }
  }
}

/**
 * Commitments Module for use in Trekie superconstruct
 */
export function Commitments<TCommitments extends Record<any, ICommitmentKind>, TKind extends keyof TCommitments>(game: ReadOnlyGame, mutations: GameMutations, commitments: TCommitments) {
  return {
    table: db.commitments,
    act<TKind extends keyof TCommitments, TEvent extends keyof TCommitments[TKind]['events']>(
      { kind, event, id, data }: {
        kind: TKind,
        event: TEvent,
        id: string,
        data: Parameters<TCommitments[TKind]['events'][TEvent]>[0]['data']
      }) {
      // 1) mutate game state with commit 2) save this commit record
      // calculate commit event
      const commitResult = commitments[kind]!.commit(event, id, data)
      const commitRecord: ICommitRecord<typeof data> = {
        ...commitResult,
        userId: game().user.id,
      }

      // TODO: take permission from server, if valid save to db, process rewards

      // save commit record to db
      db.commitRecords.add(commitRecord, commitRecord.id)
      db.commitments.update(id, { lastActivity: Date.now() })
      // apply rewards to game state
      mutations.changeXp(commitRecord.reward.xp)
      mutations.changeCoinsBalance(commitRecord.reward.coins)

      return status('COMMITMENT:ACT', game().user.id, commitRecord)
    },

    get: (id: string) => db.commitments.get(id),

    create(kind: TKind) {
      let instance = commitments[kind]!.create()
      db.commitments.add(instance, instance.id)
      status('COMMITMENT:CREATE', game().user.id, { instance })

      return instance
    },

    complete(id: string) {
      db.commitments.update(id, { completedAt: Date.now() })
      status('COMMITMENT:COMPLETE', game().user.id, { id })
    },

    delete(id: string) {
      db.commitments.update(id, { isDeleted: true })
      status('COMMITMENT:DELETE', game().user.id, { id })
    },
  }
} 