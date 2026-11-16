import { test, expect } from "@playwright/test";

const cssUrl = "https://cdn.jsdelivr.net/gh/ActiveQuery/CSS@main/ActiveQuery.css";
const jsUrl = "https://cdn.jsdelivr.net/gh/ActiveQuery/JS@adb1b19770ca68840dc2f9e62de556a324bee2fa/ActiveQuery.js";

async function usePinnedFrameworkAssets(page) {
  await page.route(cssUrl, route => route.fulfill({ path: "vendor/ActiveQuery.css", contentType: "text/css" }));
  await page.route(jsUrl, route => route.fulfill({ path: "vendor/ActiveQuery.js", contentType: "text/javascript", headers: { "access-control-allow-origin": "*" } }));
}

test.describe("framework-first component and page examples", () => {
  test("AQCSS facet and flexon utilities own the SaaS hero and feature layout", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/examples/saas-landing/");
    await expect(page.locator(".hero")).toHaveCSS("display", "flex");
    const mobile = await page.evaluate(() => {
      const copy = document.querySelector(".hero-copy").getBoundingClientRect();
      const visual = document.querySelector(".hero-visual").getBoundingClientRect();
      return { copyWidth: copy.width, visualWidth: visual.width, copyY: copy.y, visualY: visual.y };
    });
    expect(mobile.copyWidth).toBeGreaterThan(300);
    expect(mobile.visualY).toBeGreaterThan(mobile.copyY);
    await page.setViewportSize({ width: 1200, height: 900 });
    const desktop = await page.evaluate(() => {
      const copy = document.querySelector(".hero-copy").getBoundingClientRect();
      const visual = document.querySelector(".hero-visual").getBoundingClientRect();
      return { copyWidth: copy.width, visualWidth: visual.width, visualX: visual.x, copyRight: copy.right };
    });
    expect(desktop.visualX).toBeGreaterThanOrEqual(desktop.copyRight - 1);
    expect(desktop.copyWidth / desktop.visualWidth).toBeGreaterThan(1.25);
    await expect(page.locator(".features")).toHaveCSS("display", "flex");
  });

  test("AQCSS flexon and facet utilities compose responsive analytics dashboard columns", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/examples/analytics-dashboard/");
    await expect(page.locator(".app")).toHaveCSS("display", "flex");
    const mobileWidth = await page.locator(".kpi").first().evaluate(el => el.getBoundingClientRect().width);
    await page.setViewportSize({ width: 1200, height: 900 });
    const desktopWidths = await page.locator(".kpi").evaluateAll(els => els.map(el => el.getBoundingClientRect().width));
    expect(desktopWidths[0]).toBeLessThan(mobileWidth);
    expect(desktopWidths[0]).toBeGreaterThan(180);
    await expect(page.locator(".grid")).toHaveCSS("display", "flex");
  });

  test("AQJS powers tabs, validation, toast and dialog behavior in the component gallery", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.goto("/components/");
    const tab = page.locator("#tab-b");
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#panel-b")).toBeVisible();
    await page.locator("#tab-b").focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#tab-c")).toHaveAttribute("aria-selected", "true");

    await page.locator("#full-name").fill("Taylor Example");
    await page.locator("#email").fill("taylor@example.test");
    await page.locator("#demo-form button[type=submit]").click();
    await expect(page.locator("#form-feedback")).toContainText("valid");

    await page.locator("#toast-trigger").click();
    await expect(page.locator("#toast-region .toast-message")).toContainText("saved");
    await page.locator("#dialog-open").click();
    await expect(page.locator("#demo-dialog")).toBeVisible();
    await page.locator("#dialog-cancel").click();
    await expect(page.locator("#demo-dialog")).not.toBeVisible();
  });

  test("AQJS DOM, on, setContent, setChild and class helpers power the restaurant basket", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.goto("/examples/restaurant-pwa/");
    await page.getByRole("button", { name: "Add roasted garden bowl" }).click();
    await expect(page.locator("#cart-count")).toHaveText("(1)");
    await expect(page.locator("#total")).toHaveText("$12.50");
    await expect(page.locator("#cart")).toHaveClass(/has-items/);
    await page.getByRole("button", { name: "Remove Roasted garden bowl" }).click();
    await expect(page.locator("#cart-count")).toHaveText("(0)");
    await expect(page.locator("#total")).toHaveText("$0.00");
    await expect(page.locator("#cart")).not.toHaveClass(/has-items/);
  });
});
