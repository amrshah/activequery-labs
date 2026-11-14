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
  expect(catalog.summary.rule_count).toBe(1417);
  expect(catalog.summary.unique_selector_text_count).toBe(1409);
  expect(catalog.summary.unique_class_token_count).toBe(1813);
  expect(catalog.summary.declared_custom_property_count).toBe(26);
  expect(catalog.summary.custom_property_names_in_declarations_or_references).toBe(71);
  expect(catalog.summary.media_query_count).toBe(10);
});


test("custom property index excludes BEM selector modifiers misread as variables", async () => {
  const index = JSON.parse(fs.readFileSync("./knowledgebase/aqcss/custom-property-index.json", "utf8"));
  expect(index.unique_custom_property_count).toBe(71);
  expect(index.summary).toEqual({
    unique_names: 71,
    declared_names: 26,
    reference_only_names: 45,
    declaration_occurrences: 37,
    var_reference_occurrences: 239
  });
  expect(index.properties["--aq-swatch-primary"].declarations.length).toBeGreaterThan(0);
  expect(index.properties["--aq-swatch-hover-text-opacity"].references.length).toBeGreaterThan(0);
  expect(index.properties["--bold-hover"]).toBeUndefined();
  expect(index.properties["--dropdown-hover"]).toBeUndefined();
});


test("committed AQCSS navigation indexes match the pinned PostCSS catalog", async () => {
  const classIndex = JSON.parse(fs.readFileSync("./knowledgebase/aqcss/class-token-index.json", "utf8"));
  const ruleCatalog = JSON.parse(fs.readFileSync("./knowledgebase/aqcss/rule-catalog.json", "utf8"));
  expect(classIndex.source.sha).toBe("c03546ecd1a41d26cbbfa8f1e31d38731f77cf62");
  expect(classIndex.rule_count).toBe(1417);
  expect(classIndex.unique_class_token_count).toBe(1813);
  expect(classIndex.classes).toHaveLength(1813);
  expect(ruleCatalog.source.sha).toBe("c03546ecd1a41d26cbbfa8f1e31d38731f77cf62");
  expect(ruleCatalog.rule_count).toBe(1417);
  expect(ruleCatalog.unique_selector_text_count).toBe(1409);
  expect(ruleCatalog.rules).toHaveLength(1417);
});
