## Why

2회차에서 Next.js 프로젝트 구조와 컴포넌트 placeholder를 완성했다. 3회차에서는 StudyLog의 핵심 가치인 "과제 마감일을 한 번 입력하면 마감일까지 매일 자동 반영"을 실제로 동작하게 만든다.

## What Changes

- **TaskForm** placeholder를 실제 입력 폼(제목·과목명·상세내용·마감일)으로 교체
- **TaskDetailModal** 추가 — 항목 클릭 시 상세 확인·수정·삭제 가능
- **utils.ts** 신규 작성 — auto-reflect 날짜 계산 로직
- **localStorage 연동** — 앱 로드 시 getTasks, 상태 변경 시 saveTasks 호출
- **auto-reflect 완료 규칙** 적용 — 완료된 항목은 완료 당일만 표시, 다음 날부터 숨김
- **FilterTabs** 실제 필터링 동작 연결
- **App Page** 상태 관리 완성 — Task 생성·수정·삭제·완료 체크 전체 흐름

## Capabilities

### New Capabilities

- `task-create`: 제목(필수)·과목명·상세내용·마감일 입력 후 localStorage에 저장
- `task-auto-reflect`: dueDate 있는 항목을 오늘~마감일 사이 하루 뷰에 자동 노출; 완료 시 당일만 표시
- `task-complete`: 체크박스로 완료 ↔ 미완료 즉시 전환, localStorage 동기화
- `task-detail-edit`: 항목 클릭 시 상세 모달 — 수정·삭제 가능, TaskForm 재사용
- `task-filter`: 전체·미완료·완료 탭이 실제 목록을 필터링

### Modified Capabilities

(없음 — 기존 spec 없음)

## Impact

- `src/features/tasks/components/TaskForm.tsx` — 전면 재작성
- `src/features/tasks/utils.ts` — 신규 파일
- `src/app/app/page.tsx` — 상태 관리 완성, localStorage 연동
- `src/features/tasks/components/TaskList.tsx` — 필터 로직 연결 확인
- `src/features/tasks/components/TaskCard.tsx` — onClickDetail 핸들러 연결
