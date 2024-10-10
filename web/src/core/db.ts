import { ICommitmentInstance, ICommitRecord, ICommitResult, IUser } from '@/core'
import Dexie, { Table } from 'dexie'
import { IStatus } from './sync'

export const db = new Dexie('trekie-game') as Dexie & {
  commitRecords: Table<ICommitRecord<any>, string>
  statuses: Table<IStatus<any>, string>
  commitments: Table<ICommitmentInstance, string>
}

// Schema declaration:
db.version(1).stores({
  commitRecords: 'id, userId, timestamp, event, commitment',
  commitments: 'id, kind, createdAt, lastActivity',
  statuses: 'hash'
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