import { formatDate } from "../lib/date";
import type { Task } from "../types/task";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="task-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="close-button" type="button" onClick={onClose} aria-label="Close task details">
          Close
        </button>
        <p className="eyebrow">{task.status.replace("-", " ")}</p>
        <h2>{task.title}</h2>
        <p className="drawer-description">{task.description}</p>
        <dl className="task-meta">
          <div>
            <dt>Owner</dt>
            <dd>{task.owner}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{task.priority}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd>{formatDate(task.dueDate)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

