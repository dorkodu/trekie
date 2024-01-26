import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// misc
import { Maybe, Timestamp, util } from '#/lib/util'

// commons
import { IUser } from '#/commons/user'
import { Component as HabitComponent, IHabit } from '#/commons/habit'
import { Component as GoalComponent } from '#/commons/goal'
import { Component as SocialComponent } from '#/commons/social'
import { Component as StoryComponent } from '#/commons/story'
import { IStory } from '#/commons/story'
import { IGoal } from '#/commons/goal'

export interface GameState {
  user: Maybe<IUser>

  goals: Record<string, IGoal>

  xp: number
  coins: number
  momentum: number
  streak: number

  daily: {
    progress: number
    xp: number
  }

  targetXpDaily: number

  last: {
    active: Timestamp
    xp: Timestamp,
    streak?: Timestamp
  }
}

export interface GameComponents {
  habit: HabitComponent
  story: StoryComponent
  goal: GoalComponent
  social: SocialComponent
}

export interface GameActions {
  updateStats: () => void
  reset: () => void
}

const defaultState: GameState = {
  user: undefined,

  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  daily: 0,
  lastXpDate: new Date(),
  dailyXpCurrent: 0,
  lastStreakDate: new Date(),
  dailyProgress: 20,

  habits: {},
  stories: {},
  goals: {},
}

const initialState: GameState = {
  // stats, points
  xp: 0,
  coins: 3,
  momentum: 0,
  streak: 0,

  dailyXpTarget: 5,
  lastXpDate: new Date(1703846675440),
  dailyXpCurrent: 0,
  lastStreakDate: new Date(1703846675432),
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

  habits: {
    '1': {
      id: '1',
      userId: '1',
      title: 'Check Trekie Every Day!',
      description: 'See your life goals, check your habits and stay on track. Never lose your momentum.',
      count: 0,
      createdAt: new Date(1703846675436),
      lastUpdated: new Date(1703846675436),
      heatmap: [0, 1, 4, 5, 0, 2],
      dailyTarget: 5,
    },
  },

  stories: {},

  goals: {},
}

export const useTrekieStore = create<GameState & GameComponents>()(
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
