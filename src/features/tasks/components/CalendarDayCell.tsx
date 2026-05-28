"use client";

import { Task } from "../types";
import { ScheduleEvent } from "../../schedule/types";

// 색상 팔레트 (과목명 해시 기반)
const SPAN_COLORS = ["#0066cc", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

function spanColor(subject?: string): string {
  if (!subject) return SPAN_COLORS[0];
  let hash = 0;
  for (const c of subject) hash = (hash * 31 + c.charCodeAt(0)) % SPAN_COLORS.length;
  return SPAN_COLORS[hash];
}

export type SpanTask = {
  task: Task;
  isStart: boolean; // 실제 시작일 (왼쪽 캡)
  isEnd: boolean;   // 실제 마감일 (오른쪽 캡)
};

type CalendarDayCellProps = {
  date: string;        // YYYY-MM-DD, empty = 빈 칸
  today: string;
  selectedDate: string;
  spanTasks: SpanTask[];      // 이 날에 걸쳐있는 과제 바
  dayEvents: ScheduleEvent[]; // 이 날의 시간 일정
  onClick: (date: string) => void;
};

export default function CalendarDayCell({
  date,
  today,
  selectedDate,
  spanTasks,
  dayEvents,
  onClick,
}: CalendarDayCellProps) {
  if (!date) {
    return <div className="aspect-square" />;
  }

  const day = Number(date.slice(8));
  const isToday = date === today;
  const isSelected = date === selectedDate;

  return (
    <button
      onClick={() => onClick(date)}
      aria-label={`${date}, 할 일 ${spanTasks.length}개, 일정 ${dayEvents.length}개`}
      className={`aspect-square flex flex-col items-start p-1 rounded-xl text-left transition-colors
        ${isSelected ? "bg-[#0066cc]/10 ring-1 ring-[#0066cc]" : "hover:bg-[#f5f5f7]"}`}
    >
      {/* 날짜 번호 */}
      <span
        className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-0.5 flex-shrink-0
          ${isToday ? "bg-[#0066cc] text-white" : "text-[#1d1d1f]"}`}
      >
        {day}
      </span>

      {/* 과제 기간 바 + 일정 점 */}
      <div className="w-full flex flex-col gap-0.5 overflow-hidden">
        {/* 과제 기간 바 (최대 2개) */}
        {spanTasks.slice(0, 2).map(({ task, isStart, isEnd }) => (
          <div
            key={task.id}
            title={task.title}
            className={`h-1.5 flex-shrink-0 ${
              isStart && isEnd
                ? "rounded-full mx-0.5"
                : isStart
                ? "rounded-l-full ml-0.5"
                : isEnd
                ? "rounded-r-full mr-0.5"
                : ""
            } ${task.status === "done" ? "opacity-40" : ""}`}
            style={{ backgroundColor: spanColor(task.subject) }}
          />
        ))}

        {/* 시간 일정 점 (최대 3개) */}
        {dayEvents.length > 0 && (
          <div className="flex gap-0.5 px-0.5 mt-0.5">
            {dayEvents.slice(0, 3).map((e) => (
              <span
                key={e.id}
                title={e.title}
                className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"
              />
            ))}
            {dayEvents.length > 3 && (
              <span className="text-[7px] text-[#6e6e73] leading-none self-center">
                +{dayEvents.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
