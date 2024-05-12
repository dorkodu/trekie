import * as Trekie from '@core/Trekie'

import { db } from '@/shared/lib/db'

import * as Goal from "@core/commons/goal"
import * as Habit from "@core/commons/habit"
import { mock } from './mock'

const initialState: Trekie.GameState = {
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

  user: mock.user
}

const { game, useGame } = Trekie.Game(initialState)

export const trekie = {
  game: useGame,
  goal: Goal.Component(game),
  habit: Habit.Component(game),
  db: db,
}

export default trekie

function initialize() {

} 