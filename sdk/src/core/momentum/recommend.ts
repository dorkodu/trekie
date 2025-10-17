import { explainMomentum } from './explain'
import type { MomentumBuiltInFactorId, MomentumResult } from './types'

export type MomentumReasonCode =
  | 'CONSISTENCY_STRONG'
  | 'CONSISTENCY_WEAK'
  | 'HABITS_STRONG'
  | 'HABITS_WEAK'
  | 'TASKS_STRONG'
  | 'TASKS_WEAK'
  | 'TREND_UP'
  | 'TREND_DOWN'
  | 'FOCUS_STRONG'
  | 'FOCUS_WEAK'
  | 'RECOVERY_ACTIVE'
  | 'RISK_STATE'
  | 'LOW_COVERAGE_DATA'
  | 'GAP_DECAY_ACTIVE'

export interface MomentumRecommendation {
  code: MomentumReasonCode
  title: string
  detail: string
  /** Optional quick action hints (verb phrases) */
  actions?: string[]
  factor?: MomentumBuiltInFactorId
  priority: 'high' | 'medium' | 'low'
}

export interface RecommendationOptions {
  /** Limit number of returned recommendations (default 5) */
  limit?: number
}

export function recommendMomentumActions(result: MomentumResult, opts: RecommendationOptions = {}): MomentumRecommendation[] {
  const { limit = 5 } = opts
  const explanation = explainMomentum(result)
  const recs: MomentumRecommendation[] = []

  for (const f of explanation.factors) {
    if (f.strength === 'strong') {
      if (f.id === 'consistency') recs.push({ code: 'CONSISTENCY_STRONG', title: 'Consistency Solid', detail: 'You are reliably completing days—maintain this cadence.', actions: ['Plan tomorrow early'], factor: 'consistency', priority: 'low' })
      if (f.id === 'habits') recs.push({ code: 'HABITS_STRONG', title: 'Habit Targets Locked', detail: 'Daily habit targets are being met; consider gentle overage occasionally for adaptation.', actions: ['Add small stretch goal'], factor: 'habits', priority: 'low' })
      if (f.id === 'tasks') recs.push({ code: 'TASKS_STRONG', title: 'Tasks Aligned', detail: 'Planned vs completed tasks balanced; maintain planning realism.', actions: ['Pre-plan next day tasks'], factor: 'tasks', priority: 'low' })
      if (f.id === 'trend' && result.trend.direction === 'up') recs.push({ code: 'TREND_UP', title: 'Acceleration Detected', detail: 'Recent days are outperforming your prior baseline—protect this streak with recovery pacing.', actions: ['Schedule short recovery block'], factor: 'trend', priority: 'medium' })
      if (f.id === 'focus') recs.push({ code: 'FOCUS_STRONG', title: 'Depth Sessions Effective', detail: 'Deep focus time is solid; ensure breaks preserve quality.', actions: ['Block next deep session'], factor: 'focus', priority: 'low' })
    } else if (f.strength === 'weak') {
      if (f.id === 'consistency') recs.push({ code: 'CONSISTENCY_WEAK', title: 'Inconsistent Days', detail: 'Missed or partial days reduce baseline momentum.', actions: ['Finish one anchor habit early'], factor: 'consistency', priority: 'high' })
      if (f.id === 'habits') recs.push({ code: 'HABITS_WEAK', title: 'Habit Targets Missed', detail: 'Unreached habit targets are the fastest fix—close the loop today.', actions: ['Shrink target temporarily', 'Set reminder prompt'], factor: 'habits', priority: 'high' })
      if (f.id === 'tasks') recs.push({ code: 'TASKS_WEAK', title: 'Task Execution Gap', detail: 'Task coverage low; reduce overplanning or secure focused completion blocks.', actions: ['Reduce tomorrow planned count', 'Timebox task batch'], factor: 'tasks', priority: 'medium' })
      if (f.id === 'trend') recs.push({ code: 'TREND_DOWN', title: 'Negative Trend', detail: 'Momentum sliding; stack 2 modestly positive days to reverse.', actions: ['Pick a 30‑min quick win', 'Log a deep block'], factor: 'trend', priority: 'high' })
      if (f.id === 'focus') recs.push({ code: 'FOCUS_WEAK', title: 'Low Deep Focus', detail: 'Shallow sessions reduce compounding effect of depth.', actions: ['Schedule a 50‑min distraction-free block'], factor: 'focus', priority: 'medium' })
    }
  }

  if (result.states.recovery) {
    recs.push({ code: 'RECOVERY_ACTIVE', title: 'Recovery Underway', detail: 'Momentum rebound detected—stabilize routine to sustain climb.', actions: ['Protect current wake time'], priority: 'medium' })
  }
  if (result.states.risk) {
    recs.push({ code: 'RISK_STATE', title: 'Momentum At Risk', detail: 'Multiple erosion signals—secure a small win today to halt slide.', actions: ['Complete smallest habit now', 'Plan one deep session'], priority: 'high' })
  }

  // Coverage-based recommendation
  if (result.coverage && result.coverage.ratio < 0.8) {
    recs.push({ code: 'LOW_COVERAGE_DATA', title: 'Incomplete Data', detail: 'Some factors missing or imputed—log habits, tasks, and focus blocks for higher confidence.', actions: ['Log today\'s habits', 'Add planned tasks', 'Track a deep block'], priority: result.coverage.ratio < 0.5 ? 'high' : 'medium' })
  }

  // Gap decay suggestion (actual decay applied)
  if (result.decayEvents && result.decayEvents.length > 0) {
    recs.push({ code: 'GAP_DECAY_ACTIVE', title: 'Inactivity Cooling', detail: 'Momentum cooled during a gap—log a small win to reheat the baseline.', actions: ['Complete anchor habit', 'Schedule a 30m focus block'], priority: 'medium' })
  }

  // Deduplicate by code and sort by priority then by factor weakness contribution (approx using ordering strong/weak list)
  const seen = new Set<string>()
  const ordered = recs.filter(r => {
    if (seen.has(r.code)) return false
    seen.add(r.code)
    return true
  })

  const priorityRank = { high: 0, medium: 1, low: 2 }
  ordered.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])

  return ordered.slice(0, limit)
}
