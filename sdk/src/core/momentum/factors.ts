import type { MomentumFactorComputeResult, MomentumFactorDefinition, MomentumFactorRegistry } from './factors/index'
import { createDefaultMomentumFactors } from './factors/index'
import type { MomentumCalculationOptions, MomentumFactorId, MomentumFactorValuesRaw, MomentumInputDay, MomentumWeights } from './types'
import { average, clamp, ratioNormalize, safeDiv } from './utils'

interface FactorComputationEntry {
  definition: MomentumFactorDefinition
  result: MomentumFactorComputeResult
}

export interface FactorComputationRun {
  entries: FactorComputationEntry[]
  values: Record<MomentumFactorId, number>
}

export function runFactorRegistry(
  days: MomentumInputDay[],
  weights: MomentumWeights,
  options: Required<MomentumCalculationOptions>,
  registry: MomentumFactorRegistry = createDefaultMomentumFactors()
): FactorComputationRun {
  const entries: FactorComputationEntry[] = []
  const values: Record<MomentumFactorId, number> = {}

  for (const definition of registry) {
    const context = {
      days,
      windowDays: options.windowDays,
      weights: weights as unknown as Record<string, number>,
      options,
      meta: undefined
    }
    const rawResult = definition.compute(context)
    const normalizedValue = clamp(0, rawResult.value, 1)
    const result = { ...rawResult, value: normalizedValue }
    if (definition.hooks?.afterCompute) {
      definition.hooks.afterCompute({ context, result })
    }
    entries.push({ definition, result })
    values[definition.id as MomentumFactorId] = normalizedValue
  }

  return { entries, values }
}

/** Compute raw legacy factor scores (0-1 each) */
export function computeFactors(days: MomentumInputDay[], weights: MomentumWeights, options: Required<MomentumCalculationOptions>): MomentumFactorValuesRaw {
  const { values } = runFactorRegistry(days, weights, options)
  return {
    consistency: values.consistency ?? 0,
    habits: values.habits ?? 0,
    tasks: values.tasks ?? 0,
    trend: 0,
    focus: values.focus ?? 0,
  }
}

export function trendDeltaRatio(compositeRaws: number[], shortWindow: number, prevWindow: number) {
  if (compositeRaws.length < shortWindow + prevWindow) return 0
  const short = compositeRaws.slice(-shortWindow)
  const prev = compositeRaws.slice(-(shortWindow + prevWindow), -shortWindow)
  const shortAvg = average(short)
  const prevAvg = average(prev)
  const ratio = safeDiv(shortAvg - prevAvg, Math.max(prevAvg, 0.01))
  return ratio
}

export function trendScoreFromRatio(ratio: number) {
  return ratioNormalize(ratio)
}
