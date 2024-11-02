import { CommitEvent, Commitment, ICommitmentInstance, ICommitmentKind } from "@/core"
import { db } from "@/shared/lib/db"
import trekie from '@/shared/lib/trekie'
import { arrayRemoveItem, Maybe, Timestamp } from "@/shared/utils"
import { ulid } from "ulid"
import { IGoal, IGoalTemplate, schema } from './schema'
export * as Goal from "."
export * from "./schema"
export { schema } from './schema'

export const commitment = Commitment('Goal', {
  'START': CommitEvent(() => ({ xp: +25, coins: 0 })),
  'PROGRESS_BEGIN': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'PROGRESS_HALFWAY': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'PROGRESS_ALMOST': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'PROGRESS_DONE': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'COMMITMENT_ADD': CommitEvent(() => ({ xp: +1, coins: 0 })),
  'COMMITMENT_DROP': CommitEvent(() => ({ xp: -1, coins: 0 })),
  'REACH': CommitEvent(() => ({ xp: +1000, coins: +25 })),
  'GIVEUP': CommitEvent((status) => ({ xp: -100, coins: -1 })),
})

//? COMPONENT

export interface Interface {
  get: (id: IGoal["id"]) => Promise<Maybe<IGoal>>
  create: (template: IGoalTemplate) => Promise<Maybe<IGoal>>
  add: (goal: IGoal) => Promise<string>
  update: (id: IGoal["id"], props: IGoalTemplate) => Promise<number>
  delete: (id: IGoal["id"]) => void
  giveup: (id: IGoal["id"]) => void
  count: () => Promise<number>
  addCommitment: (goalId: IGoal['id'], commitmentId: ICommitmentInstance['id']) => Promise<boolean>
  dropCommitment: (goalId: IGoal['id'], commitmentId: ICommitmentInstance['id']) => Promise<boolean>
}

export const Component: Interface = {
  get: (id) => db.goals.get(id),
  add: (goal) => db.goals.add(goal, goal.id),
  update: (id, props) => db.goals.update(id, { ...props }),
  count: () => db.goals.count(),
  delete: async (id) => {
    let goal = await db.goals.get(id)
    if (!goal) return

    trekie.commitments.delete(goal.commitmentId)
    await db.goals.delete(id)
  },

  async create(props) {
    let instance = trekie.commitments.create('Habit')

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


}

export const goals = Component


