import { z } from "zod"

export const send = z.strictObject({

})

export const getStatus = z.strictObject({
  hash: z.string(),
})

export const pullStatuses = z.strictObject({
  hash: z.string(),
})
