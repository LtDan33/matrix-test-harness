import { Todo, Stats, Priority } from "./types.js";

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

  search(query: string): Todo[] {
    const lower = query.toLowerCase();
    return this.todos.filter((t) => t.title.toLowerCase().includes(lower));
  }

  getById(id: number): Todo | null {
    return this.todos.find((t) => t.id === id) ?? null;
  }

  add(title: string, priority: Priority = "medium", dueDate?: string): Todo {
    const todo: Todo = { id: this.nextId++, title, completed: false, priority, createdAt: new Date().toISOString() };
    if (dueDate !== undefined) todo.dueDate = dueDate;
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

  setCompleted(id: number, completed: boolean): Todo | null {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    todo.completed = completed;
    return todo;
  }

  updateTitle(id: number, title: string): Todo | null {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    todo.title = title;
    return todo;
  }

  patch(id: number, updates: { title?: string; completed?: boolean; priority?: Priority; dueDate?: string | null }): Todo | null {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return null;
    if (updates.title !== undefined) todo.title = updates.title;
    if (updates.completed !== undefined) todo.completed = updates.completed;
    if (updates.priority !== undefined) todo.priority = updates.priority;
    if (updates.dueDate !== undefined) {
      if (updates.dueDate === null) {
        delete todo.dueDate;
      } else {
        todo.dueDate = updates.dueDate;
      }
    }
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
