export interface IGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  tasksTodo: number;
  tasksDone: number;
}

import { Cell, IEvent, IStatus, Event, Store } from "#/lib/supercell"

import { Maybe, Timestamp } from "#/lib/util";

import * as Trekie from "#/Trekie";

//? Interfaces

export interface Interface extends Trekie.ComponentBase<State, Events> {
  get: (id: IGoal["id"]) => Maybe<IGoal>
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
  goals: Record<IGoal["id"], IGoal>
}

const store = Store<State>((set, get) => ({
  goals: {}
}))

export const Component = Trekie.Component<State, Events>((game) => ({
  events,
  store,
  cell,

  tellMyXp() {
    // Trekie.Game is a reactive store powered with supercell and zustand
    const currentXp = game($ => $.xp)
    game.setState($ => ({ coins: $.coins + 1 }))
    game().refresh()
    //...
    // do some other shit as well
  }
}))

export default Component