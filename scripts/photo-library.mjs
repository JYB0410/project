/** Pexels 실사 반려동물 사진 — 카테고리별 풀 + 사이트 전역 중복 방지 */

export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

/** 카테고리 간 ID 중복 없음 (136개) */
export const PHOTO_POOL = {
  walk: [32138086, 37118957, 35826718, 19175821, 18423161, 31173351, 681686, 1493111],
  feeding: [
    8434670, 8056255, 8584574, 36034310, 19231164, 33507210, 34485569, 1490908, 978695, 16395151,
    16366333, 19022002, 14770947, 6234636, 13702948, 69372, 4000314, 458800, 17409770, 220938
  ],
  grooming: [6234609, 19021958, 12943750, 19022002, 6235115, 3981763, 7678415, 7678416],
  health: [6235651, 6235019, 7008099, 30337930, 33394245, 30338195, 7210300, 1254140],
  home: [10672058, 16588117, 20065728, 28397653, 34905034, 15100854, 8473712, 38224234],
  travel: [13569303, 13702948, 10522707, 17984200, 35651203, 29040678, 28468158, 7310228],
  play: [576296, 30398762, 130764, 2306899, 14320533, 12810453, 16196769, 7210673],
  sleep: [1546351, 19176926, 3299901, 16264430, 31308251, 2248516, 3764318, 7329892],
  cat: [1170986, 208984, 979247, 2072373, 685350, 5667026, 32054246, 32171575],
  dog: [406014, 220938, 2253275, 1108099, 458799, 1851164, 2027884, 1276553],
  puppy: [1805164, 1805544, 458801, 69372, 4000314, 458800, 17409770, 1576151],
  supplies: [28948927, 31923181, 16395147, 18723525, 25583838, 36048399, 978695, 6235010],
  safety: [28657260, 30157132, 7210748, 33834401, 29265319, 14938954, 30586499, 34527500],
  weather: [29932035, 20424486, 19296628, 20154064, 21365496, 2607544, 19432610, 35363342],
  litter: [13705497, 13705506, 33898492, 28787686, 35206655, 28176029, 11174018, 1696584],
  multi: [16366333, 14770947, 16395151, 10954785, 12064408, 19490689, 33415928, 9952105],
  general: [14610317, 8570243, 7527369, 34071784, 20736349, 35511894, 35406086, 35614411]
};

const ALL_PHOTO_IDS = [...new Set(Object.values(PHOTO_POOL).flat())];
const sceneKeys = Object.keys(PHOTO_POOL);

export function pickScene(slug, sectionId, title = "") {
  const t = `${sectionId} ${title} ${slug}`.toLowerCase();
  const key = `${slug}/${sectionId}`;

  // 급여·사료 전환 (비율≠비 오는 날)
  if (
    /food-transition|feeding-schedule|treat-and-snack|slow-feeding|food-storage|water-intake|급여|사료|간식|전환|비율|mix-schedule|snack-rules/.test(
      t
    )
  )
    return "feeding";
  if (/groom|dental|구강|빗|그루밍|발톱|bath-and-wipe|partial-wash|wipe-routine|목욕|부분.?세척|dry-after/.test(t))
    return "grooming";
  if (/weather-walk|hot-weather|cold-weather|rain-humidity|폭염|한파|더위|습도|미세|장마|소나기|비 오는/.test(t))
    return "weather";
  if (/rainy-season|why-humidity|paw-dry|ear-belly|indoor-humidity|skin-watch|장마철|습기/.test(t))
    return "weather";
  if (/walk|산책|paw-care|paw|발바닥|outdoor/.test(t)) return "walk";
  if (/car-travel|moving-with|carrier|이동장|차량|차 안/.test(t)) return "travel";
  if (/first-vet|vet-visit|병원|observ|관찰|warning-sign|구토/.test(t)) return "health";
  if (/litter|화장실|모래/.test(t)) return "litter";
  if (/indoor-play|놀이|play/.test(t)) return "play";
  if (/quiet-time|rest-and-sleep|수면|휴식|sleep/.test(t)) return "sleep";
  if (/odor|ventil|환기|냄새|seasonal-home/.test(t)) return "home";
  if (/balcony|window|pet-proof|safe-space|multi-pet|안전/.test(t)) return "safety";
  if (/essential-supplies|용품|supply|bring-list/.test(t)) return "supplies";
  if (/multi-pet|다견|다묘/.test(t)) return "multi";
  if (/cat|고양이|litter-box/.test(t)) return "cat";
  if (/puppy|퍼피/.test(t)) return "puppy";
  if (/dog|강아지/.test(t)) return "dog";
  if (/family-agreement|가족|guest|손님/.test(t)) return "home";
  if (/first-week|overnight|alone-time|welcoming|daily-routine/.test(t)) return "general";

  return sceneKeys[hash(key) % sceneKeys.length];
}

const SCENE_FALLBACK_ORDER = {
  feeding: ["feeding", "dog", "puppy", "cat", "supplies", "general"],
  grooming: ["grooming", "health", "dog", "cat", "general"],
  health: ["health", "grooming", "dog", "cat", "general"],
  walk: ["walk", "dog", "puppy", "weather", "play", "general"],
  weather: ["weather", "walk", "dog", "general"],
  travel: ["travel", "dog", "puppy", "general"],
  sleep: ["sleep", "cat", "dog", "home", "general"],
  play: ["play", "dog", "puppy", "cat", "general"],
  litter: ["litter", "cat", "home", "general"],
  home: ["home", "cat", "dog", "safety", "general"],
  safety: ["safety", "home", "dog", "cat", "general"],
  supplies: ["supplies", "dog", "home", "general"],
  multi: ["multi", "dog", "cat", "general"],
  cat: ["cat", "litter", "sleep", "general"],
  dog: ["dog", "puppy", "walk", "play", "general"],
  puppy: ["puppy", "dog", "play", "feeding", "general"],
  general: ["general", "dog", "cat", "home", "feeding"]
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

/**
 * 사이트 전역 usedIds Set으로 동일 Pexels ID 재사용 방지.
 */
export function assignPhotoId(slug, sectionId, title = "", usedIds = new Set()) {
  const candidates = buildCandidateList(slug, sectionId, title, usedIds);
  if (!candidates.length) throw new Error(`사용 가능한 Pexels ID가 없습니다: ${slug}/${sectionId}`);
  const pick = candidates[0];
  usedIds.add(pick.photoId);
  return pick;
}

/** 다운로드 실패(404 등) 시 다음 후보 시도용 */
export function photoCandidates(slug, sectionId, title = "", usedIds = new Set()) {
  return buildCandidateList(slug, sectionId, title, usedIds);
}

/** @deprecated assignPhotoId 사용 권장 */
export function pickPhotoId(slug, sectionId, title = "") {
  return assignPhotoId(slug, sectionId, title).photoId;
}

export function pexelsUrl(photoId) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop`;
}