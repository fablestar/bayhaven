// Day 3's eight vehicles as data: the model sheets, the handling rows, the engine and horn
// recipes, the traffic mix for each district and what a driver says when their car is taken.
// From plan/bible/catalog/vehicles-road.md, systems/driving.md, art/sfx.md, systems/traffic.md
// and voices/barks.md (row S8). No three.js in here.

// A piece is `name:LxWxH@f,y`, then `x2|X` (a mirrored pair at x = +-X) or `|X` (one piece at x),
// then `#rrggbb` (a fixed colour) or `!` (the stripe colour).
// size: [L, W]. head: [x, y, z] of a headlight's centre. tail: [width, y, z] of the tail strip.
// hs: headlight [w, h]. th: tail strip height. bw: the width the stripe sits on. stripeZ: its run.
export const SHEETS = {
  wahoo: { name: 'Wahoo', cls: 'fast', size: [4.9, 1.95], wheelR: 0.36, base: 2.85, stripe: null, hoodStripes: 0.25, bw: 1.89, head: [0.663, 0.627, 2.4], tail: [1.69, 0.63, -2.38],
    pieces: 'sill:4.9x1.95x0.24@0,0.24 body:2.36x1.89x0.42@-0.54,0.46 hood/f:1.75x1.89x0.42@1.52,0.46 boot/r:0.65x1.89x0.42@-2.05,0.46 cabin:1.95x1.75x0.4@-0.68,0.88 roof:0.94x1.39x0.06@-0.75,1.28 scoop:0.6x0.55x0.14@1.35,0.8#1b1924 tail:0.25x1.85x0.1@-2.28,0.88 pipes:1.2x0.09x0.09@-0.55,0.2x2|0.94#c8ccd2',
    paints: [0xffa02e, 0xd7263d, 0x150f3d, 0x5dff9b, 0xb46bff, 0xffc300] },
  sailfin: { name: 'Sailfin', cls: 'fast', size: [4.4, 1.9], wheelR: 0.34, base: 2.6, stripe: 0.64, bw: 1.84, head: [0.646, 0.571, 2.15], tail: [1.64, 0.625, -2.12],
    pieces: 'sill:4.4x1.9x0.24@0,0.22 body:2.91x1.84x0.36@-0.66,0.44 hood/f:1.35x1.84x0.36@1.47,0.44 cabin:2x1.7x0.36@-0.45,0.8 roof:0.99x1.34x0.06@-0.53,1.16 sail/f0:0.9x0.06x0.42@-1.65,0.8! wing:0.3x1.84x0.05@-2.01,0.98! wingposts:0.1x0.06x0.18@-2.01,0.8x2|0.7#1b1924 splitter:0.15x1.9x0.05@2.12,0.12#1b1924',
    paints: [0x29e6ff, 0xff3fa4, 0xfdf6ea, 0xffc300, 0xff5a5a, 0x2e4a6b] },
  grouper: { name: 'Grouper', cls: 'truck', size: [4.9, 2], wheelR: 0.4, base: 2.9, stripe: 0.86, bw: 1.94, head: [0.68, 0.815, 2.395], tail: [1.74, 0.965, -2.375],
    pieces: 'sill:4.9x2x0.26@0,0.3 body:3.56x1.94x0.6@-0.59,0.54 hood/f:1.2x1.94x0.6@1.79,0.54 cladding:4.74x1.96x0.25@0.01,0.54#6f6a78 cabin:3.4x1.8x0.62@-0.55,1.14 roof:2.39x1.44x0.06@-0.62,1.76 rails:1.8x0.06x0.05@-0.55,1.82x2|0.6#c8ccd2 spare:0.18x0.7x0.7@-2.46,0.8#15141a',
    paints: [0xc9cdd4, 0xb7c9a8, 0x2e4a6b, 0xf5ecd7, 0x6f6a78, 0xa8553a] },
  manatee: { name: 'Manatee', cls: 'bus', size: [11.5, 2.55], wheelR: 0.5, base: 6, twinRear: true, stripe: 1.0, stripeH: 0.3, bw: 2.55, accent: 0xffa02e, head: [0.867, 0.9, 5.755], tail: [2.35, 1.2, -5.7],
    pieces: 'chassis:11.5x2.45x0.35@0,0.3 body:11.05x2.55x1.15@-0.17,0.65#fdf6ea glass:10.7x2.5x0.85@-0.1,1.8 roof:11.15x2.55x0.3@-0.12,2.65 snout/f:0.4x2.45x1.15@5.55,0.65#fdf6ea screen/f0:0.45x2.4x0.85@5.47,1.8 sign:0.15x1.6x0.3@5.38,2.65#1b1924 aircon:2.5x1.6x0.15@-0.5,2.95#c8ccd2 doors:1.2x0.05x1.9@4.25,0.7|-1.285#16263c reardoor:1.2x0.05x1.9@-0.55,0.7|-1.285#16263c bumper:0.06x2.55x0.25@5.72,0.35',
    paints: [0x8fe3cf, 0x9fd2ff, 0xffc98f, 0x7fd6e8, 0xff9eb5, 0xc9a8ff] },
  pinfish: { name: 'Pinfish', cls: 'two', size: [1.8, 0.7], wheelR: 0.22, base: 1.3, two: true, stripe: 0.45, bw: 0.34, stripeZ: [-0.8, -0.14], hs: [0.14, 0.1], th: 0.06, head: [0, 0.95, 0.645], tail: [0.12, 0.6, -0.85],
    rider: { y: 0.78, z: -0.42, barY: 1.05, barZ: 0.49, barX: 0.3 },
    pieces: 'deck:0.55x0.32x0.07@0.12,0.2#1b1924 tail:0.75x0.34x0.41@-0.47,0.27 seat:0.65x0.3x0.1@-0.42,0.68#2b2838 shield:0.1x0.42x0.63@0.45,0.22#fdf6ea column:0.08x0.08x0.2@0.5,0.85#1b1924 bars:0.06x0.7x0.05@0.49,1.05#1b1924 lamp:0.1x0.16x0.14@0.59,0.88#c8ccd2 mudguard:0.4x0.14x0.06@0.65,0.44#fdf6ea',
    paints: [0x8fe3cf, 0xff9eb5, 0xfff1c9, 0x9fd2ff, 0xffa02e, 0xc9a8ff] },
  needlefish: { name: 'Needlefish', cls: 'two', size: [2.05, 0.72], wheelR: 0.3, base: 1.42, two: true, stripe: null, bw: 0.42, hs: [0.16, 0.12], th: 0.06, head: [0, 0.55, 0.875], tail: [0.12, 0.82, -0.975],
    rider: { y: 0.78, z: -0.3, barY: 0.86, barZ: 0.43, barX: 0.27 },
    pieces: 'frame:0.95x0.22x0.34@0,0.32#1b1924 fairing/f:0.7x0.42x0.52@0.52,0.4 screen/f0:0.3x0.3x0.2@0.58,0.92 tank:0.5x0.3x0.24@0.18,0.66! seat:0.45x0.26x0.12@-0.3,0.66#2b2838 tail/f0:0.5x0.22x0.22@-0.72,0.7! bars:0.06x0.62x0.05@0.43,0.86#1b1924 pipe:0.7x0.1x0.1@-0.52,0.4|-0.17#c8ccd2 needle:0.15x0.08x0.08@0.95,0.62#c8ccd2',
    paints: [0x29e6ff, 0xff3fa4, 0x5dff9b, 0xffc300, 0xfdf6ea, 0xff5a5a] },
  birdie: { name: 'Birdie', cls: 'odd', size: [2.4, 1.2], wheelR: 0.22, base: 1.65, stripe: 0.5, bw: 1.1, stripeZ: [0.37, 1.13], hs: [0.26, 0.09], th: 0.09, head: [0.36, 0.475, 1.155], tail: [1, 0.235, -1.205],
    pieces: 'chassis:2.4x1.2x0.17@0,0.15 nose/f:0.8x1.1x0.4@0.75,0.32 bench:0.55x1.1x0.3@-0.18,0.32#fdf6ea backrest:0.1x1.1x0.4@-0.47,0.62#fdf6ea bags:0.22x0.22x0.93@-0.89,0.32x2|0.3#a8553a rearposts:0.05x0.05x1@-0.6,0.72x2|0.55#c8ccd2 frontposts:0.05x0.05x1.4@0.34,0.32x2|0.55#c8ccd2 canopy:1.2x1.2x0.08@-0.05,1.72#fdf6ea screen:0.04x1.1x0.68@0.32,0.72',
    paints: [0xf5ecd7, 0xb7c9a8, 0xc9cdd4, 0xf0d0c8, 0xfdf6ea, 0x3fb86a] },
  flounder: { name: 'Flounder', cls: 'car', size: [5.3, 1.95], wheelR: 0.3, base: 3.05, stripe: 0.58, bw: 1.89, head: [0.663, 0.521, 2.6], tail: [1.69, 0.52, -2.57],
    pieces: 'sill:5.3x1.95x0.22@0,0.1 body:2.06x1.89x0.51@-0.19,0.3 hood/f:1.75x1.89x0.51@1.72,0.3 boot/r:1.35x1.89x0.51@-1.89,0.3 cabin:2x1.75x0.38@-0.2,0.81 roof:0.99x1.39x0.06@-0.28,1.19#fdf6ea skirts:0.9x0.04x0.4@-1.52,0.12x2|0.97#fdf6ea visor:0.3x1.6x0.04@0.3,1.14#1b1924',
    paints: [0x7a3b69, 0x2ec4b6, 0xffb347, 0xd7263d, 0x1f6f5c, 0xb46bff] },
};

// Handling rows: [top km/h, 0 to 100 s, mass kg, options]. Caps, drive and pull are the bible's.
export const PRESET_ROWS = {
  wahoo: [170, 5.5, 1600, { drive: 'rear', capF: 15, capR: 13, slideHold: 0.6, a: 1.425, b: 1.425, hw: 0.975, hl: 2.45, pull: 3 }],
  sailfin: [190, 4.5, 1350, { drive: 'rear', capF: 20, capR: 22, a: 1.3, b: 1.3, hw: 0.95, hl: 2.2, steerRate: 8, pull: 3, rollMul: 0.6 }],
  grouper: [150, 8.5, 2300, { drive: 'all', capF: 13, capR: 15, a: 1.45, b: 1.45, hw: 1.0, hl: 2.45, lockMul: 0.92, steerRate: 6 }],
  manatee: [95, 22, 9000, { drive: 'rear', capF: 10, capR: 12, a: 3, b: 3, hw: 1.275, hl: 5.75, lockMul: 0.7, steerRate: 3, pull: 1.4, pusher: true, rollMul: 1.5, noPark: true }],
  pinfish: [85, 9, 110, { drive: 'rear', capF: 14, capR: 15, a: 0.65, b: 0.65, hw: 0.35, hl: 0.9, steerRate: 9, two: true, throwDv: 5 }],
  needlefish: [200, 3.5, 190, { drive: 'rear', capF: 18, capR: 19, a: 0.65, b: 0.65, hw: 0.36, hl: 1.02, steerRate: 9, pull: 3.5, two: true, throwDv: 7 }],
  birdie: [38, 0, 400, { drive: 'rear', capF: 11, capR: 12, A: 3.0, solved: true, a: 0.825, b: 0.825, hw: 0.6, hl: 1.2, pull: 1.6, oneGear: true, sidewalk: true, quiet: true }],
  flounder: [120, 10, 1700, { drive: 'rear', capF: 13, capR: 14, a: 1.525, b: 1.525, hw: 0.975, hl: 2.65, hop: true }],
};

// Engines (art/sfx.md section 2). a: the first oscillator. b: [type, pitch ratio, gain].
// sub: [ratio, gain] of a sine. hz: idle to the top of fourth. lp: [base, per rev, per throttle], q.
const ENGINES = {
  coupe: { a: 'sawtooth', b: ['square', 0.5, 0.5], hz: [40, 170], lp: [260, 1300, 350], q: 2, level: 1 },
  small: { a: 'square', b: ['sawtooth', 1, 0.35], hz: [55, 210], lp: [320, 1500, 0], q: 2.5, level: 0.9 },
  sedan: { a: 'sawtooth', b: ['triangle', 0.5, 0.6], hz: [42, 165], lp: [240, 1100, 0], q: 1.5, level: 0.9 },
  muscle: { a: 'sawtooth', b: ['square', 0.5, 0.7], sub: [0.25, 0.6], hz: [34, 200], lp: [220, 1200, 500], q: 3, level: 1.3, lope: true },
  sports: { a: 'sawtooth', b: ['sawtooth', 1.5, 0.4], hz: [60, 320], lp: [400, 2200, 600], q: 3.5, level: 1 },
  truck: { a: 'sawtooth', b: ['square', 0.5, 0.6], sub: [0.5, 0.4], hz: [36, 155], lp: [220, 1000, 0], q: 1.8, level: 1.15 },
  van: { a: 'square', sub: [0.5, 0.5], hz: [38, 140], lp: [240, 900, 0], q: 1.5, level: 1 },
  bus: { a: 'sawtooth', b: ['square', 0.5, 0.8], sub: [0.5, 0.8], hz: [20, 85], lp: [160, 700, 0], q: 2, level: 1.6 },
  scooter: { a: 'square', b: ['square', 2.01, 0.3], hz: [90, 360], lp: [700, 2400, 0], q: 4, hp: 150, level: 0.7 },
  bike: { a: 'sawtooth', b: ['sawtooth', 2, 0.35], hz: [110, 620], lp: [500, 3200, 0], q: 4, level: 0.95 },
  cart: { a: 'triangle', b: ['sine', 2, 0.25], hz: [200, 520], lp: [2400, 0, 0], q: 0.7, level: 0.4, noGears: true },
};
const eng = (cls, more) => ({ id: 'engine-' + cls, ...ENGINES[cls], ...more });
const N = { F2: 87.31, F3: 174.61, Bb3: 233.08, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392, A4: 440, B4: 493.88, C5: 523.25, 'C#5': 554.37, D5: 587.33, Eb5: 622.25, A5: 880, B5: 987.77, 'C#6': 1108.73 };
// horn: [low note, high note, low-pass, gain]. The interval is the class's (cars a major third,
// fast a fourth, trucks a fifth, buses an octave, two wheels a major second, small and odd a minor second).
export const SOUNDS = {
  heron: { engine: eng('coupe'), horn: [N.A4, N['C#5'], 2400, 0.25], interval: 'major third' },
  snook: { engine: eng('small'), horn: [N.E4, N.G4, 3200, 0.2], interval: 'minor third' },
  tarpon: { engine: eng('sedan'), horn: [N.G4, N.B4, 2400, 0.25], interval: 'major third' },
  taxi: { engine: eng('sedan'), horn: [N.G4, N.B4, 2400, 0.25], interval: 'major third' },
  mullet: { engine: eng('truck'), horn: [N.D4, N.A4, 1600, 0.3], interval: 'fifth' },
  pompano: { engine: eng('van'), horn: [N.C4, N.G4, 1600, 0.3], interval: 'fifth' },
  wahoo: { engine: eng('muscle'), horn: [N.G4, N.C5, 2400, 0.25], interval: 'fourth' },
  sailfin: { engine: eng('sports', { a: 'sawtooth', b: null }), horn: [N.A4, N.D5, 2400, 0.25], interval: 'fourth' },
  grouper: { engine: eng('truck'), horn: [N.E4, N.B4, 1600, 0.3], interval: 'fifth' },
  manatee: { engine: eng('bus'), horn: [N.F2, N.F3, 1200, 0.35], interval: 'octave' },
  pinfish: { engine: eng('scooter'), horn: [N.B5, N['C#6'], 3200, 0.2], interval: 'major second' },
  needlefish: { engine: eng('bike'), horn: [N.A5, N.B5, 3200, 0.2], interval: 'major second' },
  birdie: { engine: eng('cart'), horn: [N.D5, N.Eb5, 3200, 0.2], interval: 'minor second' },
  flounder: { engine: eng('sedan', { hz: [32, 130], sub: [0.5, 0.5], lope: true }), horn: [N.Bb3, N.D4, 2400, 0.25], interval: 'major third' },
};

// What drives where, for a district whose zone file has no `traffic` row yet (systems/traffic.md, "Mix").
// A zone file's own row always wins. Models that do not exist yet are skipped.
export const DISTRICT_MIX = {
  tideline: { pinfish: 3, taxi: 3, tarpon: 2, snook: 2, heron: 2, sailfin: 1 },
  meridian: { tarpon: 4, taxi: 3, pompano: 2, manatee: 1 },
  'palma-vieja': { flounder: 3, pompano: 2, mullet: 2, pinfish: 2, tarpon: 1 },
  paintworks: { pompano: 3, tarpon: 2, snook: 2 },
  'paintworks-night': { sailfin: 2, wahoo: 2, taxi: 2 },
  rustwater: { mullet: 3, pompano: 1, wahoo: 1 },
  northgate: { tarpon: 2, grouper: 2, snook: 2, mullet: 2, pompano: 2 },
  'mallard-greens': { birdie: 4, grouper: 3, tarpon: 2 },
  'runway-flats': { taxi: 3, pompano: 2, manatee: 1 },
  'mudcat-glades': { mullet: 4, grouper: 1 },
  islands: { heron: 3, grouper: 2, mullet: 3, pinfish: 3 },
  default: { tarpon: 4, snook: 2, taxi: 2, heron: 1, mullet: 2, pompano: 2, grouper: 1, pinfish: 1 },
};

// A driver whose car is taken says one of these, then walks off (voices/barks.md, row S8).
export const THEFT_LINES = {
  tourist: ["That's a rental! I didn't take the damn cover!", 'Hey! My deposit!', 'At least leave the beach towels!'],
  jogger: ['Take it. I was running home anyway.', 'Hey! My good shoes are in there!', "That's my car, you prick! I only jog near it!"],
  retiree: ['That car has had one careful owner! Me!', "The radio's on public radio. Leave it there.", "I'm calling Larry, you thieving little bastard!"],
  office: ["That's a lease, you bastard!", "My laptop's in there! Actually, keep it.", 'I only just found that parking space!'],
  docker: ["That's the crew truck, you thieving prick!", 'My lunch is in the back of that thing!', "The steward's going to hear about this!"],
  clubber: ["That's our ride home, you dick!", "My jacket's in there! It's borrowed!", "Fine. We're staying till close anyway."],
  beachgoer: ['My flip-flops are in that car, you bastard!', "Take it. It's full of sand anyway.", 'Hey! I was parked legally for once!'],
};
// who is likely to be driving what
export const DRIVERS = { mullet: ['docker'], pompano: ['docker', 'office'], manatee: ['docker'], grouper: ['office', 'retiree'], birdie: ['retiree'], pinfish: ['tourist', 'beachgoer', 'clubber'],
  default: ['tourist', 'jogger', 'retiree', 'office', 'clubber', 'beachgoer'] };
