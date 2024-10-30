import { ulid } from "ulid"

import * as Trekie from "@/core"
import { CommitEvent, Commitment } from "@/core"

import { db } from "@/shared/lib/db"
import { errors } from "@/shared/lib/errors"
import trekie from "@/shared/lib/trekie"
import { Daystamp, Maybe, Timestamp, daystamp, getDayDiff } from "@/shared/utils"
import { IHabit, IHabitTemplate } from "./schema"

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

export const commitment = Commitment('Habit', {
  'CREATE': CommitEvent(() => ({ xp: +5, coins: +1 })),
  'UPDATE': CommitEvent(() => ({ xp: +1, coins: 0 })),
  'DAILYCHECK': CommitEvent(() => ({ xp: +3, coins: 0 })),
  'COUNT_UP': CommitEvent(() => ({ xp: 0, coins: 0 })),
  'COUNT_DOWN': CommitEvent(() => ({ xp: 0, coins: 0 })),
})

export const Component: Interface = {
  add(habit) {
    const user = trekie.game().user

    // make sure the user owns the habit
    if (user.id !== habit.userId) {
      errors.handle("NOT_AUTHORIZED")
      return
    }

    db.habits.add(habit, habit.id)
  },

  async remove(id) {
    const removedHabit = await this.get(id)
    const user = trekie.game().user

    if (!user || !removedHabit || user.id != removedHabit.userId) {
      errors.handle("NOT_AUTHORIZED")
      return // has no permission or habit/user does not exist
    }

    trekie.commitments.delete(removedHabit.commitmentId)

    await db.habits.delete(id)
  },

  get: (id) => db.habits.get(id),

  count: () => db.habits.count(),

  async commit(id, count) {
    const habit = await this.get(id)
    if (!habit) return false

    const todaysCount = habit.history.get(daystamp.today()) ?? 0
    const updatedCount = todaysCount + count

    // daily updated count can NOT be negative
    if (updatedCount < 0) return false

    //? now can successfully commit habit 👍🏻
    habit.count += count
    habit.history.set(daystamp.today(), updatedCount)

    db.habits.put(habit, habit.id)

    trekie.commitments.act({
      kind: 'Habit',
      event: 'COUNT_UP',
      id: habit.commitmentId,
      data: { count: updatedCount }
    })

    return habit.count
  },

  async update(id, props) {
    await db.habits.update(id, props)
    return await db.habits.get(id)
  },

  create(template) {
    const userId = trekie.game().user.id
    if (!userId) return

    let instance = trekie.commitments.create('Habit')

    return {
      ...template,
      commitmentId: instance.id,

      id: ulid(),
      userId,
      count: 0,
      createdAt: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      history: new Map<Daystamp, number>(),
    } satisfies IHabit
  },
}

export const habits = Component
export * as Habit from "."
export * from "./schema"


