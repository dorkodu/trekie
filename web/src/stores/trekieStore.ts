import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

import type { IUser, IHabit, IStory, IGoal } from '@sdk/types'

import { Maybe, util } from '#/lib/util'

import { useAppStore } from './appStore'
import { useDorkoduStore } from './dorkoduStore'
import { useSocialStore } from './socialStore'

export interface TrekieStoreState {
  userId: Maybe<string>
  user: Maybe<IUser>

  habits: Record<string, IHabit>
  memories: Record<string, IStory>
  goals: Record<string, IGoal>

  xp: number
  coins: number

  momentum: number
}

export interface TrekieStoreAction {
  addHabit: (habit: IHabit) => void
  removeHabit: (habit: IHabit) => void

  updateHabit: (id: string, title: string, description: string, dailyTarget: number) => void

  getHabits: (userId: string | undefined) => IHabit[]

  habitCount: () => number

  trackHabit: (habit: IHabit, count: number) => void

  addMemory: (memory: IStory) => void
  removeMemory: (memory: IStory) => void

  getStories: () => IStory[]
  getStory: (id: string) => IStory

  addGoal: (goal: IGoal) => void
  removeGoal: (goal: IGoal) => void
  getGoals: (userId: string | undefined) => IGoal[]
  getGoal: (id: string) => IGoal | null

  updateStats: () => void

  reset: () => void
}

const defaultState: TrekieStoreState = {
  userId: undefined,
  user: undefined,

  // stats, points
  xp: 0,
  coins: 0,

  // database
  user: undefined,

  habits: {},

  memories: {},

  goals: {},

  index: {
    usernameToUserId: {},
    userIdToHabitIds: {},
    userIdToMemoryIds: {},
    userIdToGoalIds: {},
  },
}

const initialState: TrekieStoreState = {
  userId: '0',

  // stats, points
  xp: 500,
  coins: 10,

  user: {
    id: '0',
    username: 'dorukeray',
    name: 'Doruk Eray',
    bio: 'Founder, Polymath, Craftsman.',
    email: 'doruk@dorkodu.com',
    premium: true,
    joinedAt: new Date(1703846675432),
  },

  habits: {
    '1': {
      id: '0',
      title: 'Check Trekie Every Day!',
      description:
        'See your life goals, check your habits and stay on track. Never lose your momentum.',
      count: 0,
      date: 1703685605,
      heatmap: [0, 1, 4, 5, 0, 2],
      dailyTarget: 5,
      userId: '0',
    },
  },

  memories: {},

  goals: {},
}

export const useTrekieStore = create<TrekieStoreState & TrekieStoreAction>()(
  immer((set, get) => ({
    ...initialState,

    habitCount() {
      return 5
    },

    addUser(user) {
      set(s => {
        s.users[user.id] = user
        s.index.usernameToUserId[user.username] = user.id
      })
    },

    removeUser(user) {
      set(s => {
        delete s.users[user.id]
        delete s.index.usernameToUserId[user.username]
      })
    },

    updateUser(userId, username) {
      set(s => {
        const user = s.users[userId]
        if (!user) return

        delete s.index.usernameToUserId[user.username]
        s.index.usernameToUserId[username] = user.id

        user.username = username
      })
    },

    followUser(user) {
      set(state => {
        const currentUserId = state.userId
        const currentUser = currentUserId && state.users[currentUserId]
        if (!currentUser) return

        const targetUserId = user.id
        const targetUser = targetUserId && state.users[targetUserId]
        if (!targetUser) return

        const newState = !targetUser.following

        targetUser.following = newState
        targetUser.followerCount += newState ? +1 : -1
        currentUser.followingCount += newState ? +1 : -1
      })
    },

    addHabit(habit) {
      set(s => {
        s.habits[habit.id] = habit
        if (!s.index.userIdToHabitIds[habit.userId])
          s.index.userIdToHabitIds[habit.userId] = []
        s.index.userIdToHabitIds[habit.userId]?.push(habit.id)

        const currentUserId = s.userId
        const currentUser = currentUserId && s.users[currentUserId]
        if (!currentUser) return

        if (currentUserId !== habit.userId) return
        currentUser.dailyXpTarget += habit.dailyTarget
      })
    },

    removeHabit(habit) {
      let updateStats = false

      set(s => {
        delete s.habits[habit.id]

        let userIdToHabitIds = s.index.userIdToHabitIds[habit.userId]
        if (!userIdToHabitIds) return

        s.index.userIdToHabitIds[habit.userId] = userIdToHabitIds.filter(
          habitId => habitId !== habit.id
        )

        const currentUserId = s.userId
        const currentUser = currentUserId && s.users[currentUserId]
        if (!currentUser || currentUser.id !== habit.userId) return

        updateStats = true

        const habitDailyCurrent =
          habit.heatmap[util.getDayDiff(habit.date, Date.now())] ?? 0
        const habitDailyTarget = habit.dailyTarget
        const habitCount = habit.count

        currentUser.totalXp -= habitCount
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

      set(s => {
        const habit = s.habits[id]
        if (!habit) return

        const user = s.users[habit.userId]
        if (!user) return

        updateStats = true

        const habitDailyCurrent =
          habit.heatmap[util.getDayDiff(habit.date, Date.now())] ?? 0
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

    getHabits(userId) {
      if (!userId) return []

      const habits = get().habits
      const userIdToHabitIds = get().index.userIdToHabitIds

      const habitIds = userIdToHabitIds[userId]
      if (!habitIds) return []

      return habitIds
        .map(habitId => habits[habitId])
        .filter(Boolean) as IHabit[]
    },

    trackHabit(habit, count) {
      let updateStats = false

      set(state => {
        const targetHabit = habit.id && state.habits[habit.id]
        if (!targetHabit) return

        const targetUser = state.users[habit.userId]
        if (!targetUser) return

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

        targetUser.totalXp += count
        targetUser.dailyXpCurrent += Math.max(
          Math.min(habit.dailyTarget - (habitCount - count), count),
          count
        )
      })

      if (updateStats) get().updateStats()
    },

    addMemory(memory) {
      set(s => {
        s.memories[memory.id] = memory
        if (!s.index.userIdToMemoryIds[memory.userId])
          s.index.userIdToMemoryIds[memory.userId] = []
        s.index.userIdToMemoryIds[memory.userId]?.push(memory.id)
      })
    },

    removeMemory(memory) {
      set(s => {
        delete s.memories[memory.id]

        let userIdToMemoryIds = s.index.userIdToMemoryIds[memory.userId]
        if (!userIdToMemoryIds) return

        s.index.userIdToMemoryIds[memory.userId] = userIdToMemoryIds.filter(
          memoryId => memoryId !== memory.id
        )
      })
    },

    getStories(userId) {
      if (!userId) return []

      const memories = get().memories
      const userIdToMemoryIds = get().index.userIdToMemoryIds

      const memoryIds = userIdToMemoryIds[userId]
      if (!memoryIds) return []

      return memoryIds
        .map(memoryId => memories[memoryId])
        .filter(Boolean) as IStory[]
    },

    favouriteMemory(memory) {
      set(state => {
        const targetMemoryId = memory.id
        const targetMemory = targetMemoryId && state.memories[targetMemoryId]
        if (!targetMemory) return

        const newState = !targetMemory.likedByMe

        targetMemory.likedByMe = newState
        targetMemory.likes += newState ? +1 : -1
      })
    },

    addGoal(goal) {
      set(s => {
        s.goals[goal.id] = goal
        if (!s.index.userIdToGoalIds[goal.userId])
          s.index.userIdToGoalIds[goal.userId] = []
        s.index.userIdToGoalIds[goal.userId]?.push(goal.id)
      })
    },

    removeGoal(goal) {
      set(s => {
        delete s.goals[goal.id]

        let userIdToGoalIds = s.index.userIdToGoalIds[goal.userId]
        if (!userIdToGoalIds) return

        s.index.userIdToGoalIds[goal.userId] = userIdToGoalIds.filter(
          goalId => goalId !== goal.id
        )
      })
    },

    getGoals(userId) {
      if (!userId) return []

      const goals = get().goals
      const userIdToGoalIds = get().index.userIdToGoalIds

      const goalIds = userIdToGoalIds[userId]
      if (!goalIds) return []

      return goalIds.map(goalId => goals[goalId]).filter(Boolean) as IGoal[]
    },

    updateStats() {
      set(state => {
        const currentUserId = state.userId
        const currentUser = currentUserId && state.users[currentUserId]
        if (!currentUser) return

        const didStreakToday = util.isSameDay(
          currentUser.lastStreakDate,
          Date.now()
        )

        // If user is now above/equal to target xp and didn't do a streak today
        if (
          currentUser.dailyXpCurrent > 0 &&
          currentUser.dailyXpCurrent >= currentUser.dailyXpTarget &&
          !didStreakToday
        ) {
          currentUser.streaks++
          currentUser.lastStreakDate = Date.now()
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
        if (!util.isSameDay(currentUser.lastXpDate, Date.now())) {
          currentUser.dailyXpCurrent = 0
          currentUser.lastXpDate = Date.now()
        }
      })
    },

    reset() {
      get().logout()
      set(initialState)
    },
  }))
)
