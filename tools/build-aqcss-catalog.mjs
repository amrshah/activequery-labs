import fs from "node:fs";
import crypto from "node:crypto";
import postcss from "postcss";

const sourcePath = process.argv[2] || "./vendor/ActiveQuery.css";
const outputPath = process.argv[3] || "./knowledgebase/aqcss/generated-ast-catalog.json";
const css = fs.readFileSync(sourcePath, "utf8");
const root = postcss.parse(css, { from: sourcePath });

const rules = [];
const classMap = new Map();
const customProperties = new Map();
const mediaQueries = [];

function ancestors(node) {
  const stack = [];
  let parent = node.parent;
  while (parent && parent.type !== "root") {
    if (parent.type === "atrule") stack.unshift({ name: parent.name, params: parent.params, line: parent.source?.start?.line });
    parent = parent.parent;
  }
  return stack;
}

root.walkAtRules("media", rule => {
  mediaQueries.push({ params: rule.params, line: rule.source?.start?.line });
});

root.walkRules(rule => {
  const selector = rule.selector || "";
  const classes = [...new Set([...selector.matchAll(/\.([A-Za-z_][\w-]*)/g)].map(match => match[1]))];
  const item = {
    id: rules.length + 1,
    selector,
    context: ancestors(rule),
    line_start: rule.source?.start?.line ?? null,
    line_end: rule.source?.end?.line ?? null,
    declarations: (rule.nodes || [])
      .filter(node => node.type === "decl")
      .map(node => ({
        property: node.prop,
        value: node.value,
        important: Boolean(node.important),
        line: node.source?.start?.line ?? null
      })),
    class_tokens: classes
  };
  rules.push(item);

  for (const name of classes) {
    if (!classMap.has(name)) classMap.set(name, { name, rule_ids: [], lines: [], selectors: [] });
    const entry = classMap.get(name);
    entry.rule_ids.push(item.id);
    if (item.line_start != null) entry.lines.push(item.line_start);
    if (entry.selectors.length < 12 && !entry.selectors.includes(selector)) entry.selectors.push(selector);
  }
});

root.walkDecls(decl => {
  if (!decl.prop.startsWith("--")) return;
  if (!customProperties.has(decl.prop)) customProperties.set(decl.prop, { declarations: [], references: [] });
  customProperties.get(decl.prop).declarations.push({
    value: decl.value,
    line: decl.source?.start?.line ?? null,
    selector: decl.parent?.selector || null,
    context: ancestors(decl.parent)
  });
});

root.walkDecls(decl => {
  for (const match of decl.value.matchAll(/var\(\s*(--[\w-]+)/g)) {
    if (!customProperties.has(match[1])) customProperties.set(match[1], { declarations: [], references: [] });
    customProperties.get(match[1]).references.push({
      line: decl.source?.start?.line ?? null,
      property: decl.prop,
      value: decl.value,
      selector: decl.parent?.selector || null,
      context: ancestors(decl.parent)
    });
  }
});

const sourceBuffer = Buffer.from(css, "utf8");
const gitBlobHeader = Buffer.from(`blob ${sourceBuffer.length}\0`, "utf8");
const gitBlobSha = crypto.createHash("sha1").update(Buffer.concat([gitBlobHeader, sourceBuffer])).digest("hex");
const classEntries = [...classMap.values()]
  .map(entry => ({ ...entry, lines: [...new Set(entry.lines)].sort((a, b) => a - b) }))
  .sort((a, b) => a.name.localeCompare(b.name));
const customEntries = Object.fromEntries([...customProperties.entries()].sort(([a], [b]) => a.localeCompare(b)));

const catalog = {
  schema_version: 1,
  generated_by: "tools/build-aqcss-catalog.mjs",
  source: {
    repository: "https://github.com/ActiveQuery/CSS",
    file: sourcePath,
    version: css.match(/ActiveQuery CSS v([^\\s]+)/)?.[1] || null,
    git_blob_sha: gitBlobSha
  },
  parser: "PostCSS AST",
  summary: {
    rule_count: rules.length,
    unique_selector_text_count: new Set(rules.map(rule => rule.selector)).size,
    unique_class_token_count: classEntries.length,
    declared_custom_property_count: [...customProperties.values()].filter(item => item.declarations.length).length,
    custom_property_names_in_declarations_or_references: customProperties.size,
    media_query_count: mediaQueries.length
  },
  media_queries: mediaQueries,
  rules,
  classes: classEntries,
  custom_properties: customEntries
};

fs.mkdirSync(outputPath.substring(0, outputPath.lastIndexOf("/")), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2) + "\n");
process.stdout.write(JSON.stringify(catalog.summary, null, 2) + "\n");
