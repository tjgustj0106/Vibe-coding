"use client";

import { useState } from "react";
import { ScheduleEvent } from "../types";

type FormMode = "create" | "edit";

type ScheduleEventFormProps = {
  mode: FormMode;
  date: string;
  event?: ScheduleEvent;
  onSubmit: (input: Omit<ScheduleEvent, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
};

export default function ScheduleEventForm({
  mode,
  date,
  event,
  onSubmit,
  onDelete,
  onClose,
}: ScheduleEventFormProps) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [startTime, setStartTime] = useState(event?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(event?.endTime ?? "10:00");
  const [titleError, setTitleError] = useState("");
  const [timeError, setTimeError] = useState("");

  function handleSubmit() {
    if (!title.trim()) {
      setTitleError("제목을 입력해 주세요.");
      return;
    }
    if (startTime >= endTime) {
      setTimeError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    onSubmit({ title: title.trim(), date, startTime, endTime });
    onClose();
  }

  function handleDelete() {
    if (event) {
      onDelete?.(event.id);
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[18px] p-6 w-full max-w-md flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#1d1d1f]">
          {mode === "create" ? "일정 추가" : "일정 수정"}
        </h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[#6e6e73]" htmlFor="event-title">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setTitleError(""); }}
            placeholder="예: 선형대수 강의"
            className="border border-[#d1d1d6] rounded-xl px-3 py-2 text-sm text-[#1d1d1f] outline-none focus:border-[#0066cc]"
          />
          {titleError && <p className="text-xs text-red-500">{titleError}</p>}
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-[#6e6e73]" htmlFor="event-start">
              시작
            </label>
            <input
              id="event-start"
              type="time"
              value={startTime}
              onChange={(e) => { setStartTime(e.target.value); setTimeError(""); }}
              className="border border-[#d1d1d6] rounded-xl px-3 py-2 text-sm text-[#1d1d1f] outline-none focus:border-[#0066cc]"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-[#6e6e73]" htmlFor="event-end">
              종료
            </label>
            <input
              id="event-end"
              type="time"
              value={endTime}
              onChange={(e) => { setEndTime(e.target.value); setTimeError(""); }}
              className="border border-[#d1d1d6] rounded-xl px-3 py-2 text-sm text-[#1d1d1f] outline-none focus:border-[#0066cc]"
            />
          </div>
        </div>
        {timeError && <p className="text-xs text-red-500">{timeError}</p>}

        <div className="flex gap-2 justify-end mt-2">
          {mode === "edit" && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 px-4 py-2 rounded-full border border-red-200
                         hover:bg-red-50 transition-transform active:scale-95"
            >
              삭제
            </button>
          )}
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
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
