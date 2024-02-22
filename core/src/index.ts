export * as Trekie from '#/Trekie';

import * as Trekie from '#/Trekie';

import * as Goal from "#/commons/goal"
import * as Habit from "#/commons/habit"
import { Cell } from './lib/supercell';

const initialState: Trekie.GameState = {
  // points
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,

  // dailies
  xpTargetDaily: 5,
  xpToday: 0,
  dailyProgress: 20,

  // timestamps
  lastXp: 1703846675440,
  lastStreak: 1703846675432,
  lastActive: 1703846675432,

  user: {
    id: '1',
    username: 'dorukeray',
    name: 'Doruk Eray',
    bio: 'Founder, Polymath, Craftsman.',
    email: 'doruk@dorkodu.com',
    pictureUrl: '/images/doruk--green.png',
    premium: true,
    joinedAt: new Date(1703846675432),
    followerCount: 0,
    followingCount: 0,
  },
}

const game = Trekie.Game(initialState)

const trekie = {
  game,
  goal: Goal.Component(game),
  habit: Habit.Component(game),
}

export default trekie


let xp = trekie.game($ => $.xp)

trekie.goal