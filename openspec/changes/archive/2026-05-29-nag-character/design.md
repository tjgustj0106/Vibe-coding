## Context

StudyLog는 Next.js 16.2.6 (App Router) + TypeScript + Tailwind CSS로 구현된 할 일 플래너이다.
현재 할 일 추가·완료·마감일 관리, 24h 타임라인, 월간 달력이 구현되어 있고 모든 데이터는 localStorage에만 저장된다.
신규 잔소리 캐릭터 기능은 API key 없이 OpenRouter 무료 tier(OpenAI-compatible REST)를 이용해 성격 기반 대사를 생성하고, 프로필은 `studylog_coach` localStorage 키로 저장한다.

## Goals / Non-Goals

**Goals:**
- 최초 진입 시 캐릭터 이름·사진·호칭·성격을 등록하는 온보딩 화면 제공
- 하루 뷰에 마감 D-3 이하 미완료 과제가 있을 때 잔소리 말풍선 표시
- 할 일 완료 체크 시 2초 칭찬 팝업 표시
- 주간 완료율 80%↑ / 30%↓ 시 코멘트 표시
- OpenRouter free model로 성격 기반 대사 생성 (fallback: 하드코딩 프리셋 대사)

**Non-Goals:**
- 유료 API 사용 (비용 발생 금지)
- 서버 사이드 저장 (로그인·DB 없음)
- Push notification / 앱 알림
- 여러 캐릭터 동시 등록

## Decisions

### 1. 대사 생성: OpenRouter API + 프리셋 fallback

**결정**: Next.js API route (`/api/coach-dialogue`)가 OpenRouter에 요청하고, 실패·타임아웃 시 하드코딩된 프리셋 대사를 반환한다.

**이유**: 무료 모델(llama-3.3-8b 등)은 지연이 있고 일일 200 req 한도가 있어 UI가 항상 즉각 반응해야 한다. 프리셋 fallback으로 네트워크 오류 시에도 기능이 유지된다.

**대안 고려**: 
- 순수 프리셋만 사용 → 성격 자유 입력이 반영되지 않아 기획 의도 충족 불가
- 클라이언트에서 직접 OpenRouter 호출 → API key 노출 위험, API route 사용이 더 안전

### 2. API Key 관리

**결정**: OpenRouter API key는 `.env.local`의 `OPENROUTER_API_KEY` 환경 변수로 관리하고 서버 API route에서만 사용한다. 클라이언트 번들에 노출되지 않는다.

**이유**: Next.js에서 `NEXT_PUBLIC_` prefix 없는 환경 변수는 서버에서만 접근 가능하다.

### 3. 사진 저장: base64 in localStorage

**결정**: 업로드된 사진을 FileReader로 base64 인코딩 후 localStorage에 저장한다. 권장 최대 500KB.

**이유**: 서버 없이 이미지를 영속 저장할 수 있는 가장 단순한 방법이다. 500KB 이상은 localStorage 용량 문제가 발생할 수 있으므로 업로드 시 경고한다.

**대안 고려**: IndexedDB → 더 큰 용량이나 API 복잡도 증가, 현재 스케일에서 불필요.

### 4. 컴포넌트 위치

**결정**: `src/features/coach/` 신규 feature 폴더로 분리. `types.ts`, `storage.ts`, `dialogue.ts`, `hooks/useCoach.ts`, `components/` 구조.

**이유**: 기존 tasks / schedule feature와 동일한 패턴을 유지해 코드베이스 일관성을 높인다.

### 5. 완료 팝업 쿨다운

**결정**: 같은 날 완료 팝업이 3회 이상 표시된 경우 이후 완료 체크에서는 팝업을 생략한다. 카운트는 메모리에서만 관리(새로고침 시 리셋).

**이유**: 팝업이 너무 자주 뜨면 사용자가 피로감을 느낀다.

## Risks / Trade-offs

- **OpenRouter 지연** → 대사 로딩 중 스피너 표시 + 프리셋 fallback으로 UX 보호
- **일일 200 req 한도** → 캐릭터 등록/수정 시 1회 + 매 화면 진입 시 1회 호출 → 일반 사용에서는 충분. 초과 시 프리셋 사용
- **localStorage base64 이미지 용량** → 500KB 초과 시 업로드 단계에서 경고 메시지 표시
- **SSR hydration** → `useCoach` 훅은 `useEffect`에서만 localStorage 읽도록 구현 (기존 패턴 준수)
- **API key 미설정** → `OPENROUTER_API_KEY` 없으면 API route가 프리셋 대사 직접 반환 (graceful degradation)

## Open Questions

- [ ] 온보딩을 건너뛸 수 있는가? (건너뛰면 기본 캐릭터 없이 잔소리 기능 비활성화)
- [ ] 사진 없을 때 기본 이미지: 이모지 아이콘? 성격별 색상 아바타?
