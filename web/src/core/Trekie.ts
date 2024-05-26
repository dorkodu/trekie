import { create, useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'

// misc
import * as Supercell from '@/shared/lib/supercell'
import { Maybe, Timestamp } from '@/shared/utils'
import { utils } from '@/shared/utils'

export type IUser = IAccount & IProfile

export interface IProfile {
  bio?: string
  birthday?: Timestamp
  category?: string
  location?: string
  url?: string
}

export interface IAccount {
  id: string

  username: string
  name: string
  email?: string

  pictureUrl?: string

  joinedAt: Timestamp

  tier: AccountTier
}

export enum AccountTier {
  FREE = "free",
  PREMIUM = "premium",
}

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
          let count = 0

          const deserveStreak = $.xpToday >= $.xpTargetDaily
          const hasStreakToday = utils.isSameDay($.lastStreak, Date.now())

          // If user is now above/equal to target xp and didn't do a streak today
          if (deserveStreak && !hasStreakToday) {
            $.streak++
            $.lastStreak = Date.now()
          }
          // If user is now below target xp and did a streak today
          else if (!deserveStreak && hasStreakToday) {
            $.streak--
          }

          return count
        },
        gainXp: (gain: number) => set($ => ({ xp: $.xp + gain })),
        refresh() {
          /* reconcile, align all values together, 'cuz some depend on each other for calculations. */
          set($ => {
            const user = $.user
            if (!user) return

            $.streak = this.calculateStreak()


            // Handle user's last xp date
            if (!utils.isSameDay($.lastXp, Date.now())) {
              $.xpToday = 0
              $.lastXp = Date.now()
            }
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
  lastXp: 0,
  lastStreak: 0,
  lastActive: 0,

  // user
  user: undefined
}