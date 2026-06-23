#!/usr/bin/env node
/**
 * 관리자 비밀번호 초기 설정
 * 사용: node scripts/setup-admin.js
 * 또는: node scripts/setup-admin.js "새비밀번호"
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const SECRETS_PATH = path.join(__dirname, "..", "admin.secrets.json");

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
}

function generateSecrets(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const sessionSecret = crypto.randomBytes(32).toString("hex");
  return {
    passwordHash: hashPassword(password, salt),
    salt,
    sessionSecret,
    createdAt: new Date().toISOString()
  };
}

async function promptHidden(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  let password = process.argv[2];

  if (!password) {
    password = await promptHidden("관리자 비밀번호 (8자 이상): ");
  }

  if (!password || password.length < 8) {
    console.error("비밀번호는 8자 이상이어야 합니다.");
    process.exit(1);
  }

  if (fs.existsSync(SECRETS_PATH)) {
    console.error("admin.secrets.json 이 이미 있습니다. 삭제 후 다시 실행하세요.");
    process.exit(1);
  }

  const secrets = generateSecrets(password);
  fs.writeFileSync(SECRETS_PATH, JSON.stringify(secrets, null, 2), { mode: 0o600 });
  console.log("admin.secrets.json 생성 완료");
  console.log("이 파일은 .gitignore에 포함되어 있으며 Git에 올리지 마세요.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});