import { z } from 'zod'
import { router, publicProcedure } from './trpc'

export const appRouter = router({
  userList: publicProcedure
    .query(async () => { }),

  userById: publicProcedure
    .input(z.string())
    .query(async (opts) => { }),

  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => { }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter