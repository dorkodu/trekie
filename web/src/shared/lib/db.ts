import Dexie, { Table } from 'dexie'

import * as Trekie from '@core/Trekie'
import { IUser } from '@core/index'

import { uuid } from '@core/lib/id'

import { IGoal } from '@core/commons/goal'
import { IHabit } from '@core/commons/habit'
import { mock } from './mock'

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


}).catch(function (_err) {
  // Error occurred
  console.log("[Doruk]: dexie error")
});

export async function populate() {
  await db.habits.add(mock.habit, mock.habit.id)
  await db.users.add(mock.user, mock.user.id)
  await db.goals.add(mock.goal, mock.goal.id)
}

export async function ready() {
  console.log("[Doruk]: dexie is ready")

  let count = await db.table("goals").count()
  console.log("[Doruk]: goals count is " + count)
}