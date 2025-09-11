import { z } from "zod"

export type ITodo = z.infer<typeof ITodo>
export type ITodoTemplate = z.infer<typeof ITodoTemplate>

export const ITodoTemplate = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().optional(),
  dueDate: z.number().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  tags: z.array(z.string()).optional(),
})

export const ITodo = ITodoTemplate.extend({
  id: z.string().ulid(),
  userId: z.string().ulid(),
  completed: z.boolean().default(false),
  createdAt: z.number(),
  updatedAt: z.number(),
  completedAt: z.number().nullable(),
})

export const schema = { TodoTemplate: ITodoTemplate, Todo: ITodo }
