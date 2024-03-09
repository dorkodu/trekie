export function wait<T>(
  start: () => Promise<T>,
  before: number = 100,
  after: number = 500
): () => Promise<T> {
  let out: T

  return () =>
    new Promise(async resolve => {
      let didBefore = false
      let didAfter = false
      let loaded = false

      setTimeout(() => {
        if (loaded) resolve(out)
        didBefore = true
      }, before)

      setTimeout(() => {
        if (loaded) resolve(out)
        didAfter = true
      }, after)

      out = await start()

      if (!didBefore || didAfter) resolve(out)
      loaded = true
    })
}

export function formatNumber(number: number, long?: boolean) {
  if (long) return Intl.NumberFormat('en').format(number)
  return Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

export function formatPercent(number: number) {
  return Intl.NumberFormat('en', {
    notation: 'compact',
    style: 'percent',
  }).format(number)
}

export function relativeDateString(date: number) {
  const current = new Date()
  const target = new Date(date)
  let diff = 0

  if (current.getUTCFullYear() - target.getUTCFullYear() >= 1)
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  else if (current.getUTCMonth() - target.getUTCMonth() >= 1)
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  else if (current.getUTCDate() - target.getUTCDate() >= 1)
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  else if ((diff = current.getUTCHours() - target.getUTCHours()) >= 1)
    return new Intl.RelativeTimeFormat('en', {
      numeric: 'always',
      style: 'narrow',
    }).format(-diff, 'hours')
  else if ((diff = current.getUTCMinutes() - target.getUTCMinutes()) >= 1)
    return new Intl.RelativeTimeFormat('en', {
      numeric: 'always',
      style: 'narrow',
    }).format(-diff, 'minutes')
  else if ((diff = current.getUTCSeconds() - target.getUTCSeconds()) >= 1)
    return new Intl.RelativeTimeFormat('en', {
      numeric: 'always',
      style: 'narrow',
    }).format(-diff, 'seconds')
  else
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      0,
      'seconds'
    )
}

export function formatDate(date: number, time?: boolean) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: time ? 'short' : undefined,
  }).format(date)
}

export function getDayDiff(from: number, to: number): number {
  const _from = new Date(from)
  const _to = new Date(to)

  _from.setUTCHours(0, 0, 0, 0)
  _to.setUTCHours(0, 0, 0, 0)

  const diffMs = _to.getTime() - _from.getTime()
  const dayDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return dayDiff
}

export function isSameDay(
  first: Timestamp | undefined,
  second: Timestamp | undefined
): boolean {
  if (first === undefined || second === undefined) return false

  let dateFirst = new Date(first)
  let dateSecond = new Date(second)

  return (
    dateFirst.getDate() === dateSecond.getDate() &&
    dateFirst.getMonth() === dateSecond.getMonth() &&
    dateFirst.getFullYear() === dateSecond.getFullYear()
  )
}

export type Timestamp = number

export type Maybe<T> = NonNullable<T> | undefined;

import { StoreApi, useStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ; (store.use as any)[k] = () =>
      useStore(_store, (s) => s[k as keyof typeof s])
  }

  return store
}

export * as util from './util'
