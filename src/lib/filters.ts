import type { Task } from "../types/task";

export type TaskFilter = "all" | "active" | "done" | "at-risk";

export const FILTERS: readonly TaskFilter[] = ["all", "active", "done", "at-risk"];

export function isAtRisk(task: Task, now = new Date()): boolean {
  if (task.status === "done" || !task.dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
    return false;
  }

  const [year, month, day] = task.dueDate.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);
  if (
    dueDate.getFullYear() !== year ||
    dueDate.getMonth() !== month - 1 ||
    dueDate.getDate() !== day
  ) {
    return false;
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const finalDay = new Date(today);
  finalDay.setDate(finalDay.getDate() + 7);
  return dueDate >= today && dueDate <= finalDay;
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
