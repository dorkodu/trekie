import { commonSchemas } from "@/commons/schemas"
import { z } from "zod"

export const getUser = z.strictObject({
  username: commonSchemas.username.optional(),
})

export const updateUser = z.strictObject({
  username: commonSchemas.username,
})

export * as userSchemas from "./schema"

