type EmptyStateProps = {
  onAdd: () => void;
  selectedDate: string;
};

export default function EmptyState({ onAdd, selectedDate }: EmptyStateProps) {
  const today = new Date().toISOString().slice(0, 10);
  const isToday = selectedDate === today;
  const dateLabel = isToday
    ? "오늘"
    : new Date(selectedDate + "T00:00:00").toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      });

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <p className="text-4xl">📋</p>
      <p className="text-[17px] font-semibold text-[#1d1d1f]">
        {dateLabel}에 할 일이 없습니다
      </p>
      <p className="text-sm text-[#6e6e73]">할 일이나 과제를 추가해보세요</p>
      <button
        onClick={onAdd}
        className="mt-2 bg-[#0066cc] text-white px-6 py-2.5 rounded-full text-sm
                   font-medium transition-transform active:scale-95 hover:bg-[#0055b3]"
      >
        + 할 일 추가
      </button>
    </div>
  );
}
