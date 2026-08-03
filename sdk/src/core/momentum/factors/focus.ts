import { DEFAULT_WEIGHTS, MOMENTUM_NEUTRAL_VALUES } from "../constants";
import { average, clamp } from "../utils";
import type { MomentumFactorComputeResult, MomentumFactorContext, MomentumFactorDefinition } from "./base";

interface FocusExtras {
  daysWithFocus: number;
  averageBlockScore: number;
}

function computeFocus(context: MomentumFactorContext<undefined>): MomentumFactorComputeResult<FocusExtras> {
  const { days, windowDays } = context;
  const windowSlice = days.slice(-windowDays);
  let observedDays = 0;

  const scores = windowSlice.map(day => {
    if (!day.focus) return 0;
    observedDays++;
    const blockScore = day.focus.deepBlocks.reduce((acc, block) => acc + Math.log2(1 + block.minutes / 25), 0);
    return blockScore;
  });

  const rawAverage = average(scores);
  const windowNormalizationFactor = 5;
  const continuityBonus = consecutiveFocusDays(days) >= 3 ? 0.05 : 0;
  const value = clamp(0, (rawAverage / windowNormalizationFactor) + continuityBonus, 1);

  return {
    value,
    observed: observedDays > 0,
    extras: {
      daysWithFocus: observedDays,
      averageBlockScore: rawAverage
    }
  };
}

function consecutiveFocusDays(days: ReadonlyArray<{ focus?: { deepBlocks: Array<{ minutes: number }> } }>): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (!day) break;
    if (day.focus && day.focus.deepBlocks.length > 0) streak++;
    else break;
  }
  return streak;
}

export function momentumFocus(): MomentumFactorDefinition<undefined, FocusExtras> {
  return {
    id: "focus",
    label: "Focus",
    defaultWeight: DEFAULT_WEIGHTS.focus,
    neutralValue: MOMENTUM_NEUTRAL_VALUES.focus,
    requiredDomains: ["focus"],
    compute: computeFocus
  };
}
