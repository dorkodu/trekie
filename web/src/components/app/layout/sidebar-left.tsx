import { IconBuildingStore, IconCalendar, IconCompass, IconHome, IconMessageQuestion, IconSettings, IconUsers } from "@tabler/icons-react"
import { NavMain } from "@web/components/app/layout/nav-main"
import { NavSecondary } from "@web/components/app/layout/nav-secondary"
import { SpotlightTrigger } from "@web/components/app/spotlight-trigger"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from "@web/components/ui/sidebar"
import * as React from "react"

// Logo component that switches based on sidebar state and theme
function SidebarLogo() {
  const { state } = useSidebar()
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(isDarkMode)
    }

    checkDarkMode()

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkDarkMode)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', checkDarkMode)
    }
  }, [])

  if (state === "collapsed") {
    return (
      <img
        src="/images/trekie_Icon.svg"
        className="w-10 h-10 my-2 mx-auto"
        alt="Trekie"
      />
    )
  }

  return (
    <img
      src={isDark ? "/images/trekie_Brand_White.svg" : "/images/trekie_Brand.svg"}
      className="w-[75%] my-2 mx-2"
      alt="Trekie"
    />
  )
}
// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: IconHome,
    },
    {
      title: "Explore",
      url: "/explore",
      icon: IconCompass,
    },
    {
      title: "Social",
      url: "/social",
      icon: IconUsers,
    },

    {
      title: "Market",
      url: "/market",
      icon: IconBuildingStore,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "/calendar",
      icon: IconCalendar,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/help",
      icon: IconMessageQuestion,
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-r-0 border-transparent" {...props}>
      <SidebarHeader>
        <SidebarLogo />
        <div className="px-2 pb-2">
          <SpotlightTrigger
            variant={state === "collapsed" ? "icon" : "compact"}
            className={state === "collapsed" ? "w-full" : "w-full"}
            showShortcut={state === "expanded"}
          />
        </div>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        {/* Favorites, Pinned Things etc. */}
      </SidebarContent>
      <NavSecondary items={data.navSecondary} className="mt-auto" />
      <SidebarRail />
    </Sidebar >
  )
}

