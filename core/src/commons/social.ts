import ID from "#/lib/id";
import { GameState, useTrekieStore } from "#/lib/store";

import { Cell, IKind, IStatus, Kind } from "#/lib/supercell"

import { Maybe } from "#/lib/util";
import { IUser } from "./user";

//? Interfaces

export interface I extends ITemplate { }
export interface ITemplate { }

export interface Component {
  data: {}
  addUser: (user: IUser) => void
}

const addUser: Component["addUser"] = (props) => {
  return {
    ...props,
    id: ID.habit(),
    count: 0,
    createdAt: new Date(),
    lastUpdated: new Date(),
    heatmap: [0]
  }
}

const events = {
  CreateHabit: Kind<{}>({
    onCreate: (data) => ({
      kind: "CreateHabit",
      data,
      timestamp: Date.now()
    }),
    onShare(status) {
      console.log(`[Trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
    },
  }),
}

const Social = Cell(events)

export default Habit

/**
 * 
 * EventKind<{ title: string, description: string }>
 */