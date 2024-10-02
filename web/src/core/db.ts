import { ICommitRecord, ICommitResult, IUser } from '@/core'
import Dexie, { Table } from 'dexie'

export const db = new Dexie('trekie-game') as Dexie & {
  commits: Table<ICommitRecord<any>, string>
}

// Schema declaration:
db.version(1).stores({
  commits: 'id, userId, timestamp, event, commitment'
})

db.on("populate", async () => { })

db.on("ready", async () => {
  console.info("db is ready")
})

db.open().then(async (db) => {
  console.info("dexie opened successfully")
}).catch((e) => {
  console.error(e)
})