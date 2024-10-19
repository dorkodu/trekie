import { z } from "zod"

export type IHabit = z.infer<typeof IHabit>
export type IHabitTemplate = z.infer<typeof IHabitTemplate>

export const IHabitTemplate = z.object({
  title: z.string(),
  description: z.string(),
  dailyTarget: z.number().min(1)
})

export const IHabit = IHabitTemplate.extend({
  id: z.string().ulid(),
  count: z.number().min(0),
  createdAt: z.number(), // these are timestamp
  lastUpdated: z.number(),
  history: z.map(z.string(), z.number()),
  userId: z.string().ulid(),
  commitmentId: z.string().ulid()
})