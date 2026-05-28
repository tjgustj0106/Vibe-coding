## Context

기존 하루 뷰는 TaskList(체크리스트)만 있다. 새로 추가할 타임라인은 Task와 별개의 데이터 타입으로 관리하며, 같은 하루 뷰 화면에 함께 표시된다. Task는 기한 기반(dueDate), 이벤트는 시간 기반(startTime~endTime).

## Goals / Non-Goals

**Goals:**
- 하루 뷰에 24시간 세로 타임라인 추가
- 이벤트 등록 (제목·날짜·시작시간·종료시간)
- 이벤트 클릭 시 수정·삭제
- localStorage에 이벤트 저장 (`studylog_events` 키)

**Non-Goals:**
- 반복 이벤트 (매주 월요일 등)
- 구글 캘린더 연동
- 이벤트 간 겹침 처리 (단순 블록으로 표시)
- 알림/푸시

## Decisions

### 1. 데이터 모델

```ts
export type ScheduleEvent = {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD — 어느 날의 일정인지
  startTime: string;  // "HH:MM" 24시간제
  endTime: string;    // "HH:MM" 24시간제
  createdAt: string;
  updatedAt: string;
};
```

Task와 별도 타입으로 분리 — 서로 성격이 달라 합치면 복잡도 증가.

### 2. 타임라인 UI

- 24시간을 세로로 표시, 1시간 단위 눈금
- 각 이벤트는 startTime~endTime 비율로 높이 계산
- 최소 높이 40px (짧은 이벤트도 제목 표시 가능)
- Action Blue 배경으로 표시

```
00:00 │
01:00 │
...   │
09:00 │ ┌────────────────┐
      │ │ 선형대수 강의   │
10:30 │ └────────────────┘
...   │
14:00 │ ┌────────────────┐
      │ │ 알고리즘 수업   │
15:30 │ └────────────────┘
```

### 3. 레이아웃 — 할 일 목록과 분리

하루 뷰를 두 섹션으로 나눈다:

```
┌────────────────────────────┐
│  📅 오늘 일정               │ ← ScheduleTimeline (접기/펼치기)
│  [타임라인]                 │
├────────────────────────────┤
│  ✅ 할 일                   │ ← 기존 TaskList
│  [체크리스트]               │
└────────────────────────────┘
```

### 4. 시간 계산

```ts
// 분 단위로 변환해서 위치/높이 계산
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
// top = (startMinutes / 1440) * 100%
// height = ((endMinutes - startMinutes) / 1440) * 100%
```

### 5. localStorage 분리

```ts
const EVENTS_KEY = "studylog_events";
export function getEvents(): ScheduleEvent[] { ... }
export function saveEvents(events: ScheduleEvent[]): void { ... }
```

Task와 별도 키 사용 — 기존 데이터와 충돌 없음.

## Risks / Trade-offs

- **이벤트 겹침**: 같은 시간대에 이벤트가 여러 개면 겹쳐 보임 → MVP에서는 순서대로 쌓기 허용
- **타임라인 높이**: 24시간 전체 표시 시 너무 길어질 수 있음 → 고정 높이(600px) + 스크롤로 처리
