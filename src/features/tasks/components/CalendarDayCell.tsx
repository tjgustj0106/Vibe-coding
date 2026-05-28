import { Task } from "../types";

type CalendarDayCellProps = {
  date: string;        // YYYY-MM-DD, empty string = 빈 칸
  today: string;
  selectedDate: string;
  tasks: Task[];       // 이 날짜에 표시할 task (dueDate 기준)
  onClick: (date: string) => void;
};

export default function CalendarDayCell({
  date,
  today,
  selectedDate,
  tasks,
  onClick,
}: CalendarDayCellProps) {
  if (!date) {
    return <div className="aspect-square" />;
  }

  const day = Number(date.slice(8));
  const isToday = date === today;
  const isSelected = date === selectedDate;
  const visible = tasks.slice(0, 2);
  const overflow = tasks.length - 2;

  return (
    <button
      onClick={() => onClick(date)}
      aria-label={`${date}, 할 일 ${tasks.length}개`}
      className={`aspect-square flex flex-col items-start p-1 rounded-xl text-left transition-colors
        ${isSelected ? "bg-[#0066cc]/10 ring-1 ring-[#0066cc]" : "hover:bg-[#f5f5f7]"}`}
    >
      <span
        className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-0.5
          ${isToday ? "bg-[#0066cc] text-white" : "text-[#1d1d1f]"}`}
      >
        {day}
      </span>
      <div className="w-full flex flex-col gap-0.5 overflow-hidden">
        {visible.map((t) => (
          <span
            key={t.id}
            className="text-[9px] leading-tight bg-[#0066cc]/10 text-[#0066cc] rounded px-1 truncate w-full"
          >
            {t.title}
          </span>
        ))}
        {overflow > 0 && (
          <span className="text-[9px] text-[#6e6e73] px-1">+{overflow}</span>
        )}
      </div>
    </button>
  );
}
