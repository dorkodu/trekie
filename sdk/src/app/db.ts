import Dexie, { Table } from 'dexie'
import { ICommitmentInstance, ICommitRecord } from '../core/commitments'

export const createDb = () =>
  new Dexie('trekie') as Dexie & {
    commitRecords: Table<ICommitRecord<any>, string>
    commitments: Table<ICommitmentInstance, string>
  }

export type IDexieDb = ReturnType<typeof createDb>

export function startDb(db: IDexieDb) {
  // Schema declaration:
  db.version(1).stores({
    commitRecords: 'id, userId, event, instanceId',
    commitments: 'id, kind, userId',
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