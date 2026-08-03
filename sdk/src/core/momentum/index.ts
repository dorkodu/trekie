// New modular exports
export * as compute from './compute'
export * as data from './data'

// Back-compat named exports for direct imports (optional; can remove later)
export * from './constants'
export { diffMomentum } from './delta'
export * as dev from './dev/factorToolkit'
export { createMomentumEngine, createMomentumEngineWithDefaults } from './engine'
export { explainMomentum, summarizeMomentum } from './explain'
export * from './factors'
export { computePointImpact } from './impact'
export { recommendMomentumActions } from './recommend'
export * from './types'

// Direct named exports for common data builders (convenience)
export { buildMomentumDays, buildMomentumDaysFromGame } from './data'

