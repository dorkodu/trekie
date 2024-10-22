import xxhash from 'xxhash-wasm'
import { db } from './db'

// this represents a single commit event message
export interface IStatus<T = any> {
  kind: string
  createdAt: number
  userId: string
  data: T
}

// hash utility
const { h64ToString } = await xxhash()
const hash = (status: IStatus<any>) => h64ToString(JSON.stringify(status))

export const Sync = {
  queue: [] as Array<string>,

  status<T>(kind: string, userId: string, data: T): IStatus<T> {
    let status: IStatus<T> = {
      kind,
      createdAt: Date.now(),
      userId: userId,
      data
    }
    return status
  },

  async syncToServer() {
    const statusesToSend = db.statuses.bulkGet(this.queue)
    // Clear the queue after sending
    // this.queue = [];
  },

  async share<T extends IStatus<any>>(status: T) {
    this.add(status) // save to local storage
    this.queue.push(hash(status)) // add status id to queue
  },

  get: (hash: string) => db.statuses.get(hash),
  add: (status: IStatus<any>) => db.statuses.add(status, hash(status)),
  remove: (hash: string) => db.statuses.delete(hash),

  match: <T extends IStatus<any>>(claimed: string, status: T): boolean => (claimed === hash(status))
}

export function status<T>(kind: string, userId: string, data: T) {
  let s = Sync.status(kind, userId, data)
  Sync.share(s)
  return s
}