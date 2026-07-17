export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  tags: string[];
  overdue: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  due_date?: string | null;
  tags: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  tag?: string;
  overdue?: boolean;
}