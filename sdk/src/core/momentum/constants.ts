/** Constants and default config for Momentum */
import type { MomentumCalculationOptions, MomentumWeights } from './types'

export const DEFAULT_WEIGHTS: MomentumWeights = {
  consistency: 0.30,
  habits: 0.25,
  tasks: 0.20,
  trend: 0.15,
  focus: 0.10,
}

export const DEFAULT_OPTIONS: Required<MomentumCalculationOptions> = {
  windowDays: 10,
  trendShortWindow: 3,
  trendPrevWindow: 7,
  emaAlpha: 0.35,
  activityThreshold: { minActions: 1 },
  nowDay: undefined as unknown as string, // will be replaced runtime if missing
}

export const IMPORTANCE_WEIGHTS = {
  trivial: 0.25,
  normal: 1,
  important: 1.25,
  critical: 1.5,
} as const

export const MAX_HABIT_EXCESS_BONUS = 0.2
export const MAX_STREAK_BONUS = 0.1
export const MAX_VOID_PENALTY = 0.3

export const TREND_UP_CAP = 0.3
export const TREND_DOWN_CAP = -0.3

export const BANDS = [
  { min: 0, max: 0.39, range: '0-39', label: 'Fragile' as const },
  { min: 0.40, max: 0.69, range: '40-69', label: 'Building' as const },
  { min: 0.70, max: 0.85, range: '70-85', label: 'Strong' as const },
  { min: 0.86, max: 1, range: '86-100', label: 'Peak' as const },
]

/** Missing data handling strategy configuration */
export type MomentumMissingStrategy = 'neutral-impute' | 'reweight' | 'hybrid'

/** Default neutral values per factor (0..1) used when imputing missing domains */
export const MOMENTUM_NEUTRAL_VALUES = {
  consistency: 0.6,
  habits: 0.5,
  tasks: 0.55,
  trend: 0.5,
  focus: 0.5,
} as const

/** Global missing strategy (can later be surfaced as engine init option) */
export const MOMENTUM_MISSING_STRATEGY: MomentumMissingStrategy = 'neutral-impute'

/** Gap decay configuration for multi-day inactivity smoothing */
export const MOMENTUM_GAP_DECAY = {
  enabled: true,
  halfLifeDays: 7, // after ~7 days of no data EMA drifts halfway toward neutral
  minGapDays: 1, // minimal missing day count to trigger decay (1 => any gap)
  neutralStrategy: 'fixed' as 'fixed' | 'weighted', // how to derive neutral composite
  fixedNeutralValue: 0.5, // used if neutralStrategy==='fixed'
}

/** Coverage thresholds for UI coloring / reason codes */
export const MOMENTUM_COVERAGE_THRESHOLDS = {
  warn: 0.8,
  low: 0.5,
}
