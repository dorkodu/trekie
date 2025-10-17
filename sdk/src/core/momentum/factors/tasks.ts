import { DEFAULT_WEIGHTS, IMPORTANCE_WEIGHTS, MOMENTUM_NEUTRAL_VALUES } from "../constants";
import { average, clamp, safeDiv } from "../utils";
import type { MomentumFactorComputeResult, MomentumFactorContext, MomentumFactorDefinition } from "./base";

interface TasksExtras {
  daysWithTasks: number;
  averageCoverage: number;
}

function computeTasks(context: MomentumFactorContext<undefined>): MomentumFactorComputeResult<TasksExtras> {
  const { days, windowDays } = context;
  const windowSlice = days.slice(-windowDays);

  let observedDays = 0;
  const coverageValues = windowSlice.map(day => {
    if (!day.tasks) return 0;
    observedDays++;
    const plannedWeighted = day.tasks.planned.reduce((acc, task) => acc + IMPORTANCE_WEIGHTS[task.importance], 0);
    const completedWeighted = day.tasks.completed.reduce((acc, task) => acc + IMPORTANCE_WEIGHTS[task.importance], 0);

    const coverage = safeDiv(completedWeighted, Math.max(1, plannedWeighted));
    const spillPenalty = completedWeighted > plannedWeighted * 1.8 ? 0.9 : 1;
    const diminishMicro = clamp(0, 1 - (day.tasks.microTaskCount * 0.02), 1);
    return clamp(0, coverage * spillPenalty * diminishMicro, 1);
  });

  const averageCoverage = clamp(0, average(coverageValues), 1);

  return {
    value: averageCoverage,
    observed: observedDays > 0,
    extras: {
      daysWithTasks: observedDays,
      averageCoverage
    }
  };
}

export function momentumTasks(): MomentumFactorDefinition<undefined, TasksExtras> {
  return {
    id: "tasks",
    label: "Tasks",
    defaultWeight: DEFAULT_WEIGHTS.tasks,
    neutralValue: MOMENTUM_NEUTRAL_VALUES.tasks,
    requiredDomains: ["tasks"],
    compute: computeTasks
  };
}
