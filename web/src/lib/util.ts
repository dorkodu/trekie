export function wait<T>(
  start: () => Promise<T>,
  before: number = 100,
  after: number = 500
): () => Promise<T> {
  let out: T;

  return () => new Promise(async (resolve) => {
    let didBefore = false;
    let didAfter = false;
    let loaded = false;

    setTimeout(() => {
      if (loaded) resolve(out);
      didBefore = true;
    }, before);

    setTimeout(() => {
      if (loaded) resolve(out);
      didAfter = true;
    }, after);

    out = await start();

    if (!didBefore || didAfter) resolve(out);
    loaded = true;
  })
}

export function formatNumber(number: number, long?: boolean) {
  if (long) return Intl.NumberFormat("en").format(number);
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(number);
}

export function relativeDate(date: number) {
  const current = new Date();
  const target = new Date(date);
  let diff = 0;

  if (current.getUTCFullYear() - target.getUTCFullYear() >= 1)
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
  else if (current.getUTCMonth() - target.getUTCMonth() >= 1)
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
  else if (current.getUTCDate() - target.getUTCDate() >= 1)
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
  else if ((diff = current.getUTCHours() - target.getUTCHours()) >= 1)
    return new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" }).format(-diff, "hours");
  else if ((diff = current.getUTCMinutes() - target.getUTCMinutes()) >= 1)
    return new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" }).format(-diff, "minutes");
  else if ((diff = current.getUTCSeconds() - target.getUTCSeconds()) >= 1)
    return new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" }).format(-diff, "seconds");
  else return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(0, "seconds");
}

export function formatDate(date: number, time?: boolean) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: time ? "short" : undefined }).format(date);
}

export * as util from "./util";