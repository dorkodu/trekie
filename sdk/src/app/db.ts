import Dexie, { Table, Transaction } from 'dexie'
import { ICommitmentInstance, ICommitRecord } from '../core/commitments'

export const createDb = () => new Dexie('trekie') as IDexieDb

export type IDexieDb = Dexie & {
  commitRecords: Table<ICommitRecord<any>, string>
  commitments: Table<ICommitmentInstance, string>
}

export function startDb<T extends Dexie>(
  { db, onPopulate = () => { }, onReady = () => { }, onError = () => { }, }:
    {
      db: T,
      onPopulate?: (t: Transaction) => any,
      onReady?: (db: Dexie) => any,
      onError?: (e: Error) => any,
    }) {

  // Schema declaration:
  db.version(1).stores({
    commitRecords: 'id, userId, event, instanceId',
    commitments: 'id, kind, userId',
  })

  db.on("populate", onPopulate)

  db.on("ready", onReady)

  db.open().then(async (db) => {
    console.info("[sdk] db opened successfully.")
  }).catch(
    onError
  )
}