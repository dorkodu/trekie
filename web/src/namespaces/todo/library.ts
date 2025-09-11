import { db } from "@web/lib/db";
import { errors } from "@web/lib/errors";
import { trekie } from "@web/lib/trekie";
import { ulid } from "ulidx";
import { ITodo, type Interface } from ".";

export const Component: Interface = {
  get: (id) => db.todos.get(id),
  add: (todo) => db.todos.add(todo, todo.id),
  update: (id, props) => db.todos.update(id, { ...props, updatedAt: Date.now() }),
  count: () => db.todos.count(),

  delete: async (id) => {
    const removedTodo = await db.todos.get(id);
    const user = trekie.game().user;

    if (!removedTodo) {
      errors.handle("ITEM_NOT_FOUND");
      return;
    }

    if (user.id !== removedTodo.userId) {
      errors.handle("NOT_AUTHORIZED");
      return;
    }

    return await db.todos.delete(id);
  },

  async create(template) {
    const userId = trekie.game().user.id;
    if (!userId) return;

    const todo = {
      ...template,
      id: ulid(),
      userId,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null,
    } satisfies ITodo;

    await this.add(todo);
    return todo;
  },

  async toggle(id) {
    const todo = await this.get(id);
    if (!todo) return false;

    const completed = !todo.completed;
    const completedAt = completed ? Date.now() : null;

    await this.update(id, { completed, completedAt });
    return completed;
  },
};
