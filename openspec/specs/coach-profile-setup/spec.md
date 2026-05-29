## ADDED Requirements

### Requirement: User can set up a coach character profile
The system SHALL provide an onboarding screen on first app entry where the user can register a coach character with name, optional photo, nickname for the user, and personality description.

#### Scenario: First entry shows onboarding
- **WHEN** the user opens the app for the first time (no `studylog_coach` in localStorage)
- **THEN** the onboarding screen is displayed before the main planner

#### Scenario: User completes onboarding
- **WHEN** the user fills in character name and personality, then confirms
- **THEN** the profile is saved to `studylog_coach` in localStorage and the main planner is shown

#### Scenario: Onboarding can be skipped
- **WHEN** the user clicks "건너뛰기" (skip)
- **THEN** no coach profile is saved and the main planner is shown without coach features

#### Scenario: Photo upload is optional
- **WHEN** the user submits onboarding without uploading a photo
- **THEN** a default placeholder (emoji or color avatar) is used instead

#### Scenario: Photo size warning
- **WHEN** the user uploads a photo larger than 500 KB
- **THEN** the system displays a warning message and does not save the oversized photo

### Requirement: User can modify coach profile in settings
The system SHALL allow the user to update the coach profile from the app settings at any time.

#### Scenario: Access settings
- **WHEN** the user navigates to the settings/profile section
- **THEN** the current coach profile fields (name, photo, nickname, personality) are shown pre-filled

#### Scenario: Save updated profile
- **WHEN** the user edits fields and saves
- **THEN** the updated profile is persisted to `studylog_coach` localStorage and immediately reflected in coach UI elements
