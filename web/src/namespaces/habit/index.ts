import { Maybe } from "@/shared/utils"
import { Component } from "./component"
import { IHabit, IHabitTemplate } from "./schema"

//? Interfaces

export interface Interface {
  add: (habit: IHabit) => Promise<string>
  create: (template: IHabitTemplate) => Promise<Maybe<IHabit>>
  get: (id: IHabit["id"]) => Promise<Maybe<IHabit>>
  update: (id: IHabit["id"], props: IHabitTemplate) => Promise<Maybe<IHabit>>
  delete: (id: IHabit["id"]) => void
  changeCount: (id: IHabit["id"], count: number) => Promise<number | false>
  count: () => Promise<number>
}

export const habits = Component

export * from "./commitment"
export * from "./component"
export * from "./schema"

export * from "./schema"

