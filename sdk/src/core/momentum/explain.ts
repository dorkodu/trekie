import type { MomentumBuiltInFactorId, MomentumFactorId, MomentumResult } from './types'

export interface MomentumExplanationOptions {
  /** Minimum weight*impact below which we hide a factor (default 0 => show all) */
  minContribution?: number
  /** Return numeric contribution deltas (value * weight) */
  includeContributions?: boolean
  /** Provide a custom rounding function, defaults to (n)=>Number(n.toFixed(2)) */
  round?: (n: number) => number
}

export interface FactorExplanation {
  id: MomentumFactorId
  label: string
  value: number
  weight: number
  contribution: number
  strength: 'strong' | 'neutral' | 'weak'
  message: string
}

export interface MomentumExplanation {
  score: number
  factors: FactorExplanation[]
  positives: FactorExplanation[]
  negatives: FactorExplanation[]
  summary: string
}

const FACTOR_LABEL: Record<MomentumBuiltInFactorId, string> = {
  consistency: 'Consistency',
  habits: 'Habits',
  tasks: 'Tasks',
  trend: 'Trend',
  focus: 'Focus Depth'
}

/** Simple qualitative buckets for a raw 0..1 factor value */
function classifyValue(v: number): 'strong' | 'neutral' | 'weak' {
  if (v >= 0.7) return 'strong'
  if (v >= 0.4) return 'neutral'
  return 'weak'
}

function buildMessage(id: MomentumFactorId, value: number, _weight: number, strength: FactorExplanation['strength'], label: string): string {
  const pct = Math.round(value * 100)
  switch (id) {
    case 'consistency':
      if (strength === 'strong') return `Showing up reliably (${pct}% of recent target presence).`
      if (strength === 'neutral') return `Moderate day completion; locking targets would raise reliability.`
      return `Low daily completion—finish core habits to lift baseline.`
    case 'habits':
      if (strength === 'strong') return `Habit targets met with healthy adherence.`
      if (strength === 'neutral') return `Some habit progress; push to full target for a bigger boost.`
      return `Habit target misses are dragging score—prioritize finishing planned units.`
    case 'tasks':
      if (strength === 'strong') return `Planned tasks executed with meaningful coverage.`
      if (strength === 'neutral') return `Partial task coverage; refine planning accuracy.`
      return `Task execution gap—reduce overplanning or complete more planned tasks.`
    case 'trend':
      if (strength === 'strong') return `Momentum accelerating vs prior period.`
      if (strength === 'neutral') return `Flat trend—two focused days can flip this upward.`
      return `Downward trend—stabilize with small, consistent wins.`
    case 'focus':
      if (strength === 'strong') return `Solid deep focus minutes—protect this habit.`
      if (strength === 'neutral') return `Some focus depth—one longer block would strengthen it.`
      return `Shallow focus—schedule a protected deep block (45–60m).`
    default:
      if (strength === 'strong') return `${label} performing strongly—keep the streak going.`
      if (strength === 'neutral') return `${label} holding steady; small pushes could elevate it.`
      return `${label} underperforming—identify quick wins to lift it.`
  }
}

/**
 * Generate human-readable explanations for a MomentumResult.
 * The contribution is value * weight (0..1) representing its share of the composite.
 */
export function explainMomentum(result: MomentumResult, opts: MomentumExplanationOptions = {}): MomentumExplanation {
  const { minContribution = 0, includeContributions = true, round = (n: number) => Number(n.toFixed(2)) } = opts

  const imputedSet = new Set(result.imputedFactors || [])
  const explanations: FactorExplanation[] = result.factors
    .map(summary => {
      const baseLabel = FACTOR_LABEL[summary.id as MomentumBuiltInFactorId] ?? summary.label ?? summary.id
      const label = baseLabel + (imputedSet.has(summary.id) ? ' (imputed)' : '')
      const contribution = summary.weight * summary.value
      if (contribution < minContribution) return null
      const strength = classifyValue(summary.value)
      return {
        id: summary.id,
        label,
        value: round(summary.value),
        weight: round(summary.weight),
        contribution: round(contribution),
        strength,
        message: buildMessage(summary.id, summary.value, summary.weight, strength, baseLabel)
      }
    })
    .filter((x): x is FactorExplanation => !!x)

  // Sort by contribution descending for presentation
  explanations.sort((a, b) => b.contribution - a.contribution)

  const positives = explanations.filter(e => e.strength === 'strong')
  const negatives = explanations.filter(e => e.strength === 'weak')

  const primaryWeak = negatives[0]
  const primaryStrong = positives[0]
  let summary: string
  if (primaryStrong && primaryWeak) {
    summary = `${primaryStrong.label} strong; biggest lift opportunity: ${primaryWeak.label}.`
  } else if (primaryStrong) {
    summary = `${primaryStrong.label} leading; maintain while lifting secondary areas.`
  } else if (primaryWeak) {
    summary = `${primaryWeak.label} weakest—focus there for fastest improvement.`
  } else {
    summary = 'Balanced neutral profile—small improvements everywhere will compound.'
  }

  if (!includeContributions) {
    for (const e of explanations) {
      e.contribution = 0
    }
  }

  return {
    score: result.score,
    factors: explanations,
    positives,
    negatives,
    summary
  }
}

/** Convenience helper that returns a short narrative paragraph */
export function summarizeMomentum(result: MomentumResult) {
  const e = explainMomentum(result, { minContribution: 0 })
  const trend = result.trend.label.toLowerCase()
  return `Momentum ${result.score} (${trend}). ${e.summary}`
}
