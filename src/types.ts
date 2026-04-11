// Type definitions for the Matrix test harness
export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  dueDate?: string;
}

export interface Stats {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
}
