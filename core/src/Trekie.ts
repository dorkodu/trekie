import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// misc
import * as Supercell from './lib/supercell'
import { Maybe, Timestamp, util } from './lib/util'

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

  lastActive: Timestamp
  lastXp: Timestamp
  lastStreak: Timestamp
}

export type GameInterface = ReturnType<typeof Game>

export function Game(state: GameState = defaultState) {
  return create<TrekieStoreInterface>()(immer((set, get) => ({
    ...state,
    dailyProgress() {
      let ratio = get().xpToday / get().xpTargetDaily
      return ratio
    },
    gainXp: (gain: number) => set($ => ({ xp: $.xp + gain })),
    refresh() {
      /* reconcile, align all values together, 'cuz some depend on each other for calculations. */
      set($ => {
        const user = $.user
        if (!user) return

        const didStreakToday = util.isSameDay(
          $.lastStreak,
          Date.now()
        )

        // If user is now above/equal to target xp and didn't do a streak today
        if (
          $.xpToday > 0 &&
          $.xpToday >= $.xpTargetDaily &&
          !didStreakToday
        ) {
          $.streak++
          $.lastStreak = Date.now()
        }
        // If user is now below target xp and did a streak today
        else if (
          ($.xpToday <= 0 ||
            $.xpToday < $.xpTargetDaily) &&
          didStreakToday
        ) {
          $.streak--
        }

        // Handle user's last xp date
        if (!util.isSameDay($.lastXp, Date.now())) {
          $.xpToday = 0
          $.lastXp = Date.now()
        }
      })
    },
    reset() { set(defaultState) },
  })))
}

export type ComponentInterface<TState, TEvents extends Record<string, Supercell.IEvent<any>>> = {
  events: TEvents
  store: ReturnType<typeof Supercell.Store<TState>>
  cell: ReturnType<typeof Supercell.Cell<TEvents>>
}

export type GameComponent<TState, TEvents extends Record<string, Supercell.IEvent<any>>>
  = (game: GameInterface) => ComponentInterface<TState, TEvents>

export function Component
  <TInterface extends ComponentInterface<TState, TEvents>, TState, TEvents extends Record<string, Supercell.IEvent<any>>>
  (component: (game: GameInterface) => TInterface) {

  return (game: GameInterface) => component(game)
}

export function log(status: Supercell.IStatus<unknown>) {
  console.log(`[trekie] <${status.kind}> @ "${(new Date(status.timestamp)).toISOString()}"`)
}

export type TrekieStoreInterface = GameState & GameActions

export interface GameActions {
  refresh: () => void

  dailyProgress: () => number

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


