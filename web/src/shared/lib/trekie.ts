import * as Trekie from '@/core'

import { goalCommitment } from '@/namespaces/goal/commitment'
import { habitCommitment } from '@/namespaces/habit/commitment'
import { useEffect } from 'react'
import { generateMockGameState } from './mock'

const initialState: Trekie.GameState = generateMockGameState()

/**
 * TODO: add importing existing state NOT BLANK/MOCK EVERY TIME 
 * TODO: local for restoring session 
 * TODO: remote after new login
 * ? now we use a clean state & mock data
 */

const commitments = {
  'Habit': habitCommitment,
  'Goal': goalCommitment,
}

export const trekie = Trekie.create({
  initialState,
  commitments
})