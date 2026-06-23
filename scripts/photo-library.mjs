/** Pexels 실사 반려동물 사진 풀 (검증된 ID) */
export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export const PHOTO_POOL = {
  checklist: [1108099, 7516523, 406014, 1490908],
  calendar: [2253275, 1805164, 7310228, 8473722],
  supplies: [978695, 1254140, 4587995, 6235010],
  grooming: [613978, 7210282, 7210646, 8473433],
  health: [1851164, 5733421, 6342109, 1493583],
  cozy: [3299901, 7516523, 1643457, 1108099],
  safety: [3772313, 3935984, 8473712, 4587995],
  ventilation: [3772313, 3935984, 8473712, 3039077],
  feeding: [978695, 6234636, 1254140, 2607544],
  walk: [2253275, 1805164, 2607544, 3039077],
  travel: [7310228, 8473722, 406014, 2253275],
  play: [1851164, 1108099, 1254140, 7210646],
  sleep: [3299901, 1643457, 7516523, 613978],
  guests: [1805164, 1108099, 8473722, 406014],
  multi: [1108099, 1493583, 1851164, 2253275],
  litter: [1493583, 613978, 7210282, 5733421]
};

const sceneKeys = Object.keys(PHOTO_POOL);

export function pickScene(slug, sectionId, title) {
  const t = `${sectionId} ${title} ${slug}`.toLowerCase();
  if (/walk|산책|paw|발/.test(t)) return "walk";
  if (/car|travel|이동|차/.test(t)) return "travel";
  if (/feed|급여|food|사료|간식|treat|snack|slow|storage|water|물/.test(t)) return "feeding";
  if (/groom|dental|구강|빗|그루밍/.test(t)) return "grooming";
  if (/litter|화장실|모래/.test(t)) return "litter";
  if (/observ|record|관찰|메모|health|건강/.test(t)) return "health";
  if (/safe|proof|balcony|window|환기|odor|ventil|season|공간|환경/.test(t)) {
    return /ventil|odor|환기/.test(t) ? "ventilation" : "safety";
  }
  if (/cozy|rest|sleep|휴식|수면|quiet/.test(t)) return "sleep";
  if (/play|놀이|indoor/.test(t)) return "play";
  if (/guest|손님/.test(t)) return "guests";
  if (/family|가족|agreement/.test(t)) return "calendar";
  if (/suppl|용품|supply/.test(t)) return "supplies";
  if (/multi|다견|다묘/.test(t)) return "multi";
  if (/check|list|week|첫|routine|루틴|daily|design/.test(t)) {
    return /calendar|루틴|daily|design/.test(t) ? "calendar" : "checklist";
  }
  if (/moving|이사/.test(t)) return "travel";
  return sceneKeys[hash(`${slug}-${sectionId}`) % sceneKeys.length];
}

export function pickPhotoId(slug, sectionId, title) {
  const scene = pickScene(slug, sectionId, title);
  const pool = PHOTO_POOL[scene];
  return pool[hash(`${slug}-${sectionId}-photo`) % pool.length];
}

export function pexelsUrl(photoId) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop`;
}