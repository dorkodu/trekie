import { useQuery } from '@tanstack/react-query';
import { db, type IMomentumSnapshot } from '@web/lib/db';
import { trpc } from '@web/lib/trpc';
import { useEffect, useState } from 'react';

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

type BaseQueryResult = ReturnType<typeof useQuery<MomentumSnapshot, unknown>>
export type UseMomentumResult = BaseQueryResult & { calibrating: boolean }

export function useMomentum(options?: UseMomentumOptions): UseMomentumResult {
  const flags = {
    windowDays: options?.windowDays,
    explain: options?.explain,
    delta: options?.delta,
    impact: options?.impact,
    recommendations: options?.recommendations
  }
  const queryOptions = trpc.momentum.getSnapshot.queryOptions(flags, {
    staleTime: 60_000,
    refetchInterval: 120_000
  })
  const query = useQuery(queryOptions)

  if (options?.persist && query.data?.score) {
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

  const calibrating = query.data?.calibrating === true
  return { ...query, calibrating }
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
