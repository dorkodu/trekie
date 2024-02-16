import { Supercell } from '#/lib/supercell';
import { Cell, IEvent } from '#/lib/supercell'
import { StateCreator, StoreApi, UseBoundStore, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// commons
import { IUser } from '#/commons/life'
import { Interface as HabitInterface, Component as HabitComponent, IHabit } from '#/commons/habit'
import { Interface as GoalInterface, Component as GoalComponent, IGoal } from '#/commons/goal'
import { Interface as LifeInterface, Component as LifeComponent, IUser } from '#/commons/life'
// import { Interface as StoryInterface, Component as StoryComponent, IStory } from '#/commons/story'
// import { Interface as SocialInterface, Component as SocialComponent } from '#/commons/social'

// misc
import { Maybe, Timestamp, util } from '#/lib/util'
import { Objectish } from 'immer';

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

export function App(
  state: TrekieStoreInterface = initialState,
  components: Record<string, GameComponent<any, any>> = {}
) {
  const store = create<TrekieStoreInterface>()(immer(() => state))

  const game = Game(state)

  let boundComponents: Record<string, BoundComponent<any, any>> = {}

  Object.keys(components).forEach((key) => {
    let cx = components[key]?.(game)

    if (!cx && typeof cx != "undefined")
      boundComponents[key] = cx
  })

  return {
    $: game,
    ...boundComponents
  }
}

export type GameInterface = ReturnType<typeof Game>

export function Game(state: TrekieStoreInterface = initialState) {

  const store = create<TrekieStoreInterface>()(immer(() => state))

  return { store }
}

//? COMPONENTS 

export type ComponentBase<TState, TEvents extends Record<string, IEvent<any>>> = {
  events: TEvents
  store: ReturnType<typeof Store<TState>>
  cell: ReturnType<typeof Cell<TEvents>>
}

export type BoundComponent<TState, TEvents extends Record<string, IEvent<any>>> = {
  $: ComponentBase<TState, TEvents>
}

export type GameComponent<TState, TEvents extends Record<string, IEvent<any>>>
  = (game: GameInterface) => BoundComponent<TState, TEvents>

export function Component
  <TState, TEvents extends Record<string, IEvent<any>>>
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

export function Store<TState>
  (initializer: StateCreator<TState, [["zustand/immer", never]], [], TState>) {
  return create<TState>()(immer(initializer))
}

export function Slice<TState>
  (initializer: StateCreator<TState, [["zustand/immer", never]], [], TState>) { return initializer }

export type TrekieStoreInterface = GameState & GameActions

export interface GameActions {
  refresh: () => void
  reset: () => void
}

const initialState: TrekieStoreInterface = {
  // points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  // dailies
  xpTargetDaily: 5,
  xpToday: 0,
  dailyProgress: 20,

  // timestamps
  lastXp: 1703846675440,
  lastStreak: 1703846675432,
  lastActive: 1703846675432,

  user: {
    id: '1',
    username: 'dorukeray',
    name: 'Doruk Eray',
    bio: 'Founder, Polymath, Craftsman.',
    email: 'doruk@dorkodu.com',
    pictureUrl: '/images/doruk--green.png',
    premium: true,
    joinedAt: new Date(1703846675432),
    followerCount: 0,
    followingCount: 0,
  },

  refresh() { },
  reset() { set(initialState) },

}



