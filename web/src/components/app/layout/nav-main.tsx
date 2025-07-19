import type { TablerIcon } from "@tabler/icons-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@web/components/ui/sidebar"
import { type LucideIcon } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | TablerIcon
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive} size="lg" variant="outline" className="rounded-xl 
          data-[active=true]:bg-blue-600/10 data-[active=true]:text-blue-500/80">
            <a href={item.url} className="flex pl-6 pr-2">
              <item.icon className="size-6! text-inherit opacity-60" />
              <span data-active={item.isActive} className="text-[18px]">{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))
      }
    </SidebarMenu>
  )
}
