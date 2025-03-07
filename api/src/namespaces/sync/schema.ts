import { inferSchema } from "@web/shared/utils"
import { z } from "zod"


export const statusSchema = z.object({
  kind: z.string(),
  createdAt: z.number(),
  userId: z.string(),
  data: z.any(),
})

export const send = z.strictObject({
  statuses: z.array(statusSchema),
})

export const getStatus = z.strictObject({
  hash: z.string(),
})

export const pullStatuses = z.strictObject({
  hash: z.string(),
})


export * as syncSchema from "./schema"
