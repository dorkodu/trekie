import { Game, GameComponent, ICommitRecord } from '@/core'
import xxhash from 'xxhash-wasm'
import { db } from './db'

// this represents a single commit event message
export interface IStatus<T = any> {
  kind: string
  createdAt: number
  userId: string
  data: T
  hash: string
}
export type IStatusTemplate<T> = Pick<IStatus<T>, 'kind' | 'data' | 'createdAt' | 'userId'>

// hash utility
const { h64ToString } = await xxhash()
const hash = (status: IStatusTemplate<any>) => h64ToString(JSON.stringify(status))

export const Status = {
  create<T>(kind: string, author: string, data: T): IStatus<T> {
    let template: IStatusTemplate<T> = {
      kind,
      createdAt: Date.now(),
      userId: author,
      data
    }
    return { ...template, hash: hash(template) }
  },

  async share<T extends IStatus<any>>(status: T) {
    // save to local storage
    this.add(status)
    // add status id to queue
    // send queue to server
    // return response for this specific status
    return new Promise((resolve, reject) => {
      resolve({})
    })
  },

  get: (hash: string) => db.statuses.get(hash),
  add: (status: IStatus<any>) => db.statuses.add(status, hash(status)),
  remove: (hash: string) => db.statuses.delete(hash),

  match: <T extends IStatus<any>>(claimed: string, status: T): boolean => (claimed === hash(status))
}