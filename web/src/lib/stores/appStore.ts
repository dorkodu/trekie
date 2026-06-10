import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface AppStoreState {
  loading: {
    auth?: boolean;
    data?: boolean;
    ui?: boolean;
  }
}

const initialState: AppStoreState = {
  loading: {
    auth: false,
    data: false,
    ui: false
  }
};

export const useAppStore = create(
  immer<AppStoreState>(() => ({
    ...initialState,
  }))
);
