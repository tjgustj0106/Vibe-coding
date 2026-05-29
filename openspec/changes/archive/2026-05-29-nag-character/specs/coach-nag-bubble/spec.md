## ADDED Requirements

### Requirement: Coach displays deadline nag bubble in daily view
The system SHALL show a coach avatar and dialogue bubble at the top of the daily view when there is at least one incomplete task with a deadline within 3 days (D-3 or less).

#### Scenario: Nag bubble appears for D-3 task
- **WHEN** the daily view is loaded and there is an incomplete task with `dueDate` equal to today+3 or earlier
- **THEN** the coach avatar and a nag dialogue bubble are displayed at the top of the daily view

#### Scenario: Nag bubble is hidden when no urgent tasks
- **WHEN** all incomplete tasks have `dueDate` more than 3 days away or there are no incomplete tasks
- **THEN** the coach nag bubble is not displayed

#### Scenario: Dialogue reflects deadline urgency
- **WHEN** the nag bubble is shown
- **THEN** the dialogue text references the most urgent task title and the correct days-remaining count (D-3, D-2, D-1, D-day)

#### Scenario: Dialogue reflects coach personality
- **WHEN** the nag bubble is shown
- **THEN** the dialogue tone and wording match the personality the user set during onboarding (via OpenRouter API or preset fallback)

#### Scenario: Overdue task nag
- **WHEN** an incomplete task has a `dueDate` in the past
- **THEN** the nag bubble is shown with an overdue-specific dialogue line

#### Scenario: No coach profile set
- **WHEN** no coach profile exists (onboarding was skipped)
- **THEN** the nag bubble is not displayed
