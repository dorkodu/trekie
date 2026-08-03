import type { Maybe } from "@web/utils";
import { Component } from "./library";
import { ITodo, ITodoTemplate } from "./schema";

// Updatable fields (exclude immutable id, userId, createdAt)
export type TodoUpdate = Partial<ITodoTemplate & { completed: boolean; completedAt: number | null; updatedAt: number }>

export interface Interface {
  get: (id: ITodo["id"]) => Promise<Maybe<ITodo>>;
  create: (template: ITodoTemplate) => Promise<Maybe<ITodo>>;
  add: (todo: ITodo) => Promise<string>;
  update: (id: ITodo["id"], props: TodoUpdate) => Promise<number>;
  delete: (id: ITodo["id"]) => Promise<void>;
  toggle: (id: ITodo["id"]) => Promise<boolean>;
  count: () => Promise<number>;
}

export const todos = Component;

export * from "./library";
export * from "./schema";

export * as Todo from ".";
