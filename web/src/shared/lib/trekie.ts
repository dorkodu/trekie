import * as Trekie from '@/core'
import { Commitment as C, CommitEvent as E } from '@/core'

import { db } from './db'

import { Habit } from '@/namespaces/habit'
import { useEffect } from 'react'
import { mock } from './mock'

const initialState: Trekie.GameState = mock.game

/**
 * TODO: add importing existing state NOT BLANK/MOCK EVERY TIME 
 * 1) local for restoring session 
 * 2) remote after new login
 * 
 * now we use a clean state & mock data
 */

let commitments = {
  Habit: Habit.commitment,
  Goal: Goal.commitment,
}

export const trekie = Trekie.create({
  initialState,
  commitments,
})

export default trekie