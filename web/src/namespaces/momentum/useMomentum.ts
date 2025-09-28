import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { db, type IMomentumSnapshot } from '@web/lib/db';
import { trekie } from '@web/lib/trekie';
import { trpc } from '@web/lib/trpc';

export interface MomentumBandSnapshot { range: string; label: string; current?: any }
export interface MomentumStatesSnapshot { recovery: boolean; risk: boolean }
export interface MomentumCoverageSnapshot { expected: number; observed: number; imputed: number; ratio: number; effectiveRatio: number }
export interface MomentumGapEvents { from: string; to: string; days: number }
export interface MomentumGaps { largestGapDays: number; recentGapDays?: number; gapEvents: MomentumGapEvents[] }
export interface MomentumDecayEvent { index: number; gapDays: number; before: number; after: number }
export interface MomentumExplanationFactor { key: string; message: string }
export interface MomentumExplanation { topFactors?: MomentumExplanationFactor[]; weakFactors?: MomentumExplanationFactor[] }
export interface MomentumSnapshot {
  calibrating?: boolean
  score?: number
  trend?: number
  bands?: { current?: { label?: string } } | MomentumBandSnapshot
  states?: MomentumStatesSnapshot
  history?: { day: string; raw?: number; score: number }[]
  missingDomains?: Record<string, boolean>
  coverage?: MomentumCoverageSnapshot
  imputedFactors?: string[]
  confidence?: number
  gaps?: MomentumGaps
  decayEvents?: MomentumDecayEvent[]
  explanation?: MomentumExplanation & Record<string, any>
  delta?: Record<string, unknown>
  impact?: Record<string, unknown>
  recommendations?: any[]
}

export interface UseMomentumOptions {
  windowDays?: number
  explain?: boolean
  delta?: boolean
  impact?: boolean
  recommendations?: boolean
  persist?: boolean
}

type BaseQueryResult = ReturnType<typeof useQuery<MomentumSnapshot>>
export type UseMomentumResult = BaseQueryResult & { calibrating: boolean }
export function useMomentum(options?: UseMomentumOptions): UseMomentumResult {
  const flags = {
    windowDays: options?.windowDays,
    explain: options?.explain,
    delta: options?.delta,
    impact: options?.impact,
    recommendations: options?.recommendations
  }
  // Build TRPC input while omitting undefined fields to satisfy schema
  const input: any = {}
  if (flags.windowDays !== undefined) input.windowDays = flags.windowDays
  if (flags.explain) input.explain = true
  if (flags.delta) input.delta = true
  if (flags.impact) input.impact = true
  if (flags.recommendations) input.recommendations = true

  // Fetch recent commit records for momentum calculation
  const windowDays = flags.windowDays ?? 10
  const cutoffDate = Date.now() - (windowDays * 24 * 60 * 60 * 1000) // windowDays ago

  const commitRecordsQuery = useQuery({
    queryKey: ['commitRecords', windowDays],
    queryFn: async () => {
      const records = await trekie.db.commitRecords
        .where('timestamp')
        .above(cutoffDate)
        .and(record => record.userId === trekie.game().user.id)
        .toArray()

      return records.map(r => ({
        id: r.id,
        userId: r.userId,
        kind: r.kind,
        instanceId: r.instanceId,
        timestamp: r.timestamp,
        event: r.event,
        data: r.data,
        reward: r.reward
      }))
    },
    staleTime: 30_000, // Cache for 30 seconds
    refetchInterval: 60_000 // Refetch every minute
  })

  // Include commit records in the input if available
  if (commitRecordsQuery.data && commitRecordsQuery.data.length > 0) {
    input.commitRecords = commitRecordsQuery.data
  }

  const snapshotQueryOptions = trpc.momentum.getSnapshot.queryOptions(Object.keys(input).length ? input : undefined)
  const query = useQuery<MomentumSnapshot>({
    queryKey: snapshotQueryOptions.queryKey,
    queryFn: snapshotQueryOptions.queryFn as any,
    staleTime: 60_000,
    refetchInterval: 120_000,
    enabled: commitRecordsQuery.isSuccess // Only run momentum query after commit records are loaded
  })

  if (query.isSuccess && options?.persist && query.data?.score) {
    const historyArray = Array.isArray((query.data as any).history) ? (query.data as any).history : []
    const lastDay = historyArray.length ? historyArray[historyArray.length - 1]?.day : undefined
    const id = `${query.data.score}-${lastDay ?? Date.now()}`
    const record: IMomentumSnapshot = {
      id,
      createdAt: Date.now(),
      windowDays: options?.windowDays ?? 10,
      score: query.data.score,
      trend: query.data.trend as number | undefined,
      bands: query.data.bands,
      states: query.data.states,
      explanation: query.data.explanation,
      impact: query.data.impact,
      recommendations: query.data.recommendations
    }
    db.momentumSnapshots.put(record).catch(e => {
      console.error('[momentum] failed to persist snapshot', e)
    })
  }

  const calibrating = (query.data as MomentumSnapshot | undefined)?.calibrating === true || commitRecordsQuery.isLoading
  return { ...(query as any), calibrating }
}

export function useMomentumHistory(limit = 30) {
  const [items, setItems] = useState<IMomentumSnapshot[]>([])
  useEffect(() => {
    let cancelled = false
    db.momentumSnapshots
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray()
      .then(r => { if (!cancelled) setItems(r) })
    return () => { cancelled = true }
  }, [limit])
  return items
}

export default useMomentum
