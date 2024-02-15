export interface IGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  tasksTodo: number;
  tasksDone: number;
}

import ID from "#/lib/id";

import { Cell, IEvent, IStatus, Event } from "#/lib/supercell"
import Supercell from "#/lib/supercell"

import { Maybe, Timestamp } from "#/lib/util";

import { ComponentBase, GameState, Store } from "#/Trekie";
import * as Trekie from "#/Trekie";

//? Interfaces

export interface Interface extends ComponentBase<State, Events> {
  get: (id: IGoal["id"]) => Maybe<IGoal>
  count: () => number
}

type Events = typeof events

const events = {
  'goal:create': Event<{ goal: IGoal }>({
    onCreate: (data) => ({
      kind: "goal:create",
      data,
      timestamp: Date.now()
    }),
    onShare(status) {
      console.log(`[trekie] Created Goal (${status.data.goal.id})"`)
    },
  }),
}

const cell = Cell<typeof events>(events)

interface State {
  goals: Record<IGoal["id"], IGoal>
}

const store = Trekie.Store<State>((set, get) => ({
  goals: {}
}))

export const Component = Trekie.Component<State, Events>((game) => ({
  events,
  store,
  cell,

  gain() { game.store.setState($ => $.xp += 100) }
}))

export default Component