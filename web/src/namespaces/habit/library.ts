import { ulid } from "ulidx"

import { db } from "@web/lib/db"
import { errors } from "@web/lib/errors"
import { trekie } from "@web/lib/trekie"
import { Daystamp, daystamp } from "@web/utils"
import { IHabit } from "../social/schema"

import { tryCatch } from "@web/utils/tryCatch"
import { Interface } from "."

// Helper function to check if a DAILYCHECK event already exists for today
async function getDailyChecksToday(commitmentId: string) {
  const today = daystamp.today()
  const todayStart = new Date(today.split('-').join('/')).setHours(0, 0, 0, 0)
  const todayEnd = new Date(todayStart).setHours(23, 59, 59, 999)

  // Query for DAILYCHECK events for this habit's commitment created today
  const existingChecks = await trekie.db.commitRecords
    .where('instanceId').equals(commitmentId)
    .filter(r =>
      r.event === 'DAILYCHECK' &&
      r.timestamp >= todayStart &&
      r.timestamp <= todayEnd
    )
    .toArray()

  return existingChecks
}

export const habits: Interface = {
  get: (id) => db.habits.get(id),
  getByCommitmentId: (commitmentId) => db.habits.where('commitmentId').equals(commitmentId).first(),
  add: (habit) => db.habits.add(habit, habit.id),
  count: () => db.habits.count(),
  delete: async (id) => {
    const removedHabit = await db.habits.get(id)
    const user = trekie.game().user

    if (!removedHabit)
      return errors.handle("ITEM_NOT_FOUND") // habit does not exist

    if (!removedHabit || user.id != removedHabit.userId)
      return errors.handle("NOT_AUTHORIZED") // has no permission or habit/user does not exist

    // await db.habits.update(id, { isDeleted: true }) // --> should delete but
    await db.habits.delete(id)
    await trekie.commitments.table.update(removedHabit.commitmentId, { isDeleted: true })
  },

  async changeCount(id, count) {
    const habit = await this.get(id)
    if (!habit) return false

    const todaysCount = habit.history.get(daystamp.today()) ?? 0
    const updatedCount = todaysCount + count

    // daily updated count can NOT be negative
    if (updatedCount < 0) return false

    //? now can successfully commit habit 👍🏻
    habit.count += count
    habit.history.set(daystamp.today(), updatedCount)

    await db.habits.put(habit, habit.id)

    // Track the last commit result for potential rollback
    let commitResult

    // If count is going up
    if (count > 0) {
      commitResult = await trekie.commitments.act({
        kind: 'Habit',
        event: 'COUNT_UP',
        id: habit.commitmentId,
        data: { count: updatedCount }
      })
    } else {
      // If count is going down
      commitResult = await trekie.commitments.act({
        kind: 'Habit',
        event: 'COUNT_DOWN',
        id: habit.commitmentId,
        data: { count: updatedCount }
      })
    }

    // Store the daily check commit ID if we trigger one
    let dailyCheckCommitId: string | undefined
    // Only trigger DAILYCHECK event if we're crossing the threshold today
    // (going from below target to at/above target) and haven't already triggered it today
    if (
      todaysCount < habit.dailyTarget
      && updatedCount >= habit.dailyTarget
    ) {
      // Check if we've already logged a DAILYCHECK today
      const alreadyCheckedToday = (await getDailyChecksToday(habit.commitmentId)).length > 0

      if (!alreadyCheckedToday) {
        const r = await trekie.commitments.act({
          kind: 'Habit',
          event: 'DAILYCHECK',
          id: habit.commitmentId,
          data: null
        })

        dailyCheckCommitId = r.id
      }
    }
    // If we previously crossed the threshold but now fall below it, rollback the DAILYCHECK rewards
    else if (
      todaysCount >= habit.dailyTarget
      && updatedCount < habit.dailyTarget
    ) {
      // Find today's DAILYCHECK event for this habit and roll it back
      const today = daystamp.today()
      const todayStart = new Date(today.split('-').join('/')).setHours(0, 0, 0, 0)
      const todayEnd = new Date(todayStart).setHours(23, 59, 59, 999)

      // Query for today's DAILYCHECK commit for this habit
      const { data: dailyChecks, error } = await tryCatch(getDailyChecksToday(habit.commitmentId))

      if (error) console.error("Error fetching DAILYCHECK records:", error)
      else {
        // Rollback any DAILYCHECK commits found
        for (const checkRecord of dailyChecks) {
          await trekie.commitments.rollback(checkRecord.id)
        }
      }
    }
    return habit.count
  },

  update: async (id, props) => db.habits.update(id, props),

  async create(template) {
    const userId = trekie.game().user.id
    if (!userId) return

    let instance = await trekie.commitments.create('Habit')

    let habit = {
      ...template,
      commitmentId: instance.id,

      id: ulid(),
      userId,
      count: 0,
      createdAt: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      history: new Map<Daystamp, number>(),
    } satisfies IHabit

    await this.add(habit)

    await trekie.commitments.act({
      kind: 'Habit',
      event: 'START',
      id: habit.commitmentId,
      data: { habitId: habit.id }
    })

    return habit
  },
}