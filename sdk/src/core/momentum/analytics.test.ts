import { describe, expect, it } from 'bun:test';
import { computePointImpact, createMomentumEngineWithDefaults, diffMomentum, recommendMomentumActions } from './index';

function sampleDays(day: string, mods?: Partial<{ habits: { target: number; count: number; reached: boolean }, focusMinutes: number }>) {
  return {
    day,
    habits: { target: 3, count: 3, reached: true, ...(mods?.habits || {}) },
    tasks: { planned: [{ importance: 'normal' as const }], completed: [{ importance: 'normal' as const }], microTaskCount: 0 },
    focus: { deepBlocks: [{ minutes: mods?.focusMinutes ?? 60 }] },
    xp: { xpGained: 20 }
  }
}

describe('momentum analytics utilities', () => {
  it('diffMomentum identifies largest movers', () => {
    const engine = createMomentumEngineWithDefaults()
    const prev = engine.compute([
      sampleDays('2025-09-18'),
      sampleDays('2025-09-19', { habits: { target: 3, count: 2, reached: false } }),
      sampleDays('2025-09-20')
    ])
    const curr = engine.compute([
      sampleDays('2025-09-18'),
      sampleDays('2025-09-19'),
      sampleDays('2025-09-20'),
      sampleDays('2025-09-21', { focusMinutes: 90 })
    ])
    const diff = diffMomentum(prev, curr)
    expect(diff.scoreCurr).toBeGreaterThanOrEqual(diff.scorePrev)
    expect(diff.factors.length).toBeGreaterThan(0)
  })

  it('computePointImpact gives upside estimates', () => {
    const engine = createMomentumEngineWithDefaults()
    const result = engine.compute([
      sampleDays('2025-09-18', { habits: { target: 3, count: 1, reached: false }, focusMinutes: 20 }),
      sampleDays('2025-09-19', { habits: { target: 3, count: 2, reached: false }, focusMinutes: 30 }),
      sampleDays('2025-09-20')
    ])
    const impact = computePointImpact(result)
    expect(impact.estimatedPointUpside).toBeGreaterThan(0)
    expect(impact.factors.length).toBeGreaterThan(0)
  })

  it('recommendMomentumActions returns prioritized codes', () => {
    const engine = createMomentumEngineWithDefaults()
    const weak = engine.compute([
      sampleDays('2025-09-18', { habits: { target: 3, count: 0, reached: false }, focusMinutes: 10 }),
      sampleDays('2025-09-19', { habits: { target: 3, count: 1, reached: false }, focusMinutes: 15 }),
      sampleDays('2025-09-20', { habits: { target: 3, count: 1, reached: false }, focusMinutes: 20 })
    ])
    const recs = recommendMomentumActions(weak, { limit: 3 })
    expect(recs.length).toBeGreaterThan(0)
    if (recs[0]) expect(recs[0].code).toBeDefined()
  })
})
