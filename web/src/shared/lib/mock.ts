import * as Trekie from '@core/Trekie'

import { IUser } from "@core/Trekie"
import { IGoal } from "@core/commons/goal"
import { IHabit } from "@core/commons/habit"
import { uuid } from "@core/lib/id"

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
  joinedAt: 1703846675432,
  birthday: new Date("03/08/2004 09:45 AM").getTime(),
}

export const habit: IHabit = {
  id: uuid().toString(),
  title: "Read Book Everyday",
  description: "At least 50 pages per day.",
  count: 6,
  createdAt: new Date("20/02/2024 16:30").getTime(),
  dailyTarget: 5,
  heatmap: [1],
  userId: doruk.id,
  lastUpdated: new Date("20/02/2024 16:34").getTime()
}

export const goal: IGoal = {
  id: uuid().toString(),
  title: "Become A Rockstar",
  description: "Until you are 30 years old.",
  userId: doruk.id,
  xpCurrent: 600,
  xpTarget: 10000,
}