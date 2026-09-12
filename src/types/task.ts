export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}

