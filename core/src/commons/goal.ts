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

export interface Interface extends Trekie.ComponentInterface<State> {
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

interface State {
  goals: Record<IGoal["id"], IGoal>

  count: () => number
}

const store = Store<State>((set, get) => ({
  goals: {
    "1": {
      id: "1",
      title: "Become a billionaire.",
      description: "By the age of 30 or you die.",
      userId: "0",
      xpCurrent: 300,
      xpTarget: 1000
    }
  },

  count: () => Object.entries(get().goals).length
}))

export const Component = Trekie.Component<Interface, State>((game) => ({
  store,

  get(id) {
    return store.getState().goals[id]
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
