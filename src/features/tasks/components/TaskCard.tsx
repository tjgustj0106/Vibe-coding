import { Task } from "../types";
import SubjectBadge from "./SubjectBadge";
import DeadlineChip from "./DeadlineChip";

type TaskCardProps = {
  task: Task;
  onToggle: (id: string) => void;
  onClickDetail: (task: Task) => void;
};

export default function TaskCard({ task, onToggle, onClickDetail }: TaskCardProps) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-[18px] px-5 py-4">
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.status === "done" ? "미완료로 변경" : "완료로 변경"}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#0066cc]
                   flex items-center justify-center transition-colors
                   hover:bg-[#0066cc]/10"
      >
        {task.status === "done" && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#0066cc]" />
        )}
      </button>

      <button
        onClick={() => onClickDetail(task)}
        className="flex-1 text-left"
        aria-label={`${task.title} 상세 보기`}
      >
        <p className={`text-[17px] text-[#1d1d1f] leading-snug ${task.status === "done" ? "line-through text-[#6e6e73]" : ""}`}>
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {task.subject && <SubjectBadge subject={task.subject} />}
          {task.dueDate && task.status !== "done" && <DeadlineChip dueDate={task.dueDate} />}
        </div>
      </button>
    </div>
  );
}
