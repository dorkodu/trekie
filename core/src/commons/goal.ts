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
import { IComponent, GameState, ComponentStore } from "#/Trekie";
import { immer } from "zustand/middleware/immer";

export interface Interface extends IComponent<ComponentState, ComponentEvents> {
  sayHello: () => string
}

const events = {
  'goal:create': Event<{ title: string }>({
    onCreate: (data) => ({
      kind: "goal:create",
      data,
      timestamp: Date.now()
    }),
    onShare(status) {
      console.log(`[trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
    },
  }),
}

const cell = Cell<typeof events>(events)

interface ComponentState {
  goals: string
}

type ComponentEvents = typeof events

const useStore = ComponentStore(() => ({

}))

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