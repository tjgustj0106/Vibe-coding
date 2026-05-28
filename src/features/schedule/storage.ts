import { ScheduleEvent } from "./types";

const EVENTS_KEY = "studylog_events";

export function getEvents(): ScheduleEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? (JSON.parse(raw) as ScheduleEvent[]) : [];
  } catch {
    return [];
  }
}

export function saveEvents(events: ScheduleEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch {
    console.warn("localStorage 저장 실패");
  }
}

export function clearEvents(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(EVENTS_KEY);
}
