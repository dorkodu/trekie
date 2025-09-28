import { Router, authRequiredProcedure, publicProcedure } from '@api/lib/trpc'
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
      try {
        const userId = (ctx.session as any)?.userId || 'demo-user'
        const result = await service.snapshot(userId, { ...input, windowDays: input?.windowDays ?? 10, explain: input?.explain })
        return result
      } catch (e) {
        console.error('[momentum.getSnapshot] error', e)
        return { calibrating: true, error: 'momentum_failed' }
      }
    }),
  logEvent: publicProcedure
    .input((val: any) => val) // TODO: zod schema
    .mutation(async ({ input }) => {
      const userId = (input?.userId as string) || 'demo-user'
      const { event = 'progress.logged', amount = 1, kind = 'progress', instanceId = 'habit-1' } = input || {}
      const rec = await repository.addCommitRecord({
        userId,
        kind,
        instanceId,
        timestamp: Date.now(),
        event,
        data: { amount }
      })
      return { ok: true, record: rec }
    })
})

export * as momentumEndpoints from './endpoints'
