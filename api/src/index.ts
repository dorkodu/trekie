import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { config } from "./config"
import { express } from "./lib/express"
import { passport } from "./lib/passport"
import { authService } from "./modules/auth/service"
import { tokenUtil } from "./modules/auth/token-util"
import { appRouter } from "./router"

express.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ req, res }),
  })
)

express.get(
  "/api/oauth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
)

express.get(
  "/api/oauth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    const userId = (req.user as any).id as string | undefined

    if (userId) {
      const session = await authService.createSession(userId)
      if (session) tokenUtil.setSession(res, session.token, session.expiresAt)
    }

    res.redirect("/")
  }
)

express.listen(config.port, () => {
  console.log(`Server has started on port ${config.port}`)
})
