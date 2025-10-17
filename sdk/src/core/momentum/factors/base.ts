import type { MomentumCalculationOptions, MomentumInputDay } from "../types";

export interface MomentumFactorContext<TMeta = undefined> {
  days: MomentumInputDay[];
  windowDays: number;
  /**
   * Effective weights map after missing-domain adjustments.
   * Useful if a factor wants to inspect peer weights.
   */
  weights: Record<string, number>;
  /** Engine options resolved for this computation. */
  options: Required<MomentumCalculationOptions>;
  /**
   * Arbitrary shared metadata bag composed by other factors or the engine.
   * This lets factors collaborate without tight coupling.
   */
  meta: TMeta;
}

export interface MomentumFactorComputeResult<TExtras = unknown> {
  /** Raw 0..1 value produced by the factor. */
  value: number;
  /**
   * Whether the factor observed data in the provided window.
   * Controls coverage metrics and imputation.
   */
  observed: boolean;
  /** Optional diagnostics that can be surfaced in explanations. */
  extras?: TExtras;
}

export interface MomentumFactorHooks<TMeta = undefined, TExtras = unknown> {
  /**
   * Runs after the factor computed its value.
   * Can mutate meta/extras for downstream consumers.
   */
  afterCompute?: (args: {
    context: MomentumFactorContext<TMeta>;
    result: MomentumFactorComputeResult<TExtras>;
  }) => void;
}

export interface MomentumFactorDefinition<TMeta = undefined, TExtras = unknown> {
  /** Unique identifier used in result map and neutral lookup. */
  id: string;
  /** Display label for explanations. */
  label: string;
  /** Default weight to apply when composing the total. */
  defaultWeight: number;
  /** Neutral fallback when data is missing and strategy uses imputation. */
  neutralValue?: number;
  /** Domains required for the factor to produce observed=true. */
  requiredDomains?: Array<keyof MomentumInputDay>;
  /**
   * Core compute method invoked with sorted days limited to windowDays.
   */
  compute: (context: MomentumFactorContext<TMeta>) => MomentumFactorComputeResult<TExtras>;
  hooks?: MomentumFactorHooks<TMeta, TExtras>;
}

export type MomentumFactorRegistry<TMeta = undefined> = Array<MomentumFactorDefinition<TMeta, any>>;
