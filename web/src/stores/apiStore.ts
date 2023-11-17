import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { IUser } from "@api/types/user";
import type { IHabit } from "@api/types/habit";
import type { IMemory } from "@api/types/memory";

export interface ApiStoreState {
  userId: string | undefined;

  users: Record<string, IUser>;
  habits: Record<string, IHabit>;
  memories: Record<string, IMemory>;

  usernameToUserId: Record<string, string>;
  userIdToHabitIds: Record<string, string[]>;
  userIdToMemoryIds: Record<string, string[]>;
}

export interface ApiStoreAction {
  addUser: (user: IUser) => void;
  removeUser: (user: IUser) => void;

  addHabit: (habit: IHabit) => void;
  removeHabit: (habit: IHabit) => void;
  getHabits: (userId: string | undefined) => IHabit[];

  addMemory: (memory: IMemory) => void;
  removeMemory: (memory: IMemory) => void;
  getMemories: (userId: string | undefined) => IMemory[];
}

const initialState: ApiStoreState = {
  userId: undefined,

  users: {},
  habits: {},
  memories: {},

  usernameToUserId: {},
  userIdToHabitIds: {},
  userIdToMemoryIds: {},
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
  }))
);
