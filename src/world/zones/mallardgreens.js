// Mallard Greens, the gated suburb: curving lanes fitted through the bible's control points,
// houses in the four approved colours along them, a golf course, a lake, a wall all round. Pure
// data, read by map.js (roads come from `paths`, lots from `lotList`). Numbers and names are from
// plan/bible/world/mallard-greens.md. Tier C lanes (Dodo Drive, Loon Lane, Buzzard Bend) and the
// Easement Track are not built.

const X0 = -3200, X1 = -800, Z0 = -2700, Z1 = -1500;
export const APPROVED = [0xf5ecd7, 0xb7c9a8, 0xc9cdd4, 0xf0d0c8];        // cream, sage, dove, blush
export const WALL = { east: -810, south: -1540, north: -2430, west: -3190, jogX: -2650, jogZ: -2680 };
export const CLUB = { x: -2000, z: -2100, r: 90 }, LAKE = { x: -2700, z: -1900, a: 220, b: 150 }, GATE = { x: -905, z: -1898 }, MODEL = { x: -1081, z: -2300, rot: -Math.PI / 2 };
export const PONDS = [[-1850, -2318, 9], [-1822, -2334, 7], [-1838, -2296, 6]];

// ---------- lanes: Catmull-Rom splines through control points, cut into pieces of about 35 m ----------
const r1 = (v) => Math.round(v * 10) / 10;
function spline(P, step = 35) {
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2, n = Math.max(1, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
      out.push(k ? [r1(f(p0[0], p1[0], p2[0], p3[0])), r1(f(p0[1], p1[1], p2[1], p3[1]))] : p1);
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
// a ring of n points; `first` is a point on it that must be hit exactly (where a lane joins)
function ring(cx, cz, r, n, first) {
  const a0 = first ? Math.atan2(first[0] - cx, first[1] - cz) : 0, out = [];
  for (let k = 0; k < n; k++) { const a = a0 + (k / n) * Math.PI * 2; out.push(first && k === 0 ? first : [r1(cx + Math.sin(a) * r), r1(cz + Math.cos(a) * r)]); }
  out.push(out[0]);
  return out;
}
const LANES = [
  ['Fairway Drive', [[-900, -1900], [-1020, -1885], [-1160, -1830], [-1200, -1815], [-1320, -1770], [-1480, -1790], [-1620, -1880], [-1760, -1990], [-1900, -2070], [-1910, -2100]], { cart: true, id: 'fairway-drive' }],
  ['Fairway Drive', [[-2090, -2100], [-2180, -2130], [-2300, -2200], [-2420, -2240], [-2560, -2260], [-2700, -2300], [-2840, -2390], [-2940, -2460], [-3000, -2500]], { cart: true, id: 'fairway-drive-west' }],
  ['Starling Approach', [[-800, -1800], [-850, -1840], [-900, -1900]], { lots: false }],
  ['Grackle Lane', [[-1100, -2340], [-1108, -2200], [-1135, -2060], [-1175, -1930], [-1200, -1815], [-1225, -1700], [-1245, -1600]]],
  ['Muscovy Court', [[-1108, -2200], [-1040, -2190], [-960, -2210], [-900, -2250]]],
  ['Goose Crossing', [[-1020, -1885], [-1010, -1980], [-985, -2090], [-960, -2210]]],
  ['Pigeon Place', [[-1225, -1700], [-1150, -1680], [-1060, -1660], [-980, -1620]]],
  ['Coot Circle', [[-1480, -1790], [-1514, -1752]], { lots: false, id: 'coot-circle-stem' }],
  ['Gull Close', [[-1620, -1880], [-1640, -1830], [-1660, -1780]]],
  ['Vulture Loop', [[-1985, -1720], [-1900, -1700], [-1800, -1690], [-1740, -1740], [-1745, -1830], [-1810, -1880], [-1900, -1860], [-1975, -1850]]],
  ['Crow Court', [[-1900, -1860], [-1870, -1810], [-1840, -1770]]],
  ['Cormorant Way', [[-2000, -1520], [-2000, -1600], [-1985, -1720], [-1978, -1800], [-1975, -1850], [-1990, -1950], [-2000, -2010]]],
  ['Magpie Mews', [[-1978, -1800], [-2030, -1810], [-2045, -1870], [-2040, -1930]]],
  ['Ibis Bend', [[-2000, -1600], [-2100, -1585], [-2250, -1580], [-2400, -1600], [-2550, -1650], [-2700, -1680], [-2850, -1690], [-2960, -1740], [-3030, -1850], [-3030, -1960], [-2990, -2050]]],
  ['Moorhen Court', [[-2550, -1650], [-2560, -1600], [-2600, -1575]]],
  ['Anhinga Lane', [[-3030, -1850], [-2990, -1870], [-2930, -1900]], { lots: false }],
  ['Limpkin Loop', [[-2700, -2300], [-2725, -2220], [-2780, -2150], [-2870, -2120], [-2950, -2150], [-2975, -2230], [-2930, -2300], [-2840, -2390]]],
];
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const lane = (name, pts, o = {}) => ({ id: o.id || slug(name), name, kind: 'lane', width: 10, lanes: 1, offsets: [2.5], speed: 8.3, level: 0, pts, lots: o.lots !== false, cart: !!o.cart, oneWay: !!o.oneWay });
const paths = LANES.map(([name, P, o]) => lane(name, spline(P), o));
// Clubhouse Circle: a one-way ring through its east, south and west points, where Fairway Drive and Cormorant Way meet it
paths.push(lane('Clubhouse Circle', ring(CLUB.x, CLUB.z, CLUB.r, 16, [-1910, -2100]).map(([x, z]) => (Math.abs(x - -2090) < 0.2 ? [-2090, -2100] : Math.abs(z - -2010) < 0.2 ? [-2000, -2010] : [x, z])), { lots: false, oneWay: true }));
paths.push(lane('Coot Circle', ring(-1560, -1700, 70, 12, [-1514, -1752]), { id: 'coot-circle' }));
// Gander Road: the 14 m frontage road outside the south wall; it becomes Rebate Road at x = -800 and carries an expressway ramp at each end
const gander = [];
for (let x = -2400; x < -800; x += 100) gander.push([x, -1520]);
gander.push([-800, -1520]);
paths.push({ id: 'gander-road', name: 'Gander Road', kind: 'street', width: 14, lanes: 1, offsets: [3.5], speed: 11.1, level: 0, pts: gander, lots: false });

// ---------- the golf course (section 11): tee, green, par ----------
export const HOLES = [[-1890, -2120, -1620, -2105, 4], [-1600, -2060, -1680, -1975, 3], [-1650, -1950, -1450, -1860, 4], [-1450, -1905, -1460, -2050, 3], [-1455, -2090, -1470, -2370, 4],
  [-1500, -2395, -1880, -2390, 5], [-1900, -2350, -1790, -2290, 3], [-1760, -2310, -1540, -2290, 4], [-1520, -2230, -1880, -2210, 5], [-2110, -2180, -2140, -2390, 4],
  [-2190, -2390, -2300, -2280, 3], [-2290, -2160, -2200, -1900, 4], [-2240, -1870, -2400, -2130, 4], [-2380, -2270, -2450, -2400, 3], [-2510, -2380, -2600, -2130, 4],
  [-2560, -2100, -2440, -1740, 5], [-2410, -1740, -2190, -1660, 4], [-2150, -1650, -2100, -2010, 5]].map(([tx, tz, gx, gz, par], i) => ({ n: i + 1, tx, tz, gx, gz, par, half: i === 8 ? 30 : 20 }));

// ---------- neighbourhoods (the bible's tests, in order) ----------
const hoods = [
  { id: 'the-easement', name: 'The Easement', x0: -2650, x1: X1, z0: Z0, z1: WALL.north },
  { id: 'the-gatehouse', name: 'The Gatehouse', x0: -1000, x1: X1, z0: -2050, z1: -1700 },
  { id: 'model-mile', name: 'Model Mile', x0: -1400, x1: X1, z0: Z0, z1: Z1, shares: [['mg-two', 50], ['mg-ranch', 30], ['mg-villa', 20]], show: true },
  { id: 'clubhouse-circle', name: 'Clubhouse Circle', x0: -2200, x1: -1800, z0: -2250, z1: -1950 },
  { id: 'phase-four', name: 'Phase Four', x0: X0, x1: -2650, z0: Z0, z1: -2330 },
  { id: 'lake-serenity', name: 'Lake Serenity', x0: X0, x1: -2650, z0: -2330, z1: Z1, shares: [['mg-two', 85], ['mg-ranch', 15]], frontage: 28 },
  { id: 'lake-serenity', name: 'Lake Serenity', x0: -2650, x1: -2450, z0: -2100, z1: Z1, shares: [['mg-two', 85], ['mg-ranch', 15]], frontage: 28 },
  { id: 'the-fairways', name: 'The Fairways', x0: X0, x1: X1, z0: Z0, z1: Z1, shares: [['mg-ranch', 45], ['mg-two', 35], ['mg-villa', 20]] },
];
const hoodAt = (x, z) => hoods.find((h) => x >= h.x0 && x < h.x1 && z >= h.z0 && z < h.z1);
// sizes: w along the lane, d back from it. The Teal is 22 wide here so two fit side by side on a 24 m frontage.
const kit = { 'mg-ranch': { recipe: 'mg-ranch', w: 18, d: 12, floors: 1, h: 5.6 }, 'mg-two': { recipe: 'mg-two', w: 20, d: 12, floors: 2, h: 8.4 }, 'mg-villa': { recipe: 'mg-villa', w: 22, d: 12, floors: 1, h: 5.6 } };

// ---------- lots: a house every 24 m down both sides of every lane, wherever nothing is in the way ----------
const segD = (x, z, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1))); return Math.hypot(ax + dx * t - x, az + dz * t - z); };
const roadD = (x, z) => { let d = 1e9; for (const p of paths) for (let i = 0; i < p.pts.length - 1; i++) d = Math.min(d, segD(x, z, p.pts[i][0], p.pts[i][1], p.pts[i + 1][0], p.pts[i + 1][1]) - (p.width - 10) / 2); return d; };
const inLake = (x, z, pad = 0) => ((x - LAKE.x) / (LAKE.a + pad)) ** 2 + ((z - LAKE.z) / (LAKE.b + pad)) ** 2 < 1;
const lotList = [];
function free(x, z) {
  if (x < WALL.west + 22 || x > WALL.east - 22 || z > WALL.south - 22 || z < WALL.north + 22) return false;
  if (Math.hypot(x - CLUB.x, z - CLUB.z) < CLUB.r + 34 || Math.hypot(x - MODEL.x, z - MODEL.z) < 25 || inLake(x, z, 16)) return false;
  for (const h of HOLES) if (segD(x, z, h.tx, h.tz, h.gx, h.gz) < h.half + 10) return false;
  for (const l of lotList) if (Math.hypot(x - l.cx, z - l.cz) < 22.5) return false;
  return roadD(x, z) >= 17.5;
}
let seedAt = 7;
const hash = () => { seedAt = (Math.imul(seedAt, 1103515245) + 12345) >>> 0; return seedAt / 4294967296; };
paths.forEach((p, pi) => {
  if (!p.lots) return;
  const col = [Math.floor(hash() * 4), 0]; col[1] = (col[0] + 2) % 4;
  let at = 14, i = 0, base = 0;
  const len = (k) => Math.hypot(p.pts[k + 1][0] - p.pts[k][0], p.pts[k + 1][1] - p.pts[k][1]);
  const total = p.pts.slice(0, -1).reduce((s, _, k) => s + len(k), 0);
  while (at < total - 10) {
    while (i < p.pts.length - 2 && at > base + len(i)) { base += len(i); i++; }
    const t = (at - base) / len(i), ux = (p.pts[i + 1][0] - p.pts[i][0]) / len(i), uz = (p.pts[i + 1][1] - p.pts[i][1]) / len(i);
    const x = p.pts[i][0] + ux * len(i) * t, z = p.pts[i][1] + uz * len(i) * t, hood = hoodAt(x, z);
    if (hood && hood.shares) for (const side of [0, 1]) {
      const s = side ? 1 : -1, cx = r1(x - uz * s * 19), cz = r1(z + ux * s * 19);
      if (!free(cx, cz)) continue;
      let pick = hash() * 100, recipe = hood.shares[0][0];
      for (const [id, share] of hood.shares) { pick -= share; if (pick < 0) { recipe = id; break; } }
      const k = kit[recipe], rot = Math.atan2(uz * s, -ux * s), wall = APPROVED[col[side]++ % 4];        // the front looks back at the lane
      lotList.push({ id: `mallardgreens:${pi}:${lotList.length}`, zone: 'mallardgreens', hood: hood.id, lane: p.id, side, recipe, kit: k, cx, cz, rot, w: k.w, d: k.d, floors: k.floors, h: k.h, wall, show: !!hood.show,
        x0: cx - 14, x1: cx + 14, z0: cz - 14, z1: cz + 14, body: { x0: cx - 11, x1: cx + 11, z0: cz - 11, z1: cz + 11 }, seed: lotList.length * 7919 + 13, sides: {} });
    }
    at += (hood && hood.frontage) || 24;
  }
});

const HERO = [
  { id: 'clubhouse', x0: -2045, x1: -1955, z0: -2135, z1: -2065, h: 25, body: APPROVED[0], hood: 'clubhouse-circle' },
  { id: 'model-home', x0: -1095, x1: -1067, z0: -2314, z1: -2286, h: 9, body: APPROVED[3], hood: 'model-mile' },
];
// plan/bible/world/mallard-greens.md section 6. Birdie, the golf cart, falls to grouper until it is built.
const DAY = { traffic: { birdie: 7, grouper: 4, tarpon: 3, pompano: 1 }, peds: { retiree: 10, jogger: 3 } };
const NIGHT = { traffic: { birdie: 2, grouper: 1 }, peds: { retiree: 1 }, cap: 0.15 };

export default {
  id: 'mallardgreens', name: 'Mallard Greens',
  bounds: { x0: X0, x1: X1, z0: Z0, z1: Z1 },
  seed: 7701,
  roads: { lines: [] },
  lots: 'spline',
  generator: 'mallardgreens',
  rows: [], kit, hoods, paths, lotList, holes: HOLES,
  hero: HERO, reserved: [],
  // lawn everywhere a lane is not
  surfaceAt(x, z, map) { return map.roadAt(x, z) ? 'road' : inLake(x, z) ? 'water' : 'grass'; },
  landmarks: {
    gatehouse: { x: -900, z: -1900, w: 18, d: 10, h: 5, level: 0 },
    clubhouse: { x: -2000, z: -2100, w: 64, d: 40, h: 25, level: 0 },
    'model-home': { x: -1100, z: -2300, w: 22, d: 36, h: 9, level: 0 },
    'hedge-hole': { x: -2450, z: -2420, w: 2, d: 2, h: 2, level: 0 },
    'lake-serenity': { x: -2700, z: -1900, w: 440, d: 300, h: 12, level: 0 },
  },
  places: [
    { id: 'gatehouse-barrier', kind: 'mission', x: -900, z: -1900 }, { id: 'clubhouse-office', kind: 'mission', x: -2025, z: -2100 },
    { id: 'birdie-rank', kind: 'vehicles', x: -1955, z: -2100 }, { id: 'hedge-hole', kind: 'mission', x: -2450, z: -2420 },
  ],
  traffic: DAY.traffic, peds: DAY.peds, night: NIGHT, streetSpeed: 5.8, parked: 0, hangOut: 0.1,
  ambience: 'suburb',
  palette: 'mallardgreens',
};
