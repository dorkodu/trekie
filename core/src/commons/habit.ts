import ID from "#/lib/id";
import { GameState, useStore } from "#/lib/store";

import { Cell, IEvent, IStatus, EventKind } from "#/lib/supercell"

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

export interface Interface {
  kinds: Record<string, IEvent<any>>

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

const kinds = {
  CreateHabit: EventKind<{ habit: IHabit }>({
    onCreate: (data) => ({
      kind: "CreateHabit",
      data,
      timestamp: Date.now()
    }),
    onShare(status) {
      console.log(`[trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
    },
  }),
  "habit:commit": EventKind<{ habitId: IHabit["id"], count: number }>({
    onCreate: (data) => ({
      kind: "habit:commit",
      data,
      timestamp: Date.now()
    }),
    onShare(status) {
      console.log(`[trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
    },
  })
}

const Component: Interface = {
  kinds,

  add(habit) {
    this.data.
  },
  read(id) { },
  commit() { },
  update(id, props) { },
  remove() { },
  create(props) {
    return {
      ...props,
      id: ID.habit(),
      count: 0,
      createdAt: new Date(),
      lastUpdated: new Date(),
      heatmap: [0]
    }
  },
}

const Habit = Cell(events)
Habit.share(Habit.status("CommitHabit", { count: 5, habitId: "sd" }))

export default Habit

/**
 * 
 * EventKind<{ title: string, description: string }>
 */