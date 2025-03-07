import { trpc } from '@web/shared/lib/trpc'
import { z } from 'zod'
import { db } from './db'
import { hash } from './hash'

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
    const hashValue = await hash(status)
    this.queue.push(hashValue) // add status id to queue
  },

  get: (hash: string) => db.statuses.get(hash),

  add: async (status: IStatus<any>) => {
    const hashValue = await hash(status)
    return db.statuses.add(status, hashValue)
  },

  remove: (hash: string) => db.statuses.delete(hash),

  match: async <T extends IStatus<any>>(claimed: string, status: T): Promise<boolean> => {
    const hashValue = await hash(status)
    return claimed === hashValue
  }
}

export async function status<T>(kind: string, userId: string, data: T) {
  let s = Sync.status(kind, userId, data)
  await Sync.share(s)
  return s
}