## Why

현재 하루 뷰는 체크리스트(할 일) 중심이라 "몇 시에 뭘 한다"는 시간 기반 일정을 표현할 수 없다. 대학생은 강의·스터디·과외 등 시작~종료 시간이 정해진 일정도 함께 관리해야 하므로, 하루 뷰에 00:00~24:00 타임라인을 추가해 일정을 시각적으로 배치할 수 있게 한다.

## What Changes

- **새 데이터 타입** `ScheduleEvent` 추가 — 제목·날짜·시작시간·종료시간
- **ScheduleTimeline 컴포넌트** 신규 — 24시간 세로 타임라인, 이벤트 블록 표시
- **ScheduleEventForm 모달** 신규 — 이벤트 등록·수정·삭제
- **하루 뷰 레이아웃** 변경 — 기존 할 일 목록 위에 타임라인 섹션 추가
- **localStorage** — `studylog_events` 키로 이벤트 별도 저장

## Capabilities

### New Capabilities

- `schedule-event-create`: 제목·날짜·시작시간·종료시간으로 일정 이벤트 등록
- `schedule-timeline-view`: 하루 뷰에서 24시간 세로 타임라인으로 당일 이벤트 표시
- `schedule-event-edit`: 이벤트 클릭 시 수정·삭제 가능

### Modified Capabilities

(없음)

## Impact

- `src/features/schedule/types.ts` — 신규 (ScheduleEvent 타입)
- `src/features/schedule/storage.ts` — 신규 (getEvents/saveEvents)
- `src/features/schedule/components/ScheduleTimeline.tsx` — 신규
- `src/features/schedule/components/ScheduleEventForm.tsx` — 신규
- `src/app/app/page.tsx` — 하루 뷰에 ScheduleTimeline 추가
