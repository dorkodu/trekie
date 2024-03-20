import Dexie, { Table } from 'dexie'

import { IUser } from '../Trekie'
import * as Trekie from '../Trekie'
import { IGoal } from '../commons/goal'
import { IHabit } from '../commons/habit'
import ID from './id'

export class TrekieDatabase extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  users!: Table<IUser, string>
  habits!: Table<IHabit, string>
  goals!: Table<IGoal, string>

  constructor() {
    super('trekie')
    this.version(1).stores({
      users: 'id, &username',
      habits: 'id, userId',
      goals: 'id, userId',
    })
  }
}

export const db = new TrekieDatabase()

db.on("populate", populate)

db.on("ready", ready)

db.open().then(async function (db) {
  // Database opened successfully
  console.log("[Doruk]: dexie opened successfully")

  let count = await db.table("goals").count()
  console.log("[Doruk]: goals count is " + count)


}).catch(function (err) {
  // Error occurred
  console.log("[Doruk]: dexie error")
});

export async function populate() {
  const doruk: IUser = {
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

  const habit: IHabit = {
    id: ID.habit(),
    title: "Read Book Everyday",
    description: "At least 50 pages per day.",
    count: 6,
    createdAt: new Date("20/02/2024 16:30").getTime(),
    dailyTarget: 5,
    heatmap: [1],
    userId: doruk.id,
    lastUpdated: new Date("20/02/2024 16:34").getTime()
  }

  const goal: IGoal = {
    id: ID.habit(),
    title: "Become A Rockstar",
    description: "Until you are 30 years old.",
    userId: doruk.id,
    xpCurrent: 600,
    xpTarget: 10000,
  }

  await db.habits.add(habit, habit.id)
  await db.users.add(doruk, doruk.id)
  await db.goals.add(goal, goal.id)
}

export async function ready() {
  console.log("[Doruk]: dexie is ready")

  let count = await db.table("goals").count()
  console.log("[Doruk]: goals count is " + count)
}