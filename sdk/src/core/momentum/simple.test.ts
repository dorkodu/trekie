import { describe, expect, it } from 'bun:test'
import type { GameState } from '../game'
import { compute } from './index'

function d(n: number) {
  const dt = new Date()
  dt.setUTCDate(dt.getUTCDate() - n)
  return dt.toISOString().slice(0, 10)
}

describe('computeMomentumFromGame', () => {
  it('computes a non-zero score for active days', () => {
    const xpHistory: Record<string, number> = {
      [d(9)]: 10,
      [d(8)]: 0,
      [d(7)]: 20,
      [d(6)]: 30,
      [d(5)]: 0,
      [d(4)]: 40,
      [d(3)]: 50,
      [d(2)]: 0,
      [d(1)]: 10,
      [d(0)]: 25,
    }
    const res = compute.computeMomentumFromGame({ xpHistory, dailyTarget: 25, windowDays: 10 })
    expect(res.score).toBeGreaterThanOrEqual(1)
    expect(res.history.length).toBeGreaterThan(0)
  })

  it('returns 0 for empty history', () => {
    const res = compute.computeMomentumFromGame({ xpHistory: {}, dailyTarget: 20, windowDays: 7 })
    expect(res.score).toBe(0)
    expect(res.history.length).toBe(0)
  })

  it('computes from GameState helper', () => {
    const state: Pick<GameState, 'xpHistory' | 'dailyTarget'> = {
      dailyTarget: 10,
      xpHistory: { [d(1)]: 5, [d(0)]: 10 },
    }
    const res = compute.computeMomentumFromGameState(state, 2)
    expect(res.score).toBeGreaterThanOrEqual(1)
    expect(res.history.length).toBe(2)
  })
})
