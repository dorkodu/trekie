import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Route = "home" | "explore" | "track" | "community" | "marketplace" | "any";

export interface AppStoreState {
  online: boolean;

  route: Route;

  loading: {
    auth: boolean;
  }

  segments: {}
  modals: {
    updateSW: {
      opened: boolean;
    }

    editProfile: {
      opened: boolean;
    }
  }
}

export interface AppStoreAction {

}

const initialState: AppStoreState = {
  online: false,

  route: "any",

  loading: {
    auth: true,
  },

  segments: {},
  modals: {
    updateSW: { opened: false },
    editProfile: { opened: false },
  },
}

export const useAppStore = create(
  immer<AppStoreState & AppStoreAction>((_set, _get) => ({
    ...initialState,
  }))
);
