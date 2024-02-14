import ID from "#/lib/id";

import { Cell, IEvent, IStatus, Event } from "#/lib/supercell"
import Supercell from "#/lib/supercell"

import { Maybe, Timestamp } from "#/lib/util";
import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";
import { TrekieComponent, GameState, ComponentStore } from "#/Trekie";

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

export interface Interface extends TrekieComponent<ComponentState, ComponentEvents> {
  add: (habit: IHabit) => void
  create: (props: IHabitTemplate) => IHabit
  get: (id: IHabit["id"]) => Maybe<IHabit>
  update: (id: IHabit["id"], props: IHabitTemplate) => IHabit
  remove: (id: IHabit["id"]) => void
  commit: (id: IHabit["id"], count: number) => void
  count: () => number
}

type ComponentEvents = typeof events

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
  habits: Record<IHabit["id"], IHabit>
}

const store = ComponentStore<ComponentState>((set, get) => ({
  habits: {}
}))

export const Component: Interface = {
  events,
  cell,
  store,

  add(habit) {

  },
  get(id) {
    return this.store($ => $.habits[id])
  },
  count() {
    return Object.keys(this.store($ => $.habits)).length
  },
  commit(id, count) {
    this.store.setState($ => {
      const targetHabit = $.habits[id]

      if (!targetHabit) return

      const user = 
      if (!user) return

      const dayDiff = util.getDayDiff(habit.createdAt.getTime(), Date.now())
      const habitCount = (targetHabit.heatmap[dayDiff] ?? 0) + count

      // Habit count can not be negative
      if (habitCount < 0) return

      updateStats = true

      targetHabit.count += count
      targetHabit.heatmap[dayDiff] = habitCount

      // If habit count has become 0, remove the property
      if (targetHabit.heatmap[dayDiff]! <= 0)
        delete targetHabit.heatmap[dayDiff]

      $.xp += count
      $.dailyXpCurrent += Math.max(
        Math.min(habit.dailyTarget - (habitCount - count), count),
        count
      )
    })
  },
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

addHabit(habit) {
  set($ => {
    $.habits[habit.id] = habit

    // make sure has user + session
    const currentUserId = $.user?.id
    const currentUser = $.user
    if (!currentUser) return

    if (currentUserId !== habit.userId) return

    $.dailyXpTarget += habit.dailyTarget
  })
},

getHabit(id) {
  return get().habits[id]
},

removeHabit(id) {
  let updateStats = false
  let removedHabit = get().getHabit(id)

  set($ => {
    delete $.habits[id]

    const currentUser = $.user
    if (!currentUser || !removedHabit)
      return

    updateStats = true

    const habitDailyCurrent = removedHabit.heatmap[util.getDayDiff(removedHabit.createdAt.getTime(), Date.now())] ?? 0
    const habitDailyTarget = removedHabit.dailyTarget
    const habitCount = removedHabit.count

    $.xp -= habitCount
    $.dailyXpCurrent -= Math.min(
      habitDailyCurrent,
      habitDailyTarget
    )
    $.dailyXpTarget -= habitDailyTarget
  })

  if (updateStats) get().updateStats()
},

updateHabit(id, title, description, dailyTarget) {
  let updateStats = false

  set($ => {
    const habit = $.habits[id]
    if (!habit) return

    // make sure has active user session
    const user = $.user

    // make sure has active user session
    if (!user) return

    updateStats = true

    const habitDailyCurrent = habit.heatmap[util.getDayDiff(habit.createdAt.getTime(), Date.now())] ?? 0
    const habitDailyTarget = dailyTarget

    const habitDailyTargetDiff = habitDailyTarget - habit.dailyTarget

    habit.title = title
    habit.description = description
    habit.dailyTarget = dailyTarget

    $.dailyXpCurrent = Math.min(habitDailyTarget, habitDailyCurrent)
    $.dailyXpTarget += habitDailyTargetDiff
  })

  if (updateStats) get().updateStats()
},

trackHabit(habit, count) {
  let updateStats = false

  set($ => {
    const targetHabit = $.habits[habit.id]

    if (!targetHabit) return

    const user = $.user
    if (!user) return

    const dayDiff = util.getDayDiff(habit.createdAt.getTime(), Date.now())
    const habitCount = (targetHabit.heatmap[dayDiff] ?? 0) + count

    // Habit count can not be negative
    if (habitCount < 0) return

    updateStats = true

    targetHabit.count += count
    targetHabit.heatmap[dayDiff] = habitCount

    // If habit count has become 0, remove the property
    if (targetHabit.heatmap[dayDiff]! <= 0)
      delete targetHabit.heatmap[dayDiff]

    $.xp += count
    $.dailyXpCurrent += Math.max(
      Math.min(habit.dailyTarget - (habitCount - count), count),
      count
    )
  })

  if (updateStats) get().updateStats()
},

export default Component