import { StateCreator, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// misc
import * as Supercell from '#/lib/supercell'
import { Maybe, Timestamp } from '#/lib/util'

export interface IUser {
  id: string;

  username: string;
  name: string;
  joinedAt: Date;

  email?: string;

  bio?: string;

  pictureUrl?: string;

  followerCount?: number;
  followingCount?: number;

  premium?: boolean;
}

export interface GameState {
  user: Maybe<IUser>

  xp: number
  coins: number
  momentum: number
  streak: number

  dailyProgress: number

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

    gainXp: (gain: number) => set($ => ({ xp: $.xp + gain })),
    refresh() { /* reconcile, align all values together, 'cuz some depend on each other for calculations. */ },
    reset() { set(defaultState) },
  })))
}

//? COMPONENTS 

export type ComponentBase<TState, TEvents extends Record<string, Supercell.IEvent<any>>> = {
  events: TEvents
  store: ReturnType<typeof Supercell.Store<TState>>
  cell: ReturnType<typeof Supercell.Cell<TEvents>>
}

export type BoundComponent<TState, TEvents extends Record<string, Supercell.IEvent<any>>> = {
  $: ComponentBase<TState, TEvents>
}

export type GameComponent<TState, TEvents extends Record<string, Supercell.IEvent<any>>>
  = (game: GameInterface) => BoundComponent<TState, TEvents>

export function Component
  <TState, TEvents extends Record<string, Supercell.IEvent<any>>>
  (component: (game: GameInterface) => ComponentBase<TState, TEvents>) {

  function creator(game: GameInterface) {
    const { events, cell, store, ...rest } = component(game)

    return {
      $: { events, cell, store },
      ...rest
    }
  }

  return creator
}


export type TrekieStoreInterface = GameState & GameActions

export interface GameActions {
  refresh: () => void
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
  dailyProgress: 0,

  // timestamps
  lastXp: 0,
  lastStreak: 0,
  lastActive: 0,

  // user
  user: undefined
}


