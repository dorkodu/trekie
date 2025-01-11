import { Router } from "@/lib/trpc"
import { authEndpoints } from "@/namespaces/auth/endpoints"
import { gameEndpoints } from "@/namespaces/game/endpoints"
import { userEndpoints } from "@/namespaces/user/endpoints"

export const appRouter = Router({
  auth: authEndpoints.router,
  user: userEndpoints.router,
  game: gameEndpoints.router,
})

export type AppRouter = typeof appRouter
