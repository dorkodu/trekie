import type { MomentumFactorRegistry } from "./base";
import { momentumConsistency } from "./consistency";
import { momentumFocus } from "./focus";
import { momentumHabits } from "./habits";
import { momentumTasks } from "./tasks";

export function createDefaultMomentumFactors(): MomentumFactorRegistry {
  return [
    momentumConsistency(),
    momentumHabits(),
    momentumTasks(),
    momentumFocus()
  ];
}
