## ADDED Requirements

### Requirement: 사용자는 할 일을 생성할 수 있다
시스템은 제목(필수)·과목명(선택)·상세내용(선택)·마감일(선택)을 입력받아 새 Task를 생성하고 localStorage에 저장해야 한다.

#### Scenario: 제목만 입력하고 저장
- **WHEN** 사용자가 제목만 입력하고 추가 버튼을 누르면
- **THEN** 새 Task가 목록에 추가되고 TaskForm 모달이 닫힌다

#### Scenario: 모든 필드 입력하고 저장
- **WHEN** 사용자가 제목·과목명·상세내용·마감일을 모두 입력하고 저장하면
- **THEN** 해당 필드가 모두 포함된 Task가 생성되고 목록에 추가된다

#### Scenario: 제목 없이 저장 시도
- **WHEN** 사용자가 제목을 입력하지 않고 추가 버튼을 누르면
- **THEN** 저장되지 않고 제목 입력 필드에 오류 메시지가 표시된다

#### Scenario: 저장 후 localStorage 반영
- **WHEN** 새 Task가 생성되면
- **THEN** localStorage의 "studylog_tasks" 키에 즉시 저장되어 새로고침 후에도 유지된다
