import { describe, expect, it } from 'bun:test'
import { compute, data } from './index'

function isoDay(ts: number) {
  return new Date(ts).toISOString().slice(0, 10)
}

describe('momentum adapters enrichment', () => {
  it('uses event deltas when history is missing', () => {
    const now = Date.now()
    const day = isoDay(now)
    const habits = [{ id: 'h1', commitmentId: 'h1', dailyTarget: 3, history: {} }]
    const commitRecords = [
      { event: 'COUNT_UP', kind: 'Habit', instanceId: 'h1', timestamp: now, data: {}, reward: { xp: 1, coins: 0 } },
      { event: 'COUNT_UP', kind: 'Habit', instanceId: 'h1', timestamp: now, data: {}, reward: { xp: 1, coins: 0 } },
    ] as any
    const days = data.buildMomentumDays({ habits, commitRecords, windowDays: 3 })
    expect(days.length).toBeGreaterThan(0)
    const d = days.find(d => d.day === day)!
    expect(d.habits?.count).toBe(2)
    expect(d.habits?.target).toBe(3)
    const res = compute.createMomentumEngineWithDefaults({ options: { windowDays: 3 } }).compute(days)
    expect(res.score).toBeGreaterThan(0)
  })

  it('daily-check forces reached', () => {
    const now = Date.now()
    const day = isoDay(now)
    const habits = [{ id: 'h1', commitmentId: 'h1', dailyTarget: 3, history: {} }]
    const commitRecords = [
      { event: 'DAILYCHECK', kind: 'Habit', instanceId: 'h1', timestamp: now, data: {}, reward: { xp: 0, coins: 0 } },
    ] as any
    const days = data.buildMomentumDays({ habits, commitRecords, windowDays: 3 })
    const d = days.find(d => d.day === day)!
    expect(d.habits?.reached).toBe(true)
  })

  it('aggregates xp from rewards', () => {
    const now = Date.now()
    const day = isoDay(now)
    const habits = [{ id: 'h1', commitmentId: 'h1', dailyTarget: 1, history: {} }]
    const commitRecords = [
      { event: 'COUNT_UP', kind: 'Habit', instanceId: 'h1', timestamp: now, data: {}, reward: { xp: 5, coins: 1 } },
      { event: 'COUNT_UP', kind: 'Habit', instanceId: 'h1', timestamp: now, data: {}, reward: { xp: 7, coins: 0 } },
    ] as any
    const days = data.buildMomentumDays({ habits, commitRecords, windowDays: 3 })
    const d = days.find(d => d.day === day)!
    expect(d.xp?.xpGained).toBe(12)
  })
})
