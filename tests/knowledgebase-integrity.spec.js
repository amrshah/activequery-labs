import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return entry.isFile() && entry.name.toLowerCase().endsWith(".md") ? [target] : [];
  });
}

test("knowledgebase and agent-skill Markdown links resolve locally", async () => {
  const files = [...markdownFiles("./knowledgebase"), ...markdownFiles("./skills")];
  const broken = [];

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8").replace(/```[\s\S]*?```/g, "");
    for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      let target = match[1].trim().replace(/^<|>$/g, "").split(/\s+/)[0];
      if (!target || /^(?:https?:|mailto:|data:|#)/i.test(target)) continue;
      target = target.split("#")[0].split("?")[0];
      if (!target) continue;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
      if (!fs.existsSync(resolved)) broken.push(`${file}: ${target}`);
    }
  }

  expect(broken, broken.join("\n")).toEqual([]);
});
