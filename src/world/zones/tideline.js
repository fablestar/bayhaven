// Tideline, the beachfront: 3.2 km of sand, a palm promenade and five rows of pastel blocks.
// Pure data, read by map.js. Numbers and names are from plan/bible/world/tideline.md.

const WEST = ['Limpet Street', 'Dunlin Street', 'Cockle Street', 'Curlew Avenue', 'Whimbrel Street', 'Periwinkle Street', 'Cowrie Street',
  'Rosa Street', 'Scallop Street', 'Fulmar Street', 'Murex Street', 'Willet Avenue', 'Junonia Street', 'Dowitcher Street', 'Nautilus Street',
  'Egret Avenue', 'Tellin Street', 'Gannet Street', 'Auger Street', 'Plaza Street'];
const EAST = ['Coral Boulevard', 'Wentletrap Street', 'Kittiwake Street', 'Angelwing Street', 'Sandbar Avenue', 'Oystercatcher Street',
  'Jingle Street', 'Sundial Street', 'Turnstone Avenue', 'Nerite Street', 'Petrel Street', 'Abalone Street', 'Avocet Avenue',
  'Shearwater Street', 'Moon Snail Street', 'Surfbird Street', 'Godwit Avenue', 'Cerith Street', 'Yellowlegs Street', 'Barnacle Street'];
const AVENUES = [-1332, -1012, -692, -372, 372, 692, 1012, 1332];
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const lines = [];
const ns = (x, name) => {
  const line = { id: slug(name), name, axis: 'ns', at: x, from: -320, to: 37, kind: AVENUES.includes(x) ? 'avenue' : 'street', closed: [] };
  if (x === 52) {            // Coral Boulevard: 14 m beside the day 1 block, 30 m north of Seagrape Street
    Object.assign(line, { id: 'coral-blvd', kind: 'boulevard', widths: [{ from: -320, to: -44, width: 30 }, { from: -44, to: 37, width: 14 }] });
  }
  if (x === -1252) line.closed.push([-277, -197]);      // Pelican Rest's gravel lane
  if (x === 1252) line.closed.push([-117, -37]);        // fenced off by the condo site
  lines.push(line);
};
WEST.forEach((name, k) => ns(-1572 + 80 * k, name));
EAST.forEach((name, k) => ns(52 + 80 * k, name));
// Heron Walk Drive is the canon's boulevard but keeps day 1's 14 m for its whole length
lines.push({ id: 'heron-walk-drive', name: 'Heron Walk Drive', axis: 'ew', at: 37, from: -1600, to: 1600, kind: 'boulevard', width: 14, closed: [] });
for (const [z, name] of [[-37, 'Seagrape Street'], [-117, 'Conch Street'], [-197, 'Driftwood Street'], [-277, 'Urchin Street']]) {
  lines.push({ id: slug(name), name, axis: 'ew', at: z, from: -1600, to: 1600, kind: 'street', closed: [] });
}

// lifeguard huts: x = 34 + 300k at z = 63, body and roof colours by x
const HUTS = [[0x8fe3cf, 0xff3fa4], [0x2e4a6b, 0xfdf6ea], [0xffc98f, 0x5dff9b], [0xc9a8ff, 0xffa02e], [0x9fd2ff, 0xff5a5a], [0xff8f7a, 0x29b6e6],
  [0xff9eb5, 0x29e6ff], [0xfff1c9, 0xb46bff], [0x7fd6e8, 0xffa02e], [0xf7f3ea, 0xff3fa4], [0xb8e0d3, 0xff5a5a]];

export default {
  id: 'tideline', name: 'Tideline',
  bounds: { x0: -1600, x1: 1600, z0: -320, z1: 130 },
  seed: 2611,
  roads: { lines },
  lots: 'grid',
  generator: 'tideline',
  // block rows by z; `rows` is how many rows of lots share the block's depth
  rows: [
    { id: 'A', z0: -30, z1: 30, rows: 2 }, { id: 'B', z0: -110, z1: -44, rows: 2 }, { id: 'C', z0: -190, z1: -124, rows: 2 },
    { id: 'D', z0: -270, z1: -204, rows: 2 }, { id: 'E', z0: -320, z1: -284, rows: 1 },
  ],
  // the kit. size: building footprint (frontage range or fixed, depth). T6, T7 and T8 are tier B: their share goes to T1.
  kit: {
    T1: { recipe: 'deco-hotel', w: [13, 19], d: 26, floors: [3, 6], rowA: true },
    T2: { recipe: 'motel-pool', w: [44, 44], d: 29, floors: [2, 2], floor: 3.0, rowA: false },
    T3: { recipe: 'deco-hotel', preset: 'slab', w: [40, 40], d: 22, floors: [8, 11], rowA: true },
    T4: { recipe: 'stilt-shack', preset: 'beach-shack', w: [13, 16], d: 26, floors: [1, 1], rowA: true },
    T5: { recipe: 'warehouse', preset: 'gable', w: [16, 22], d: 26, floors: [1, 1], rowA: false },
    empty: { recipe: 'fenced-lot', w: [24, 30], d: 26, floors: [0, 0], rowA: true },
  },
  hoods: [
    { id: 'west-end', name: 'West End', x0: -1600, x1: -900, frontage: [14, 22], shares: { T5: 30, T1: 35, T2: 20, T4: 15 } },
    { id: 'motel-row', name: 'Motel Row', x0: -900, x1: -300, frontage: [13, 19], shares: { T2: 45, T1: 45, T4: 10 } },
    { id: 'the-strand', name: 'The Strand', x0: -300, x1: 400, frontage: [13, 19], shares: { T1: 65, T3: 30, T4: 5 } },
    { id: 'pier-quarter', name: 'Pier Quarter', x0: 400, x1: 1000, frontage: [13, 19], shares: { T1: 85, T4: 15 } },
    { id: 'east-strand', name: 'East Strand', x0: 1000, x1: 1600, frontage: [13, 19], shares: { empty: 30, T1: 55, T3: 10, T4: 5 } },
  ],
  // hand-written lots: the generator calls src/world/landmarks/<id>.js instead of the kit
  hero: [
    { id: 'day1-block', x0: -45, x1: 45, z0: -30, z1: 30, h: 26.2 },
    ...HUTS.map(([body, roof], k) => ({ id: 'lifeguard-hut', key: 'hut' + k, x0: 34 + 300 * (k - 5) - 1.7, x1: 34 + 300 * (k - 5) + 1.7, z0: 61.3, z1: 64.7, h: 4.7, body, roof, beach: true })),
  ],
  // merged sites whose landmark is a later session's: kept clear of kit lots
  reserved: [
    { id: 'pelican-rest', x0: -1321, x1: -1179, z0: -270, z1: -204, ground: 0xf2ddb0 },
    { id: 'phase-one', x0: 1179, x1: 1321, z0: -110, z1: -44, ground: 0xb9a58a },
  ],
  promenade: { z0: 44, z1: 50, gaps: [[592, 608], [-1160, -1140]] },
  landmarks: {
    'day1-block': { x: 0, z: 0, w: 90, d: 60, h: 26.2, level: 0 },
    'heron-walk': { x: 0, z: 47, w: 3200, d: 6, h: 10.5, level: 0 },
    'gullwing-pier': { x: 600, z: 255, w: 16, d: 350, h: 53, level: 0 },
    'pelican-rest': { x: -1250, z: -220, w: 142, d: 66, h: 5, level: 0 },
    'phase-one': { x: 1300, z: -60, w: 142, d: 66, h: 92, level: 0 },
    'lifeguard-huts': { x: 34, z: 63, w: 3.4, d: 3.4, h: 4.7, level: 0 },
  },
  places: [
    { id: 'park-and-sons', kind: 'garage', x: 340, z: -230 }, { id: 'pelican-rest-trailer', kind: 'property', x: -1250, z: -220 },
    { id: 'tideline-motel-12', kind: 'property', x: -520, z: -60 }, { id: 'second-wind-thrift', kind: 'shop:thrift', x: -840, z: -76 },
    { id: 'storm-mart', kind: 'shop:storm', x: 480, z: -156 }, { id: 'birdbath-car-wash', kind: 'carwash', x: -470, z: -236 },
    { id: 'shell-yeah', kind: 'food', x: 118, z: 47 }, { id: 'squeeze-play', kind: 'food', x: -206, z: 47 },
    { id: 'west-marina', kind: 'marina', x: -1150, z: 110 }, { id: 'bay-cab-rank', kind: 'taxi', x: 300, z: 26 },
  ],
  traffic: { tern: 4, pinfish: 4, taxi: 3, tarpon: 3, snook: 3, heron: 2, sailfin: 1, grouper: 2, pompano: 2, mullet: 1, manatee: 1, conch: 1 },
  peds: { beachgoer: 6, tourist: 5, jogger: 1, retiree: 2, skater: 2, 'office worker': 1 },
  ambience: 'beach',
  palette: 'tideline',
};
