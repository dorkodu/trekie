import { BANDS, DEFAULT_OPTIONS, DEFAULT_WEIGHTS, MOMENTUM_GAP_DECAY, MOMENTUM_MISSING_STRATEGY, MOMENTUM_NEUTRAL_VALUES } from './constants'
import { computeFactors, trendDeltaRatio, trendScoreFromRatio } from './factors'
import type { MomentumBand, MomentumCalculationOptions, MomentumCoverage, MomentumDailyPoint, MomentumEngineConfig, MomentumFactorValuesRaw, MomentumGapInfo, MomentumInputDay, MomentumResult, MomentumStates, MomentumTrend, MomentumWeights } from './types'
import { clamp, ema, reweight } from './utils'

export interface MomentumEngineInit {
  weights?: Partial<MomentumWeights>
  options?: Partial<MomentumCalculationOptions>
}

export function createMomentumEngine(init: MomentumEngineInit = {}) {
  const weights: MomentumWeights = {
    ...DEFAULT_WEIGHTS,
    ...init.weights,
  }
  const nowDay = init.options?.nowDay ?? new Date().toISOString().slice(0, 10)
  const options: MomentumEngineConfig['options'] = {
    ...DEFAULT_OPTIONS,
    ...init.options,
    nowDay,
  }

  const config: MomentumEngineConfig = { weights, options }

  function compute(days: MomentumInputDay[]): MomentumResult {
    const sorted = [...days].sort((a, b) => a.day.localeCompare(b.day))

    if (sorted.length === 0) {
      const weightsSnapshot = { ...weights }
      return {
        score: 0,
        raw: 0,
        factors: (Object.keys(weightsSnapshot) as (keyof MomentumFactorValuesRaw)[]).map(k => ({
          key: k,
          weight: (weightsSnapshot as any)[k],
          value: 0,
        })),
        trend: { direction: 'flat', label: 'Stable', deltaPct: 0 },
        bands: { range: '0-39', label: 'Fragile' },
        states: { recovery: false, risk: false },
        history: [],
        missingDomains: { habits: true, tasks: true, focus: true } as any,
        imputedFactors: [],
        coverage: { expected: 5, observed: 0, imputed: 0, ratio: 0, effectiveRatio: 0 },
        confidence: 0,
        gaps: undefined,
      }
    }

    // Detect missing domains across entire window (no presence in any day)
    const domainPresence = {
      consistency: true, // virtual, always considered present
      habits: sorted.some(d => d.habits != null),
      tasks: sorted.some(d => d.tasks != null),
      trend: true, // computed
      focus: sorted.some(d => d.focus != null),
    }
    const missingDomains = Object.entries(domainPresence)
      .filter(([, present]) => !present)
      .map(([k]) => k as keyof MomentumFactorValuesRaw)
      .filter(k => k !== 'consistency' && k !== 'trend') // only reweight allocatable domains

    // Determine missing strategy
    const strategy = MOMENTUM_MISSING_STRATEGY
    let effectiveWeights = weights
    const imputedFactors: (keyof MomentumFactorValuesRaw)[] = []
    if (missingDomains.length) {
      if (strategy === 'reweight') {
        effectiveWeights = reweight(weights, missingDomains as (keyof MomentumWeights)[])
      } else if (strategy === 'neutral-impute') {
        // Keep weights, mark for imputation (we'll synthesize neutral values later)
        effectiveWeights = { ...weights }
        imputedFactors.push(...missingDomains)
      } else if (strategy === 'hybrid') {
        // For now treat same as neutral-impute (extend later)
        effectiveWeights = { ...weights }
        imputedFactors.push(...missingDomains)
      }
    }

    // Initial factor scores (trend placeholder)
    const baseFactors = computeFactors(sorted, effectiveWeights, options)

    // Apply neutral imputation for any missing factor values (domain absent entirely)
    for (const f of imputedFactors) {
      // Only overwrite if factor is non-virtual and currently zero due to absence
      if (f in baseFactors) {
        ; (baseFactors as any)[f] = MOMENTUM_NEUTRAL_VALUES[f]
      }
    }

    // Build composite raw per day (without trend factor at first) to compute trend
    const dailyRawWithoutTrend: number[] = []
    for (const d of sorted) {
      // For daily raw we recompute per day using rolling window limited to options.windowDays
      const upto = sorted.filter(x => x.day <= d.day)
      const window = upto.slice(-options.windowDays)
      const partialFactors = computeFactors(window, effectiveWeights, options)
      // exclude trend
      const compositeNoTrend = partialFactors.consistency * effectiveWeights.consistency +
        partialFactors.habits * effectiveWeights.habits +
        partialFactors.tasks * effectiveWeights.tasks +
        partialFactors.focus * effectiveWeights.focus
      dailyRawWithoutTrend.push(compositeNoTrend)
    }

    // Compute trend ratio based on composite raws
    const ratio = trendDeltaRatio(dailyRawWithoutTrend, options.trendShortWindow, options.trendPrevWindow)
    const trendScore = trendScoreFromRatio(ratio)

    const factors: MomentumFactorValuesRaw = { ...baseFactors, trend: trendScore }

    // Recompute final composite raw using full factor set
    const compositeRaw = factors.consistency * effectiveWeights.consistency +
      factors.habits * effectiveWeights.habits +
      factors.tasks * effectiveWeights.tasks +
      factors.trend * effectiveWeights.trend +
      factors.focus * effectiveWeights.focus

    // Build augmented daily values (include trend component)
    const augmentedValues = dailyRawWithoutTrend.map(v => v + (trendScore * effectiveWeights.trend))

    const { smoothed, decayEvents } = smoothSeriesWithGaps(sorted, augmentedValues, options.emaAlpha)

    const latestSmoothedRaw = smoothed[smoothed.length - 1] ?? compositeRaw

    const history: MomentumDailyPoint[] = dailyRawWithoutTrend.map((raw, idx) => {
      const withTrend = raw + (trendScore * effectiveWeights.trend)
      const dayEntry = sorted[idx]
      return {
        day: dayEntry ? dayEntry.day : 'unknown',
        raw: clamp(0, withTrend, 1),
        score: Math.round(clamp(0, withTrend, 1) * 100)
      }
    })

    const trend: MomentumTrend = buildTrend(ratio)
    const bands = resolveBand(latestSmoothedRaw)
    const states = resolveStates(history)

    // Coverage metrics
    const expectedFactors = 3 /* habits, tasks, focus */ + 1 /* consistency always */ + 1 /* trend always */
    const observed = 1 /* consistency */ + 1 /* trend */ + ['habits', 'tasks', 'focus'].filter(k => !(missingDomains as any).includes(k)).length
    const imputed = imputedFactors.length
    const coverage: MomentumCoverage = {
      expected: expectedFactors,
      observed,
      imputed,
      ratio: observed / expectedFactors,
      effectiveRatio: (observed + imputed) / expectedFactors,
    }
    const confidence = Math.sqrt(coverage.ratio)

    // Gap info (largest gap across provided days)
    const gapInfo = computeGaps(sorted)

    return {
      score: Math.round(clamp(0, latestSmoothedRaw, 1) * 100),
      raw: clamp(0, latestSmoothedRaw, 1),
      factors: Object.entries(factors).map(([key, value]) => ({
        key: key as keyof MomentumFactorValuesRaw,
        weight: effectiveWeights[key as keyof MomentumFactorValuesRaw],
        value
      })),
      trend,
      bands,
      states,
      history,
      missingDomains: missingDomains.reduce((acc, k) => { acc[k] = true; return acc }, {} as any),
      imputedFactors,
      coverage,
      confidence,
      gaps: gapInfo,
      decayEvents,
    }
  }

  return { compute, config }
}

function smoothSeriesWithGaps(days: MomentumInputDay[], values: number[], alpha: number) {
  let prev: number | undefined
  const out: number[] = []
  const decayEvents: { index: number, gapDays: number, before: number, after: number }[] = []
  for (let i = 0; i < values.length; i++) {
    const v = values[i] ?? 0
    if (prev != null && i > 0 && MOMENTUM_GAP_DECAY.enabled) {
      const prevDay = days[i - 1]?.day
      const curDay = days[i]?.day
      if (prevDay && curDay) {
        const gapDays = dayDiff(prevDay, curDay) - 1
        if (gapDays >= MOMENTUM_GAP_DECAY.minGapDays) {
          const neutral = deriveNeutralComposite()
          const decayFactor = Math.exp(-Math.log(2) * (gapDays / MOMENTUM_GAP_DECAY.halfLifeDays))
          const before = prev
          prev = neutral + (prev - neutral) * decayFactor
          decayEvents.push({ index: i, gapDays, before, after: prev })
        }
      }
    }
    prev = ema(prev, v, alpha)
    out.push(prev)
  }
  return { smoothed: out, decayEvents }
}

function deriveNeutralComposite(): number {
  if (MOMENTUM_GAP_DECAY.neutralStrategy === 'fixed') return MOMENTUM_GAP_DECAY.fixedNeutralValue
  // weighted: approximate by weighted average of neutral factor values (excluding trend to avoid recursion then add average)
  const wSum = DEFAULT_WEIGHTS.consistency + DEFAULT_WEIGHTS.habits + DEFAULT_WEIGHTS.tasks + DEFAULT_WEIGHTS.focus + DEFAULT_WEIGHTS.trend
  const total = (MOMENTUM_NEUTRAL_VALUES.consistency * DEFAULT_WEIGHTS.consistency) +
    (MOMENTUM_NEUTRAL_VALUES.habits * DEFAULT_WEIGHTS.habits) +
    (MOMENTUM_NEUTRAL_VALUES.tasks * DEFAULT_WEIGHTS.tasks) +
    (MOMENTUM_NEUTRAL_VALUES.focus * DEFAULT_WEIGHTS.focus) +
    (MOMENTUM_NEUTRAL_VALUES.trend * DEFAULT_WEIGHTS.trend)
  return total / wSum
}

function computeGaps(days: MomentumInputDay[]): MomentumGapInfo | undefined {
  if (!days.length) return undefined
  // days are sorted
  let largest = 1
  let recentGap: number | undefined
  const gapEvents: { from: string, to: string, days: number }[] = []
  for (let i = 1; i < days.length; i++) {
    const prevEntry = days[i - 1]
    const curEntry = days[i]
    if (!prevEntry || !curEntry) continue
    const prev = prevEntry.day
    const cur = curEntry.day
    const gap = dayDiff(prev, cur)
    if (gap > 1) {
      if (gap > largest) largest = gap
      gapEvents.push({ from: prev, to: cur, days: gap - 1 })
      if (i === days.length - 1) recentGap = gap - 1
    }
  }
  return { largestGapDays: largest - 1, recentGapDays: recentGap, gapEvents }
}

function dayDiff(a: string, b: string) {
  const da = new Date(a + 'T00:00:00Z').getTime()
  const db = new Date(b + 'T00:00:00Z').getTime()
  return Math.round((db - da) / 86400000)
}

function buildTrend(ratio: number): MomentumTrend {
  let direction: MomentumTrend['direction'] = 'flat'
  if (ratio > 0.05) direction = 'up'
  else if (ratio < -0.05) direction = 'down'
  const label: MomentumTrend['label'] = direction === 'up' ? 'Accelerating' : direction === 'down' ? 'Slowing' : 'Stable'
  return { direction, label, deltaPct: ratio }
}

function resolveBand(raw: number): MomentumBand {
  for (const b of BANDS) {
    if (raw >= b.min && raw <= b.max) {
      return { range: b.range, label: b.label }
    }
  }
  return { range: '0-39', label: 'Fragile' }
}

function resolveStates(history: MomentumDailyPoint[]): MomentumStates {
  const latest = history[history.length - 1]
  if (!latest) return { recovery: false, risk: false }
  // recovery: latest score >= min + 10 within last 7 days
  const window = history.slice(-7)
  const minScore = Math.min(...window.map(h => h.score))
  const recovery = latest.score - minScore >= 10
  // risk: score < 45 OR 3 negative deltas
  const risk = latest.score < 45 || hasConsecutiveNegative(history, 3)
  return { recovery, risk }
}

function hasConsecutiveNegative(history: MomentumDailyPoint[], n: number) {
  if (history.length < n + 1) return false
  let streak = 0
  for (let i = history.length - 1; i > 0; i--) {
    const today = history[i]
    const prev = history[i - 1]
    if (!today || !prev) break
    if (today.score < prev.score) streak++
    else break
    if (streak >= n) return true
  }
  return false
}
