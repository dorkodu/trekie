import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

// misc
import { Daystamp, Maybe, Timestamp, daystamp } from '@/shared/utils'
import { utils } from '@/shared/utils'

import { IUser } from '@/core/account'
import { calculateStreak } from './commons/life'
import { defaultState } from './consts'

export interface GameState {
  user: Maybe<IUser>

  xp: number
  coins: number
  momentum: number
  streak: number

  xpTargetDaily: number

  lastActive: Maybe<Timestamp>
  lastXp: Maybe<Timestamp>
  lastStreak: Maybe<Timestamp>
  lastDailyCheck: Maybe<Timestamp>,

  xpHistory: { [date: Daystamp]: number }
}

export interface GameActions {
  changeXp: (change: number) => void,
  changeCoinsBalance: (change: number) => void,

  xpToday: () => number
  dailyProgress: () => number
  averageXp: () => number

  calculateStreak: () => void
  calculateMomentum: () => void

  refresh: () => void
  dailyRefresh: () => void
  reset: () => void
}

export type VanillaGame = ReturnType<typeof Game>["game"]
export type ReactiveGame = ReturnType<typeof Game>["useGame"]

export function Game(state: GameState = defaultState) {
  const game = createStore<TrekieStoreInterface>()(
    persist(
      immer((set, get) => ({
        ...state,

        dailyProgress() {
          let ratio = get().xpToday() / get().xpTargetDaily
          return ratio
        },

        calculateStreak() {
          set($ => {
            $.streak = calculateStreak($.xpHistory, $.xpTargetDaily)
          })
        },

        xpToday() {
          return get().xpHistory[daystamp.today()] ?? 0
        },

        changeXp: (change: number) => {
          set($ => {
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

          get().refresh()
        },

        changeCoinsBalance(change) {
          set($ => {
            let newTotalCoins = $.coins + change
            // prevent negative coins
            if (newTotalCoins < 0)
              newTotalCoins = 0
            $.coins = newTotalCoins
          })
        },

        dailyRefresh() {
          set($ => {
            // first we reset stale values
            if (!utils.isSameDay($.lastActive, Date.now()))
              $.xpHistory[daystamp.today()] = 0 // reset daily xp

            // then we calculate new values
            $.xpTargetDaily = 100

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
        reset() { set(defaultState) },
      })),

      { name: 'trekie-game' }
    ))

  function useGame(): TrekieStoreInterface
  function useGame<T>(selector: (state: TrekieStoreInterface) => T): T
  function useGame<T>(selector?: (state: TrekieStoreInterface) => T) {
    return useStore(game, selector!)
  }

  return { game, useGame }
}

export type TrekieStoreInterface = GameState & GameActions

