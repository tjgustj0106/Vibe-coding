import { useMemo, useState } from "react";
import { Task } from "../types";
import CalendarDayCell from "./CalendarDayCell";

type CalendarGridProps = {
  tasks: Task[];
  today: string;
  selectedDate: string;
  onDateClick: (date: string) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getMonthGrid(year: number, month: number): string[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: string[] = [];

  for (let i = 0; i < firstDay; i++) cells.push("");
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    cells.push(`${year}-${mm}-${dd}`);
  }
  // 마지막 줄 채우기
  while (cells.length % 7 !== 0) cells.push("");
  return cells;
}

function getTasksForCalendarDate(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => t.dueDate === date);
}

export default function CalendarGrid({
  tasks,
  today,
  selectedDate,
  onDateClick,
}: CalendarGridProps) {
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(today.slice(5, 7)) - 1);

  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

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
            tasks={date ? getTasksForCalendarDate(tasks, date) : []}
            onClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}
