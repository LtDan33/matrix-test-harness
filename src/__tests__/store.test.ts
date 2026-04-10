import { describe, it, expect, beforeEach } from "vitest";
import { add, remove, getAll } from "../store.js";

// The store uses module-level state, so we clean up between tests
beforeEach(() => {
  for (const todo of [...getAll()]) {
    remove(todo.id);
  }
});

describe("add", () => {
  it("adds a todo and returns it", () => {
    const todo = add("Buy milk");
    expect(todo.title).toBe("Buy milk");
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeTypeOf("number");
  });

  it("assigns incrementing ids", () => {
    const a = add("First");
    const b = add("Second");
    expect(b.id).toBeGreaterThan(a.id);
  });
});

describe("getAll", () => {
  it("returns empty array when no todos exist", () => {
    expect(getAll()).toEqual([]);
  });

  it("returns all added todos", () => {
    add("One");
    add("Two");
    expect(getAll()).toHaveLength(2);
  });
});

describe("remove", () => {
  it("removes an existing todo and returns true", () => {
    const todo = add("To remove");
    expect(remove(todo.id)).toBe(true);
    expect(getAll()).toHaveLength(0);
  });

  it("returns false for a non-existent id", () => {
    expect(remove(999)).toBe(false);
  });
});
