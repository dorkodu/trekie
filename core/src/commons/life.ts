export interface IUser {
  id: string;

  username: string;
  name: string;
  joinedAt: Date;

  email?: string;

  bio?: string;

  pictureUrl?: string;

  followerCount?: number;
  followingCount?: number;

  premium?: boolean;
}

import { Cell, IEvent, IStatus, Event } from "#/lib/supercell"

import { create, StateCreator } from "zustand";
import { ComponentBase, GameState } from "#/Trekie";
import { immer } from "zustand/middleware/immer";

//? Interfaces

export interface Interface extends ComponentBase<ComponentState> {
  count: () => number
}

const events = {
  'life:helloworld': Event<{}>({
    onCreate: (data) => ({
      kind: "habit:create",
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

const useStore = create<ComponentState>()(immer((set, get) => ({

})))

export const Component: Interface = {
  events,
  cell,
  store: useStore,

  count() { return 0 },
}

export default Component