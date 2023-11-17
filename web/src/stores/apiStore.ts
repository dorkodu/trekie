import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { IUser } from "@api/types/user";

export interface ApiStoreState {
  userId: string | undefined;

  users: Record<string, IUser>;
  usernameToId: Record<string, string>;
}

export interface ApiStoreAction {

}

const initialState: ApiStoreState = {
  userId: undefined,

  users: {},
  usernameToId: {},
}

export const useApiStore = create(
  immer<ApiStoreState & ApiStoreAction>((_set, _get) => ({
    ...initialState,
  }))
);
