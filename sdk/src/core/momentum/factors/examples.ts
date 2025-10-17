import type { MomentumFactorDefinition } from "./base";
import { createDefaultMomentumFactors } from "./defaults";

/**
 * Demo factor turning recent XP gain into an "energy" signal.
 * Useful as a reference when crafting custom factor plugins.
 */
export function momentumEnergy(): MomentumFactorDefinition<undefined, { averageXp: number }> {
  return {
    id: "energy",
    label: "Energy",
    defaultWeight: 0.08,
    neutralValue: 0.5,
    requiredDomains: ["xp"],
    compute: ({ days, windowDays }) => {
      const window = days.slice(-windowDays);
      const observed = window.some(day => (day.xp?.xpGained ?? 0) > 0);
      const totalXp = window.reduce((sum, day) => sum + (day.xp?.xpGained ?? 0), 0);
      const averageXp = window.length ? totalXp / window.length : 0;
      const maxExpected = 120; // heuristically assume 120 xp/day marks a strong outcome
      const value = window.length ? Math.min(1, averageXp / maxExpected) : 0;
      return { value, observed, extras: { averageXp } };
    }
  };
}

/**
 * Demo factor combining deep-work duration with focus continuity.
 */
export function momentumCreativeFlow(): MomentumFactorDefinition<undefined, { avgMinutes: number; streak: number }> {
  return {
    id: "creativeFlow",
    label: "Creative Flow",
    defaultWeight: 0.07,
    neutralValue: 0.5,
    requiredDomains: ["focus"],
    compute: ({ days, windowDays }) => {
      const window = days.slice(-windowDays);
      let streak = 0;
      for (let i = days.length - 1; i >= 0; i--) {
        const entry = days[i];
        if (!entry?.focus || entry.focus.deepBlocks.length === 0) break;
        streak++;
      }
      const minutes = window.map(day => day.focus?.deepBlocks.reduce((sum, block) => sum + block.minutes, 0) ?? 0);
      const avgMinutes = window.length ? minutes.reduce((sum, v) => sum + v, 0) / window.length : 0;
      const normalized = Math.min(1, (avgMinutes / 120) + Math.min(0.1, streak * 0.02));
      const observed = window.some(day => (day.focus?.deepBlocks.length ?? 0) > 0);
      return { value: normalized, observed, extras: { avgMinutes, streak } };
    }
  };
}

/**
 * Helper to create a registry that includes the default factors plus the sample ones above.
 */
export function createMomentumFactorsWithExamples() {
  return [
    ...createDefaultMomentumFactors(),
    momentumEnergy(),
    momentumCreativeFlow()
  ];
}
