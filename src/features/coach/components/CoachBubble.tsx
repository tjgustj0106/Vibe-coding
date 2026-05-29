"use client";

import { useEffect, useState } from "react";
import { CoachProfile, CoachSituation } from "../types";

type Props = {
  profile: CoachProfile;
  situation: CoachSituation;
  taskTitle?: string;
  fetchDialogue: (situation: CoachSituation, taskTitle?: string) => Promise<string>;
};

export default function CoachBubble({ profile, situation, taskTitle, fetchDialogue }: Props) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setText(null);
    fetchDialogue(situation, taskTitle).then((result) => {
      if (!cancelled) {
        setText(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [situation, taskTitle]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-end gap-3 mb-4">
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
        {/* 말풍선 꼬리 */}
        <span className="absolute -left-2 bottom-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-[0px]" />
        <p className="text-[14px] text-[#1d1d1f] leading-snug">
          {loading ? (
            <span className="text-[#6e6e73] animate-pulse">잠깐만...</span>
          ) : (
            text
          )}
        </p>
        <p className="text-[11px] text-[#6e6e73] mt-1">{profile.name}</p>
      </div>
    </div>
  );
}
