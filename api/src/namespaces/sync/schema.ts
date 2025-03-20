import { inferSchema } from "@web/shared/utils"
import { z } from "zod"

export const statusSchema = z.object({
  kind: z.string(),
  createdAt: z.number(),
  userId: z.string(),
  data: z.any(),
})

export const push = z.strictObject({
  statuses: z.array(statusSchema),
})

export const getStatus = z.strictObject({
  hash: z.string(),
})

export const pull = z.strictObject({
  startTime: z.number().optional(),
  endTime: z.number().optional(),
})


export * as syncSchema from "./schema"
