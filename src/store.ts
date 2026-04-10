import { Todo } from "./types.js";

let nextId = 1;
const todos: Todo[] = [];

export function getAll(): Todo[] {
  return todos;
}

export function getById(id: number): Todo | null {
  return todos.find((t) => t.id === id) ?? null;
}

export function add(title: string): Todo {
  const todo: Todo = { id: nextId++, title, completed: false };
  todos.push(todo);
  return todo;
}

export function toggle(id: number): Todo | null {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  todo.completed = !todo.completed;
  return todo;
}

export function updateTitle(id: number, title: string): Todo | null {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  todo.title = title;
  return todo;
}

export function remove(id: number): boolean {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  todos.splice(idx, 1);
  return true;
}
