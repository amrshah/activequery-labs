import fs from "node:fs";
import crypto from "node:crypto";
import * as acorn from "acorn";

function gitBlobSha(source) {
  const data = Buffer.from(source, "utf8");
  const header = Buffer.from(`blob ${data.length}\0`, "utf8");
  return crypto.createHash("sha1").update(Buffer.concat([header, data])).digest("hex");
}

function nameOf(node) {
  if (!node) return null;
  if (node.type === "Identifier") return node.name;
  if (node.type === "Literal") return String(node.value);
  return null;
}

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (typeof node.type === "string") visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (key === "loc" || key === "start" || key === "end") continue;
    if (Array.isArray(value)) {
      for (const child of value) walk(child, visit);
    } else if (value && typeof value === "object") {
      walk(value, visit);
    }
  }
}

function isActiveQueryExtend(node) {
  return node?.type === "CallExpression" &&
    node.callee?.type === "MemberExpression" &&
    !node.callee.computed &&
    node.callee.object?.type === "Identifier" &&
    node.callee.object.name === "ActiveQuery" &&
    node.callee.property?.name === "extend";
}

function analyze(source, label) {
  const ast = acorn.parse(source, { ecmaVersion: "latest", sourceType: "module", locations: true });
  const exports = [];
  const classMethods = [];
  const extensionMethods = [];
  const extensionTargets = new Set();
  const eventRegistrations = [];
  const dynamicImports = [];
  const globalPrototypeWrites = [];

  walk(ast, node => {
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration?.type === "VariableDeclaration") {
        for (const declaration of node.declaration.declarations) {
          if (declaration.id?.type === "Identifier") exports.push(declaration.id.name);
        }
      } else if (node.specifiers) {
        for (const specifier of node.specifiers) exports.push(nameOf(specifier.exported));
      }
    }

    if (node.type === "MethodDefinition") {
      classMethods.push({
        name: nameOf(node.key),
        kind: node.kind,
        static: Boolean(node.static),
        line_start: node.loc?.start.line ?? null,
        line_end: node.loc?.end.line ?? null,
        params: node.value?.params?.length ?? 0
      });
    }

    if (isActiveQueryExtend(node)) {
      const target = nameOf(node.arguments[0]);
      const properties = node.arguments[1]?.type === "ObjectExpression" ? node.arguments[1].properties : [];
      if (target) extensionTargets.add(target);
      for (const property of properties) {
        if (property.type !== "Property") continue;
        const descriptor = property.value;
        const descriptorProperties = descriptor?.type === "ObjectExpression" ? descriptor.properties : [];
        const kinds = descriptorProperties
          .filter(item => item.type === "Property")
          .map(item => nameOf(item.key))
          .filter(key => ["value", "get", "set"].includes(key));
        extensionMethods.push({
          target,
          name: nameOf(property.key),
          descriptor_kinds: kinds,
          line_start: property.loc?.start.line ?? null,
          line_end: property.loc?.end.line ?? null
        });
      }
    }

    if (node.type === "CallExpression" && node.callee?.type === "MemberExpression" && node.callee.property?.name === "addEventListener") {
      eventRegistrations.push({ line: node.loc?.start.line ?? null });
    }

    if (node.type === "ImportExpression") {
      dynamicImports.push({ line: node.loc?.start.line ?? null });
    }

    if (node.type === "AssignmentExpression" && node.left?.type === "MemberExpression") {
      const left = source.slice(node.left.start, node.left.end);
      if (/\b(?:Object|Element|NodeList|Array|String|Number|Function|Window|Document|Navigator)\.prototype\b/.test(left) || /^window\s*\[/.test(left)) {
        globalPrototypeWrites.push({ target: left, line: node.loc?.start.line ?? null });
      }
    }
  });

  return {
    label,
    git_blob_sha: gitBlobSha(source),
    bytes: Buffer.byteLength(source),
    exports: [...new Set(exports)].sort(),
    class_methods: classMethods.sort((a, b) => (a.line_start || 0) - (b.line_start || 0)),
    extension_targets: [...extensionTargets].sort(),
    extension_methods: extensionMethods.sort((a, b) => (a.line_start || 0) - (b.line_start || 0)),
    event_listener_calls: eventRegistrations,
    dynamic_imports: dynamicImports,
    global_prototype_writes: globalPrototypeWrites
  };
}

const sourcePath = process.argv[2] || "./vendor/ActiveQuery.js";
const minPath = process.argv[3] || "./vendor/ActiveQuery.min.js";
const outputPath = process.argv[4] || "./knowledgebase/aqjs/generated-ast-catalog.json";
const sourceText = fs.readFileSync(sourcePath, "utf8");
const minText = fs.readFileSync(minPath, "utf8");
const sourceCatalog = analyze(sourceText, "source");
const minCatalog = analyze(minText, "minified");

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const summary = {
  class_method_count: sourceCatalog.class_methods.length,
  extension_target_count: sourceCatalog.extension_targets.length,
  extension_method_count: sourceCatalog.extension_methods.length,
  event_listener_call_count: sourceCatalog.event_listener_calls.length,
  dynamic_import_count: sourceCatalog.dynamic_imports.length,
  global_prototype_write_count: sourceCatalog.global_prototype_writes.length
};

const catalog = {
  schema_version: 1,
  summary,
  generated_by: "tools/build-aqjs-catalog.mjs",
  parser: "Acorn AST",
  source: {
    repository: "https://github.com/ActiveQuery/JS",
    version: sourceText.match(/ActiveQuery JS v([^\s]+)/)?.[1] || null,
    source_file: sourcePath,
    minified_file: minPath
  },
  parity: {
    exports_match: same(sourceCatalog.exports, minCatalog.exports),
    class_method_names_match: same(sourceCatalog.class_methods.map(x => [x.name, x.kind, x.static]), minCatalog.class_methods.map(x => [x.name, x.kind, x.static])),
    extension_targets_match: same(sourceCatalog.extension_targets, minCatalog.extension_targets),
    extension_method_names_match: same(sourceCatalog.extension_methods.map(x => [x.target, x.name, x.descriptor_kinds]), minCatalog.extension_methods.map(x => [x.target, x.name, x.descriptor_kinds]))
  },
  source: sourceCatalog,
  minified: minCatalog
};

fs.mkdirSync(outputPath.substring(0, outputPath.lastIndexOf("/")), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2) + "\n");
process.stdout.write(JSON.stringify({ source: sourceCatalog.git_blob_sha, minified: minCatalog.git_blob_sha, summary, parity: catalog.parity }, null, 2) + "\n");
