import { Task } from "./types";

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getTasksForDate(tasks: Task[], selectedDate: string): Task[] {
  const today = getTodayString();
  return tasks.filter((t) => {
    if (!t.dueDate) {
      return t.createdAt.slice(0, 10) === selectedDate;
    }
    if (selectedDate < today || selectedDate > t.dueDate) return false;
    if (t.status === "done") {
      return t.updatedAt.slice(0, 10) === selectedDate;
    }
    return true;
  });
}
