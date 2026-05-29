"use client";

import { useState, useEffect } from "react";
import { CoachProfile, CoachSituation } from "../types";
import { getCoach, saveCoach } from "../storage";
import { getPresetDialogue } from "../dialogue";

export function useCoach() {
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // SSR hydration 패턴: useEffect에서만 localStorage 읽기
  useEffect(() => {
    setProfile(getCoach());
    setHydrated(true);
  }, []);

  function saveProfile(p: CoachProfile) {
    saveCoach(p);
    setProfile(p);
  }

  function clearProfile() {
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("studylog_coach");
    }
  }

  /**
   * OpenRouter API를 통해 대사 생성. API key 없거나 실패 시 프리셋 반환.
   */
  async function fetchDialogue(
    situation: CoachSituation,
    taskTitle?: string
  ): Promise<string> {
    if (!profile) return "";
    try {
      const res = await fetch("/api/coach-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          taskTitle,
          nickname: profile.nickname,
          personality: profile.personality,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return (data.text as string) ?? getPresetDialogue(situation, taskTitle, profile.nickname);
    } catch {
      return getPresetDialogue(situation, taskTitle, profile.nickname);
    }
  }

  return { profile, hydrated, saveProfile, clearProfile, fetchDialogue };
}
