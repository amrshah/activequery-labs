import { test, expect } from "@playwright/test";

async function collectSanchaInterpolation(page, path) {
  await page.goto(path);
  await page.waitForFunction(() => window.fixtureReady === true);
  return page.evaluate(() => {
    // The implementation uses undeclared loop identifiers; define them explicitly
    // so the interpolation branch can be reached and audited in isolation.
    window.ii = 0;
    window.i = 0;
    const host = document.createElement("div");
    const returned = host.sancha({
      data: [{ name: '<img data-aq-probe="injected" src="x">' }],
      template: "<section>{{name}}</section>"
    });
    return {
      returnsHost: returned === host,
      html: host.innerHTML,
      injectedNodeCount: host.querySelectorAll('img[data-aq-probe="injected"]').length,
      sectionText: host.querySelector("section")?.textContent ?? null
    };
  });
}

test("Element.sancha interpolates data as raw HTML rather than escaped text", async ({ page }) => {
  const result = await collectSanchaInterpolation(page, "/");
  expect(result).toEqual({
    returnsHost: true,
    html: '<section><img data-aq-probe="injected" src="x"></section>',
    injectedNodeCount: 1,
    sectionText: ""
  });
});

test("Element.sancha raw HTML interpolation matches source and minified builds", async ({ page }) => {
  const source = await collectSanchaInterpolation(page, "/");
  const minified = await collectSanchaInterpolation(page, "/tests/fixture-min.html");
  expect(minified).toEqual(source);
});
