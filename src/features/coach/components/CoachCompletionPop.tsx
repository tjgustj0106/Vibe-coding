"use client";

import { useEffect } from "react";
import { CoachProfile } from "../types";

type Props = {
  profile: CoachProfile;
  text: string;
  onDone: () => void;
};

export default function CoachCompletionPop({ profile, text, onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-end justify-center pb-24 z-50 px-6">
      <div className="flex items-end gap-3 animate-bounce-in">
        {/* 아바타 */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#e5e5ea] border border-[#d1d1d6] flex items-center justify-center">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">🙂</span>
          )}
        </div>
        {/* 말풍선 */}
        <div className="relative bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg border border-[#e5e5ea] max-w-xs">
          <span className="absolute -left-2 bottom-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-white border-b-0" />
          <p className="text-[14px] text-[#1d1d1f] leading-snug">{text}</p>
          <p className="text-[11px] text-[#6e6e73] mt-1">{profile.name}</p>
        </div>
      </div>
    </div>
  );
}
