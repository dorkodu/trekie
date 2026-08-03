import { TREND_DOWN_CAP, TREND_UP_CAP } from './constants'
import type { MomentumWeights } from './types'

export function clamp(min: number, v: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export function ratioNormalize(x: number, upCap = TREND_UP_CAP, downCap = TREND_DOWN_CAP) {
  const clamped = clamp(downCap, x, upCap)
  return (clamped - downCap) / (upCap - downCap)
}

export function ema(previous: number | undefined, current: number, alpha: number) {
  if (previous == null) return current
  return alpha * current + (1 - alpha) * previous
}

export function safeDiv(a: number, b: number) {
  return b === 0 ? 0 : a / b
}

export function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function rollingWindow<T>(arr: T[], size: number): T[] {
  return arr.slice(-size)
}

export function dayKey(day: string) { return day }

export function reweight(weights: MomentumWeights, missing: (keyof MomentumWeights)[]): MomentumWeights {
  const availableEntries = Object.entries(weights).filter(([k]) => !missing.includes(k as keyof MomentumWeights))
  const total = availableEntries.reduce((acc, [, v]) => acc + v, 0)
  if (total === 0) return weights
  const scale = 1 / total
  const next: any = { ...weights }
  for (const [k, v] of availableEntries) next[k] = v * scale
  for (const m of missing) next[m] = 0
  return next as MomentumWeights
}
