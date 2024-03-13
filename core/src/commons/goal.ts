import { createStore } from 'zustand-x'

import ID from "../lib/id";
import * as Trekie from "../Trekie";

import { Cell, IEvent, IStatus, Event, Store } from "../lib/supercell"
import { Maybe, Timestamp } from "../lib/util";

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
  get: (id: IGoal["id"]) => Maybe<IGoal>
  create: (template: IGoalTemplate) => Maybe<IGoal>
  update: (id: IGoal["id"], props: IGoalTemplate) => Maybe<IGoal>
  remove: (id: IGoal["id"]) => void
  count: () => number
}

export type Events = typeof events
const events = {
  'goal:create': Event<{ goal: IGoal }>({
    onCreate: (data) => ({
      kind: "goal:create",
      data,
      timestamp: Date.now()
    }),
    onShare: (status) => {
      console.log(`[trekie] Created Goal (${status.data.goal.id})"`)
    },
  }),
}

export const Component = Trekie.Component<Interface>((game) => ({
  get(id) {
    return db.getState().goals[id]
  },

  create(props) {
    const userId = game.getState().user?.id
    if (!userId) return

    return {
      id: ID.goal(),
      xpCurrent: 0,
      ...props,
      userId
    } as IGoal
  },

  update(id, props) {
    const updatedGoal = this.create(props)
    if (!updatedGoal) return

    store.setState($ => {
      $.goals[id] = updatedGoal
    })

    return updatedGoal
  },

  count: store.getState().count,

  remove(id) {
    store.setState($ => {
      delete $.goals[id]
    })
  },
}))

export default Component
