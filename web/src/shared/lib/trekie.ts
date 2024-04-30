import { useLiveQuery } from 'dexie-react-hooks'

import * as Trekie from '@core/Trekie'

import { db } from '@/shared/lib/db'

import * as Goal from "@core/commons/goal"
import * as Habit from "@core/commons/habit"
import { mock } from './mock'

const initialState: Trekie.GameState = {
  // points
  xp: 1200,
  coins: 80,
  momentum: 60,
  streak: 20,

  // dailies
  xpTargetDaily: 60,
  xpToday: 50,

  // timestamps
  lastXp: 1703846675440,
  lastStreak: 1703846675432,
  lastActive: 1703846675432,

  user: mock.user
}

const { game, useGame } = Trekie.Game(initialState)

export const trekie = {
  game: useGame,
  goal: Goal.Component(game),
  habit: Habit.Component(game),
  db: db,
  query: useLiveQuery
}

export default trekie