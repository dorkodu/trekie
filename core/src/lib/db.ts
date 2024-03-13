import Dexie, { Table } from 'dexie'

import { IUser } from '../Trekie'
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

db.open().then(function (db) {
  // Database opened successfully
}).catch(function (err) {
  // Error occurred
});

export async function populate() {
  const doruk: IUser = {
    id: '1',
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

  const todoListId = await db.habits.bulkAdd([
    {
      id: ID.habit(),
      title: "Read Book Everyday",
      description: "At least 50 pages per day.",
      count: 6,
      createdAt: new Date("20/02/2024 16:30").getTime(),
      dailyTarget: 5,
      heatmap: [1],
      userId: 0,
    }
  ])

  await db.habits.bulkAdd([
    {
      todoListId,
      title: "Feed the birds"
    },
    {
      todoListId,
      title: "Watch a movie"
    },
    {
      todoListId,
      title: "Have some sleep"
    }
  ]);
}