#!/usr/bin/env node
/**
 * Static source inventory helper for ActiveQuery.
 * This is a discovery aid, not a semantic parser or API compatibility guarantee.
 * Usage: node tools/aq-inspect.mjs --css path/to/ActiveQuery.css --js path/to/ActiveQuery.js --out aq-inventory.json
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i += 1) {
  if (args[i].startsWith("--")) options[args[i].slice(2)] = args[++i];
}
if (!options.css && !options.js) {
  console.error("Provide --css and/or --js source file paths.");
  process.exit(2);
}
const result = { generatedAt: new Date().toISOString(), note: "Static lexical inventory only. Verify semantics manually and in a browser." };
if (options.css) {
  const source = fs.readFileSync(options.css, "utf8");
  const clean = source.replace(/\/\*[\s\S]*?\*\//g, "");
  result.aqcss = {
    source: path.basename(options.css),
    classSelectors: [...new Set([...clean.matchAll(/\.([A-Za-z_][\w-]*)/g)].map(match => match[1]))].sort(),
    mediaQueries: [...new Set([...clean.matchAll(/@media\s*([^\{]+)/g)].map(match => match[1].trim()))].sort()
  };
}
if (options.js) {
  const source = fs.readFileSync(options.js, "utf8");
  const methods = [];
  source.split(/\r?\n/).forEach((line, index) => {
    const match = line.match(/^\s{10,13}(?:static\s+)?(?:async\s+)?([A-Za-z_$][\w$]*)\s*\((.*)$/);
    if (match && !["if", "for", "switch", "while", "catch"].includes(match[1])) {
      methods.push({ name: match[1], line: index + 1, signatureStart: match[2].trim() });
    }
  });
  result.aqjs = {
    source: path.basename(options.js),
    namedExports: [...new Set([...source.matchAll(/export\s+(?:const|class|function)\s+([A-Za-z_$][\w$]*)/g)].map(match => match[1]))],
    methodCandidates: methods,
    warning: "Method candidates are indentation-based discovery hints; inspect class scope, signatures, return values and side effects before documenting."
  };
}
const output = JSON.stringify(result, null, 2) + "\n";
if (options.out) fs.writeFileSync(options.out, output);
else process.stdout.write(output);
