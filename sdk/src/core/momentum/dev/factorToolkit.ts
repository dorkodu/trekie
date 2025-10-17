import { createMomentumEngine } from "../engine";
import type { MomentumFactorDefinition, MomentumFactorRegistry } from "../factors/index";
import { createDefaultMomentumFactors } from "../factors/index";
import type { MomentumCalculationOptions, MomentumFactorSummary, MomentumInputDay, MomentumWeights } from "../types";

export interface FactorPreviewOptions {
  weights?: Partial<MomentumWeights>;
  options?: Partial<MomentumCalculationOptions>;
  registry?: MomentumFactorRegistry;
}

export interface FactorPreviewResult {
  factor: MomentumFactorSummary;
  registrySize: number;
}

/**
 * Quickly evaluate a factor definition against sample days without wiring a full engine.
 */
export function previewFactor(
  factor: MomentumFactorDefinition,
  days: MomentumInputDay[],
  opts: FactorPreviewOptions = {}
): FactorPreviewResult {
  const registry = opts.registry ?? [...createDefaultMomentumFactors(), factor];
  const engine = createMomentumEngine({
    factors: registry,
    weights: opts.weights,
    options: opts.options,
  });
  const result = engine.compute(days);
  const summary = result.factors.find(f => f.id === factor.id);
  if (!summary) {
    throw new Error(`Factor ${factor.id} missing from engine output. Ensure ids are unique.`);
  }
  return { factor: summary, registrySize: registry.length };
}

export interface RegistryPreview {
  factors: MomentumFactorSummary[];
  score: number;
}

/**
 * Run an arbitrary registry against supplied days and return the raw factor summaries.
 */
export function previewRegistry(
  registry: MomentumFactorRegistry,
  days: MomentumInputDay[],
  opts: FactorPreviewOptions = {}
): RegistryPreview {
  const engine = createMomentumEngine({
    factors: registry,
    weights: opts.weights,
    options: opts.options,
  });
  const result = engine.compute(days);
  return { factors: result.factors, score: result.score };
}

/**
 * Tiny helper for building synthetic day records when experimenting with factor formulas.
 */
export function buildSyntheticDay(day: string, seed?: Partial<MomentumInputDay>): MomentumInputDay {
  return {
    day,
    habits: seed?.habits,
    tasks: seed?.tasks,
    focus: seed?.focus,
    xp: seed?.xp,
    compositeRawOverride: seed?.compositeRawOverride,
  };
}
