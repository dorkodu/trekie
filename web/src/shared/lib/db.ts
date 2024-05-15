import Dexie, { Table } from 'dexie'

import * as Trekie from '@core/Trekie'
import { IUser } from '@core/index'

import { uuid } from '@/core/lib/id'

import { IGoal } from '@core/commons/goal'
import { IHabit } from '@core/commons/habit'
import { mock } from './mock'
import { LogKind, log } from '../utils/log'

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
  log("dexie opened successfully", LogKind.INFO)
}).catch(function (e) {
  // Error occurred
  log(e, LogKind.ERROR)
});

export async function populate() {
  await db.habits.add(mock.habit, mock.habit.id)
  await db.users.add(mock.user, mock.user.id)
  await db.goals.add(mock.goal, mock.goal.id)
}

export async function ready() {
  log("db is ready", LogKind.INFO)
}