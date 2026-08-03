import { DEFAULT_WEIGHTS, MAX_HABIT_EXCESS_BONUS, MOMENTUM_NEUTRAL_VALUES } from "../constants";
import { average, clamp } from "../utils";
import type { MomentumFactorComputeResult, MomentumFactorContext, MomentumFactorDefinition } from "./base";

interface HabitsExtras {
  daysWithHabits: number;
  averageScore: number;
}

function computeHabits(context: MomentumFactorContext<undefined>): MomentumFactorComputeResult<HabitsExtras> {
  const { days, windowDays } = context;
  const windowSlice = days.slice(-windowDays);
  let observedDays = 0;

  const scores = windowSlice.map(day => {
    if (!day.habits) return 0;
    observedDays++;
    const { target, count, reached } = day.habits;
    if (target <= 0) return 0;
    const daySuccess = reached ? 1 : 0;
    const excess = count > target ? clamp(0, (count - target) / target, MAX_HABIT_EXCESS_BONUS) : 0;
    return clamp(0, daySuccess + excess, 1);
  });

  const averageScore = clamp(0, average(scores), 1);

  return {
    value: averageScore,
    observed: observedDays > 0,
    extras: {
      daysWithHabits: observedDays,
      averageScore
    }
  };
}

export function momentumHabits(): MomentumFactorDefinition<undefined, HabitsExtras> {
  return {
    id: "habits",
    label: "Habits",
    defaultWeight: DEFAULT_WEIGHTS.habits,
    neutralValue: MOMENTUM_NEUTRAL_VALUES.habits,
    requiredDomains: ["habits"],
    compute: computeHabits
  };
}
