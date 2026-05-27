type TaskFormProps = {
  onClose: () => void;
};

export default function TaskForm({ onClose }: TaskFormProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[18px] p-6 w-full max-w-md flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#1d1d1f]">할 일 추가</h2>
        <p className="text-sm text-[#6e6e73]">Task 3회차에서 실제 기능을 구현합니다</p>
        <button
          onClick={onClose}
          className="self-end text-sm text-[#0066cc] hover:underline"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
