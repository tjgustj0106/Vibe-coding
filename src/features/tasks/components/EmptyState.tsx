type EmptyStateProps = {
  onAdd: () => void;
};

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <p className="text-4xl">📋</p>
      <p className="text-[17px] font-semibold text-[#1d1d1f]">오늘 할 일이 없습니다</p>
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
