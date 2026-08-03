import { describe, expect, it } from 'bun:test'
import { createMomentumEngineWithDefaults, explainMomentum, summarizeMomentum } from './index'

describe('explainMomentum', () => {
  it('produces factor explanations and a summary', () => {
    const engine = createMomentumEngineWithDefaults()
    const result = engine.compute([
      { day: '2025-09-18', habits: { target: 3, count: 3, reached: true }, tasks: { planned: [{ importance: 'normal' }], completed: [{ importance: 'normal' }], microTaskCount: 0 }, focus: { deepBlocks: [{ minutes: 60 }] }, xp: { xpGained: 30 } },
      { day: '2025-09-19', habits: { target: 3, count: 2, reached: false }, tasks: { planned: [{ importance: 'normal' }], completed: [{ importance: 'normal' }], microTaskCount: 0 }, focus: { deepBlocks: [{ minutes: 45 }] }, xp: { xpGained: 10 } },
      { day: '2025-09-20', habits: { target: 3, count: 3, reached: true }, tasks: { planned: [{ importance: 'normal' }], completed: [{ importance: 'normal' }], microTaskCount: 0 }, focus: { deepBlocks: [{ minutes: 50 }] }, xp: { xpGained: 25 } }
    ])

    const explanation = explainMomentum(result)
    expect(explanation.factors.length).toBeGreaterThan(0)
    expect(explanation.summary.length).toBeGreaterThan(10)
    const summaryLine = summarizeMomentum(result)
    expect(summaryLine).toContain('Momentum')
  })
})
