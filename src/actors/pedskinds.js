// The eight kinds of people on the street (plan/04 section 6, plan/bible/systems/people.md and
// art/characters.md): speeds, courage, how likely they are to film, when and where they are out,
// what they wear, and what they do about a car, a horn or a stunt. Pure data, no three.js.

// shirt cells and limb cells on the people atlas (pedsdraw.js draws them in this order)
export const SHIRT = { plain: 0, stripes: 1, check: 2, hivis: 3, tank: 4, polo: 5, suit: 6, floral: 7 };
export const LIMB = { long: 0, short: 1, bare: 2, trousers: 0, shorts: 4, boardies: 5 };
const NEON = ['#ff3fa4', '#29e6ff', '#5dff9b', '#ffa02e', '#b46bff'];

export const SKIN = ['#f3cfb3', '#eac4a6', '#d9a57e', '#c68a5e', '#a8693f', '#8d5b3e', '#6b4630', '#4f3226'];
export const HAIR_COLOR = ['#1e1a1a', '#3a2a1e', '#6a4630', '#9a4a2c', '#e2c27a', '#f4e7a1', '#cfd3d6', '#ff6fb8'];

// boxes from the head's centre: [w, h, d, x, y, z]. Hair keeps only its first box under a hat.
export const HAIR = {
  crop: [[0.40, 0.08, 0.38, 0, 0.20, -0.01]],
  'flat-top': [[0.38, 0.14, 0.36, 0, 0.24, 0]],
  bob: [[0.42, 0.12, 0.40, 0, 0.20, -0.02], [0.42, 0.30, 0.12, 0, 0.02, -0.16]],
  long: [[0.40, 0.08, 0.38, 0, 0.20, -0.01], [0.38, 0.52, 0.08, 0, -0.10, -0.20]],
  ponytail: [[0.40, 0.08, 0.38, 0, 0.20, -0.01], [0.12, 0.24, 0.12, 0, 0.04, -0.26]],
  bun: [[0.40, 0.08, 0.38, 0, 0.20, -0.01], [0.16, 0.16, 0.16, 0, 0.30, -0.08]],
  'big-curls': [[0.50, 0.34, 0.46, 0, 0.22, -0.03]],
  crest: [[0.08, 0.18, 0.38, 0, 0.27, -0.02]],
  ring: [[0.40, 0.10, 0.14, 0, 0.06, -0.14]],
  'side-part': [[0.40, 0.08, 0.38, 0, 0.20, -0.01], [0.20, 0.08, 0.04, -0.08, 0.14, 0.19]],
};
export const HAT = {
  visor: [[0.40, 0.05, 0.38, 0, 0.13, 0], [0.34, 0.02, 0.18, 0, 0.12, 0.27]],
  cap: [[0.40, 0.12, 0.38, 0, 0.22, 0], [0.32, 0.02, 0.16, 0, 0.17, 0.26]],
  'cap-back': [[0.40, 0.12, 0.38, 0, 0.22, 0], [0.32, 0.02, 0.16, 0, 0.17, -0.26]],
  sunhat: [[0.70, 0.02, 0.66, 0, 0.17, 0], [0.36, 0.12, 0.32, 0, 0.24, 0]],
  'hard-hat': [[0.42, 0.14, 0.42, 0, 0.23, 0], [0.36, 0.03, 0.10, 0, 0.17, 0.24]],
  headphones: [[0.44, 0.04, 0.06, 0, 0.20, 0], [0.50, 0.14, 0.12, 0, 0.02, 0]],
  helmet: [[0.44, 0.20, 0.44, 0, 0.20, -0.01]],
};
// one box from the torso's centre
export const BAG = {
  backpack: [0.34, 0.40, 0.14, 0, 0.04, -0.19], tote: [0.06, 0.30, 0.28, 0.24, -0.24, 0.02],
  'cross-body': [0.30, 0.22, 0.10, 0.10, -0.16, -0.18], 'beach-bag': [0.30, 0.26, 0.12, 0.24, -0.20, 0],
};
const HAT_COLOR = { visor: '#fdf6ea', cap: '#ff5a5a', 'cap-back': '#2b2838', sunhat: '#f5e3b0', 'hard-hat': '#ffc300', headphones: '#2b2838', helmet: '#3b3946' };
const BAG_COLOR = { backpack: '#2e4a6b', tote: '#f5ecd7', 'cross-body': '#6b4a32', 'beach-bag': '#ff8f7a' };

// What they do, from the bible's reaction table. J jumps aside, R runs, S shouts, F films, L looks,
// V waves, W walks on. `side` is a car on the sidewalk within 6 m.
export const KINDS = {
  tourist: { label: 'Tourist', walk: 1.2, flee: 4.0, courage: 0.3, films: 0.9, hours: [[9, 22]], jay: 0.1,
    where: ['tideline', 'meridian'], spot: { walk: 5, prom: 4, sand: 1 },
    shirt: SHIRT.floral, shirts: ['#ff9eb5', '#8fe3cf', '#ffc98f'], arm: LIMB.short, leg: LIMB.shorts, legs: ['#fff1c9'],
    hair: null, hats: ['sunhat', 'cap'], hat: 0.8, bags: ['beach-bag'], bag: 0.6,
    side: 'JR', horn: 'L', crash: 'F', stunt: 'F' },
  jogger: { label: 'Jogger', walk: 3.2, flee: 5.5, courage: 0.5, films: 0.2, hours: [[5.5, 9], [17, 20]], jay: 0.05,
    where: ['tideline', 'mallard-greens'], spot: { walk: 2, prom: 8 },
    shirt: SHIRT.tank, shirts: ['#ff3fa4', '#29e6ff', '#5dff9b'], arm: LIMB.bare, leg: LIMB.shorts, legs: ['#2b2838'],
    hair: ['ponytail', 'crop'], hats: ['headphones'], hat: 0.7, bags: [], bag: 0,
    side: 'J', horn: 'W', crash: 'L', stunt: 'L' },
  retiree: { label: 'Retiree', walk: 1.0, flee: 2.5, courage: 0.7, films: 0.4, hours: [[6, 19]], jay: 0,
    where: ['mallard-greens', 'tideline'], spot: { walk: 6, prom: 3 },
    shirt: SHIRT.polo, shirts: ['#f5ecd7', '#b7c9a8', '#f0d0c8'], arm: LIMB.short, leg: LIMB.trousers, legs: ['#c9cdd4'],
    hair: ['ring', 'bob'], hairColor: 6, hats: ['visor'], hat: 0.7, bags: ['tote'], bag: 0.5,
    side: 'JS', horn: 'S', crash: 'L', stunt: 'S' },
  skater: { label: 'Skater', walk: 4.0, flee: 6.0, courage: 0.8, films: 0.8, hours: [[10, 23]], jay: 0.3, rolls: true,
    where: ['tideline', 'paintworks'], spot: { walk: 2, prom: 8 },
    shirt: SHIRT.stripes, shirts: ['#c9a8ff', '#ff8f7a'], arm: LIMB.short, leg: LIMB.shorts, legs: ['#6f6a78'],
    hair: ['long', 'crest'], hats: ['helmet', 'cap-back'], hat: 0.9, bags: ['backpack'], bag: 0.5,
    side: 'JF', horn: 'W', crash: 'F', stunt: 'F' },
  office: { label: 'Office worker', walk: 1.5, flee: 4.5, courage: 0.4, films: 0.5, hours: [[7, 19]], jay: 0.05,
    where: ['meridian'], spot: { walk: 1 },
    shirt: SHIRT.suit, shirts: ['#b8cfe0', '#e0e0e6', '#2e4a6b'], arm: LIMB.long, leg: LIMB.trousers, legs: ['#2e4a6b'],
    hair: ['side-part', 'bun'], hats: [], hat: 0, bags: ['cross-body'], bag: 0.7,
    side: 'JR', horn: 'L', crash: 'F', stunt: 'L' },
  docker: { label: 'Dock worker', walk: 1.4, flee: 4.0, courage: 0.9, films: 0.3, hours: [[5, 23]], jay: 0.05,
    where: ['rustwater'], spot: { walk: 1 },
    shirt: SHIRT.hivis, shirts: ['#ffc300'], arm: LIMB.long, leg: LIMB.trousers, legs: ['#2e4a6b'],
    hair: ['crop'], hats: ['hard-hat'], hat: 1, bags: [], bag: 0,
    side: 'JS', horn: 'S', crash: 'L', stunt: 'L' },
  clubber: { label: 'Clubber', walk: 1.3, flee: 4.0, courage: 0.6, films: 0.9, hours: [[20, 28]], jay: 0.2,
    where: ['paintworks', 'tideline'], spot: { walk: 3, prom: 1 },
    shirt: SHIRT.plain, shirts: ['#b46bff', '#5dff9b', '#150f3d'], arm: LIMB.bare, leg: LIMB.trousers, legs: ['#1b1924'],
    hair: ['big-curls', 'crest'], hairColor: 7, hats: ['headphones'], hat: 0.3, bags: [], bag: 0,
    side: 'JF', horn: 'V', crash: 'F', stunt: 'F' },
  beachgoer: { label: 'Beachgoer', walk: 1.1, flee: 3.5, courage: 0.35, films: 0.7, hours: [[8, 18.5]], jay: 0.05,
    where: ['tideline', 'islands'], spot: { sand: 1 },
    shirt: SHIRT.tank, shirts: NEON, bare: 0.5, arm: LIMB.bare, leg: LIMB.boardies, legs: NEON,
    hair: null, hats: ['sunhat'], hat: 0.4, bags: ['beach-bag'], bag: 0.4,
    side: 'R', horn: 'L', crash: 'F', stunt: 'F' },
};
export const KIND_IDS = Object.keys(KINDS);

// people on `high` by district: [07 to 19, 19 to 24, 00 to 05]; 05 to 07 is half the day's number
export const TARGETS = {
  tideline: [60, 40, 6], meridian: [50, 25, 4], 'palma-vieja': [45, 40, 6], paintworks: [25, 60, 30], rustwater: [20, 10, 8],
  northgate: [35, 20, 3], 'mallard-greens': [20, 6, 0], 'runway-flats': [25, 15, 5], 'mudcat-glades': [4, 2, 0], islands: [15, 15, 2],
};
export function targetFor(district, hour) {
  const row = TARGETS[district];
  if (!row) return 0;
  return hour >= 7 && hour < 19 ? row[0] : hour >= 19 ? row[1] : hour < 5 ? row[2] : Math.round(row[0] / 2);
}
export const isOut = (kind, hour) => KINDS[kind].hours.some(([a, b]) => (hour >= a && hour < b) || (hour + 24 >= a && hour + 24 < b));

// the mix for a district and an hour: the zone file's weights for the kinds that are out, plus
// any kind that lists this district and is out now (clubbers at the neon end after dark)
export function mixFor(zonePeds, district, hour) {
  const mix = {};
  for (const key in zonePeds || {}) { const id = key === 'office worker' ? 'office' : key; if (KINDS[id] && isOut(id, hour)) mix[id] = zonePeds[key]; }
  for (const id of KIND_IDS) if (!(id in mix) && KINDS[id].where.includes(district) && isOut(id, hour) && !(zonePeds && (id in zonePeds || (id === 'office' && 'office worker' in zonePeds)))) mix[id] = 3;
  if (!Object.keys(mix).length) mix[hour >= 20 || hour < 5 ? 'clubber' : 'retiree'] = 1;   // someone is always about
  return mix;
}

// dress one person: colours, cells and up to three boxes of hair, hat and bag
export function dress(kind, r) {
  const k = KINDS[kind], pick = (list) => list[Math.floor(r() * list.length)];
  const skin = pick(SKIN), bare = k.bare && r() < k.bare;
  const hairNames = k.hair || Object.keys(HAIR);
  const hat = k.hats.length && r() < k.hat ? pick(k.hats) : null;
  const bag = k.bags.length && r() < k.bag ? pick(k.bags) : null;
  const hairColor = k.hairColor !== undefined && r() < 0.7 ? HAIR_COLOR[k.hairColor] : pick(HAIR_COLOR.slice(0, 7));
  const shirt = bare ? skin : pick(k.shirts);
  const boxes = [];      // { on: 'head' or 'torso', box, color }
  const hair = HAIR[pick(hairNames)];
  if (hat) {
    const h = HAT[hat];
    if (h.length === 1) boxes.push({ on: 'head', box: hair[hair.length > 1 ? 1 : 0], color: hairColor });
    for (const b of h) boxes.push({ on: 'head', box: b, color: HAT_COLOR[hat] });
    if (h.length === 2 && !bag) boxes.unshift({ on: 'head', box: hair[0], color: hairColor });
  } else for (const b of hair) boxes.push({ on: 'head', box: b, color: hairColor });
  if (bag && boxes.length < 3) boxes.push({ on: 'torso', box: BAG[bag], color: BAG_COLOR[bag] });
  return { skin, shirt, shirtCell: bare ? SHIRT.plain : k.shirt, armCell: k.arm, arm: k.arm === LIMB.bare ? skin : shirt,
    leg: pick(k.legs), legCell: k.leg, boxes: boxes.slice(0, 3), scale: 0.92 + r() * 0.16, hat, bag };
}
