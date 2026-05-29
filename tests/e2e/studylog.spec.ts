import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("studylog_tasks");
    localStorage.removeItem("studylog_events");
    localStorage.removeItem("studylog_coach");
  });
}

async function skipOnboarding(page: Page) {
  const skipBtn = page.getByText("건너뛰기");
  if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skipBtn.click();
  }
}

// ──────────────────────────────────────────────────────────────
// AC-001: 할 일 등록
// ──────────────────────────────────────────────────────────────

test.describe("AC-001: 할 일 등록", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.reload();
    await skipOnboarding(page);
  });

  test("제목 입력 후 추가하면 목록에 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("선형대수 과제");
    await page.getByRole("button", { name: "추가" }).click();

    await expect(page.getByText("선형대수 과제")).toBeVisible();
  });

  test("제목 없이 저장하면 오류 메시지가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByRole("button", { name: "추가" }).click();

    await expect(page.getByText("제목을 입력해 주세요")).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────
// AC-002: 과제 자동 반영
// ──────────────────────────────────────────────────────────────

test.describe("AC-002: 과제 자동 반영", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.reload();
    await skipOnboarding(page);
  });

  test("오늘 날짜로 마감일 설정 시 하루 뷰에 표시된다", async ({ page }) => {
    const today = new Date().toISOString().split("T")[0];

    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("오늘 마감 과제");
    await page.locator("#task-due").fill(today);
    await page.getByRole("button", { name: "추가" }).click();

    await expect(page.getByText("오늘 마감 과제")).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────
// AC-003: 완료 체크
// ──────────────────────────────────────────────────────────────

test.describe("AC-003: 완료 체크", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.reload();
    await skipOnboarding(page);
  });

  test("체크박스 클릭 시 완료 상태로 변경된다", async ({ page }) => {
    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("완료 테스트 항목");
    await page.getByRole("button", { name: "추가" }).click();

    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();

    await expect(checkbox).toBeChecked();
  });

  test("완료 상태 항목을 다시 클릭하면 미완료로 돌아온다", async ({ page }) => {
    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("토글 테스트");
    await page.getByRole("button", { name: "추가" }).click();

    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });
});

// ──────────────────────────────────────────────────────────────
// AC-004: 상세 내용 확인
// ──────────────────────────────────────────────────────────────

test.describe("AC-004: 상세 내용 확인", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.reload();
    await skipOnboarding(page);
  });

  test("항목 클릭 시 상세 모달이 열린다", async ({ page }) => {
    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("모달 테스트");
    await page.locator("#task-subject").fill("컴퓨터공학");
    await page.locator("#task-detail").fill("상세 설명 내용");
    await page.getByRole("button", { name: "추가" }).click();

    await page.getByText("모달 테스트").click();

    await expect(page.getByText("상세 보기")).toBeVisible();
    await expect(page.getByDisplayValue("모달 테스트")).toBeVisible();
    await expect(page.getByDisplayValue("컴퓨터공학")).toBeVisible();
  });

  test("삭제 버튼 클릭 시 확인 다이얼로그가 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("삭제 테스트");
    await page.getByRole("button", { name: "추가" }).click();

    await page.getByText("삭제 테스트").click();
    await page.getByRole("button", { name: "삭제" }).click();

    await expect(page.getByText("정말 삭제하시겠어요?")).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────
// AC-005: 월간 달력 조회
// ──────────────────────────────────────────────────────────────

test.describe("AC-005: 월간 달력 조회", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.reload();
    await skipOnboarding(page);
  });

  test("월간 뷰 탭 클릭 시 달력이 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: "월간 뷰" }).click();

    await expect(page.getByText("일")).toBeVisible();
    await expect(page.getByText("월")).toBeVisible();
  });

  test("마감일 있는 항목이 달력 해당 날짜에 표시된다", async ({ page }) => {
    const today = new Date().toISOString().split("T")[0];

    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("달력 표시 과제");
    await page.locator("#task-due").fill(today);
    await page.getByRole("button", { name: "추가" }).click();

    await page.getByRole("button", { name: "월간 뷰" }).click();

    await expect(page.getByText("달력 표시 과제")).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────
// AC-006: 필터
// ──────────────────────────────────────────────────────────────

test.describe("AC-006: 필터", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.reload();
    await skipOnboarding(page);
  });

  test("완료 필터 선택 시 완료된 항목만 표시된다", async ({ page }) => {
    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("완료된 항목");
    await page.getByRole("button", { name: "추가" }).click();

    await page.getByRole("button", { name: /할 일 추가/ }).click();
    await page.getByPlaceholder("할 일 제목").fill("미완료 항목");
    await page.getByRole("button", { name: "추가" }).click();

    await page.locator('input[type="checkbox"]').first().click();
    await page.getByRole("button", { name: "완료" }).click();

    await expect(page.getByText("완료된 항목")).toBeVisible();
    await expect(page.getByText("미완료 항목")).not.toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────
// Coach: 온보딩
// ──────────────────────────────────────────────────────────────

test.describe("Coach: 온보딩", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.reload();
  });

  test("첫 진입 시 온보딩 화면이 표시된다", async ({ page }) => {
    await expect(page.getByText("누가 응원해줬으면 하나요?")).toBeVisible();
  });

  test("건너뛰기 클릭 시 메인 플래너로 이동한다", async ({ page }) => {
    await page.getByText("건너뛰기").click();
    await expect(page.getByText("StudyLog")).toBeVisible();
    await expect(page.getByText("누가 응원해줬으면 하나요?")).not.toBeVisible();
  });

  test("온보딩 완료 시 프로필이 저장되고 메인으로 이동한다", async ({ page }) => {
    await page.getByPlaceholder("이름 입력").fill("엄마");
    await page.getByRole("button", { name: "다음" }).click();

    await page.getByRole("button", { name: "건너뛰기" }).click();

    await page.getByPlaceholder(/호칭 입력/).fill("자기야");
    await page.getByRole("button", { name: "다음" }).click();

    await page.getByPlaceholder("성격 설명 입력").fill("다정하고 따뜻한 성격");
    await page.getByRole("button", { name: "완료" }).click();

    await expect(page.getByText("StudyLog")).toBeVisible();

    const coach = await page.evaluate(() =>
      localStorage.getItem("studylog_coach")
    );
    expect(coach).not.toBeNull();
    const parsed = JSON.parse(coach!);
    expect(parsed.name).toBe("엄마");
    expect(parsed.nickname).toBe("자기야");
  });

  test("500KB 초과 사진 업로드 시 경고 메시지가 표시된다", async ({ page }) => {
    await page.getByPlaceholder("이름 입력").fill("테스트");
    await page.getByRole("button", { name: "다음" }).click();

    const buffer = Buffer.alloc(600 * 1024, "a");
    await page.locator('input[type="file"]').setInputFiles({
      name: "big.jpg",
      mimeType: "image/jpeg",
      buffer,
    });

    await expect(page.getByText(/500KB 이하/)).toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────
// Coach: 잔소리 버블
// ──────────────────────────────────────────────────────────────

test.describe("Coach: 잔소리 버블", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.evaluate(() => {
      localStorage.setItem(
        "studylog_coach",
        JSON.stringify({
          name: "엄마",
          photo: null,
          nickname: "자기야",
          personality: "다정한 성격",
        })
      );
    });
    await page.reload();
    await skipOnboarding(page);
  });

  test("D-3 이내 마감 항목 있으면 잔소리 버블이 표시된다", async ({ page }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await page.evaluate((dueDate) => {
      localStorage.setItem(
        "studylog_tasks",
        JSON.stringify([
          {
            id: "t1",
            title: "급한 과제",
            status: "todo",
            dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
      );
    }, tomorrow.toISOString().split("T")[0]);

    await page.reload();

    await expect(
      page.locator("[data-testid='coach-nag-bubble']")
    ).toBeVisible({ timeout: 5000 });
  });

  test("D-3 초과 마감 항목만 있으면 잔소리 버블이 표시되지 않는다", async ({ page }) => {
    const farFuture = new Date();
    farFuture.setDate(farFuture.getDate() + 10);

    await page.evaluate((dueDate) => {
      localStorage.setItem(
        "studylog_tasks",
        JSON.stringify([
          {
            id: "t1",
            title: "여유로운 과제",
            status: "todo",
            dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
      );
    }, farFuture.toISOString().split("T")[0]);

    await page.reload();

    await expect(
      page.locator("[data-testid='coach-nag-bubble']")
    ).not.toBeVisible();
  });
});

// ──────────────────────────────────────────────────────────────
// Coach: 완료 칭찬 팝업
// ──────────────────────────────────────────────────────────────

test.describe("Coach: 완료 칭찬 팝업", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearStorage(page);
    await page.evaluate(() => {
      localStorage.setItem(
        "studylog_coach",
        JSON.stringify({
          name: "엄마",
          photo: null,
          nickname: "자기야",
          personality: "다정한 성격",
        })
      );
      localStorage.setItem(
        "studylog_tasks",
        JSON.stringify([
          {
            id: "t1",
            title: "팝업 테스트 과제",
            status: "todo",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
      );
    });
    await page.reload();
    await skipOnboarding(page);
  });

  test("할 일 완료 시 칭찬 팝업이 나타난다", async ({ page }) => {
    await page.locator('input[type="checkbox"]').first().click();

    await expect(
      page.locator("[data-testid='coach-completion-pop']")
    ).toBeVisible({ timeout: 3000 });
  });

  test("칭찬 팝업이 2초 후 자동으로 사라진다", async ({ page }) => {
    await page.locator('input[type="checkbox"]').first().click();

    const pop = page.locator("[data-testid='coach-completion-pop']");
    await expect(pop).toBeVisible({ timeout: 3000 });

    await page.waitForTimeout(2500);
    await expect(pop).not.toBeVisible();
  });
});
