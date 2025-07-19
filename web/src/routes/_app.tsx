import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

import { SidebarLeft } from "@web/components/app/layout/sidebar-left";
import { SidebarRight } from "@web/components/app/layout/sidebar-right";
import Spotlight from "@web/components/app/spotlight";
import {
  SidebarInset,
  SidebarProvider
} from "@web/components/ui/sidebar";

export default function AppLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-6xl">
        <SidebarProvider>
          <SidebarLeft />
          <SidebarInset>
            <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Spotlight />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Outlet />
            </div>
          </SidebarInset>
          <SidebarRight />
        </SidebarProvider>
      </div>
    </main>
  )
}