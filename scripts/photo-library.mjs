/** Pexels 실사 사진 — 제빵·빵 R&D 테마 + 사이트 전역 중복 방지 */

export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** 카테고리 간 ID 중복 없음 */
export const PHOTO_POOL = {
  loaf: [209206, 1351238, 1775049, 30350363, 5949880, 5957640, 958545, 248444, 1279330],
  dough: [3825137, 2433286, 2434277, 2433809, 5766515, 3829226, 13989981, 2147491, 1129446],
  oven: [30350363, 13989981, 4253127, 6749790, 6808383, 5412160, 5692271],
  bakery: [206756, 1775048, 7518163, 7937458, 8063609, 6155642, 7045746, 3271359],
  pastry: [4253127, 3829226, 4491283, 1028741, 349609],
  study: [768833, 374016, 143133, 1300975, 768875, 261763, 1457847],
  chestnut: [2894215, 1435907, 172289, 256455, 318429, 590022],
  tools: [7937458, 8063609, 4491283, 6155642, 7045746, 1022385],
  kitchen: [1022385, 349609, 1028741, 1703272, 70497, 2433286],
  exam: [206756, 5412160, 768833, 7937458, 1775048],
  general: [2147491, 1279330, 5949880, 1703272, 248444]
};

const ALL_PHOTO_IDS = [...new Set(Object.values(PHOTO_POOL).flat())];
const sceneKeys = Object.keys(PHOTO_POOL);

export function pickScene(slug, sectionId, title = "") {
  const t = `${slug} ${sectionId} ${title}`.toLowerCase();

  if (/night-bread|밤|chestnut|memory-detail|ingredient/.test(t)) return "chestnut";
  if (/written|필기|wrong-note|past-exam|materials-nutrition|hygiene|confusion/.test(t)) return "study";
  if (/dough|반죽|ferment|발효|knead|shaping|성형|repeat-method/.test(t)) return "dough";
  if (/oven|굽기|baking|steam|예열|baking-failures/.test(t)) return "oven";
  if (/exam-day|시험|합격|pass-moment|day-before|practical-day|mental-prep/.test(t)) return "exam";
  if (/practical|실기|time-practice|roadmap|month-|weekly/.test(t)) return "bakery";
  if (/rd-format|failures|one-variable|compare-store|weekly-rd/.test(t)) return "loaf";
  if (/tools|scale|저울|메모|log/.test(t)) return "tools";
  if (/childhood|why-baker|intro|goal|series-purpose|night-bread-bridge/.test(t)) return "loaf";
  if (/pastry|croissant|danish/.test(t)) return "pastry";
  if (/kitchen|집|home/.test(t)) return "kitchen";

  return sceneKeys[hash(`${slug}/${sectionId}`) % sceneKeys.length];
}

const SCENE_FALLBACK_ORDER = {
  loaf: ["loaf", "bakery", "dough", "general"],
  dough: ["dough", "kitchen", "tools", "bakery", "general"],
  oven: ["oven", "bakery", "dough", "loaf", "general"],
  bakery: ["bakery", "dough", "loaf", "tools", "general"],
  pastry: ["pastry", "loaf", "bakery", "general"],
  study: ["study", "tools", "general"],
  chestnut: ["chestnut", "loaf", "pastry", "general"],
  tools: ["tools", "kitchen", "bakery", "general"],
  kitchen: ["kitchen", "dough", "tools", "general"],
  exam: ["exam", "bakery", "study", "tools", "general"],
  general: ["general", "loaf", "bakery", "dough"]
};

function buildCandidateList(slug, sectionId, title, usedIds) {
  const scene = pickScene(slug, sectionId, title);
  const chain = SCENE_FALLBACK_ORDER[scene] || [scene, "general"];
  const ordered = [];

  for (const s of chain) {
    const pool = PHOTO_POOL[s] || [];
    const start = hash(`${slug}-${sectionId}-${s}`) % (pool.length || 1);
    for (let i = 0; i < pool.length; i++) {
      const id = pool[(start + i) % pool.length];
      if (!usedIds.has(id) && !ordered.includes(id)) ordered.push(id);
    }
  }

  const allStart = hash(`${slug}-${sectionId}-fallback`) % ALL_PHOTO_IDS.length;
  for (let i = 0; i < ALL_PHOTO_IDS.length; i++) {
    const id = ALL_PHOTO_IDS[(allStart + i) % ALL_PHOTO_IDS.length];
    if (!usedIds.has(id) && !ordered.includes(id)) ordered.push(id);
  }

  return ordered.map((photoId) => ({ photoId, scene }));
}

export function assignPhotoId(slug, sectionId, title = "", usedIds = new Set()) {
  const candidates = buildCandidateList(slug, sectionId, title, usedIds);
  if (!candidates.length) throw new Error(`사용 가능한 Pexels ID가 없습니다: ${slug}/${sectionId}`);
  const pick = candidates[0];
  usedIds.add(pick.photoId);
  return pick;
}

export function photoCandidates(slug, sectionId, title = "", usedIds = new Set()) {
  return buildCandidateList(slug, sectionId, title, usedIds);
}

export function pickPhotoId(slug, sectionId, title = "") {
  return assignPhotoId(slug, sectionId, title).photoId;
}

export function pexelsUrl(photoId) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop`;
}

export function pexelsPageUrl(photoId) {
  return `https://www.pexels.com/photo/${photoId}/`;
}