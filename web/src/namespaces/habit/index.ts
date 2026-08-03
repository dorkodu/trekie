import type { Maybe } from "@web/utils";
import type { IHabit, IHabitTemplate } from "../social/schema";

//? Interfaces

export interface Interface {
  add: (habit: IHabit) => Promise<string>
  create: (template: IHabitTemplate) => Promise<Maybe<IHabit>>
  get: (id: IHabit["id"]) => Promise<Maybe<IHabit>>
  getByCommitmentId: (commitmentId: IHabit["commitmentId"]) => Promise<Maybe<IHabit>>
  update: (id: IHabit["id"], props: IHabitTemplate) => Promise<number>
  delete: (id: IHabit["id"]) => void
  changeCount: (id: IHabit["id"], count: number) => Promise<number | false>
  count: () => Promise<number>
}

export * from "../social/schema";
export * from "./commitment";
export * from "./library";


