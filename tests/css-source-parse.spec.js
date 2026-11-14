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

test("generated AQCSS AST catalog is pinned and complete enough for research", async () => {
  const catalog = JSON.parse(fs.readFileSync("./knowledgebase/aqcss/generated-ast-catalog.json", "utf8"));
  expect(catalog.parser).toBe("PostCSS AST");
  expect(catalog.source.git_blob_sha).toBe("c03546ecd1a41d26cbbfa8f1e31d38731f77cf62");
  expect(catalog.summary.rule_count).toBeGreaterThan(1000);
  expect(catalog.summary.unique_class_token_count).toBeGreaterThan(1000);
  expect(catalog.summary.declared_custom_property_count).toBeGreaterThan(40);
});
