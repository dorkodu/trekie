import { ulid } from "ulid"

import * as Trekie from "@/core"

import { db } from "@/shared/lib/db"
import { errors } from "@/shared/lib/errors"
import trekie from "@/shared/lib/trekie"
import { Daystamp, Maybe, Timestamp, daystamp, getDayDiff } from "@/shared/utils"
import { z } from "zod"

//? Interfaces

export type IHabit = z.infer<typeof IHabit>
export type IHabitTemplate = z.infer<typeof IHabitTemplate>

export const IHabitTemplate = z.object({
  title: z.string(),
  description: z.string(),
  dailyTarget: z.number().min(1)
})

export const IHabit = IHabitTemplate.extend({
  id: z.string().ulid(),
  count: z.number().min(0),
  createdAt: z.number() satisfies z.ZodType<Timestamp>,
  lastUpdated: z.number() satisfies z.ZodType<Timestamp>,
  history: z.map(z.string(), z.number()),
  userId: z.string().ulid(),
  commitmentId: z.string().ulid()
})

//? Interfaces

export interface Interface {
  add: (habit: IHabit) => void
  create: (template: IHabitTemplate) => Maybe<IHabit>
  get: (id: IHabit["id"]) => Promise<Maybe<IHabit>>
  update: (id: IHabit["id"], props: IHabitTemplate) => Promise<Maybe<IHabit>>
  remove: (id: IHabit["id"]) => void
  commit: (id: IHabit["id"], count: number) => Promise<number | false>
  count: () => Promise<number>
  repository: typeof db.habits
}

export const Component: Interface = {
  add(habit) {
    // make sure the user has active session
    const user = trekie.game().user
    if (!user) {
      errors.handle("NO_SESSION")
      return false
    }

    // make sure the user owns the habit
    if (user.id !== habit.userId) return false

    db.habits.add(habit, habit.id)

    trekie.commitments.act({ kind: 'Habit', event: 'CREATE', id: habit.commitmentId, data: {} })

    return true
  },

  async remove(id) {
    const removedHabit = await this.get(id)
    const user = trekie.game().user

    if (!user || !removedHabit || user.id != removedHabit.userId)
      return // has no permission or habit/user does not exist


    await db.habits.delete(id)

    let instance = trekie.commitments.create('Todo')
    trekie.commitments.remove(instance.id)
    trekie.commitments.act({ kind: 'Habit', event: 'CREATE', id: instance.id, data: {} })
  },

  repository: db.habits,

  get: (id) => db.habits.get(id),

  count: () => db.habits.count(),

  async commit(id, count) {
    const habit = await this.get(id)
    if (!habit) return false

    // TODO:  trekie refresh

    const todaysCount = habit.history.get(daystamp.today()) ?? 0
    const updatedCount = todaysCount + count

    // daily updated count can NOT be negative
    if (updatedCount < 0) return false

    //? now can successfully commit habit 👍🏻
    habit.count += count
    habit.history.set(daystamp.today(), updatedCount)

    db.habits.put(habit, habit.id)

    trekie.commit({
      kind: 'Habit',
      event: 'COUNT_UP',
      id: habit.commitmentId,
    })

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
}

export * as Habit from "."

