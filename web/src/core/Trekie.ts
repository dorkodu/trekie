import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

// misc
import * as Supercell from '@/shared/lib/supercell'
import { Daystamp, Maybe, Timestamp, daystamp } from '@/shared/utils'
import { utils } from '@/shared/utils'

import { IUser } from '@/core/account'
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

  xpHistory: Record<Daystamp, number>
}

export type VanillaGame = ReturnType<typeof Game>["game"]
export type ReactiveGame = ReturnType<typeof Game>["useGame"]

export function Game(state: GameState = defaultState) {
  const game = createStore<TrekieStoreInterface>()(
    persist(
      immer((set, get) => ({
        ...state,
        dailyProgress() {
          let ratio = get().xpToday / get().xpTargetDaily
          return ratio
        },
        calculateStreak() {
          set((state) => ({
            streak: 100,
          }))

          console.log("Streak: ", get().streak)
        },
        changeXp: (change: number) => {
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
            $.xpHistory[daystamp.today()] = newDailyXp
            console.log("Daily XP: ", $.xpToday)
            console.log(Object.fromEntries(Object.entries($.xpHistory).map(([k, v]) => [k, v])))

            $.calculateStreak()

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
        calculateMomentum() {
          set((state) => ({
            momentum: 100,
          }));
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
            $.calculateMomentum()
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
  dailyRefresh: () => void
  dailyProgress: () => number
  calculateStreak: () => void
  calculateMomentum: () => void
  changeXp: (change: number) => void,
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

  xpHistory: {}
}