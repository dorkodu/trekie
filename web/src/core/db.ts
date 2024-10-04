import { ICommitmentInstance, ICommitResult, ICommitStatus, IUser } from '@/core'
import Dexie, { Table } from 'dexie'

export const db = new Dexie('trekie-game') as Dexie & {
  statuses: Table<ICommitStatus<any>, string>
  commits: Table<ICommitmentInstance, string>
}

// Schema declaration:
db.version(1).stores({
  statuses: 'id, userId, timestamp, event, commitment',
  commits: 'id, kind, createdAt, lastActivity',
})

db.on("populate", async () => { })

db.on("ready", async () => {
  console.info("[trekie] game db is ready.")
})

db.open().then(async (db) => {
  console.info("[trekie] db opened successfully.")
}).catch((e) => {
  console.error("[trekie] db open failed!")
  console.error(e)
})