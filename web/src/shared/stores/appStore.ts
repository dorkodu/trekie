import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import trekie from "@/shared/lib/trekie";
import { IUser } from "@/core/Trekie";
import { LogKind, log } from "@/shared/utils/log";

export interface AppStoreState {
  online: boolean;

  session?: {
    userId: string
    timestamp: number
  }

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

  auth: {
    login: (user: IUser) => boolean
    logout: () => void
  }
}

const initialState: AppStoreState = {
  online: false,

  loading: {
    auth: false,
  },

  session: undefined,

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
    },

    auth: {
      login(user) {
        // If user has created an account before, they can use the app offline.
        // If they didn't, when provided user is undefined:
        // - auth will fail
        // - loader will be removed
        // - browser will navigate to join
        try {
          if (user) {
            set($ => {
              $.session = {
                userId: user.id,
                timestamp: Date.now()
              }
            })

            trekie.db.users.add(user)
          }

          useAppStore.setState($ => {
            $.loading.auth = false
          })

          return true
        } catch (error) {
          log(error, LogKind.ERROR)
          return false
        }
      },

      logout() {
        set($ => {
          $.session = undefined
        })
        useAppStore.setState($ => {
          $.loading.auth = true
        })
      },
    }
  }))
);
