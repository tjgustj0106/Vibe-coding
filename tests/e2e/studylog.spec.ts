import { test, expect } from "@playwright/test";

/**
 * 각 테스트 전 처리:
 * - /app에 먼저 접속해 같은 origin 확보
 * - localStorage를 "[]"로 초기화 → 신규 사용자 모드 방지 + 빈 상태 보장
 * - 페이지 reload로 React state 재초기화
 */
test.beforeEach(async ({ page }) => {
  await page.goto("/app");
  await page.evaluate(() => {
    localStorage.setItem("studylog_tasks", JSON.stringify([]));
    localStorage.setItem("studylog_events", JSON.stringify([]));
  });
  await page.reload();
});

// ---------------------------------------------------------------------------
// AC-001: 할 일 등록
// Given 사용자가 제목을 입력했을 때
// When  추가 버튼을 누르면
// Then  새 항목이 하루 뷰 목록에 표시된다
// ---------------------------------------------------------------------------
test("AC-001: 할 일 등록 후 목록에 표시된다", async ({ page }) => {
  // + 추가 버튼 클릭 (AppPage 헤더)
  await page.getByRole("button", { name: "+ 추가" }).click();

  // 제목 입력 (label "제목 *" → htmlFor="task-title")
  await page.locator("#task-title").fill("테스트 할 일");

  // 저장 버튼 클릭
  await page.getByRole("button", { name: "저장" }).click();

  // 목록에 나타남
  await expect(page.getByText("테스트 할 일")).toBeVisible();
});

// ---------------------------------------------------------------------------
// AC-002: 과제 자동 반영
// Given 사용자가 마감일을 포함한 항목을 등록했을 때
// When  오늘 날짜의 하루 뷰를 보면
// Then  해당 항목이 목록에 자동 표시된다
// ---------------------------------------------------------------------------
test("AC-002: 마감일 지정 항목이 오늘 하루 뷰에 자동 노출된다", async ({ page }) => {
  // 마감일을 오늘 + 3일로 설정
  const due = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  await page.getByRole("button", { name: "+ 추가" }).click();
  await page.locator("#task-title").fill("선형대수 과제");
  await page.locator("#task-subject").fill("선형대수");
  await page.locator("#task-due").fill(due);
  await page.getByRole("button", { name: "저장" }).click();

  // 오늘 뷰에 표시됨 (dueDate가 오늘 이후 → 자동 반영)
  await expect(page.getByText("선형대수 과제")).toBeVisible();
});

// ---------------------------------------------------------------------------
// AC-003: 완료 체크
// Given 하루 뷰에 미완료 항목이 있을 때
// When  체크 버튼을 클릭하면
// Then  항목이 완료 상태로 변경되고, 새로고침 후에도 유지된다
// ---------------------------------------------------------------------------
test("AC-003: 체크 버튼 클릭 시 완료 상태 변경 및 localStorage 저장", async ({ page }) => {
  // 할 일 추가
  await page.getByRole("button", { name: "+ 추가" }).click();
  await page.locator("#task-title").fill("완료 테스트 할 일");
  await page.getByRole("button", { name: "저장" }).click();

  // "완료로 변경" aria-label 버튼 클릭 (TaskCard 체크 버튼)
  await page.getByRole("button", { name: "완료로 변경" }).click();

  // 새로고침 후에도 유지
  await page.reload();

  // 완료 탭으로 전환해 확인
  await page.getByRole("tab", { name: "완료", exact: true }).click();
  await expect(page.getByText("완료 테스트 할 일")).toBeVisible();
});

// ---------------------------------------------------------------------------
// AC-004: 상세 내용 확인
// Given 하루 뷰에 항목이 있을 때
// When  항목 제목을 클릭하면
// Then  상세 내용 모달이 열리고 제목·과목명·상세내용이 표시된다
// ---------------------------------------------------------------------------
test("AC-004: 항목 클릭 시 상세 모달이 열린다", async ({ page }) => {
  await page.getByRole("button", { name: "+ 추가" }).click();
  await page.locator("#task-title").fill("모달 테스트 과제");
  await page.locator("#task-subject").fill("알고리즘");
  await page.locator("#task-detail").fill("3장 연습문제 풀기");
  await page.getByRole("button", { name: "저장" }).click();

  // TaskCard 상세 버튼 클릭 (aria-label: "모달 테스트 과제 상세 보기")
  await page.getByRole("button", { name: "모달 테스트 과제 상세 보기" }).click();

  // 모달에 내용 표시 확인
  await expect(page.getByRole("heading", { name: "상세 보기" })).toBeVisible();
  await expect(page.locator("#task-title")).toHaveValue("모달 테스트 과제");
  await expect(page.locator("#task-subject")).toHaveValue("알고리즘");
  await expect(page.locator("#task-detail")).toHaveValue("3장 연습문제 풀기");
});

// ---------------------------------------------------------------------------
// AC-005: 월간 달력 조회
// Given 마감일이 있는 항목이 등록되어 있을 때
// When  사용자가 월간 뷰를 열면
// Then  마감일에 해당 항목이 달력에 표시된다
// ---------------------------------------------------------------------------
test("AC-005: 월간 달력에서 오늘 마감 항목이 표시된다", async ({ page }) => {
  const today = new Date().toISOString().slice(0, 10);

  await page.getByRole("button", { name: "+ 추가" }).click();
  await page.locator("#task-title").fill("달력 표시 과제");
  await page.locator("#task-due").fill(today);
  await page.getByRole("button", { name: "저장" }).click();

  // 월간 뷰로 전환
  await page.getByRole("button", { name: "월간 뷰" }).click();

  // 오늘 날짜 셀에 항목 미리보기가 표시됨
  // CalendarDayCell: aria-label="${date}, 할 일 N개"
  const todayCell = page.getByRole("button", { name: new RegExp(`${today}`) });
  await expect(todayCell).toBeVisible();
  // 셀 내부에 "달력 표시" 텍스트 표시 (truncate로 일부 잘릴 수 있음)
  await expect(todayCell).toContainText("달력 표시");
});

// ---------------------------------------------------------------------------
// AC-006: 필터
// Given 완료·미완료 항목이 섞여 있을 때
// When  완료 탭을 선택하면
// Then  완료된 항목만 표시된다
// ---------------------------------------------------------------------------
test("AC-006: 완료 필터 선택 시 완료 항목만 표시된다", async ({ page }) => {
  // 할 일 2개 추가
  for (const title of ["미완료 할 일", "완료할 할 일"]) {
    await page.getByRole("button", { name: "+ 추가" }).click();
    await page.locator("#task-title").fill(title);
    await page.getByRole("button", { name: "저장" }).click();
  }

  // "완료할 할 일"은 마지막에 추가되어 리스트 맨 위(index 0)에 위치
  await page.getByRole("button", { name: "완료로 변경" }).nth(0).click();

  // 완료 탭 클릭
  await page.getByRole("tab", { name: "완료", exact: true }).click();

  await expect(page.getByText("완료할 할 일")).toBeVisible();
  await expect(page.getByText("미완료 할 일")).not.toBeVisible();
});
