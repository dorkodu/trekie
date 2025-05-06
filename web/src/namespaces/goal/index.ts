import { ICommitmentInstance } from "@sdk/core/index"
import { Maybe } from "@web/shared/utils"
import { Component } from "./library"
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
  calculateProgress: (goalId: IGoal['id']) => Promise<{ xp: number, percent: number }>
}

export const goals = Component

export * from "./commitment"
export * from "./library"
export * from "./schema"

export * as Goal from "."

