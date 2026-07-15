/** 멀티 소스 실사 사진 — Pexels · Unsplash · Flickr(CC), 사이트 전역 중복 방지 */

export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function assetKey(asset) {
  return `${asset.provider}:${asset.id}`;
}

/** @typedef {{ provider: 'pexels'|'unsplash'|'flickr', id: string|number, scene?: string }} PhotoAsset */

export const PHOTO_POOL = {
  loaf: [
    { provider: "pexels", id: 209206 },
    { provider: "unsplash", id: "photo-1509440159596-0249088772ff" },
    { provider: "flickr", id: "https://live.staticflickr.com/2355/2104039823_b47da37172_b.jpg" },
    { provider: "pexels", id: 1279330 },
    { provider: "pexels", id: 1351238 },
    { provider: "unsplash", id: "photo-1608198093002-ad4e005484ec" },
    { provider: "pexels", id: 1775049 },
    { provider: "pexels", id: 2147491 },
    { provider: "flickr", id: "https://live.staticflickr.com/8062/8224279272_2e2c4f1fab_b.jpg" },
    { provider: "unsplash", id: "photo-1447933601403-0c6688de566e" },
    { provider: "pexels", id: 30350363 },
    { provider: "pexels", id: 4020258 },
    { provider: "pexels", id: 4029410 },
    { provider: "pexels", id: 4037555 }
  ],
  dough: [
    { provider: "pexels", id: 3825137 },
    { provider: "unsplash", id: "photo-1558961363-fa8fdf82db35" },
    { provider: "pexels", id: 13989981 },
    { provider: "flickr", id: "https://live.staticflickr.com/5068/5625929260_30ac2592cf_b.jpg" },
    { provider: "pexels", id: 2433286 },
    { provider: "pexels", id: 2434277 },
    { provider: "flickr", id: "https://live.staticflickr.com/4136/4885975867_6ce119a598_b.jpg" },
    { provider: "pexels", id: 5766515 },
    { provider: "pexels", id: 4020696 },
    { provider: "pexels", id: 4030565 },
    { provider: "pexels", id: 13989981 }
  ],
  oven: [
    { provider: "pexels", id: 4253127 },
    { provider: "unsplash", id: "photo-1578985545062-69928b1d9587" },
    { provider: "pexels", id: 4027439 },
    { provider: "flickr", id: "https://live.staticflickr.com/5615/14911108243_9e4deaf8f4_b.jpg" },
    { provider: "pexels", id: 6749790 },
    { provider: "flickr", id: "https://live.staticflickr.com/3786/13201200753_966b02869e_b.jpg" },
    { provider: "pexels", id: 5412160 },
    { provider: "pexels", id: 4027439 },
    { provider: "pexels", id: 4035741 }
  ],
  bakery: [
    { provider: "pexels", id: 206756 },
    { provider: "unsplash", id: "photo-1549931319-a545dcf3bc73" },
    { provider: "pexels", id: 1775048 },
    { provider: "pexels", id: 4031619 },
    { provider: "pexels", id: 7518163 },
    { provider: "pexels", id: 6155642 },
    { provider: "pexels", id: 4021869 },
    { provider: "pexels", id: 4031619 }
  ],
  pastry: [
    { provider: "pexels", id: 3829226 },
    { provider: "pexels", id: 1129446 },
    { provider: "pexels", id: 4020325 },
    { provider: "pexels", id: 4034485 }
  ],
  study: [
    { provider: "pexels", id: 768833 },
    { provider: "flickr", id: "https://live.staticflickr.com/8533/8639203494_9fb4221076_b.jpg" },
    { provider: "unsplash", id: "photo-1509440159596-0249088772ff" },
    { provider: "flickr", id: "https://live.staticflickr.com/2916/13681294573_e1cc6c5d3b_b.jpg" },
    { provider: "pexels", id: 374016 },
    { provider: "pexels", id: 143133 },
    { provider: "pexels", id: 768875 }
  ],
  chestnut: [
    { provider: "pexels", id: 2894215 },
    { provider: "flickr", id: "https://live.staticflickr.com/65535/53905337338_58bcaa2032_b.jpg" },
    { provider: "unsplash", id: "photo-1608198093002-ad4e005484ec" },
    { provider: "pexels", id: 1435907 },
    { provider: "pexels", id: 172289 },
    { provider: "pexels", id: 318429 },
    { provider: "pexels", id: 4022207 }
  ],
  tools: [
    { provider: "pexels", id: 7937458 },
    { provider: "unsplash", id: "photo-1558961363-fa8fdf82db35" },
    { provider: "pexels", id: 4025949 },
    { provider: "pexels", id: 4491283 },
    { provider: "pexels", id: 4025949 },
    { provider: "pexels", id: 4037528 }
  ],
  kitchen: [
    { provider: "pexels", id: 1022385 },
    { provider: "flickr", id: "https://live.staticflickr.com/6105/6325111011_8e7ee63e04_b.jpg" },
    { provider: "unsplash", id: "photo-1447933601403-0c6688de566e" },
    { provider: "flickr", id: "https://live.staticflickr.com/4015/4711558191_c88b17589e.jpg" },
    { provider: "pexels", id: 1703272 },
    { provider: "pexels", id: 4030606 },
    { provider: "pexels", id: 70497 }
  ],
  exam: [
    { provider: "pexels", id: 5412160 },
    { provider: "unsplash", id: "photo-1549931319-a545dcf3bc73" },
    { provider: "pexels", id: 768833 },
    { provider: "pexels", id: 8063609 }
  ],
  storage: [
    { provider: "pexels", id: 5949880 },
    { provider: "unsplash", id: "photo-1578985545062-69928b1d9587" },
    { provider: "pexels", id: 4036557 },
    { provider: "pexels", id: 248444 }
  ],
  general: [
    { provider: "pexels", id: 2147491 },
    { provider: "unsplash", id: "photo-1509440159596-0249088772ff" },
    { provider: "pexels", id: 1279330 },
    { provider: "pexels", id: 4037556 }
  ]
};

const ALL_ASSETS = [...new Set(Object.values(PHOTO_POOL).flat().map(assetKey))].map((k) => {
  for (const pool of Object.values(PHOTO_POOL)) {
    const found = pool.find((a) => assetKey(a) === k);
    if (found) return found;
  }
  return null;
}).filter(Boolean);

const sceneKeys = Object.keys(PHOTO_POOL);

export function pickScene(slug, sectionId, title = "") {
  const t = `${slug} ${sectionId} ${title}`.toLowerCase();

  if (/night-bread|밤|chestnut|memory-detail|ingredient|syrup/.test(t)) return "chestnut";
  if (/storage|보관|cooling|식힌|다음 날|next-day|mid-review/.test(t)) return "storage";
  if (/written|필기|wrong-note|past-exam|materials|study|series-guide/.test(t)) return "study";
  if (/dough|반죽|ferment|발효|knead|shaping|성형|hydration|수분/.test(t)) return "dough";
  if (/oven|굽기|baking|steam|예열/.test(t)) return "oven";
  if (/exam-day|시험|합격|pass-moment|day-before|practical-day/.test(t)) return "exam";
  if (/practical|실기|time-practice|roadmap|month-|weekly/.test(t)) return "bakery";
  if (/rd-format|failures|one-variable|compare|weekly-rd|goal|^next$/.test(t)) return "loaf";
  if (/다음 시도|이후에 올|6차 이후/.test(t)) return "storage";
  if (/tools|scale|저울|메모|log/.test(t)) return "tools";
  if (/childhood|why-baker|intro|series-purpose|night-bread-bridge/.test(t)) return "loaf";
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
  storage: ["storage", "loaf", "kitchen", "general"],
  general: ["general", "loaf", "bakery", "dough"]
};

const PROVIDER_ROTATION = [
  ["flickr", "unsplash", "pexels"],
  ["pexels", "flickr", "unsplash"],
  ["unsplash", "pexels", "flickr"],
  ["flickr", "pexels", "unsplash"],
  ["unsplash", "flickr", "pexels"],
  ["pexels", "unsplash", "flickr"]
];

function providerOrder(slug, sectionId) {
  return PROVIDER_ROTATION[hash(`${slug}-${sectionId}-provider`) % PROVIDER_ROTATION.length];
}

function buildCandidateList(slug, sectionId, title, usedKeys) {
  const scene = pickScene(slug, sectionId, title);
  const chain = SCENE_FALLBACK_ORDER[scene] || [scene, "general"];
  const providers = providerOrder(slug, sectionId);
  const ordered = [];

  for (const s of chain) {
    const pool = PHOTO_POOL[s] || [];
    const start = hash(`${slug}-${sectionId}-${s}`) % (pool.length || 1);
    for (let pass = 0; pass < providers.length; pass++) {
      const want = providers[pass];
      for (let i = 0; i < pool.length; i++) {
        const asset = pool[(start + i) % pool.length];
        if (asset.provider !== want) continue;
        const key = assetKey(asset);
        if (!usedKeys.has(key) && !ordered.some((a) => assetKey(a) === key)) {
          ordered.push({ ...asset, scene: s });
        }
      }
    }
    for (let i = 0; i < pool.length; i++) {
      const asset = pool[(start + i) % pool.length];
      const key = assetKey(asset);
      if (!usedKeys.has(key) && !ordered.some((a) => assetKey(a) === key)) {
        ordered.push({ ...asset, scene: s });
      }
    }
  }

  const allStart = hash(`${slug}-${sectionId}-fallback`) % ALL_ASSETS.length;
  for (let i = 0; i < ALL_ASSETS.length; i++) {
    const asset = ALL_ASSETS[(allStart + i) % ALL_ASSETS.length];
    const key = assetKey(asset);
    if (!usedKeys.has(key) && !ordered.some((a) => assetKey(a) === key)) {
      ordered.push({ ...asset, scene });
    }
  }

  return ordered;
}

export function assignPhotoAsset(slug, sectionId, title = "", usedKeys = new Set()) {
  const candidates = buildCandidateList(slug, sectionId, title, usedKeys);
  if (!candidates.length) throw new Error(`사용 가능한 사진 없음: ${slug}/${sectionId}`);
  const pick = candidates[0];
  usedKeys.add(assetKey(pick));
  return pick;
}

export function photoCandidates(slug, sectionId, title = "", usedKeys = new Set()) {
  return buildCandidateList(slug, sectionId, title, usedKeys);
}

const FETCH_HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; bcstarts-blog/1.0)" };

export function isValidImageBuffer(buf) {
  if (!buf || buf.length < 15000) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true;
  if (/<!DOCTYPE|<html/i.test(buf.slice(0, 200).toString("utf8"))) return false;
  return false;
}

export function downloadUrl(asset, { width = 1200, height = 675 } = {}) {
  if (asset.provider === "pexels") {
    return `https://images.pexels.com/photos/${asset.id}/pexels-photo-${asset.id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;
  }
  if (asset.provider === "unsplash") {
    return `https://images.unsplash.com/${asset.id}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;
  }
  if (asset.provider === "flickr") {
    const base = String(asset.id);
    if (base.includes("staticflickr.com") && base.endsWith("_b.jpg")) {
      return base.replace("_b.jpg", "_z.jpg");
    }
    if (base.includes("wikimedia.org")) {
      const thumb = base.includes("/thumb/")
        ? base.replace(/\/\d+px-/, `/1280px-`)
        : base;
      return thumb;
    }
    return base;
  }
  throw new Error(`Unknown provider: ${asset.provider}`);
}

export function creditLabel(asset) {
  if (asset.provider === "pexels") return "Pexels";
  if (asset.provider === "unsplash") return "Unsplash";
  if (asset.provider === "flickr") {
    return String(asset.id).includes("wikimedia.org") ? "Wikimedia" : "Flickr CC";
  }
  return "Stock";
}

export function sourcePageUrl(asset) {
  if (asset.provider === "pexels") return `https://www.pexels.com/photo/${asset.id}/`;
  if (asset.provider === "unsplash") return `https://unsplash.com/photos/${String(asset.id).replace(/^photo-/, "")}`;
  if (asset.provider === "flickr") return String(asset.id);
  return "";
}

export { FETCH_HEADERS };

/** @deprecated */
export function pexelsUrl(photoId) {
  return downloadUrl({ provider: "pexels", id: photoId });
}