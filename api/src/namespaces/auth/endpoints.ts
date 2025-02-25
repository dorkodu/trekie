import { authRequiredProcedure, Router } from "../../lib/trpc"
import { authService } from "./service"

export const router = Router({
  logout: authRequiredProcedure.mutation((opts) =>
    authService.expireSession(
      opts.ctx.session.userId,
      opts.ctx.session.id,
      opts.ctx.res
    )
  ),
})

export * as authEndpoints from "./endpoints"
