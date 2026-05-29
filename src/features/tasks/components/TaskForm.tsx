"use client";

import { useState } from "react";
import { Task, TaskStatus } from "../types";

type FormMode = "create" | "edit" | "detail";

type TaskFormProps = {
  mode: FormMode;
  task?: Task;
  onSubmit?: (input: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: (id: string) => void;
  onEditMode?: () => void;
  onClose: () => void;
};

export default function TaskForm({
  mode,
  task,
  onSubmit,
  onDelete,
  onEditMode,
  onClose,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [subject, setSubject] = useState(task?.subject ?? "");
  const [detail, setDetail] = useState(task?.detail ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [titleError, setTitleError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isReadOnly = mode === "detail";

  function handleSubmit() {
    if (!title.trim()) {
      setTitleError("제목을 입력해 주세요.");
      return;
    }
    onSubmit?.({
      title: title.trim(),
      subject: subject.trim() || undefined,
      detail: detail.trim() || undefined,
      dueDate: dueDate || undefined,
      status: (task?.status ?? "todo") as TaskStatus,
    });
  }

  function handleDelete() {
    if (task) {
      onDelete?.(task.id);
      onClose();
    }
  }

  // 읽기전용 공통 className
  const roField = "bg-[#f5f5f7] border-transparent text-[#6e6e73] cursor-default select-none";
  const editField = "border-[#d1d1d6] text-[#1d1d1f] focus:border-[#0066cc]";

  const heading =
    mode === "create" ? "할 일 추가" : mode === "edit" ? "할 일 수정" : "상세 보기";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[18px] p-6 w-full max-w-md flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1d1d1f]">{heading}</h2>
          {isReadOnly && (
            <span className="text-xs text-[#aeaeb2] flex items-center gap-1">🔒 읽기 전용</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#6e6e73]" htmlFor="task-title">
            제목 {!isReadOnly && <span className="text-red-500">*</span>}
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError("");
            }}
            readOnly={isReadOnly}
            placeholder="할 일 제목"
            maxLength={100}
            className={`border rounded-xl px-3 py-2 text-sm outline-none
              ${isReadOnly ? roField : editField}`}
          />
          {titleError && <p className="text-xs text-red-500">{titleError}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#6e6e73]" htmlFor="task-subject">
            과목명
          </label>
          <input
            id="task-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            readOnly={isReadOnly}
            placeholder={isReadOnly ? "—" : "예: 선형대수학"}
            className={`border rounded-xl px-3 py-2 text-sm outline-none
              ${isReadOnly ? roField : editField}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#6e6e73]" htmlFor="task-detail">
            상세 내용
          </label>
          <textarea
            id="task-detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            readOnly={isReadOnly}
            placeholder={isReadOnly ? "—" : "추가 설명 (선택)"}
            rows={3}
            className={`border rounded-xl px-3 py-2 text-sm outline-none resize-none
              ${isReadOnly ? roField : editField}`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#6e6e73]" htmlFor="task-due">
            마감일
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            readOnly={isReadOnly}
            className={`border rounded-xl px-3 py-2 text-sm outline-none
              ${isReadOnly ? roField : editField}`}
          />
        </div>

        {/* 삭제 확인 영역 */}
        {confirmDelete ? (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex flex-col gap-3">
            <p className="text-sm text-red-600 font-medium">정말 삭제하시겠어요?</p>
            <p className="text-xs text-red-400">삭제하면 되돌릴 수 없습니다.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-sm text-[#6e6e73] px-4 py-1.5 rounded-full border border-[#d1d1d6]
                           hover:bg-[#f5f5f7] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="text-sm text-white bg-red-500 px-4 py-1.5 rounded-full
                           hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 justify-end mt-2">
            {mode === "detail" && (
              <>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm text-red-500 px-4 py-2 rounded-full border border-red-200
                             hover:bg-red-50 transition-colors mr-auto"
                >
                  삭제
                </button>
                <button
                  onClick={onEditMode}
                  className="text-sm text-[#0066cc] px-4 py-2 rounded-full border border-[#0066cc]
                             hover:bg-blue-50 transition-transform active:scale-95"
                >
                  수정
                </button>
              </>
            )}
            {(mode === "create" || mode === "edit") && (
              <>
                <button
                  onClick={onClose}
                  className="text-sm text-[#6e6e73] px-4 py-2 rounded-full border border-[#d1d1d6]
                             hover:bg-[#f5f5f7] transition-transform active:scale-95"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="text-sm text-white bg-[#0066cc] px-4 py-2 rounded-full
                             hover:bg-[#0055b3] transition-transform active:scale-95"
                >
                  {mode === "create" ? "추가" : "저장"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
