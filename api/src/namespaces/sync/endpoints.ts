import { authOptionalProcedure, authRequiredProcedure, Router } from "@api/lib/trpc"
import { userRepository } from "@api/namespaces/user/repository"
import { z } from "zod"
import { syncSchema } from "./schema"

export const router = Router({
  send: authRequiredProcedure
    .input(syncSchema.send)
    .query((opts) =>
      userRepository.getUser(opts.ctx.session?.userId, opts.input)
    ),

  hello: authOptionalProcedure
    .input(z.object({ name: z.string() }))
    .query((opts) =>
      "hello " + opts.input.name
    ),
})

export * as syncEndpoints from "./endpoints"

