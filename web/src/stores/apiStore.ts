import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { IUser } from "@api/types/user";
import type { IHabit } from "@api/types/habit";
import type { IMemory } from "@api/types/memory";
import type { IGoal } from "@api/types/goal";

export interface ApiStoreState {
  userId: string | undefined;

  users: Record<string, IUser>;
  habits: Record<string, IHabit>;
  memories: Record<string, IMemory>;
  goals: Record<string, IGoal>;

  usernameToUserId: Record<string, string>;
  userIdToHabitIds: Record<string, string[]>;
  userIdToMemoryIds: Record<string, string[]>;
  userIdToGoalIds: Record<string, string[]>;
}

export interface ApiStoreAction {
  addUser: (user: IUser) => void;
  removeUser: (user: IUser) => void;

  followUser: (user: IUser) => void;

  addHabit: (habit: IHabit) => void;
  removeHabit: (habit: IHabit) => void;
  getHabits: (userId: string | undefined) => IHabit[];

  addMemory: (memory: IMemory) => void;
  removeMemory: (memory: IMemory) => void;
  getMemories: (userId: string | undefined) => IMemory[];

  favouriteMemory: (memory: IMemory) => void;

  addGoal: (goal: IGoal) => void;
  removeGoal: (goal: IGoal) => void;
  getGoals: (userId: string | undefined) => IGoal[];
}

const initialState: ApiStoreState = {
  userId: undefined,

  users: {},
  habits: {},
  memories: {},
  goals: {},

  usernameToUserId: {},
  userIdToHabitIds: {},
  userIdToMemoryIds: {},
  userIdToGoalIds: {},
}

export const useApiStore = create(
  immer<ApiStoreState & ApiStoreAction>((set, get) => ({
    ...initialState,

    addUser(user) {
      set(s => {
        s.users[user.id] = user;
        s.usernameToUserId[user.username] = user.id;
      });
    },

    removeUser(user) {
      set(s => {
        delete s.users[user.id];
        delete s.usernameToUserId[user.username];
      });
    },

    followUser(user) {
      set(state => {
        const currentUserId = state.userId;
        const currentUser = currentUserId && state.users[currentUserId];
        if (!currentUser) return;

        const targetUserId = user.id;
        const targetUser = targetUserId && state.users[targetUserId];
        if (!targetUser) return;

        targetUser.following = !targetUser.following;
        targetUser.followerCount += targetUser.following ? +1 : -1;
        currentUser.followingCount += targetUser.following ? +1 : -1;
      });
    },

    addHabit(habit) {
      set(s => {
        s.habits[habit.id] = habit;
        if (!s.userIdToHabitIds[habit.userId]) s.userIdToHabitIds[habit.userId] = [];
        s.userIdToHabitIds[habit.userId]?.push(habit.id);
      });
    },

    removeHabit(habit) {
      set(s => {
        delete s.habits[habit.id];
        delete s.userIdToHabitIds[habit.userId];
      });
    },

    getHabits(userId) {
      if (!userId) return [];

      const habits = get().habits;
      const userIdToHabitIds = get().userIdToHabitIds;

      const habitIds = userIdToHabitIds[userId];
      if (!habitIds) return [];

      return habitIds.map(habitId => habits[habitId]).filter(Boolean) as IHabit[];
    },

    addMemory(memory) {
      set(s => {
        s.memories[memory.id] = memory;
        if (!s.userIdToMemoryIds[memory.userId]) s.userIdToMemoryIds[memory.userId] = [];
        s.userIdToMemoryIds[memory.userId]?.push(memory.id);
      });
    },

    removeMemory(memory) {
      set(s => {
        delete s.memories[memory.id];
        delete s.userIdToMemoryIds[memory.userId];
      });
    },

    getMemories(userId) {
      if (!userId) return [];

      const memories = get().memories;
      const userIdToMemoryIds = get().userIdToMemoryIds;

      const memoryIds = userIdToMemoryIds[userId];
      if (!memoryIds) return [];

      return memoryIds.map(memoryId => memories[memoryId]).filter(Boolean) as IMemory[];
    },

    favouriteMemory(memory) {
      set(state => {
        const targetMemoryId = memory.id;
        const targetMemory = targetMemoryId && state.memories[targetMemoryId];
        if (!targetMemory) return;

        targetMemory.favourited = !targetMemory.favourited;
        targetMemory.favourites += targetMemory.favourited ? +1 : -1;
      });
    },

    addGoal(goal) {
      set(s => {
        s.goals[goal.id] = goal;
        if (!s.userIdToGoalIds[goal.userId]) s.userIdToGoalIds[goal.userId] = [];
        s.userIdToGoalIds[goal.userId]?.push(goal.id);
      });
    },

    removeGoal(goal) {
      set(s => {
        delete s.goals[goal.id];
        delete s.userIdToGoalIds[goal.userId];
      });
    },

    getGoals(userId) {
      if (!userId) return [];

      const goals = get().goals;
      const userIdToGoalIds = get().userIdToGoalIds;

      const goalIds = userIdToGoalIds[userId];
      if (!goalIds) return [];

      return goalIds.map(goalId => goals[goalId]).filter(Boolean) as IGoal[];

    },
  }))
);
