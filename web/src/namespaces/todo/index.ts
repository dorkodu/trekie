import type { Maybe } from "@web/utils";
import { Component } from "./library";
import { ITodo, ITodoTemplate } from "./schema";

export interface Interface {
  get: (id: ITodo["id"]) => Promise<Maybe<ITodo>>;
  create: (template: ITodoTemplate) => Promise<Maybe<ITodo>>;
  add: (todo: ITodo) => Promise<string>;
  update: (id: ITodo["id"], props: Partial<ITodoTemplate & { completed: boolean }>) => Promise<number>;
  delete: (id: ITodo["id"]) => Promise<void>;
  toggle: (id: ITodo["id"]) => Promise<boolean>;
  count: () => Promise<number>;
}

export const todos = Component;

export * from "./library";
export * from "./schema";

export * as Todo from ".";
