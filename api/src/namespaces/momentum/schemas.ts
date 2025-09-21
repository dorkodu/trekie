import { z } from 'zod'

export const momentumSnapshotInputSchema = z.object({
  windowDays: z.number().int().min(5).max(30).default(10),
  explain: z.boolean().optional(),
  delta: z.boolean().optional(),
  impact: z.boolean().optional(),
  recommendations: z.boolean().optional()
}).partial({ explain: true, delta: true, impact: true, recommendations: true })

export const momentumExpansionFlags = ['explain', 'delta', 'impact', 'recommendations'] as const
export type MomentumExpansionFlag = typeof momentumExpansionFlags[number]

export const momentumSnapshotOutputSchema = z.object({
  calibrating: z.boolean().optional(),
  score: z.number().optional(),
  trend: z.number().optional(),
  bands: z.any().optional(),
  states: z.any().optional(),
  history: z.any().optional(),
  missingDomains: z.record(z.boolean()).optional(),
  explanation: z.any().optional(),
  delta: z.any().optional(),
  impact: z.any().optional(),
  recommendations: z.any().optional()
})

export type MomentumSnapshotInput = z.infer<typeof momentumSnapshotInputSchema>
export type MomentumSnapshotOutput = z.infer<typeof momentumSnapshotOutputSchema>