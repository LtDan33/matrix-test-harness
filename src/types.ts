// Type definitions for the Matrix test harness
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Stats {
  totalTodos: number;
  completedTodos: number;
}
