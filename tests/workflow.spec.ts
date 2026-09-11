import { expect, test } from "@playwright/test";

test("screens a viable sauce and selects a production route", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Protect the story/i })).toBeVisible();
  await page.getByRole("button", { name: /Run launch screen/ }).click();
  await expect(page.getByText("Ready for a concierge feasibility call")).toBeVisible();
  await expect(page.getByText("66%")).toBeVisible();
  await expect(page.getByText("$9,720")).toBeVisible();
  await page.getByRole("button", { name: /Harvest Kettle Foods/ }).click();
  await expect(page.getByText("Brief route: Harvest Kettle Foods")).toBeVisible();
});

test("names invalid economics and all four launch blockers", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Retail price").fill("3");
  await page.getByRole("button", { name: /Run launch screen/ }).click();
  await expect(page.locator(".error")).toContainText("Retail price must exceed");

  await page.getByLabel("Retail price").fill("5");
  await page.getByLabel("Unit cost").fill("3");
  await page.getByLabel("Monthly units").fill("100");
  await page.getByLabel("Shelf life days").fill("30");
  await page.getByLabel("Startup budget").fill("1000");
  await page.getByRole("button", { name: "Bakery" }).click();
  await page.getByRole("button", { name: /Run launch screen/ }).click();
  await expect(page.getByText("Pause before packaging spend")).toBeVisible();
  await expect(page.getByText("Gross Margin Below 55 Percent")).toBeVisible();
  await expect(page.getByText("Shelf Life Needs Validation")).toBeVisible();
  await expect(page.getByText("First Run Budget Gap")).toBeVisible();
  await expect(page.getByText("No Demo Copacker Match")).toBeVisible();
  await expect(page.getByText("No demo match")).toBeVisible();
});

test("changing the first channel recalculates unit economics", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("First channel").selectOption("Direct online");
  await page.getByRole("button", { name: /Run launch screen/ }).click();
  await expect(page.getByText("$3,055")).toBeVisible();
});

test("has no horizontal overflow on mobile before and after results", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only overflow assertion");
  await page.goto("/");
  const initial = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(initial.scroll).toBeLessThanOrEqual(initial.client + 1);
  await page.getByRole("button", { name: /Run launch screen/ }).click();
  await expect(page.getByText("Ready for a concierge feasibility call")).toBeVisible();
  const after = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(after.scroll).toBeLessThanOrEqual(after.client + 1);
});
