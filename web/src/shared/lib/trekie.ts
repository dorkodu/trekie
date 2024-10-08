import * as Trekie from '@/core'
import { Commitment as C, CommitEvent as E } from '@/core'

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
    'CREATE': E(() => ({ xp: +1, coins: +1 })),
    'DAILYCHECK': E(() => ({ xp: +5, coins: 0 })),
    'DONE': E(() => ({ xp: +25, coins: +2 })),
  }),

  Habit: C("Habit", {
    'CREATE': E(() => ({ xp: +1, coins: +1 })),
    'UPDATE': E(() => ({ xp: +1, coins: +1 })),
    'DAILY_TARGET_REACHED': E(() => ({ xp: +5, coins: 0 })),
    'COUNT_UP': E(() => ({ xp: +25, coins: +2 })),
    'COUNT_DOWN': E(() => ({ xp: +25, coins: +2 })),
  })
}

export const trekie = Trekie.create({
  initialState,
  commitments,
})

export default trekie

let habit = trekie.commitment('Habit').create()
let todo = trekie.createCommitment('Habit')

trekie.commitment('Habit').commit("UPDATE", habit.id, {})
trekie.commit({
  kind: "Habit",
  event: "CREATE"
})



