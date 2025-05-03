import { createRootRoute, createRoute, createRouter, ErrorComponent, Outlet, RouterProvider } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import * as TanstackQuery from "./lib/tanstack-query/root-provider.tsx"

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function App() {

  return (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />

      <TanstackQueryLayout />
    </>
  )
}

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: () => <div>404 Not Found</div>,
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
])

export const router = createRouter({
  routeTree,

  basepath: "./pages/",

  context: {
    ...TanstackQuery.getContext(),
  },

  defaultPendingComponent: () => (
    <div className="p-2 text-2xl">
      <div className="flex flex-col gap-2">
        <div className="animate-pulse bg-gray-200 h-8 w-1/2 rounded" />
        <div className="animate-pulse bg-gray-200 h-8 w-1/4 rounded" />
        <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded" />
      </div>
    </div>
  ),

  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,

  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
})