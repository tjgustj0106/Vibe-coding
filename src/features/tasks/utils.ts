import { Task } from "./types";

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getTasksForDate(tasks: Task[], selectedDate: string): Task[] {
  return tasks.filter((t) => {
    if (!t.dueDate) {
      // 마감일 없는 할 일: 생성일에만 표시
      return t.createdAt.slice(0, 10) === selectedDate;
    }
    // 달력 바와 동일한 범위: createdAt ≤ selectedDate ≤ dueDate
    if (t.createdAt.slice(0, 10) > selectedDate || selectedDate > t.dueDate) return false;
    // 완료 항목: 완료한 날짜에만 표시
    if (t.status === "done") {
      return t.updatedAt.slice(0, 10) === selectedDate;
    }
    return true;
  });
}
