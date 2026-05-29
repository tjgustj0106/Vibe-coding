export type CoachSituation =
  | "d3"        // 마감 D-3
  | "d2"        // 마감 D-2
  | "d1"        // 마감 D-1
  | "dday"      // 마감 D-day
  | "overdue"   // 기한 초과
  | "complete"  // 할 일 완료 칭찬
  | "weekly-high" // 주간 완료율 80%↑
  | "weekly-low"; // 주간 완료율 30%↓

export type CoachProfile = {
  name: string;        // 캐릭터 표시 이름 (예: "엄마", "지수")
  photo: string | null; // base64 이미지 or null (기본 플레이스홀더 사용)
  nickname: string;    // 캐릭터가 사용자를 부르는 호칭 (예: "자기야", "너", "민준아")
  personality: string; // 자유 텍스트 성격 설명 (OpenRouter 프롬프트에 활용)
};
