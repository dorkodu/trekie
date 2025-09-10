import { IconBuildingStore, IconCompass, IconHome, IconPlant2, IconSparkles, IconUsers } from "@tabler/icons-react"
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
    title: "Life",
    url: "/life",
    icon: IconPlant2,
  },
  {
    title: "Market",
    url: "/market",
    icon: IconBuildingStore,
  },
]

const NavButton = ({ item, isActive }: { item: typeof navigationItems[number]; isActive: boolean }) => (
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

export function MobileBottomBar() {
  const routerState = useRouterState()
  const { open: openSpotlight } = useSpotlight()
  const currentPath = routerState.location.pathname
  const firstHalf = navigationItems.slice(0, 2)
  const secondHalf = navigationItems.slice(2)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex items-center justify-around px-2 py-2 h-16 space-x-1">
        {firstHalf.map((item) => {
          const isActive = currentPath === item.url
          return (
            <NavButton key={item.title} item={item} isActive={isActive} />
          )
        })}

        {/* Create/Spotlight Button (center) */}
        <Button
          onClick={() => openSpotlight({ searchString: "create" })}
          size="sm"
          className="flex flex-col items-center justify-center 
                      min-w-0 flex-1 py-1 px-2 h-full rounded-lg
                      bg-gradient-to-tr from-lime-700 to-emerald-400 hover:from-lime-600 hover:to-emerald-300"
        >
          <IconSparkles className="size-8" stroke={2.25} />
        </Button>


        {secondHalf.map((item) => {
          const isActive = currentPath === item.url
          return (
            <NavButton key={item.title} item={item} isActive={isActive} />
          )
        })}
      </div>
    </div>
  )
}
