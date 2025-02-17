import {
  authOptionalProcedure,
  authRequiredProcedure,
  Router,
} from "@/lib/trpc"
import * as userRepository from "@/namespaces/user/repository"
import * as syncSchema from "./schema"

export function getUser() { }

export const router = Router({
  send: authRequiredProcedure
    .input(syncSchema.send)
    .query((opts) =>
      userRepository.getUser(opts.ctx.session?.userId, opts.input)
    ),
})

