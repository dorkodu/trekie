
import {
  BookmarkIcon,
  CalendarIcon,
  CircleFadingPlusIcon,
  CommandIcon,
  CompassIcon,
  FileInputIcon,
  FolderPlusIcon,
  HelpCircleIcon,
  HistoryIcon,
  HomeIcon,
  SettingsIcon,
  TrendingUpIcon,
  UsersIcon
} from "lucide-react"

import { useNavigate } from "@tanstack/react-router"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@web/components/ui/command"
import { useSpotlight } from "@web/hooks/useSpotlight"
import { SpotlightTrigger } from "./spotlight-trigger"

export default function Spotlight() {
  const { isOpen, close, open: openSpotlight, actions } = useSpotlight()
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate({ to: path })
    close()
  }

  const handleAction = (action: () => void) => {
    action()
    close()
  }

  return (
    <>
      <SpotlightTrigger className="w-2/4" />
      <CommandDialog open={isOpen} onOpenChange={(isOpenState) => isOpenState ? openSpotlight() : close()}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleAction(actions.createGoal)}>
              <CircleFadingPlusIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Create new goal</span>
              <CommandShortcut>⌘G</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleAction(actions.createProject)}>
              <FolderPlusIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Create new project</span>
              <CommandShortcut>⌘⇧P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleAction(actions.importDocument)}>
              <FileInputIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Import document</span>
              <CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleAction(actions.quickNote)}>
              <BookmarkIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Quick note</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => handleNavigation("/home")}>
              <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Go to home</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigation("/explore")}>
              <CompassIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Go to explore</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigation("/social")}>
              <UsersIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Go to social</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigation("/market")}>
              <TrendingUpIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Go to market</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigation("/calendar")}>
              <CalendarIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Go to calendar</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings & Help">
            <CommandItem onSelect={() => handleNavigation("/settings")}>
              <SettingsIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Open settings</span>
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigation("/help")}>
              <HelpCircleIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Help & support</span>
              <CommandShortcut>⌘?</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => handleAction(actions.showShortcuts)}>
              <CommandIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Keyboard shortcuts</span>
              <CommandShortcut>⌘/</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Recent">
            <CommandItem onSelect={() => handleAction(() => console.log("Recent goals"))}>
              <HistoryIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Recent goals</span>
            </CommandItem>
            <CommandItem onSelect={() => handleAction(() => console.log("Recent projects"))}>
              <HistoryIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Recent projects</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
