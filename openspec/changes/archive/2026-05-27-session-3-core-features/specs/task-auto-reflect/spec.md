## ADDED Requirements

### Requirement: 마감일 있는 Task는 하루 뷰에 자동 반영된다
시스템은 dueDate가 지정된 Task를 오늘부터 마감 당일까지 매일 하루 뷰 목록에 자동으로 표시해야 한다.

#### Scenario: 마감일 이전 날짜에서 auto-reflect 표시
- **WHEN** 사용자가 오늘~마감일 사이 날짜의 하루 뷰를 열면
- **THEN** dueDate가 해당 범위 안에 있는 미완료 Task가 목록에 표시된다

#### Scenario: 마감일 이후 날짜에서 숨김
- **WHEN** 사용자가 마감일 이후 날짜의 하루 뷰를 열면
- **THEN** 해당 Task는 목록에 표시되지 않는다

#### Scenario: 완료된 Task는 완료 당일에만 표시
- **WHEN** 사용자가 Task를 완료 처리한 날의 하루 뷰를 열면
- **THEN** 완료된 Task가 표시된다 (취소선 적용)

#### Scenario: 완료된 Task는 다음 날부터 숨김
- **WHEN** 사용자가 Task를 완료 처리한 다음 날 이후의 하루 뷰를 열면
- **THEN** 완료된 Task는 더 이상 표시되지 않는다
