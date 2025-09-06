/**
 * Spotlight actions wired to TanStack Router navigation.
 */

import { useNavigate } from "@tanstack/react-router"
import type { SpotlightAction, SpotlightKeyboardShortcut } from "@web/lib/spotlight"
import { SpotlightProvider, createCallbackAction, createKeyboardShortcut, createNavigationAction } from "@web/lib/spotlight"

import {
  BookmarkIcon, CalendarIcon, CircleFadingPlusIcon, CommandIcon, CompassIcon, FileInputIcon, FolderPlusIcon, HelpCircleIcon, HistoryIcon, HomeIcon, SettingsIcon, TrendingUpIcon, UsersIcon
} from "lucide-react"

function buildActions(navigate: ReturnType<typeof useNavigate>): SpotlightAction[] {
  // Quick Actions
  const quickActions: SpotlightAction[] = [
    createNavigationAction("create-goal", "Create new goal", "/goals/new", {
      icon: CircleFadingPlusIcon,
      shortcut: "⌘G",
      searchTerms: ["create", "goal", "new"],
      navigate,
    }),
    createCallbackAction(
      "create-project",
      "Create new project",
      () => console.log("Creating new project..."),
      {
        icon: FolderPlusIcon,
        shortcut: "⌘⇧P",
        searchTerms: ["create", "project", "new"],
        group: "Quick Actions",
      },
    ),
    createCallbackAction(
      "import-document",
      "Import document",
      () => console.log("Importing document..."),
      {
        icon: FileInputIcon,
        shortcut: "⌘I",
        searchTerms: ["import", "document", "upload"],
        group: "Quick Actions",
      },
    ),
    createCallbackAction(
      "quick-note",
      "Quick note",
      () => console.log("Creating quick note..."),
      {
        icon: BookmarkIcon,
        shortcut: "⌘N",
        searchTerms: ["note", "quick", "write"],
        group: "Quick Actions",
      },
    ),
  ]

  // Navigation
  const navigationActions: SpotlightAction[] = [
    createNavigationAction("go-home", "Go to home", "/home", {
      icon: HomeIcon,
      searchTerms: ["home", "dashboard"],
      navigate,
    }),
    createNavigationAction("go-explore", "Go to explore", "/explore", {
      icon: CompassIcon,
      searchTerms: ["explore", "discover"],
      navigate,
    }),
    createNavigationAction("go-social", "Go to social", "/social", {
      icon: UsersIcon,
      searchTerms: ["social", "friends", "community"],
      navigate,
    }),
    createNavigationAction("go-market", "Go to market", "/market", {
      icon: TrendingUpIcon,
      searchTerms: ["market", "marketplace"],
      navigate,
    }),
    createNavigationAction("go-calendar", "Go to calendar", "/calendar", {
      icon: CalendarIcon,
      searchTerms: ["calendar", "schedule"],
      navigate,
    }),
  ]

  // Settings & Help
  const settingsActions: SpotlightAction[] = [
    createNavigationAction("open-settings", "Open settings", "/settings", {
      icon: SettingsIcon,
      shortcut: "⌘,",
      searchTerms: ["settings", "preferences", "config"],
      navigate,
    }),
    createNavigationAction("help-support", "Help & support", "/help", {
      icon: HelpCircleIcon,
      shortcut: "⌘?",
      searchTerms: ["help", "support", "docs"],
      navigate,
    }),
    createCallbackAction(
      "keyboard-shortcuts",
      "Keyboard shortcuts",
      () => console.log("Showing keyboard shortcuts..."),
      {
        icon: CommandIcon,
        shortcut: "⌘/",
        searchTerms: ["shortcuts", "keyboard", "hotkeys"],
        group: "Settings & Help",
      },
    ),
  ]

  // Recent
  const recentActions: SpotlightAction[] = [
    createCallbackAction("recent-goals", "Recent goals", () => console.log("Recent goals"), {
      icon: HistoryIcon,
      searchTerms: ["recent", "history", "goals"],
      group: "Recent",
    }),
    createCallbackAction("recent-projects", "Recent projects", () => console.log("Recent projects"), {
      icon: HistoryIcon,
      searchTerms: ["recent", "history", "projects"],
      group: "Recent",
    }),
  ]

  return [...quickActions, ...navigationActions, ...settingsActions, ...recentActions]
}

export function AppSpotlightProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  const actions = buildActions(navigate)
  const spotlightKeyboardShortcuts: SpotlightKeyboardShortcut[] = [
    createKeyboardShortcut("g", "create-goal"),
    createKeyboardShortcut("p", "create-project", { meta: true, shift: true }),
    createKeyboardShortcut("i", "import-document"),
    createKeyboardShortcut("n", "quick-note"),
    createKeyboardShortcut(",", "open-settings"),
    createKeyboardShortcut("?", "help-support"),
    createKeyboardShortcut("/", "keyboard-shortcuts"),
  ]

  return (
    <SpotlightProvider actions={actions} keyboardShortcuts={spotlightKeyboardShortcuts}>
      {children}
    </SpotlightProvider>
  )
}

// Export types for other consumers
export type { SpotlightAction, SpotlightKeyboardShortcut }
