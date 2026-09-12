import type { Task } from "../types/task";

export type TaskFilter = "all" | "active" | "done";

export const FILTERS: readonly TaskFilter[] = ["all", "active", "done"];

export function isTaskFilter(value: string | null): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter);
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return tasks.filter((task) => task.status !== "done");
  if (filter === "done") return tasks.filter((task) => task.status === "done");
  return tasks;
}

