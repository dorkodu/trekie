import type { GameState } from '../../game'
import type { BuildMomentumDaysParams } from '../adapters'
import { buildMomentumDaysFromGame } from '../adapters'
import { createMomentumEngine } from '../engine'

export function computeMomentumFromGame(
  params: {
    xpHistory: Record<string, number>
    dailyTarget: number
    windowDays?: number
  }
) {
  const days = buildMomentumDaysFromGame(params.xpHistory, params.dailyTarget, params.windowDays ?? 10)
  const engine = createMomentumEngine({ options: { windowDays: params.windowDays ?? 10 } })
  return engine.compute(days)
}

/**
 * Convenience helper to compute momentum directly from a GameState-like object.
 * Only requires xpHistory and dailyTarget from the state.
 */
export function computeMomentumFromGameState(
  state: Pick<GameState, 'xpHistory' | 'dailyTarget'>,
  windowDays = 10
) {
  return computeMomentumFromGame({
    xpHistory: state.xpHistory,
    dailyTarget: state.dailyTarget,
    windowDays,
  })
}

/**
 * Compute momentum from commitments + commitRecords (+ optional focusBlocks/days)
 * Mirrors the adapter BuildMomentumDaysParams and runs the engine.
 */
export function computeMomentumFromCommitments(params: BuildMomentumDaysParams & { windowDays?: number }) {
  const windowDays = params.windowDays ?? 10
  // Lazily import to avoid circular type coupling in some bundlers
  const { buildMomentumDays } = require('../adapters') as typeof import('../adapters')
  const engine = createMomentumEngine({ options: { windowDays } })
  const days = buildMomentumDays({ ...params, windowDays })
  return engine.compute(days)
}

export { BANDS, DEFAULT_OPTIONS, DEFAULT_WEIGHTS } from '../constants'
export { diffMomentum } from '../delta'
export { createMomentumEngine } from '../engine'
export { explainMomentum } from '../explain'
export { computePointImpact } from '../impact'
export { recommendMomentumActions } from '../recommend'
export type * from '../types'

