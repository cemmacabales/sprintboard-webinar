import { useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { TaskBoard } from "./components/TaskBoard";
import { TaskDetails } from "./components/TaskDetails";
import { tasks } from "./data/tasks";
import { filterTasks, isTaskFilter, type TaskFilter } from "./lib/filters";
import type { Task } from "./types/task";

function readFilter(): TaskFilter {
  const value = new URLSearchParams(window.location.search).get("filter");
  return isTaskFilter(value) ? value : "all";
}

export default function App() {
  const [filter, setFilter] = useState<TaskFilter>(readFilter);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [filter]);

  function selectFilter(nextFilter: TaskFilter) {
    const url = new URL(window.location.href);
    url.searchParams.set("filter", nextFilter);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    setFilter(nextFilter);
  }

  return (
    <main className="app-shell" aria-label="SprintBoard">
      <header className="hero">
        <div>
          <p className="eyebrow">Release operations</p>
          <h1>SprintBoard</h1>
          <p className="hero-copy">
            A compact view of the work that needs attention before the next release.
          </p>
        </div>
        <div className="release-marker" aria-label="Release window closes Friday">
          <span>Next release</span>
          <strong>Friday</strong>
        </div>
      </header>

      <section className="control-row" aria-label="Board controls">
        <FilterBar filter={filter} tasks={tasks} onChange={selectFilter} />
        <p className="result-summary" aria-live="polite">
          <strong>{visibleTasks.length}</strong> tasks shown
        </p>
      </section>

      <TaskBoard tasks={visibleTasks} onOpen={setSelectedTask} />
      {selectedTask ? <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} /> : null}
    </main>
  );
}
