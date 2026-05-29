import { CoachSituation } from "./types";

// 각 상황별 프리셋 대사 (랜덤 출력을 위해 배열로 관리)
const PRESET_DIALOGUES: Record<CoachSituation, string[]> = {
  d3: [
    "{task} 마감 3일 남았어. 지금 조금씩 해두면 나중에 편할 거야 💪",
    "{nickname}, {task} 슬슬 시작해봐야 하지 않을까? 3일 남았어.",
    "{task} 3일 남았다! 미리 해두는 사람이 승리자야 😊",
  ],
  d2: [
    "이틀밖에 안 남았어! {task} 지금 당장 시작해봐.",
    "{nickname}, {task} 마감이 이틀 남았어. 지금 해야 할 것 같은데?",
    "{task} D-2야. 조금만 하면 다 끝낼 수 있어, 파이팅!",
  ],
  d1: [
    "내일 마감이야!! {task} 오늘 꼭 끝내야 해!",
    "{nickname}! {task} 마감 하루 남았어. 지금 당장 시작하자!",
    "{task} 내일까지야. 오늘 안에 끝내면 정말 잘하는 거야!",
  ],
  dday: [
    "오늘이 {task} 마감이야!! 지금 당장 해!! 🔥",
    "{nickname}, 오늘 {task} 마감이잖아!! 빨리빨리!!",
    "{task} 오늘 마감이야. 할 수 있어, 지금 집중하자!",
  ],
  overdue: [
    "{task} 마감이 지났어… 그래도 지금이라도 하자!",
    "{nickname}, {task} 마감이 지났지만 포기하지 마. 지금이라도 해봐.",
    "마감은 지났지만 늦었다고 포기하면 안 돼. 얼른 {task} 하자!",
  ],
  complete: [
    "오! {task} 다 했어?? 고생했어 진짜! ☺️",
    "와, {nickname}! {task} 완료했구나. 대단해! 🎉",
    "{task} 끝냈어?! 역시 믿었다고~ 잘했어! ✨",
  ],
  "weekly-high": [
    "이번 주 진짜 열심히 했다, {nickname}! 나 감동받았어 🥹",
    "이번 주 완료율 대박이야! 이 기세로 다음 주도 달려보자! 💪",
    "이번 주 정말 잘했어. 뿌듯하다! 🌟",
  ],
  "weekly-low": [
    "이번 주 좀 힘들었나봐, {nickname}… 다음 주엔 같이 해봐요 💛",
    "이번 주는 쉬어간 거야. 다음 주엔 조금만 더 해보자!",
    "누구나 힘든 주가 있어. 다음 주는 더 잘할 수 있을 거야 😊",
  ],
};

/**
 * 프리셋 대사 반환 (상황·과제명·호칭 치환)
 */
export function getPresetDialogue(
  situation: CoachSituation,
  taskTitle?: string,
  nickname?: string
): string {
  const lines = PRESET_DIALOGUES[situation];
  const line = lines[Math.floor(Math.random() * lines.length)];
  return line
    .replace(/{task}/g, taskTitle ?? "과제")
    .replace(/{nickname}/g, nickname ?? "너");
}
