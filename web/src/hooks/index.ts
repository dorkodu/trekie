
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export function useDelay() {
  const [state, setState] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setState(false), 100)
    return () => clearTimeout(timeout)
  }, [])

  return state
}

export function useSafeGoBack() {
  const navigate = useNavigate()

  return () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate('-1', { replace: true })
    } else {
      navigate("/", { replace: true })
    }
  }
}