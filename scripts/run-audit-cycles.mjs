/**
 * 검수 → 보완 힌트 → 빌드 3회 사이클 실행
 * 사용: node scripts/run-audit-cycles.mjs
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", shell: true });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return r.status ?? 1;
}

const cycles = 3;
let lastOk = true;

for (let i = 1; i <= cycles; i++) {
  console.log(`\n========== 검수 사이클 ${i}/${cycles} ==========\n`);
  if (i === 1) {
    run("node", ["scripts/scatter-dates.mjs"]);
  }
  run("node", ["scripts/build-site.mjs"]);
  const code = run("node", ["scripts/site-audit.mjs", `--cycle=${i}`]);
  run("node", ["scripts/audit-content.mjs"]);
  if (code !== 0) {
    lastOk = false;
    console.log(`\n⚠ 사이클 ${i}에서 오류 발견 — 수동 보완 후 재실행하세요.`);
  }
}

process.exit(lastOk ? 0 : 1);