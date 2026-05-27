# Technical Design

## 1. 문서 목적

이 문서는 서비스의 기술 구현 방향을 정리한다.  
제품의 가치나 사용자 문제는 Product Brief에서 다루고, 이 문서에서는 실제 개발자가 구현할 구조를 정의한다.

---

## 2. Architecture Overview

## 전체 구조

```text
User
→ Next.js App (App Router)
→ Pages / Routes  (/, /app)
→ UI Components   (Button, Input, Card, Modal, Badge)
→ Feature Logic   (tasks: DailyView, MonthlyView, TaskForm, CalendarGrid)
→ Client State    (React useState / useMemo)
→ Storage         (localStorage via storage.ts helper)
→ Future Backend  (API Routes + DB — MVP 이후)
```

## 이번 MVP의 구현 범위

* 단일 사용자 기준
* 프론트엔드 중심 구현
* 서버 DB 없이 localStorage 사용
* 인증, 결제, 실시간 기능 제외

---

## 3. Tech Stack

| Area            | Technology       | Reason                           |
| --------------- | ---------------- | -------------------------------- |
| Framework       | Next.js          | App Router 기반 웹앱 구현            |
| UI Library      | React            | 컴포넌트 기반 UI 구성                   |
| Language        | TypeScript       | 타입 기반 안정성 확보                    |
| Styling         | Tailwind CSS     | 빠른 UI 스타일링                      |
| AI Coding       | Claude Code      | 코드 생성, 수정, 검토                   |
| Version Control | GitHub           | 커밋, 브랜치, 비교 실험                  |
| Test            | Playwright later | 4회차 테스트 자동화 예정                  |

---

## 4. Route Design

| Route  | File Path              | Purpose       | Notes                          |
| ------ | ---------------------- | ------------- | ------------------------------ |
| `/`    | `src/app/page.tsx`     | Landing Page  | 서비스 소개, CTA → /app 이동          |
| `/app` | `src/app/app/page.tsx` | Main App Page | 하루 뷰 / 월간 뷰 전환, 할 일 등록·체크·조회 |

---

## 5. Source Structure

```text
src/
  app/
    page.tsx                      ← Landing Page
    app/
      page.tsx                    ← Main App Page

  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
      Badge.tsx                   ← SubjectBadge 기반 컴포넌트
      Modal.tsx                   ← TaskForm / TaskDetailModal 공통 모달 래퍼

    layout/
      AppHeader.tsx

  features/
    tasks/
      types.ts                    ← Task 타입 정의
      mock-data.ts                ← 초기 샘플 데이터
      storage.ts                  ← localStorage 헬퍼 (get / set / clear)
      utils.ts                    ← 날짜 범위 계산, 자동 반영 로직
      components/
        DailyView.tsx             ← 하루 뷰 컨테이너
        MonthlyView.tsx           ← 월간 달력 컨테이너
        DayNavigator.tsx          ← 이전/다음 날 이동
        TaskForm.tsx              ← 등록 / 수정 모달 폼
        TaskList.tsx              ← 필터 적용 후 목록 렌더링
        TaskCard.tsx              ← 개별 할 일 카드 (체크박스 + 제목 + 배지)
        TaskDetailModal.tsx       ← 상세 내용 모달
        FilterTabs.tsx            ← 전체 / 미완료 / 완료 탭
        EmptyState.tsx            ← 할 일 없을 때 안내
        CalendarGrid.tsx          ← 7×N 달력 그리드
        CalendarDayCell.tsx       ← 날짜 셀 (일정 최대 2개 + +N)
        SubjectBadge.tsx          ← 과목명 색상 배지
        DeadlineChip.tsx          ← D-day / 날짜 표시 칩
```

## 폴더 역할

| Folder                           | Role                           |
| -------------------------------- | ------------------------------ |
| `src/app`                        | Next.js route와 page 관리         |
| `src/components/ui`              | 재사용 가능한 기본 UI 컴포넌트             |
| `src/components/layout`          | 레이아웃 관련 컴포넌트                   |
| `src/features/tasks`             | 핵심 기능 단위 코드                    |
| `src/features/tasks/components`  | tasks 기능 전용 컴포넌트               |

---

## 6. Feature Module Design

## 핵심 Feature

| Feature              | Description                            | Priority |
| -------------------- | -------------------------------------- | -------- |
| Task Create          | 제목·과목명·상세내용·마감일로 할 일 등록               | Must     |
| Task List (Daily)    | 선택된 날짜 기준 할 일 목록 표시 + 마감일 자동 반영       | Must     |
| Task Complete        | 체크박스로 완료 ↔ 미완료 즉시 전환                  | Must     |
| Auto-reflect         | 마감일 지정 항목을 오늘부터 마감일까지 하루 뷰에 자동 노출     | Must     |
| Task Detail / Edit   | TaskForm 재사용 — 항목 클릭 시 상세 확인·수정·삭제     | Must     |
| Task Filter          | 전체 / 미완료 / 완료 상태 기준 필터링               | Should   |
| Task List (Monthly)  | 달력 형태로 일정·마감일 표시 (3회차 시간 여유 시 추가)     | Should   |
| ~~Always-on-top~~    | ~~바탕화면 상주~~                             | **제외**   |

## 이번 회차에서 구현할 Feature

* Route 구조 (`/`, `/app`)
* Landing Page 초안
* App Page shell (하루 뷰 / 월간 뷰 탭 전환)
* 기본 Task 타입 및 mock data
* 컴포넌트 placeholder
* localStorage 헬퍼 기본 구조

## 다음 회차로 넘길 Feature

* 실제 Task 생성 / 수정 / 삭제 로직
* 자동 반영(auto-reflect) 날짜 계산 로직
* 완료 체크 상태 관리
* 필터 로직
* CalendarGrid 날짜 렌더링

---

## 7. Data Model

## 기본 타입

```ts
export type TaskStatus = "todo" | "done";

export type Task = {
  id: string;
  title: string;
  detail?: string;        // 상세 내용 (모달에서 표시)
  subject?: string;       // 과목명 (SubjectBadge 표시, 자동 반영 레이블에 사용)
  dueDate?: string;       // 마감일 ISO date (예: "2026-05-30") — 자동 반영 기준
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};
```

## 서비스별 확장 필드

| Field       | Type         | Required | Description                         |
| ----------- | ------------ | -------- | ----------------------------------- |
| `id`        | `string`     | Yes      | 고유 ID (crypto.randomUUID 또는 Date.now) |
| `title`     | `string`     | Yes      | 할 일 제목 (최대 100자)                   |
| `detail`    | `string`     | No       | 상세 내용 (모달 클릭 시 표시)                 |
| `status`    | `TaskStatus` | Yes      | `"todo"` 또는 `"done"` 2단계            |
| `createdAt` | `string`     | Yes      | 생성 시각 ISO string                   |
| `updatedAt` | `string`     | Yes      | 수정 시각 ISO string                   |

## 서비스별 추가 필드

| Field     | Type     | Required | Description                                      |
| --------- | -------- | -------- | ------------------------------------------------ |
| `subject` | `string` | No       | 과목명 — SubjectBadge 색상 지정 및 자동 반영 레이블에 사용       |
| `dueDate` | `string` | No       | 마감일 ISO date string — 이 날짜까지 하루 뷰에 자동 반영        |

---

## 8. State Design

| State            | Type                    | Purpose                        |
| ---------------- | ----------------------- | ------------------------------ |
| `tasks`          | `Task[]`                | 전체 할 일 목록 (localStorage와 동기화)  |
| `selectedDate`   | `string`                | 현재 하루 뷰 기준 날짜 (YYYY-MM-DD)    |
| `currentView`    | `"daily" \| "monthly"`  | 하루 뷰 / 월간 뷰 전환 상태             |
| `currentMonth`   | `string`                | 월간 뷰 기준 월 (YYYY-MM)           |
| `modalTask`      | `Task \| null`          | 상세 모달에 표시할 항목 (null이면 닫힘)     |
| `formInput`      | `Partial<Task>`         | 등록 / 수정 폼 입력 상태               |
| `selectedFilter` | `TaskStatus \| "all"`   | 필터 탭 상태                       |
| `validationError`| `string \| null`        | 제목 미입력 등 오류 메시지               |

## 상태 관리 방식

이번 MVP에서는 별도 상태 관리 라이브러리를 사용하지 않는다.

* React `useState` — tasks, selectedDate, currentView 등
* `useMemo` — 날짜별 할 일 필터링, auto-reflect 계산
* `storage.ts` — localStorage get / set 헬퍼 함수

---

## 9. Storage Strategy

## 1차 MVP

| Option       | Decision                             |
| ------------ | ------------------------------------ |
| DB           | 사용하지 않음                              |
| API Server   | 사용하지 않음                              |
| localStorage | 기본 저장 방식 (`tasks` 키로 JSON 저장)        |
| mock data    | 초기 화면 구성용 샘플 2~3개 Task 제공           |

## 저장 흐름

```text
User Action (추가 / 체크 / 수정 / 삭제)
→ React State Update (tasks 배열 갱신)
→ localStorage Save  (storage.ts의 saveTasks 호출)
→ UI Re-render
```

## 향후 확장 가능성

* Server Actions + DB 저장
* 사용자 인증 연동
* API Route 기반 CRUD
* Google Calendar 등 외부 서비스 연동

---

## 10. API Design

이번 MVP에서는 서버 API를 구현하지 않는다.

## 향후 확장 시 API 후보

| API               | Method   | Purpose               |
| ----------------- | -------- | --------------------- |
| `/api/tasks`      | `GET`    | 할 일 목록 조회             |
| `/api/tasks`      | `POST`   | 할 일 생성                |
| `/api/tasks/:id`  | `PATCH`  | 할 일 수정 또는 완료 상태 변경    |
| `/api/tasks/:id`  | `DELETE` | 할 일 삭제                |

## 이번 회차 결정

* API 구현 없음
* 서버 DB 없음
* 클라이언트 상태와 localStorage 중심

---

## 11. Validation Rules

| Rule              | Description                          |
| ----------------- | ------------------------------------ |
| Required Title    | 제목은 비어 있을 수 없다                       |
| Title Length      | 제목은 100자를 초과할 수 없다                   |
| Valid Status      | 상태는 `"todo"` 또는 `"done"` 만 허용한다      |
| Valid DueDate     | 마감일은 유효한 ISO date 형식이어야 한다           |
| No Sensitive Data | 민감 정보(비밀번호, 개인정보 등)는 저장하지 않는다        |

---

## 12. Error Handling

| Situation              | Handling                               |
| ---------------------- | -------------------------------------- |
| 제목 미입력                 | QuickAddBar 또는 TaskForm에 오류 메시지 표시     |
| 제목 100자 초과             | 입력 필드 아래에 오류 메시지 표시                   |
| localStorage 읽기 실패     | 빈 배열(`[]`)로 fallback                  |
| localStorage 쓰기 실패     | 콘솔 경고 출력, 현재 세션 상태는 유지               |
| 알 수 없는 status 값        | `"todo"` 기본값으로 fallback               |
| 데이터 없음 (빈 날짜)          | EmptyState 컴포넌트 표시                    |

---

## 13. Accessibility Considerations

* 모든 입력 필드는 `<label>` 또는 `aria-label`을 가진다.
* 버튼 텍스트는 기능을 직접 설명한다 (예: "추가", "삭제", "완료로 변경").
* 체크박스는 `aria-checked`로 색상 외 상태 전달을 보장한다.
* 색상만으로 상태를 구분하지 않는다 (완료 항목: 취소선 + 색상 변경 병용).
* 주요 영역(`<header>`, `<main>`, `<dialog>`)은 heading 구조(`h1`, `h2`)를 가진다.
* TaskDetailModal은 포커스 트랩을 구현하여 키보드 사용자를 지원한다.
* CalendarDayCell은 `aria-label="2026년 5월 27일, 할 일 2개"` 형식으로 스크린리더를 지원한다.

---

## 14. Security Considerations

이번 MVP에서 지킬 보안 원칙

* API key를 코드에 넣지 않는다.
* `.env` 파일을 GitHub에 올리지 않는다 (`.gitignore`에 포함).
* 민감한 개인정보를 저장하지 않는다.
* localStorage에는 과제·일정 데이터만 저장한다 (비밀번호, 이메일 등 제외).
* 인증이 필요한 기능은 이번 MVP에서 제외한다.

---

## 15. Decision Log

| Decision               | Reason                               | Consequence                        |
| ---------------------- | ------------------------------------ | ---------------------------------- |
| Next.js App Router 사용  | 현재 Next.js 기본 구조와 수업 방향에 적합          | `src/app` 기준 라우팅                   |
| TypeScript 사용          | 데이터 구조와 컴포넌트 props를 명확히 하기 위해        | 초기 작성량 증가                          |
| localStorage 우선        | 4회차 안에 MVP 완성하기 위해                   | 다중 사용자 기능 제외                       |
| Task (단일 Entity 중심)    | 범위 통제, 할 일과 과제를 하나의 타입으로 통합          | 복잡한 관계형 데이터 제외                     |
| 상태 2단계 (`todo/done`)   | 플래너 특성상 진행 중 상태 불필요                  | `in_progress` 상태 없음                |
| API 미구현                | 시간 제한과 학습 목표 고려                      | 서버 기능은 향후 확장                       |
| auto-reflect는 렌더 시 계산  | Task에 반복 저장하지 않고 dueDate 기반으로 즉시 파생  | storage에는 원본 Task만 저장, 뷰에서 계산      |

---

## 16. Implementation Notes

3회차에서 구현할 때 Claude Code는 다음 순서를 따른다.

1. 현재 파일 구조 확인
2. `04_TECHNICAL_DESIGN.md` 및 `03_UX_UI_SPEC.md` 문서 읽기
3. 수정 전 계획 제안
4. 작은 단위로 구현 (타입 → storage → 컴포넌트 → 페이지 순서)
5. `next dev` 실행 또는 build로 검증
6. 변경 파일 요약
7. commit message 제안

---

## 17. Open Questions

| Question                     | Decision                               |
| ---------------------------- | -------------------------------------- |
| 항목의 정확한 이름은 무엇인가?            | **Task** (할 일/과제 통합) — 결정 완료           |
| 상태값은 몇 개가 필요한가?              | **2개** — `"todo"` \| `"done"` — 결정 완료 |
| 삭제 기능을 넣을 것인가?               | **Yes** — Should 우선순위로 포함 — 결정 완료    |
| 필터는 상태 기준인가, 날짜 기준인가?        | **상태 기준** (전체/미완료/완료) — 결정 완료         |
| auto-reflect 항목의 완료 체크는 날짜별인가? | 3회차 구현 시 결정 필요                         |
