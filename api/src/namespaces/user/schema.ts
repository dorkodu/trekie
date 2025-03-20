import { commonSchemas } from "@api/commons/schemas"
import { z } from "zod"

export const getUser = z.strictObject({
  username: commonSchemas.username.optional(),
})

export const updateUser = z.strictObject({
  username: commonSchemas.username,
})

export const updateProfile = z.strictObject({

})

export * as userSchemas from "./schema"

