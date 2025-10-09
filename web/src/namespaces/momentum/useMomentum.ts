import { useEffect, useMemo, useState } from 'react'
import { db, type IMomentumSnapshot } from '@web/lib/db'
import { trekie } from '@web/lib/trekie'
import { explainMomentum, recommendMomentumActions, type MomentumResult } from '@sdk/core/momentum'

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
  persist?: boolean
}

export type UseMomentumResult = {
  data?: MomentumSnapshot
  isLoading: boolean
  isError: boolean
  refetch: () => void
  calibrating: boolean
}

function mapSdkToSnapshot(result: MomentumResult): MomentumSnapshot {
  // Map SDK bands to UI labels
  const bandLabel = (() => {
    const l = result.bands.label.toLowerCase()
    if (l === 'building') return 'building'
    if (l === 'strong' || l === 'peak') return 'momentum'
    if (l === 'fragile') return 'neutral'
    return l
  })()

  const explanation = explainMomentum(result) as any
  const recommendations = recommendMomentumActions(result) as any

  return {
    score: result.score,
    trend: result.trend.deltaPct,
    bands: { current: { label: bandLabel } },
    states: result.states,
    history: result.history,
    missingDomains: result.missingDomains,
    coverage: result.coverage,
    imputedFactors: result.imputedFactors as any,
    confidence: result.confidence,
    gaps: result.gaps as any,
    decayEvents: result.decayEvents as any,
    explanation: { ...(explanation || {}), factors: result.factors },
    recommendations,
  }
}

export function useMomentum(options?: UseMomentumOptions): UseMomentumResult {
  const windowDays = options?.windowDays ?? 10
  const [tick, setTick] = useState(0)

  // Compute directly from SDK app helper (xpHistory + dailyTarget)
  const sdkResult = trekie.momentum.useMomentum(windowDays)
  const data = useMemo(() => (sdkResult ? mapSdkToSnapshot(sdkResult as any) : undefined), [sdkResult])

  // Optional local persistence
  useEffect(() => {
    if (!options?.persist || !data?.score) return
    const historyArray = Array.isArray(data.history) ? data.history : []
    const lastDay = historyArray.length ? historyArray[historyArray.length - 1]?.day : undefined
    const id = `${data.score}-${lastDay ?? Date.now()}`
    const record: IMomentumSnapshot = {
      id,
      createdAt: Date.now(),
      windowDays,
      score: data.score,
      trend: data.trend,
      bands: data.bands,
      states: data.states,
      explanation: data.explanation,
      impact: data.impact,
      recommendations: data.recommendations,
    }
    db.momentumSnapshots.put(record).catch(e => {
      console.error('[momentum] failed to persist snapshot', e)
    })
  }, [options?.persist, data?.score, windowDays])

  const calibrating = !data || (Array.isArray(data.history) && data.history.length === 0)
  return {
    data,
    isLoading: false,
    isError: false,
    refetch: () => setTick(t => t + 1),
    calibrating,
  }
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
