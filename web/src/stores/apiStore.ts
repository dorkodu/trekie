import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { IUser } from "@api/types/user";
import type { IHabit } from "@api/types/habit";
import type { IMemory } from "@api/types/memory";
import type { IGoal } from "@api/types/goal";
import { util } from "@/lib/util";

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

  countHabit: (habit: IHabit, count: number) => void;

  addMemory: (memory: IMemory) => void;
  removeMemory: (memory: IMemory) => void;
  getMemories: (userId: string | undefined) => IMemory[];

  favouriteMemory: (memory: IMemory) => void;

  addGoal: (goal: IGoal) => void;
  removeGoal: (goal: IGoal) => void;
  getGoals: (userId: string | undefined) => IGoal[];

  changeXp: (amount: number) => void;

  reset: () => void;
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

export const useApiStore = create<ApiStoreState & ApiStoreAction>()(
  immer(
    persist(
      (set, get) => ({
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

            const newState = !targetUser.following;

            targetUser.following = newState;
            targetUser.followerCount += newState ? +1 : -1;
            currentUser.followingCount += newState ? +1 : -1;
          });
        },

        addHabit(habit) {
          set(s => {
            s.habits[habit.id] = habit;
            if (!s.userIdToHabitIds[habit.userId]) s.userIdToHabitIds[habit.userId] = [];
            s.userIdToHabitIds[habit.userId]?.push(habit.id);

            const currentUserId = s.userId;
            const currentUser = currentUserId && s.users[currentUserId];
            if (!currentUser) return;

            if (currentUserId !== habit.userId) return;
            currentUser.dailyXpTarget += habit.dailyTarget;
          });
        },

        removeHabit(habit) {
          set(s => {
            delete s.habits[habit.id];

            let userIdToHabitIds = s.userIdToHabitIds[habit.userId];
            if (!userIdToHabitIds) return;

            s.userIdToHabitIds[habit.userId] = userIdToHabitIds.filter(habitId => habitId !== habit.id);
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

        countHabit(habit, count) {
          let changeXp = false;

          set(state => {
            const targetHabitId = habit.id;
            const targetHabit = targetHabitId && state.habits[targetHabitId];
            if (!targetHabit) return;

            if (!targetHabit.heatmap) targetHabit.heatmap = {};

            const dayDiff = util.getDayDiff(habit.date, Date.now())

            let habitCount = targetHabit.heatmap[dayDiff];
            if (habitCount === undefined) habitCount = 0;

            if (habitCount <= 0 && count <= 0) return;

            habitCount += count;

            targetHabit.count += count;
            targetHabit.heatmap[dayDiff] = habitCount;

            changeXp = true;

            if (targetHabit.heatmap[dayDiff]! <= 0) delete targetHabit.heatmap[dayDiff];
          });

          if (changeXp) get().changeXp(count);
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

            let userIdToMemoryIds = s.userIdToMemoryIds[memory.userId];
            if (!userIdToMemoryIds) return;

            s.userIdToMemoryIds[memory.userId] = userIdToMemoryIds.filter(memoryId => memoryId !== memory.id);
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

            const newState = !targetMemory.favourited;

            targetMemory.favourited = newState;
            targetMemory.favourites += newState ? +1 : -1;
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

            let userIdToGoalIds = s.userIdToGoalIds[goal.userId];
            if (!userIdToGoalIds) return;

            s.userIdToGoalIds[goal.userId] = userIdToGoalIds.filter(goalId => goalId !== goal.id);
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

        changeXp(amount) {
          set(state => {
            const currentUserId = state.userId;
            const currentUser = currentUserId && state.users[currentUserId];
            if (!currentUser) return;

            // If current xp was higher than/equal to target xp, but now will be lower
            if (
              currentUser.dailyXpCurrent >= currentUser.dailyXpTarget &&
              currentUser.dailyXpCurrent + amount < currentUser.dailyXpTarget
            ) {
              currentUser.streaks--;
            }

            // If current xp was not higher than/equal to target xp, but now will be higher/equal
            if (
              currentUser.dailyXpCurrent < currentUser.dailyXpTarget &&
              currentUser.dailyXpCurrent + amount >= currentUser.dailyXpTarget
            ) {
              currentUser.streaks++;
            }

            currentUser.totalXp += amount;
            currentUser.dailyXpCurrent += amount;
          });
        },

        reset() {
          set(initialState);
        },
      }),
      {
        name: "api-store"
      }
    )
  )
);