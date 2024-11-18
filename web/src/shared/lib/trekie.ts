import * as Trekie from '@/core'
import { Commitment as C, CommitEvent as E } from '@/core'

import { db } from './db'

import { Goal } from '@/namespaces/goal'
import { Habit } from '@/namespaces/habit'
import { useEffect } from 'react'
import { fillMockUserData, generateMockGameState, generateMockUser } from './mock'

const initialState: Trekie.GameState = generateMockGameState()

/**
 * TODO: add importing existing state NOT BLANK/MOCK EVERY TIME 
 * TODO: local for restoring session 
 * TODO: remote after new login
 * ? now we use a clean state & mock data
 */

let commitments = {
  Habit: Habit.commitment,
  Goal: Goal.commitment,
}

export const trekie = Trekie.create({
  initialState,
  commitments,
})