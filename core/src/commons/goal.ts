import * as Trekie from "#/Trekie";

import { Cell, IEvent, IStatus, Event, Store } from "#/lib/supercell"
import { Maybe, Timestamp } from "#/lib/util";

export interface IGoal extends IGoalTemplate {
  id: string

  xpCurrent: number
}

export interface IGoalTemplate {
  title: string
  description: string
  xpTarget: number

  userId: string
}

//? Interfaces

export interface Interface extends Trekie.ComponentBase<State, Events> {
  get: (id: IGoal["id"]) => Maybe<IGoal>
  create: (props: IGoalTemplate) => IGoal
  update: (id: IGoal["id"], props: IGoalTemplate) => IGoal
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

const cell = Cell<Events>(events)

interface State {
  goals: Record<string, IGoal>
}

const store = Store<State>((set, get) => ({
  goals: {},
}))

export const Component = Trekie.Component<Interface, State, Events>((game) => ({
  events,
  store,
  cell,

  get(id) {
    return store($ => $.goals[id])
  },

  create(props) {
    return {
      id: "xxxx-xxxx-xxxx",
      xpCurrent: 0,
      ...props,
    } as IGoal
  },

  update(id, props) {
    const updatedGoal = this.create(props)

    store.setState($ => {
      $.goals[id] = updatedGoal
    })

    return updatedGoal
  },

  count() {
    return Object.entries(store($ => $.goals)).length
  },

  remove(id) {
    store.setState($ => {
      delete $.goals[id]
    })
  },
}))

export default Component