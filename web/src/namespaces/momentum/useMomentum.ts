import type { MomentumSnapshot } from "./model";
import { isSnapshotCalibrating } from "./model";

export interface UseMomentumOptions {
  windowDays?: number;
  persist?: boolean;
}

export interface UseMomentumResult {
  data?: MomentumSnapshot;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  calibrating: boolean;
}

const PLACEHOLDER_SNAPSHOT: MomentumSnapshot = {
  score: 0,
  raw: 0,
  trend: 0,
  trendLabel: "Stable",
  trendDirection: "flat",
  states: {
    recovery: false,
    risk: false
  },
  bands: {
    current: {
      label: "Fragile",
      range: "0-25",
      slug: "meltdown"
    },
    label: "Fragile",
    slug: "meltdown",
    range: "0-25"
  },
  coverage: undefined,
  confidence: undefined,
  imputedFactors: [],
  gaps: undefined,
  decayEvents: [],
  factors: [],
  history: [],
  explanation: {
    score: 0,
    summary: "Collecting baseline data.",
    factors: [],
    positives: [],
    negatives: [],
    topFactors: [],
    weakFactors: [],
    recommendations: []
  }
};

export function createPlaceholderMomentumSnapshot(): MomentumSnapshot {
  return { ...PLACEHOLDER_SNAPSHOT };
}

export function useMomentum(_options?: UseMomentumOptions): UseMomentumResult {
  void _options;
  const snapshot = PLACEHOLDER_SNAPSHOT;
  const calibrating = isSnapshotCalibrating(snapshot);
  const refetch = () => undefined;

  return {
    data: snapshot,
    isLoading: false,
    isError: false,
    refetch,
    calibrating
  };
}

export function useMomentumHistory(): [] {
  return [];
}

export default useMomentum;
