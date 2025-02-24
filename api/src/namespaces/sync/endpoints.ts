import {
  authOptionalProcedure,
  authRequiredProcedure,
  Router,
} from "@/lib/trpc"
import { userRepository } from "@/namespaces/user/repository"
import { syncSchema } from "./schema"

export const router = Router({
  send: authRequiredProcedure
    .input(syncSchema.send)
    .query((opts) =>
      userRepository.getUser(opts.ctx.session?.userId, opts.input)
    ),
})

