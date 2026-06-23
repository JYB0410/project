/**
 * AdSense 검수 3회 사이클: adsense-audit + site-audit + audit-content
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(label, args) {
  console.log(`\n--- ${label} ---`);
  const r = spawnSync("node", args, { cwd: ROOT, encoding: "utf8", shell: true });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return r.status ?? 1;
}

let ok = true;
for (let i = 1; i <= 3; i++) {
  console.log(`\n========== AdSense 검수 사이클 ${i}/3 ==========`);
  if (run("build-site", ["scripts/build-site.mjs"]) !== 0) ok = false;
  if (run("patch-adsense-head", ["scripts/patch-adsense-head.mjs"]) !== 0) ok = false;
  if (run(`adsense-audit cycle ${i}`, [`scripts/adsense-audit.mjs`, `--cycle=${i}`]) !== 0) ok = false;
  if (run(`site-audit cycle ${i}`, [`scripts/site-audit.mjs`, `--cycle=${i}`]) !== 0) ok = false;
  if (run("audit-content", ["scripts/audit-content.mjs"]) !== 0) ok = false;
}

process.exit(ok ? 0 : 1);