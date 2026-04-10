export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface Stats {
  totalTodos: number;
  completedTodos: number;
}
