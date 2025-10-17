import type { MomentumFactorId, MomentumResult } from './types'

export interface MomentumDeltaItem {
  id: MomentumFactorId
  prev: number
  curr: number
  delta: number // curr - prev
  weight: number
  weightedDelta: number // delta * weight
  direction: 'up' | 'down' | 'flat'
  magnitude: 'minor' | 'moderate' | 'major'
}

export interface MomentumDeltaSummary {
  scorePrev: number
  scoreCurr: number
  scoreDelta: number
  factors: MomentumDeltaItem[]
  biggestPositive?: MomentumDeltaItem
  biggestNegative?: MomentumDeltaItem
}

export interface DiffMomentumOptions {
  /** Minimum absolute weighted delta to include the factor (default 0) */
  minWeightedDelta?: number
  /** Thresholds for magnitude classification (ascending). */
  magnitudeThresholds?: { minor: number; moderate: number }
}

/** Create lookup from MomentumResult factors array */
function factorMap(r: MomentumResult) {
  const map = new Map<MomentumFactorId, { value: number; weight: number }>()
  for (const f of r.factors) map.set(f.id, { value: f.value, weight: f.weight })
  return map
}

export function diffMomentum(prev: MomentumResult, curr: MomentumResult, opts: DiffMomentumOptions = {}): MomentumDeltaSummary {
  const { minWeightedDelta = 0, magnitudeThresholds = { minor: 0.02, moderate: 0.06 } } = opts
  const p = factorMap(prev)
  const c = factorMap(curr)

  const factors: MomentumDeltaItem[] = []
  for (const id of c.keys()) {
    const prevEntry = p.get(id)
    const currEntry = c.get(id)
    if (!currEntry || !prevEntry) continue
    const delta = currEntry.value - prevEntry.value
    const weightedDelta = delta * currEntry.weight
    if (Math.abs(weightedDelta) < minWeightedDelta) continue
    let direction: 'up' | 'down' | 'flat'
    if (delta > 0.001) direction = 'up'
    else if (delta < -0.001) direction = 'down'
    else direction = 'flat'
    let magnitude: MomentumDeltaItem['magnitude'] = 'minor'
    const abs = Math.abs(delta)
    if (abs >= magnitudeThresholds.moderate) magnitude = 'major'
    else if (abs >= magnitudeThresholds.minor) magnitude = 'moderate'
    factors.push({ id, prev: prevEntry.value, curr: currEntry.value, delta, weight: currEntry.weight, weightedDelta, direction, magnitude })
  }

  // Sort by absolute weighted impact descending
  factors.sort((a, b) => Math.abs(b.weightedDelta) - Math.abs(a.weightedDelta))
  const biggestPositive = factors.find(f => f.weightedDelta > 0)
  const biggestNegative = factors.find(f => f.weightedDelta < 0)

  return {
    scorePrev: prev.score,
    scoreCurr: curr.score,
    scoreDelta: curr.score - prev.score,
    factors,
    biggestPositive,
    biggestNegative
  }
}
