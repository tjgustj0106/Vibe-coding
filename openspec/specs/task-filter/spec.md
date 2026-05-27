## ADDED Requirements

### Requirement: 사용자는 완료 상태로 Task를 필터링할 수 있다
시스템은 전체·미완료·완료 탭 선택에 따라 하루 뷰 목록을 즉시 필터링해야 한다.

#### Scenario: 전체 필터 선택
- **WHEN** 사용자가 "전체" 탭을 선택하면
- **THEN** 완료·미완료 모든 Task가 표시된다

#### Scenario: 미완료 필터 선택
- **WHEN** 사용자가 "미완료" 탭을 선택하면
- **THEN** status가 "todo"인 Task만 표시된다

#### Scenario: 완료 필터 선택
- **WHEN** 사용자가 "완료" 탭을 선택하면
- **THEN** status가 "done"인 Task만 표시된다

#### Scenario: 필터 상태에서 빈 결과
- **WHEN** 선택한 필터에 해당하는 Task가 없으면
- **THEN** EmptyState 컴포넌트가 표시된다
