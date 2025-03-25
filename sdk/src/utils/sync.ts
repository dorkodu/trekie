import { IDexieDb } from '@sdk/app/db'
import { tryCatch } from '@sdk/utils/trycatch'
import { trpc } from '@web/shared/lib/trpc'
import { hash } from '@web/shared/utils/hash'
import { z } from 'zod'

// this represents a single commit event message
export interface IStatus<T = any> {
  kind: string
  createdAt: number
  userId: string
  data: T
}

export function status<T>(kind: string, userId: string, data: T): IStatus<T> {
  let status: IStatus<T> = {
    kind,
    createdAt: Date.now(),
    userId: userId,
    data
  }
  return status
}

export function createSync({ db, handle, onPull, onPush }: {
  db: IDexieDb,
  handle: (s: IStatus) => Promise<void>,
  onPull: () => Promise<void>,
  onPush: (pendingList: IStatus[]) => Promise<void>,
}) {
  return {
    queue: [] as Array<string>,

    status,

    async push() {
      let pendingList = await db.statuses.bulkGet(this.queue)
      if (!pendingList) pendingList = []
      const { data, error } = await tryCatch(onPush(pendingList))
      // Clear the queue after sending has verified
      if (!error) this.queue = []
    },

    async pull() {
      // Fetch the latest statuses from the server
      const { data, error } = await tryCatch(onPull())

      if (error) return error
      else return true
    },

    async share<T extends IStatus<any>>(status: T) {
      const { error } = await tryCatch(handle(status))
      if (error) return error

      await this.add(status) // save to local storage
      const hashValue = hash(status)
      this.queue.push(hashValue) // add status id to queue

      return true
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
}