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
  expect(catalog.summary).toEqual({
    class_method_count: 35,
    extension_target_count: 9,
    extension_method_count: 76,
    event_listener_call_count: 11,
    dynamic_import_count: 1,
    global_prototype_write_count: 4
  });
  expect(catalog.summary.class_method_count).toBe(catalog.source.class_methods.length);
  expect(catalog.summary.extension_target_count).toBe(catalog.source.extension_targets.length);
  expect(catalog.summary.extension_method_count).toBe(catalog.source.extension_methods.length);
  expect(catalog.summary.event_listener_call_count).toBe(catalog.source.event_listener_calls.length);
  expect(catalog.summary.dynamic_import_count).toBe(catalog.source.dynamic_imports.length);
  expect(catalog.summary.global_prototype_write_count).toBe(catalog.source.global_prototype_writes.length);
  expect(catalog.summary.extension_method_count).toBe(catalog.minified.extension_methods.length);
});
