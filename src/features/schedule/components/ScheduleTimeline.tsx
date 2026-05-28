"use client";

import { useState } from "react";
import { ScheduleEvent } from "../types";
import ScheduleEventForm from "./ScheduleEventForm";

type ScheduleTimelineProps = {
  date: string;
  events: ScheduleEvent[];
  onAdd: (input: Omit<ScheduleEvent, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const TOTAL_MINUTES = 24 * 60;
const HOUR_HEIGHT = 60; // px per hour
const TIMELINE_HEIGHT = HOUR_HEIGHT * 24; // 1440px

export default function ScheduleTimeline({
  date,
  events,
  onAdd,
  onUpdate,
  onDelete,
}: ScheduleTimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function handleAdd(input: Omit<ScheduleEvent, "id" | "createdAt" | "updatedAt">) {
    onAdd(input);
    setShowAddForm(false);
  }

  function handleUpdate(input: Omit<ScheduleEvent, "id" | "createdAt" | "updatedAt">) {
    if (!editingEvent) return;
    onUpdate({
      ...input,
      id: editingEvent.id,
      createdAt: editingEvent.createdAt,
      updatedAt: new Date().toISOString(),
    });
    setEditingEvent(null);
  }

  return (
    <div className="bg-white rounded-[18px] p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1d1d1f]">📅 오늘 일정</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-xs text-[#0066cc] px-3 py-1 rounded-full border border-[#0066cc]
                     hover:bg-blue-50 transition-transform active:scale-95"
        >
          + 일정 추가
        </button>
      </div>

      <div className="overflow-y-auto" style={{ height: "300px" }}>
        <div className="relative" style={{ height: `${TIMELINE_HEIGHT}px` }}>
          {/* 시간 눈금 */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 flex items-start"
              style={{ top: `${hour * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
            >
              <span className="text-[10px] text-[#6e6e73] w-10 shrink-0 leading-none pt-0.5">
                {String(hour).padStart(2, "0")}:00
              </span>
              <div className="flex-1 border-t border-[#f0f0f5] mt-0.5" />
            </div>
          ))}

          {/* 이벤트 블록 */}
          {events.map((event) => {
            const startMin = timeToMinutes(event.startTime);
            const endMin = timeToMinutes(event.endTime);
            const top = (startMin / TOTAL_MINUTES) * TIMELINE_HEIGHT;
            const height = Math.max(((endMin - startMin) / TOTAL_MINUTES) * TIMELINE_HEIGHT, 28);

            return (
              <button
                key={event.id}
                onClick={() => setEditingEvent(event)}
                className="absolute left-10 right-1 bg-[#0066cc] text-white rounded-lg px-2 py-1
                           text-left hover:bg-[#0055b3] transition-colors overflow-hidden"
                style={{ top: `${top}px`, height: `${height}px` }}
                aria-label={`${event.title} ${event.startTime}~${event.endTime}`}
              >
                <p className="text-[11px] font-medium leading-tight truncate">{event.title}</p>
                <p className="text-[10px] opacity-80 leading-tight">
                  {event.startTime}~{event.endTime}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {events.length === 0 && (
        <p className="text-xs text-[#6e6e73] text-center mt-2">
          등록된 일정이 없습니다
        </p>
      )}

      {showAddForm && (
        <ScheduleEventForm
          mode="create"
          date={date}
          onSubmit={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editingEvent && (
        <ScheduleEventForm
          mode="edit"
          date={date}
          event={editingEvent}
          onSubmit={handleUpdate}
          onDelete={onDelete}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
