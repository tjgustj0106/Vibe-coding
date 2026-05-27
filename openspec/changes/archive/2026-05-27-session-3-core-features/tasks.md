## 1. utils.ts 작성

- [x] 1.1 `src/features/tasks/utils.ts` 파일 생성
- [x] 1.2 `getTodayString()` 함수 구현 (YYYY-MM-DD 반환)
- [x] 1.3 `getTasksForDate(tasks, selectedDate)` 함수 구현 — auto-reflect 로직 포함
- [x] 1.4 완료된 auto-reflect 항목 당일만 표시 조건 적용 (updatedAt 비교)

## 2. localStorage 연동

- [x] 2.1 `src/app/app/page.tsx` — useState 초기값을 getTasks() 기반으로 변경
- [x] 2.2 tasks 변경 시 saveTasks 호출 (useEffect)
- [x] 2.3 mockTasks는 localStorage가 비어있을 때만 fallback으로 사용

## 3. TaskForm 실제 구현

- [x] 3.1 `TaskForm` props에 `mode: "create" | "edit" | "detail"`, `task?: Task` 추가
- [x] 3.2 create 모드: 제목·과목명·상세내용·마감일 입력 필드 구현
- [x] 3.3 제목 필수 검증 — 빈 값이면 오류 메시지 표시, 저장 막기
- [x] 3.4 저장 시 `onSubmit` 콜백 호출, 모달 닫기
- [x] 3.5 detail 모드: 필드를 읽기 전용으로 표시, 수정·삭제 버튼 제공
- [x] 3.6 edit 모드: 기존 값으로 필드 채우기, 저장 시 수정 반영
- [x] 3.7 삭제 버튼 클릭 시 `onDelete` 콜백 호출

## 4. App Page 상태 관리 완성

- [x] 4.1 `handleAdd(input)` — 새 Task 생성 후 tasks 배열에 추가
- [x] 4.2 `handleUpdate(updated)` — 기존 Task 수정
- [x] 4.3 `handleDelete(id)` — Task 삭제
- [x] 4.4 `handleToggle(id)` — 완료 상태 전환 (이미 있음, localStorage 연동 확인)
- [x] 4.5 `modalTask` 상태 추가 — TaskCard 클릭 시 detail 모달 오픈
- [x] 4.6 하루 뷰 표시 tasks를 `getTasksForDate` 기반으로 계산 (useMemo)

## 5. TaskCard 연결

- [x] 5.1 제목 클릭 시 `onClickDetail(task)` 호출 확인
- [x] 5.2 체크박스 클릭이 모달을 열지 않도록 이벤트 분리 확인

## 6. FilterTabs 동작 확인

- [x] 6.1 TaskList의 filter prop이 실제로 목록을 필터링하는지 확인
- [x] 6.2 필터 결과가 없을 때 EmptyState 표시 확인

## 7. 검증

- [x] 7.1 `npm run build` 오류 없음 확인
- [x] 7.2 Task 등록 → 목록 표시 → 완료 체크 → 새로고침 후 상태 유지 확인
- [x] 7.3 마감일 있는 Task 등록 후 해당 날짜 범위 하루 뷰에서 auto-reflect 확인
- [x] 7.4 완료 후 다음 날 하루 뷰에서 숨김 확인
- [x] 7.5 상세 모달 열기 → 수정 → 저장 흐름 확인
- [x] 7.6 삭제 후 목록에서 제거 확인
