// Rustwater, the port: 1.4 by 1.8 km of container yards, sheds and rails at the east end of the
// map, with a quay down its east side (x = 3024) and along its south (z = 130). Pure data, read by
// map.js. Numbers and names are from plan/bible/world/rustwater.md. Large yards swallow whole
// blocks and the streets between them: each is a plaza (kerb height) and a reserved lot.

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const X0 = 1800, X1 = 3200, Z0 = -1600, Z1 = 200, NORTH = -1397, SOUTH = 37;
export const QUAY = { x1: 3024, z1: 130 };
export const CRANE_Z = [-450, -350, -250, -150];
export const RAIL_Z = -277;
export const COLOURS = [0xb5532f, 0xffc300, 0xbf4343, 0x2e4a6b, 0x3d6b4a, 0xe0e0e6];     // rust, yellow, red at 75%, blue, green, white

// ---------- roads ----------
// [x, name, kind, from, to, closed]
const NS = [
  [1812, 'Bollard Street'], [1892, 'Cleat Street'], [1972, 'Dockside Avenue', 'avenue', -1440],
  [2052, 'Capstan Street', 'street', NORTH, SOUTH, [[-357, -197]]],                          // the rail yard
  [2132, 'Windlass Street', 'street', NORTH, SOUTH, [[-357, -197], [-1317, -1157]]],         // the rail yard, the scrapyard
  [2212, 'Keel Street', 'street', NORTH, SOUTH, [[-357, -197]]],
  [2292, 'Container Road', 'avenue', -1440],
  [2372, 'Bilge Street', 'street', NORTH, SOUTH, [[-997, -677]]],                            // the tank farm
  [2452, 'Davit Street', 'street', NORTH, SOUTH, [[-997, -677]]],
  [2532, 'Rudder Street', 'street', NORTH, SOUTH, [[-997, -677]]],
  [2612, 'Drydock Road', 'avenue', -1440], [2692, 'Hawser Street'],
  [2772, 'Scupper Street', 'street', -997, -677], [2852, 'Transom Street', 'street', -997, -677],
  [2932, 'Breakwater Road', 'avenue', -997],
];
// [z, name, kind, from, to, closed]. Lines that have a twin in The Paintworks start on the district line, x = 1800.
const EW = [
  [SOUTH, 'Gunwale Road', 'street', 1812, 2932], [-197, 'Driftwood Street', 'street', 1812, 2932],
  [-357, 'Flamingo Avenue', 'avenue', X0, 2932],
  [-437, 'First Street', 'street', X0, 2692], [-517, 'Second Street', 'street', X0, 2692], [-597, 'Third Street', 'street', X0, 2692],
  [-677, 'Commerce Way', 'avenue', X0, 2932],
  [-757, 'Fifth Street', 'street', X0, 2932, [[2292, 2612]]], [-837, 'Sixth Street', 'street', X0, 2932, [[2292, 2612]]], [-917, 'Seventh Street', 'street', X0, 2932, [[2292, 2612]]],
  [-997, 'Tower Way', 'avenue', X0, 2932],
  [-1077, 'Ninth Street', 'street', X0, 2692], [-1157, 'Tenth Street', 'street', X0, 2692], [-1237, 'Eleventh Street', 'street', X0, 2692, [[2052, 2212]]],
  [-1317, 'Union Avenue', 'avenue', 1800, 3000], [NORTH, 'Thirteenth Street', 'street', 1800, 2932],
];
const lines = [];
for (const [at, name, kind = 'street', from = NORTH, to = SOUTH, closed = []] of NS) lines.push({ id: slug(name), pid: 'rustwater:' + slug(name), name, axis: 'ns', at, from, to, kind, closed });
for (const [at, name, kind, from, to, closed = []] of EW) lines.push({ id: slug(name), pid: 'rustwater:' + slug(name), name, axis: 'ew', at, from, to, kind, closed });

// block rows. The row between Flamingo Avenue and Driftwood Street is cut in two by the railway's 14 m corridor.
const half = (kind) => (kind === 'avenue' ? 11 : 7);
const rows = [{ id: 'A', z0: -190, z1: 30 }, { id: 'B2', z0: RAIL_Z + 7, z1: -204 }, { id: 'B1', z0: -346, z1: RAIL_Z - 7 }];
for (let i = 2; i < EW.length - 1; i++) rows.push({ id: 'R' + i, z0: EW[i + 1][0] + half(EW[i + 1][2]), z1: EW[i][0] - half(EW[i][2]) });
rows.push({ id: 'N', z0: -1440, z1: NORTH - 7, strip: true });

// ---------- yards ----------
const YARDS = [
  { id: 'yard-north', kind: 'stacks', x0: 2699, x1: 2921, z0: -666, z1: -368 },
  { id: 'yard-south', kind: 'stacks', x0: 2699, x1: 2921, z0: -346, z1: -204 },
  { id: 'tank-farm', kind: 'flat', x0: 2303, x1: 2601, z0: -986, z1: -688, ground: 0x8f8c96 },       // the beach-ball tanks are tier B
  { id: 'rail-yard', kind: 'rail', x0: 1983, x1: 2281, z0: -346, z1: -204, ground: 0x6b6660 },
  { id: 'scrapyard', kind: 'flat', x0: 2059, x1: 2205, z0: -1306, z1: -1164, ground: 0x7a6a58 },     // the crusher is tier B
  { id: 'shipyard', kind: 'flat', x0: 2699, x1: 3024, z0: -1306, z1: -1008, ground: 0x8f8c96 },      // the dry dock is tier C
];
const APRON = { x0: 2943, x1: QUAY.x1, z0: -986, z1: 44 };
// a container yard is handed out a chunk at a time, so it streams (and its far shell is drawn) like everything else
const reserved = [];
for (const y of YARDS) {
  if (y.kind !== 'stacks') { reserved.push(y); continue; }
  const c0 = Math.floor((y.x0 + 3200) / 160), c1 = Math.floor((y.x1 - 0.01 + 3200) / 160), r0 = Math.floor((y.z0 + 3520) / 160), r1 = Math.floor((y.z1 - 0.01 + 3520) / 160);
  for (let cx = c0; cx <= c1; cx++) for (let cz = r0; cz <= r1; cz++) {
    reserved.push({ id: `${y.id}:${cx}:${cz}`, kind: 'stacks', yard: y.id, ox: y.x0, oz: y.z0, yx1: y.x1, yz1: y.z1,
      x0: Math.max(y.x0, cx * 160 - 3200), x1: Math.min(y.x1, cx * 160 - 3040), z0: Math.max(y.z0, cz * 160 - 3520), z1: Math.min(y.z1, cz * 160 - 3360) });
  }
}

// hand-written lots: four cranes, the ship under them, the cruise terminal and its ship
const HERO = [
  ...CRANE_Z.map((zc, k) => ({ id: 'gantry-crane', key: 'crane' + (k + 1), x0: 2885, x1: 3085, z0: zc - 14, z1: zc + 14, h: 70, zc, n: k + 1, body: 0xffc300, hood: 'the-gantries' })),
  { id: 'ship-berth', x0: 3030, x1: 3070, z0: -450, z1: -150, h: 44, body: 0x2e4a6b, hood: 'the-gantries' },
  { id: 'cruise-terminal', x0: 2303, x1: 2700, z0: 50, z1: 170, h: 52, body: 0xe0e0e6, hood: 'cruise-basin' },
];

// ---------- neighbourhoods and the kit ----------
// R3 to R6 are tier B: until they are built their share goes to R2.
const hoods = [
  { id: 'the-gantries', name: 'The Gantries', x0: 2600, x1: X1, z0: -900, z1: -100, shares: { R1: 60, R2: 40 } },
  { id: 'tank-farm', name: 'Tank Farm', x0: X0, x1: 2600, z0: -900, z1: -100, shares: { R2: 90, R1: 10 } },
  { id: 'scrap-mile', name: 'Scrap Mile', x0: X0, x1: 2600, z0: Z0, z1: -900, shares: { R2: 70, R1: 30 } },
  { id: 'drydock', name: 'Drydock', x0: 2600, x1: X1, z0: Z0, z1: -900, shares: { R2: 90, R1: 10 } },
  { id: 'cruise-basin', name: 'Cruise Basin', x0: X0, x1: X1, z0: -100, z1: Z1, shares: { R2: 85, R1: 15 } },
];
const kit = {
  R1: { recipe: 'container-stack', floors: [1, 5] },
  R2: { recipe: 'warehouse', preset: 'transit-shed', floors: [1, 1] },
};

// One lot a block: a transit shed or a stack of containers. The deep blocks north of Gunwale Road hold three.
function split(b, addLot, { rng, hash2, overlap }) {
  if (b.edge || b.row.strip || b.x1 - b.x0 < 30 || YARDS.some((y) => overlap(y, b))) return;
  const I = { x0: b.x0 + 4, x1: b.x1 - 4, z0: b.z0 + 4, z1: b.z1 - 4 }, n = I.z1 - I.z0 > 150 ? 3 : 1, d = (I.z1 - I.z0 - (n - 1) * 6) / n;
  for (let k = 0; k < n; k++) {
    const L = { ...I, z0: I.z0 + k * (d + 6), z1: I.z0 + k * (d + 6) + d };
    if (HERO.some((h) => overlap(h, L))) continue;
    const mx = (L.x0 + L.x1) / 2, mz = (L.z0 + L.z1) / 2, seed = hash2(b.seed, k, 3), r = rng(seed);
    const hood = hoods.find((h) => mx >= h.x0 && mx < h.x1 && mz >= h.z0 && mz < h.z1) || hoods[0];
    const recipe = r() * 100 < hood.shares.R1 ? 'R1' : 'R2', lw = L.x1 - L.x0, ld = L.z1 - L.z0;
    const lot = { id: `${b.id}:${k}`, zone: 'rustwater', hood: hood.id, block: b.id, recipe, kit: kit[recipe], ...L, face: 's', sides: { n: true, s: true, e: true, w: true }, seed, floors: 1 };
    if (recipe === 'R2') {
      const turn = ld - lw > 4 ? false : r() < 0.5, w = Math.min(turn ? 60 : 40, lw - 2), dd = Math.min(turn ? 40 : 60, ld - 2);
      Object.assign(lot, { h: 13, wall: 0xb5532f, body: { x0: mx - w / 2, x1: mx + w / 2, z0: mz - dd / 2, z1: mz + dd / 2 } });
    } else Object.assign(lot, { h: 13, wall: COLOURS[Math.floor(r() * 6)], body: { x0: L.x0 + 1, x1: L.x1 - 1, z0: L.z0 + 1, z1: L.z1 - 1 } });
    addLot(lot);
  }
}

export default {
  id: 'rustwater', name: 'Rustwater',
  bounds: { x0: X0, x1: X1, z0: Z0, z1: Z1 },
  seed: 3150,
  roads: { lines },
  lots: 'grid',
  generator: 'rustwater',
  quay: QUAY,                 // land stops here: past x = 3024 or z = 130 is open water
  rows, kit, hoods, split,
  hero: HERO, reserved, yards: YARDS, apron: APRON,
  plazas: [...YARDS, APRON].map(({ x0, x1, z0, z1 }) => ({ x0, x1, z0, z1 })),
  landmarks: {
    'gantry-cranes': { x: 2900, z: -300, w: 200, d: 324, h: 70, level: 0 },
    'ship-berth': { x: 3050, z: -300, w: 40, d: 300, h: 44, level: 0 },
    'cruise-terminal': { x: 2500, z: 100, w: 280, d: 100, h: 52, level: 0 },
  },
  places: [
    { id: 'park-and-sons-port', kind: 'garage', x: 2020, z: -470 }, { id: 'rustwater-warehouse', kind: 'property', x: 1930, z: -557 },
    { id: 'storm-mart-rustwater', kind: 'shop:storm', x: 1850, z: -400 }, { id: 'scrapyard-pad', kind: 'scrap', x: 2190, z: -1200 },
    { id: 'port-boat-steps', kind: 'marina', x: 2760, z: 126 }, { id: 'bay-cab-rank-cruise', kind: 'taxi', x: 2500, z: 56 },
  ],
  // the day band's weights (plan/bible/world/rustwater.md section 6); ids that are not built yet fall to tarpon.
  // `guard` is a tier B kind of person and is left out until it ships.
  traffic: { hogfish: 5, mullet: 3, fiddler: 3, pompano: 2, tarpon: 1, osprey: 1, whelk: 1, remora: 1, taxi: 1 },
  peds: { 'dock worker': 6, 'office worker': 1, tourist: 1, retiree: 1 },
  ambience: 'port',
  palette: 'rustwater',
};
