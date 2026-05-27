type DayNavigatorProps = {
  selectedDate: string;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
};

export default function DayNavigator({
  selectedDate,
  onPrev,
  onToday,
  onNext,
}: DayNavigatorProps) {
  const date = new Date(selectedDate);
  const label = date.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const isToday =
    selectedDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e0e0e0]">
      <button
        onClick={onPrev}
        className="text-[#6e6e73] hover:text-[#1d1d1f] text-sm px-3 py-1"
        aria-label="이전 날"
      >
        ←
      </button>
      <div className="flex items-center gap-2">
        <span className="text-[17px] font-semibold text-[#1d1d1f]">{label}</span>
        {!isToday && (
          <button
            onClick={onToday}
            className="text-xs text-[#0066cc] hover:underline"
          >
            오늘
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        className="text-[#6e6e73] hover:text-[#1d1d1f] text-sm px-3 py-1"
        aria-label="다음 날"
      >
        →
      </button>
    </div>
  );
}
