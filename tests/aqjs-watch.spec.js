import { test, expect } from "@playwright/test";

async function collectWatchContract(page, path) {
  await page.goto(path);
  await page.waitForFunction(() => window.fixtureReady === true);
  return page.evaluate(() => {
    const NativeObserver = window.MutationObserver;
    const target = document.createElement("div");
    const explicitTarget = document.createElement("section");
    let capturedCallback = null;
    let capturedTarget = null;
    let capturedOptions = null;
    let observerInstances = 0;

    window.MutationObserver = class {
      constructor(callback) {
        observerInstances++;
        capturedCallback = callback;
      }
      observe(node, options) {
        capturedTarget = node;
        capturedOptions = options;
        return "observe-return-value";
      }
    };

    const result = target.watch({
      element: explicitTarget,
      subtree: true,
      attribute: true,
      children: true,
      values: true,
      filter: ["data-state"],
      then: () => {}
    });

    window.MutationObserver = NativeObserver;

    let defaultOptionsError = null;
    try { target.watch(); } catch (error) { defaultOptionsError = error.name; }

    const nodes = document.querySelectorAll(".target");
    const nodeListWatchSame = nodes.watch() === nodes;

    return {
      result,
      observerInstances,
      explicitTargetUsed: capturedTarget === explicitTarget,
      callbackProvided: typeof capturedCallback === "function",
      options: capturedOptions,
      defaultOptionsError,
      nodeListWatchSame
    };
  });
}

test("Element.watch maps wrapper options to MutationObserver and returns observe result", async ({ page }) => {
  const result = await collectWatchContract(page, "/");
  expect(result).toEqual({
    result: "observe-return-value",
    observerInstances: 2,
    explicitTargetUsed: false,
    callbackProvided: true,
    options: {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true,
      attributeFilter: ["data-state"]
    },
    defaultOptionsError: "TypeError",
    nodeListWatchSame: true
  });
});

test("Element.watch option mapping and default failure match source/minified builds", async ({ page }) => {
  const source = await collectWatchContract(page, "/");
  const minified = await collectWatchContract(page, "/tests/fixture-min.html");
  expect(minified).toEqual(source);
});
