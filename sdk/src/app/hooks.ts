import { useEffect } from "react"

// a generic wrapper for daily refresh hook
export function useDailyTask(task: () => void) {
  return useEffect(() => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)

    let interval: ReturnType<typeof setInterval>
    let timeout = setTimeout(() => {
      task()
      interval = setInterval(task, 24 * 60 * 60 * 1000)
    }, tomorrow.getTime() - today.getTime())

    return () => {
      clearTimeout(interval)
      clearTimeout(timeout)
    }
  }, [])
}