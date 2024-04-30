import * as Trekie from "../Trekie"

import { Maybe, Timestamp, util } from "../lib/util"
import { db } from "../../../web/src/shared/lib/db"
import { uuid } from '../lib/id'

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

export interface Interface {
  add: (habit: IHabit) => void
  create: (template: IHabitTemplate) => Maybe<IHabit>
  get: (id: IHabit["id"]) => Promise<Maybe<IHabit>>
  update: (id: IHabit["id"], props: IHabitTemplate) => Promise<Maybe<IHabit>>
  remove: (id: IHabit["id"]) => void
  commit: (id: IHabit["id"], count: number) => Promise<number | false>
  count: () => Promise<number>
}

export const Component = Trekie.Component<Interface>((game) => ({
  add(habit) {
    db.habits.add(habit, habit.id)

    // make sure the user has active session
    const currentUser = game.getState().user
    if (!currentUser) return

    // make sure the user owns the habit
    const currentUserId = currentUser?.id
    if (currentUserId !== habit.userId) return

    game.setState($ => {
      $.xpTargetDaily += habit.dailyTarget
    })
  },

  async remove(id) {
    let updateStats = false
    let removedHabit = await this.get(id)

    await db.habits.delete(id)

    // make sure the user has active session
    const currentUser = game.getState().user
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

    if (updateStats) game.getState().refresh()
  },

  repository: db.habits,

  get: (id) => db.habits.get(id),

  count: () => db.habits.count(),

  async commit(id, count) {
    const habit = await this.get(id)
    if (!habit) return false

    const user = game.getState().user
    if (!user) return false

    const dayDiff = util.getDayDiff(habit.createdAt, Date.now())
    const habitCount = (habit.heatmap[dayDiff] ?? 0) + count //! ask to @berkcambaz

    // Habit count can NOT be negative
    if (habitCount < 0) return false

    //? now can successfully commit habit 👍🏻
    habit.count += count
    habit.heatmap[dayDiff] = habitCount

    // If habit count has become 0, remove the property
    if (habit.heatmap[dayDiff]! <= 0)
      delete habit.heatmap[dayDiff]

    game.setState($ => {
      $.xp += count
      $.xp += Math.max(Math.min(habit.dailyTarget - (habitCount - count), count), count)
    })

    db.habits.put(habit, habit.id)
    return habit.count
  },

  async update(id, props) {
    await db.habits.update(id, props)
    return await db.habits.get(id)
  },

  create(template) {
    const userId = game.getState().user?.id
    if (!userId) return

    return {
      ...template,

      id: uuid().toString(),
      count: 0,
      createdAt: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      heatmap: [0],
      userId,

    } satisfies IHabit
  },
}))

export default Component