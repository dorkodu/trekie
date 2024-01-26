import ID from "#/lib/id";
import { GameState, useTrekieStore } from "#/lib/store";

import { Cell, IKind, IStatus, Kind } from "#/lib/supercell"

import { Maybe } from "#/lib/util";

//? Interfaces

export interface IHabit extends IHabitTemplate {
  id: string
  userId: string
  count: number
  heatmap: { [offset: number]: number }
  createdAt: Date
  lastUpdated: Date
}

export interface IHabitTemplate {
  title: string
  description: string
  dailyTarget: number
  userId: string
}

export interface Component {
  data: {
    habits: Record<IHabit["id"], IHabit>
  }

  add: (habit: IHabit) => void
  create: (props: IHabitTemplate) => IHabit
  read: (id: IHabit["id"]) => Maybe<IHabit>
  update: (id: IHabit["id"], props: IHabitTemplate) => IHabit
  remove: (id: IHabit["id"]) => void
  commit: (id: IHabit["id"], count: number) => void
  count: () => number
}

const create: Component["create"] = (props) => {
  return {
    ...props,
    id: ID.habit(),
    count: 0,
    createdAt: new Date(),
    lastUpdated: new Date(),
    heatmap: [0]
  }
}

const read: Component["read"] = () => { }
const commit: Component["commit"] = () => { }
const update: Component["update"] = () => { }
const remove: Component["remove"] = () => { }


const CreateHabit = Kind<{ habit: IHabit }>({
  onCreate: (data) => ({
    kind: "CreateHabit",
    data,
    timestamp: Date.now()
  }),
  onShare(status) {
    console.log(`[trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
  },
})

const CommitHabit = Kind<{ habitId: IHabit["id"], count: number }>({
  onCreate: (data) => ({
    kind: "CommitHabit",
    data,
    timestamp: Date.now()
  }),
  onShare(status) {
    console.log(`[trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
  },
})

const Habit = Cell({ CreateHabit, CommitHabit })

export default Habit

/**
 * 
 * EventKind<{ title: string, description: string }>
 */