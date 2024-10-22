import { CommitEvent, Commitment } from "@/core"
import { db } from "@/shared/lib/db"
import trekie from '@/shared/lib/trekie'
import { Maybe, Timestamp } from "@/shared/utils"
import { ulid } from "ulid"
import { IGoal, IGoalTemplate, schema } from './schema'
export * as Goal from "."
export { schema } from './schema'

export const commitment = Commitment('Goal', {
  'START': CommitEvent(() => ({ xp: +25, coins: 0 })),
  'PROGRESS_BEGIN': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'PROGRESS_HALFWAY': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'PROGRESS_ALMOST': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'PROGRESS_DONE': CommitEvent(() => ({ xp: +100, coins: 0 })),
  'COMMITMENT_ADD': CommitEvent(() => ({ xp: +1, coins: 0 })),
  'COMMITMENT_DROP': CommitEvent(() => ({ xp: -1, coins: 0 })),
  '': CommitEvent(() => ({ xp: +1000, coins: +25 })),
})

//? COMPONENT

export interface Interface {
  get: (id: IGoal["id"]) => Promise<Maybe<IGoal>>
  create: (template: IGoalTemplate) => Maybe<IGoal>
  add: (goal: IGoal) => Promise<string>
  update: (id: IGoal["id"], props: IGoalTemplate) => Maybe<IGoal>
  remove: (id: IGoal["id"]) => void
  count: () => Promise<number>
}

export const Component: Interface = {
  get: (id) => db.goals.get(id),
  add: (goal) => {
    return db.goals.add(goal, goal.id)
  },
  create(props) {
    const userId = trekie.game().user?.id
    if (!userId) return
    let status = trekie.commitments.create('Habit')

    return {
      ...props,
      id: ulid(),
      xpCurrent: 0,
      userId,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      commitmentId: status.data.instance.id,
    } satisfies IGoal
  },
  update(id, props) {
    const updatedGoal = this.create(props)
    if (!updatedGoal) return

    db.goals.update(id, props)

    return updatedGoal
  },
  count: () => db.goals.count(),
  remove: (id) => db.goals.delete(id),
}

export const goals = Component


