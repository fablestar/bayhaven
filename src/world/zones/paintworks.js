// The Paintworks, arts and nightlife: a square kilometre of brick and metal warehouses east of
// downtown, painted edge to edge, round a shut paint factory with three chimneys. Pure data, read
// by map.js. Numbers and names are from plan/bible/world/paintworks.md.

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const X0 = 800, X1 = 1800, Z0 = -1440, Z1 = -320, NORTH = -1397, SOUTH = -357;
export const BRICK = 0xa8553a, METAL = 0x7d8590;
// container bars: violet, mint, pink, cyan and orange at 80% brightness
export const BAR_COLOURS = [0x9056cc, 0x4acc7c, 0xcc3283, 0x21b8cc, 0xcc8025];

// ---------- roads ----------
const NS = [[852, 'Madder Street'], [932, 'Ochre Street'], [1012, 'Factory Avenue', 'avenue'], [1092, 'Cobalt Street'], [1172, 'Vermilion Street'], [1252, 'Umber Street'],
  [1332, 'Pigment Avenue', 'avenue'], [1412, 'Viridian Street'], [1492, 'Cadmium Street'], [1572, 'Indigo Street'], [1652, 'Gantry Avenue', 'avenue'], [1732, 'Carmine Street']];
const EW = [[SOUTH, 'Flamingo Avenue', 'avenue'], [-437, 'First Street'], [-517, 'Second Street'], [-597, 'Third Street'], [-677, 'Commerce Way', 'avenue'],
  [-757, 'Fifth Street'], [-837, 'Sixth Street'], [-917, 'Seventh Street'], [-997, 'Tower Way', 'avenue'], [-1077, 'Ninth Street'], [-1157, 'Tenth Street'],
  [-1237, 'Eleventh Street'], [-1317, 'Union Avenue', 'avenue'], [NORTH, 'Thirteenth Street']];
const CLOSED = {
  'Cobalt Street': [[-677, -437]],                                     // Wet Paint Alley: on foot only
  'Umber Street': [[-917, -757]], 'Sixth Street': [[1172, 1332]],      // the paint factory's merged lot
};
const lines = [];
// streets up to Indigo Street run on south into the beachfront's streets; the last two end at Flamingo Avenue
for (const [at, name, kind = 'street'] of NS) lines.push({ id: slug(name), pid: 'paintworks:' + slug(name), name, axis: 'ns', at, from: NORTH, to: at <= 1572 ? Z1 : SOUTH, kind, closed: CLOSED[name] || [] });
for (const [at, name, kind = 'street'] of EW) lines.push({ id: slug(name), pid: 'paintworks:' + slug(name), name, axis: 'ew', at, from: X0, to: X1, kind, closed: CLOSED[name] || [] });

const half = (kind) => (kind === 'avenue' ? 11 : 7);
const rows = [{ id: 'S', z0: SOUTH + 11, z1: Z1, strip: true }];
for (let i = 0; i < EW.length - 1; i++) rows.push({ id: 'R' + i, z0: EW[i + 1][0] + half(EW[i + 1][2]), z1: EW[i][0] - half(EW[i][2]) });
rows.push({ id: 'N', z0: Z0, z1: NORTH - 7, strip: true });

// ---------- neighbourhoods and the kit ----------
// W3, W6 and W7 are tier B: until they are built their share goes to W1, the brick warehouse.
// The bible stops the district at z = -1280; the two rows north of that are built as The Lofts.
const hoods = [
  { id: 'the-lofts', name: 'The Lofts', x0: X0, x1: X1, z0: Z0, z1: -1020, shares: { W1: 90, W5: 10 } },
  { id: 'wet-paint-alley', name: 'Wet Paint Alley', x0: X0, x1: 1180, z0: -1020, z1: Z1, shares: { W1: 90, W2: 10 } },
  { id: 'factory-yard', name: 'Factory Yard', x0: 1180, x1: X1, z0: -1020, z1: -660, shares: { W1: 50, W2: 35, W5: 15 } },
  { id: 'container-row', name: 'Container Row', x0: 1180, x1: X1, z0: -660, z1: Z1, shares: { W4: 40, W2: 25, W1: 35 } },
];
const kit = {
  W1: { recipe: 'warehouse', preset: 'brick', floors: [2, 3], w: 28, d: 40 }, W2: { recipe: 'warehouse', preset: 'metal-shed', floors: [1, 1], w: 24, d: 36 },
  W4: { recipe: 'container-bar', floors: [2, 3], w: 26, d: 26 }, W5: { recipe: 'rooftop-club', floors: [3, 3], w: 28, d: 28 },
};
const HERO = [{ id: 'paint-factory', x0: 1179, x1: 1321, z0: -910, z1: -764, h: 62, body: BRICK, hood: 'factory-yard' }];
// the alley's three stretches, paved at kerb height between the streets that cross it
const ALLEY = [[-666, -604], [-590, -524], [-510, -444]].map(([z0, z1]) => ({ x0: 1085, x1: 1099, z0, z1 }));

// Mural seeds come from a pool of 26 (5000 to 5025; the factory keeps 5026 to 5031), two cells a
// wall, handed out chunk by chunk so no two murals in a chunk share a seed.
const POOL = 26, perChunk = new Map();
const chunkKey = (x, z) => Math.floor((x + 3200) / 160) + 64 * Math.floor((z + 3520) / 160);
function muralSeed(x, z) { const k = chunkKey(x, z), at = perChunk.get(k) || 0; perChunk.set(k, at + 2); return 5000 + (at % POOL); }

// A block is cut into a west and an east half, each about 29 x 58 m. The building stands at one
// end of its half, its long outer wall on the side street, with a yard behind it.
function split(b, addLot, { rng, hash2, overlap }) {
  if (b.row.strip || b.edge || b.x1 - b.x0 < 40 || HERO.some((h) => overlap(h, b))) return;
  const mid = { x: (b.x0 + b.x1) / 2, z: (b.z0 + b.z1) / 2 }, rnd = rng(b.seed);
  const hood = hoods.find((h) => mid.x >= h.x0 && mid.x < h.x1 && mid.z >= h.z0 && mid.z < h.z1) || hoods[0];
  let total = 0; for (const k in hood.shares) total += hood.shares[k];
  const south = rnd() < 0.5;
  [[b.x0 + 4, mid.x - 0.5, 'w'], [mid.x + 0.5, b.x1 - 4, 'e']].forEach(([x0, x1, out], n) => {
    const seed = hash2(b.seed, n, 0), r = rng(seed), z0 = b.z0 + 4, z1 = b.z1 - 4, face = (n ? !south : south) ? 's' : 'n';
    let at = r() * total, recipe = 'W1';
    for (const k in hood.shares) { at -= hood.shares[k]; if (at < 0) { recipe = k; break; } }
    const K = kit[recipe], floors = K.floors[0] + Math.floor(r() * (K.floors[1] - K.floors[0] + 1));
    const w = Math.min(K.w, x1 - x0), d = Math.min(K.d, z1 - z0);
    const bx0 = out === 'w' ? x0 : x1 - w, bz0 = face === 's' ? z1 - d : z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const h = recipe === 'W1' ? floors * 5 + 0.6 : recipe === 'W2' ? 8 : recipe === 'W5' ? 15 : floors * 2.6;
    const lot = { id: `${b.id}:${n}`, zone: 'paintworks', hood: hood.id, block: b.id, recipe, kit: K, x0, x1, z0, z1, face, out,
      sides: { w: out === 'w', e: out === 'e', n: face === 'n', s: face === 's' }, seed, floors, h,
      wall: recipe === 'W1' ? BRICK : recipe === 'W4' ? BAR_COLOURS[Math.floor(r() * 5)] : METAL, roof: recipe === 'W2' ? 0x9aa3ad : 0x6f6a78,
      body: { x0: bx0, x1: bx0 + w, z0: bz0, z1: bz0 + d } };
    if (recipe !== 'W4') {
      lot.murals = [{ side: out, seed: muralSeed(cx, cz), cells: 2 }];
      if (recipe === 'W5' || r() < 0.35) lot.murals.push({ side: face, seed: muralSeed(cx, cz), cells: 2 });
    }
    addLot(lot);
  });
}

// plan/bible/world/paintworks.md section 6: the day band, and the night band for when the clock is read.
// Ids that are not built yet fall to tarpon; artist and photographer are tier B kinds (tourists until then), guards are left out.
const DAY = { traffic: { pompano: 3, hogfish: 2, mullet: 2, tarpon: 2, pinfish: 3, snook: 2, taxi: 1, wahoo: 1, tern: 1, needlefish: 1 }, peds: { tourist: 10, skater: 2, 'office worker': 1 } };
const NIGHT = { traffic: { pompano: 1, mullet: 1, tarpon: 2, pinfish: 1, snook: 1, taxi: 5, sailfin: 4, wahoo: 3, tern: 2, needlefish: 2, bonito: 2 }, peds: { tourist: 1, skater: 1, clubber: 8 }, cap: 1.3 };

export default {
  id: 'paintworks', name: 'The Paintworks',
  bounds: { x0: X0, x1: X1, z0: Z0, z1: Z1 },
  seed: 5141,
  roads: { lines },
  lots: 'grid',
  generator: 'paintworks',
  rows, kit, hoods, split,
  hero: HERO, reserved: [],
  plazas: [{ x0: 1179, x1: 1321, z0: -910, z1: -764 }, ...ALLEY],
  landmarks: {
    'paint-factory': { x: 1300, z: -800, w: 142, d: 146, h: 62, level: 0 },
    'wet-paint-alley': { x: 1100, z: -600, w: 8, d: 222, h: 9, level: 0 },
  },
  places: [
    { id: 'paintworks-loft', kind: 'property', x: 1430, z: -1117 }, { id: 'food-truck', kind: 'business', x: 1000, z: -1100 },
    { id: 'second-wind-thrift-paintworks', kind: 'shop:thrift', x: 892, z: -720 }, { id: 'bay-cab-rank-seventh-street', kind: 'taxi', x: 1450, z: -917 },
  ],
  traffic: DAY.traffic, peds: DAY.peds, night: NIGHT, parked: 0.3,
  ambience: 'warehouse',
  palette: 'paintworks',
};
