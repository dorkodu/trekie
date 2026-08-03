import { Router, authOptionalProcedure } from "@api/lib/trpc"
import { z } from "zod"

const helloSchema = z.object({ message: z.string() })

export const router = Router({
  "hello": authOptionalProcedure
    .input(helloSchema)
    .query((opts) =>
      `Hello, ${opts.input.message ?? "(no name)"}!`
    ),
})

export * as gameEndpoints from "./endpoints"
