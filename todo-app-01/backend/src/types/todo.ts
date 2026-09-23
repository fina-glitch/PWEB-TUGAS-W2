export interface CreateTodoDTO {
  task: string;
}

export interface UpdateTodoDTO {
  task?: string;
  completed?: boolean;
}

export interface TodoResponse {
  id: number;
  userId: number;
  task: string;
  completed: boolean;
}