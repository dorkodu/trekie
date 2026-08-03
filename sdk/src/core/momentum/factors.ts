import { IMPORTANCE_WEIGHTS, MAX_HABIT_EXCESS_BONUS, MAX_STREAK_BONUS, MAX_VOID_PENALTY } from './constants'
import type { MomentumCalculationOptions, MomentumFactorValuesRaw, MomentumInputDay, MomentumWeights } from './types'
import { average, clamp, ratioNormalize, safeDiv } from './utils'

/** Compute raw factor scores (0-1 each) */
export function computeFactors(days: MomentumInputDay[], _weights: MomentumWeights, options: Required<MomentumCalculationOptions>): MomentumFactorValuesRaw {
  return {
    consistency: consistencyScore(days, options),
    habits: habitTargetScore(days, options),
    tasks: taskQualityScore(days, options),
    trend: 0, // placeholder – computed separately after we get composite raw history
    focus: focusDepthScore(days, options),
  }
}

function consistencyScore(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  const windowDays = options.windowDays
  const last = days.slice(-windowDays)

  // Define active day: any meaningful action across domains >= threshold
  const active = last.filter(d => isActiveDay(d, options)).length
  const base = active / windowDays

  // Streak & void penalties
  const streak = currentActiveStreak(days, options)
  const streakBonus = clamp(0, (streak - 3) * 0.01, MAX_STREAK_BONUS)
  const consecutiveZero = currentZeroStreak(days, options)
  const voidPenalty = 1 - clamp(0, consecutiveZero * 0.07, MAX_VOID_PENALTY)

  return clamp(0, (base + streakBonus) * voidPenalty, 1)
}

function isActiveDay(d: MomentumInputDay, options: Required<MomentumCalculationOptions>) {
  let actions = 0
  if (d.habits && (d.habits.count > 0 || d.habits.reached)) actions++
  if (d.tasks && (d.tasks.completed.length > 0)) actions++
  if (d.focus && d.focus.deepBlocks.length > 0) actions++
  if (d.xp && d.xp.xpGained > 0) actions++
  return actions >= (options.activityThreshold.minActions ?? 1)
}

function currentActiveStreak(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i]
    if (!day) break
    if (isActiveDay(day, options)) streak++
    else break
  }
  return streak
}

function currentZeroStreak(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i]
    if (!day) break
    if (!isActiveDay(day, options)) streak++
    else break
  }
  return streak
}

function habitTargetScore(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  const last = days.slice(-options.windowDays)
  const scores = last.map(d => {
    if (!d.habits) return 0
    const { target, count, reached } = d.habits
    if (target <= 0) return 0
    const daySuccess = reached ? 1 : 0
    const excess = count > target ? clamp(0, (count - target) / target, MAX_HABIT_EXCESS_BONUS) : 0
    return daySuccess + excess
  })
  return clamp(0, average(scores), 1)
}

function taskQualityScore(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  const last = days.slice(-options.windowDays)
  const coverageValues = last.map(d => {
    if (!d.tasks) return 0
    const plannedWeighted = d.tasks.planned.reduce((acc, t) => acc + IMPORTANCE_WEIGHTS[t.importance], 0)
    const completedWeighted = d.tasks.completed.reduce((acc, t) => acc + IMPORTANCE_WEIGHTS[t.importance], 0)

    const coverage = safeDiv(completedWeighted, Math.max(1, plannedWeighted))
    const spillPenalty = completedWeighted > plannedWeighted * 1.8 ? 0.9 : 1
    const diminishMicro = clamp(0, 1 - (d.tasks.microTaskCount * 0.02), 1)
    return clamp(0, coverage * spillPenalty * diminishMicro, 1)
  })
  return clamp(0, average(coverageValues), 1)
}

function focusDepthScore(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  const last = days.slice(-options.windowDays)
  const scores = last.map(d => {
    if (!d.focus) return 0
    const blockScore = d.focus.deepBlocks.reduce((acc, b) => acc + Math.log2(1 + b.minutes / 25), 0)
    return blockScore
  })
  const raw = average(scores)
  // Rough normalization factor guess: assume ~3 blocks of 50min -> log2(1+2)=~1.58 *3 ≈ 4.7
  const windowNormalizationFactor = 5
  const continuityBonus = consecutiveFocusDays(days) >= 3 ? 0.05 : 0
  return clamp(0, (raw / windowNormalizationFactor) + continuityBonus, 1)
}

function consecutiveFocusDays(days: MomentumInputDay[]) {
  let streak = 0
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i]
    if (!d) break
    if (d.focus && d.focus.deepBlocks.length > 0) streak++
    else break
  }
  return streak
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
