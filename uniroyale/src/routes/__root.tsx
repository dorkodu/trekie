import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 antialiased">
      <Outlet />
    </div>
  );
}
