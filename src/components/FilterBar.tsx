import type { Task } from "../types/task";
import type { TaskFilter } from "../lib/filters";

const labels: Record<TaskFilter, string> = {
  all: "All",
  active: "Active",
  done: "Done",
};

interface FilterBarProps {
  filter: TaskFilter;
  tasks: Task[];
  onChange: (filter: TaskFilter) => void;
}

export function FilterBar({ filter, tasks, onChange }: FilterBarProps) {
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    active: tasks.filter((task) => task.status !== "done").length,
    done: tasks.filter((task) => task.status === "done").length,
  };

  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {(Object.keys(labels) as TaskFilter[]).map((value) => (
        <button
          className="filter-button"
          data-active={filter === value}
          aria-pressed={filter === value}
          key={value}
          onClick={() => onChange(value)}
          type="button"
        >
          <span>{labels[value]}</span>
          <span className="filter-count" aria-hidden="true">
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
}

