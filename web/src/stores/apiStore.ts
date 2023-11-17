import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { IUser } from "@api/types/user";

export interface ApiStoreState {
  authorized: boolean;
  user: string | undefined;

  users: Record<string, IUser>;
}

export interface ApiStoreAction {

}

const initialState: ApiStoreState = {
  authorized: false,
  user: undefined,

  users: {},
}

export const useApiStore = create(
  immer<ApiStoreState & ApiStoreAction>((_set, _get) => ({
    ...initialState,
  }))
);
