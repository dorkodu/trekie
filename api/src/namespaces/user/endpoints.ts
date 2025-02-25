import {
  authOptionalProcedure,
  authRequiredProcedure,
  Router,
} from "../../lib/trpc"
import * as userRepository from "./repository"
import { userSchemas } from "./schema"

export function getUser() { }

export const router = Router({
  getUser: authOptionalProcedure
    .input(userSchemas.getUser)
    .query((opts) =>
      userRepository.getUser(opts.ctx.session?.userId, opts.input)
    ),

  updateUser: authRequiredProcedure
    .input(userSchemas.updateUser)
    .mutation((opts) =>
      userRepository.updateUser(opts.ctx.session.userId, opts.input.username)
    ),
})

export * as userEndpoints from "./endpoints"
