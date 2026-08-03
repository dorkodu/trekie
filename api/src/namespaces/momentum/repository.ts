/** MomentumRepository
 * Abstracts persistence lookups for momentum computation.
 * Currently returns empty arrays; integrate with real DB when available.
 */
export interface MomentumRepositoryDeps {
  // add DB clients here (e.g. drizzle instance)
}

export interface HabitRecord { id: string; userId: string; commitmentId: string; dailyTarget: number; history: Record<string, number> }
export interface CommitRecord { id: string; userId: string; kind: string; instanceId: string; timestamp: number; event: string; data?: any; reward?: any }

export interface MomentumSnapshotRecord {
  id: string
  userId: string
  windowDays: number
  createdAt: Date
  score: number
  trend?: any
  bands?: any
  states?: any
  history?: any
  explanation?: any
  impact?: any
  recommendations?: any
  result?: any
}

export interface MomentumRepository {
  getHabits(userId: string, windowDays: number, commitRecords?: CommitRecord[]): Promise<HabitRecord[]>
  getCommitRecords(userId: string, windowDays: number, providedRecords?: CommitRecord[]): Promise<CommitRecord[]>
  getPreviousSnapshot(userId: string, windowDays: number): Promise<MomentumSnapshotRecord | undefined>
  saveSnapshot(snapshot: MomentumSnapshotRecord): Promise<void>
  addCommitRecord(record: Omit<CommitRecord, 'id'> & { id?: string }): Promise<CommitRecord>
}

import { db } from '@api/db';
import { and, desc, eq } from 'drizzle-orm';
import { ulid } from 'ulidx';
import { momentumSnapshot } from './schemas/db';

export function createMomentumRepository(_deps: MomentumRepositoryDeps): MomentumRepository {
  // In-memory event & habit maps (per user) until real DB integration
  const events = new Map<string, CommitRecord[]>()
  const habits = new Map<string, HabitRecord[]>()

  function getDay(ts: number) { return new Date(ts).toISOString().slice(0, 10) }

  function deriveHabitsFromEvents(commitRecords: CommitRecord[], userId: string) {
    // Derive habits from all commitment events, not just progress.logged
    const grouped: Record<string, HabitRecord> = {}

    for (const ev of commitRecords) {
      // Handle habit commitment events
      if (ev.kind === 'Habit' && (ev.event === 'COUNT_UP' || ev.event === 'DAILYCHECK' || ev.event === 'START')) {
        const id = ev.instanceId
        if (!grouped[id]) {
          grouped[id] = {
            id,
            userId,
            commitmentId: id,
            dailyTarget: 1, // Default target, could be enhanced to get from habit data
            history: {}
          }
        }

        if (ev.event === 'COUNT_UP' || ev.event === 'DAILYCHECK') {
          const day = getDay(ev.timestamp)
          const amount = ev.event === 'DAILYCHECK' ? 1 : (ev.data?.count || 1)
          grouped[id].history[day] = (grouped[id].history[day] || 0) + amount
        }
      }

      // Legacy support for progress.logged events
      if (ev.event === 'progress.logged') {
        const id = ev.instanceId || 'default'
        if (!grouped[id]) grouped[id] = { id, userId, commitmentId: id, dailyTarget: 1, history: {} }
        const day = getDay(ev.timestamp)
        grouped[id].history[day] = (grouped[id].history[day] || 0) + (ev.data?.amount ?? 1)
      }
    }

    const arr = Object.values(grouped)
    habits.set(userId, arr)
    return arr
  }

  return {
    async getHabits(userId: string, windowDays: number, commitRecords?: CommitRecord[]) {
      // Use provided commit records or fall back to in-memory events for backward compatibility
      const records = commitRecords || (events.get(userId) || [])
      return deriveHabitsFromEvents(records, userId)
    },
    async getCommitRecords(userId: string, windowDays: number, providedRecords?: CommitRecord[]) {
      // Use provided records or fall back to in-memory events for backward compatibility
      const records = providedRecords || (events.get(userId) || [])
      return records.filter(r => Date.now() - r.timestamp <= windowDays * 86_400_000)
    },
    async getPreviousSnapshot(userId, windowDays) {
      try {
        const rows = await db.select().from(momentumSnapshot).where(and(eq(momentumSnapshot.userId, userId), eq(momentumSnapshot.windowDays, windowDays))).orderBy(desc(momentumSnapshot.createdAt)).limit(1)
        return rows[0] as any
      } catch {
        return undefined
      }
    },
    async saveSnapshot(s) {
      try {
        // Skip saving for demo/mock users that don't exist in the database
        if (s.userId === 'demo-user' || s.userId?.startsWith('demo-')) {
          console.log('[momentum] skipping snapshot save for demo user:', s.userId)
          return
        }

        const id = s.id || ulid()
        await db.insert(momentumSnapshot).values({ ...s, id }).onConflictDoNothing()
      } catch (error) {
        console.error('[momentum] failed to save snapshot:', error)
        // Don't throw - persistence failures shouldn't break momentum calculation
      }
    },
    async addCommitRecord(record) {
      const id = record.id || ulid()
      const r: CommitRecord = { id, ...record }
      const list = events.get(record.userId) || []
      list.push(r)
      events.set(record.userId, list)
      // keep habits in sync lazily
      deriveHabitsFromEvents(list, record.userId)
      return r
    }
  }
}