import { expect, test } from "@playwright/test";
import { expectNoCriticalA11yIssues } from "./a11y-helpers";

test.describe("app smoke", () => {
  test("Swedish home loads and exposes document title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/partifinansiering/i);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("English home loads", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/partifinansiering|financ/i);
  });

  test("party detail page", async ({ page }) => {
    await page.goto("/parti/socialdemokraterna");
    await expect(
      page.getByRole("heading", { level: 1, name: /socialdemokraterna/i }),
    ).toBeVisible();
  });
});

test.describe("accessibility (axe, WCAG 2 A + AA)", () => {
  test("Swedish home", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yIssues(page);
  });

  test("English home", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yIssues(page);
  });

  test("Swedish party page", async ({ page }) => {
    await page.goto("/parti/centerpartiet");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yIssues(page);
  });

  test("English party page", async ({ page }) => {
    await page.goto("/en/parti/liberalerna");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yIssues(page);
  });
});
