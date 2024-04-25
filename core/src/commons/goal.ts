import * as Trekie from "../Trekie"

import { Maybe } from "../lib/util"
import { db } from "../lib/db"
import { uuid } from "../lib/id"

export interface IGoal extends IGoalTemplate {
  id: string
  userId: string
  xpCurrent: number
}

export interface IGoalTemplate {
  title: string
  description: string
  xpTarget: number
}

//? Interfaces

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
      id: uuid().toString(),
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

export default Component
