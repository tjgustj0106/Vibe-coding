import { NextRequest, NextResponse } from "next/server";
import { getPresetDialogue } from "@/features/coach/dialogue";
import { CoachSituation } from "@/features/coach/types";

type RequestBody = {
  situation: CoachSituation;
  taskTitle?: string;
  nickname?: string;
  personality?: string;
};

const VALID_SITUATIONS: CoachSituation[] = [
  "d3", "d2", "d1", "dday", "overdue", "complete", "weekly-high", "weekly-low",
];

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody;
  const { situation, taskTitle, nickname, personality } = body;

  // 입력 검증
  if (!VALID_SITUATIONS.includes(situation)) {
    return NextResponse.json({ error: "Invalid situation" }, { status: 400 });
  }
  const safeTitle = (taskTitle ?? "").slice(0, 50);
  const safeNickname = (nickname ?? "").slice(0, 20);
  const safePersonality = (personality ?? "").slice(0, 100);

  const apiKey = process.env.OPENROUTER_API_KEY;

  // API key가 없으면 즉시 프리셋 반환
  if (!apiKey) {
    const text = getPresetDialogue(situation, safeTitle, safeNickname);
    return NextResponse.json({ text, source: "preset" });
  }

  try {
    const situationLabel: Record<CoachSituation, string> = {
      d3: "마감 3일 전",
      d2: "마감 2일 전",
      d1: "마감 1일 전",
      dday: "오늘 마감",
      overdue: "마감 초과",
      complete: "할 일 완료",
      "weekly-high": "이번 주 완료율 80% 이상",
      "weekly-low": "이번 주 완료율 30% 이하",
    };

    const taskContext = safeTitle ? `과제명: "${safeTitle}"` : "";
    const nicknameContext = safeNickname ? `사용자 호칭: "${safeNickname}"` : "호칭: 없음";
    const situationContext = `상황: ${situationLabel[situation]}`;

    const prompt = `너는 다음 성격과 말투를 가진 코치 캐릭터야: "${safePersonality || "친근한 친구"}"

⚠️ 핵심 규칙: 성격은 어떤 상황에서도 절대 바뀌지 않아. 칭찬 상황이라도 성격이 무서우면 무섭게, 냉정하면 냉정하게 말해야 해.

${situationContext}
${taskContext}
${nicknameContext}

위 상황에 맞는 짧은 한 문장 대사를 써줘.

[말투 규칙 — 반드시 지킬 것]
- 성격이 모든 것보다 우선이야. 성격 설명의 말투·어조를 강하게 반영해.
  예) 무섭거나 엄격한 성격 → 칭찬도 냉담하게 ("겨우 했냐", "당연한 거 한 거야", "다음엔 더 일찍 해")
  예) 할아버지 말투 → "~하거라", "~했구나", "~해야지" 같은 노인체
  예) 다정한 성격 → 따뜻하고 부드럽게
  예) 냉정한 성격 → 감정 없이 짧고 단호하게
- 성격에 맞는 문체(반말/높임/할아버지체/냉소체 등) 유지
- 무섭거나 냉정한 성격은 이모지 없이, 밝은 성격만 이모지 사용
- 50자 이내
- 대사 텍스트만 반환 (따옴표 없이)`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://studylog.vercel.app",
        "X-Title": "StudyLog Coach",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.8,
      }),
      signal: AbortSignal.timeout(8000), // 8초 타임아웃
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const text = (data.choices?.[0]?.message?.content ?? "").trim();

    if (!text) throw new Error("Empty response");

    return NextResponse.json({ text, source: "openrouter" });
  } catch {
    // 실패 시 프리셋 fallback
    const text = getPresetDialogue(situation, safeTitle, safeNickname);
    return NextResponse.json({ text, source: "preset" });
  }
}
