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

  const habitIndex = new Map<string, HabitEntityLike>()
  for (const h of habits) habitIndex.set(h.commitmentId, h)

  // Aggregate focus by day
  const focusByDay = new Map<string, FocusDayStats>()
  for (const fb of focusBlocks) {
    const existing = focusByDay.get(fb.day) || { deepBlocks: [] }
    existing.deepBlocks.push({ minutes: fb.minutes })
    focusByDay.set(fb.day, existing)
  }

  // Aggregate commit records per day (habit stats + tasks placeholder)
  const habitDayStats = new Map<string, Map<string, HabitDayStats>>() // day -> commitmentId -> stats

  for (const rec of commitRecords) {
    const day = new Date(rec.timestamp).toISOString().slice(0, 10)
    const habit = habitIndex.get(rec.instanceId)
    if (habit && rec.kind === 'Habit') {
      let dayHabits = habitDayStats.get(day)
      if (!dayHabits) { dayHabits = new Map(); habitDayStats.set(day, dayHabits) }
      let stat = dayHabits.get(rec.instanceId)
      if (!stat) {
        const countToday = getHistoryCount(habit, day)
        stat = { target: habit.dailyTarget, count: countToday, reached: countToday >= habit.dailyTarget }
        dayHabits.set(rec.instanceId, stat)
      }
      if (HABIT_COUNT_EVENTS.has(rec.event)) {
        // trust habit.history for final count; nothing to do
      } else if (HABIT_DAILYCHECK_EVENTS.has(rec.event)) {
        stat.reached = true
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
      // tasks omitted initially (need task planning model) => engine will reweight
    }
    daysOut.push(inputDay)
  }

  return daysOut
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
