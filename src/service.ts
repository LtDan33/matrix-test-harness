import { Todo, Stats } from "./types.js";

export class TodoService {
  private todos: Todo[] = [];
  private nextId = 1;

  getAll(): Todo[] {
    return this.todos;
  }

  getCompleted(): Todo[] {
    return this.todos.filter((t) => t.completed);
  }

  getPending(): Todo[] {
    return this.todos.filter((t) => !t.completed);
  }

  getById(id: number): Todo | null {
    return this.todos.find((t) => t.id === id) ?? null;
  }

  add(title: string): Todo {
    const todo: Todo = { id: this.nextId++, title, completed: false, createdAt: new Date().toISOString() };
    this.todos.push(todo);
    return todo;
  }

  addBulk(titles: string[]): Todo[] {
    return titles.map((title) => this.add(title));
  }

  toggle(id: number): Todo | null {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    todo.completed = !todo.completed;
    return todo;
  }

  updateTitle(id: number, title: string): Todo | null {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    todo.title = title;
    return todo;
  }

  clearCompleted(): number {
    const before = this.todos.length;
    this.todos = this.todos.filter((t) => !t.completed);
    return before - this.todos.length;
  }

  remove(id: number): boolean {
    const idx = this.todos.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.todos.splice(idx, 1);
    return true;
  }

  stats(): Stats {
    return {
      totalTodos: this.todos.length,
      completedTodos: this.getCompleted().length,
      pendingTodos: this.getPending().length,
    };
  }
}
