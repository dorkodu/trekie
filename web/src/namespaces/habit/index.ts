import { Maybe } from "@web/shared/utils"
import { habits } from "./library"
import { IHabit, IHabitTemplate } from "./schema"

//? Interfaces

export interface Interface {
  add: (habit: IHabit) => Promise<string>
  create: (template: IHabitTemplate) => Promise<Maybe<IHabit>>
  get: (id: IHabit["id"]) => Promise<Maybe<IHabit>>
  update: (id: IHabit["id"], props: IHabitTemplate) => Promise<number>
  delete: (id: IHabit["id"]) => void
  changeCount: (id: IHabit["id"], count: number) => Promise<number | false>
  count: () => Promise<number>
}

export * from "./commitment"
export * from "./library"
export * from "./schema"


