## 1. Foundation — Types & Storage

- [x] 1.1 `src/features/coach/types.ts` 생성 — `CoachProfile` 타입 (name, photo, nickname, personality) 및 `CoachSituation` 유니온 타입 정의
- [x] 1.2 `src/features/coach/storage.ts` 생성 — `getCoach()` / `saveCoach()` localStorage 유틸 구현 (`studylog_coach` 키)

## 2. Preset Dialogue Bank

- [x] 2.1 `src/features/coach/dialogue.ts` 생성 — 상황(D-3/D-2/D-1/D-day/overdue/complete/weekly-high/weekly-low)별 프리셋 대사 객체 정의
- [x] 2.2 `dialogue.ts`에 `getPresetDialogue(situation, taskTitle?, nickname?)` 함수 구현 — 상황에 맞는 대사 반환

## 3. OpenRouter API Route

- [x] 3.1 `.env.local`에 `OPENROUTER_API_KEY=` 플레이스홀더 추가 및 `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [x] 3.2 `src/app/api/coach-dialogue/route.ts` 생성 — POST 엔드포인트: `{ situation, taskTitle, nickname, personality }` 받아 OpenRouter free model에 요청, 실패 시 프리셋 대사 반환

## 4. useCoach Hook

- [x] 4.1 `src/features/coach/hooks/useCoach.ts` 생성 — `CoachProfile | null` 상태 관리, `useEffect`에서 localStorage 로드 (hydration 패턴 준수), `saveProfile()` 함수 노출
- [x] 4.2 `useCoach.ts`에 `fetchDialogue(situation, taskTitle?)` 함수 추가 — `/api/coach-dialogue` 호출, fallback 처리

## 5. Onboarding Component

- [x] 5.1 `src/features/coach/components/CoachOnboarding.tsx` 생성 — 4단계 온보딩 UI (이름 입력 → 사진 업로드 → 호칭 입력 → 성격 입력 → 완료)
- [x] 5.2 사진 업로드 시 500KB 초과 경고 및 base64 변환 로직 구현
- [x] 5.3 "건너뛰기" 버튼 — 프로필 미저장으로 온보딩 종료
- [x] 5.4 `src/app/app/page.tsx`에 온보딩 연결 — `coach === null` 일 때 `CoachOnboarding` 표시, 완료 시 메인 플래너로 전환

## 6. CoachBubble — Nag Display

- [x] 6.1 `src/features/coach/components/CoachBubble.tsx` 생성 — 아바타 이미지(또는 플레이스홀더) + 말풍선 레이아웃 컴포넌트
- [x] 6.2 하루 뷰(`src/app/app/page.tsx`)에 `CoachBubble` 조건부 렌더링 추가 — 미완료 태스크 중 D-3 이하 존재 시 표시
- [x] 6.3 마감 임박 대사 로딩 로직 — 가장 급한 태스크 1개를 기준으로 `fetchDialogue` 호출, 로딩 중 스피너 표시

## 7. CoachCompletionPop — Praise Popup

- [x] 7.1 `src/features/coach/components/CoachCompletionPop.tsx` 생성 — 아바타 + 칭찬 말풍선 오버레이, 2초 후 자동 사라짐
- [x] 7.2 완료 팝업 쿨다운 로직 구현 — 세션 내 완료 횟수 3회 이상 시 팝업 생략 (메모리 상태로 관리)
- [x] 7.3 `src/features/tasks/components/TaskCard.tsx`에 완료 체크 핸들러 연결 — 완료 시 칭찬 대사 요청 후 `CoachCompletionPop` 표시

## 8. CoachWeeklySummary — Weekly Comment

- [x] 8.1 `src/features/coach/components/CoachWeeklySummary.tsx` 생성 — 주간 완료율 계산(월~일), 80%↑ 또는 30%↓ 시 코멘트 표시
- [x] 8.2 하루 뷰 하단에 `CoachWeeklySummary` 연결

## 9. Settings Integration

- [x] 9.1 앱 설정(또는 헤더 메뉴)에 "캐릭터 설정" 진입점 추가 — `CoachOnboarding`을 수정 모드로 열기
