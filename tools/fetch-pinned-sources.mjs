import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = process.cwd();
const temp = mkdtempSync(join(tmpdir(), "activequery-pinned-"));

const revisions = [
  {
    repo: "CSS",
    commit: "6f479f6a3f315d2623af79dd49c84cb379b52473",
    files: [
      ["ActiveQuery.css", "c03546ecd1a41d26cbbfa8f1e31d38731f77cf62"],
      ["ActiveQuery.min.css", "bdda032d530661c32d9a9351a4ae95219347f081"],
      ["LICENSE.txt", "95913ab0528af615935ad360fe4ab42feb09ed3d"]
    ]
  },
  {
    repo: "JS",
    commit: "adb1b19770ca68840dc2f9e62de556a324bee2fa",
    files: [
      ["ActiveQuery.js", "b8ec9e5be8668d048eea3385cd9012dfddb69cf0"],
      ["ActiveQuery.min.js", "594d778cd5fefe2caa039a7904343e385b77a50c"],
      ["LICENSE.txt", "28eb6b57f17f9af993123b943fa6eae63be43ac2"]
    ]
  }
];

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: "inherit" });
}

function gitBlobSha(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`);
  return createHash("sha1").update(header).update(buffer).digest("hex");
}

try {
  for (const revision of revisions) {
    const checkout = join(temp, revision.repo.toLowerCase());
    run("git", ["clone", "--filter=blob:none", "--no-checkout", `https://github.com/ActiveQuery/${revision.repo}.git`, checkout]);
    run("git", ["-C", checkout, "checkout", revision.commit]);

    for (const [filename, expectedSha] of revision.files) {
      const sourcePath = join(checkout, filename);
      if (!existsSync(sourcePath)) throw new Error(`Missing pinned source file: ${revision.repo}/${filename}`);
      const bytes = readFileSync(sourcePath);
      const actualSha = gitBlobSha(bytes);
      if (actualSha !== expectedSha) {
        throw new Error(`Pinned blob mismatch for ${revision.repo}/${filename}: expected ${expectedSha}, received ${actualSha}`);
      }

      const outputName = filename === "LICENSE.txt" ? `${revision.repo}-LICENSE.txt` : filename;
      const destinations = [
        join(root, "vendor", outputName),
        join(root, "rebuild", "vendor", outputName)
      ];
      for (const destination of destinations) {
        mkdirSync(resolve(destination, ".."), { recursive: true });
        cpSync(sourcePath, destination);
      }
    }
  }

  console.log("Pinned AQCSS/AQJS source and license blobs verified and staged.");
} finally {
  rmSync(temp, { recursive: true, force: true });
}
