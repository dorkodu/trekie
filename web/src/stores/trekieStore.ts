import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { IUser, IHabit, IStory, IGoal } from '@sdk/types'

import { Maybe, util } from '#/lib/util'

import { useAppStore } from './appStore'
import { useDorkoduStore } from './dorkoduStore'
import { useSocialStore } from './socialStore'

export interface TrekieStoreState {
  user: Maybe<IUser>

  habits: Record<string, IHabit>
  stories: Record<string, IStory>
  goals: Record<string, IGoal>

  xp: number
  coins: number
  momentum: number
}

export interface TrekieStoreAction {
  // HABIT
  addHabit: (habit: IHabit) => void
  getHabit: (id: string) => Maybe<IHabit>
  removeHabit: (habit: IHabit) => void
  updateHabit: (id: string, title: string, description: string, dailyTarget: number) => void
  trackHabit: (habit: IHabit, count: number) => void
  habitCount: () => number

  // STORY
  addStory: (memory: IStory) => void
  removeStory: (id: string) => void
  getStory: (id: string) => Maybe<IStory>

  // GOAL
  addGoal: (goal: IGoal) => void
  removeGoal: (id: string) => void
  getGoal: (id: string) => Maybe<IGoal>

  // STATS
  updateStats: () => void

  // GENERAL
  reset: () => void
}

const defaultState: TrekieStoreState = {
  user: undefined,

  xp: 0,
  coins: 0,
  momentum: 0,

  habits: {},
  stories: {},
  goals: {},
}

const initialState: TrekieStoreState = {
  // stats, points
  xp: 500,
  coins: 10,
  momentum: 0,

  user: {
    id: '0',
    username: 'dorukeray',
    name: 'Doruk Eray',
    bio: 'Founder, Polymath, Craftsman.',
    email: 'doruk@dorkodu.com',
    premium: true,
    joinedAt: new Date(1703846675432),
    xp: 100,
    dailyXpTarget: 5,
    streaks: 0,
    lastXpDate: new Date(1703846675440),
    dailyXpCurrent: 0,
    followerCount: 0,
    followingCount: 0,
    lastStreakDate: new Date(1703846675432),
  },

  habits: {
    '1': {
      id: '0',
      title: 'Check Trekie Every Day!',
      description: 'See your life goals, check your habits and stay on track. Never lose your momentum.',
      count: 0,
      date: 1703685605,
      heatmap: [0, 1, 4, 5, 0, 2],
      dailyTarget: 5,
      userId: '0',
    },
  },

  stories: {},

  goals: {},
}

export const useTrekieStore = create<TrekieStoreState & TrekieStoreAction>()(
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

        currentUser.dailyXpTarget += habit.dailyTarget
      })
    },

    getHabit(id) {
      return get().habits[id]
    },

    removeHabit(habit) {
      let updateStats = false

      set($ => {
        delete $.habits[habit.id]

        const currentUser = $.user
        if (!currentUser || currentUser.id !== habit.userId)
          return

        updateStats = true

        const habitDailyCurrent =
          habit.heatmap[util.getDayDiff(habit.date, Date.now())] ?? 0
        const habitDailyTarget = habit.dailyTarget
        const habitCount = habit.count

        currentUser.xp -= habitCount
        currentUser.dailyXpCurrent -= Math.min(
          habitDailyCurrent,
          habitDailyTarget
        )
        currentUser.dailyXpTarget -= habitDailyTarget
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

        const habitDailyCurrent = habit.heatmap[util.getDayDiff(habit.date, Date.now())] ?? 0
        const habitDailyTarget = dailyTarget

        const habitDailyTargetDiff = habitDailyTarget - habit.dailyTarget

        habit.title = title
        habit.description = description
        habit.dailyTarget = dailyTarget

        user.dailyXpCurrent = Math.min(habitDailyTarget, habitDailyCurrent)
        user.dailyXpTarget += habitDailyTargetDiff
      })

      if (updateStats) get().updateStats()
    },

    trackHabit(habit, count) {
      let updateStats = false

      set($ => {
        const targetHabit = habit.id && $.habits[habit.id]
        if (!targetHabit) return

        const user = $.user
        if (!user) return

        const dayDiff = util.getDayDiff(habit.date, Date.now())
        const habitCount = (targetHabit.heatmap[dayDiff] ?? 0) + count

        // Habit count can not be negative
        if (habitCount < 0) return

        updateStats = true

        targetHabit.count += count
        targetHabit.heatmap[dayDiff] = habitCount

        // If habit count has become 0, remove the property
        if (targetHabit.heatmap[dayDiff]! <= 0)
          delete targetHabit.heatmap[dayDiff]

        user.xp += count
        user.dailyXpCurrent += Math.max(
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

        const didStreakToday = util.isSameDay(currentUser.lastStreakDate, new Date())

        // If user is now above/equal to target xp and didn't do a streak today
        if (
          currentUser.dailyXpCurrent > 0 &&
          currentUser.dailyXpCurrent >= currentUser.dailyXpTarget &&
          !didStreakToday
        ) {
          currentUser.streaks++
          currentUser.lastStreakDate = new Date()
        }
        // If user is now below target xp and did a streak today
        else if (
          (currentUser.dailyXpCurrent <= 0 ||
            currentUser.dailyXpCurrent < currentUser.dailyXpTarget) &&
          didStreakToday
        ) {
          currentUser.streaks--
          currentUser.lastStreakDate = undefined
        }

        // Handle user's last xp date
        if (!util.isSameDay(currentUser.lastXpDate, new Date())) {
          currentUser.dailyXpCurrent = 0
          currentUser.lastXpDate = new Date()
        }
      })
    },

    reset() {
      set(defaultState)
    },
  }))
)
