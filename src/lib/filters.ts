import type { Task } from "../types/task";
import { isWithinNextDays } from "./date";

export type TaskFilter = "all" | "active" | "done" | "at-risk";

export const FILTERS: readonly TaskFilter[] = ["all", "active", "done", "at-risk"];

export function isAtRisk(task: Task, now = new Date()): boolean {
  return task.status !== "done" && isWithinNextDays(task.dueDate, 7, now);
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
