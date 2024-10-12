import { ICommitRecord } from '@/core'
import xxhash from 'xxhash-wasm'
import { db } from './db'

// this represents a single commit event message
export interface IStatus<T = any> {
  kind: string
  timestamp: number
  userId: string
  data: T
}

const status: IStatus<any> = {
  kind: 'COMMIT',
  timestamp: Date.now(),
  userId: "lsamdasndkmsamdzöxkmdslas",
  data: {
    id: '123',
    event: 'Habit:CREATE',
  }
}

const createStatus = <T>(kind: string, data: T): IStatus<T> => ({
  kind,
  timestamp: Date.now(),
  userId: '123',
  data
})

const { h64ToString } = await xxhash()

const hash = (status: IStatus<any>) => h64ToString(JSON.stringify(status))

const shareStatus = <T extends IStatus<any>>(status: T): Promise<{}> => {
  // save to local storage
  db.statuses.add(status, hash(status))
  // send to server
  // return response
  return new Promise((resolve, reject) => {
    resolve({})
  })
}