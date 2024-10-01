import { useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'

// misc
import { Daystamp, Maybe, Timestamp, daystamp, utils } from '@/shared/utils'

import { IUser } from '@/core/account'

export interface GameState {
  user: IUser

  xp: number
  coins: number
  momentum: number
  streak: number

  xpTargetDaily: number

  lastActive: Maybe<Timestamp>
  lastXp: Maybe<Timestamp>
  lastStreak: Maybe<Timestamp>
  lastDailyCheck: Maybe<Timestamp>,

  xpHistory: { [date: Daystamp]: number }
}

export interface GameActions {
  xpToday: () => number
  dailyProgress: () => number
  averageXp: () => number

  calculateStreak: () => void
  calculateMomentum: () => void

  refresh: () => void
  dailyRefresh: () => void
  reset: () => void
}

export interface GameMutations {
  changeXp: (change: number) => void,
  changeCoinsBalance: (change: number) => void,
}

export type StoreInterface = GameState & GameActions
export type VanillaGame = ReturnType<typeof Game>["game"]
export type ReactiveGame = ReturnType<typeof Game>["useGame"]

export type ReadOnlyStoreInterface = Omit<StoreInterface, keyof GameMutations>;
export type ReadOnlyVanillaGame = ReturnType<typeof Game>["readOnlyGame"];
export type ReadOnlyReactiveGame = ReturnType<typeof Game>["useReadOnlyGame"];



export function Game(state: GameState) {
  const game = createStore<StoreInterface>()(
    persist(
      immer((set, get) => ({
        ...state,

        dailyProgress() {
          let ratio = get().xpToday() / get().xpTargetDaily
          return ratio
        },

        calculateStreak() {
          set($ => {
            $.streak = calculateStreak($.xpHistory, $.xpTargetDaily)
          })
        },

        xpToday() {
          return get().xpHistory[daystamp.today()] ?? 0
        },

        dailyRefresh() {
          set($ => {
            // first we reset stale values
            if (!utils.isSameDay($.lastActive, Date.now()))
              $.xpHistory[daystamp.today()] = 0 // reset daily xp

            // then we calculate new values
            $.xpTargetDaily = 100

            $.xpHistory[daystamp.today()] = 0

            // update last active date
            $.lastActive = Date.now()
          })

          get().refresh()
        },

        averageXp() {
          const xpHistory = get().xpHistory
          const activeDays = Object.entries(xpHistory).filter(([_, xp]) => xp !== 0)
          const totalXp = activeDays.reduce((sum, [, xp]) => sum + xp, 0)
          const averageXp = Math.floor(totalXp / activeDays.length)

          if (isNaN(averageXp)) return 0
          else return averageXp
        },

        calculateMomentum() {
          let averageXp = get().averageXp()
          set($ => {
            $.momentum = averageXp // for now, momentum is just average xp
          })
        },

        refresh() {
          /* reconcile, align all values together, 'cuz some depend on each other for calculations. */
          const user = get().user
          if (!user) return

          set($ => {
            // first we reset stale values
            if (!utils.isSameDay($.lastActive, Date.now()))
              $.xpHistory[daystamp.today()] = 0 // reset daily xp

            $.lastActive = Date.now()
          })

          get().calculateStreak()
          get().calculateMomentum()
        },
        reset() {
          set({
            xp: 0,
            coins: 0,
            momentum: 0,
            streak: 0,
            xpTargetDaily: 0,
            lastActive: undefined,
            lastXp: undefined,
            lastStreak: undefined,
            lastDailyCheck: undefined,
            xpHistory: {}
          })
        },
      })),

      { name: 'trekie-game' }
    ))

  function useGame(): StoreInterface
  function useGame<T>(selector: (state: StoreInterface) => T): T
  function useGame<T>(selector?: (state: StoreInterface) => T) {
    return useStore(game, selector!)
  }

  function changeXp(change: number) {
    game.setState($ => {
      let newTotalXp = $.xp + change
      let newDailyXp = $.xpToday() + change

      // prevent negative xp
      if (newTotalXp < 0)
        newTotalXp = 0

      $.xp = newTotalXp

      // add XP to history
      $.xpHistory[daystamp.today()] = newDailyXp
      // USE LATER: console.log(Object.fromEntries(Object.entries($.xpHistory).map(([k, v]) => [k, v])))

      // Handle user's last xp date
      if (!utils.isSameDay($.lastXp, Date.now()))
        $.lastXp = Date.now()
    })

    game.getState().refresh()
  }

  function changeCoinsBalance(change: number) {
    game.setState($ => {
      let newTotalCoins = $.coins + change
      // prevent negative coins
      if (newTotalCoins < 0)
        newTotalCoins = 0
      $.coins = newTotalCoins
    })
    game.getState().refresh()
  }

  return { game, useGame, change: { xp: changeXp, coinsBalance: changeCoinsBalance } }
}

export type ComponentInterface = {}

export type GameComponent
  = (game: VanillaGame) => ComponentInterface

export function Component
  <TInterface extends ComponentInterface>
  (component: (game: ReadOnlyVanillaGame) => TInterface) {
  return (game: ReadOnlyVanillaGame) => component(game)
}

// Function to calculate the current streak based on xpHistory and dailyXpTarget
export function calculateStreak(
  xpHistory: StoreInterface["xpHistory"], // { [date: Daystamp]: number }
  dailyXpTarget: number
): number {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1); // Start from yesterday
  let streak: number = 0; // Initialize the streak count

  // Loop through each day in reverse, checking if the XP meets the daily target
  while (true) {
    const dateString = daystamp.fromDate(currentDate); // Convert the date to the required format
    const xp = xpHistory[dateString]; // Get the XP for the current date

    // If the XP meets or exceeds the daily target, increment the streak
    if (xp && xp >= dailyXpTarget) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // Move to the previous day
    } else {
      break; // If the XP doesn't meet the target, break the loop
    }
  }

  // Check if today's XP meets or exceeds the daily target
  const todaysXp = xpHistory[daystamp.fromDate(new Date())];
  if (todaysXp && todaysXp >= dailyXpTarget) {
    streak++;
  }

  return streak; // Return the calculated streak
}
