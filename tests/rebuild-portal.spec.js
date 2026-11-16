import { test, expect } from "@playwright/test";

test.describe("clean-room portal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/rebuild/index.html");
  });

  test("renders the source-grounded portal and isolated playground", async ({ page }) => {
    await expect(page).toHaveTitle(/ActiveQuery Labs — Field Guide/);
    await expect(page.getByRole("heading", { name: "Understand the rules. Build with evidence." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Change the code. See the result." })).toBeVisible();
    await expect(page.locator("#preview-status")).toContainText("Accept the OSL-3.0 terms");
    await page.getByRole("checkbox", { name: /I have reviewed the OSL-3.0 terms/ }).check();
    await page.getByRole("button", { name: "Accept OSL-3.0 and enable preview" }).click();
    await expect(page.locator("#preview-status")).toContainText("Preview updated", { timeout: 15000 });
  });

  test("runs user-editable source in a scripts-only sandbox and reacts to edits", async ({ page }) => {
    await page.getByRole("checkbox", { name: /I have reviewed the OSL-3.0 terms/ }).check();
    await page.getByRole("button", { name: "Accept OSL-3.0 and enable preview" }).click();
    await expect(page.locator("#preview-status")).toContainText("Preview updated", { timeout: 15000 });
    const frame = page.locator("#live-preview");
    expect(await frame.getAttribute("sandbox")).toBe("allow-scripts");
    const initialVersion = Number(await frame.getAttribute("data-preview-version"));
    const initialLength = Number(await frame.getAttribute("data-preview-text-length"));

    await page.locator("#source-editor").fill("<section><h2>Edited from the parent editor</h2><p>Live update probe.</p></section>");
    await expect.poll(async () => Number(await frame.getAttribute("data-preview-version"))).toBeGreaterThan(initialVersion);
    const updatedLength = Number(await frame.getAttribute("data-preview-text-length"));
    expect(updatedLength).not.toBe(initialLength);
    await expect(page.locator("#preview-status")).toContainText("Preview updated");
  });

  test("executes the sample AQJS event helper inside the isolated preview", async ({ page }) => {
    await page.getByRole("checkbox", { name: /I have reviewed the OSL-3.0 terms/ }).check();
    await page.getByRole("button", { name: "Accept OSL-3.0 and enable preview" }).click();
    await expect(page.locator("#preview-status")).toContainText("Preview updated", { timeout: 15000 });
    await page.locator("#trigger-preview-event").click();
    await expect(page.locator("#preview-status")).toContainText("AQJS event helper ran");
  });

  test("does not request upstream framework assets before explicit OSL-3.0 assent", async ({ page }) => {
    const assetRequests = [];
    page.on("request", request => {
      if (/\/vendor\/ActiveQuery\.(css|js)$/.test(request.url())) assetRequests.push(request.url());
    });
    await expect(page.locator("#preview-status")).toContainText("Accept the OSL-3.0 terms");
    expect(assetRequests).toEqual([]);
    await page.getByRole("checkbox", { name: /I have reviewed the OSL-3.0 terms/ }).check();
    await page.getByRole("button", { name: "Accept OSL-3.0 and enable preview" }).click();
    await expect(page.locator("#preview-status")).toContainText("Preview updated", { timeout: 15000 });
    expect(assetRequests).toHaveLength(2);
  });

  test("supports arrow and Home keyboard navigation across editor tabs", async ({ page }) => {
    const htmlTab = page.getByRole("tab", { name: "HTML" });
    const cssTab = page.getByRole("tab", { name: "CSS" });
    const jsTab = page.getByRole("tab", { name: "JavaScript" });
    await htmlTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(cssTab).toHaveAttribute("aria-selected", "true");
    await expect(cssTab).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(jsTab).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(htmlTab).toHaveAttribute("aria-selected", "true");
    await expect(htmlTab).toBeFocused();
  });

  test("switches theme accessibly and remembers the selected theme", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.evaluate(() => localStorage.removeItem("aq-labs-theme"));
    await page.reload();
    const toggle = page.getByRole("button", { name: "Switch to dark theme" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const lightBackground = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const darkBackground = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(darkBackground).not.toBe(lightBackground);
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  });

  test("stacks editor and preview panels on narrow viewports", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const editor = await page.locator(".editor-panel").boundingBox();
    const preview = await page.locator(".preview-panel").boundingBox();
    expect(editor).not.toBeNull();
    expect(preview).not.toBeNull();
    expect(preview.y).toBeGreaterThan(editor.y + editor.height - 2);
  });
  test("opens the AQCSS guided learning page with verified responsive guidance", async ({ page }) => {
    await page.goto("/rebuild/guides/aqcss.html");
    await expect(page).toHaveTitle(/Learn AQCSS/);
    await expect(page.getByRole("heading", { name: "Understand the cascade. Use AQCSS deliberately." })).toBeVisible();
    await expect(page.getByText(/600 CSS px/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Continue to AQJS →" })).toBeVisible();
  });

  test("opens the AQJS guided learning page and labels unresolved hazards", async ({ page }) => {
    await page.goto("/rebuild/guides/aqjs.html");
    await expect(page).toHaveTitle(/Learn AQJS/);
    await expect(page.getByRole("heading", { name: "Know the API. Respect its edge cases." })).toBeVisible();
    await expect(page.getByText(/Promise resolver assimilation of/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to AQCSS ←" })).toBeVisible();
  });

  test("learning pages share the persistent accessible theme preference", async ({ page }) => {
    await page.goto("/rebuild/guides/aqcss.html");
    await page.emulateMedia({ colorScheme: "light" });
    await page.evaluate(() => localStorage.setItem("aq-labs-theme", "light"));
    await page.reload();
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.goto("/rebuild/guides/aqjs.html");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toHaveAttribute("aria-pressed", "true");
  });

});