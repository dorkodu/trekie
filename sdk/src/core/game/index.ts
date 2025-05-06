import { useCallback } from 'react'
import { useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore, StoreApi } from 'zustand/vanilla'

// misc
import type { IUser } from '../account'
import type { Daystamp, daystamp, Maybe, Timestamp, utils } from '@sdk/../../utils'
import { calculateStreak } from './lib'

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

  const mutations: GameMutations = { changeXp, changeCoinsBalance, changeDailyTarget }

  return { game, readOnlyGame, useReadonlyGame, useGame, mutations }
}