import { Router } from "@api/lib/trpc"
import { authEndpoints } from "./namespaces/auth/endpoints"
import { gameEndpoints } from "./namespaces/game/endpoints"
import { goalEndpoints } from "./namespaces/goal/endpoints"
import { userEndpoints } from "./namespaces/user/endpoints"

export const appRouter = Router({
  auth: authEndpoints.router,
  user: userEndpoints.router,
  game: gameEndpoints.router,
  goal: goalEndpoints.router,
})

export type AppRouter = typeof appRouter
