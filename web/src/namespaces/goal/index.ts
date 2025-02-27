import { ICommitmentInstance } from "@web/core"
import { Maybe } from "@web/shared/utils"
import { Component } from "./component"
import { IGoal, IGoalTemplate, schema } from './schema'

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

export const goals = Component

export * from "./commitment"
export * from "./component"
export * from "./schema"

export * as Goal from "."

