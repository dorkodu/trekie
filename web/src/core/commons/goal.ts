import * as Trekie from "../Trekie"

import { Maybe, Timestamp } from "@/shared/utils"
import { db } from "@/shared/lib/db"
import { z } from 'zod'
import { ulid } from "ulid"

//? INTERFACE

export type IGoal = z.infer<typeof IGoal>
export type IGoalTemplate = z.infer<typeof IGoalTemplate>

const IGoalTemplate = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(500),
  xpTarget: z.number().min(1),
  commitments: z.array(z.string().ulid())
})
const IGoal = IGoalTemplate.extend({
  id: z.string().ulid(),
  userId: z.string().ulid(),
  xpCurrent: z.number(),
  createdAt: z.number() satisfies z.ZodType<Timestamp>,
  lastUpdated: z.number() satisfies z.ZodType<Timestamp>
})

export const schema = { IGoalTemplate, IGoal }

//? COMPONENT

export interface Interface {
  get: (id: IGoal["id"]) => Promise<Maybe<IGoal>>
  create: (template: IGoalTemplate) => Maybe<IGoal>
  add: (goal: IGoal) => Promise<string>
  update: (id: IGoal["id"], props: IGoalTemplate) => Maybe<IGoal>
  remove: (id: IGoal["id"]) => void
  count: () => Promise<number>
}

export const Component = Trekie.Component<Interface>((game) => ({
  get: (id) => db.goals.get(id),

  add: (goal) => db.goals.add(goal, goal.id),

  create(props) {
    const userId = game.getState().user?.id
    if (!userId) return

    return {
      id: ulid(),
      xpCurrent: 0,
      ...props,
      userId
    } as IGoal
  },

  update(id, props) {
    const updatedGoal = this.create(props)
    if (!updatedGoal) return

    db.goals.update(id, props)

    return updatedGoal
  },

  count: () => db.goals.count(),

  remove: (id) => db.goals.delete(id),
}))