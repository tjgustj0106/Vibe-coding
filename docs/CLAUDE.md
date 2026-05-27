# CLAUDE.md

# Project

StudyLog — 대학생을 위한 스터디 플래너 MVP.  
Vibe Coding class Micro SaaS 프로젝트.

# Product Idea

This app helps **대학생** solve **수업·과제·일정이 뒤섞여 관리하기 어려운 문제** by **하루 할 일 + 월간 달력 + 과제 마감 자동 반영이 통합된 스터디 플래너**.

# Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Claude Code
- GitHub

# Current Stage

Session 2: planning docs complete, Next.js scaffold 구현 중.

# Planning Documents

구현 전 반드시 아래 문서를 읽는다.

| File | Purpose |
|---|---|
| `01_Product_Brief.md` | 제품 목표, 대상 사용자, MVP 범위 |
| `02_REQUIREMENTS_SPEC.md` | Use Case, 기능 요구사항(FR), 인수 기준(AC) |
| `03_UX_UI_SPEC.md` | 화면 구조, 컴포넌트 목록, 인터랙션 규칙 |
| `04_TECHNICAL_DESIGN.md` | 타입, 폴더 구조, 상태 설계, 저장 전략 |
| `05_DELIVERY_PLAN.md` | 회차별 구현 범위, Must/Should/Not Today |
| `DESIGN.md` | Apple-inspired 디자인 시스템 (색상, 타이포, 컴포넌트) |

# Source Structure

```
src/
  app/
    page.tsx              ← Landing Page (/)
    app/
      page.tsx            ← Main App Page (/app)
  components/
    ui/                   ← Button, Input, Card, Badge, Modal
    layout/               ← AppHeader
  features/
    tasks/
      types.ts            ← Task, TaskStatus 타입
      mock-data.ts
      storage.ts          ← localStorage 헬퍼
      utils.ts            ← 날짜 계산, auto-reflect 로직
      components/         ← TaskCard, TaskForm (상세/수정 겸용), FilterTabs 등
```

# Data Model

```ts
export type TaskStatus = "todo" | "done";

export type Task = {
  id: string;
  title: string;          // 필수
  detail?: string;        // 상세 내용 (모달 표시)
  subject?: string;       // 과목명 (SubjectBadge, 자동 반영 레이블)
  dueDate?: string;       // 마감일 ISO date — 자동 반영 기준
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};
```

# Working Rules

- 구현 전 관련 planning 문서를 읽는다.
- 파일을 수정하기 전 계획을 먼저 제안한다.
- 변경은 작게 유지한다.
- 불필요한 의존성을 추가하지 않는다.
- 프로젝트 방향이 바뀌면 planning 문서와 CLAUDE.md를 함께 업데이트한다.
- 커밋 전 변경된 파일을 요약한다.
- 05_DELIVERY_PLAN.md의 Must / Should / Not Today 기준을 벗어나지 않는다.

# Boundaries

Do not add:

- 로그인 / 회원가입
- 결제
- 실시간 협업
- 대용량 파일 업로드
- 다중 외부 API 연동 (Google Calendar 등)
- 알림 / 푸시 기능
- 모바일 앱 (웹 우선)
- always-on-top / Electron (웹 앱으로 구현 불가 — MVP 제외 결정)
- 과목명 필터 (FR-012 제외 — 완료/미완료 필터로 충분)

# References

- UI: `DESIGN.md` — Action Blue #0066cc, pill CTA, parchment 배경, Inter/SF Pro
- 구조: `04_TECHNICAL_DESIGN.md` — 폴더 구조, 타입, 상태 설계
- 요구사항: `02_REQUIREMENTS_SPEC.md` — FR-001~FR-009, FR-011 (FR-010·FR-012 제외됨)
