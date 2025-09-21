/** Momentum library public and internal types */

export interface MomentumInputDay {
  day: string // ISO day YYYY-MM-DD
  habits?: HabitDayStats
  tasks?: TaskDayStats
  focus?: FocusDayStats
  xp?: XpDayStats
  // compositeDailyRaw (pre-normalization) can be optionally supplied for historical windows
  compositeRawOverride?: number
}

export interface HabitDayStats {
  target: number
  count: number
  reached: boolean
}

export interface TaskDayStats {
  planned: PlannedTaskItem[]
  completed: CompletedTaskItem[]
  microTaskCount: number
}

export interface PlannedTaskItem {
  importance: ImportanceLevel
}
export interface CompletedTaskItem {
  importance: ImportanceLevel
}

export type ImportanceLevel = 'trivial' | 'normal' | 'important' | 'critical'

export interface FocusDayStats {
  deepBlocks: DeepBlock[] // each block has duration in minutes
}

export interface DeepBlock {
  minutes: number
  // optional classification fields (future)
}

export interface XpDayStats {
  xpGained: number
}

export interface MomentumCalculationOptions {
  windowDays?: number // default 10
  trendShortWindow?: number // default 3
  trendPrevWindow?: number // default 7 (previous segment)
  emaAlpha?: number // default 0.35
  activityThreshold?: ActivityThreshold // minimal actions design
  nowDay?: string // override current day (ISO)
}

export interface ActivityThreshold {
  minActions?: number // minimal combined meaningful actions to count as active
  // domain-specific minimal criteria could be added later
}

export interface MomentumFactorValuesRaw {
  consistency: number
  habits: number
  tasks: number
  trend: number
  focus: number
}

export interface MomentumWeights {
  consistency: number
  habits: number
  tasks: number
  trend: number
  focus: number
}

export interface MomentumResult {
  score: number // 0-100 scaled
  raw: number // 0-1 composite pre-scale (smoothed)
  factors: { key: keyof MomentumFactorValuesRaw, weight: number, value: number }[]
  trend: MomentumTrend
  bands: MomentumBand
  states: MomentumStates
  history: MomentumDailyPoint[]
  missingDomains?: MissingDomains
  /** Data coverage metrics about factor availability */
  coverage?: MomentumCoverage
  /** Neutral-imputed factor keys */
  imputedFactors?: (keyof MomentumFactorValuesRaw)[]
  /** Confidence derived from coverage (monotonic) */
  confidence?: number
  /** Gap metrics (day gaps >1) */
  gaps?: MomentumGapInfo
  /** Decay events applied during smoothing (if gap decay enabled) */
  decayEvents?: DecayEvent[]
}

export interface MomentumDailyPoint {
  day: string
  raw: number // raw composite (unsmoothed) for that day
  score: number // scaled 0-100 of raw (no smoothing retroactively)
}

export interface MomentumTrend {
  direction: 'up' | 'flat' | 'down'
  label: 'Accelerating' | 'Stable' | 'Slowing'
  deltaPct: number // ratio used
}

export interface MomentumBand {
  range: string
  label: 'Fragile' | 'Building' | 'Strong' | 'Peak'
}

export interface MomentumStates {
  recovery: boolean
  risk: boolean
}

export interface MomentumEngineConfig {
  weights: MomentumWeights
  options: Required<MomentumCalculationOptions>
}

export interface MomentumComputeContext extends MomentumEngineConfig {
  days: MomentumInputDay[]
  sortedDays: MomentumInputDay[]
}

export type MissingDomains = Partial<Record<keyof MomentumFactorValuesRaw, true>>

export interface MomentumCoverage {
  expected: number // total expected (excluding virtual like trend?)
  observed: number // with actual data
  imputed: number // neutral filled
  ratio: number // observed/expected
  effectiveRatio: number // (observed + imputed)/expected (normally 1 if every missing imputed)
}

export interface MomentumGapInfo {
  largestGapDays: number
  recentGapDays?: number // gap immediately preceding the latest day
  gapEvents: { from: string, to: string, days: number }[]
}

export interface DecayEvent {
  index: number // day index in sorted array where decay applied before ingesting value
  gapDays: number // number of missing calendar days preceding this point
  before: number // EMA value before decay
  after: number // EMA value after decay (pre-EMA update)
}
