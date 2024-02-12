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
  dailyXp: number

  targetXpDaily: number

  lastActive: Timestamp
  lastXp: Timestamp
  lastStreak: Timestamp
}


export type GameComponents = Record<string, TrekieComponent<any, any>>

export type TrekieStoreInterface = GameComponents & GameState & GameActions


export interface GameActions {
  updateStats: () => void
  reset: () => void
}

const initialState: GameState = {
  // stats, points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  lastActive: 1703846675432,

  targetXpDaily: 5,
  lastXp: 1703846675440,
  dailyXpCurrent: 0,
  lastStreakDate: 1703846675432,
  dailyProgress: 20,

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

    habitCount() { return Object.keys(get().habits).length },

    addHabit(habit) {
      set($ => {
        $.habits[habit.id] = habit

        // make sure has user + session
        const currentUserId = $.user?.id
        const currentUser = $.user
        if (!currentUser) return

        if (currentUserId !== habit.userId) return

        $.dailyXpTarget += habit.dailyTarget
      })
    },

    getHabit(id) {
      return get().habits[id]
    },

    removeHabit(id) {
      let updateStats = false
      let removedHabit = get().getHabit(id)

      set($ => {
        delete $.habits[id]

        const currentUser = $.user
        if (!currentUser || !removedHabit)
          return

        updateStats = true

        const habitDailyCurrent = removedHabit.heatmap[util.getDayDiff(removedHabit.createdAt.getTime(), Date.now())] ?? 0
        const habitDailyTarget = removedHabit.dailyTarget
        const habitCount = removedHabit.count

        $.xp -= habitCount
        $.dailyXpCurrent -= Math.min(
          habitDailyCurrent,
          habitDailyTarget
        )
        $.dailyXpTarget -= habitDailyTarget
      })

      if (updateStats) get().updateStats()
    },

    updateHabit(id, title, description, dailyTarget) {
      let updateStats = false

      set($ => {
        const habit = $.habits[id]
        if (!habit) return

        // make sure has active user session
        const user = $.user

        // make sure has active user session
        if (!user) return

        updateStats = true

        const habitDailyCurrent = habit.heatmap[util.getDayDiff(habit.createdAt.getTime(), Date.now())] ?? 0
        const habitDailyTarget = dailyTarget

        const habitDailyTargetDiff = habitDailyTarget - habit.dailyTarget

        habit.title = title
        habit.description = description
        habit.dailyTarget = dailyTarget

        $.dailyXpCurrent = Math.min(habitDailyTarget, habitDailyCurrent)
        $.dailyXpTarget += habitDailyTargetDiff
      })

      if (updateStats) get().updateStats()
    },

    trackHabit(habit, count) {
      let updateStats = false

      set($ => {
        const targetHabit = $.habits[habit.id]

        if (!targetHabit) return

        const user = $.user
        if (!user) return

        const dayDiff = util.getDayDiff(habit.createdAt.getTime(), Date.now())
        const habitCount = (targetHabit.heatmap[dayDiff] ?? 0) + count

        // Habit count can not be negative
        if (habitCount < 0) return

        updateStats = true

        targetHabit.count += count
        targetHabit.heatmap[dayDiff] = habitCount

        // If habit count has become 0, remove the property
        if (targetHabit.heatmap[dayDiff]! <= 0)
          delete targetHabit.heatmap[dayDiff]

        $.xp += count
        $.dailyXpCurrent += Math.max(
          Math.min(habit.dailyTarget - (habitCount - count), count),
          count
        )
      })

      if (updateStats) get().updateStats()
    },

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


