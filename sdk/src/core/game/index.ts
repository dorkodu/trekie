// misc
import type { Daystamp, Maybe, Timestamp } from '../../utils'
import type { IUser } from '../account'
import { changeCoinsBalance, changeDailyTarget, changeXp } from './mutators'
import { createGameStore } from './store'

export interface GameState {
  user: IUser

  xp: number
  coins: number
  momentum: number
  streak: number

  dailyTarget: number

  lastActive: Maybe<Timestamp>
  lastXp: Maybe<Timestamp>
  lastStreak: Maybe<Timestamp>
  lastDailyCheck: Maybe<Timestamp>,

  xpHistory: { [date: Daystamp]: number }
}

export interface GameActions {
  xpToday: () => number
  dailyProgress: () => number
  averageXp: () => number

  calculateStreak: () => void
  calculateMomentum: () => void

  refresh: () => void
  dailyRefresh: () => void

  reset: () => void
}

export interface GameMutations {
  changeXp: (change: number) => number
  changeCoinsBalance: (change: number) => number
  changeDailyTarget: (target: number) => number
}

export type GameInterface = GameState & GameActions
export type Game = ReturnType<typeof Game>["game"]
export type ReactiveGame = ReturnType<typeof Game>['useGame']
export type ReadOnlyGame = ReturnType<typeof Game>['readOnlyGame']

export function Game(state: GameState) {

  const { game, readOnlyGame, useReadonlyGame, useGame } = createGameStore(state)

  const mutations: GameMutations = {
    changeXp: (change: number) => changeXp(game, change),
    changeCoinsBalance: (change: number) => changeCoinsBalance(game, change),
    changeDailyTarget: (target: number) => changeDailyTarget(game, target)
  }

  return { game, readOnlyGame, useReadonlyGame, useGame, mutations }
}