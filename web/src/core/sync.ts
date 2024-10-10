import { ICommitRecord } from '@/core';
import { db } from './db';

// this represents a single commit event message
export interface IStatus<T = any> {
  kind: string
  timestamp: number
  userId: string
  data: T
}

const status: IStatus<> = {
  kind: 'COMMIT',
  timestamp: Date.now(),
  data: {
    id: '123',
    event: 'Habit:CREATE',
  }
}

const createStatus = <T>(kind: string, data: T): IStatus<T> => {
  return {
    kind,
    timestamp: Date.now(),
    userId: '123',
    data
  }
}

const hash = <T>(status: IStatus<any>) => murmur JSON.stringify(status)

const shareStatus = <T extends IStatus<any>>(status: T): Promise<{}> => {
  // save to local storage
  db.statuses.add(status, hash(status))
  // send to server
  // return response
  return new Promise((resolve, reject) => {
    resolve({})
  })
}