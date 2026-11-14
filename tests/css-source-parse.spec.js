import { test, expect } from "@playwright/test";
import postcss from "postcss";
import fs from "node:fs";

test("pinned AQCSS source parses and exposes expected structural families", async () => {
  const css = fs.readFileSync("./vendor/ActiveQuery.css", "utf8");
  const root = postcss.parse(css, { from: "vendor/ActiveQuery.css" });
  const rules = [];
  const media = [];
  const customProperties = new Set();
  root.walkRules(rule => rules.push(rule));
  root.walkAtRules("media", rule => media.push(rule.params));
  root.walkDecls(decl => {
    if (decl.prop.startsWith("--")) customProperties.add(decl.prop);
  });

  expect(rules.length).toBeGreaterThan(1000);
  expect(media).toContain("(min-width:600px)");
  expect(media).toContain("(min-width:993px)");
  expect(media).toContain("(min-width:1440px)");
  expect(customProperties.has("--aq-swatch-primary")).toBe(true);
  expect(rules.some(rule => rule.selector.includes(".aq-text--center"))).toBe(true);
  expect(rules.some(rule => rule.selector.includes(".aq-facet--third"))).toBe(true);
});
