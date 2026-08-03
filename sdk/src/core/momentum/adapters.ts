import type { ICommitRecord } from '../commitments/schema'
import type { FocusDayStats, HabitDayStats, MomentumInputDay as InputDay, MomentumInputDay } from './types'
import { clamp } from './utils'

/**
 * Adapter utilities to build MomentumInputDay[] from existing Trekie domain data.
 * These are intentionally tolerant of partial data so feature can rollout incrementally.
 */

export interface HabitEntityLike {
  id: string
  commitmentId: string
  dailyTarget: number
  history: Map<string, number> | Record<string, number>
}

export interface CommitmentMetaLike {
  id: string
  kind: string
  lastActivity?: number
}

export interface CommitRecordLike extends Pick<ICommitRecord<any>, 'event' | 'kind' | 'instanceId' | 'timestamp' | 'data' | 'reward'> { }

export interface BuildMomentumDaysParams {
  habits?: HabitEntityLike[]
  commitRecords?: CommitRecordLike[]
  focusBlocks?: { day: string, minutes: number }[]
  days?: string[] // explicit day list; if absent derive from data
  windowDays?: number
}

/** Event name heuristics */
const HABIT_COUNT_EVENTS = new Set(['COUNT_UP', 'COUNT_DOWN'])
const HABIT_DAILYCHECK_EVENTS = new Set(['DAILYCHECK'])

export function buildMomentumDays(params: BuildMomentumDaysParams): MomentumInputDay[] {
  const { habits = [], commitRecords = [], focusBlocks = [], windowDays = 10 } = params
  let allDays = params.days ?? deriveDays(commitRecords, habits, focusBlocks, windowDays)
  allDays = allDays.sort()

  // Index habits by both id and commitmentId to be resilient to instanceId semantics
  const habitById = new Map<string, HabitEntityLike>()
  const habitByCommitmentId = new Map<string, HabitEntityLike>()
  for (const h of habits) { habitById.set(h.id, h); habitByCommitmentId.set(h.commitmentId, h) }

  // Aggregate focus by day
  const focusByDay = new Map<string, FocusDayStats>()
  for (const fb of focusBlocks) {
    const existing = focusByDay.get(fb.day) || { deepBlocks: [] }
    existing.deepBlocks.push({ minutes: fb.minutes })
    focusByDay.set(fb.day, existing)
  }

  // First pass: gather event-based counts, daily-check flags, and XP aggregation
  const eventCountByDayHabit = new Map<string, Map<string, number>>() // day -> habitId -> delta count
  const dailyCheckByDayHabit = new Map<string, Set<string>>() // day -> habitId set
  const xpByDay = new Map<string, number>() // day -> total xp
  for (const rec of commitRecords) {
    if (rec.kind !== 'Habit') continue
    const day = new Date(rec.timestamp).toISOString().slice(0, 10)
    const habit = habitById.get(rec.instanceId) || habitByCommitmentId.get(rec.instanceId)
    if (!habit) continue
    if (HABIT_COUNT_EVENTS.has(rec.event)) {
      let m = eventCountByDayHabit.get(day); if (!m) { m = new Map(); eventCountByDayHabit.set(day, m) }
      const delta = rec.event === 'COUNT_DOWN' ? -1 : 1
      m.set(habit.id, (m.get(habit.id) ?? 0) + delta)
    } else if (HABIT_DAILYCHECK_EVENTS.has(rec.event)) {
      let s = dailyCheckByDayHabit.get(day); if (!s) { s = new Set(); dailyCheckByDayHabit.set(day, s) }
      s.add(habit.id)
    }
    // accumulate xp from rewards
    xpByDay.set(day, (xpByDay.get(day) ?? 0) + (rec.reward?.xp ?? 0))
  }

  // Build per-day habit stats using history, falling back to events if needed
  const habitDayStats = new Map<string, Map<string, HabitDayStats>>() // day -> habitId -> stats
  for (const day of allDays) {
    let dayHabits: Map<string, HabitDayStats> | undefined
    // include habits with any history on this day
    for (const h of habits) {
      const histCount = getHistoryCount(h, day)
      if (histCount > 0) {
        if (!dayHabits) { dayHabits = new Map(); habitDayStats.set(day, dayHabits) }
        dayHabits.set(h.id, { target: h.dailyTarget, count: histCount, reached: histCount >= h.dailyTarget })
      }
    }
    // merge event-based counts
    const ev = eventCountByDayHabit.get(day)
    if (ev) {
      for (const [habitId, delta] of ev.entries()) {
        const h = habitById.get(habitId)
        if (!h) continue
        const existing = dayHabits?.get(habitId)
        const base = existing?.count ?? 0
        const count = Math.max(0, base + delta)
        if (!dayHabits) { dayHabits = new Map(); habitDayStats.set(day, dayHabits) }
        dayHabits.set(habitId, { target: h.dailyTarget, count, reached: count >= h.dailyTarget })
      }
    }
    // apply daily-check flags
    const checks = dailyCheckByDayHabit.get(day)
    if (checks) {
      if (!dayHabits) { dayHabits = new Map(); habitDayStats.set(day, dayHabits) }
      for (const habitId of checks.values()) {
        const stat = dayHabits.get(habitId)
        if (stat) dayHabits.set(habitId, { ...stat, reached: true })
        else {
          const h = habitById.get(habitId); if (!h) continue
          dayHabits.set(habitId, { target: h.dailyTarget, count: 0, reached: true })
        }
      }
    }
  }

  // Build per-day entries
  const daysOut: MomentumInputDay[] = []
  for (const day of allDays) {
    const habitStatsForDay = habitDayStats.get(day)
    let mergedHabit: HabitDayStats | undefined
    if (habitStatsForDay) {
      // Merge multiple habits into aggregated virtual habit: average target attainment
      const stats = [...habitStatsForDay.values()]
      if (stats.length) {
        const avgTarget = stats.reduce((a, s) => a + s.target, 0) / stats.length
        const totalCountPct = stats.reduce((a, s) => a + clamp(0, s.count / s.target, 1), 0) / stats.length
        const reached = stats.filter(s => s.reached).length === stats.length && stats.length > 0
        mergedHabit = {
          target: Math.round(avgTarget),
          count: Math.round(avgTarget * totalCountPct),
          reached
        }
      }
    }

    const focus = focusByDay.get(day)

    const inputDay: InputDay = {
      day,
      habits: mergedHabit,
      focus,
      xp: xpByDay.has(day) ? { xpGained: xpByDay.get(day)! } : undefined,
      // tasks omitted initially (need task planning model) => engine will reweight
    }
    daysOut.push(inputDay)
  }

  return daysOut
}

/**
 * Build days from game stats only (xpHistory + dailyTarget).
 * - Treat dailyTarget as the target, and xp as the count for a single virtual habit.
 * - This lets the existing habit-based factor compute meaningful attainment without tasks/focus.
 */
export function buildMomentumDaysFromGame(
  xpHistory: Record<string, number>,
  dailyTarget: number,
  windowDays = 10
): MomentumInputDay[] {
  const days = Object.keys(xpHistory).sort().slice(-windowDays)
  const out: MomentumInputDay[] = []
  for (const day of days) {
    const xp = xpHistory[day] ?? 0
    const target = Math.max(1, dailyTarget)
    const count = xp
    const reached = xp >= target
    const d: InputDay = {
      day,
      habits: { target, count, reached },
      xp: { xpGained: xp },
    }
    out.push(d)
  }
  return out
}

function deriveDays(commitRecords: CommitRecordLike[], habits: HabitEntityLike[], focusBlocks: { day: string }[], windowDays: number): string[] {
  const set = new Set<string>()
  for (const r of commitRecords) set.add(new Date(r.timestamp).toISOString().slice(0, 10))
  for (const h of habits) {
    const hist = h.history instanceof Map ? h.history : new Map(Object.entries(h.history))
    for (const day of hist.keys()) set.add(day)
  }
  for (const f of focusBlocks) set.add(f.day)
  const arr = [...set]
  arr.sort()
  return arr.slice(-windowDays)
}

function getHistoryCount(habit: HabitEntityLike, day: string): number {
  if (habit.history instanceof Map) return habit.history.get(day) ?? 0
  return (habit.history as Record<string, number>)[day] ?? 0
}
