## ADDED Requirements

### Requirement: 사용자는 이벤트를 수정하거나 삭제할 수 있다
시스템은 이벤트 블록 클릭 시 수정·삭제 모달을 열어야 한다.

#### Scenario: 이벤트 클릭 시 모달 열림
- **WHEN** 사용자가 타임라인의 이벤트 블록을 클릭하면
- **THEN** ScheduleEventForm이 해당 이벤트의 정보로 채워진 상태로 열린다

#### Scenario: 이벤트 수정 저장
- **WHEN** 사용자가 내용을 변경하고 저장하면
- **THEN** 타임라인이 변경된 내용으로 갱신되고 localStorage에 저장된다

#### Scenario: 이벤트 삭제
- **WHEN** 사용자가 삭제 버튼을 클릭하면
- **THEN** 이벤트가 타임라인에서 제거되고 localStorage에서도 삭제된다
