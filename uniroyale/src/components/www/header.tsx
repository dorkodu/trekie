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
  const onRegister = () => {
    window.open('https://forms.google.com/uniturnuva-kayit', '_blank')
  }

  return (
    <header>
      <nav data-state={'active'} className="w-full px-2 group">
        <div className={cn('mx-auto mt-2 px-3 transition-all duration-300 max-w-4xl lg:px-4')}>
          <div className="flex h-16 items-center justify-between gap-4 w-full">
            {/* Left side */}
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              {/* Main nav */}
              <div className="flex items-center gap-6">
                {/* Navigation menu */}
                <div className="max-md:hidden">
                  <div className="gap-2 flex">
                    {navigationLinks.map((link, index) => (
                      <a key={index} href={link.href} className="text-muted-foreground hover:text-primary py-1 font-medium">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Right side */}
            <div className="flex items-center gap-2">
              <Button
                className="text-xl rounded-xl px-12 py-8 font-extrabold hidden md:block duration-200 
                bg-gradient-to-r from-green-500 to-emerald-600
                hover:from-green-600 hover:to-emerald-700
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                onClick={onRegister}
              >
                KAYIT OL
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
