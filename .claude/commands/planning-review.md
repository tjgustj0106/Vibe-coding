# /planning-review

StudyLog 프로젝트의 기획 문서와 구현 상태를 종합 검토하고 100점 만점으로 평가한다.

## 실행 절차

다음 순서로 파일을 읽는다:

1. `planning/md-design/01_Product_Brief.md`
2. `planning/md-design/02_REQUIREMENTS_SPEC.md`
3. `planning/md-design/03_UX_UI_SPEC.md`
4. `planning/md-design/04_TECHNICAL_DESIGN.md`
5. `planning/md-design/05_DELIVERY_PLAN.md`
6. `src/features/tasks/types.ts`
7. `src/features/tasks/` 내 컴포넌트 파일 목록

## 평가 영역 (각 25점)

### A. 문서 완성도 (25점)
- 5개 문서가 모두 존재하는가?
- FR 번호(FR-001~FR-009, FR-011)가 빠짐없이 정의되어 있는가?
- AC(인수 기준)가 FR과 1:1로 연결되어 있는가?
- 제외된 기능(FR-010, FR-012)이 명확히 표기되어 있는가?

### B. FR ↔ 컴포넌트 정합성 (25점)
- 03_UX_UI_SPEC의 컴포넌트 목록이 `src/features/tasks/components/`에 실제로 존재하는가?
- TaskForm이 생성/수정/상세 보기를 모두 담당하도록 설계되었는가?
- SubjectBadge, DeadlineChip, FilterTabs, EmptyState가 각각 파일로 존재하는가?

### C. 구현 가능성 (25점)
- 04_TECHNICAL_DESIGN의 Source Structure와 실제 파일 구조가 일치하는가?
- Data Model(`Task` 타입)이 types.ts에 정확히 구현되어 있는가?
- Session 2 Not Today 항목(실제 CRUD, auto-reflect, DB 등)이 구현되지 않았는가?

### D. 코드 ↔ 문서 정합성 (25점)
- `src/app/app/page.tsx`의 상태 설계가 04_TECHNICAL_DESIGN의 State Design과 일치하는가?
- `storage.ts`의 함수 이름(getTasks/saveTasks)이 문서와 일치하는가?
- CLAUDE.md의 Boundaries 항목이 실제 코드에서 지켜지고 있는가?

## 출력 형식

총점: __/100  
각 항목 ✅/⚠️/❌ 표기, 불일치 시 파일 경로 포함.  
🟢 80+ 3회차 시작 가능 / 🟡 60~79 수정 후 진행 / 🔴 60 미만 정비 필요
