import { Router } from "@/lib/trpc"
import { authRouter } from "@/namespaces/auth/router"
import { gameRouter } from "@/namespaces/game/router"
import { userRouter } from "@/namespaces/user/router"

export const appRouter = Router({
  auth: authRouter,
  user: userRouter,
  game: gameRouter,
})

export type AppRouter = typeof appRouter
