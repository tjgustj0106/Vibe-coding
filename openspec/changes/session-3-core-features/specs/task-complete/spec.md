## ADDED Requirements

### Requirement: 사용자는 Task 완료 상태를 전환할 수 있다
시스템은 체크박스 클릭 시 Task의 status를 "todo" ↔ "done"으로 즉시 전환하고 localStorage에 저장해야 한다.

#### Scenario: 미완료 Task 체크
- **WHEN** 사용자가 미완료 Task의 체크박스를 클릭하면
- **THEN** Task가 완료 상태로 변경되고 제목에 취소선이 표시된다

#### Scenario: 완료 Task 체크 해제
- **WHEN** 사용자가 완료 Task의 체크박스를 다시 클릭하면
- **THEN** Task가 미완료 상태로 돌아오고 취소선이 사라진다

#### Scenario: 완료 체크 후 새로고침
- **WHEN** 사용자가 Task를 완료 처리하고 페이지를 새로고침하면
- **THEN** 완료 상태가 유지된다

#### Scenario: 체크박스 클릭은 상세 모달을 열지 않는다
- **WHEN** 사용자가 체크박스 영역을 클릭하면
- **THEN** 완료 상태만 변경되고 TaskForm 모달은 열리지 않는다
