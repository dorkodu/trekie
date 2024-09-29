import * as Trekie from '@/core'
import { CommitEvent, ICommitEvent, ICommitment, ICommitReward } from '@/core'

import { db } from '@/shared/lib/db'

import { useEffect } from 'react'
import { mock } from './mock'

import * as Goal from './commons/goal'


const initialState: Trekie.GameState = mock.game

/**
 * TODO: add importing existing state NOT BLANK/MOCK EVERY TIME 
 * 1) local for restoring session 
 * 2) remote after new login
 * 
 * now we use a clean state & mock data
 */


const Todo = Trekie.Commitment("Todo", {
  'CREATE': CommitEvent<null>((status) => ({ xp: +1, coins: +1 })),
  'DAILYCHECK': CommitEvent<null>(() => ({ xp: +5, coins: 0 })),
  'DONE': CommitEvent<null>(() => ({ xp: +25, coins: +2 })),
})

const Habit = Trekie.Commitment("Habit", {
  'CREATE': CommitEvent<{}>(() => ({ xp: +1, coins: +1 })),
  'UPDATE': CommitEvent<{}>(() => ({ xp: +1, coins: +1 })),
  'DAILY_TARGET_REACHED': CommitEvent<{}>(() => ({ xp: +5, coins: 0 })),
  'COUNT_UP': CommitEvent<{}>(() => ({ xp: +25, coins: +2 })),
  'COUNT_DOWN': CommitEvent<{}>(() => ({ xp: +25, coins: +2 })),
})

const CheckIn = {
  'DAILYCHECK': { xp: +1, coins: +1 },
  'CREATE': { xp: +1, coins: +1 },
  'DONE': { xp: +25, coins: +2 },
}

let commitments = { Todo, Habit }

export const trekie = Trekie.createApp<typeof commitments>({
  initialState,
  commitments,
  use: {
    goal: GoalComponent
  }
})
export default trekie

trekie.commit('Todo', 'DAILYCHECK', null)

export function useRefreshStatsDaily() {
  useEffect(() => {
    const task = () => trekie.game().refresh()

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


