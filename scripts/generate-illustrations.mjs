import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "assets", "images", "illustrations");

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function palette(key) {
  const hues = [212, 28, 158, 98, 268, 42, 185, 320, 175, 55];
  const h = hues[hash(key) % hues.length];
  return {
    bg1: `hsl(${h}, 42%, 97%)`,
    bg2: `hsl(${h}, 55%, 92%)`,
    accent: `hsl(${h}, 68%, 48%)`,
    accentSoft: `hsl(${h}, 60%, 88%)`,
    ink: "#1d1d1f",
    muted: `hsl(${h}, 12%, 58%)`,
    white: "#ffffff"
  };
}

function wrap(id, p, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img" aria-labelledby="${id}-t">
  <title id="${id}-t">${id}</title>
  <defs>
    <linearGradient id="${id}-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}"/><stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
    <filter id="${id}-sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="960" height="540" fill="url(#${id}-bg)"/>
  ${body}
</svg>`;
}

const scenes = {
  checklist(p, id) {
    return wrap(id, p, `
  <rect x="200" y="90" width="560" height="360" rx="28" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="240" y="130" width="200" height="16" rx="8" fill="${p.accentSoft}"/>
  <rect x="240" y="160" width="140" height="12" rx="6" fill="${p.bg2}"/>
  ${[0,1,2,3,4].map(i => `
  <rect x="250" y="${210+i*44}" width="22" height="22" rx="6" fill="none" stroke="${p.accent}" stroke-width="2.5"/>
  <path d="M256 ${222+i*44}l5 5 10-12" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="290" y="${214+i*44}" width="${180-i*20}" height="12" rx="6" fill="${p.bg2}"/>`).join("")}
  <circle cx="680" cy="300" r="72" fill="${p.accentSoft}"/>
  <circle cx="680" cy="290" r="36" fill="${p.accent}"/>
  <ellipse cx="680" cy="318" rx="22" ry="16" fill="${p.white}"/>
  <circle cx="668" cy="282" r="5" fill="${p.white}"/><circle cx="692" cy="282" r="5" fill="${p.white}"/>
`);
  },
  calendar(p, id) {
    return wrap(id, p, `
  <rect x="180" y="100" width="600" height="340" rx="28" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="180" y="100" width="600" height="64" rx="28" fill="${p.accent}"/>
  <rect x="180" y="148" width="600" height="16" fill="${p.accent}"/>
  ${[0,1,2,3,4,5,6].map(i => `<rect x="${220+i*76}" y="190" width="56" height="56" rx="12" fill="${i===3?p.accentSoft:p.bg2}" stroke="${i===3?p.accent:"none"}" stroke-width="2"/>`).join("")}
  ${[0,1,2].map(r => [0,1,2,3,4,5,6].map(c => `<rect x="${228+c*76}" y="${268+r*56}" width="40" height="8" rx="4" fill="${c===2&&r===1?p.accent:p.bg2}" opacity="${c===2&&r===1?1:0.7}"/>`).join("")).join("")}
  <circle cx="780" cy="180" r="50" fill="${p.accent}" opacity="0.9"/>
  <path d="M755 180h50M780 155v50" stroke="${p.white}" stroke-width="4" stroke-linecap="round"/>
`);
  },
  supplies(p, id) {
    return wrap(id, p, `
  <rect x="160" y="280" width="640" height="24" rx="12" fill="${p.muted}" opacity="0.25"/>
  ${[[240,220,120,140],[400,200,100,160],[540,210,130,150]].map(([x,y,w,h],i) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="${x+16}" y="${y+20}" width="${w-32}" height="10" rx="5" fill="${p.bg2}"/>
  <circle cx="${x+w/2}" cy="${y+h-36}" r="20" fill="${i===1?p.accent:p.accentSoft}"/>`).join("")}
  <ellipse cx="720" cy="250" rx="55" ry="45" fill="${p.accentSoft}"/>
  <ellipse cx="720" cy="265" rx="35" ry="28" fill="${p.accent}" opacity="0.35"/>
`);
  },
  grooming(p, id) {
    return wrap(id, p, `
  <rect x="200" y="120" width="280" height="300" rx="24" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="240" y="160" width="200" height="12" rx="6" fill="${p.bg2}"/>
  <rect x="240" y="190" width="160" height="12" rx="6" fill="${p.bg2}"/>
  <rect x="520" y="180" width="48" height="180" rx="16" fill="${p.accentSoft}" stroke="${p.accent}" stroke-width="2"/>
  ${[0,1,2,3,4,5,6,7].map(i => `<rect x="528" y="${200+i*18}" width="32" height="6" rx="3" fill="${p.accent}" opacity="0.5"/>`).join("")}
  <ellipse cx="360" cy="360" rx="90" ry="50" fill="${p.accentSoft}"/>
  <circle cx="330" cy="330" r="40" fill="${p.accent}"/>
  <circle cx="318" cy="322" r="6" fill="${p.white}"/><circle cx="342" cy="322" r="6" fill="${p.white}"/>
`);
  },
  health(p, id) {
    return wrap(id, p, `
  <rect x="180" y="110" width="420" height="320" rx="28" fill="${p.white}" filter="url(#${id}-sh)"/>
  <polyline points="220,350 280,300 340,320 400,240 460,260 520,180" fill="none" stroke="${p.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="520" cy="180" r="8" fill="${p.accent}"/>
  ${[0,1,2,3].map(i => `<rect x="220" y="${380+i*0}" width="0" height="0"/>`).join("")}
  <path d="M660 200c0-55 45-100 100-100s100 45 100 100-45 100-100 100" fill="${p.accentSoft}"/>
  <path d="M760 170v60M730 200h60" stroke="${p.accent}" stroke-width="10" stroke-linecap="round"/>
  <rect x="220" y="380" width="360" height="2" fill="${p.bg2}"/>
`);
  },
  cozy(p, id) {
    return wrap(id, p, `
  <path d="M120 400 L120 200 L400 120 L760 200 L760 400 Z" fill="${p.white}" opacity="0.6"/>
  <rect x="280" y="300" width="400" height="16" rx="8" fill="${p.muted}" opacity="0.2"/>
  <rect x="340" y="260" width="280" height="56" rx="20" fill="${p.accentSoft}" filter="url(#${id}-sh)"/>
  <ellipse cx="480" cy="220" rx="70" ry="55" fill="${p.accent}" opacity="0.2"/>
  <circle cx="450" cy="200" r="8" fill="${p.accent}"/><circle cx="510" cy="200" r="8" fill="${p.accent}"/>
  <rect x="620" y="160" width="120" height="160" rx="12" fill="${p.white}" filter="url(#${id}-sh)"/>
  <circle cx="680" cy="220" r="28" fill="${p.accentSoft}"/>
`);
  },
  safety(p, id) {
    return wrap(id, p, `
  <rect x="200" y="140" width="360" height="280" rx="20" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="240" y="180" width="80" height="100" rx="8" fill="${p.bg2}"/>
  <rect x="340" y="200" width="180" height="12" rx="6" fill="${p.bg2}"/>
  <rect x="340" y="230" width="140" height="12" rx="6" fill="${p.bg2}"/>
  <circle cx="620" cy="280" r="100" fill="none" stroke="${p.accent}" stroke-width="6" opacity="0.4"/>
  <circle cx="620" cy="280" r="70" fill="${p.accentSoft}"/>
  <path d="M590 280l25 25 50-55" fill="none" stroke="${p.accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M200 380h560" stroke="${p.muted}" stroke-width="3" opacity="0.2"/>
`);
  },
  ventilation(p, id) {
    return wrap(id, p, `
  <rect x="300" y="100" width="360" height="360" rx="16" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="340" y="140" width="280" height="200" rx="8" fill="${p.accentSoft}" opacity="0.5"/>
  <line x1="340" y1="140" x2="340" y2="340" stroke="${p.accent}" stroke-width="3"/>
  ${[0,1,2].map(i => `<path d="M700 ${180+i*50} Q760 ${200+i*50} 820 ${180+i*50}" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round" opacity="${0.9-i*0.2}"/>`).join("")}
  <ellipse cx="480" cy="400" rx="120" ry="30" fill="${p.accentSoft}"/>
  <circle cx="440" cy="370" r="24" fill="${p.accent}"/>
`);
  },
  feeding(p, id) {
    return wrap(id, p, `
  <ellipse cx="480" cy="420" rx="200" ry="35" fill="${p.muted}" opacity="0.2"/>
  <path d="M300 420c0-100 60-180 180-180s180 80 180 180" fill="${p.white}" stroke="${p.accent}" stroke-width="3" filter="url(#${id}-sh)"/>
  <ellipse cx="480" cy="300" rx="120" ry="35" fill="${p.accent}" opacity="0.45"/>
  <ellipse cx="480" cy="290" rx="90" ry="25" fill="${p.accent}" opacity="0.7"/>
  <rect x="620" y="200" width="100" height="140" rx="12" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="640" y="230" width="60" height="8" rx="4" fill="${p.accentSoft}"/>
  <text x="670" y="290" text-anchor="middle" font-family="-apple-system,Segoe UI,sans-serif" font-size="28" font-weight="600" fill="${p.accent}">g</text>
`);
  },
  walk(p, id) {
    return wrap(id, p, `
  <path d="M140 400 Q280 280 420 340 T700 220" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round" opacity="0.35"/>
  <circle cx="200" cy="360" r="16" fill="${p.accentSoft}"/><circle cx="350" cy="320" r="12" fill="${p.accentSoft}"/><circle cx="550" cy="280" r="16" fill="${p.accentSoft}"/>
  <ellipse cx="320" cy="360" rx="50" ry="35" fill="${p.white}" filter="url(#${id}-sh)"/>
  <circle cx="300" cy="345" r="22" fill="${p.accent}"/>
  <circle cx="292" cy="340" r="4" fill="${p.white}"/><circle cx="308" cy="340" r="4" fill="${p.white}"/>
  <ellipse cx="580" cy="300" rx="40" ry="28" fill="${p.accent}" opacity="0.25"/>
  <rect x="680" y="180" width="8" height="120" rx="4" fill="${p.accent}" opacity="0.5"/>
  <circle cx="684" cy="170" r="35" fill="${p.accentSoft}"/>
`);
  },
  travel(p, id) {
    return wrap(id, p, `
  <rect x="180" y="280" width="600" height="120" rx="40" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="220" y="300" width="200" height="80" rx="16" fill="${p.accentSoft}" stroke="${p.accent}" stroke-width="2"/>
  <circle cx="320" cy="310" r="12" fill="${p.accent}" opacity="0.5"/>
  <circle cx="620" cy="360" r="44" fill="${p.bg2}"/><circle cx="720" cy="360" r="44" fill="${p.bg2}"/>
  <rect x="480" y="250" width="180" height="60" rx="12" fill="${p.accent}" opacity="0.15"/>
  <path d="M500 280h140" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/>
`);
  },
  play(p, id) {
    return wrap(id, p, `
  <circle cx="300" cy="360" r="40" fill="${p.accent}" opacity="0.8"/>
  <rect x="420" y="320" width="80" height="80" rx="12" fill="${p.white}" filter="url(#${id}-sh)" transform="rotate(15 460 360)"/>
  <ellipse cx="580" cy="380" rx="55" ry="35" fill="${p.accentSoft}"/>
  <path d="M650 300 Q700 250 750 300 Q700 350 650 300" fill="${p.accent}" opacity="0.4"/>
  <circle cx="480" cy="220" r="55" fill="${p.accentSoft}"/>
  <circle cx="460" cy="210" r="8" fill="${p.accent}"/><circle cx="500" cy="210" r="8" fill="${p.accent}"/>
  <path d="M470 235q20 12 40 0" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round"/>
`);
  },
  sleep(p, id) {
    return wrap(id, p, `
  <circle cx="720" cy="160" r="50" fill="${p.accentSoft}"/>
  <path d="M695 160a25 25 0 0 1 50 0" fill="${p.accent}" opacity="0.3"/>
  ${[0,1,2].map(i => `<circle cx="${760+i*30}" cy="${140+i*10}" r="4" fill="${p.accent}" opacity="0.4"/>`).join("")}
  <rect x="260" y="300" width="440" height="100" rx="24" fill="${p.white}" filter="url(#${id}-sh)"/>
  <ellipse cx="400" cy="280" rx="80" ry="50" fill="${p.accent}" opacity="0.2"/>
  <circle cx="370" cy="265" r="6" fill="${p.accent}" opacity="0.5"/><circle cx="430" cy="265" r="6" fill="${p.accent}" opacity="0.5"/>
`);
  },
  guests(p, id) {
    return wrap(id, p, `
  <rect x="380" y="100" width="200" height="360" rx="12" fill="${p.white}" filter="url(#${id}-sh)"/>
  <circle cx="480" cy="280" r="28" fill="${p.accentSoft}"/>
  <rect x="420" y="160" width="120" height="80" rx="8" fill="${p.bg2}"/>
  <rect x="200" y="200" width="140" height="200" rx="16" fill="${p.accentSoft}"/>
  <rect x="220" y="240" width="100" height="12" rx="6" fill="${p.accent}" opacity="0.5"/>
  <rect x="220" y="270" width="80" height="12" rx="6" fill="${p.bg2}"/>
  <ellipse cx="700" cy="360" rx="60" ry="40" fill="${p.accent}" opacity="0.2"/>
`);
  },
  multi(p, id) {
    return wrap(id, p, `
  <rect x="180" y="320" width="600" height="20" rx="10" fill="${p.muted}" opacity="0.2"/>
  <circle cx="360" cy="280" r="45" fill="${p.accent}"/>
  <circle cx="345" cy="270" r="7" fill="${p.white}"/><circle cx="375" cy="270" r="7" fill="${p.white}"/>
  <circle cx="580" cy="270" r="38" fill="${p.accentSoft}" stroke="${p.accent}" stroke-width="3"/>
  <circle cx="568" cy="262" r="6" fill="${p.accent}"/><circle cx="592" cy="262" r="6" fill="${p.accent}"/>
  <rect x="300" y="180" width="360" height="16" rx="8" fill="${p.bg2}"/>
  <rect x="340" y="210" width="280" height="12" rx="6" fill="${p.accentSoft}"/>
`);
  },
  litter(p, id) {
    return wrap(id, p, `
  <rect x="300" y="200" width="360" height="200" rx="20" fill="${p.white}" filter="url(#${id}-sh)"/>
  <rect x="320" y="280" width="320" height="80" rx="12" fill="${p.accentSoft}"/>
  ${[0,1,2,3,4].map(i => `<ellipse cx="${380+i*55}" cy="310" rx="18" ry="14" fill="${p.accent}" opacity="0.35"/>`).join("")}
  <ellipse cx="720" cy="260" rx="50" ry="40" fill="${p.accent}" opacity="0.2"/>
  <circle cx="700" cy="245" r="8" fill="${p.accent}"/><circle cx="730" cy="245" r="8" fill="${p.accent}"/>
`);
  }
};

const sceneKeys = Object.keys(scenes);

function pickScene(slug, sectionId, title) {
  const t = `${sectionId} ${title} ${slug}`.toLowerCase();
  if (/walk|산책|paw|발|산책/.test(t)) return "walk";
  if (/car|travel|이동|차/.test(t)) return "travel";
  if (/feed|급여|food|사료|간식|treat|snack|slow|storage|water|물/.test(t)) return "feeding";
  if (/groom|dental|구강|빗|그루밍|위생/.test(t)) return "grooming";
  if (/litter|화장실|모래/.test(t)) return "litter";
  if (/observ|record|관찰|메모|health|건강/.test(t)) return "health";
  if (/safe|proof|balcony|window|환기|odor|ventil|season|공간|환경/.test(t)) return /ventil|odor|환기/.test(t) ? "ventilation" : "safety";
  if (/cozy|rest|sleep|휴식|수면|quiet/.test(t)) return "sleep";
  if (/play|놀이|indoor/.test(t)) return "play";
  if (/guest|손님|family|가족|agreement/.test(t)) return /guest|손님/.test(t) ? "guests" : "calendar";
  if (/suppl|용품|supply/.test(t)) return "supplies";
  if (/multi|다견|다묘/.test(t)) return "multi";
  if (/check|list|week|첫|routine|루틴|daily|design/.test(t)) return /calendar|루틴|daily|design/.test(t) ? "calendar" : "checklist";
  if (/moving|이사/.test(t)) return "travel";
  return sceneKeys[hash(`${slug}-${sectionId}`) % sceneKeys.length];
}

export function generateIllustration(slug, sectionId, title) {
  const id = `${slug}-${sectionId}`.replace(/[^a-z0-9-]/gi, "-");
  const p = palette(`${slug}-${sectionId}`);
  const scene = pickScene(slug, sectionId, title);
  return { filename: `${sectionId}.svg`, svg: scenes[scene](p, id), scene };
}

export function writeIllustration(slug, sectionId, title) {
  const { filename, svg, scene } = generateIllustration(slug, sectionId, title);
  const dir = path.join(outDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), svg, "utf8");
  return { src: `../assets/images/illustrations/${slug}/${filename}`, scene };
}

if (process.argv[1]?.endsWith("generate-illustrations.mjs")) {
  const postsPath = path.join(__dirname, "..", "data", "posts.js");
  const posts = eval(fs.readFileSync(postsPath, "utf8").replace("window.POSTS_DATA = ", ""));
  let n = 0;
  for (const post of posts) {
    for (const sec of post.sections) {
      if (sec.id === "editor-note") continue;
      writeIllustration(post.slug, sec.id, sec.title);
      n++;
    }
  }
  console.log(`Generated ${n} unique illustrations in assets/images/illustrations/{slug}/`);
}