import { describe, it, expect, beforeEach } from "vitest";
import { TodoService } from "../service.js";

let service: TodoService;

beforeEach(() => {
  service = new TodoService();
});

describe("add", () => {
  it("adds a todo and returns it", () => {
    const todo = service.add("Buy milk");
    expect(todo.title).toBe("Buy milk");
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeTypeOf("number");
  });

  it("assigns incrementing ids", () => {
    const a = service.add("First");
    const b = service.add("Second");
    expect(b.id).toBeGreaterThan(a.id);
  });
});

describe("getAll", () => {
  it("returns empty array when no todos exist", () => {
    expect(service.getAll()).toEqual([]);
  });

  it("returns all added todos", () => {
    service.add("One");
    service.add("Two");
    expect(service.getAll()).toHaveLength(2);
  });
});

describe("remove", () => {
  it("removes an existing todo and returns true", () => {
    const todo = service.add("To remove");
    expect(service.remove(todo.id)).toBe(true);
    expect(service.getAll()).toHaveLength(0);
  });

  it("returns false for a non-existent id", () => {
    expect(service.remove(999)).toBe(false);
  });
});
