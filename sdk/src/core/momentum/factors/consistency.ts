import { DEFAULT_WEIGHTS, MAX_STREAK_BONUS, MAX_VOID_PENALTY, MOMENTUM_NEUTRAL_VALUES } from "../constants";
import type { MomentumCalculationOptions, MomentumInputDay } from "../types";
import { clamp } from "../utils";
import type { MomentumFactorComputeResult, MomentumFactorContext, MomentumFactorDefinition } from "./base";

interface ConsistencyExtras {
  activeDays: number;
  zeroStreak: number;
  streak: number;
}

function isActiveDay(day: MomentumInputDay, options: Required<MomentumCalculationOptions>) {
  let actions = 0;
  if (day.habits && (day.habits.count > 0 || day.habits.reached)) actions++;
  if (day.tasks && day.tasks.completed.length > 0) actions++;
  if (day.focus && day.focus.deepBlocks.length > 0) actions++;
  if (day.xp && day.xp.xpGained > 0) actions++;
  return actions >= (options.activityThreshold.minActions ?? 1);
}

function currentActiveStreak(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (!day) break;
    if (isActiveDay(day, options)) streak++;
    else break;
  }
  return streak;
}

function currentZeroStreak(days: MomentumInputDay[], options: Required<MomentumCalculationOptions>) {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (!day) break;
    if (!isActiveDay(day, options)) streak++;
    else break;
  }
  return streak;
}

function computeConsistency(context: MomentumFactorContext<undefined>): MomentumFactorComputeResult<ConsistencyExtras> {
  const { days, windowDays, options } = context;
  const windowSlice = days.slice(-windowDays);
  const active = windowSlice.filter(day => isActiveDay(day, options)).length;
  const base = windowDays > 0 ? active / windowDays : 0;
  const streak = currentActiveStreak(days, options);
  const streakBonus = clamp(0, (streak - 3) * 0.01, MAX_STREAK_BONUS);
  const zeroStreak = currentZeroStreak(days, options);
  const voidPenalty = 1 - clamp(0, zeroStreak * 0.07, MAX_VOID_PENALTY);
  const value = clamp(0, (base + streakBonus) * voidPenalty, 1);

  return {
    value,
    observed: windowSlice.length > 0,
    extras: {
      activeDays: active,
      zeroStreak,
      streak
    }
  };
}

export function momentumConsistency(): MomentumFactorDefinition<undefined, ConsistencyExtras> {
  return {
    id: "consistency",
    label: "Consistency",
    defaultWeight: DEFAULT_WEIGHTS.consistency,
    neutralValue: MOMENTUM_NEUTRAL_VALUES.consistency,
    compute: computeConsistency
  };
}
