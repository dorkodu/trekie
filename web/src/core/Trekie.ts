import { create, useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'

// misc
import * as Supercell from '@/shared/lib/supercell'
import { Daystamp, Maybe, Timestamp, daystamp } from '@/shared/utils'
import { utils } from '@/shared/utils'

import { IUser, IAccount, IProfile, AccountTier } from '@/core/account'
export * from '@/core/account'

export interface GameState {
  user: Maybe<IUser>

  xp: number
  coins: number
  momentum: number
  streak: number

  xpTargetDaily: number
  xpToday: number

  lastActive: Maybe<Timestamp>
  lastXp: Maybe<Timestamp>
  lastStreak: Maybe<Timestamp>
  lastDailyCheck: Maybe<Timestamp>,

  xpHistory: Map<Daystamp, number>
}

export type VanillaGame = ReturnType<typeof Game>["game"]
export type ReactiveGame = ReturnType<typeof Game>["useGame"]

export function Game(state: GameState = defaultState) {
  const game = createStore<TrekieStoreInterface>()(
    persist(
      immer((set, get) => ({
        ...state,
        dailyProgress() {
          get().refresh()

          let ratio = get().xpToday / get().xpTargetDaily
          return ratio
        },
        calculateStreak() {
          let count = get().streak

          set($ => {
            // If user is now above/equal to target xp and didn't do a streak today
            const deserveStreak = $.xpToday >= $.xpTargetDaily
            const hasStreakToday = utils.isSameDay($.lastStreak, Date.now())

            if (deserveStreak && !hasStreakToday) {
              ++$.streak
              $.lastStreak = Date.now()

            }
            // If user is now below target xp and did a streak today
            else if (!deserveStreak && hasStreakToday) {
              --$.streak
              $.lastStreak = undefined
            }

            count = $.streak
          })

          return count
        },
        gainXp: (change: number) => {
          set($ => {
            let newTotalXp = $.xp + change
            let newDailyXp = $.xpToday + change

            // prevent negative xp
            if (newTotalXp < 0)
              newTotalXp = 0

            if (newDailyXp < 0 && newTotalXp)
              $.xpToday = 0

            $.xp = newTotalXp
            $.xpToday = newDailyXp

            // add XP to history
            $.xpHistory.set(daystamp.today(), newDailyXp)

            // Handle user's last xp date
            if (!utils.isSameDay($.lastXp, Date.now()))
              $.lastXp = Date.now()

          })
        },
        dailyRefresh() {
          set($ => {
            // first we reset stale values
            if (!utils.isSameDay($.lastActive, Date.now()))
              $.xpToday = 0 // reset daily xp

            // then we calculate new values
            $.xpTargetDaily = 100
            $.calculateStreak()

            // update last active date
            $.lastActive = Date.now()
          })
        },
        refresh() {
          /* reconcile, align all values together, 'cuz some depend on each other for calculations. */
          set($ => {
            const user = $.user
            if (!user) return

            // first we reset stale values
            if (!utils.isSameDay($.lastActive, Date.now()))
              $.xpToday = 0 // reset daily xp

            // then we calculate new values

            $.calculateStreak()


            $.lastActive = Date.now()
          })
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

export type ComponentInterface = {}

export type GameComponent
  = (game: VanillaGame) => ComponentInterface

export function Component
  <TInterface extends ComponentInterface>
  (component: (game: VanillaGame) => TInterface) {
  return (game: VanillaGame) => component(game)
}

export function log(status: Supercell.IStatus<unknown>) {
  console.log(`[trekie] <${status.kind}> @ "${(new Date(status.timestamp)).toISOString()}"`)
}

export type TrekieStoreInterface = GameState & GameActions

export interface GameActions {
  refresh: () => void
  dailyProgress: () => number
  calculateStreak: () => number
  reset: () => void
}

const defaultState: GameState = {
  // points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  // dailies
  xpTargetDaily: 0,
  xpToday: 0,

  // timestamps
  lastXp: undefined,
  lastStreak: undefined,
  lastActive: undefined,
  lastDailyCheck: undefined,

  // user
  user: undefined,

  xpHistory: new Map()
}