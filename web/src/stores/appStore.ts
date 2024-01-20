import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface AppStoreState {
  online: boolean;

  loading: {
    auth: boolean;
  }

  segments: {}

  menu: {
    opened: boolean
  },

  modals: {
    updateSW: {
      opened: boolean;
    }

    editProfile: {
      opened: boolean;
    }

    habitEditor: {
      opened: boolean;
      id?: string;
      title: string;
      description: string;
      dailyTarget: number;
    }
    goalEditor: {
      opened: boolean;
      id?: string;
      title: string;
      description: string;
    }
    memoryEditor: {
      opened: boolean;
      id?: string;
      description: string;
    }
  }
}

export interface AppStoreAction {
  menu: {
    toggle: () => void
    open: () => void
    close: () => void
  },
}

const initialState: AppStoreState = {
  online: false,

  loading: {
    auth: true,
  },

  menu: {
    opened: false
  },

  segments: {},

  modals: {
    updateSW: { opened: false },
    editProfile: { opened: false },
    habitEditor: { opened: false, title: "", description: "", dailyTarget: 0 },
    goalEditor: { opened: false, title: "", description: "" },
    memoryEditor: { opened: false, description: "" },
  },
}

export const useAppStore = create(
  immer<AppStoreState & AppStoreAction>((set, get) => ({
    ...initialState,

    menu: {
      opened: false,

      open() {
        set($ => {
          $.menu.opened = true
        })
      },

      close() {
        set($ => {
          $.menu.opened = false
        })
      },

      toggle() {
        set($ => {
          $.menu.opened = !$.menu.opened
        })
      },
    }
  }))
);
