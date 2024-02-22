import * as Trekie from "#/Trekie"

import { Maybe, Timestamp, util } from "#/lib/util"
import ID from "#/lib/id"
import { Cell, IEvent, IStatus, Event, Store } from "#/lib/supercell"
import Supercell from "#/lib/supercell"

//? Interfaces

export interface IHabit extends IHabitTemplate {
  id: string
  count: number
  createdAt: Timestamp
  lastUpdated: Timestamp

  heatmap: { [offset: number]: number }
}

export interface IHabitTemplate {
  title: string
  description: string
  dailyTarget: number
  userId: string
}

//? Interfaces

export interface Interface extends Trekie.ComponentBase<State, Events> {
  add: (habit: IHabit) => void
  create: (props: IHabitTemplate) => IHabit
  get: (id: IHabit["id"]) => Maybe<IHabit>
  update: (id: IHabit["id"], props: IHabitTemplate) => IHabit
  remove: (id: IHabit["id"]) => void
  commit: (id: IHabit["id"], count: number) => void
  count: () => number
}

interface State {
  habits: Record<IHabit["id"], IHabit>
}

const store = Store<State>(() => ({
  habits: {}
}))

export const Component = Trekie.Component<Interface, State, Events>((game) => ({
  events,
  store,
  cell,

  add(habit) {
    store.setState($ => {
      $.habits[habit.id] = habit

      // make sure has user + session
      const currentUserId = game($ => $.user?.id)
      const currentUser = game($ => $.user)
      if (!currentUser) return

      if (currentUserId !== habit.userId) return

      game.setState($ => {
        $.xpTargetDaily += habit.dailyTarget
      })
    })
  },

  remove(id) {
    let updateStats = false
    let removedHabit = this.get(id)

    store.setState($ => {
      delete $.habits[id]

      const currentUser = $.habits
      if (!currentUser || !removedHabit)
        return

      updateStats = true

      const habitDailyCurrent = removedHabit.heatmap[util.getDayDiff(removedHabit.createdAt, Date.now())] ?? 0
      const habitDailyTarget = removedHabit.dailyTarget
      const habitCount = removedHabit.count

      game.setState($ => {
        $.xp -= habitCount
        $.xpToday -= Math.min(habitDailyCurrent, habitDailyTarget)
        $.xpTargetDaily -= habitDailyTarget
      })
    })

    if (updateStats) game().refresh()
  },

  get: (id) => store($ => $.habits[id]),

  count: () => Object.entries(store($ => $.habits)).length,

  commit(id, count) {
    store.setState($ => {
      const habit = $.habits[id]
      if (!habit) return

      const user = game($ => $.user)
      if (!user) return

      const dayDiff = util.getDayDiff(habit.createdAt, Date.now())
      const habitCount = (habit.heatmap[dayDiff] ?? 0) + count

      // Habit count can not be negative
      if (habitCount < 0) return

      habit.count += count
      habit.heatmap[dayDiff] = habitCount

      // If habit count has become 0, remove the property
      if (habit.heatmap[dayDiff]! <= 0)
        delete habit.heatmap[dayDiff]

      game.setState($ => {
        $.xp += count
        $.xp += Math.max(
          Math.min(habit.dailyTarget - (habitCount - count), count),
          count
        )
      })
    })
  },

  update(id, props) {
    const updatedHabit = this.create(props)

    store.setState($ => {
      $.habits[id] = updatedHabit
    })

    return updatedHabit
  },

  create(props) {
    return {
      ...props,

      id: ID.habit(),
      count: 0,
      createdAt: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      heatmap: [0]
    }
  },
}))

export type Events = typeof events
const events = {
  'habit:create': Event<{ habit: IHabit }>({
    onCreate: (data) => ({
      kind: "habit:create",
      data,
      timestamp: Date.now()
    }),
    onShare(status): Trekie.
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

const cell = Cell<Events>(events)

export default Component