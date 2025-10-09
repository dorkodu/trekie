import { useMemo } from 'react'
import type { GameInterface, GameState } from '../core/game'
import { compute as momentumCompute } from '../core/momentum'

/**
 * Factory for app-scoped momentum helpers.
 * - useMomentum: React hook that reads xpHistory + dailyTarget from the app store and computes momentum.
 */
export function createMomentumHelpers(
  useReadonlyGame: <T>(selector: (state: GameInterface) => T) => T
) {
  function useMomentum(windowDays = 10) {
    const { xpHistory, dailyTarget } = useReadonlyGame((s) => ({
      xpHistory: s.xpHistory,
      dailyTarget: s.dailyTarget,
    }))
    return useMemo(
      () => momentumCompute.computeMomentumFromGame({ xpHistory, dailyTarget, windowDays }),
      [xpHistory, dailyTarget, windowDays]
    )
  }

  /** One-off compute from a plain state-like object (no React needed). */
  function computeNow(state: Pick<GameState, 'xpHistory' | 'dailyTarget'>, windowDays = 10) {
    return momentumCompute.computeMomentumFromGameState(state, windowDays)
  }

  return { useMomentum, computeNow }
}
