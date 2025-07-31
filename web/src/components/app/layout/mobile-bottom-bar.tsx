import { IconBuildingStore, IconCompass, IconHome, IconSparkles, IconUsers } from "@tabler/icons-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { Button } from "@web/components/ui/button"
import { useSpotlight } from "@web/lib/spotlight"
import { cn } from "@web/lib/utils"

const navigationItems = [
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
  },
]

export function MobileBottomBar() {
  const routerState = useRouterState()
  const { open: openSpotlight } = useSpotlight()
  const currentPath = routerState.location.pathname

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex items-center justify-around px-2 py-2 h-16">
        {navigationItems.map((item, index) => {
          const isActive = currentPath === item.url

          return (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-2 rounded-lg transition-colors",
                isActive
                  ? "text-blue-500 bg-blue-500/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="size-6 mb-1" />
              <span className="text-xs font-medium truncate">{item.title}</span>
            </Link>
          )
        })}

        {/* Create/Spotlight Button */}
        <Button
          onClick={() => openSpotlight({ searchString: "create" })}
          size="sm"
          className="flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-2 h-auto bg-gradient-to-tr from-lime-700 to-emerald-400 hover:from-lime-600 hover:to-emerald-300 rounded-lg"
        >
          <IconSparkles className="size-6 mb-1" stroke={2.25} />
          <span className="text-xs font-bold">CREATE</span>
        </Button>
      </div>
    </div>
  )
}
