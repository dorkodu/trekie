import { Router } from "@/lib/trpc"
import * as authEndpoints from "@/namespaces/auth/endpoints"
import * as gameEndpoints from "@/namespaces/game/endpoints"
import * as syncEndpoints from "@/namespaces/sync/endpoints"
import * as userEndpoints from "@/namespaces/user/endpoints"

export const appRouter = Router({
  auth: authEndpoints.router,
  user: userEndpoints.router,
  game: gameEndpoints.router,
  sync: syncEndpoints.router,
})

export type AppRouter = typeof appRouter
