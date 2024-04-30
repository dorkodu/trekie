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
  date1: Date | undefined,
  date2: Date | undefined
): boolean {
  if (date1 === undefined || date2 === undefined) return false

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

export type Maybe<T> = NonNullable<T> | undefined

export const sleep = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))

export * as utils from '.'
