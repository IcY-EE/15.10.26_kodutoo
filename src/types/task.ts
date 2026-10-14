export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewTask {
  title: string;
  description?: string | null;
  priority?: Priority;
  due_date?: string | null;
}

export type TaskUpdate = Partial<NewTask & { completed: boolean }>;
