## ADDED Requirements

### Requirement: Coach shows praise popup when a task is completed
The system SHALL display a temporary coach avatar and praise dialogue for 2 seconds when the user marks a task as complete.

#### Scenario: Praise popup appears on task completion
- **WHEN** the user clicks the complete button on a task
- **THEN** the coach avatar and a praise dialogue bubble appear as an overlay

#### Scenario: Praise popup auto-dismisses
- **WHEN** the praise popup is shown
- **THEN** it automatically disappears after 2 seconds without user interaction

#### Scenario: Praise popup cooldown
- **WHEN** the user has already completed 3 or more tasks in the current session
- **THEN** subsequent task completions do NOT show the praise popup (to avoid fatigue)

#### Scenario: No popup without coach profile
- **WHEN** no coach profile is set
- **THEN** completing a task does not show any praise popup
