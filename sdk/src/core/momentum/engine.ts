import { BANDS, DEFAULT_OPTIONS, DEFAULT_WEIGHTS, MOMENTUM_GAP_DECAY, MOMENTUM_MISSING_STRATEGY, MOMENTUM_NEUTRAL_VALUES } from './constants'
import { runFactorRegistry, trendDeltaRatio, trendScoreFromRatio } from './factors'
import type { MomentumFactorRegistry } from './factors/index'
import { createDefaultMomentumFactors } from './factors/index'
import type { MissingDomains, MomentumBand, MomentumCalculationOptions, MomentumCoverage, MomentumDailyPoint, MomentumEngineConfig, MomentumFactorId, MomentumFactorSummary, MomentumFactorValuesRaw, MomentumGapInfo, MomentumInputDay, MomentumResult, MomentumStates, MomentumTrend, MomentumWeights } from './types'
import { clamp, ema, reweight } from './utils'

export interface MomentumEngineInit {
  weights?: Partial<MomentumWeights>
  options?: Partial<MomentumCalculationOptions>
  factors: MomentumFactorRegistry
}

function deriveMomentumWeights(registry: MomentumFactorRegistry, overrides?: Partial<MomentumWeights>): MomentumWeights {
  const weights: MomentumWeights = { ...DEFAULT_WEIGHTS }
  if (overrides) {
    for (const [id, value] of Object.entries(overrides)) {
      if (typeof value === 'number') {
        weights[id as MomentumFactorId] = value
      }
    }
  }
  for (const definition of registry) {
    const id = definition.id as MomentumFactorId
    if (weights[id] == null) {
      weights[id] = definition.defaultWeight
    }
  }
  return weights
}

function resolveNeutralValue(factorId: MomentumFactorId, registry: MomentumFactorRegistry): number {
  const neutralMap = MOMENTUM_NEUTRAL_VALUES as Record<string, number>
  if (neutralMap[factorId] != null) return neutralMap[factorId]
  const definition = registry.find(def => def.id === factorId)
  if (definition?.neutralValue != null) return definition.neutralValue
  return 0.5
}

export function createMomentumEngine(init: MomentumEngineInit) {
  if (!init?.factors || init.factors.length === 0) {
    throw new Error('Momentum engine requires a non-empty factor registry. Pass createDefaultMomentumFactors() for legacy behavior.')
  }
  const factorRegistry: MomentumFactorRegistry = init.factors
  const weights = deriveMomentumWeights(factorRegistry, init.weights)
  const nowDay = init.options?.nowDay ?? new Date().toISOString().slice(0, 10)
  const options: MomentumEngineConfig['options'] = {
    ...DEFAULT_OPTIONS,
    ...init.options,
    nowDay,
  }

  const config: MomentumEngineConfig = { weights, options, factors: factorRegistry.map(f => f.id as MomentumFactorId) }

  function compute(days: MomentumInputDay[]): MomentumResult {
    const sorted = [...days].sort((a, b) => a.day.localeCompare(b.day))

    if (sorted.length === 0) {
      const weightsSnapshot = { ...weights }
      const emptyFactors: MomentumFactorSummary[] = factorRegistry.map(def => ({
        id: def.id as MomentumFactorId,
        label: def.label,
        weight: weightsSnapshot[def.id as MomentumFactorId] ?? 0,
        value: 0,
        observed: false
      }))
      emptyFactors.push({
        id: 'trend',
        label: 'Trend',
        weight: weightsSnapshot.trend ?? 0,
        value: 0,
        observed: false
      })
      return {
        score: 0,
        raw: 0,
        factors: emptyFactors,
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

    // Run registered factors on the entire window
    const factorRun = runFactorRegistry(sorted, weights, options, factorRegistry)
    const missingFactorSet = new Set<MomentumFactorId>(
      factorRun.entries
        .filter(entry => !entry.result.observed)
        .map(entry => entry.definition.id as MomentumFactorId)
    )
    const missingFactorIds = Array.from(missingFactorSet)

    // Determine missing strategy
    const strategy = MOMENTUM_MISSING_STRATEGY
    let effectiveWeights: MomentumWeights = weights
    const imputedFactors: MomentumFactorId[] = []
    if (missingFactorIds.length) {
      if (strategy === 'reweight') {
        effectiveWeights = reweight(weights, missingFactorIds as (keyof MomentumWeights)[])
      } else if (strategy === 'neutral-impute' || strategy === 'hybrid') {
        effectiveWeights = { ...weights }
        imputedFactors.push(...missingFactorIds)
      }
    }

    // Initial factor scores (trend placeholder)
    const baseFactors: MomentumFactorValuesRaw = {
      consistency: factorRun.values.consistency ?? 0,
      habits: factorRun.values.habits ?? 0,
      tasks: factorRun.values.tasks ?? 0,
      trend: 0,
      focus: factorRun.values.focus ?? 0,
    }

    for (const entry of factorRun.entries) {
      const id = entry.definition.id as MomentumFactorId
      baseFactors[id] = entry.result.value
    }

    for (const factorId of imputedFactors) {
      baseFactors[factorId] = resolveNeutralValue(factorId, factorRegistry)
    }

    // Build composite raw per day (without trend factor at first) to compute trend
    const dailyRawWithoutTrend: number[] = []
    for (const d of sorted) {
      // For daily raw we recompute per day using rolling window limited to options.windowDays
      const upto = sorted.filter(x => x.day <= d.day)
      const window = upto.slice(-options.windowDays)
      const partialFactors = runFactorRegistry(window, effectiveWeights, options, factorRegistry)
      // exclude trend
      const compositeNoTrend = partialFactors.entries.reduce((sum, entry) => {
        const id = entry.definition.id as MomentumFactorId
        return sum + (entry.result.value ?? 0) * (effectiveWeights[id] ?? 0)
      }, 0)
      dailyRawWithoutTrend.push(compositeNoTrend)
    }

    // Compute trend ratio based on composite raws
    const ratio = trendDeltaRatio(dailyRawWithoutTrend, options.trendShortWindow, options.trendPrevWindow)
    const trendScore = trendScoreFromRatio(ratio)

    const factors: MomentumFactorValuesRaw = { ...baseFactors, trend: trendScore }

    // Recompute final composite raw using full factor set
    const compositeRaw = factorRun.entries.reduce((sum, entry) => {
      const id = entry.definition.id as MomentumFactorId
      return sum + (factors[id] ?? 0) * (effectiveWeights[id] ?? 0)
    }, 0) + factors.trend * (effectiveWeights.trend ?? 0)

    // Build augmented daily values (include trend component)
    const augmentedValues = dailyRawWithoutTrend.map(v => v + (trendScore * (effectiveWeights.trend ?? 0)))

    const { smoothed, decayEvents } = smoothSeriesWithGaps(sorted, augmentedValues, options.emaAlpha)

    const latestSmoothedRaw = smoothed[smoothed.length - 1] ?? compositeRaw

    const history: MomentumDailyPoint[] = dailyRawWithoutTrend.map((raw, idx) => {
      const withTrend = raw + (trendScore * (effectiveWeights.trend ?? 0))
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
    const expectedFactors = factorRun.entries.length + 1 /* trend */
    const observedCount = factorRun.entries.length - missingFactorIds.length + 1 /* trend */
    const imputed = imputedFactors.length
    const coverageRatio = expectedFactors === 0 ? 0 : observedCount / expectedFactors
    const effectiveRatio = expectedFactors === 0 ? 0 : Math.min(1, (observedCount + imputed) / expectedFactors)
    const coverage: MomentumCoverage = {
      expected: expectedFactors,
      observed: observedCount,
      imputed,
      ratio: coverageRatio,
      effectiveRatio,
    }
    const confidence = Math.sqrt(coverageRatio)

    // Gap info (largest gap across provided days)
    const gapInfo = computeGaps(sorted)

    const factorSummaries: MomentumFactorSummary[] = factorRun.entries.map(entry => {
      const id = entry.definition.id as MomentumFactorId
      return {
        id,
        label: entry.definition.label,
        weight: effectiveWeights[id] ?? 0,
        value: factors[id] ?? 0,
        observed: entry.result.observed,
        extras: entry.result.extras,
      }
    })

    factorSummaries.push({
      id: 'trend',
      label: 'Trend',
      weight: effectiveWeights.trend ?? 0,
      value: trendScore,
      observed: true,
      extras: { ratio }
    })

    const missingDomains = missingFactorIds.reduce((acc, k) => {
      acc[k] = true
      return acc
    }, {} as MissingDomains)

    return {
      score: Math.round(clamp(0, latestSmoothedRaw, 1) * 100),
      raw: clamp(0, latestSmoothedRaw, 1),
      factors: factorSummaries,
      trend,
      bands,
      states,
      history,
      missingDomains,
      imputedFactors,
      coverage,
      confidence,
      gaps: gapInfo,
      decayEvents,
    }
  }

  return { compute, config }
}

export function createMomentumEngineWithDefaults(init: Omit<MomentumEngineInit, 'factors'> = {}) {
  return createMomentumEngine({
    ...init,
    factors: createDefaultMomentumFactors(),
  })
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
