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
      ["LICENSE.txt", "95913d2c7e4ef8d4b8d23cc9c67e5f3b3d3b5b1a"]
    ]
  },
  {
    repo: "JS",
    commit: "adb1b19770ca68840dc2f9e62de556a324bee2fa",
    files: [
      ["ActiveQuery.js", "b8ec9e5be8668d048eea3385cd9012dfddb69cf0"],
      ["ActiveQuery.min.js", "594d778cd5fefe2caa039a7904343e385b77a50c"],
      ["LICENSE.txt", "28eb7c9d4b3d4f4f87d4a4f9a2c3c5e1b7d9f010"]
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

      const destinations = [
        join(root, "vendor", revision.repo === "CSS" ? `AQCSS-${filename}` : `AQJS-${filename}`),
        join(root, "rebuild", "vendor", revision.repo === "CSS" ? `AQCSS-${filename}` : `AQJS-${filename}`)
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
