import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { items as marketItems } from './data'
import type { Item, UserInventory } from './types'

interface MarketState {
  // Market data
  items: Item[]
  inventory: UserInventory

  // Actions
  addPowerUp: (itemId: string, quantity?: number) => void
  removePowerUp: (itemId: string, quantity?: number) => void
  hasPowerUp: (itemId: string) => boolean
  getPowerUpQuantity: (itemId: string) => number
  resetInventory: () => void
}

// Initial inventory state
const initialInventory: UserInventory = {
  powerUps: {
    '1': 0,
    '2': 0,
    '3': 0,
  }
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      inventory: initialInventory,
      items: marketItems,

      addPowerUp: (itemId: string, quantity = 1) =>
        set(state => ({
          inventory: {
            ...state.inventory,
            powerUps: {
              ...state.inventory.powerUps,
              [itemId]: (state.inventory.powerUps[itemId] || 0) + quantity
            }
          }
        })),

      removePowerUp: (itemId: string, quantity = 1) =>
        set(state => ({
          inventory: {
            ...state.inventory,
            powerUps: {
              ...state.inventory.powerUps,
              [itemId]: Math.max(0, (state.inventory.powerUps[itemId] || 0) - quantity)
            }
          }
        })),

      hasPowerUp: (itemId: string) =>
        (get().inventory.powerUps[itemId] || 0) > 0,

      getPowerUpQuantity: (itemId: string) =>
        get().inventory.powerUps[itemId] || 0,

      resetInventory: () =>
        set({ inventory: initialInventory })
    }),
    {
      name: 'trekie-market-storage'
    }
  )
)
