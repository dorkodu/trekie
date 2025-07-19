import { IconBuildingStore } from "@tabler/icons-react"
import { NavFavorites } from "@web/components/app/layout/nav-favorites"
import { NavMain } from "@web/components/app/layout/nav-main"
import { NavSecondary } from "@web/components/app/layout/nav-secondary"
import { NavWorkspaces } from "@web/components/app/layout/nav-workspaces"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from "@web/components/ui/sidebar"
import { Blocks, Calendar, Home, MessageCircleQuestion, Search, Settings2, Sparkles, Trash2 } from "lucide-react"
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
        className="w-8 h-8 my-2 mx-auto"
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
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Explore",
      url: "#",
      icon: Search,
    },
    {
      title: "Social",
      url: "#",
      icon: Sparkles,
    },

    {
      title: "Market",
      url: "#",
      icon: IconBuildingStore,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
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
  workspaces: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
  ],
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r-0 border-transparent" {...props}>
      <SidebarHeader>
        <SidebarLogo />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
      </SidebarContent>
      <NavSecondary items={data.navSecondary} className="mt-auto" />
      <SidebarRail />
    </Sidebar>
  )
}
