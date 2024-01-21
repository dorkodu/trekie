import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

import type { IUser, IHabit, IStory as IStory, IGoal } from '../../../core/src/types'

import { util } from '#/lib/util'

import { useAppStore } from './appStore'

export interface SocialStoreState {
  userId: string | undefined

  users: Record<string, IUser>
  habits: Record<string, IHabit>
  stories: Record<string, IStory>
  goals: Record<string, IGoal>

  index: {
    usernameToUserId: Record<string, string>
    userIdToHabitIds: Record<string, string[]>
    userIdToStoryIds: Record<string, string[]>
    userIdToGoalIds: Record<string, string[]>
  }
}

export interface SocialStoreAction {
  // User
  addUser: (user: IUser) => void
  removeUser: (user: IUser) => void
  updateUser: (userId: string, username: string) => void

  // Social
  followUser: (user: IUser) => void
  blockUser: (user: IUser) => void
  unfollowUser: (user: IUser) => void

  // Story
  addStory: (story: IStory) => void
  removeStory: (story: IStory) => void
  getStories: (user: IUser) => IStory[]
  getStory: (storyId: string) => IStory | undefined
  likeStory: (story: IStory) => void

  // Stats
  updateStats: () => void

  reset: () => void
}

const defaultState: SocialStoreState = {
  userId: undefined,

  // database
  users: {},

  habits: {},

  stories: {},

  goals: {},

  index: {
    usernameToUserId: {},
    userIdToHabitIds: {},
    userIdToStoryIds: {},
    userIdToGoalIds: {},
  },
}

const initialState: SocialStoreState = {
  userId: undefined,

  // database
  users: {},

  habits: {},

  stories: {},

  goals: {},

  index: {
    usernameToUserId: {
      dorukeray: '0',
    },

    userIdToHabitIds: {
      '0': ['1'],
    },

    userIdToStoryIds: {},

    userIdToGoalIds: {},
  },
}


export const useSocialStore = create<SocialStoreState & SocialStoreAction>()(
  immer((set, get) => ({
    ...initialState,

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
        s.stories[memory.id] = memory
        if (!s.index.userIdToStoryIds[memory.userId])
          s.index.userIdToStoryIds[memory.userId] = []
        s.index.userIdToStoryIds[memory.userId]?.push(memory.id)
      })
    },

    removeMemory(memory) {
      set(s => {
        delete s.stories[memory.id]

        let userIdToMemoryIds = s.index.userIdToStoryIds[memory.userId]
        if (!userIdToMemoryIds) return

        s.index.userIdToStoryIds[memory.userId] = userIdToMemoryIds.filter(
          memoryId => memoryId !== memory.id
        )
      })
    },

    getMemories(userId) {
      if (!userId) return []

      const memories = get().stories
      const userIdToMemoryIds = get().index.userIdToStoryIds

      const memoryIds = userIdToMemoryIds[userId]
      if (!memoryIds) return []

      return memoryIds
        .map(memoryId => memories[memoryId])
        .filter(Boolean) as IStory[]
    },

    favouriteMemory(memory) {
      set(state => {
        const targetMemoryId = memory.id
        const targetMemory = targetMemoryId && state.stories[targetMemoryId]
        if (!targetMemory) return

        const newState = !targetMemory.favourited

        targetMemory.favourited = newState
        targetMemory.favourites += newState ? +1 : -1
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
