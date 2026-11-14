import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 599, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => window.fixtureReady === true);
});

test("AQCSS typography and border primitives apply", async ({ page }) => {
  const result = await page.evaluate(() => ({
    align: getComputedStyle(document.querySelector("#single")).textAlign,
    radius: getComputedStyle(document.querySelector("#circle")).borderRadius
  }));
  expect(result.align).toBe("center");
  expect(result.radius).not.toBe("0px");
});

test("tablet-prefixed typography activates at the 600px threshold", async ({ page }) => {
  const at599 = await page.locator("#responsive").evaluate(node => getComputedStyle(node).fontSize);
  await page.setViewportSize({ width: 600, height: 800 });
  const at600 = await page.locator("#responsive").evaluate(node => getComputedStyle(node).fontSize);
  expect(at600).not.toBe(at599);
});

test("known third-width anomaly is captured without silently normalizing it", async ({ page }) => {
  const width = await page.locator("#third").evaluate(node => getComputedStyle(node).width);
  const parentWidth = await page.locator("#fixture").evaluate(node => getComputedStyle(node).width);
  expect(Number.parseFloat(width)).toBeGreaterThan(0);
  expect(Number.parseFloat(width)).toBeLessThan(Number.parseFloat(parentWidth) * 0.1);
});

test("known xlarge row-gap declaration does not resolve to 2px", async ({ page }) => {
  const gap = await page.locator("#gap").evaluate(node => getComputedStyle(node).rowGap);
  expect(gap).not.toBe("2px");
});
