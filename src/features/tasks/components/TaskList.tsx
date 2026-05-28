import { Task, TaskStatus } from "../types";
import TaskCard from "./TaskCard";
import FilterTabs from "./FilterTabs";
import EmptyState from "./EmptyState";

type Filter = TaskStatus | "all";

type TaskListProps = {
  tasks: Task[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onToggle: (id: string) => void;
  onClickDetail: (task: Task) => void;
  onAdd: () => void;
  selectedDate: string;
};

export default function TaskList({
  tasks, filter, onFilterChange, onToggle, onClickDetail, onAdd, selectedDate,
}: TaskListProps) {
  const filtered = tasks.filter((t) => filter === "all" || t.status === filter);
  const sorted = [...filtered].sort((a, b) =>
    a.status === b.status ? 0 : a.status === "todo" ? -1 : 1
  );

  return (
    <div className="flex flex-col gap-4">
      <FilterTabs current={filter} onChange={onFilterChange} />
      {sorted.length === 0 ? (
        <EmptyState onAdd={onAdd} selectedDate={selectedDate} />
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onClickDetail={onClickDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
