import { formatDate } from "../lib/date";
import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
}

export function TaskCard({ task, onOpen }: TaskCardProps) {
  return (
    <article className="task-card" data-priority={task.priority}>
      <button
        className="task-card-button"
        type="button"
        aria-label={`Open ${task.title}`}
        onClick={() => onOpen(task)}
      >
        <span className="task-card-topline">
          <span className="priority-label">{task.priority}</span>
          <span className="owner-avatar" aria-label={`Owned by ${task.owner}`}>
            {task.owner.slice(0, 1)}
          </span>
        </span>
        <strong>{task.title}</strong>
        <span className="task-description">{task.description}</span>
        <span className="due-date">
          {task.dueDate ? formatDate(task.dueDate) : "No date"}
        </span>
      </button>
    </article>
  );
}

