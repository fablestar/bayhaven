// Northgate, the strip: 320 m superblocks of car parks with a shop at the back, north of the
// expressway. Pure data, read by map.js. Numbers and names are from plan/bible/world/northgate.md.
// The plan's bounds are used (east edge past Route 44, so the road and both kerbs are Northgate).

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const X0 = -800, X1 = 720, Z0 = -2700, Z1 = -1500, SOUTH = -1520;
export const BEIGE = 0xe8dcc4, TINTS = [0xf4bdbd, 0xbce0ca, 0xc4d7e2, 0xf4d3aa], MOTEL = [0xf4bdbd, 0xbce0ca, 0xc4d7e2];

// ---------- roads: [at, name, kind, closed stretches] ----------
const NS = [[-680, 'Layaway Lane'], [-520, 'Hospital Road', 'avenue'], [-360, 'Refund Street'], [-200, 'Galleria Road', 'avenue', [[Z0, -2530], [-2120, -1800]]],
  [-40, 'Markdown Street', 'street', [[Z0, -2440], [-2120, -1800]]], [120, 'Voucher Avenue', 'avenue'], [280, 'Bulk Street', 'street', [[-2440, -2120]]],
  [440, 'Doorbuster Drive', 'avenue'], [700, 'Route 44', 'avenue']];
const EW = [[-2600, 'Receipt Road', 'street', [[-210, 45]]], [-2440, 'Billboard Road', 'avenue'], [-2280, 'Warranty Street', 'street', [[120, 440]]], [-2120, 'Outlet Road', 'avenue'],
  [-1960, 'Clearance Street', 'street', [[-360, -40]]], [-1800, 'Gateway Boulevard', 'boulevard'], [-1640, 'Coupon Street'], [SOUTH, 'Rebate Road']];
const lines = [];
for (const [at, name, kind = 'street', closed = []] of NS) lines.push({ id: slug(name), pid: 'northgate:' + slug(name), name, axis: 'ns', at, from: Z0, to: SOUTH, kind, closed });
for (const [at, name, kind = 'street', closed = []] of EW) lines.push({ id: slug(name), pid: 'northgate:' + slug(name), name, axis: 'ew', at, from: X0, to: 700, kind, closed });

const half = (kind = 'street') => (kind === 'boulevard' ? 15 : kind === 'avenue' ? 11 : 7);
const rows = [{ id: 'N', z0: Z0, z1: EW[0][0] - 7 }];
for (let i = 0; i < EW.length - 1; i++) rows.push({ id: 'R' + i, z0: EW[i][0] + half(EW[i][2]), z1: EW[i + 1][0] - half(EW[i + 1][2]) });

// ---------- neighbourhoods (the bible's tests, in order) and what each builds ----------
// Only the tier A recipes are built: a B or C recipe's share goes to the strip mall.
const hoods = [
  { id: 'sinkhole-park', name: 'Sinkhole Park', x0: X0, x1: -360, z0: Z0, z1: -2280, shares: { strip: 100 } },
  { id: 'medical-mile', name: 'Medical Mile', x0: X0, x1: -360, z0: -2280, z1: Z1, shares: { strip: 90, drive: 10 } },
  { id: 'motel-circle', name: 'Motel Circle', x0: 40, x1: X1, z0: -1785, z1: Z1, shares: { motel: 55, strip: 35, drive: 10 } },
  { id: 'the-strip', name: 'The Strip', x0: -360, x1: X1, z0: -1960, z1: Z1, shares: { strip: 55, drive: 25, box: 15, motel: 5 } },
  { id: 'the-strip', name: 'The Strip', x0: -360, x1: 40, z0: -2120, z1: -1960, shares: { strip: 55, drive: 25, box: 15, motel: 5 } },
  { id: 'studio-park', name: 'Studio Park', x0: -360, x1: X1, z0: Z0, z1: -1960, shares: { strip: 75, box: 25 } },
];
const kit = { strip: { recipe: 'ng-strip', h: 6.7 }, box: { recipe: 'ng-box', h: 9 }, drive: { recipe: 'ng-drive', h: 7 }, motel: { recipe: 'ng-motel', h: 6.4 } };

// The three landmarks stand on whole blocks; the lot round each is theirs too.
const HERO = [
  { id: 'hospital', x0: -509, x1: -367, z0: -1785, z1: -1647, h: 34, body: 0xbce0ca, hood: 'medical-mile' },
  { id: 'sheriff-hq', x0: 131, x1: 433, z0: -2273, z1: -2131, h: 45, body: 0xf7f3ea, hood: 'studio-park' },
  { id: 'galleria', x0: -353, x1: -47, z0: -2109, z1: -1815, h: 36, body: BEIGE, hood: 'the-strip' },
  { id: 'starlite', x0: 131, x1: 433, z0: -2429, z1: -2287, h: 22, body: 0xffffff, hood: 'studio-park' },
];

// A block is one lot, or a north and a south half when it is deep enough. The building stands at
// the back, the car park in front of it (always at least twice the building, the bible's check 6).
function split(b, addLot, { rng, hash2, overlap }) {
  const w = b.x1 - b.x0, d = b.z1 - b.z0;
  if (w < 60 || d < 60 || HERO.some((h) => overlap(h, b))) return;
  const mx = (b.x0 + b.x1) / 2, mz = (b.z0 + b.z1) / 2, rnd = rng(b.seed);
  const hood = hoods.find((h) => mx >= h.x0 && mx < h.x1 && mz >= h.z0 && mz < h.z1) || hoods[3];
  const draw = () => { let at = rnd() * 100; for (const k in hood.shares) { at -= hood.shares[k]; if (at < 0) return k; } return 'strip'; };
  let n = 0;
  const add = (recipe, x0, x1, z0, z1, face) => {
    const seed = hash2(b.seed, n, 0), r = rng(seed), back = face === 's' ? z0 + 3 : z1 - 3, dir = face === 's' ? 1 : -1, cx = (x0 + x1) / 2;
    const lot = { id: `${b.id}:${n++}`, zone: 'northgate', hood: hood.id, block: b.id, recipe, kit: kit[recipe], x0, x1, z0, z1, face, seed, floors: recipe === 'motel' ? 2 : 1, h: kit[recipe].h, sides: {},
      wall: BEIGE, tint: TINTS[Math.floor(r() * 4)], pole: 14 + Math.floor(r() * 9) };
    const body = (bw, bd, off = 0) => ({ x0: cx - bw / 2, x1: cx + bw / 2, z0: Math.min(back + dir * off, back + dir * (off + bd)), z1: Math.max(back + dir * off, back + dir * (off + bd)) });
    if (recipe === 'strip' || recipe === 'box') {
      // the car park: everything in front of the building, 3 to 4 m in from the kerbs; a big-box store has bays down both sides too
      const bd = recipe === 'box' ? 60 : z1 - z0 < 100 ? 22 : 24, deep = z1 - z0 - bd - 10, pw = x1 - x0 - 6;
      const side = recipe === 'box' ? Math.max(0, (pw - 90) / 2 - 2) * bd * 2 : 0;
      const bw = recipe === 'box' ? 90 : Math.min(120, x1 - x0 - 16, Math.floor((pw * deep) / (2.05 * bd)));
      lot.body = body(bw, bd);
      const front = face === 's' ? lot.body.z1 : lot.body.z0;
      lot.park = { x0: x0 + 3, x1: x1 - 3, z0: face === 's' ? front + 3 : z0 + 4, z1: face === 's' ? z1 - 4 : front - 3 };
      lot.parkArea = pw * deep + side; lot.bodyArea = bw * bd;
      if (recipe === 'box') lot.tint = r() < 0.5 ? 0xff5a5a : 0xffa02e;
    } else if (recipe === 'drive') { lot.body = body(14, 10, (z1 - z0) / 2 - 12); lot.wall = lot.tint; }
    else { lot.body = body(48, 57); lot.wall = MOTEL[Math.floor(r() * 3)]; lot.pole = 12; }
    return addLot(lot);
  };
  const first = draw();
  if (d < 125 || first === 'box') {
    const recipe = first === 'box' && (d < 125 || w < 138) ? 'strip' : first;
    if ((recipe === 'motel' || recipe === 'drive') && w >= 130) { add(recipe, b.x0, mx, b.z0, b.z1, 's'); add(recipe, mx, b.x1, b.z0, b.z1, 's'); } else add(recipe, b.x0, b.x1, b.z0, b.z1, 's');
    return;
  }
  for (const [z0, z1, face, pick] of [[b.z0, mz, 'n', first], [mz, b.z1, 's', draw()]]) {
    const recipe = pick === 'box' ? 'strip' : pick;
    if (recipe === 'strip' || w < 130) add(recipe === 'motel' && w < 130 ? 'motel' : recipe === 'drive' ? 'drive' : 'strip', b.x0, b.x1, z0, z1, face);
    else { add(recipe, b.x0, mx, z0, z1, face); add(recipe, mx, b.x1, z0, z1, face); }
  }
}

// Billboard Row: forty boards on the north kerb of Billboard Road, six a block and four at the east end
export const BILLBOARDS = [];
for (const west of [-509, -353, -189, -33, 131, 287]) for (let i = 0; i < 6; i++) BILLBOARDS.push(west + 11 + 24 * i);
BILLBOARDS.push(462, 486, 510, 534);
export const BOARD_Z = -2458;

// plan/bible/world/northgate.md section 6: the day band, and the night band. Vehicles that are not
// built yet fall to tarpon; shopper, mascot, medic and dealer are tier B kinds, so they are tourists.
const DAY = { traffic: { tarpon: 5, grouper: 5, snook: 4, mullet: 3, pompano: 3, heron: 2, possum: 2, manatee: 1, taxi: 1, hogfish: 1 }, peds: { tourist: 8, retiree: 3, 'office worker': 2 } };
const NIGHT = { traffic: { tarpon: 3, hogfish: 2, mullet: 2, taxi: 1 }, peds: { tourist: 3, 'office worker': 1 }, cap: 0.3 };

export default {
  id: 'northgate', name: 'Northgate',
  bounds: { x0: X0, x1: X1, z0: Z0, z1: Z1 },
  seed: 6601,
  roads: { lines },
  lots: 'grid',
  generator: 'northgate',
  rows, kit, hoods, split,
  billboards: { z: BOARD_Z, xs: BILLBOARDS },
  hero: HERO, reserved: [],
  // the landmark lots stand at kerb height even over the streets they close
  plazas: [{ x0: -353, x1: -47, z0: -2109, z1: -1815 }, { x0: 131, x1: 433, z0: -2429, z1: -2131 }],
  landmarks: {
    hospital: { x: -500, z: -1700, w: 136, d: 100, h: 34, level: 0 },
    'sheriff-hq': { x: 200, z: -2150, w: 100, d: 105, h: 45, level: 0 },
    galleria: { x: -200, z: -2000, w: 220, d: 120, h: 36, level: 0 },
    starlite: { x: 350, z: -2400, w: 200, d: 150, h: 22, level: 0 },
  },
  // seeds from section 5. The hospital doors and the HQ steps are where the player wakes up and is released.
  places: [
    { id: 'bayhaven-general', kind: 'hospital', x: -500, z: -1700, h: -Math.PI / 2 }, { id: 'sheriff-hq-steps', kind: 'booking', x: 200, z: -2146, h: 0 },
    { id: 'park-and-sons-northgate', kind: 'shop:garage', x: -120, z: -2160 }, { id: 'second-wind-thrift-northgate', kind: 'shop:thrift', x: 60, z: -1835 },
    { id: 'storm-mart-northgate', kind: 'shop:storm', x: 200, z: -1845 }, { id: 'bait-and-ballistics', kind: 'shop:guns', x: 520, z: -1840 },
    { id: 'shell-yeah-northgate', kind: 'food', x: -290, z: -1765 }, { id: 'birdbath-car-wash-northgate', kind: 'carwash', x: 520, z: -1765 },
  ],
  traffic: DAY.traffic, peds: DAY.peds, night: NIGHT, streetSpeed: 11.1, parked: 0.2, hangOut: 0.3,
  ambience: 'strip',
  palette: 'northgate',
};
