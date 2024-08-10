import { ulid } from "ulid"

import * as Trekie from "@/core/Trekie"

import { Daystamp, Maybe, Timestamp, daystamp, getDayDiff } from "@/shared/utils"
import { db } from "@/shared/lib/db"
import { errors } from "@/shared/lib/errors"

//? Interfaces

export interface IHabit extends IHabitTemplate {
  id: string
  count: number
  createdAt: Timestamp
  lastUpdated: Timestamp
  history: Map<Daystamp, number>
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
    // make sure the user has active session
    const currentUser = game.getState().user
    if (!currentUser) {
      errors.handle("NO_SESSION")
      return false
    }

    // make sure the user owns the habit
    const currentUserId = currentUser?.id
    if (currentUserId !== habit.userId) return false

    db.habits.add(habit, habit.id)

    game.setState($ => {
      $.xpTargetDaily += habit.dailyTarget
    })

    return true
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

    const habitDailyCurrent = removedHabit.history.get(daystamp.get(Date.now())) ?? 0
    const habitDailyTarget = removedHabit.dailyTarget
    const habitCount = removedHabit.count

    if (updateStats) {
      game.setState($ => {
        $.xp -= habitCount
        $.xpToday -= Math.min(habitDailyCurrent, habitDailyTarget)
        $.xpHistory[daystamp.today()] = $.xpToday
        $.xpTargetDaily -= habitDailyTarget
      })
      game.getState().refresh()
    }
  },

  repository: db.habits,

  get: (id) => db.habits.get(id),

  count: () => db.habits.count(),

  async commit(id, count) {
    const habit = await this.get(id)
    if (!habit) return false

    const user = game.getState().user
    if (!user) return false

    game.getState().refresh()

    const todaysCount = habit.history.get(daystamp.today()) ?? 0
    const updatedCount = todaysCount + count

    // daily updated count can NOT be negative
    if (updatedCount < 0) return false

    //? now can successfully commit habit 👍🏻
    habit.count += count
    habit.history.set(daystamp.today(), updatedCount)

    db.habits.put(habit, habit.id)

    game.getState().changeXp(count)

    game.getState().refresh()

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

      id: ulid(),
      count: 0,
      createdAt: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      history: new Map<Daystamp, number>(),
      userId,

    } satisfies IHabit
  },
}))

export * as Habit from "./habit"