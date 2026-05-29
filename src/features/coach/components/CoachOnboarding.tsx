"use client";

import { useState } from "react";
import { CoachProfile } from "../types";

type Props = {
  initialProfile?: CoachProfile; // 수정 모드일 때 기존 프로필
  onComplete: (profile: CoachProfile) => void;
  onSkip: () => void;
};

const PHOTO_SIZE_LIMIT = 500 * 1024; // 500 KB

export default function CoachOnboarding({ initialProfile, onComplete, onSkip }: Props) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialProfile?.name ?? "");
  const [photo, setPhoto] = useState<string | null>(initialProfile?.photo ?? null);
  const [nickname, setNickname] = useState(initialProfile?.nickname ?? "");
  const [personality, setPersonality] = useState(initialProfile?.personality ?? "");
  const [photoError, setPhotoError] = useState("");

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    if (file.size > PHOTO_SIZE_LIMIT) {
      setPhotoError("사진이 너무 커요! 500KB 이하로 올려주세요.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleComplete() {
    const profile: CoachProfile = {
      name: name.trim() || "친구",
      photo,
      nickname: nickname.trim() || "너",
      personality: personality.trim() || "친근한 친구",
    };
    onComplete(profile);
  }

  const totalSteps = 4;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6 z-50">
      {/* 진행 도트 */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i + 1 === step ? "bg-[#0066cc]" : "bg-[#d1d1d6]"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-sm">
        {/* Step 1: 이름 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] text-center">
              누가 응원해줬으면 하나요?
            </h2>
            <p className="text-[#6e6e73] text-center text-sm">
              예: 엄마, 친구 이름, 멘토 이름
            </p>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-[#d1d1d6] rounded-xl px-4 py-3 text-[17px] text-[#1d1d1f] placeholder:text-[#aeaeb2] focus:outline-none focus:border-[#0066cc]"
              autoFocus
            />
            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="bg-[#0066cc] text-white py-3 rounded-xl font-medium disabled:opacity-40 transition-opacity"
            >
              다음
            </button>
            <button onClick={onSkip} className="text-[#6e6e73] text-sm text-center py-1">
              건너뛰기
            </button>
          </div>
        )}

        {/* Step 2: 사진 업로드 */}
        {step === 2 && (
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] text-center">
              {name}의 사진을 올려주세요
            </h2>
            <p className="text-[#6e6e73] text-sm text-center">선택 사항이에요</p>

            {/* 아바타 미리보기 */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#f5f5f7] border border-[#d1d1d6] flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🙂</span>
              )}
            </div>

            <label className="cursor-pointer bg-[#f5f5f7] border border-[#d1d1d6] rounded-xl px-6 py-3 text-sm text-[#1d1d1f] hover:bg-[#e5e5ea] transition-colors">
              사진 선택
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            {photoError && <p className="text-red-500 text-sm text-center">{photoError}</p>}

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-[#d1d1d6] py-3 rounded-xl text-[#6e6e73] font-medium"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-[#0066cc] text-white py-3 rounded-xl font-medium"
              >
                {photo ? "다음" : "건너뛰기"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 호칭 입력 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] text-center">
              {name}이/가 나를 뭐라고 불러줬으면 좋겠어요?
            </h2>
            <p className="text-[#6e6e73] text-center text-sm">예: 자기야, 민준아, 너</p>
            <input
              type="text"
              placeholder="호칭 입력 (예: 자기야)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border border-[#d1d1d6] rounded-xl px-4 py-3 text-[17px] text-[#1d1d1f] placeholder:text-[#aeaeb2] focus:outline-none focus:border-[#0066cc]"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-[#d1d1d6] py-3 rounded-xl text-[#6e6e73] font-medium"
              >
                이전
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-[#0066cc] text-white py-3 rounded-xl font-medium"
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 성격 입력 */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-[#1d1d1f] text-center">
              {name}의 성격을 설명해주세요
            </h2>
            <p className="text-[#6e6e73] text-center text-sm">
              예: 다정하고 따뜻한 성격, 엄하고 직설적인 편, 친한 친구처럼 편한 말투
            </p>
            <textarea
              rows={3}
              placeholder="성격 설명 입력"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="border border-[#d1d1d6] rounded-xl px-4 py-3 text-[17px] text-[#1d1d1f] placeholder:text-[#aeaeb2] focus:outline-none focus:border-[#0066cc] resize-none"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 border border-[#d1d1d6] py-3 rounded-xl text-[#6e6e73] font-medium"
              >
                이전
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 bg-[#0066cc] text-white py-3 rounded-xl font-medium"
              >
                완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
