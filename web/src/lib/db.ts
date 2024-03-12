import Dexie, { Table } from 'dexie'

import { IUser } from '@core/Trekie'
import { IGoal } from '@core/commons/goal'
import { IHabit } from '@core/commons/habit'

export class TrekieDatabase extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  users!: Table<IUser>
  habits!: Table<IHabit>
  goals!: Table<IGoal>

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

  const todoListId = await db.todoLists.add({
    title: "To Do Today"
  });

  await db.todoItems.bulkAdd([
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