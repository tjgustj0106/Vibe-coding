"use client";

import { useState, useEffect, useMemo } from "react";
import { ScheduleEvent } from "../types";
import { getEvents, saveEvents } from "../storage";

export function useScheduleEvents(selectedDate: string) {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => getEvents());

  useEffect(() => {
    saveEvents(events);
  }, [events]);

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
