/**
 * Example configuration showing how to use the new spotlight library
 */

import type { SpotlightAction, SpotlightKeyboardShortcut } from "@web/lib/spotlight"
import { createCallbackAction, createKeyboardShortcut } from "@web/lib/spotlight"
import {
  BookmarkIcon, CalendarIcon, CircleFadingPlusIcon, CommandIcon, CompassIcon, FileInputIcon, FolderPlusIcon, HelpCircleIcon, HistoryIcon, HomeIcon, SettingsIcon, TrendingUpIcon, UsersIcon
} from "lucide-react"

// Quick Actions using the new library utilities
const quickActions: SpotlightAction[] = [
  {
    id: "create-goal",
    label: "Create new goal",
    shortcut: "⌘G",
    searchTerms: ["create", "goal", "new"],
    icon: CircleFadingPlusIcon,
    group: "Quick Actions",
    onSelect: () => {
      console.log("Creating new goal...")
      // TODO: Implement goal creation logic
    }
  },
  createCallbackAction(
    "create-project",
    "Create new project",
    () => console.log("Creating new project..."),
    {
      icon: FolderPlusIcon,
      shortcut: "⌘⇧P",
      searchTerms: ["create", "project", "new"],
      group: "Quick Actions"
    }
  ),
  createCallbackAction(
    "import-document",
    "Import document",
    () => console.log("Importing document..."),
    {
      icon: FileInputIcon,
      shortcut: "⌘I",
      searchTerms: ["import", "document", "upload"],
      group: "Quick Actions"
    }
  ),
  createCallbackAction(
    "quick-note",
    "Quick note",
    () => console.log("Creating quick note..."),
    {
      icon: BookmarkIcon,
      shortcut: "⌘N",
      searchTerms: ["note", "quick", "write"],
      group: "Quick Actions"
    }
  )
]

// Navigation actions
const navigationActions: SpotlightAction[] = [
  {
    id: "go-home",
    label: "Go to home",
    searchTerms: ["home", "dashboard"],
    icon: HomeIcon,
    group: "Navigation",
    onSelect: () => {
      window.location.href = "/home"
    }
  },
  {
    id: "go-explore",
    label: "Go to explore",
    searchTerms: ["explore", "discover"],
    icon: CompassIcon,
    group: "Navigation",
    onSelect: () => {
      window.location.href = "/explore"
    }
  },
  {
    id: "go-social",
    label: "Go to social",
    searchTerms: ["social", "friends", "community"],
    icon: UsersIcon,
    group: "Navigation",
    onSelect: () => {
      window.location.href = "/social"
    }
  },
  {
    id: "go-market",
    label: "Go to market",
    searchTerms: ["market", "marketplace"],
    icon: TrendingUpIcon,
    group: "Navigation",
    onSelect: () => {
      window.location.href = "/market"
    }
  },
  {
    id: "go-calendar",
    label: "Go to calendar",
    searchTerms: ["calendar", "schedule"],
    icon: CalendarIcon,
    group: "Navigation",
    onSelect: () => {
      window.location.href = "/calendar"
    }
  }
]

// Settings & Help actions using utility functions
const settingsActions: SpotlightAction[] = [
  createCallbackAction(
    "open-settings",
    "Open settings",
    () => { window.location.href = "/settings" },
    {
      icon: SettingsIcon,
      shortcut: "⌘,",
      searchTerms: ["settings", "preferences", "config"],
      group: "Settings & Help"
    }
  ),
  createCallbackAction(
    "help-support",
    "Help & support",
    () => { window.location.href = "/help" },
    {
      icon: HelpCircleIcon,
      shortcut: "⌘?",
      searchTerms: ["help", "support", "docs"],
      group: "Settings & Help"
    }
  ),
  createCallbackAction(
    "keyboard-shortcuts",
    "Keyboard shortcuts",
    () => { console.log("Showing keyboard shortcuts...") },
    {
      icon: CommandIcon,
      shortcut: "⌘/",
      searchTerms: ["shortcuts", "keyboard", "hotkeys"],
      group: "Settings & Help"
    }
  )
]

// Recent items actions
const recentActions: SpotlightAction[] = [
  createCallbackAction(
    "recent-goals",
    "Recent goals",
    () => { console.log("Recent goals") },
    {
      icon: HistoryIcon,
      searchTerms: ["recent", "history", "goals"],
      group: "Recent"
    }
  ),
  createCallbackAction(
    "recent-projects",
    "Recent projects",
    () => { console.log("Recent projects") },
    {
      icon: HistoryIcon,
      searchTerms: ["recent", "history", "projects"],
      group: "Recent"
    }
  )
]

// Combine all actions
export const spotlightActions: SpotlightAction[] = [
  ...quickActions,
  ...navigationActions,
  ...settingsActions,
  ...recentActions
]

// Keyboard shortcuts using the utility function
export const spotlightKeyboardShortcuts: SpotlightKeyboardShortcut[] = [
  createKeyboardShortcut("g", "create-goal"),
  createKeyboardShortcut("p", "create-project", { meta: true, shift: true }),
  createKeyboardShortcut("i", "import-document"),
  createKeyboardShortcut("n", "quick-note"),
  createKeyboardShortcut(",", "open-settings"),
  createKeyboardShortcut("?", "help-support"),
  createKeyboardShortcut("/", "keyboard-shortcuts")
]