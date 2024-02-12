export interface IGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  tasksTodo: number;
  tasksDone: number;
}

import { Cell, IEvent, IStatus, Event } from "#/lib/supercell"

import { create } from "zustand";
import { TrekieComponent, GameState } from "#/Trekie";

export interface Interface extends TrekieComponent<ComponentState> {
  sayHello: () => string
}

const events = {
  'goal:SaidSomething': Event<{ message: string }>({
    onCreate: (data) => ({
      kind: "goal:helloworld",
      data,
      timestamp: Date.now()
    }),
    onShare(status) {
      console.log(`[trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
    },
  }),
}

const cell = Cell<typeof events>(events)

interface ComponentState { }

const useStore = create<ComponentState>()(immer((set) => ({})))

export const Component: Interface = {
  events,
  cell,
  store: useStore,

  sayHello() {
    this.cell.status
    return "Hello, World!"
  },
}

export default Component