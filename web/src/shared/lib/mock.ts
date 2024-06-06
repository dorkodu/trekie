import { Avatar } from '@mantine/core'
import * as Trekie from '@/core/Trekie'

import { IUser } from "@/core/Trekie"
import { IGoal } from "@/core/commons/goal"
import { IHabit } from "@/core/commons/habit"
import { uuid } from "@/shared/lib/id"

export const user: IUser = {
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
  joinedAt: new Date("19/02/2024 10:50").getTime(),
  birthday: new Date("03/08/2004 09:45 AM").getTime(),
}

export const habit: IHabit = {
  id: uuid().toString(),
  title: "Daily Guitar Practice",
  description: "At least 30 minutes per day.",
  count: 0,
  createdAt: new Date("20/02/2024 16:30").getTime(),
  dailyTarget: 10,
  history: new Map(),
  userId: user.id,
  lastUpdated: new Date("20/02/2024 16:34").getTime()
}

export const goal: IGoal = {
  id: uuid().toString(),
  title: "Be An Indie Rockstar",
  description: "A thousand true fans & a million streams.",
  userId: user.id,
  xpCurrent: 0,
  xpTarget: 1000,
  createdAt: new Date("19/02/2024 14:00").getTime(),
  lastUpdated: new Date("20/02/2024 12:15").getTime()
}

export const game: Trekie.GameState = {
  user,
  xp: 0,
  coins: 0,
  momentum: 0,
  streak: 0,
  xpTargetDaily: 10,
  xpToday: 0,
  lastActive: new Date("20/02/2024 16:34").getTime(),
  lastXp: new Date("20/02/2024 16:34").getTime(),
  lastStreak: new Date("20/02/2024 16:34").getTime(),
  xpHistory: new Map(),
  lastDailyCheck: undefined,
}

export * as mock from './mock'