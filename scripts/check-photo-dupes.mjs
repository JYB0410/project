import fs from "fs";

const posts = Function(
  `return (${fs.readFileSync("data/posts.js", "utf8").replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`
)();
const manifest = JSON.parse(fs.readFileSync("data/photo-assignments.json", "utf8"));

const refs = new Set();
const idByPath = new Map();

for (const [slug, sections] of Object.entries(manifest.assignments)) {
  for (const [sec, meta] of Object.entries(sections)) {
    idByPath.set(`photos/${slug}/${sec}.jpg`, meta.photoId);
  }
}

const activeIds = [];
for (const post of posts) {
  for (const sec of post.sections) {
    const matches = sec.content?.match(/photos\/[^"']+\.jpg/g) || [];
    for (const m of matches) {
      refs.add(m);
      const id = idByPath.get(m.replace("../assets/images/", ""));
      if (id) activeIds.push(id);
    }
  }
}

const unique = new Set(activeIds);
const dupeIds = activeIds.filter((id, i) => activeIds.indexOf(id) !== i);

console.log(JSON.stringify({
  activeImageRefs: refs.size,
  activePexelsIds: activeIds.length,
  uniquePexelsIds: unique.size,
  duplicateIdCount: new Set(dupeIds).size,
  duplicateIds: [...new Set(dupeIds)]
}, null, 2));