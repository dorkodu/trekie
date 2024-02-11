import ID from "#/lib/id";

import { GameState, useStore } from "#/lib/store";

import { Cell, IEvent, IStatus, Event } from "#/lib/supercell"
import Supercell from "#/lib/supercell"

import { Maybe, Timestamp } from "#/lib/util";
import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";
import { TrekieComponent } from "..";

//? Interfaces

export interface IHabit extends IHabitTemplate {
  id: string
  count: number
  heatmap: { [offset: number]: number }
  createdAt: Timestamp
  lastUpdated: Timestamp

  // duplicate from IHabitTemplate: juuuuuuuust in case...
  title: string
  description: string
  dailyTarget: number
  userId: string
}

export interface IHabitTemplate {
  title: string
  description: string
  dailyTarget: number
  userId: string
}

export interface Interface extends TrekieComponent<ComponentState> {
  events: Record<string, IEvent<any>>
  store: UseBoundStore<StoreApi<ComponentState>>

  add: (habit: IHabit) => void
  create: (props: IHabitTemplate) => IHabit
  read: (id: IHabit["id"]) => Maybe<IHabit>
  update: (id: IHabit["id"], props: IHabitTemplate) => IHabit
  remove: (id: IHabit["id"]) => void
  commit: (id: IHabit["id"], count: number) => void
  count: () => number
}

const events = {
  'habit:create': Event<{ habit: IHabit }>({
    onCreate: (data) => ({
      kind: "habit:create",
      data,
      timestamp: Date.now()
    }),
    onShare(status) {
      console.log(`[trekie] <${status.kind}> with (${status.data}) @ "${(new Date(status.timestamp)).toISOString()}"`)
    },
  }),
  'habit:commit': Event<{ habitId: IHabit["id"], count: number }>({
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

const cell = Cell<typeof events>(events)

interface ComponentState {

}

const useStore = create<ComponentState>()((set) => ({
}))

export const Component: Interface = {
  events,
  cell,
  store: useStore,

  add(habit) {
    this
  },
  get(id) { },
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

export default Component