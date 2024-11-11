import * as Trekie from '@/core'

import { goals, IGoal } from "@/namespaces/goal"
import { habits, IHabit } from "@/namespaces/habit"

import { ulid } from 'ulid'
import trekie from './trekie'

// initialize app
// register a user
// fill mock data like a real user 
export const userId = ulid()
export const user: Trekie.IUser = {
  id: userId,
  username: 'dorukeray',
  name: 'Doruk Eray',
  bio: `✦ Founder & Chief @dorkodu
  ✦ Polymath • Software Craftsman • Designer
  ✦ Boğaziçi Uni. • Vefa Lisesi
  ✦ ENFJ • ♓ • 3w2 • E/Acc • Techno-optimist`,
  email: 'doruk@dorkodu.com',
  pictureUrl: '/images/doruk--green.png',
  location: "Istanbul, TR",
  url: "https://doruk.dorkodu.com",
  birthDate: new Date("03/08/2004").getTime(),
  joinedAt: new Date("19/02/2024 10:50").getTime(),
  tier: Trekie.AccountTier.PREMIUM,
}

export const game: Trekie.GameState = {
  user,
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,
  dailyTarget: 10,
  lastActive: new Date("20/02/2024 16:34").getTime(),
  lastXp: new Date("20/02/2024 16:34").getTime(),
  lastStreak: new Date("20/02/2024 16:34").getTime(),
  xpHistory: {},
  lastDailyCheck: undefined,
}

export function fillData() {
  habits.create({
    title: "Daily Guitar Practice",
    description: "At least 30 minutes per day.",
    dailyTarget: 30,
  })

  goals.create({
    title: "Be An Indie Rockstar",
    description: "A thousand true fans & a million streams.",
    xpTarget: 100,
    commitments: []
  })

  return { user, game }
}