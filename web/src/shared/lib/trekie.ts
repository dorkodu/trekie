import * as Trekie from '@/core/Trekie'

import { db } from '@/shared/lib/db'

import * as Goal from "@/core/commons/goal"
import * as Habit from "@/core/commons/habit"
import { mock } from './mock'

const blankState: Trekie.GameState = {
  // points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  // dailies
  xpTargetDaily: 0,
  xpToday: 0,

  // timestamps
  lastXp: undefined,
  lastStreak: undefined,
  lastActive: undefined,

  user: undefined
}

const initialState: Trekie.GameState = mock.game

/**
 * TODO: add importing existing state NOT BLANK/MOCK EVERY TIME 
 * 1) local for restoring session 
 * 2) remote after new login
 * 
 * now we use a clean state & mock data
 */


function initializeTrekie() {
  // initialize state
  const state = initialState ?? blankState

  // initialize game
  const { game, useGame } = Trekie.Game(state)

  return {
    game: useGame,
    goal: Goal.Component(game),
    habit: Habit.Component(game),
    db: db,
  }
}

export const trekie = initializeTrekie()

export default trekie
