## Why

할 일 관리 앱에서 마감이 임박해도 사용자에게 별다른 알림이 없어 동기부여가 부족하다.
사용자가 직접 설정한 캐릭터(이름·사진·성격)가 마감 임박 시 잔소리를 하고 완료 시 칭찬을 해주는 동기부여 기능을 추가한다.

## What Changes

- **새 온보딩 화면** — 앱 최초 진입 시 캐릭터 이름·사진·자신을 부르는 호칭·성격 설정
- **잔소리 말풍선** — 하루 뷰 상단에 아바타 + 말풍선 표시 (마감 D-3 이하 미완료 할 일 존재 시)
- **완료 칭찬 팝업** — 할 일 체크 시 2초간 아바타 + 칭찬 말풍선 표시
- **주간 진도 코멘트** — 하루 뷰 하단에 이번 주 완료율 기반 코멘트 (≥80% 긍정 / ≤30% 부정)
- **OpenRouter API 연동** — Next.js API route를 통해 OpenRouter 무료 모델에서 성격 기반 대사 생성
- **localStorage 저장** — `studylog_coach` 키로 캐릭터 프로필(이름·사진·호칭·성격) 저장

## Capabilities

### New Capabilities

- `coach-profile-setup`: 캐릭터 이름·사진(base64)·호칭·성격(자유 텍스트) 등록 및 수정
- `coach-nag-bubble`: 하루 뷰 상단에 마감 임박 잔소리 말풍선 표시
- `coach-completion-praise`: 할 일 완료 체크 시 칭찬 팝업(2초) 표시
- `coach-weekly-summary`: 주간 완료율 기반 동기부여 코멘트 표시

### Modified Capabilities

(없음)

## Impact

- `src/features/coach/` — 신규 feature 폴더 전체 (types, storage, hooks, components, API route)
- `src/app/api/coach-dialogue/route.ts` — OpenRouter API 호출 Next.js API route 신규
- `src/app/app/page.tsx` — 하루 뷰에 CoachOnboarding, CoachBubble, CoachWeeklySummary 연결
- `src/features/tasks/components/TaskCard.tsx` — 완료 체크 시 CoachCompletionPop 트리거
- `package.json` — 추가 의존성 없음 (fetch API 사용, OpenRouter는 OpenAI-compatible REST)
