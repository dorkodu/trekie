import { VanillaGame } from './game'

export * from './hooks'
export * from './consts'

export * from './account'

export * as Goal from './commons/goal'
export * as Habit from './commons/habit'
export * as Social from './commons/social'
export * as Life from './commons/life'

// Trekie namespace exports
export * from './account'
export * from './commit'

export * from './game'

export type ComponentInterface = {}

export type GameComponent
  = (game: VanillaGame) => ComponentInterface

export function Component
  <TInterface extends ComponentInterface>
  (component: (game: VanillaGame) => TInterface) {
  return (game: VanillaGame) => component(game)
}
