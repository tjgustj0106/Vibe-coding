"use client";

import { useMemo, useState } from "react";
import { Task } from "../types";
import { ScheduleEvent } from "../../schedule/types";
import CalendarDayCell, { SpanTask } from "./CalendarDayCell";
import CalendarDayModal from "./CalendarDayModal";

type CalendarGridProps = {
  tasks: Task[];
  events: ScheduleEvent[];
  today: string;
  selectedDate: string;
  onDateClick: (date: string) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getMonthGrid(year: number, month: number): string[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: string[] = [];
  for (let i = 0; i < firstDay; i++) cells.push("");
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    cells.push(`${year}-${mm}-${dd}`);
  }
  while (cells.length % 7 !== 0) cells.push("");
  return cells;
}

/**
 * 특정 날짜에 걸쳐있는 과제(기간 바 표시용)를 계산한다.
 * - 기간: createdAt ~ dueDate
 * - isStart: 실제 시작일 → 왼쪽 둥근 캡
 * - isEnd: 실제 마감일 → 오른쪽 둥근 캡
 * - 주 경계(column=0/6)에서는 캡 없이 연결되는 것처럼 보임
 */
function getSpanTasksForCell(
  tasks: Task[],
  date: string,
  column: number
): SpanTask[] {
  if (!date) return [];
  return tasks
    .filter(
      (t) =>
        t.dueDate &&
        t.createdAt.slice(0, 10) <= date &&
        date <= t.dueDate
    )
    .map((t) => ({
      task: t,
      isStart: date === t.createdAt.slice(0, 10),
      isEnd: date === t.dueDate,
    }));
}

function getEventsForDate(events: ScheduleEvent[], date: string): ScheduleEvent[] {
  return events.filter((e) => e.date === date);
}

export default function CalendarGrid({
  tasks,
  events,
  today,
  selectedDate,
  onDateClick,
}: CalendarGridProps) {
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(today.slice(5, 7)) - 1);
  const [modalDate, setModalDate] = useState<string | null>(null);

  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  // 모달용 데이터: 바 표시 기준과 동일하게 span 로직 사용
  // (getTasksForDate는 과거 날짜를 제외하므로 달력 바와 불일치 발생)
  const modalTasks = useMemo(() => {
    if (!modalDate) return [];
    return tasks.filter((t) =>
      t.dueDate
        ? t.createdAt.slice(0, 10) <= modalDate && modalDate <= t.dueDate
        : t.createdAt.slice(0, 10) === modalDate
    );
  }, [tasks, modalDate]);
  const modalEvents = useMemo(
    () => (modalDate ? getEventsForDate(events, modalDate) : []),
    [events, modalDate]
  );

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  return (
    <div className="bg-white rounded-[18px] p-4">
      {/* 월 네비게이터 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          aria-label="이전 달"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73]"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-[#1d1d1f]">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={nextMonth}
          aria-label="다음 달"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] text-[#6e6e73]"
        >
          →
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[11px] text-center text-[#6e6e73] font-medium py-1">
            {d}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => (
          <CalendarDayCell
            key={date || `empty-${i}`}
            date={date}
            today={today}
            selectedDate={selectedDate}
            spanTasks={date ? getSpanTasksForCell(tasks, date, i % 7) : []}
            dayEvents={date ? getEventsForDate(events, date) : []}
            onClick={setModalDate}
          />
        ))}
      </div>

      {/* 날짜 상세 모달 */}
      {modalDate && (
        <CalendarDayModal
          date={modalDate}
          tasks={modalTasks}
          events={modalEvents}
          onClose={() => setModalDate(null)}
          onGoToDay={() => {
            onDateClick(modalDate);
            setModalDate(null);
          }}
        />
      )}
    </div>
  );
}
