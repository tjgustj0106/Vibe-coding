# UX / UI Spec

## 1. Design Reference

Follow:

- docs/DESIGN.md (Apple-inspired: near-invisible UI, single Action Blue accent, pill CTAs, SF Pro / Inter typography, parchment ↔ white tile rhythm)

---

## 2. Screen Map

| Screen | Route | Purpose |
|---|---|---|
| Landing Page | `/` | 서비스 문제·가치·핵심 기능을 소개하고 앱 화면으로 이동 |
| App Page | `/app` | 하루 뷰·월간 뷰 전환, 할 일 등록·체크·상세 확인 |
| Task Detail Modal | `/app` (overlay) | 선택한 항목의 상세 내용 표시, 수정 및 삭제 |
| Task Form Modal | `/app` (overlay) | 새 할 일 / 과제 등록 및 기존 항목 수정 |

---

## 3. Landing Page

### Purpose

대학생이 겪는 일정 관리 문제를 공감시키고, 플래너의 핵심 가치(과제 자동 반영, 하루 뷰 + 월간 뷰)를 전달하여 앱 화면으로 이동시킨다.

### Required Sections

- **Hero** — 헤드라인 + 서브헤드라인 + CTA 버튼 (pill)
- **Problem** — 대학생이 공감할 3가지 문제 카드 (parchment 배경 tile)
- **Core Features** — 핵심 기능 3개 소개 (아이콘 + 제목 + 한 줄 설명)
- **CTA Button** — 페이지 하단 재강조 버튼

### Key Copy

- **Headline:** 오늘 해야 할 일, 한 번에 보이게
- **Subheadline:** 과제 마감일을 한 번만 입력하면 마감일까지 매일 자동으로 할 일에 나타납니다
- **CTA:** 플래너 시작하기

---

## 4. App Page

### Purpose

사용자가 실제 플래닝 기능(하루 할 일 확인·체크, 과제 등록, 월간 달력 조회)을 수행하는 메인 화면이다.

### Required Areas

| Area | Description |
|---|---|
| **Header** | 앱 타이틀(StudyLog), 현재 날짜 표시, 하루 뷰 ↔ 월간 뷰 탭 전환 |
| **Input Form** | 상단 고정 빠른 추가 입력창 + "추가" pill 버튼 → 클릭 시 Task Form Modal 오픈 |
| **Filter Area** | 전체 / 미완료 / 완료 필터 탭 (하루 뷰에서만 표시) |
| **List Area (Daily)** | 선택된 날짜의 할 일 카드 목록; 체크박스 + 제목 + 과목 배지 + 마감일 표시 |
| **List Area (Monthly)** | 7×N 달력 그리드; 각 날짜 셀에 해당 일정 최대 2개 노출, 초과 시 "+N" 표시 |
| **Empty State** | 할 일이 없는 날짜에 안내 문구 + 추가 유도 버튼 표시 |
| **Status Action** | 각 TaskCard의 체크박스로 완료 ↔ 미완료 즉시 전환 |

### Daily View Layout

```
┌────────────────────────────────────┐
│  StudyLog          2026년 5월 27일  │  ← AppHeader
│  [하루 뷰]  [월간 뷰]               │  ← ViewToggleTabs
├────────────────────────────────────┤
│  < 어제        오늘        내일 >   │  ← DayNavigator
├────────────────────────────────────┤
│  [+ 할 일 또는 과제 추가...]  [추가] │  ← QuickAddBar
├────────────────────────────────────┤
│  [전체]  [미완료]  [완료]           │  ← FilterTabs
├────────────────────────────────────┤
│  ☐  선형대수 과제 제출   [선형대수] │  ← TaskCard
│  ☑  알고리즘 문제풀이    [알고리즘] │
│  ☐  독서 30분                       │
└────────────────────────────────────┘
```

### Monthly View Layout

```
┌────────────────────────────────────┐
│  StudyLog          2026년 5월      │  ← AppHeader
│  [하루 뷰]  [월간 뷰]     < 5월 >  │  ← ViewToggleTabs + MonthNavigator
├────────────────────────────────────┤
│  일  월  화  수  목  금  토        │
│  ...  달력 그리드  ...             │  ← CalendarGrid
│  [날짜셀: 일정 최대 2개 + "+N"]    │  ← CalendarDayCell
└────────────────────────────────────┘
```

---

## 5. Component Plan

| Component | Purpose | Requirement Link |
|---|---|---|
| `AppHeader` | 앱 타이틀, 현재 날짜, 하루/월간 뷰 탭 전환 | FR-002, FR-003 |
| `DayNavigator` | 하루 뷰에서 이전/다음 날 이동 화살표 + 선택 날짜 표시 | FR-002 |
| `MonthNavigator` | 월간 뷰에서 이전/다음 월 이동 + 현재 월 표시 | FR-003 |
| `QuickAddBar` | 한 줄 입력창 + 추가 버튼 → Task Form Modal 트리거 | FR-001 |
| `TaskForm` | 제목·과목명·상세내용·마감일 입력 모달; 등록 및 수정 겸용 | FR-001, FR-008 |
| `FilterTabs` | 전체 / 미완료 / 완료 필터 탭 | FR-011 |
| `TaskList` | 필터 적용 후 TaskCard 목록 렌더링; 순서: 미완료 → 완료 | FR-002 |
| `TaskCard` | 체크박스 + 제목 + SubjectBadge + 마감일; 클릭 시 상세 모달 오픈 | FR-002, FR-005, FR-006 |
| `SubjectBadge` | 과목명 표시용 색상 배지 (과목별 색상 자동 지정) | FR-001, FR-004 |
| `TaskDetailModal` | 클릭한 항목의 전체 정보 표시; 수정·삭제 액션 포함 | FR-006, FR-008 |
| `CalendarGrid` | 7×N 달력 그리드 컨테이너 | FR-003 |
| `CalendarDayCell` | 날짜 + 해당 날 일정 최대 2개 미리보기; 클릭 시 해당 날 하루 뷰 이동 | FR-003, FR-009 |
| `EmptyState` | 할 일 없을 때 안내 문구 + 추가 유도 버튼 | FR-002 |
| `DeadlineChip` | 마감 D-day 또는 날짜 표시 칩; 오늘·내일은 강조 색상 | FR-004 |

---

## 6. Interaction Rules

**할 일 등록**
- QuickAddBar에서 제목만 입력하고 추가 버튼을 누르면 Task Form Modal이 열리고 입력한 제목이 채워진다.
- 제목(필수값)이 비어 있으면 추가 버튼을 눌러도 모달이 열리지 않고 입력창에 오류 표시가 된다.
- 등록 완료 후 입력창은 초기화되고 모달은 닫히며 새 항목이 목록 상단에 나타난다.

**과제 자동 반영**
- 마감일이 지정된 항목은 오늘부터 마감 당일까지 매일 하루 뷰에 자동 표시된다.
- 자동 반영 항목은 "[과목명] 과제" 형태로 SubjectBadge와 함께 표시된다.

**완료 체크**
- 체크박스를 클릭하면 완료 상태로 즉시 전환되고 항목에 취소선이 생긴다.
- 완료 상태에서 다시 클릭하면 미완료로 되돌아간다.
- 상태 변경은 localStorage에 즉시 반영된다.

**상세 모달**
- TaskCard 제목 영역 클릭 시 TaskDetailModal이 오버레이로 표시된다.
- 체크박스 클릭은 모달을 열지 않고 상태만 변경한다.
- 모달 외부 클릭 또는 ESC 키로 닫힌다.

**필터**
- 필터 탭 변경 시 목록이 애니메이션 없이 즉시 전환된다.
- 현재 선택된 필터는 Action Blue 밑줄로 표시된다.

**월간 달력**
- 날짜 셀 클릭 시 해당 날짜의 하루 뷰로 탭이 전환된다.
- 일정이 3개 이상이면 셀에 2개만 표시하고 "+N" 텍스트로 나머지 개수를 알린다.

---

## 7. Accessibility Rules

- 모든 입력 필드(`<input>`, `<textarea>`)에는 연결된 `<label>` 또는 `aria-label`이 있어야 한다.
- 버튼 텍스트는 기능을 직접 설명해야 한다 (예: "추가", "삭제", "완료로 변경").
- 체크박스는 `aria-checked` 상태를 명시하여 색상 외의 수단으로도 완료 여부를 전달한다.
- 색상만으로 상태를 구분하지 않는다 — 완료 항목은 취소선 + 색상 변경을 함께 사용한다.
- 주요 영역(`<header>`, `<main>`, 모달 `<dialog>`)은 heading 구조(`h1`, `h2`)를 가진다.
- 모달은 포커스 트랩을 구현하여 키보드 사용자가 모달 안에서만 탐색하도록 한다.
- 달력의 각 날짜 셀은 `aria-label="2026년 5월 27일, 할 일 2개"` 형식으로 스크린리더에 정보를 제공한다.

---

## 8. Visual Style Notes (DESIGN.md 적용)

| Element | Token / Value |
|---|---|
| Primary action color | `{colors.primary}` — #0066cc (Action Blue) |
| Page background | `{colors.canvas}` — #ffffff / `{colors.canvas-parchment}` — #f5f5f7 교차 |
| Body text | `{colors.ink}` — #1d1d1f |
| Headline font | SF Pro Display 600 (fallback: Inter 600) / negative letter-spacing |
| Body font | SF Pro Text 400 17px / line-height 1.47 |
| Primary CTA button | `{rounded.pill}` — pill shape, Action Blue fill |
| Card border radius | `{rounded.lg}` — 18px (TaskCard), `{rounded.md}` — 11px (SubjectBadge) |
| Shadow | 오직 제품 이미지에만 사용 — 카드·버튼에 shadow 없음 |
| Active press state | `transform: scale(0.95)` — 모든 버튼 공통 micro-interaction |
