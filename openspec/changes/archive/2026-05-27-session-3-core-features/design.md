## Context

2회차에서 Next.js 프로젝트 scaffold와 컴포넌트 placeholder가 완성됐다. `storage.ts`(getTasks/saveTasks), `types.ts`(Task/TaskStatus), 기본 컴포넌트(TaskCard, FilterTabs, EmptyState 등)가 존재하지만 실제 CRUD 로직과 localStorage 연동은 없다. `TaskForm`은 placeholder 상태이고 `utils.ts`는 존재하지 않는다.

## Goals / Non-Goals

**Goals:**
- Task 생성·완료·수정·삭제 전체 흐름 동작
- auto-reflect 로직 구현 (dueDate 기반, 렌더 시 계산)
- localStorage 연동 (앱 로드 → getTasks, 변경 → saveTasks)
- 완료된 auto-reflect 항목은 완료 당일만 표시
- FilterTabs 실제 필터링 동작

**Non-Goals:**
- 월간 CalendarGrid 구현 (3회차 시간 여유 시 고려)
- 서버 API / DB 연동
- 로그인 / 인증
- 알림 / 푸시

## Decisions

### 1. auto-reflect는 렌더 시 파생 계산

`useMemo`로 `selectedDate` 기준 표시할 tasks를 계산한다. storage에는 원본 Task만 저장.

```ts
// utils.ts
export function getTasksForDate(tasks: Task[], selectedDate: string): Task[] {
  const today = getTodayString();
  return tasks.filter((t) => {
    // 일반 할 일: createdAt 날짜에만 표시
    if (!t.dueDate) return t.createdAt.slice(0, 10) === selectedDate;
    // auto-reflect: 오늘 ~ dueDate 사이
    if (selectedDate < today || selectedDate > t.dueDate) return false;
    // 완료된 항목: 완료 당일(updatedAt)만 표시
    if (t.status === "done") return t.updatedAt.slice(0, 10) === selectedDate;
    return true;
  });
}
```

**대안 고려:** `completedDates: string[]` 필드를 Task에 추가 → 모델 복잡도 증가, 기각.

### 2. TaskForm이 생성·수정·상세 보기를 모두 담당

`mode: "create" | "edit" | "detail"` prop으로 구분한다. 별도 TaskDetailModal 파일을 만들지 않아 컴포넌트 수를 줄인다.

```ts
type TaskFormProps = {
  mode: "create" | "edit" | "detail";
  task?: Task;           // edit/detail 모드에서 초기값
  onSubmit?: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
};
```

### 3. localStorage 초기화 전략

앱 마운트 시 `getTasks()`를 호출하고 결과가 있으면 사용, 없으면 mockTasks로 초기화. 이후 모든 상태 변경 시 `saveTasks` 호출.

```ts
const [tasks, setTasks] = useState<Task[]>(() => {
  const saved = getTasks();
  return saved.length > 0 ? saved : mockTasks;
});
useEffect(() => { saveTasks(tasks); }, [tasks]);
```

### 4. Task ID 생성

`crypto.randomUUID()`를 사용한다. SSR 환경에서 안전하고 충돌 가능성이 없다.

## Risks / Trade-offs

- **auto-reflect 날짜 비교**: `selectedDate < today` 조건이 과거 날짜 탐색 시 auto-reflect 항목을 숨긴다. 의도된 동작이지만 "과거 날짜에서 과제를 봐야 할 때" 불편할 수 있음 → MVP 범위에서는 허용.
- **TaskForm 3-in-1**: mode가 늘어날수록 복잡해질 수 있음 → 3회차는 3가지로 충분, 4회차 이후 분리 고려.
- **mockTasks 초기화**: localStorage가 비어있을 때만 mockTasks를 쓰므로 사용자 데이터와 충돌 없음.
