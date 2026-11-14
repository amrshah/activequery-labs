import { test, expect } from "@playwright/test";
import postcss from "postcss";
import fs from "node:fs";

function normalizeSelector(selector) {
  return selector
    .replace(/\s*,\s*/g, ",")
    .replace(/\s*([>+~])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeValue(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/\s*([,()])\s*/g, "$1")
    .trim();
}

function canonicalRules(root) {
  const result = [];
  root.walkRules(rule => {
    const context = [];
    let parent = rule.parent;
    while (parent && parent.type !== "root") {
      if (parent.type === "atrule") {
        const params = parent.params.replace(/\s*:\s*/g, ":").replace(/\s*,\s*/g, ",").replace(/\s+/g, " ").trim();
        context.unshift(`@${parent.name} ${params}`);
      }
      parent = parent.parent;
    }
    const declarations = (rule.nodes || [])
      .filter(node => node.type === "decl")
      .map(node => [node.prop, normalizeValue(node.value), Boolean(node.important)]);
    result.push({ selector: normalizeSelector(rule.selector || ""), context, declarations });
  });
  return result;
}

test("AQCSS minified stylesheet matches source selector and declaration AST", async () => {
  const source = fs.readFileSync("./vendor/ActiveQuery.css", "utf8");
  const minified = fs.readFileSync("./vendor/ActiveQuery.min.css", "utf8");
  const sourceAst = postcss.parse(source);
  const minifiedAst = postcss.parse(minified);
  expect(canonicalRules(minifiedAst)).toEqual(canonicalRules(sourceAst));
});

test("AQJS source and minified builds expose equivalent core DOM behavior", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => window.fixtureReady === true);
  const sourceResult = await page.evaluate(() => {
    const target = document.querySelector("#single");
    target.setClasses(["parity-a", "parity-b"]);
    return {
      none: window.AQ.DOM(".not-found"),
      one: window.AQ.DOM("#single")?.id,
      many: window.AQ.DOM(".target")?.length,
      nested: window.AQ.nestedDOM.call(document.querySelector("#scope-b"), ".target")?.id,
      classes: target.getClasses(["parity-a", "parity-b"])
    };
  });

  await page.goto("/tests/fixture-min.html");
  await page.waitForFunction(() => window.fixtureReady === true);
  const minifiedResult = await page.evaluate(() => {
    const target = document.querySelector("#single");
    target.setClasses(["parity-a", "parity-b"]);
    return {
      none: window.AQ.DOM(".not-found"),
      one: window.AQ.DOM("#single")?.id,
      many: window.AQ.DOM(".target")?.length,
      nested: window.AQ.nestedDOM.call(document.querySelector("#scope-b"), ".target")?.id,
      classes: target.getClasses(["parity-a", "parity-b"])
    };
  });

  expect(minifiedResult).toEqual(sourceResult);
});

test("minified AQJS also overwrites native String.trim", async ({ page }) => {
  await page.goto("/tests/fixture-min.html");
  await page.waitForFunction(() => window.fixtureReady === true);
  const result = await page.evaluate(() => {
    const descriptor = Object.getOwnPropertyDescriptor(String.prototype, "trim");
    return {
      sameAsNative: String.prototype.trim === window.nativeStringTrim,
      writable: descriptor.writable,
      configurable: descriptor.configurable
    };
  });
  expect(result).toEqual({ sameAsNative: false, writable: false, configurable: false });
});

test("minified AQJS default constructor triggers the same prototype mutation", async ({ page }) => {
  await page.goto("/tests/fixture-min.html");
  await page.waitForFunction(() => window.fixtureReady === true);
  const result = await page.evaluate(() => {
    new window.AQ();
    return {
      windowNull: Object.prototype.hasOwnProperty.call(window, "null"),
      objectZero: Object.prototype.hasOwnProperty.call(Object.prototype, "0"),
      objectZeroEnumerable: Object.prototype.propertyIsEnumerable("0")
    };
  });
  expect(result).toEqual({ windowNull: true, objectZero: true, objectZeroEnumerable: true });
});
