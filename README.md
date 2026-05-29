# StudyLog

대학생을 위한 하루 할 일 + 월간 스터디 플래너

🔗 **[라이브 데모](https://myproject-rose-pi.vercel.app)**

---

## 주요 기능

### 하루 뷰
- 할 일 추가 / 완료 체크 / 삭제 (2단계 삭제 확인)
- 과목명·상세 내용·마감일 입력
- 마감일을 설정하면 **오늘부터 마감일까지 매일 자동 반영** (별도 입력 불필요)
- 전체 / 미완료 / 완료 필터 탭
- 날짜 이동 (이전·오늘·다음)
- 시간별 일정 타임라인 (00:00~24:00) — 오늘 날짜는 현재 시각으로 자동 스크롤

### 월간 뷰
- 과제 기간 바 (등록일~마감일 Gantt 스타일, 과제마다 고유 색상)
- 날짜 클릭 → 당일 할 일·일정 모달
- 모달에서 바로 시간 일정 추가 가능

### 코치 캐릭터
- 첫 진입 시 응원 캐릭터 온보딩 (이름·사진·호칭·성격 설정)
- 마감 D-3 이내 미완료 과제가 있을 때 잔소리 말풍선 표시
- 할 일 완료 시 칭찬 팝업 (2초 자동 닫힘, 세션당 3회 쿨다운)
- 이번 주 완료율 요약 (80% 이상 / 30% 이하 시 코멘트)
- OpenRouter API 연동 (llama-3.3-8b-instruct:free) — 키 없을 때 프리셋 대사 자동 사용

### 데이터
- 로그인 없이 브라우저 **localStorage**에 저장
- 새로고침 후에도 데이터 유지

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16.2.6 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| AI | OpenRouter API (llama-3.3-8b-instruct:free) |
| 테스트 | Playwright E2E |
| 배포 | Vercel |

---

## 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000/app
```

### 코치 AI 활성화 (선택)

[OpenRouter](https://openrouter.ai)에서 무료 API 키 발급 후:

```bash
# .env.local
OPENROUTER_API_KEY=sk-or-...
```

키가 없어도 프리셋 대사로 동작합니다.

## 테스트 실행

```bash
# 개발 서버가 켜진 상태에서
npm test

# UI 모드
npm run test:ui
```

## 빌드

```bash
npm run build
npm start
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                    # 랜딩 페이지 (/)
│   ├── app/page.tsx                # 플래너 메인 (/app)
│   └── api/coach-dialogue/route.ts # AI 대사 생성 API
├── features/
│   ├── tasks/                      # 할 일 도메인
│   │   ├── hooks/useTasks.ts
│   │   ├── components/             # TaskList, TaskCard, TaskForm, CalendarGrid ...
│   │   └── utils.ts
│   ├── schedule/                   # 시간 일정 도메인
│   │   ├── hooks/useScheduleEvents.ts
│   │   └── components/             # ScheduleTimeline, ScheduleEventForm
│   └── coach/                      # 코치 캐릭터 도메인
│       ├── hooks/useCoach.ts
│       ├── components/             # CoachOnboarding, CoachBubble, CoachCompletionPop, CoachWeeklySummary
│       ├── dialogue.ts             # 프리셋 대사
│       └── storage.ts
├── components/layout/              # AppHeader
docs/
└── SECURITY_REVIEW.md              # 보안 점검 결과
tests/
└── e2e/studylog.spec.ts            # Playwright E2E 테스트
```
