import { authOptionalProcedure, authRequiredProcedure, Router } from "@api/lib/trpc"
import { userRepository } from "@api/namespaces/user/repository"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { syncSchema } from "./schema"
import { syncService } from "./service"

export const router = Router({
  push: authRequiredProcedure
    .input(syncSchema.push)
    .query((opts) => { throw new TRPCError({ code: "NOT_IMPLEMENTED" }) }
    ),

  pull: authRequiredProcedure
    .input(z.object({ name: z.string() }))
    .query((opts) =>
      "hello " + opts.input.name
    ),
})

export * as syncEndpoints from "./endpoints"

