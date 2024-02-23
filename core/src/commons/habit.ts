import * as Trekie from "../Trekie"

import { Maybe, Timestamp, util } from "../lib/util"
import ID from "../lib/id"
import { Cell, IEvent, IStatus, Event, Store } from "../lib/supercell"

//? Interfaces

export interface IHabit extends IHabitTemplate {
  id: string
  count: number
  createdAt: Timestamp
  lastUpdated: Timestamp
  heatmap: { [offset: number]: number }
  userId: string
}

export interface IHabitTemplate {
  title: string
  description: string
  dailyTarget: number
}

//? Interfaces

export interface Interface extends Trekie.ComponentInterface<State, Events> {
  add: (habit: IHabit) => void
  create: (template: IHabitTemplate) => Maybe<IHabit>
  get: (id: IHabit["id"]) => Maybe<IHabit>
  update: (id: IHabit["id"], props: IHabitTemplate) => Maybe<IHabit>
  remove: (id: IHabit["id"]) => void
  commit: (id: IHabit["id"], count: number) => number | false
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
    let result: number | boolean
    result = false

    store.setState($ => {
      const habit = $.habits[id]
      if (!habit) return

      const user = game($ => $.user)
      if (!user) return

      const dayDiff = util.getDayDiff(habit.createdAt, Date.now())
      const habitCount = (habit.heatmap[dayDiff] ?? 0) + count

      // Habit count can not be negative
      if (habitCount < 0) return

      //? now can successfully commit 👍🏻
      habit.count += count
      result = habit.count
      habit.heatmap[dayDiff] = habitCount

      // If habit count has become 0, re+move the property
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

    return result
  },

  update(id, props) {
    const updatedHabit = this.create(props)
    if (!updatedHabit) return

    store.setState($ => {
      $.habits[id] = updatedHabit
    })

    return updatedHabit
  },

  create(template) {
    const userId = game($ => $.user?.id)

    if (!userId) return

    return {
      ...template,

      id: ID.habit(),
      count: 0,
      createdAt: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      heatmap: [0],
      userId,

    } satisfies IHabit
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
    onShare: (status) => Trekie.log(status)
  }),
  'habit:commit': Event<{ habitId: IHabit["id"], count: number }>({
    onCreate: (data) => ({
      kind: "habit:commit",
      data,
      timestamp: Date.now()
    }),
    onShare: (status) => Trekie.log(status)
  })
}

const cell = Cell<Events>(events)

export default Component