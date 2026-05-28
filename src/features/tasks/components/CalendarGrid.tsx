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
 * 한 주(7칸) 안에서 과제마다 일관된 슬롯(행)을 배정한다.
 * - createdAt 오름차순 정렬 → 가장 오래된 과제가 슬롯 0
 * - 같은 과제는 주 전체에서 항상 같은 행에 표시됨
 * Returns: date → SpanTask[] (슬롯 정보 포함)
 */
function computeWeekSpanTasks(
  tasks: Task[],
  weekDates: string[]
): Map<string, SpanTask[]> {
  const validDates = weekDates.filter(Boolean);
  if (validDates.length === 0) return new Map();

  const weekStart = validDates[0];
  const weekEnd = validDates[validDates.length - 1];

  // 이 주에 걸쳐있는 과제 수집
  const spanning = tasks.filter(
    (t) =>
      t.dueDate &&
      t.createdAt.slice(0, 10) <= weekEnd &&
      weekStart <= t.dueDate
  );

  // createdAt 오름차순 정렬 → 슬롯 번호 일관성 보장
  const sorted = [...spanning].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );
  const slotMap = new Map(sorted.map((t, i) => [t.id, i]));

  // 날짜별 SpanTask 목록 생성
  const result = new Map<string, SpanTask[]>();
  for (const date of validDates) {
    const dayTasks: SpanTask[] = sorted
      .filter(
        (t) => t.createdAt.slice(0, 10) <= date && date <= t.dueDate!
      )
      .map((t) => ({
        task: t,
        isStart: date === t.createdAt.slice(0, 10),
        isEnd: date === t.dueDate,
        slot: slotMap.get(t.id) ?? 0,
      }));
    result.set(date, dayTasks);
  }
  return result;
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

  // 주(week) 단위 슬롯 계산
  const weekSpanTasksMap = useMemo(() => {
    const result = new Map<string, SpanTask[]>();
    const weekCount = Math.ceil(cells.length / 7);
    for (let w = 0; w < weekCount; w++) {
      const weekDates = cells.slice(w * 7, (w + 1) * 7);
      const weekMap = computeWeekSpanTasks(tasks, weekDates);
      weekMap.forEach((spanTasks, date) => result.set(date, spanTasks));
    }
    return result;
  }, [tasks, cells]);

  // 모달용 데이터: 달력 바와 동일한 span 로직 사용
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
            spanTasks={date ? (weekSpanTasksMap.get(date) ?? []) : []}
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
