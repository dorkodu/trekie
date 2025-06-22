import { useCallback } from "react"
import { createStore, useStore } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import type { GameInterface, GameState } from "."
import { daystamp, isSameDay, utils } from "../../utils"
import { calculateStreak } from "./lib"

export function createGameStore(state: GameState) {
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

        // Afsin
        calculateMomentum() {
          const averageXp = get().averageXp()
          set($ => {
            $.momentum = averageXp // for now, momentum is just average xp
          })
        },

        xpToday() {
          return get().xpHistory[daystamp.today()] ?? 0
        },

        dailyRefresh() {
          set($ => {
            // first we reset stale values
            if (!isSameDay($.lastActive, Date.now()))
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

  type UseReadonlyGame = <T>(selector: (state: GameInterface) => T) => T
  const useReadonlyGame: UseReadonlyGame = <T>(selector: (state: GameInterface) => T): T => {
    return useGame(
      useCallback(
        (state: GameInterface) => selector(state as GameInterface),
        [selector]
      )
    )
  }
  // New addition: Read-only vanilla store
  const readOnlyGame = (() => {
    const state = game.getState()
    return Object.freeze(state) satisfies GameInterface
  })

  return { game, readOnlyGame, useReadonlyGame, useGame }
}

