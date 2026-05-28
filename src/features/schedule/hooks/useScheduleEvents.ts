"use client";

import { useState, useEffect, useMemo } from "react";
import { ScheduleEvent } from "../types";
import { getEvents, saveEvents } from "../storage";

export function useScheduleEvents(selectedDate: string) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 클라이언트 마운트 후 localStorage 로드 (SSR hydration mismatch 방지)
  useEffect(() => {
    setEvents(getEvents());
    setHydrated(true);
  }, []);

  // hydrate 완료 후에만 저장
  useEffect(() => {
    if (!hydrated) return;
    saveEvents(events);
  }, [events, hydrated]);

  const dailyEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [events, selectedDate]
  );

  function add(input: Omit<ScheduleEvent, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    setEvents((prev) => [
      ...prev,
      { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now },
    ]);
  }

  function update(updated: ScheduleEvent) {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  }

  function remove(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return { events, dailyEvents, add, update, remove };
}
