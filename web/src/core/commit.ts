import { Maybe, Timestamp } from "@/shared/utils"
import { ulid } from "ulid"
import { db } from "./db"
import { Game, GameMutations, ReadOnlyGame } from "./game"
import { IStatus, status, Sync } from "./sync"

export type ICommitReward = { xp: number, coins: number }

// this represents a single commit event message
export interface ICommitMessage<T = any> {
  id: string
  event: string
  kind: string
  instanceId: string
  timestamp: Timestamp
  data: T
}

// COMMITSTATUS, Trekie:Habit:CREATE, 2021-09-01T00:00:00Z, { xp: 5, coins: 0 }

// we return this to the client
export type ICommitResult<T> = ICommitMessage<T> & { reward: ICommitReward }
// we sync this to API as a verifiable record
export type ICommitRecord<T> = ICommitResult<T> & { userId: string }
// the action that runs on commit & returns rewards
export type ICommitAction<T> = (status: ICommitMessage<T>) => ICommitReward
// a status object for a commit event
export type ICommitStatus<T> = IStatus<ICommitRecord<T>>

export type ICommitmentKind = ReturnType<typeof Commitment>
export type ICommitmentTemplate = {
  name: string
  events: Record<any, ICommitAction<any>>
}

export interface ICommitmentInstance {
  id: string
  kind: string
  completedAt: Maybe<Timestamp>
  createdAt: Timestamp
  lastActivity: Timestamp
  isDeleted: boolean
}

export interface ICommitmentStaticSchema {
  name: string
  events: Record<string, ICommitReward>
}

export const CommitEvent = <T>(action: ICommitAction<T>): ICommitAction<T> => action
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
        completedAt: undefined,
        isDeleted: false
      }
    }
  }
}

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