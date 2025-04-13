import { ulid } from "ulidx"
import { IDexieDb } from "../../app/db"
import { GameMutations, ReadOnlyGame } from "../game"
import { ICommitmentInstance, ICommitmentKind, ICommitRecord } from "./schema"

/**
 * Commitments Module for use in Trekie superconstruct
 */
export function Commitments
  <TCommitments extends Record<any, ICommitmentKind>, TKind extends keyof TCommitments>
  (game: ReadOnlyGame, mutations: GameMutations, commitments: TCommitments, db: IDexieDb) {

  return {
    table: db.commitments,

    act: async <TKind extends keyof TCommitments, TEvent extends keyof TCommitments[TKind]['events']>(
      { kind, event, id, data }: {
        kind: TKind,
        event: TEvent,
        id: string,
        data: Parameters<TCommitments[TKind]['events'][TEvent]>[0]['data']
      }) => {
      // 1) mutate game state with commit 2) save this commit record
      // calculate commit event
      const commitResult = commitments[kind]!.commit(event, id, data)
      const commitRecord: ICommitRecord<typeof data> = {
        ...commitResult,
        userId: game().user.id,
      }

      // TODO: take permission from server, if valid save to db, process rewards

      // save commit record to db
      await db.commitRecords.add(commitRecord, commitRecord.id)
      await db.commitments.update(id, { lastActivity: Date.now() })
      // apply rewards to game state
      mutations.changeXp(commitRecord.reward.xp)
      mutations.changeCoinsBalance(commitRecord.reward.coins)

      return commitRecord
    },

    rollback: async (commitId: string) => {
      // Look up the record by ID
      const commitRecord = await db.commitRecords.get(commitId)
      if (!commitRecord) return

      // Create a rollback record to track this operation
      const rollbackRecord: ICommitRecord<any> = {
        id: ulid(),
        event: `ROLLBACK_${commitRecord.event}`,
        kind: commitRecord.kind,
        instanceId: commitRecord.instanceId,
        timestamp: Date.now(),
        data: {
          originalCommitId: commitRecord.id,
          reason: 'manual_rollback'
        },
        reward: {
          xp: -commitRecord.reward.xp,
          coins: -commitRecord.reward.coins
        },
        userId: game().user.id
      }

      // Apply negative rewards to reverse the original commit
      mutations.changeXp(-commitRecord.reward.xp)
      mutations.changeCoinsBalance(-commitRecord.reward.coins)

      // Save the rollback record
      await db.commitRecords.add(rollbackRecord, rollbackRecord.id)
    },

    getCommitmentsByUser: async (userId: string) => {
      const commitments = await db.commitments
        .where('userId')
        .equals(userId)
        .toArray()
    },

    getOwnCommitments: async () => {
      const userId = game().user.id
      const commitments = await db.commitments
        .where('userId')
        .equals(userId)
        .toArray()
      return commitments as ICommitmentInstance[]
    },

    get: (id: string) => db.commitments.get(id),

    create: async (kind: TKind) => {
      let instance = commitments[kind]!
        .create({ userId: game().user.id })

      await db.commitments.add(instance, instance.id)

      return instance
    },

    complete: async (id: string) => {
      db.commitments.update(id, { completedAt: Date.now() })
    },

    delete: async (id: string) => {
      db.commitments.update(id, { isDeleted: true })
    },
  }
}