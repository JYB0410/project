import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data/posts.js");

let postsJs = fs.readFileSync(postsPath, "utf8");
const before = (postsJs.match(/photo-credit/g) || []).length;
postsJs = postsJs.replace(/<span class=\\"photo-credit\\">[^<]*<\/span>/g, "");
fs.writeFileSync(postsPath, postsJs);
const after = (postsJs.match(/photo-credit/g) || []).length;
console.log(`✓ photo-credit ${before} → ${after}`);