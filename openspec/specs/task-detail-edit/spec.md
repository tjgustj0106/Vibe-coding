## ADDED Requirements

### Requirement: 사용자는 Task 상세 내용을 확인하고 수정·삭제할 수 있다
시스템은 Task 제목 클릭 시 상세 모달을 열고, 수정 및 삭제 기능을 제공해야 한다. TaskForm을 detail/edit 모드로 재사용한다.

#### Scenario: Task 제목 클릭 시 상세 모달 열림
- **WHEN** 사용자가 TaskCard의 제목 영역을 클릭하면
- **THEN** TaskForm이 detail 모드로 열리고 제목·과목명·상세내용·마감일이 표시된다

#### Scenario: 수정 모드 전환
- **WHEN** 사용자가 상세 모달에서 수정 버튼을 클릭하면
- **THEN** TaskForm이 edit 모드로 전환되어 필드를 편집할 수 있다

#### Scenario: 수정 저장
- **WHEN** 사용자가 내용을 변경하고 저장 버튼을 클릭하면
- **THEN** Task가 업데이트되고 모달이 닫히며 목록에 변경 내용이 반영된다

#### Scenario: 수정 취소
- **WHEN** 사용자가 수정 중 취소 버튼을 클릭하면
- **THEN** 변경 내용이 저장되지 않고 모달이 닫힌다

#### Scenario: Task 삭제
- **WHEN** 사용자가 상세 모달에서 삭제 버튼을 클릭하면
- **THEN** Task가 목록에서 제거되고 localStorage에서도 삭제되며 모달이 닫힌다

#### Scenario: 모달 외부 클릭으로 닫기
- **WHEN** 사용자가 모달 외부 영역을 클릭하면
- **THEN** 모달이 닫힌다
