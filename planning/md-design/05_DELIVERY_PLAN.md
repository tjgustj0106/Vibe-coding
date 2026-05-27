# Delivery Plan

## 1. 문서 목적

이 문서는 2회차 후반부터 3회차까지의 개발 실행 계획을 정리한다.  
전체 MVP를 한 번에 구현하지 않고, 공통 베이스와 핵심 기능을 단계적으로 구현하기 위한 기준으로 사용한다.

---

## 2. 전체 개발 목표

최종 목표는 4회차 종료 시 배포 가능한 StudyLog MVP를 완성하는 것이다.

최종 산출물:

- Landing Page (`/`) — 서비스 소개 + CTA
- App Page (`/app`) — 하루 뷰 + 월간 뷰 + 할 일 관리
- 핵심 기능 — Task 등록·완료 체크·자동 반영·상세 모달·월간 달력
- GitHub 저장소
- Playwright 테스트 또는 수동 QA 결과
- 배포 가능한 URL (Vercel)
- README

---

## 3. Session 2 Goal

2회차에서는 전체 프로젝트의 약 20~30%를 완성한다.

## 2회차 완료 기준

- Next.js 프로젝트가 준비되어 있다.
- `/` route가 존재한다.
- `/app` route가 존재한다.
- Landing Page 초안이 있다.
- App Page shell이 있다 (하루 뷰 / 월간 뷰 탭 전환 UI).
- `Task` 타입이 `types.ts`에 정의되어 있다.
- 주요 컴포넌트 placeholder가 있다.
- mock data 또는 빈 상태가 준비되어 있다.
- `npm run dev`로 실행 가능하다.

---

## 4. Session 2 Must Have

| Task | Description | Done When |
|---|---|---|
| Project scaffold | Next.js + TypeScript + Tailwind 프로젝트 준비 | `npm run dev` 실행 가능 |
| Landing route | `/` 페이지 생성 | 브라우저에서 `/` 접속 가능 |
| App route | `/app` 페이지 생성 | 브라우저에서 `/app` 접속 가능 |
| Type definition | `Task` 타입 및 `TaskStatus` 정의 | `src/features/tasks/types.ts` 작성 완료 |
| Component placeholders | TaskCard, TaskList, TaskForm, FilterTabs, EmptyState 파일 생성 | 각 파일이 존재하고 기본 JSX 반환 |
| Empty state | 할 일 없을 때 화면 | EmptyState 컴포넌트가 안내 문구 표시 |

---

## 5. Session 2 Should Have

| Task | Description | Done When |
|---|---|---|
| Mock data | 샘플 Task 2~3개 작성 | `mock-data.ts`에서 화면에 데이터 표시 가능 |
| Basic layout | AppHeader, DayNavigator, ViewToggleTabs 구성 | 화면 큰 틀이 정돈됨 |
| Basic styling | Tailwind 기반 DESIGN.md 컬러 토큰 적용 | Action Blue, parchment 배경 기본 적용 |
| Filter placeholder | FilterTabs UI 자리 생성 | 전체 / 미완료 / 완료 탭 UI 표시 (로직 없어도 됨) |
| Storage helper | `storage.ts` 기본 구조 생성 | `getTasks` / `saveTasks` 함수 파일 존재 |

---

## 6. Session 2 Not Today

2회차에서는 아래 기능을 구현하지 않는다.

- 실제 Task CRUD 전체 구현
- 자동 반영(auto-reflect) 로직
- TaskDetailModal 실제 동작
- 월간 CalendarGrid 전체 구현
- localStorage 실제 연동
- DB 연동
- 로그인
- 결제
- 실시간 협업
- 외부 API 연동
- Playwright 테스트 코드 작성
- 배포

---

## 7. Session 3 Goal

3회차에서는 같은 요구사항을 두 방식으로 구현하고 비교한다.

## 비교 방식

1. MD 설계 문서 기반 개발 (`md-driven-dev` 브랜치)
2. OpenSpec change 기반 개발 (`openspec-driven-dev` 브랜치)

## 3회차 목표

- 핵심 기능 구현 (Task 등록, 완료 체크, 자동 반영, 상세 모달, 필터)
- 요구사항 반영도 비교
- 범위 통제 비교
- 코드 구조 비교
- Claude Code 응답 품질 비교

---

## 8. Session 3 Must Have

| Task | Related Requirement | Done When |
|---|---|---|
| Task create | FR-001 | 제목(필수)·과목명·상세내용·마감일 입력 후 목록에 추가됨 |
| Task list (Daily View) | FR-002 | 선택 날짜 기준 할 일 목록이 표시됨 |
| Task auto-reflect | FR-004 | 마감일 지정 시 오늘부터 마감일까지 하루 뷰에 자동 노출됨 |
| Task complete + localStorage | FR-005, FR-007 | 체크박스 전환 후 새로고침해도 상태 유지됨 |
| Task detail / edit (TaskForm 재사용) | FR-006, FR-008 | 항목 클릭 시 상세 확인·수정·삭제 가능 |
| Task filter | FR-011 | 전체 / 미완료 / 완료 탭이 실제 목록을 필터링함 |

---

## 9. Session 3 Should Have

| Task | Description |
|---|---|
| Task delete | 상세 모달에서 삭제 버튼으로 항목 제거 가능 |
| Task edit | 상세 모달에서 수정 버튼으로 내용 변경 가능 |
| localStorage persistence | 새로고침 후에도 Task 데이터 유지 (FR-007) |
| Filter 동작 | 전체 / 미완료 / 완료 탭이 실제 목록 필터링 (FR-011) |
| Calendar day click | 달력 날짜 클릭 시 해당 날의 하루 뷰로 이동 (FR-009) |
| Subject badge 색상 | 과목명별 색상이 자동 지정됨 |

---

## 10. Session 4 Goal

4회차에서는 테스트, 리팩토링, 배포를 진행한다.

## 4회차 목표

- Playwright 테스트 작성 (AC-001~AC-006 기준)
- TDD 흐름 체험
- 리팩토링 (중복 제거, 컴포넌트 정리)
- README 정리
- Vercel 배포
- 최종 발표

---

## 11. Manual QA for Session 2

2회차 종료 전 확인할 항목:

- [ ] `npm run dev`로 앱이 실행된다.
- [ ] `/` 페이지가 열리고 Landing Page 초안이 보인다.
- [ ] `/app` 페이지가 열리고 App Page shell이 보인다.
- [ ] 하루 뷰 / 월간 뷰 탭 전환 UI가 표시된다.
- [ ] 큰 TypeScript 오류가 없다.
- [ ] `src/features/tasks/types.ts`에 `Task` 타입이 존재한다.
- [ ] placeholder 컴포넌트(TaskCard, TaskList, TaskForm, FilterTabs)가 파일로 존재한다.
- [ ] mock data 또는 EmptyState가 화면에 표시된다.
- [ ] 데스크탑(1280px+) 기준으로 큰 레이아웃 깨짐이 없다.
- [ ] 오늘 구현 범위를 넘는 기능(실제 CRUD, 자동 반영 로직)이 들어가지 않았다.

---

## 12. Verification Commands

```bash
npm run dev
npm run build
git status
```

선택적으로 실행:

```bash
npm run lint
```

---

## 13. Branch Plan

3회차 비교 실험을 위해 브랜치를 나눈다.

```text
main
├── md-driven-dev       ← MD 설계 문서 기반 개발
└── openspec-driven-dev ← OpenSpec change 기반 개발
```

## MD 기반 개발 브랜치

```bash
git checkout -b md-driven-dev
```

## OpenSpec 기반 개발 브랜치

```bash
git checkout main
git checkout -b openspec-driven-dev
```

---

## 14. Development Prompts

## 공통 베이스 구현 프롬프트

```text
01_Product_Brief.md, 02_REQUIREMENTS_SPEC.md, 03_UX_UI_SPEC.md,
04_TECHNICAL_DESIGN.md를 읽고 오늘 구현할 공통 베이스 20~30%만 제안해 주세요.

조건:
- MD 기반 개발과 OpenSpec 기반 개발 비교를 방해하지 않는 공통 구조만 만드세요.
- CRUD 전체 구현은 하지 마세요.
- 로그인, DB, 외부 API는 넣지 마세요.
- route, shell, type, placeholder 중심으로 계획하세요.
- 아직 파일은 수정하지 말고 수정할 파일과 구현 순서만 제안하세요.
```

## 구현 승인 프롬프트

```text
좋습니다. 제안한 계획대로 구현해 주세요.

조건:
- 04_TECHNICAL_DESIGN.md의 Source Structure와 Data Model을 따르세요.
- 복잡한 기능은 만들지 마세요.
- CRUD 전체는 구현하지 마세요.
- 오늘은 route, 화면 shell, 타입, placeholder까지만 구현하세요.
- 구현 후 변경 파일과 실행 방법을 요약해 주세요.
```

---

## 15. Comparison Criteria for Session 3

3회차에서 두 방식의 결과를 비교할 때 볼 기준:

| Criteria                | Question                              |
| ----------------------- | ------------------------------------- |
| Requirement Coverage    | FR-001~FR-007 요구사항이 빠짐없이 구현되었는가?     |
| Scope Control           | 불필요한 기능(알림, 다중 사용자 등)이 추가되지 않았는가?   |
| Implementation Order    | 타입 → storage → 컴포넌트 → 페이지 순서가 자연스러웠는가? |
| File Structure          | 04_TECHNICAL_DESIGN.md의 구조를 따랐는가?    |
| Code Quality            | 중복과 복잡도가 적절한가?                       |
| UI Consistency          | 03_UX_UI_SPEC.md와 DESIGN.md를 따랐는가?   |
| Verifiability           | AC-001~AC-006 기준으로 QA 확인이 쉬운가?       |
| Claude Response Quality | 계획, 요약, 검증 설명이 명확했는가?                |

---

## 16. Risks

| Risk                  | Mitigation                              |
| --------------------- | --------------------------------------- |
| 기능 범위가 커짐             | Must / Should / Nice로 분리, 이 문서 기준 엄수   |
| 구현 시간이 부족함            | 2회차는 베이스(타입 + placeholder)까지만          |
| 문서와 구현이 어긋남           | 구현 전 04_TECHNICAL_DESIGN.md 재확인         |
| auto-reflect 로직 복잡도   | utils.ts에 날짜 범위 계산 함수 분리, 렌더 시 파생     |
| OpenSpec이 과하게 커짐      | Task 단위를 10~20분 내 구현 가능한 크기로 제한        |
| Next.js 설치 이슈         | `npx create-next-app@latest` 공식 템플릿 사용 |
| 학생별 진도 차이             | Must Have 중심으로 진행, Should는 시간 여유 시     |

---

## 17. Commit Plan

2회차 종료 시 커밋:

```bash
git add .
git commit -m "session-2: add planning docs and baseline scaffold"
git push
```

3회차 MD 기반 개발 커밋:

```bash
git commit -m "session-3a: implement StudyLog core features from MD design"
```

3회차 OpenSpec 기반 개발 커밋:

```bash
git commit -m "session-3b: implement StudyLog core features from OpenSpec"
```

---

## 18. Final Checklist

2회차 종료 전 확인:

* [ ] MD 설계 문서 5개 작성 완료
  * [ ] 01_Product_Brief.md
  * [ ] 02_REQUIREMENTS_SPEC.md
  * [ ] 03_UX_UI_SPEC.md
  * [ ] 04_TECHNICAL_DESIGN.md
  * [ ] 05_DELIVERY_PLAN.md
* [ ] Next.js 프로젝트 생성
* [ ] `/` route 확인
* [ ] `/app` route 확인
* [ ] `src/features/tasks/types.ts` — Task 타입 정의
* [ ] placeholder 컴포넌트 파일 생성 (TaskCard, TaskList, TaskForm, FilterTabs, EmptyState)
* [ ] mock data 또는 EmptyState 표시 확인
* [ ] `npm run dev` 실행 확인
* [ ] Git commit / push 완료
