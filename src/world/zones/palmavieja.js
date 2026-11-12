// Palma Vieja, the old quarter: 1.2 by 1.1 km of two- and three-floor shop-houses in hot colours
// west of downtown, round Domino Park and the bell tower. Pure data, read by map.js. Numbers and
// names are from plan/bible/world/palma-vieja.md.

const slug = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const X0 = -2000, X1 = -800, Z0 = -1440, Z1 = -320, NORTH = -1397, SOUTH = -357;
export const HOT = [0xffb347, 0x2ec4b6, 0xff6f91, 0xb5e48c];          // mango, turquoise, rose, lime

// ---------- roads ----------
const NS = [[-1972, 'Mangrove Avenue', 'avenue'], [-1892, 'Calle Caimito'], [-1812, 'Calle Azucena'], [-1732, 'Calle Guanábana'], [-1652, 'Avenida Campana', 'avenue'],
  [-1572, 'Calle Níspero'], [-1492, 'Calle Clavel'], [-1412, 'Calle Mamey'], [-1332, 'Avenida Mercado', 'avenue'], [-1252, 'Calle Guayaba'], [-1172, 'Calle Gardenia'],
  [-1092, 'Calle Jazmín'], [-1012, 'Avenida Rosa', 'avenue'], [-932, 'Calle Orquídea'], [-852, 'Calle Papaya']];
const EW = [[SOUTH, 'Flamingo Avenue', 'avenue'], [-437, 'Calle Uno'], [-517, 'Calle Dos'], [-597, 'Calle Tres'], [-677, 'Commerce Way', 'avenue'],
  [-757, 'Calle Cinco'], [-837, 'Calle Seis'], [-917, 'Calle Siete'], [-997, 'Tower Way', 'avenue'], [-1077, 'Calle Nueve'], [-1157, 'Calle Diez'],
  [-1237, 'Calle Once'], [-1317, 'Union Avenue', 'avenue'], [NORTH, 'Calle Trece']];
const CLOSED = { 'Calle Mamey': [[-917, -837]] };                     // Domino Park
const lines = [];
// from Calle Níspero east the streets run on south into the beachfront's streets; west of it they end at Flamingo Avenue
for (const [at, name, kind = 'street'] of NS) lines.push({ id: slug(name), pid: 'palmavieja:' + slug(name), name, axis: 'ns', at, from: NORTH, to: at >= -1572 ? Z1 : SOUTH, kind, closed: CLOSED[name] || [] });
for (const [at, name, kind = 'street'] of EW) lines.push({ id: slug(name), pid: 'palmavieja:' + slug(name), name, axis: 'ew', at, from: -1972, to: X1, kind, closed: [] });

const half = (kind) => (kind === 'avenue' ? 11 : 7);
const rows = [{ id: 'S', z0: SOUTH + 11, z1: Z1, strip: true }];
for (let i = 0; i < EW.length - 1; i++) rows.push({ id: 'R' + i, z0: EW[i + 1][0] + half(EW[i + 1][2]), z1: EW[i][0] - half(EW[i][2]) });
rows.push({ id: 'N', z0: Z0, z1: NORTH - 7, strip: true });

// ---------- neighbourhoods and the kit ----------
// P2 to P6 are tier B: until they are built their share goes to P1, the shop-house, at the
// neighbourhood's own frontage. `bulbs` is bulb strings per 100 m of street.
const hoods = [
  { id: 'los-patios', name: 'Los Patios', x0: X0, x1: X1, z0: Z0, z1: -1100, frontage: [14, 18], three: 0.25, bulbs: 2 },
  { id: 'el-bajo', name: 'El Bajo', x0: X0, x1: X1, z0: -600, z1: Z1, frontage: [16, 22], three: 0.2, bulbs: 1 },
  { id: 'la-plaza', name: 'La Plaza', x0: X0, x1: -1100, z0: -1100, z1: -600, frontage: [8, 12], three: 0.6, bulbs: 6 },
  { id: 'calle-mural', name: 'Calle Mural', x0: -1100, x1: X1, z0: -1100, z1: -600, frontage: [8, 12], three: 0.5, bulbs: 6 },
];
const kit = { P1: { recipe: 'shop-house', floors: [2, 3] } };
const HERO = [
  { id: 'domino-park', x0: -1485, x1: -1343, z0: -910, z1: -844, h: 9, body: 0x2f9e58, hood: 'la-plaza' },
  { id: 'bell-tower', x0: -1405, x1: -1343, z0: -986, z1: -924, h: 34, body: 0xfdf6ea, hood: 'la-plaza' },
];
const MURALS = 16, perChunk = new Map();          // mural seeds 3301 to 3316, handed out so a chunk never uses one twice
const chunkKey = (x, z) => Math.floor((x + 3200) / 160) + 64 * Math.floor((z + 3520) / 160);

// Every block is cut in two by a 4 m alley along its middle; the lots sit in two rows behind a
// 4 m sidewalk, shoulder to shoulder, and no two neighbours share a wall colour.
function split(b, addLot, { rng, hash2, overlap }) {
  if (b.row.strip || b.x1 - b.x0 < 30 || HERO.some((h) => overlap(h, b))) return;
  const mid = { x: (b.x0 + b.x1) / 2, z: (b.z0 + b.z1) / 2 }, rnd = rng(b.seed);
  const hood = hoods.find((h) => mid.x >= h.x0 && mid.x < h.x1 && mid.z >= h.z0 && mid.z < h.z1) || hoods[0];
  const ix0 = b.x0 + 4, ix1 = b.edge ? b.x1 : b.x1 - 4, total = ix1 - ix0;
  let n = 0;
  for (const [z0, z1, face] of [[b.z0 + 4, mid.z - 2, 'n'], [mid.z + 2, b.z1 - 4, 's']]) {
    const count = Math.max(1, Math.round(total / ((hood.frontage[0] + hood.frontage[1]) / 2)));
    const ws = Array.from({ length: count }, () => 0.85 + rnd() * 0.3), sum = ws.reduce((a, c) => a + c, 0), row = [];
    let x = ix0, last = -1;
    ws.forEach((w, i) => {
      const x1 = i === count - 1 ? ix1 : x + (w / sum) * total, seed = hash2(b.seed, n, 0), r = rng(seed);
      const floors = r() < hood.three ? 3 : 2, h = 3.6 + 3.0 * (floors - 1) + 0.6;
      let col; do col = Math.floor(r() * 4); while (col === last); last = col;
      const lot = { id: `${b.id}:${n}`, zone: 'palmavieja', hood: hood.id, block: b.id, recipe: 'P1', kit: kit.P1, x0: x, x1, z0, z1, face,
        sides: { w: i === 0, e: i === count - 1 && !b.edge, n: face === 'n', s: face === 's' }, seed, floors, h, wall: HOT[col], accent: HOT[(col + 1 + Math.floor(r() * 3)) % 4],
        body: face === 's' ? { x0: x, x1, z0: z1 - 20, z1 } : { x0: x, x1, z0, z1: z0 + 20 } };
      // a mural on the bare side wall of some corner houses
      if ((lot.sides.w || lot.sides.e) && r() < 0.4) {
        const k = chunkKey((x + x1) / 2, (z0 + z1) / 2), at = perChunk.get(k) || 0;
        perChunk.set(k, at + 2);
        lot.mural = { side: lot.sides.w ? 'w' : 'e', seed: 3301 + (at % MURALS), cells: 2 };
      }
      row.push(lot); n++; x = x1;
    });
    // which side walls show above a lower neighbour (the far shell draws only those)
    row.forEach((lot, i) => { lot.wallW = i === 0 || lot.h > row[i - 1].h; lot.wallE = i === row.length - 1 || lot.h > row[i + 1].h; addLot(lot); });
  }
}

// plan/bible/world/palma-vieja.md section 6: the day band, and the night band for when the clock is read.
// Ids that are not built yet fall to tarpon; family and vendor are tier B kinds, so their weights are in retiree and tourist.
const DAY = { traffic: { flounder: 3, mullet: 3, pompano: 3, pinfish: 3, tarpon: 2, possum: 2, snook: 2, hogfish: 1, manatee: 1, ibis: 1, taxi: 1, conch: 1 }, peds: { retiree: 8, tourist: 6, 'office worker': 1 } };
const NIGHT = { traffic: { flounder: 3, mullet: 1, pinfish: 1, tarpon: 2, possum: 1, snook: 1, ibis: 1, taxi: 2 }, peds: { retiree: 1, tourist: 1, clubber: 2 }, cap: 0.4 };

export default {
  id: 'palmavieja', name: 'Palma Vieja',
  bounds: { x0: X0, x1: X1, z0: Z0, z1: Z1 },
  seed: 3301,
  roads: { lines },
  lots: 'grid',
  generator: 'palmavieja',
  rows, kit, hoods, split,
  hero: HERO, reserved: [],
  plazas: [{ x0: -1485, x1: -1343, z0: -910, z1: -844 }],
  landmarks: {
    'domino-park': { x: -1400, z: -880, w: 142, d: 66, h: 9, level: 0 },
    'bell-tower': { x: -1350, z: -960, w: 8, d: 8, h: 34, level: 0 },
  },
  places: [
    { id: 'ventanita-rosa', kind: 'coffee', x: -1020, z: -640 }, { id: 'flat-over-the-bakery', kind: 'property', x: -960, z: -800 },
    { id: 'second-wind-thrift-palma', kind: 'shop:thrift', x: -1130, z: -720 }, { id: 'storm-mart-palma', kind: 'shop:storm', x: -1600, z: -1180 },
    { id: 'birdbath-car-wash-palma', kind: 'carwash', x: -1450, z: -478 }, { id: 'rafas-table', kind: 'mission', x: -1400, z: -880 },
    { id: 'bay-cab-rank-domino-park', kind: 'taxi', x: -1343, z: -880 },
  ],
  traffic: DAY.traffic, peds: DAY.peds, night: NIGHT, streetSpeed: 8.3, parked: 0.45, hangOut: 0.5,
  ambience: 'oldtown',
  palette: 'palmavieja',
};
