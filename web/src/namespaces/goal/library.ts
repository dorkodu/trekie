import { db } from "@web/lib/db"
import { errors } from "@web/lib/errors"
import { trekie } from "@web/lib/trekie"
import { trpc } from "@web/lib/trpc"
import { arrayRemoveItem } from "@web/utils"
import { ulid } from "ulidx"
import { IGoal, Interface } from "."

export const Component: Interface = {
  get: (id) => db.goals.get(id),
  add: (goal) => db.goals.add(goal, goal.id),
  update: (id, props) => db.goals.update(id, { ...props }),
  count: () => db.goals.count(),

  delete: async (id) => {
    const removedGoal = await db.goals.get(id)
    const user = trekie.game().user

    if (!removedGoal) {
      errors.handle("ITEM_NOT_FOUND")
      return // does not exist
    }

    if (user.id != removedGoal.userId) {
      errors.handle("NOT_AUTHORIZED")
      return // has no permission or habit/user does not exist
    }

    trekie.commitments.delete(removedGoal.commitmentId)

    await db.goals.delete(id)
  },

  async create(props) {
    let instance = await trekie.commitments.create('Goal')

    let goal = {
      ...props,
      id: ulid(),
      xpCurrent: 0,
      userId: trekie.game().user.id,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      commitmentId: instance.id,
      giveupAt: null,
      completedAt: null
    } satisfies IGoal

    // check locally for validation, if seems legit just do it.
    // when server returns success, its ok. if not, rollback. 
    // trpc or react query

    await this.add(goal)

    trekie.commitments.act({
      kind: 'Goal',
      event: 'START',
      id: goal.commitmentId,
      data: { goalId: goal.id }
    })

    return goal
  },

  async giveup(id) {
    const goal = await db.goals.get(id)
    if (!goal) return false

    await db.goals.update(id, {
      giveupAt: Date.now(),
      lastUpdated: Date.now()
    })

    trekie.commitments.act({
      kind: 'Goal',
      event: 'GIVEUP',
      id: goal.commitmentId,
      data: { goalId: goal.id }
    })

    return true
  },

  async addCommitment(goalId, commitmentId) {
    const goal = await this.get(goalId)
    if (!goal) return false

    const c = await trekie.commitments.get(commitmentId)
    if (!c) return false

    if (c.kind == 'Goal') return false // commitment can't be a goal 

    goal.commitments.push(commitmentId)

    await db.goals.update(goal.id, {
      commitments: goal.commitments,
      lastUpdated: Date.now()
    })

    trekie.commitments.act({
      kind: 'Goal',
      event: 'COMMITMENT_ADD',
      id: commitmentId,
      data: { goalId: goal.id, addedId: commitmentId }
    })

    return true
  },

  async dropCommitment(goalId, commitmentId) {
    const goal = await db.goals.get(goalId)
    if (!goal) return false

    const cmt = await trekie.commitments.get(commitmentId)
    if (!cmt) return false

    if (cmt.kind == 'Goal') return false // commitment can't be a goal

    await db.goals.update(goal.id, {
      commitments: arrayRemoveItem(goal.commitments, commitmentId),
      lastUpdated: Date.now()
    })

    trekie.commitments.act({
      kind: 'Goal',
      event: 'COMMITMENT_DROP',
      id: commitmentId,
      data: { goalId: goal.id, droppedId: commitmentId }
    })

    return true
  },

  // Returns a promise resolving to { xp: number, percent: number }
  async calculateProgress(goalId: string) {
    const goal = await db.goals.get(goalId)
    if (!goal || !Array.isArray(goal.commitments) || goal.commitments.length === 0) {
      return { xp: 0, percent: 0 }
    }
    // Get all commit records for all commitments in this goal
    const records = await trekie.db.commitRecords
      .where('instanceId')
      .anyOf(goal.commitments)
      .toArray()

    console.log("Records: ", records)

    // Sum all XP rewards
    const xp = records.reduce((sum, rec) => sum + (rec.reward?.xp || 0), 0)
    const percent = goal.xpTarget > 0 ? Math.min(100, Math.floor((xp / goal.xpTarget) * 100)) : 0
    return { xp, percent }
  },
}