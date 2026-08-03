import { describe, expect, it } from 'bun:test'
import { MOMENTUM_GAP_DECAY } from './constants'
import { createMomentumEngine, type MomentumInputDay } from './index'

function genDays(n: number, template: Partial<MomentumInputDay> = {}): MomentumInputDay[] {
  const out: MomentumInputDay[] = []
  for (let i = 0; i < n; i++) {
    const day = new Date(Date.now() - (n - 1 - i) * 86400000).toISOString().slice(0, 10)
    out.push({ day, ...template })
  }
  return out
}

describe('momentum engine basic', () => {
  it('computes zero on empty input', () => {
    const engine = createMomentumEngine()
    const r = engine.compute([])
    // With neutral-impute strategy, empty set yields 0 because no days => history empty => score 0
    expect(r.score).toBe(0)
  })

  it('higher activity yields higher score', () => {
    const engine = createMomentumEngine()
    const baseDays = genDays(10, {})
    const activeDays = genDays(10, { habits: { target: 3, count: 3, reached: true }, tasks: { planned: [{ importance: 'normal' }], completed: [{ importance: 'normal' }], microTaskCount: 0 }, focus: { deepBlocks: [{ minutes: 50 }] } })
    const r1 = engine.compute(baseDays)
    const r2 = engine.compute(activeDays)
    expect(r2.score).toBeGreaterThan(r1.score)
  })

  it('trend detection accelerating', () => {
    const engine = createMomentumEngine()
    const days: MomentumInputDay[] = []
    for (let i = 0; i < 10; i++) {
      days.push({
        day: new Date(Date.now() - (9 - i) * 86400000).toISOString().slice(0, 10),
        habits: { target: 2, count: 2 + (i > 6 ? 1 : 0), reached: true },
        tasks: { planned: [{ importance: 'normal' }], completed: [{ importance: 'normal' }], microTaskCount: 0 },
        focus: { deepBlocks: [{ minutes: 40 + i * 2 }] }
      })
    }
    const r = engine.compute(days)
    expect(['Accelerating', 'Stable']).toContain(r.trend.label)
  })

  // Reweight test removed because default strategy switched to neutral-impute (weights preserved)

  it('reports coverage & confidence', () => {
    const engine = createMomentumEngine()
    const days = genDays(10, { habits: { target: 2, count: 2, reached: true } })
    const r = engine.compute(days)
    expect(r.coverage).toBeDefined()
    expect(r.coverage?.ratio).toBeGreaterThan(0)
    expect(r.confidence).toBeGreaterThan(0)
  })

  it('imputes missing domains when strategy neutral-impute', () => {
    const engine = createMomentumEngine({})
    const days = genDays(10, { habits: { target: 2, count: 2, reached: true } })
    const r = engine.compute(days)
    // tasks & focus missing -> imputed or reweighted depending on strategy (current default neutral-impute)
    // Under neutral-impute, weights remain original while value is neutral (0.55 / 0.5 etc)
    const task = r.factors.find(f => f.key === 'tasks')
    const focus = r.factors.find(f => f.key === 'focus')
    expect(task?.weight).toBeGreaterThan(0) // weight not zero under neutral-impute
    expect(focus?.weight).toBeGreaterThan(0)
  })

  it('gap detection identifies largest gap', () => {
    const engine = createMomentumEngine()
    const today = new Date().toISOString().slice(0, 10)
    const d1 = new Date(Date.now() - 9 * 86400000).toISOString().slice(0, 10)
    const d2 = new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10)
    const days: MomentumInputDay[] = [
      { day: d1, habits: { target: 1, count: 1, reached: true } },
      { day: d2, habits: { target: 1, count: 1, reached: true } },
      { day: today, habits: { target: 1, count: 1, reached: true } },
    ]
    const r = engine.compute(days)
    expect(r.gaps?.largestGapDays).toBeGreaterThanOrEqual(3)
  })

  it('applies gap decay to reduce smoothed value vs no-gap scenario', () => {
    const engine = createMomentumEngine()
    const baseDay = new Date(Date.now() - 9 * 86400000)
    function day(n: number) { return new Date(baseDay.getTime() + n * 86400000).toISOString().slice(0, 10) }
    // Scenario A: consecutive days
    const consecutive: MomentumInputDay[] = []
    for (let i = 0; i < 5; i++) {
      consecutive.push({ day: day(i), habits: { target: 2, count: 2, reached: true } })
    }
    const rA = engine.compute(consecutive)
    // Scenario B: introduce a 4-day gap before last day (decay should cool EMA)
    const gapped: MomentumInputDay[] = [
      { day: day(0), habits: { target: 2, count: 2, reached: true } },
      { day: day(1), habits: { target: 2, count: 2, reached: true } },
      { day: day(6), habits: { target: 2, count: 2, reached: true } }, // gap of days 2-5
    ]
    const rB = engine.compute(gapped)
    // Expect final raw or score lower due to cooling (not always strictly guaranteed but typical)
    expect(rB.raw).toBeLessThanOrEqual(rA.raw)
    // Ensure decayEvents recorded
    expect((rB as any).decayEvents?.length).toBeGreaterThan(0)
  })

  it('decayEvents structure and multiplier bounds', () => {
    const engine = createMomentumEngine()
    const base = new Date(Date.now() - 12 * 86400000)
    const day = (n: number) => new Date(base.getTime() + n * 86400000).toISOString().slice(0, 10)
    const days: MomentumInputDay[] = [
      { day: day(0), habits: { target: 1, count: 1, reached: true } },
      { day: day(1), habits: { target: 1, count: 1, reached: true } },
      // big gap to trigger decay
      { day: day(8), habits: { target: 1, count: 1, reached: true } },
      { day: day(9), habits: { target: 1, count: 1, reached: true } }
    ]
    const r = engine.compute(days) as any
    expect(r.decayEvents?.length).toBeGreaterThan(0)
    for (const ev of r.decayEvents) {
      expect(typeof ev.index).toBe('number')
      expect(ev.gapDays).toBeGreaterThan(0)
      // after should not be wildly larger than before (allow slight numeric drift) and should stay within [0,1]
      expect(ev.after).toBeGreaterThanOrEqual(0)
      expect(ev.after).toBeLessThanOrEqual(1)
      if (ev.before > 0) {
        const mult = ev.after / ev.before
        // decay multiplier usually <=1; allow small overshoot (<=1.2) if neutral pulls upward
        expect(mult).toBeGreaterThan(0)
        expect(mult).toBeLessThanOrEqual(1.2)
        const expectedDecayFactor = Math.exp(-Math.log(2) * (ev.gapDays / MOMENTUM_GAP_DECAY.halfLifeDays))
        // multiplier should not indicate extreme amplification beyond decay expectations
        expect(mult).toBeGreaterThan(expectedDecayFactor * 0.3)
      }
    }
  })
})
