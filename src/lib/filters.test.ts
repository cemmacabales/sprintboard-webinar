import { describe, expect, it, vi } from "vitest";
import type { Task } from "../types/task";
import { isAtRisk } from "./filters";

const now = new Date(2026, 8, 12, 12);

function task(dueDate: string | null, status: Task["status"] = "todo"): Task {
  return {
    id: `${status}-${dueDate}`,
    title: "Boundary task",
    description: "A focused fixture for the date window.",
    owner: "Mara",
    status,
    priority: "medium",
    dueDate,
  };
}

describe("isAtRisk", () => {
  it("includes incomplete tasks due today through exactly seven days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);

    expect(isAtRisk(task("2026-09-12"))).toBe(true);
    expect(isAtRisk(task("2026-09-19"))).toBe(true);

    vi.useRealTimers();
  });

  it("excludes completed, overdue, distant, missing, and invalid due dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);

    expect(isAtRisk(task("2026-09-14", "done"))).toBe(false);
    expect(isAtRisk(task("2026-09-11"))).toBe(false);
    expect(isAtRisk(task("2026-09-20"))).toBe(false);
    expect(isAtRisk(task(null))).toBe(false);
    expect(isAtRisk(task("not-a-date"))).toBe(false);

    vi.useRealTimers();
  });
});
