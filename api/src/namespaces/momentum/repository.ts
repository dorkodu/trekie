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
  getHabits(userId: string, windowDays: number): Promise<HabitRecord[]>
  getCommitRecords(userId: string, windowDays: number): Promise<CommitRecord[]>
  getPreviousSnapshot(userId: string, windowDays: number): Promise<MomentumSnapshotRecord | undefined>
  saveSnapshot(snapshot: MomentumSnapshotRecord): Promise<void>
}

import { db } from '@api/db';
import { and, desc, eq } from 'drizzle-orm';
import { ulid } from 'ulidx';
import { momentumSnapshot } from './schemas/db';

export function createMomentumRepository(_deps: MomentumRepositoryDeps): MomentumRepository {
  return {
    async getHabits(_userId: string, _windowDays: number) { return [] },
    async getCommitRecords(_userId: string, _windowDays: number) { return [] },
    async getPreviousSnapshot(userId, windowDays) {
      const rows = await db.select().from(momentumSnapshot).where(and(eq(momentumSnapshot.userId, userId), eq(momentumSnapshot.windowDays, windowDays))).orderBy(desc(momentumSnapshot.createdAt)).limit(1)
      return rows[0] as any
    },
    async saveSnapshot(s) {
      const id = s.id || ulid()
      await db.insert(momentumSnapshot).values({ ...s, id }).onConflictDoNothing()
    }
  }
}