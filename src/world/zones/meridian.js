// Meridian, downtown: a 1.6 by 1.1 km grid of glass and pastel-concrete towers behind the beach,
// with Coral Boulevard running up its middle to the Meridian Spire. Pure data, read by map.js.
// Numbers and names are from plan/bible/world/meridian.md. Every tower's shape is decided here as
// a list of tiers, so the full building, its far shell and the skyline are the same building.

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const Z0 = -1440, Z1 = -320, NORTH = -1397, FLOOR = 3.8;

// ---------- roads ----------
const NS = [[-772, 'Buttonwood Street'], [-692, 'Founders Avenue', 'avenue'], [-612, 'Mahogany Street'], [-532, 'Sapodilla Street'], [-452, 'Banyan Street'],
  [-372, 'Egret Avenue', 'avenue'], [-292, 'Gumbo-Limbo Street'], [-212, 'Cypress Street'], [-132, 'Satinleaf Street'], [-52, 'Plaza Street'],
  [132, 'Poinciana Street'], [212, 'Jacaranda Street'], [292, 'Sea Almond Street'], [372, 'Sandbar Avenue', 'avenue'], [452, 'Tamarind Street'],
  [532, 'Allspice Street'], [612, 'Pigeon Plum Street'], [692, 'Exchange Avenue', 'avenue'], [772, 'Ironwood Street']];
const EW = [[-357, 'Flamingo Avenue', 'avenue'], [-437, 'First Street'], [-517, 'Second Street'], [-597, 'Third Street'], [-677, 'Commerce Way', 'avenue'],
  [-757, 'Fifth Street'], [-837, 'Sixth Street'], [-917, 'Seventh Street'], [-997, 'Tower Way', 'avenue'], [-1077, 'Ninth Street'], [-1157, 'Tenth Street'],
  [-1237, 'Eleventh Street'], [-1317, 'Union Avenue', 'avenue'], [NORTH, 'Thirteenth Street']];
const CLOSED = {
  'Gumbo-Limbo Street': [[-517, -357]], 'First Street': [[-372, -212]],      // Bayfront Park
  'Cypress Street': [[-597, -517]],                                           // City Hall
  'Seventh Street': [[-52, 132]],                                             // Spire Plaza
};
const lines = [];
for (const [at, name, kind = 'street'] of NS) lines.push({ id: slug(name), pid: 'meridian:' + slug(name), name, axis: 'ns', at, from: NORTH, to: Z1, kind, closed: CLOSED[name] || [] });
for (const [at, name, kind = 'street'] of EW) lines.push({ id: slug(name), pid: 'meridian:' + slug(name), name, axis: 'ew', at, from: -800, to: 800, kind, closed: CLOSED[name] || [] });
// Coral Boulevard, 30 m with a palm median, from the beach to the Spire; north of Tower Way the same line is Kapok Street
lines.push({ id: 'coral-blvd', pid: 'meridian:coral-blvd', name: 'Coral Boulevard', axis: 'ns', at: 52, from: NORTH, to: Z1, kind: 'boulevard', width: 14,
  widths: [{ from: -837, to: Z1, width: 30 }], closed: [[-997, -837]],
  parts: [{ from: NORTH, to: -997, id: 'kapok-street', name: 'Kapok Street', kind: 'street' }] });

// block rows: the land between two east-west lines. The two thin strips at the district's edges hold no lots.
const half = (kind) => (kind === 'avenue' ? 11 : 7);
const rows = [{ id: 'S', z0: -357 + 11, z1: Z1, strip: true }];
for (let i = 0; i < EW.length - 1; i++) rows.push({ id: 'R' + i, z0: EW[i + 1][0] + half(EW[i + 1][2]), z1: EW[i][0] - half(EW[i][2]) });
rows.push({ id: 'N', z0: Z0, z1: NORTH - 7, strip: true });

// ---------- neighbourhoods and the kit ----------
// M6 to M9 are tier B: until they are built their share goes to M1 at the same height.
const hoods = [
  { id: 'bayfront', name: 'Bayfront', x0: -800, x1: 800, z0: -600, z1: Z1, h: [50, 100], halves: 0.5, shares: { M4: 25, M1: 75 } },
  { id: 'uptown', name: 'Uptown', x0: -800, x1: 800, z0: Z0, z1: -1100, h: [16, 120], halves: 0.4, shares: { M1: 90, M5: 10 } },
  { id: 'radio-row', name: 'Radio Row', x0: -800, x1: -300, z0: -1100, z1: -600, h: [22, 60], halves: 1, shares: { M1: 85, M4: 15 } },
  { id: 'the-exchange', name: 'The Exchange', x0: -300, x1: 800, z0: -1100, z1: -600, h: [120, 220], halves: 0, shares: { M2: 30, M5: 30, M1: 20, M3: 15, M4: 5 } },
];
const WALLS = { M1: [0xb8cfe0, 0xe0e0e6, 0xc4b8e0], M2: [0xe0e0e6, 0xd9b8c4, 0xe6d3b8], M3: [0xb8cfe0, 0xb8e0d3], M4: [0xe0e0e6, 0xb8cfe0], M5: [0xe0e0e6, 0xc4b8e0] };
const kit = {
  M1: { recipe: 'glass-slab', preset: 'slab', floors: [20, 45] }, M2: { recipe: 'stepped-tower', preset: 'stepped', floors: [25, 55] },
  M3: { recipe: 'glass-slab', preset: 'twin', floors: [18, 40] }, M4: { recipe: 'glass-slab', preset: 'curved', floors: [16, 36] },
  M5: { recipe: 'glass-slab', preset: 'plaza', floors: [30, 55] },
};
const CORAL = 0xff8f7a, CORAL_AT = { x: 96, z: -636 };       // First Bayhaven Savings: the one coral tower
const RADIO_TALL = [{ x: -492, z: -717 }, { x: -652, z: -957 }];   // Radio Row's two towers that reach 110 m
const inside = (r, p) => p.x > r.x0 && p.x < r.x1 && p.z > r.z0 && p.z < r.z1;
const rect = (cx, cz, w, d) => ({ x0: cx - w / 2, x1: cx + w / 2, z0: cz - d / 2, z1: cz + d / 2 });

// A tower as tiers: { x0, x1, z0, z1, y0, y1, col } boxes with window walls; `plain` tiers have
// none; `round` names a corner cut to a 12 m curve. Returns what the lot needs to carry.
function design(recipe, L, h, wall, rnd, corner) {
  const cx = (L.x0 + L.x1) / 2, cz = (L.z0 + L.z1) / 2, lw = L.x1 - L.x0, ld = L.z1 - L.z0, tiers = [], extra = {};
  if (recipe === 'M1') {                    // slab, 24 x 50, long side along the lot
    const turn = Math.abs(lw - ld) < 2 ? rnd() < 0.5 : lw > ld, w = Math.min(turn ? 50 : 24, lw - 2), d = Math.min(turn ? 24 : 50, ld - 2);
    tiers.push({ ...rect(cx, cz, w, d), y0: 0, y1: h - 3, col: wall });
    tiers.push({ ...rect(cx + (turn ? w / 5 : 0), cz + (turn ? 0 : d / 5), w / 2, d / 2), y0: h - 3, y1: h, col: 0xb7b0b8, plain: true });      // the plant box
  } else if (recipe === 'M2') {             // stepped, 44 x 44, setbacks of 6 m at 40%, 70% and 90% of the height
    const s = Math.min(44, lw, ld);
    [[0, 0.4, s], [0.4, 0.7, s - 12], [0.7, 0.9, s - 24], [0.9, 1, s - 36]].forEach(([a, b, w]) => tiers.push({ ...rect(cx, cz, w, w), y0: a * h, y1: b * h, col: wall }));
    extra.crown = 0xffffff;
  } else if (recipe === 'M3') {             // twin shafts 20 x 28, 12 m apart, on a three-floor podium 58 x 34
    const turn = rnd() < 0.5, pw = Math.min(58, turn ? ld : lw), tall = rnd() < 0.5 ? -1 : 1, top = h - 12;
    const at = (u, w, d) => (turn ? rect(cx, cz + u, d, w) : rect(cx + u, cz, w, d));
    tiers.push({ ...at(0, pw, 34), y0: 0, y1: 13.5, col: 0xe0e0e6, plain: true });
    tiers.push({ ...at(16 * tall, 20, 28), y0: 13.5, y1: top, col: wall });
    tiers.push({ ...at(-16 * tall, 20, 28), y0: 13.5, y1: 13.5 + (top - 13.5) * 0.85, col: wall });
    const m = at(16 * tall, 0.3, 0.3); extra.mast = { x: (m.x0 + m.x1) / 2, z: (m.z0 + m.z1) / 2, y0: top, y1: h };
  } else if (recipe === 'M4') {             // curved corner, 36 x 36, set into the lot's corner so the curve faces the crossing
    const c = corner || ['sw', 'se', 'ne', 'nw'][Math.floor(rnd() * 4)], s = Math.min(36, lw, ld);
    const x = c[1] === 'w' ? L.x0 + s / 2 : L.x1 - s / 2, z = c[0] === 's' ? L.z1 - s / 2 : L.z0 + s / 2;
    tiers.push({ ...rect(x, z, s, s), y0: 0, y1: h - 4, col: wall, round: c });
    tiers.push({ ...rect(x, z, 14, 14), y0: h - 4, y1: h, col: 0xfdf6ea, plain: true });        // the drum
    extra.corner = c;
  } else {                                  // M5: a 30 x 30 tower on half the lot, the other half an open plaza
    const side = ['n', 's', 'e', 'w'][Math.floor(rnd() * 4)], off = Math.min(14, (Math.min(lw, ld) - 30) / 2);
    const x = cx + (side === 'e' ? off : side === 'w' ? -off : 0), z = cz + (side === 's' ? off : side === 'n' ? -off : 0);
    tiers.push({ ...rect(x, z, 30, 30), y0: 0, y1: h, col: wall });
    extra.plaza = side; extra.helipad = rnd() < 0.2;
  }
  return { tiers, extra };
}

// Cut a block into one lot or two half lots and put a tower on each (map.js calls this for every block).
function split(b, addLot, { rng, hash2, overlap }) {
  if (b.edge || b.row.strip || HERO.some((h) => overlap(h, b)) || RESERVED.some((r) => overlap(r, b))) return;
  const mid = { x: (b.x0 + b.x1) / 2, z: (b.z0 + b.z1) / 2 }, rnd = rng(b.seed);
  const hood = hoods.find((h) => mid.x >= h.x0 && mid.x < h.x1 && mid.z >= h.z0 && mid.z < h.z1) || hoods[0];
  const I = { x0: b.x0 + 4, x1: b.x1 - 4, z0: b.z0 + 4, z1: b.z1 - 4 }, coral = inside(b, CORAL_AT);
  let total = 0; for (const k in hood.shares) total += hood.shares[k];
  let at = rnd() * total, recipe = 'M1';
  for (const k in hood.shares) { at -= hood.shares[k]; if (at < 0) { recipe = k; break; } }
  if (coral) recipe = 'M4';
  const two = recipe === 'M1' && rnd() < hood.halves, alongX = I.x1 - I.x0 >= I.z1 - I.z0 ? true : rnd() < 0.5;
  const parts = !two ? [I] : alongX ? [{ ...I, x1: mid.x }, { ...I, x0: mid.x }] : [{ ...I, z1: mid.z }, { ...I, z0: mid.z }];
  parts.forEach((L, n) => {
    const seed = hash2(b.seed, n, 0), r = rng(seed);
    let lo = hood.h[0], hi = hood.h[1];
    if (hood.id === 'the-exchange' && mid.x > 500) { lo = 60; hi = 120; }        // the east end has no neighbourhood in the canon: The Exchange, capped
    let h = lo + r() * (hi - lo);
    if (hood.id === 'radio-row' && n === 0 && RADIO_TALL.some((p) => inside(b, p))) h = 110;
    if (coral) h = 184;
    const floors = Math.floor(h / FLOOR), wall = coral ? CORAL : WALLS[recipe][Math.floor(r() * WALLS[recipe].length)];
    h = coral ? 184 : Math.min(220, floors * FLOOR);
    const { tiers, extra } = design(recipe, L, h, wall, r, coral ? 'sw' : null), base = tiers[0];
    addLot({ id: `${b.id}:${n}`, zone: 'meridian', hood: hood.id, block: b.id, recipe, kit: kit[recipe], ...L, face: 's', sides: { n: true, s: true, e: true, w: true },
      seed, floors, h, wall, body: { x0: base.x0, x1: base.x1, z0: base.z0, z1: base.z1 }, tiers, ...extra });
  });
}

// hand-written lots: the generator calls src/world/landmarks/<id>.js. The rectangles are the bible's merged lots.
const HERO = [
  { id: 'spire', x0: -45, x1: 125, z0: -986, z1: -848, h: 260, body: 0xb8cfe0, hood: 'the-exchange' },
  { id: 'cityhall', x0: -285, x1: -139, z0: -590, z1: -524, h: 38, body: 0xf7f3ea, hood: 'bayfront' },
];
// Bayfront Park is tier B: until its landmark is built it is a lawn, the one gap in the wall of towers
const RESERVED = [{ id: 'bayfront-park', x0: -361, x1: -219, z0: -510, z1: -368, ground: 0x3fb86a }];

export default {
  id: 'meridian', name: 'Meridian',
  bounds: { x0: -800, x1: 800, z0: Z0, z1: Z1 },
  seed: 4102,
  roads: { lines },
  lots: 'grid',
  generator: 'meridian',
  rows, kit, hoods, split,
  hero: HERO, reserved: RESERVED,
  plazas: [...HERO, ...RESERVED].map(({ x0, x1, z0, z1 }) => ({ x0, x1, z0, z1 })),
  landmarks: {
    spire: { x: 52, z: -900, w: 60, d: 60, h: 260, level: 0 },
    'spire-circle': { x: 52, z: -837, w: 60, d: 60, h: 9, level: 0 },
    cityhall: { x: -200, z: -560, w: 146, d: 66, h: 38, level: 0 },
    'bayfront-park': { x: -300, z: -450, w: 142, d: 142, h: 8, level: 0 },
    'savings-tower': { x: 96, z: -636, w: 36, d: 36, h: 184, level: 0 },
  },
  places: [
    { id: 'maison-sable', kind: 'shop:clothes', x: 24, z: -636 }, { id: 'second-wind-thrift-meridian', kind: 'shop:thrift', x: -560, z: -880 },
    { id: 'storm-mart-meridian', kind: 'shop:storm', x: 650, z: -478 }, { id: 'birdbath-car-wash-meridian', kind: 'carwash', x: 650, z: -1270 },
    { id: 'shell-yeah-city-hall', kind: 'food', x: -170, z: -535 },
    { id: 'bay-cab-rank-spire', kind: 'taxi', x: 86, z: -837 }, { id: 'bay-cab-rank-city-hall', kind: 'taxi', x: -150, z: -520 }, { id: 'bay-cab-rank-uptown', kind: 'taxi', x: -92, z: -1240 },
    { id: 'spire-service-dock', kind: 'mission', x: 52, z: -980 },
  ],
  // the day band's weights (plan/bible/world/meridian.md section 6); ids that are not built yet fall to tarpon
  traffic: { tarpon: 4, taxi: 3, pompano: 2, hogfish: 1, snook: 2, grouper: 2, pinfish: 2, manatee: 1, heron: 1, gallinule: 1, sturgeon: 1 },
  peds: { 'office worker': 6, tourist: 2, retiree: 1 },
  ambience: 'city',
  palette: 'meridian',
};
