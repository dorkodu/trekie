import { IconBuildingStore, IconCalendar, IconCompass, IconHome, IconLogout2, IconMessageQuestion, IconSettings, IconUsers } from "@tabler/icons-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { NavMain } from "@web/components/app/layout/nav-main"
import { NavSecondary } from "@web/components/app/layout/nav-secondary"
import { useTheme } from "@web/components/theme-provider"
import { ThemeSwitch } from "@web/components/theme-toggles"
import { Avatar, AvatarFallback, AvatarImage } from "@web/components/ui/avatar"
import { Separator } from "@web/components/ui/separator"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@web/components/ui/sidebar"
import { useIsMobile } from "@web/hooks/use-mobile"
import { useAuth } from "@web/lib/auth/provider"
import {
  Bell,
  HelpCircle,
  Settings,
  Shield,
  Sparkles,
  User
} from "lucide-react"
import * as React from "react"

// Logo component that switches based on sidebar state and theme
function SidebarLogo() {
  const { state } = useSidebar()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

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

// Mobile User Menu Component
function MobileUserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const userMenuItems = [
    {
      icon: User,
      label: "Profile",
      description: "Manage your profile",
      href: "/profile",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Account settings & preferences",
      href: "/settings",
    },
    {
      icon: Sparkles,
      label: "Upgrade to Pro",
      description: "Unlock premium features",
      href: "/premium",
      highlight: true,
    },
    {
      icon: Shield,
      label: "Privacy",
      description: "Privacy & security settings",
      href: "/settings/privacy",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage your notifications",
      href: "/settings/notifications",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help with Trekie",
      href: "/help",
    },
  ]

  return (
    <div className="px-2 py-4">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 p-3 mb-4 rounded-2xl bg-accent/50">
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium text-sm truncate">
            {user?.name || "User"}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {user?.email || "user@example.com"}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Main Navigation on Mobile */}

      {/* User Menu Items */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Account
        </h3>
        <SidebarMenu>
          {userMenuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                size="lg"
                className={`rounded-xl transition-all duration-200 ${item.highlight
                  ? "bg-gradient-to-r from-lime-600 to-emerald-500 text-white hover:from-lime-700 hover:to-emerald-600"
                  : "hover:bg-accent/80"
                  }`}
              >
                <Link to={item.href}>
                  <item.icon className={`size-5 ${item.highlight ? "text-white" : ""}`} />
                  <div className="flex-1 text-left min-w-0">
                    <div className={`font-medium text-sm truncate ${item.highlight ? "text-white" : ""}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs truncate ${item.highlight ? "text-white/80" : "text-muted-foreground"
                      }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>

      {/* Appearance / Theme Toggle */}
      <div className="mb-6">
        <div className="px-3">
          <ThemeSwitch />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Sign Out */}
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
            onClick={async () => {
              await logout();
              navigate({ to: "/login" });
            }}
          >
            <IconLogout2 className="size-6" />
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-sm">Log Out</div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 border-transparent"
      side="left"
      variant="sidebar"
      {...props}
    >
      {isMobile ? (
        // Mobile sidebar content - User menu
        <SidebarContent>
          <MobileUserMenu />
        </SidebarContent>
      ) : (
        // Desktop sidebar content - Regular navigation
        <>
          <SidebarHeader>
            <SidebarLogo />
            <NavMain items={data.navMain} />
          </SidebarHeader>
          <SidebarContent>
            {/* Favorites, Pinned Things etc. */}
          </SidebarContent>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </>
      )}
      <SidebarRail />
    </Sidebar >
  )
}

