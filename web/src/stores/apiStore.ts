import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { IUser } from "@api/types/user";
import type { IHabit } from "@api/types/habit";

export interface ApiStoreState {
  userId: string | undefined;

  users: Record<string, IUser>;
  habits: Record<string, IHabit>;

  usernameToUserId: Record<string, string>;
  userIdToHabitIds: Record<string, string[]>;
}

export interface ApiStoreAction {
  addUser: (user: IUser) => void;
  removeUser: (user: IUser) => void;

  addHabit: (habit: IHabit) => void;
  removeHabit: (habit: IHabit) => void;
}

const initialState: ApiStoreState = {
  userId: undefined,

  users: {},
  habits: {},

  usernameToUserId: {},
  userIdToHabitIds: {},
}

export const useApiStore = create(
  immer<ApiStoreState & ApiStoreAction>((set, _get) => ({
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
        delete s.users[habit.id];
        delete s.userIdToHabitIds[habit.userId];
      });
    },
  }))
);
