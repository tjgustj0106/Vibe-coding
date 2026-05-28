## ADDED Requirements

### Requirement: 사용자는 시간 기반 일정 이벤트를 등록할 수 있다
시스템은 제목·날짜·시작시간·종료시간을 입력받아 ScheduleEvent를 생성하고 localStorage에 저장해야 한다.

#### Scenario: 이벤트 등록 성공
- **WHEN** 사용자가 제목·시작시간·종료시간을 입력하고 저장하면
- **THEN** 새 이벤트가 타임라인에 표시되고 localStorage에 저장된다

#### Scenario: 제목 없이 저장 시도
- **WHEN** 사용자가 제목을 입력하지 않고 저장하면
- **THEN** 저장되지 않고 오류 메시지가 표시된다

#### Scenario: 종료시간이 시작시간보다 빠를 때
- **WHEN** 사용자가 종료시간을 시작시간보다 이른 시간으로 입력하면
- **THEN** 저장되지 않고 오류 메시지가 표시된다
