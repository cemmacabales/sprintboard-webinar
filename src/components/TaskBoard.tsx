import type { Task, TaskStatus } from "../types/task";
import { TaskCard } from "./TaskCard";

const columns: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "Todo" },
  { status: "in-progress", label: "In progress" },
  { status: "done", label: "Done" },
];

interface TaskBoardProps {
  tasks: Task[];
  onOpen: (task: Task) => void;
}

export function TaskBoard({ tasks, onOpen }: TaskBoardProps) {
  if (tasks.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <span className="empty-orbit" aria-hidden="true" />
        <h2>No tasks in this view</h2>
        <p>Choose another filter to bring work back into view.</p>
      </section>
    );
  }

  return (
    <section className="board" aria-label="Task board">
      {columns.map(({ status, label }) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section className="board-column" key={status} aria-labelledby={`${status}-heading`}>
            <header className="column-heading">
              <h2 id={`${status}-heading`}>{label}</h2>
              <span>{columnTasks.length}</span>
            </header>
            <div className="task-stack">
              {columnTasks.map((task) => (
                <TaskCard task={task} onOpen={onOpen} key={task.id} />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}

