import { ICommitmentInstance, ICommitRecord } from '@sdk/core/commits'
import { isBrowser } from '@sdk/utils'
import { IStatus } from '@sdk/utils/sync'
import Dexie, { Table } from 'dexie'

export const createDb = () =>
  new Dexie('trekie') as Dexie & {
    commitRecords: Table<ICommitRecord<any>, string>
    statuses: Table<IStatus<any>, string>
    commitments: Table<ICommitmentInstance, string>
  }

export type IDexieDb = ReturnType<typeof createDb>

export function startDb(db: IDexieDb) {
  // Schema declaration:
  db.version(1).stores({
    commitRecords: 'id, userId, timestamp, event, commitment',
    commitments: 'id, kind, createdAt, lastActivity',
    statuses: ''
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
}