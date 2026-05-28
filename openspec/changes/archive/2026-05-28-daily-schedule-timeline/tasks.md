## 1. 타입 및 스토리지

- [x] 1.1 `src/features/schedule/types.ts` 생성 — ScheduleEvent 타입 정의
- [x] 1.2 `src/features/schedule/storage.ts` 생성 — getEvents / saveEvents / clearEvents

## 2. ScheduleEventForm 모달

- [x] 2.1 `src/features/schedule/components/ScheduleEventForm.tsx` 생성
- [x] 2.2 제목·시작시간·종료시간 입력 필드 구현 (create / edit 모드)
- [x] 2.3 제목 필수 검증, 종료시간 > 시작시간 검증
- [x] 2.4 저장 시 onSubmit 콜백 호출, 삭제 시 onDelete 콜백 호출

## 3. ScheduleTimeline 컴포넌트

- [x] 3.1 `src/features/schedule/components/ScheduleTimeline.tsx` 생성
- [x] 3.2 00:00~24:00 세로 눈금 렌더링 (1시간 단위)
- [x] 3.3 이벤트 블록 위치·높이 계산 (timeToMinutes 기반)
- [x] 3.4 이벤트 블록 클릭 시 edit 모달 오픈
- [x] 3.5 "+ 일정 추가" 버튼 표시 (빈 상태 포함)
- [x] 3.6 타임라인 고정 높이(600px) + 스크롤 처리

## 4. App Page 연결

- [x] 4.1 `src/app/app/page.tsx` — events 상태 추가 (getEvents 초기값, saveEvents useEffect)
- [x] 4.2 handleAddEvent / handleUpdateEvent / handleDeleteEvent 구현
- [x] 4.3 하루 뷰에 ScheduleTimeline 섹션 추가 (TaskList 위)
- [x] 4.4 selectedDate 기준으로 당일 이벤트 필터링해서 ScheduleTimeline에 전달

## 5. 검증

- [x] 5.1 `npm run build` 오류 없음 확인
- [x] 5.2 이벤트 등록 → 타임라인 표시 확인
- [x] 5.3 이벤트 클릭 → 수정·삭제 확인
- [x] 5.4 날짜 이동 시 해당 날짜 이벤트만 표시 확인
- [x] 5.5 새로고침 후 이벤트 유지 확인
