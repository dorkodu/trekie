import { type ICommitmentInstance } from "@sdk/core/index"
import { type Maybe } from "@web/utils"
import { Component } from "./library"
import { IGoal, IGoalTemplate } from './schema'

export interface Interface {
  get: (id: IGoal["id"]) => Promise<Maybe<IGoal>>
  create: (template: IGoalTemplate) => Promise<Maybe<IGoal>>
  add: (goal: IGoal) => Promise<string>
  update: (id: IGoal["id"], props: IGoalTemplate) => Promise<number>
  delete: (id: IGoal["id"]) => Promise<void>
  giveup: (id: IGoal["id"]) => Promise<void>
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

