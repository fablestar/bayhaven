// The seven weapons of plan/04-systems.md section 8, with the timings of plan/bible/systems/combat-stealth.md,
// who has how much health, what guards shout, and the three pickup spots that stand in for shops.
// Pure data: no three.js, nothing from another lane.
//   slot: hand, sidearm or long (the three-slot quick bar)   every: seconds between hits or rounds
//   reach: metres of a swing   range: metres of a round   holds: rounds in the weapon   reload: seconds

export const SLOTS = ['hand', 'sidearm', 'long'];
export const SLOT_NAMES = { hand: 'Hand', sidearm: 'Sidearm', long: 'Long' };

export const WEAPONS = {
  fists:    { id: 'fists', name: 'Fists', slot: 'hand', damage: 12, every: 0.35, reach: 1.4, combo: 3, sound: 'punch' },
  noodle:   { id: 'noodle', name: 'Pool noodle', slot: 'hand', damage: 8, every: 0.22, reach: 2.0, knockEvery: 5, stagger: 0.3, sound: 'bop',
    boxes: [[0.75, 0, 0, 1.5, 0.07, 0.07, 0xff3fa4]] },
  flamingo: { id: 'flamingo', name: 'Lawn flamingo', slot: 'hand', damage: 25, every: 0.7, reach: 1.8, breaksAfter: 10, knock: true, sound: 'knock',
    boxes: [[0.3, 0, 0, 0.6, 0.03, 0.05, 0xff9eb5], [0.72, 0.05, 0, 0.35, 0.22, 0.14, 0xff9eb5], [0.92, 0.3, 0, 0.08, 0.35, 0.06, 0xff9eb5], [1.0, 0.48, 0, 0.14, 0.08, 0.06, 0x150f3d]] },
  pistol:   { id: 'pistol', name: 'Pistol', slot: 'sidearm', damage: 18, every: 0.28, range: 50, holds: 12, reload: 1.4, spread: 1.5, pack: 24, most: 96, sound: 'pistol',
    boxes: [[0.1, 0.03, 0, 0.2, 0.05, 0.035, 0x3b3946], [0.02, -0.05, 0, 0.05, 0.12, 0.035, 0x3b3946], [0.21, 0.03, 0, 0.03, 0.05, 0.036, 0xffa02e]] },
  flare:    { id: 'flare', name: 'Flare gun', slot: 'sidearm', damage: 5, every: 0.4, range: 60, holds: 1, reload: 2.2, speed: 30, burns: 6, pack: 4, most: 8, lob: true, sound: 'flare',
    boxes: [[0.08, 0.03, 0, 0.16, 0.06, 0.06, 0xff9a3c], [0.02, -0.05, 0, 0.05, 0.11, 0.04, 0xff9a3c]] },
  smg:      { id: 'smg', name: 'SMG', slot: 'long', damage: 9, every: 0.083, range: 35, holds: 30, reload: 2.0, spread: 2, spreadMax: 7, pack: 60, most: 180, auto: true, sound: 'smg',
    boxes: [[0.15, 0.03, 0, 0.3, 0.07, 0.045, 0x3b3946], [0.14, -0.08, 0, 0.04, 0.16, 0.03, 0x29e6ff], [0.02, -0.05, 0, 0.05, 0.1, 0.035, 0x3b3946], [-0.1, 0.03, 0, 0.18, 0.04, 0.03, 0x3b3946]] },
  shotgun:  { id: 'shotgun', name: 'Shotgun', slot: 'long', damage: 60, every: 0.9, range: 30, holds: 6, reload: 0.5, perShell: true, pellets: 8, cone: 9, knockWithin: 12, pack: 12, most: 36, sound: 'shotgun',
    boxes: [[0.4, 0.04, 0, 0.6, 0.04, 0.04, 0x3b3946], [0.3, 0, 0, 0.16, 0.05, 0.05, 0x8a6f55], [0.05, 0.02, 0, 0.2, 0.07, 0.045, 0x3b3946], [-0.15, -0.01, 0, 0.25, 0.09, 0.04, 0x8a6f55]] },
};

// what one hit does at d metres. The shotgun falls in a straight line from 60 at 5 m to 10 at 20 m and is nothing past 30 m.
export function damageAt(id, d) {
  const w = WEAPONS[id];
  if (!w) return 0;
  if (id === 'shotgun') return d > w.range ? 0 : d <= 5 ? 60 : d >= 20 ? 10 : 60 - (d - 5) * (50 / 15);
  return d <= (w.range || w.reach) ? w.damage : 0;
}

// health, vest, what they carry
export const WHO = {
  player:    { health: 100, vest: 100 },
  bystander: { health: 50, vest: 0 },
  guard:     { health: 60, vest: 0, carries: 'pistol', name: 'Guard', shirt: 0x2e3350, legs: 0x8a7f6a, hat: 0xffa02e },
  crew:      { health: 50, vest: 0, carries: 'pistol', name: 'Crew', shirt: 0xb0307a, legs: 0x2a2a34, hat: 0x150f3d },
  deputy:    { health: 80, vest: 40, carries: 'pistol', name: 'Deputy', shirt: 0xc9b891, legs: 0x4a5a52, hat: 0x1f8f86 },
};

// the numbers of the fight that are not one weapon's
export const COMBAT = {
  playerTakes: 0.5,            // shots and blows at the player do half the table
  vestSoak: 0.8,               // a vest takes 80% of a ranged hit while it lasts
  regenAfter: 6, regenRate: 2, regenTo: 30,
  lockMost: 40, lockMelee: 12, coneMouse: 35, coneTouch: 50, lockLose: 1.2, lockFar: 1.2,
  lockSpread: [1, 3, 6],       // degrees: standing, jogging, sprinting
  hitBase: 0.75, hitFall: 60, hitMin: 0.1, sprintDodge: 0.5, coverDodge: 0.3,
  burst: [2, 3], wait: [1.5, 3], lean: 0.8,
  coverWithin: 15, coverOut: 0.6, allyHears: 30, aloneWithin: 20, aloneUnder: 0.6,
  walk: 1.6, run: 3.6, flee: 5.5, unseen: 5, search: 8, floored: 2, downFor: 90, downSeen: 240,
  hostile: [4, 8, 12], lying: [4, 8, 12], pickupBack: 60, vehicleShare: 0.3,
  bill: 0.05, billMost: 2500, wakeHealth: 50, screen: 5,
  hospital: { x: -500, z: -1700 },     // Bayhaven General (plan/bible/00-canon.md); Northgate is not built yet
};

// what a guard says the moment he sees you, when he is hit, when he runs and when he reloads behind a car
export const BARKS = {
  callout: ['Hey! That one, right there!', 'Got a problem by the cars!', 'You picked the wrong car park, pal.', 'Stop right there. I am counting to one.'],
  cover:   ['Taking cover!', 'I do not get paid enough for this.', 'Behind the car, behind the car!'],
  flee:    ['Nope. I quit.', 'Keep the badge, I am gone!', 'This is a twelve dollar an hour job!'],
  hit:     ['Ow! That is my good arm!', 'I felt that!'],
  search:  ['Where did they go?', 'Come out, we only want to talk. Loudly.'],
};

// Three marked spots near the spawn until shops exist. Offsets are metres from the map's spawn point;
// the combat module moves each to the nearest clear ground. `vest` is the life vest (armour 100).
export const PICKUPS = [
  { id: 'beach-kit', label: 'Beach kit', dx: 9, dz: 5, gives: ['noodle', 'flare'], vest: true },
  { id: 'lawn-kit', label: 'Lawn and order', dx: -12, dz: 5, gives: ['flamingo', 'pistol'] },
  { id: 'heavy-kit', label: 'Heavy bag', dx: 0, dz: 9, gives: ['smg', 'shotgun'] },
];
