import type { MomentumFactorId, MomentumResult } from './types'

export interface PointImpactConfig {
  /** Target value we consider "strong" for a factor (default 0.8) */
  strongTarget?: number
  /** Minimum gap (value shortfall) to consider (default 0.05) */
  minGap?: number
  /** Max per-factor improvement applied (default 0.25 raw) to avoid unrealistic jumps */
  maxDeltaPerFactor?: number
}

export interface FactorImpactEstimate {
  id: MomentumFactorId
  current: number
  target: number
  potentialRawGain: number // raw 0..1 composite contribution increment (weight * delta)
  potentialPoints: number // 0..100 scale estimate
  weight: number
}

export interface PointImpactResult {
  estimatedPointUpside: number
  factors: FactorImpactEstimate[]
}

/** Estimate potential point increase if weaker factors reached a strongTarget */
export function computePointImpact(result: MomentumResult, cfg: PointImpactConfig = {}): PointImpactResult {
  const { strongTarget = 0.8, minGap = 0.05, maxDeltaPerFactor = 0.25 } = cfg
  const estimates: FactorImpactEstimate[] = []
  for (const f of result.factors) {
    const gap = strongTarget - f.value
    if (gap <= minGap) continue
    const appliedDelta = Math.min(gap, maxDeltaPerFactor)
    const potentialRawGain = appliedDelta * f.weight
    const potentialPoints = potentialRawGain * 100
    estimates.push({
      id: f.id,
      current: f.value,
      target: strongTarget,
      potentialRawGain,
      potentialPoints,
      weight: f.weight
    })
  }
  // Sort descending by potential impact
  estimates.sort((a, b) => b.potentialPoints - a.potentialPoints)
  const estimatedPointUpside = Math.round(estimates.reduce((sum, e) => sum + e.potentialPoints, 0))
  return { estimatedPointUpside, factors: estimates }
}
