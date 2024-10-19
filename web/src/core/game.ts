import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore, StoreApi } from 'zustand/vanilla';

// misc
import { Daystamp, daystamp, Maybe, Timestamp, utils } from '@/shared/utils';

import { IUser } from '@/core/account';
import { useCallback } from 'react';
import { useStore } from 'zustand';
import { ICommitmentKind } from './commit';
import { calculateStreak } from './lib';

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

  xpToday: () => number
  dailyProgress: () => number
  averageXp: () => number
}

export interface GameActions {
  calculateStreak: () => void
  calculateMomentum: () => void
  refresh: () => void
  dailyRefresh: () => void
  reset: () => void
}

export interface GameMutations {
  changeXp: (change: number) => number,
  changeCoinsBalance: (change: number) => number,
  changeDailyTarget: (target: number) => number
}

export type GameInterface = GameState & GameActions
export type Game = ReturnType<typeof Game>["game"]
export type ReactiveGame = ReturnType<typeof Game>['useGame']
export type ReadOnlyGame = ReturnType<typeof Game>['readOnlyGame']
export type StaticGameInterface = Omit<GameInterface, keyof GameActions>

export function Game(state: GameState) {
  const game = createStore<GameInterface>()(
    persist(
      immer((set, get) => ({
        ...state,

        dailyProgress() {
          let ratio = get().xpToday() / get().dailyTarget
          return ratio
        },

        calculateStreak() {
          set($ => {
            $.streak = calculateStreak($.xpHistory, $.dailyTarget)
          })
        },

        xpToday() {
          return get().xpHistory[daystamp.today()] ?? 0
        },

        dailyRefresh() {
          set($ => {
            // first we reset stale values
            if (!utils.isSameDay($.lastActive, Date.now()))
              $.xpHistory[daystamp.today()] = 0 // reset daily xp

            // then we calculate new values
            $.dailyTarget = 100

            $.xpHistory[daystamp.today()] = 0

            // update last active date
            $.lastActive = Date.now()
          })

          get().refresh()
        },

        averageXp() {
          const xpHistory = get().xpHistory
          const activeDays = Object.entries(xpHistory).filter(([_, xp]) => xp !== 0)
          const totalXp = activeDays.reduce((sum, [, xp]) => sum + xp, 0)
          const averageXp = Math.floor(totalXp / activeDays.length)

          if (isNaN(averageXp)) return 0
          else return averageXp
        },

        calculateMomentum() {
          let averageXp = get().averageXp()
          set($ => {
            $.momentum = averageXp // for now, momentum is just average xp
          })
        },

        refresh() {
          /* reconcile, align all values together, 'cuz some depend on each other for calculations. */
          const user = get().user
          if (!user) return

          set($ => {
            // first we reset stale values
            if (!utils.isSameDay($.lastActive, Date.now()))
              $.xpHistory[daystamp.today()] = 0 // reset daily xp

            $.lastActive = Date.now()
          })

          get().calculateStreak()
          get().calculateMomentum()
        },
        reset() {
          set({
            xp: 0,
            coins: 0,
            momentum: 0,
            streak: 0,
            dailyTarget: 0,
            lastActive: undefined,
            lastXp: undefined,
            lastStreak: undefined,
            lastDailyCheck: undefined,
            xpHistory: {}
          })
        },
      })),

      { name: 'trekie-game' }
    ))

  function useGame(): GameInterface
  function useGame<T>(selector: (state: GameInterface) => T): T
  function useGame<T>(selector?: (state: GameInterface) => T) {
    return useStore(game, selector!)
  }

  type UseReadonlyGame = <T>(selector: (state: StaticGameInterface) => T) => T;
  const useReadonlyGame: UseReadonlyGame = <T>(selector: (state: StaticGameInterface) => T): T => {
    return useGame(
      useCallback(
        (state: GameInterface) => selector(state as StaticGameInterface),
        [selector]
      )
    )
  }

  // New addition: Read-only vanilla store
  const readOnlyGame = (() => {
    const state = game.getState()
    // Omit methods that mutate state
    const { reset, calculateMomentum, calculateStreak, refresh, dailyRefresh, ...readOnlyState } = state
    return Object.freeze(readOnlyState) satisfies StaticGameInterface
  })

  function changeXp(change: number) {
    game.setState($ => {
      let newTotalXp = $.xp + change
      let newDailyXp = $.xpToday() + change
      // prevent negative xp
      if (newTotalXp < 0)
        newTotalXp = 0
      $.xp = newTotalXp
      // add XP to history
      $.xpHistory[daystamp.today()] = newDailyXp
      // USE LATER: console.log(Object.fromEntries(Object.entries($.xpHistory).map(([k, v]) => [k, v])))
      // Handle user's last xp date
      if (!utils.isSameDay($.lastXp, Date.now()))
        $.lastXp = Date.now()
    })
    game.getState().refresh()
    return game.getState().xp
  }

  function changeCoinsBalance(change: number) {
    game.setState($ => {
      let newTotalCoins = $.coins + change
      // prevent negative coins
      if (newTotalCoins < 0)
        newTotalCoins = 0
      $.coins = newTotalCoins
    })
    game.getState().refresh()
    return game.getState().coins
  }

  function changeDailyTarget(target: number) {
    game.setState($ => {
      // prevent negative target
      if (target < 0) target = 0
      $.dailyTarget = target
    })
    game.getState().refresh()
    return game.getState().dailyTarget
  }

  const mutations: GameMutations = { changeXp, changeCoinsBalance, changeDailyTarget }

  return { game, readOnlyGame, useReadonlyGame, useGame, mutations }
}