import { NextRequest, NextResponse } from "next/server";
import { getPresetDialogue } from "@/features/coach/dialogue";
import { CoachSituation } from "@/features/coach/types";

type RequestBody = {
  situation: CoachSituation;
  taskTitle?: string;
  nickname?: string;
  personality?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RequestBody;
  const { situation, taskTitle, nickname, personality } = body;

  const apiKey = process.env.OPENROUTER_API_KEY;

  // API key가 없으면 즉시 프리셋 반환
  if (!apiKey) {
    const text = getPresetDialogue(situation, taskTitle, nickname);
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

    const taskContext = taskTitle ? `과제명: "${taskTitle}"` : "";
    const nicknameContext = nickname ? `사용자 호칭: "${nickname}"` : "호칭: 없음";
    const situationContext = `상황: ${situationLabel[situation]}`;

    const prompt = `당신은 ${personality ?? "친근한 친구"} 성격의 캐릭터입니다.
${situationContext}
${taskContext}
${nicknameContext}

위 상황에 맞게 짧은 한 문장으로 동기부여 메시지를 작성해주세요.
- 이모지를 1개 이하로 사용하세요
- 반말 또는 설정된 말투를 유지하세요
- 50자 이내로 작성하세요
- 오직 대사 텍스트만 반환하세요 (따옴표 없이)`;

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
    const text = getPresetDialogue(situation, taskTitle, nickname);
    return NextResponse.json({ text, source: "preset" });
  }
}
