import { Supercell } from '#/lib/supercell';
import { Cell, IEvent } from '#/lib/supercell'
import { StateCreator, StoreApi, UseBoundStore, create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// commons
import { IUser } from '#/commons/life'
import { Interface as HabitInterface, Component as HabitComponent, IHabit } from '#/commons/habit'
import { Interface as GoalInterface, Component as GoalComponent, IGoal } from '#/commons/goal'
// import { Interface as StoryInterface, Component as StoryComponent, IStory } from '#/commons/story'

interface Config {
  components: GameComponents
}

export class Trekie {

  public components: GameComponents = {}

  public store = create<TrekieStoreInterface>()((set, get) => ({

  }))

  constructor({ components }: Config) { }

  updateStats() { }
}

// misc
import { Maybe, Timestamp, util } from '#/lib/util'


export interface TrekieComponent<TState, TEvents extends Record<string, IEvent<any>>> {
  events: TEvents
  store: ReturnType<typeof ComponentStore<TState>>
  cell: ReturnType<typeof Cell<TEvents>>
}

export function ComponentStore<TState>(initializer: StateCreator<TState, [["zustand/immer", never]], [], TState>) {
  return create<TState>()(
    immer(
      initializer
    )
  )
}

export interface GameState {
  user: Maybe<IUser>

  xp: number
  coins: number
  momentum: number
  streak: number

  dailyProgress: number
  targetXpDaily: number

  xpToday: number

  lastActive: Timestamp
  lastXp: Timestamp
  lastStreak: Timestamp
}

export type GameComponents = Record<string, TrekieComponent<any, any>>

export type TrekieStoreInterface = GameState & GameActions


export interface GameActions {
  updateStats: () => void
  reset: () => void
}

const initialState: GameState = {
  // points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  // dailies
  targetXpDaily: 5,
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
}

export const useStore = create<GameState & GameComponents>()(
  immer((set, get) => ({
    ...initialState,


    addStory(story: IStory) {
      set(s => {
        s.stories[story.id] = story
      })
    },

    getStory(id) {
      return get().stories[id]
    },

    removeStory(id) {
      set(s => {
        delete s.stories[id]
      })
    },

    addGoal(goal: IGoal) {
      set($ => {
        $.goals[goal.id] = goal
      })
    },

    getGoal(id) {
      return get().goals[id]
    },

    removeGoal(id) {
      set(s => {
        delete s.goals[id]
      })
    },

    updateStats() {
      set($ => {
        const currentUser = $.user
        if (!currentUser) return

        // update daily progress
        let progressRatio = $.dailyXpCurrent / $.dailyXpTarget * 100
        if (progressRatio >= 100)
          $.dailyProgress = 100
        else if (progressRatio < 20)
          $.dailyProgress = 20
        else
          $.dailyProgress = progressRatio

        const didStreakToday = util.isSameDay($.lastStreakDate, new Date())

        // If user is now above/equal to target xp and didn't do a streak today
        if (
          $.dailyXpCurrent > 0 &&
          $.dailyXpCurrent >= $.dailyXpTarget && !didStreakToday
        ) {
          $.streak++
          $.lastStreakDate = new Date()
        }
        // If user is now below target xp and did a streak today
        else if (
          ($.dailyXpCurrent <= 0 ||
            $.dailyXpCurrent < $.dailyXpTarget) && didStreakToday
        ) {
          $.streak--
          $.lastStreakDate = undefined
        }

        // Handle user's last xp date
        if (!util.isSameDay($.lastXpDate, new Date())) {
          $.dailyXpCurrent = 0
          $.lastXpDate = new Date()
        }
      })
    },

    reset() { set(defaultState) },
  }))
)


