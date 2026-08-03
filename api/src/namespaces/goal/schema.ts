import { IGoal } from "@web/namespaces/goal"
import * as z from "zod/v4"

export const getGoal = z.strictObject({
  id: z.ulid(),
})

export const getGoalsByUser = z.strictObject({
  userId: z.ulid().optional(),
  cursor: z.ulid().optional(),
  direction: z.enum(["asc", "desc"]),
})

export const updateGoal = z.strictObject({
  id: z.ulid(),
})

export const createGoal = z.strictObject({
  goal: IGoal
})

export * as goalSchemas from "./schema"

