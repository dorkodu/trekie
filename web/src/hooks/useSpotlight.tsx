import * as React from "react"

interface SpotlightContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  actions: {
    createGoal: () => void
    createProject: () => void
    importDocument: () => void
    quickNote: () => void
    showShortcuts: () => void
  }
}

const SpotlightContext = React.createContext<SpotlightContextType | undefined>(undefined)

interface SpotlightProviderProps {
  children: React.ReactNode
}

export function SpotlightProvider({ children }: SpotlightProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])

  // Action handlers
  const actions = React.useMemo(() => ({
    createGoal: () => {
      console.log("Creating new goal...")
      // TODO: Implement goal creation logic
    },
    createProject: () => {
      console.log("Creating new project...")
      // TODO: Implement project creation logic
    },
    importDocument: () => {
      console.log("Importing document...")
      // TODO: Implement document import logic
    },
    quickNote: () => {
      console.log("Creating quick note...")
      // TODO: Implement quick note logic
    },
    showShortcuts: () => {
      console.log("Showing keyboard shortcuts...")
      // TODO: Implement shortcuts modal
    }
  }), [])

  // Global keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Primary spotlight toggle
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
        return
      }

      // Quick action shortcuts (only when spotlight is closed)
      if (!isOpen) {
        if (e.key === "g" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          actions.createGoal()
          return
        }

        if (e.key === "p" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
          e.preventDefault()
          actions.createProject()
          return
        }

        if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          actions.importDocument()
          return
        }

        if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          actions.quickNote()
          return
        }

        if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          actions.showShortcuts()
          return
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [toggle, isOpen, actions])

  const value = React.useMemo(
    () => ({ isOpen, open, close, toggle, actions }),
    [isOpen, open, close, toggle, actions]
  )

  return (
    <SpotlightContext.Provider value={value}>
      {children}
    </SpotlightContext.Provider>
  )
}

export function useSpotlight() {
  const context = React.useContext(SpotlightContext)
  if (context === undefined) {
    throw new Error("useSpotlight must be used within a SpotlightProvider")
  }
  return context
}

// Hook for creating spotlight actions in different components
export function useSpotlightActions() {
  const { actions } = useSpotlight()
  return actions
}
