import { Router, authRequiredProcedure } from '@api/lib/trpc'
import { createMomentumRepository } from './repository'
import { momentumSnapshotInputSchema } from './schemas'
import { createMomentumService } from './service'

const repository = createMomentumRepository({})
const service = createMomentumService({ repository })

export const router = Router({
  getSnapshot: authRequiredProcedure
    .input(momentumSnapshotInputSchema.optional())
    .query(async ({ ctx, input }) => {
      // SECURITY TODO: replace placeholder session extraction with validated user session
      const userId = (ctx.session as any)?.userId || 'anon'
      return service.snapshot(userId, { ...input, windowDays: input?.windowDays ?? 10 })
    })
})

export * as momentumEndpoints from './endpoints'
