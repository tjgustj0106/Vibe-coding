## ADDED Requirements

### Requirement: Coach shows weekly progress comment at bottom of daily view
The system SHALL display a coach weekly progress comment at the bottom of the daily view when the current week's task completion rate is ≥80% or ≤30%.

#### Scenario: Positive comment for high completion rate
- **WHEN** the weekly task completion rate (Mon–Sun) is 80% or above
- **THEN** a positive coach comment is shown at the bottom of the daily view

#### Scenario: Negative comment for low completion rate
- **WHEN** the weekly task completion rate (Mon–Sun) is 30% or below
- **THEN** a motivating/negative coach comment is shown at the bottom of the daily view

#### Scenario: No comment for mid-range completion rate
- **WHEN** the weekly task completion rate is between 31% and 79% (inclusive)
- **THEN** no weekly comment is shown

#### Scenario: Comment reflects coach personality
- **WHEN** a weekly comment is displayed
- **THEN** the wording matches the user's coach personality setting

#### Scenario: No comment without coach profile
- **WHEN** no coach profile is set
- **THEN** no weekly comment is displayed
