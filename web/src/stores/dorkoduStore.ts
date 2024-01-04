import { IUser } from '@sdk/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { useAppStore } from './appStore'
import { useSocialStore } from './socialStore'

export interface DorkoduAction {
  auth: (user: IUser | undefined) => void
  logout: () => void
}

export interface DorkoduState {
  userId: string | undefined
  accountId: string | undefined

  deviceId: string | undefined
}

const initialState: DorkoduState = {
  userId: undefined,
  accountId: undefined,

  deviceId: "0xDoruksPod"
}

export type DorkoduStoreInterface = DorkoduState & DorkoduAction

export const useDorkoduStore = create<DorkoduStoreInterface>()(
  immer(
    persist(
      (set, get) => ({
        ...initialState,

        auth(user) {
          // If user has created an account before, they can use the app offline.
          // If they didn't, when provided user is undefined:
          // - auth will fail
          // - loader will be removed
          // - browser will navigate to join

          if (user) {
            set(s => {
              s.userId = user.id
            })

            useSocialStore.getState().addUser(user)
            useSocialStore.getState().updateStats()
          }

          useAppStore.setState(s => {
            s.loading.auth = false
          })
        },

        logout() {
          set(s => {
            s.userId = undefined
          })
          useAppStore.setState(s => {
            s.loading.auth = true
          })
        },
      }),
      {
        name: 'dorkodu-store',
      }
    )
  )
)
