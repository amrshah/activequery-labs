import { test, expect } from "@playwright/test";

test.describe("clean-room portal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/rebuild/index.html");
  });

  test("renders the source-grounded portal and isolated playground", async ({ page }) => {
    await expect(page).toHaveTitle(/ActiveQuery Labs — Field Guide/);
    await expect(page.getByRole("heading", { name: "Understand the rules. Build with evidence." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Change the code. See the result." })).toBeVisible();
    await expect(page.locator("#preview-status")).toContainText("Preview updated", { timeout: 15000 });
  });

  test("runs user-editable source in a scripts-only sandbox and reacts to edits", async ({ page }) => {
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
    await expect(page.locator("#preview-status")).toContainText("Preview updated", { timeout: 15000 });
    await page.locator("#trigger-preview-event").click();
    await expect(page.locator("#preview-status")).toContainText("AQJS event helper ran");
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
    const toggle = page.getByRole("button", { name: "Switch to dark theme" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
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
});
