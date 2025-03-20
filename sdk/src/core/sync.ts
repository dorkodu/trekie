import { trpc } from '@web/shared/lib/trpc'
import { hash } from '@web/shared/utils/hash'
import { z } from 'zod'
import { db } from './db'

// this represents a single commit event message
export interface IStatus<T = any> {
  kind: string
  createdAt: number
  userId: string
  data: T
}

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
    // Clear the queue after sending has verified
    // this.queue = [];
  },

  async share<T extends IStatus<any>>(status: T) {
    await this.add(status) // save to local storage
    const hashValue = hash(status)
    this.queue.push(hashValue) // add status id to queue
  },

  get: (hash: string) => db.statuses.get(hash),

  add: async (status: IStatus<any>) => {
    const hashValue = hash(status)
    return db.statuses.add(status, hashValue)
  },

  remove: (hash: string) => db.statuses.delete(hash),

  match: async <T extends IStatus<any>>(claimed: string, status: T): Promise<boolean> => {
    const hashValue = hash(status)
    return claimed === hashValue
  }
}

// TODO: kind'a göre trpc çağırsın. 
export async function status<T>(kind: string, userId: string, data: T) {
  let s = Sync.status(kind, userId, data)
  await Sync.share(s)
  return s
}