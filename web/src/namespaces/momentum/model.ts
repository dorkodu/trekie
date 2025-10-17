import type { GameState } from "@sdk/core/game";
import type {
  DecayEvent,
  MissingDomains,
  MomentumBand,
  MomentumCoverage,
  MomentumDailyPoint,
  MomentumFactorValuesRaw,
  MomentumGapInfo,
  MomentumInputDay,
  MomentumResult,
  MomentumStates,
  MomentumTrend
} from "@sdk/core/momentum";
import { createMomentumEngine, createMomentumEngineWithDefaults, explainMomentum, recommendMomentumActions } from "@sdk/core/momentum";
import { computeMomentumFromGame, computeMomentumFromGameState } from "@sdk/core/momentum/compute";
import type { MomentumExplanation } from "@sdk/core/momentum/explain";
import type { MomentumRecommendation } from "@sdk/core/momentum/recommend";

export type MomentumBandSlug = "meltdown" | "recovery" | "neutral" | "building" | "momentum";

export interface MomentumBandSnapshot {
  label: string;
  range: string;
  slug: MomentumBandSlug;
}

export interface MomentumHistoryPoint {
  day: string;
  score: number;
  raw: number;
}

export interface MomentumExplanationSnapshot extends MomentumExplanation {
  topFactors: MomentumExplanation["factors"];
  weakFactors: MomentumExplanation["factors"];
  recommendations: MomentumRecommendation[];
}

export interface MomentumSnapshot {
  score: number;
  raw: number;
  trend: number;
  trendLabel: MomentumTrend["label"];
  trendDirection: MomentumTrend["direction"];
  states: MomentumStates;
  bands: {
    current: MomentumBandSnapshot;
    label: string;
    slug: MomentumBandSlug;
    range: string;
  };
  coverage?: MomentumCoverage;
  confidence?: number;
  imputedFactors?: (keyof MomentumFactorValuesRaw)[];
  missingDomains?: MissingDomains;
  gaps?: MomentumGapInfo;
  decayEvents?: DecayEvent[];
  factors: MomentumExplanation["factors"];
  history: MomentumHistoryPoint[];
  explanation: MomentumExplanationSnapshot;
}

export interface MomentumComputationParams {
  xpHistory: Record<string, number>;
  dailyTarget: number;
  windowDays?: number;
}

type MomentumEngineInit = Parameters<typeof createMomentumEngine>[0];
type MomentumEngineDefaultsInit = Parameters<typeof createMomentumEngineWithDefaults>[0];

const BAND_LABEL_TO_SLUG: Record<MomentumBand["label"], MomentumBandSlug> = {
  Fragile: "meltdown",
  Building: "building",
  Strong: "momentum",
  Peak: "momentum"
};

function mapBand(result: MomentumResult): MomentumBandSnapshot {
  const baseSlug = BAND_LABEL_TO_SLUG[result.bands.label] ?? "neutral";
  const slug: MomentumBandSlug = result.states.recovery ? "recovery" : baseSlug;
  return {
    label: result.bands.label,
    range: result.bands.range,
    slug
  };
}

function mapHistory(history: MomentumDailyPoint[]): MomentumHistoryPoint[] {
  return history.map(point => ({
    day: point.day,
    score: point.score,
    raw: point.raw
  }));
}

function buildExplanation(result: MomentumResult): MomentumExplanationSnapshot {
  const baseExplanation = explainMomentum(result, { minContribution: 0 });
  const recommendations = recommendMomentumActions(result);

  return {
    ...baseExplanation,
    topFactors: baseExplanation.positives.slice(0, 5),
    weakFactors: baseExplanation.negatives.slice(0, 5),
    recommendations
  };
}

export function mapMomentumResultToSnapshot(result: MomentumResult): MomentumSnapshot {
  const band = mapBand(result);
  const explanation = buildExplanation(result);

  return {
    score: result.score,
    raw: result.raw,
    trend: result.trend.deltaPct,
    trendLabel: result.trend.label,
    trendDirection: result.trend.direction,
    states: result.states,
    bands: {
      current: band,
      label: band.label,
      slug: band.slug,
      range: band.range
    },
    coverage: result.coverage,
    confidence: result.confidence,
    missingDomains: result.missingDomains,
    imputedFactors: result.imputedFactors,
    gaps: result.gaps,
    decayEvents: result.decayEvents,
    factors: explanation.factors,
    history: mapHistory(result.history),
    explanation
  };
}

export function computeMomentumSnapshot(params: MomentumComputationParams): MomentumSnapshot {
  const result = computeMomentumFromGame(params);
  return mapMomentumResultToSnapshot(result);
}

export function computeMomentumSnapshotFromState(state: Pick<GameState, "xpHistory" | "dailyTarget">, windowDays = 10): MomentumSnapshot {
  const result = computeMomentumFromGameState(state, windowDays);
  return mapMomentumResultToSnapshot(result);
}

export function computeMomentumSnapshotFromInputDays(
  days: MomentumInputDay[],
  init?: MomentumEngineInit | MomentumEngineDefaultsInit
): MomentumSnapshot {
  const engine = init && "factors" in init
    ? createMomentumEngine(init)
    : createMomentumEngineWithDefaults(init);
  const result = engine.compute(days);
  return mapMomentumResultToSnapshot(result);
}

export function isMomentumCalibrating(result: MomentumResult): boolean {
  if (result.history.length < 3) return true;
  if (result.coverage && result.coverage.observed < Math.min(3, result.coverage.expected)) return true;
  return false;
}

export function isSnapshotCalibrating(snapshot: MomentumSnapshot): boolean {
  if (snapshot.history.length < 3) return true;
  const coverageRatio = snapshot.coverage?.observed && snapshot.coverage?.expected
    ? snapshot.coverage.observed / snapshot.coverage.expected
    : undefined;
  if (coverageRatio !== undefined && coverageRatio < 0.3) return true;
  return false;
}
