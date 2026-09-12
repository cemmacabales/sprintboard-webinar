import type { Task } from "../types/task";
import { parseDateOnly } from "./date";

export type TaskFilter = "all" | "active" | "done" | "at-risk";

export const FILTERS: readonly TaskFilter[] = ["all", "active", "done", "at-risk"];

export function isAtRisk(task: Task, now = new Date()): boolean {
  if (task.status === "done") return false;
  if (!task.dueDate) return false;

  const due = parseDateOnly(task.dueDate);
  if (!due) return false;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const finalDay = new Date(today);
  finalDay.setDate(finalDay.getDate() + 7);
  return due >= today && due <= finalDay;
}

export function isTaskFilter(value: string | null): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter);
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (filter === "active") return tasks.filter((task) => task.status !== "done");
  if (filter === "done") return tasks.filter((task) => task.status === "done");
  if (filter === "at-risk") return tasks.filter((task) => isAtRisk(task));
  return tasks;
}
