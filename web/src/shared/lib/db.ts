import Dexie, { Table } from 'dexie'

import { IUser } from '@/core'
import { IGoal } from '@/namespaces/goal'
import { IHabit } from '@/namespaces/habit'

import { mock } from './mock'

export const db = new Dexie('app') as Dexie & {
  users: Table<IUser, string>
  habits: Table<IHabit, string>
  goals: Table<IGoal, string>
}

// Schema declaration:
db.version(1).stores({
  users: 'id, &username',
  habits: 'id, userId',
  goals: 'id, userId',
})

db.on("populate", populate)

db.on("ready", ready)

db.open().then(async (db) => {
  // Database opened successfully
  console.info("dexie opened successfully")
}).catch((e) => {
  console.error(e)
});

export async function populate() {
  await db.habits.add(mock.habit, mock.habit.id)
  await db.users.add(mock.user, mock.user.id)
  await db.goals.add(mock.goal, mock.goal.id)
}

export async function ready() {
  console.info("db is ready")
}

const api = {
  get(url: string) { },
  post(url: string, data: any) { }
}