import { Task } from "../types";
import { ScheduleEvent } from "../../schedule/types";

type CalendarDayModalProps = {
  date: string;
  tasks: Task[];
  events: ScheduleEvent[];
  onClose: () => void;
  onGoToDay: () => void;
};

export default function CalendarDayModal({
  date,
  tasks,
  events,
  onClose,
  onGoToDay,
}: CalendarDayModalProps) {
  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const isEmpty = tasks.length === 0 && events.length === 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[18px] p-5 w-full max-w-sm flex flex-col gap-4
                   max-h-[70vh] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">{dateLabel}</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-7 h-7 flex items-center justify-center rounded-full
                       hover:bg-[#f5f5f7] text-[#6e6e73] text-sm"
          >
            ✕
          </button>
        </div>

        {/* 내용 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 min-h-0">

          {/* 할 일 섹션 */}
          <section>
            <h3 className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2">
              할 일{tasks.length > 0 ? ` · 미완료 ${todoCount}개` : ""}
            </h3>
            {tasks.length === 0 ? (
              <p className="text-sm text-[#aeaeb2]">할 일이 없습니다</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-2.5">
                    {/* 완료 상태 아이콘 */}
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 border-[#0066cc] flex-shrink-0
                                  flex items-center justify-center
                                  ${t.status === "done" ? "bg-[#0066cc]" : "bg-white"}`}
                    >
                      {t.status === "done" && (
                        <span className="text-white text-[8px] font-bold leading-none">✓</span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          t.status === "done"
                            ? "line-through text-[#aeaeb2]"
                            : "text-[#1d1d1f]"
                        }`}
                      >
                        {t.title}
                      </p>
                      {t.subject && (
                        <p className="text-xs text-[#6e6e73] mt-0.5">{t.subject}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 시간 일정 섹션 */}
          <section>
            <h3 className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wide mb-2">
              시간 일정
            </h3>
            {events.length === 0 ? (
              <p className="text-sm text-[#aeaeb2]">등록된 일정이 없습니다</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {events
                  .slice()
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((e) => (
                    <li key={e.id} className="flex items-start gap-2.5">
                      <span className="mt-1 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-[#1d1d1f] leading-snug">{e.title}</p>
                        <p className="text-xs text-[#6e6e73] mt-0.5">
                          {e.startTime} ~ {e.endTime}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>

        {/* 하루 뷰 이동 버튼 */}
        <button
          onClick={onGoToDay}
          className="w-full bg-[#0066cc] text-white text-sm py-2.5 rounded-full font-medium
                     hover:bg-[#0055b3] transition-transform active:scale-95"
        >
          하루 뷰로 이동
        </button>
      </div>
    </div>
  );
}
