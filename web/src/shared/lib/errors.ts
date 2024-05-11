/**
 *  We need to track results on function calls
 *  If we encounter an error, function will fail and call this handler with the error  
 */

import { ErrorInfo } from "react"
import { LogKind, log, reportToRemote } from "@/shared/utils/log"

/**
 * Global error handler of our application
 */
export function errorHandler(error: Error) {
  log(error, LogKind.ERROR)

  if (import.meta.env.PROD) {
    reportToRemote(error)
  }
}

export function onError(error: Error, info: ErrorInfo) {
  // Do something with the error, e.g. log to an external API
  errorHandler(error)
}

export function onReset() {
  // Reset the state of your app so the error doesn't happen again
}

export interface ErrorKind {
  code: string
  message: string
  action: (e?: Error, data?: any) => void
}

export const errorKinds = [
  {
    code: "NO_SESSION",
    message: "No active user session found. Please login first.",
    action: (err, data) => {
      notify
    }
  },
  {
    code: "NOT_AUTHORIZED",
    message: "You don't have permissions for this action.",
    action: (err, data) => { }
  },
]