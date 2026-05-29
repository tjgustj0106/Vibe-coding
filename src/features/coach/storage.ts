import { CoachProfile } from "./types";

const COACH_KEY = "studylog_coach";

export function getCoach(): CoachProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COACH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CoachProfile;
  } catch {
    return null;
  }
}

export function saveCoach(profile: CoachProfile): void {
  localStorage.setItem(COACH_KEY, JSON.stringify(profile));
}

export function clearCoach(): void {
  localStorage.removeItem(COACH_KEY);
}
