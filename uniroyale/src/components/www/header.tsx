import { IconMenu2, IconTrophy } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@web/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@web/components/ui/popover"
import { cn } from "@web/lib/utils"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/#hakkinda", label: "Hakkında" },
  { href: "/#kurallar", label: "Kurallar" },
  { href: "/#takvim", label: "Takvim" },
  { href: "/#oduller", label: "Ödüller" },
  { href: "/#iletisim", label: "İletişim" },
]

export function Header() {
  return (
    <header>
      <nav data-state={'active'} className="w-full px-2 group">
        <div className={cn('mx-auto mt-2 px-3 transition-all duration-300 max-w-4xl lg:px-4')}>
          <div className="flex h-16 w-full items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile menu trigger */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="md:hidden"
                    variant="ghost"
                    size="icon">
                    <IconMenu2 className="size-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1 md:hidden">
                  <div className="max-w-none">
                    <div className="flex-col items-start gap-0 md:gap-2">
                      {navigationLinks.map((link, index) => (
                        <div key={index} className="w-full">
                          <a href={link.href} className="py-2 block px-2 hover:text-primary">
                            {link.label}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Link to="/" className="text-primary hover:text-primary/90">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-red-500 to-blue-500 p-2 rounded-lg">
                    <IconTrophy className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 bg-clip-text text-transparent">
                    UNITURNUVA
                  </span>
                </div>
              </Link>
            </div>
            <div className="ml-auto hidden items-center gap-10 max-md:hidden">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="rounded-lg px-3 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
