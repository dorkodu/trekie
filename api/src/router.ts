import { Router } from "@api/lib/trpc"
import { authEndpoints } from "./namespaces/auth/endpoints"
import { gameEndpoints } from "./namespaces/game/endpoints"
import { goalEndpoints } from "./namespaces/goal/endpoints"
import { syncEndpoints } from "./namespaces/sync/endpoints"
import { userEndpoints } from "./namespaces/user/endpoints"

export const appRouter = Router({
  auth: authEndpoints.router,
  user: userEndpoints.router,
  game: gameEndpoints.router,
  sync: syncEndpoints.router,
  goal: goalEndpoints.router,
})

export type AppRouter = typeof appRouter
