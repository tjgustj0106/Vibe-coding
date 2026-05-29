# Security Review — StudyLog MVP

> 검토일: 2026-05-29  
> 검토 범위: `src/`, `next.config.ts`, `package.json`, `.gitignore`, `.env.local`, OpenSpec 스펙  
> 기준: 4회차 내 수정 가능 여부 포함

---

## 요약

| 항목 | 결과 |
|---|---|
| `dangerouslySetInnerHTML` 사용 | ✅ 없음 |
| XSS 위험 | ✅ React 텍스트 보간으로 안전 |
| API 키 커밋 여부 | ✅ `.gitignore`에 포함됨 |
| 외부 링크 보안 속성 | ✅ 외부 링크 없음 |
| `console.log` 민감 정보 노출 | ✅ 없음 |
| HTTP 보안 헤더 | ⚠️ 미설정 |
| API 입력 검증 | ⚠️ 미흡 |
| API Rate Limiting | ⚠️ 없음 |
| localStorage 저장 데이터 | ℹ️ 검토 사항 있음 |

---

## 1. 안전한 항목 (이미 잘 되어 있음)

### ✅ dangerouslySetInnerHTML 없음
전체 `src/` 에서 `dangerouslySetInnerHTML` 사용 없음. 모든 동적 텍스트(AI 대사, 할 일 제목, 사용자 입력)가 React 텍스트 노드로 렌더링되므로 XSS 위험 없음.

### ✅ API 키 미커밋
`.env.local`에 `OPENROUTER_API_KEY=` 플레이스홀더만 있고, `.gitignore`의 `.env*` 패턴으로 커밋 차단됨. `.claude/settings.local.json`도 gitignore에 별도 추가되어 있음.

### ✅ 외부 링크 없음
앱 내 모든 링크(`/app`, 내부 네비게이션)가 내부 라우팅 전용. `target="_blank"` 및 `rel="noopener noreferrer"` 이슈 없음.

### ✅ console 출력에 민감 정보 없음
`console.warn("localStorage 저장 실패")`만 존재하며 민감 데이터 미포함.

### ✅ 사진 용량 제한
`CoachOnboarding`에서 500KB 초과 사진 업로드 시 오류 메시지 표시 및 저장 차단 구현됨.

---

## 2. 수정 필요 항목

### ⚠️ [높음] HTTP 보안 헤더 미설정

**파일:** `next.config.ts`  
**현황:** 빈 config — `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` 등 미설정.  
**위험:** 클릭재킹, MIME 스니핑, XSS 공격에 무방비.  
**4회차 수정 가능:** ✅ 예

```ts
// next.config.ts 수정안
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

---

### ⚠️ [중간] API Route 입력 검증 없음

**파일:** `src/app/api/coach-dialogue/route.ts`  
**현황:** `situation`, `personality`, `taskTitle`, `nickname` 필드를 검증 없이 OpenRouter 프롬프트에 그대로 삽입.  
**위험:**
- `personality`에 `"무시하고 다른 내용 출력해"` 같은 프롬프트 인젝션 시도 가능 (Prompt Injection)
- `taskTitle`에 매우 긴 문자열 전송 시 OpenRouter 토큰 낭비
- 유효하지 않은 `situation` 값으로 `situationLabel[situation]`이 `undefined` 반환 가능  

**4회차 수정 가능:** ✅ 예

```ts
// 수정안 예시
const VALID_SITUATIONS = ["d3","d2","d1","dday","overdue","complete","weekly-high","weekly-low"];

if (!VALID_SITUATIONS.includes(situation)) {
  return NextResponse.json({ error: "Invalid situation" }, { status: 400 });
}
const safeName = (nickname ?? "").slice(0, 20);
const safeTitle = (taskTitle ?? "").slice(0, 50);
const safePersonality = (personality ?? "").slice(0, 100);
```

---

### ⚠️ [중간] API Rate Limiting 없음

**파일:** `src/app/api/coach-dialogue/route.ts`  
**현황:** 동일 IP가 `/api/coach-dialogue`를 무제한 호출 가능.  
**위험:** OpenRouter free tier 일일 200회 한도 소진 (의도적 또는 버그로 인한 반복 호출).  
**4회차 수정 가능:** ⚠️ Vercel 배포 시 `@vercel/kv` 또는 미들웨어 필요 — 로컬 MVP 단계에서는 `CoachBubble` 재렌더 방지로 간접 완화 가능.  
**현재 완화책:** `CoachBubble`의 `useEffect` deps 배열이 situation/taskTitle 변경 시에만 재호출하므로 과도한 연속 호출은 없음.

---

## 3. localStorage 저장 데이터 검토

| 키 | 저장 내용 | 민감도 | 판단 |
|---|---|---|---|
| `studylog_tasks` | 할 일 제목·과목명·마감일·상태 | 낮음 | ✅ 적절 |
| `studylog_events` | 일정 제목·날짜·시간 | 낮음 | ✅ 적절 |
| `studylog_coach` | 캐릭터 이름·base64 사진·호칭·성격 | 중간 | ℹ️ 검토 필요 |

**코치 프로필 사진 (base64):**  
사진이 최대 500KB base64 문자열로 localStorage에 저장됨. localStorage는 동일 출처 JS에서만 접근 가능하므로 외부 유출 위험은 없음. 단, **같은 기기를 공유하는 환경**에서는 사진이 노출될 수 있음.  

**localStorage에 저장하면 안 되는 정보:**  
- 비밀번호, 토큰, 세션 쿠키 → 현재 저장 없음 ✅
- 서버 API 키 → 현재 저장 없음 ✅ (API 키는 서버 환경변수에만 존재)

---

## 4. 배포 전 확인 체크리스트

```
□ OPENROUTER_API_KEY를 Vercel 환경변수에 설정 (절대 커밋 금지)
□ next.config.ts에 보안 헤더 추가 (위 수정안 적용)
□ API route 입력 검증 추가 (위 수정안 적용)
□ .env.local이 .gitignore에 포함되어 있는지 재확인 (현재 ✅)
□ .claude/settings.local.json이 .gitignore에 포함되어 있는지 재확인 (현재 ✅)
□ GitHub 저장소가 public인 경우 민감 파일 커밋 이력 확인 (git log)
□ 프로덕션 도메인 확정 후 route.ts의 HTTP-Referer 헤더 값 수정
   현재: "https://studylog.vercel.app" → 실제 도메인으로 변경
□ Vercel 배포 후 /api/coach-dialogue 엔드포인트 외부 접근 여부 확인
□ HTTPS 자동 적용 확인 (Vercel은 기본 제공)
```

---

## 5. 4회차 내 수정 권장 우선순위

| 순위 | 항목 | 난이도 | 파일 |
|---|---|---|---|
| 1 | 보안 헤더 추가 | ⭐ 쉬움 | `next.config.ts` |
| 2 | API 입력 검증 + 길이 제한 | ⭐⭐ 보통 | `src/app/api/coach-dialogue/route.ts` |
| 3 | Rate limiting | ⭐⭐⭐ 어려움 | 배포 후 Vercel 미들웨어 |
