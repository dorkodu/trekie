
import * as Trekie from '@core/Trekie'

import * as Goal from "@core/commons/goal"
import * as Habit from "@core/commons/habit"
import { db } from '@core/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'

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

  user: {
    id: '0',
    username: 'dorukeray',
    name: 'Doruk Eray',
    bio: `✦ Founder & Chief @dorkodu
    ✦ Polymath • Software Craftsman • Designer
    ✦ Boğaziçi University • Vefa Lisesi '23 
    ✦ ENFJ • ♓ • 3w2 • E/Acc • Techno-optimist`,
    email: 'doruk@dorkodu.com',
    pictureUrl: '/images/doruk--green.png',

    tier: Trekie.AccountTier.PREMIUM,

    category: "Entrepreneur",
    location: "Istanbul, TR",
    url: "https://doruk.dorkodu.com",
    joinedAt: 1703846675432,
    birthday: new Date("03/08/2004 09:45 AM").getTime(),
  },
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