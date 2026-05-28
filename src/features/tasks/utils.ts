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
    // 완료 여부와 관계없이 범위 내 날짜에 표시 (필터 탭으로 전체/미완료/완료 구분)
    return t.createdAt.slice(0, 10) <= selectedDate && selectedDate <= t.dueDate;
  });
}
