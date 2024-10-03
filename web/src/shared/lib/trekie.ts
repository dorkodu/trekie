import * as Trekie from '@/core'
import { Commitment as C, CommitEvent as CE } from '@/core'

import { db } from './db'

import { useEffect } from 'react'
import { mock } from './mock'

import * as Goal from '@/namespaces/goal'
import * as Habit from '@/namespaces/habit'

const initialState: Trekie.GameState = mock.game

/**
 * TODO: add importing existing state NOT BLANK/MOCK EVERY TIME 
 * 1) local for restoring session 
 * 2) remote after new login
 * 
 * now we use a clean state & mock data
 */

const CheckIn = {
  'DAILYCHECK': { xp: +1, coins: +1 },
  'CREATE': { xp: +1, coins: +1 },
  'DONE': { xp: +25, coins: +2 },
}

let commitments = {
  Todo: C("Todo", {
    'CREATE': CE(() => ({ xp: +1, coins: +1 })),
    'DAILYCHECK': CE(() => ({ xp: +5, coins: 0 })),
    'DONE': CE(() => ({ xp: +25, coins: +2 })),
  }),

  Habit: C("Habit", {
    'CREATE': CE(() => ({ xp: +1, coins: +1 })),
    'UPDATE': CE(() => ({ xp: +1, coins: +1 })),
    'DAILY_TARGET_REACHED': CE(() => ({ xp: +5, coins: 0 })),
    'COUNT_UP': CE(() => ({ xp: +25, coins: +2 })),
    'COUNT_DOWN': CE(() => ({ xp: +25, coins: +2 })),
  })
}

export const trekie = Trekie.create({
  initialState,
  commitments,
})

export default trekie

export function useRefreshStatsDaily() {
  useEffect(() => {
    const task = () => { trekie.game().refresh() }

    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)

    let interval: ReturnType<typeof setInterval>
    let timeout = setTimeout(() => {
      task()
      interval = setInterval(task, 24 * 60 * 60 * 1000)
    }, tomorrow.getTime() - today.getTime())

    return () => {
      clearTimeout(interval)
      clearTimeout(timeout)
    }
  }, [])
}


