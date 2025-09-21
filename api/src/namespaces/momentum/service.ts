import { buildMomentumDays, computePointImpact, createMomentumEngine, diffMomentum, explainMomentum, recommendMomentumActions } from '@trekie/sdk/src/core/momentum'
import { type MomentumRepository } from './repository'
import { type MomentumSnapshotInput } from './schemas'

interface MomentumServiceOpts {
  repository: MomentumRepository
  ttlMs?: number
}

interface CacheEntry { at: number; key: string; result: any }

export function createMomentumService({ repository, ttlMs = 60_000 }: MomentumServiceOpts) {
  const engine = createMomentumEngine()
  let cache: CacheEntry | undefined
  // SECURITY TODO: replace in-memory cache with user-scoped LRU; ensure multi-tenant isolation
  /**
   * Delta Logic:
   * We persist every computed snapshot (per user + windowDays) including full raw momentum result.
   * When delta flag requested we load the most recent stored snapshot BEFORE computing the new one.
   * After computing current result we diff previous.result vs current result to produce factor deltas.
   * NOTE: current implementation selects the latest snapshot regardless of time spacing; future enhancement could require minimum time separation.
   */

  function makeKey(userId: string, input: MomentumSnapshotInput) {
    return [userId, input.windowDays, !!input.explain, !!input.delta, !!input.impact, !!input.recommendations].join(':')
  }

  return {
    async snapshot(userId: string, input: MomentumSnapshotInput) {
      const key = makeKey(userId, input)
      const now = Date.now()
      if (cache && cache.key === key && (now - cache.at) < ttlMs) return cache.result

      const windowDays = input.windowDays ?? 10
      const prevSnapshot = await repository.getPreviousSnapshot(userId, windowDays)
      const [habits, commitRecords] = await Promise.all([
        repository.getHabits(userId, windowDays),
        repository.getCommitRecords(userId, windowDays)
      ])
      const days = buildMomentumDays({
        habits: habits.map(h => ({ id: h.id, commitmentId: h.commitmentId, dailyTarget: h.dailyTarget, history: h.history })),
        commitRecords: commitRecords.map(r => ({ event: r.event, kind: r.kind, instanceId: r.instanceId, timestamp: r.timestamp, data: r.data, reward: r.reward })),
        windowDays
      })
      if (!days.length) return { calibrating: true }
      const result = engine.compute(days)

      const payload: any = {
        score: result.score,
        trend: result.trend,
        bands: result.bands,
        states: result.states,
        history: result.history,
        missingDomains: result.missingDomains
      }
      if (input.explain) payload.explanation = explainMomentum(result)
      if (input.delta && prevSnapshot?.result) {
        try {
          payload.delta = diffMomentum(prevSnapshot.result, result as any)
        } catch { /* ignore diff errors */ }
      }
      if (input.impact) payload.impact = computePointImpact(result, {})
      if (input.recommendations) payload.recommendations = recommendMomentumActions(result)

      cache = { at: now, key, result: payload }
      // persist (fire & forget) - TODO: batch / queue if needed
      repository.saveSnapshot({
        id: undefined as any,
        userId,
        windowDays,
        createdAt: new Date(),
        score: result.score,
        trend: result.trend as any,
        bands: result.bands as any,
        states: result.states as any,
        history: result.history as any,
        explanation: input.explain ? payload.explanation : undefined,
        impact: input.impact ? payload.impact : undefined,
        recommendations: input.recommendations ? payload.recommendations : undefined,
        result: result as any
      }).catch(() => { })
      return payload
    }
  }
}

export type MomentumService = ReturnType<typeof createMomentumService>