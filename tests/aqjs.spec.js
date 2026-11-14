import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => window.fixtureReady === true);
});

test("DOM returns null, Element and NodeList according to match count", async ({ page }) => {
  const result = await page.evaluate(() => ({
    none: window.AQ.DOM(".missing"),
    one: window.AQ.DOM("#single")?.id,
    many: window.AQ.DOM(".target")?.length
  }));
  expect(result.none).toBeNull();
  expect(result.one).toBe("single");
  expect(result.many).toBe(3);
});

test("nestedDOM returns a single descendant and preserves context on no match", async ({ page }) => {
  const result = await page.evaluate(() => {
    const scope = document.querySelector("#scope-b");
    return {
      one: window.AQ.nestedDOM.call(scope, "#target-c")?.id,
      nonePreservesContext: window.AQ.nestedDOM.call(scope, ".missing") === scope
    };
  });
  expect(result.one).toBe("target-c");
  expect(result.nonePreservesContext).toBe(true);
});

test("nestedDOM flattens descendants from NodeList contexts", async ({ page }) => {
  const result = await page.evaluate(() => {
    const scopes = document.querySelectorAll(".scope");
    const matches = window.AQ.nestedDOM.call(scopes, ".target");
    return {
      isArray: Array.isArray(matches),
      ids: matches.map(node => node.id)
    };
  });
  expect(result.isArray).toBe(true);
  expect(result.ids).toEqual(["target-a", "target-b", "target-c"]);
});

test("Element class helpers mutate and inspect classes", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.querySelector("#event-target");
    node.setClasses(["alpha", "beta"]);
    const all = node.getClasses(["alpha", "beta"]);
    node.removeClasses(["alpha"]);
    return { all, remaining: node.className };
  });
  expect(result.all).toBe(true);
  expect(result.remaining).toBe("beta");
});

test("Element event helper registers a native event listener", async ({ page }) => {
  const result = await page.evaluate(() => {
    const node = document.querySelector("#event-target");
    let calls = 0;
    node.on("click", () => calls++);
    node.dispatchEvent(new Event("click"));
    return calls;
  });
  expect(result).toBe(1);
});
