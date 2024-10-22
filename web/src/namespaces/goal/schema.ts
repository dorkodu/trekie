import { z } from "zod"

export type IGoal = z.infer<typeof IGoal>
export type IGoalTemplate = z.infer<typeof IGoalTemplate>

export const IGoalTemplate = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(500),
  xpTarget: z.number().min(1),
  commitments: z.array(z.string().ulid()),
})

export const IGoal = IGoalTemplate.extend({
  id: z.string().ulid(),
  userId: z.string().ulid(),
  xpCurrent: z.number(),
  createdAt: z.number(),
  lastUpdated: z.number(),
  commitmentId: z.string().ulid(),
})

export const schema = { GoalTemplate: IGoalTemplate, Goal: IGoal }