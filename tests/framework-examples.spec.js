import { test, expect } from "@playwright/test";

const cssUrl = "https://cdn.jsdelivr.net/gh/ActiveQuery/CSS@main/ActiveQuery.css";
const jsUrl = "https://cdn.jsdelivr.net/gh/ActiveQuery/JS@adb1b19770ca68840dc2f9e62de556a324bee2fa/ActiveQuery.js";

async function usePinnedFrameworkAssets(page) {
  await page.route(cssUrl, route => route.fulfill({ path: "vendor/ActiveQuery.css", contentType: "text/css" }));
  await page.route("https://raw.githubusercontent.com/ActiveQuery/CSS/main/ActiveQuery.css", route => route.fulfill({ path: "vendor/ActiveQuery.css", contentType: "text/css" }));
  await page.route(jsUrl, route => route.fulfill({ path: "vendor/ActiveQuery.js", contentType: "text/javascript", headers: { "access-control-allow-origin": "*" } }));
}

test.describe("framework-first component and page examples", () => {
  test("AQCSS facet and flexon utilities own the SaaS hero and feature layout", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/examples/saas-landing/index.html");
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
    await page.goto("/examples/analytics-dashboard/index.html");
    await expect(page.locator(".app")).toHaveCSS("display", "flex");
    const mobileWidth = await page.locator(".kpi").first().evaluate(el => el.getBoundingClientRect().width);
    await page.setViewportSize({ width: 1200, height: 900 });
    const desktopWidths = await page.locator(".kpi").evaluateAll(els => els.map(el => el.getBoundingClientRect().width));
    expect(desktopWidths[0]).toBeLessThan(mobileWidth);
    expect(desktopWidths[0]).toBeGreaterThan(180);
    await expect(page.locator(".grid")).toHaveCSS("display", "flex");
  });

  test("AQCSS responsive prefixes switch at the verified 600px and 993px thresholds", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.setViewportSize({ width: 599, height: 900 });
    await page.goto("/examples/saas-landing/index.html");
    const featureWidthAt599 = await page.locator(".feature").first().evaluate(el => el.getBoundingClientRect().width);
    await page.setViewportSize({ width: 600, height: 900 });
    const featureWidthAt600 = await page.locator(".feature").first().evaluate(el => el.getBoundingClientRect().width);
    expect(featureWidthAt600).toBeLessThan(featureWidthAt599 * 0.6);

    await page.goto("/examples/analytics-dashboard/index.html");
    await page.setViewportSize({ width: 992, height: 900 });
    const kpiWidthAt992 = await page.locator(".kpi").first().evaluate(el => el.getBoundingClientRect().width);
    await page.setViewportSize({ width: 993, height: 900 });
    const kpiWidthAt993 = await page.locator(".kpi").first().evaluate(el => el.getBoundingClientRect().width);
    expect(kpiWidthAt993).toBeLessThan(kpiWidthAt992 * 0.7);
  });

  test("AQJS mobile navigation toggles the AQCSS operations sidebar", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/examples/operations-dashboard/index.html");
    const sidebar = page.locator("#main-sidebar");
    const menu = page.getByRole("button", { name: "Open menu" });
    await expect(sidebar).toBeHidden();
    await menu.click();
    await expect(sidebar).toBeVisible();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await menu.click();
    await expect(sidebar).toBeHidden();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  test("AQCSS responsive dashboard uses facets and AQJS updates viewport dimensions", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.goto("/examples/responsive-dashboard/index.html");
    await expect(page.locator(".dashboard-grid")).toHaveCSS("display", "flex");
    await expect(page.locator("#viewport-label")).toContainText("Viewport:");
    await page.setViewportSize({ width: 768, height: 900 });
    await expect(page.locator("#viewport-label")).toContainText("768 × 900px");
  });

  test("AQJS powers tabs, validation, toast and dialog behavior in the component gallery", async ({ page }) => {
    await usePinnedFrameworkAssets(page);
    await page.goto("/components/index.html");
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
    await page.goto("/examples/restaurant-pwa/index.html");
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
