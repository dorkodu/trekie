import { trpc } from '@web/lib/trpc'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SettingsState {
  loaded: boolean
  syncing: boolean
  error?: string
  preferences: {
    theme?: 'light' | 'dark' | 'system'
    language?: string
  }
  config: {
    notificationsEmail?: boolean
  }
  onboarding: {
    completed?: boolean
    step?: number
  }
  // actions
  hydrate: () => Promise<void>
  update: (data: Partial<Pick<SettingsState, 'preferences' | 'config' | 'onboarding'>>) => Promise<void>
  optimisticUpdate: (data: Partial<Pick<SettingsState, 'preferences' | 'config' | 'onboarding'>>) => void
}

const initial: Omit<SettingsState, 'hydrate' | 'update' | 'optimisticUpdate'> = {
  loaded: false,
  syncing: false,
  preferences: { theme: 'system' },
  config: { notificationsEmail: true },
  onboarding: { completed: false, step: 0 },
}

export const useSettingsStore = create<SettingsState>()(persist((set, get) => ({
  ...initial,
  async hydrate() {
    if (get().loaded) return
    try {
      set({ syncing: true })
      const data = await trpc.user.getSettings.query({})
      set({
        loaded: true,
        preferences: data.preferences || initial.preferences,
        config: data.config || initial.config,
        onboarding: data.onboarding || initial.onboarding,
        syncing: false,
      })
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load settings', syncing: false })
    }
  },
  optimisticUpdate(data) {
    set({
      ...data.preferences ? { preferences: { ...get().preferences, ...data.preferences } } : {},
      ...data.config ? { config: { ...get().config, ...data.config } } : {},
      ...data.onboarding ? { onboarding: { ...get().onboarding, ...data.onboarding } } : {},
    })
  },
  async update(data) {
    const snapshot = get()
    get().optimisticUpdate(data)
    try {
      await trpc.user.updateSettings.mutate(data)
    } catch (e: any) {
      // rollback
      set({
        preferences: snapshot.preferences,
        config: snapshot.config,
        onboarding: snapshot.onboarding,
        error: e?.message || 'Failed to update settings'
      })
    }
  }
}), { name: 'trekie-settings' }))
