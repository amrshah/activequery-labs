import { test, expect } from "@playwright/test";
import fs from "node:fs";

test("AQJS source and minified files parse and expose matching API inventories", async () => {
  const catalog = JSON.parse(fs.readFileSync("./knowledgebase/aqjs/generated-ast-catalog.json", "utf8"));
  expect(catalog.parser).toBe("Acorn AST");
  expect(catalog.source.git_blob_sha).toBe("b8ec9e5be8668d048eea3385cd9012dfddb69cf0");
  expect(catalog.minified.git_blob_sha).toBe("594d778cd5fefe2caa039a7904343e385b77a50c");
  expect(catalog.parity.exports_match).toBe(true);
  expect(catalog.parity.class_method_names_match).toBe(true);
  expect(catalog.parity.extension_targets_match).toBe(true);
  expect(catalog.parity.extension_method_names_match).toBe(true);
  expect(catalog.source.exports).toContain("ActiveQuery");
  expect(catalog.source.extension_targets).toContain("element");
  expect(catalog.source.extension_targets).toContain("nodelist");
  expect(catalog.source.extension_methods.length).toBeGreaterThan(50);
});
