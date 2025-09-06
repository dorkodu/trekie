import { Router } from "@api/lib/trpc"

import { gameEndpoints } from "@api/namespaces/game/endpoints"
import { goalEndpoints } from "@api/namespaces/goal/endpoints"
import { userEndpoints } from "@api/namespaces/user/endpoints"

export const appRouter = Router({
  user: userEndpoints.router,
  game: gameEndpoints.router,
  goal: goalEndpoints.router,
})

export type AppRouter = typeof appRouter;