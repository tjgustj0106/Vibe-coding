"use client";

import { useEffect, useState } from "react";
import { CoachProfile, CoachSituation } from "../types";
import { Task } from "@/features/tasks/types";

type Props = {
  profile: CoachProfile;
  tasks: Task[];
  fetchDialogue: (situation: CoachSituation, taskTitle?: string) => Promise<string>;
};

/** 이번 주 월~일 날짜 범위 반환 (YYYY-MM-DD 문자열) */
function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay(); // 0=일, 1=월, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  return { start: fmt(monday), end: fmt(sunday) };
}

/** 이번 주 완료율 계산 (0~1) */
function calcWeeklyRate(tasks: Task[]): number | null {
  const { start, end } = getWeekRange();
  const weekTasks = tasks.filter((t) => {
    const date = t.createdAt.slice(0, 10);
    return date >= start && date <= end;
  });
  if (!weekTasks.length) return null;
  const done = weekTasks.filter((t) => t.status === "done").length;
  return done / weekTasks.length;
}

export default function CoachWeeklySummary({ profile, tasks, fetchDialogue }: Props) {
  const [text, setText] = useState<string | null>(null);

  const rate = calcWeeklyRate(tasks);
  const situation: CoachSituation | null =
    rate === null ? null : rate >= 0.8 ? "weekly-high" : rate <= 0.3 ? "weekly-low" : null;

  useEffect(() => {
    if (!situation) {
      setText(null);
      return;
    }
    let cancelled = false;
    fetchDialogue(situation).then((result) => {
      if (!cancelled) setText(result);
    });
    return () => { cancelled = true; };
  }, [situation]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!situation || !text) return null;

  return (
    <div className="flex items-end gap-3 mt-4">
      {/* 아바타 */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#e5e5ea] border border-[#d1d1d6] flex items-center justify-center">
        {profile.photo ? (
          <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🙂</span>
        )}
      </div>
      {/* 말풍선 */}
      <div className="relative bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-[#e5e5ea] max-w-[calc(100%-4rem)]">
        <span className="absolute -left-2 bottom-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-0" />
        <p className="text-[13px] text-[#6e6e73] mb-0.5">이번 주 완료율 {Math.round((rate ?? 0) * 100)}%</p>
        <p className="text-[14px] text-[#1d1d1f] leading-snug">{text}</p>
        <p className="text-[11px] text-[#6e6e73] mt-1">{profile.name}</p>
      </div>
    </div>
  );
}
