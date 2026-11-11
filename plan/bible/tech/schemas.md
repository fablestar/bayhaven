# Bible · tech · Data shapes

Every kind of content in the game is a plain JavaScript object in its own file, found by a glob. This file fixes the shape of each one, so a content session can write data without reading engine code and an engine session knows what it will be handed. The text formats in the canon (missions, songs, events) map onto these shapes one to one.

Tier: A.

## Rules for all content files

- One default export per file. No code that runs at import time except building the object.
- Ids are lower-case with hyphens (`open-house`, `tideline98`), unique within their kind.
- Positions are seed positions `{ x, z }`; the loader calls `map.snap(seed, need)`.
- A `tier` field on anything that is not tier A, so the build can leave it out (`tier: 'C'`). The build includes tiers up to the value of `quality.get('contentTier')`.
- Text the player reads is in the file, never in engine code.

## Zone (`src/world/zones/<id>.js`)

```js
export default {
  id: 'meridian', name: 'Meridian', seed: 4102, tier: 'A',
  bounds: { x0: -800, x1: 800, z0: -1440, z1: -320 },
  neighbourhoods: [{ id: 'exchange', name: 'The Exchange', x0: -300, x1: 500, z0: -1100, z1: -600 }],
  roads: {
    grid: { pitch: 80, avenuesEvery: 4 },          // uses the shared city grid in the canon
    named: [{ id: 'coral-blvd', name: 'Coral Boulevard', kind: 'boulevard', line: { x: 52, z0: 37, z1: -837 } }],
    splines: [/* { id, name, kind, width, points: [[x, z], ...], level } */],
    closed: [/* { roadId, from, to } for the day's barriers */],
  },
  lots: 'grid',                                     // 'grid' | 'spline' | 'free'
  generator: 'meridian',                            // src/world/gen/meridian.js
  recipes: { slab: 0.3, stepped: 0.25, twin: 0.1, corner: 0.15, podium: 0.2 },   // shares by lot
  landmarks: ['spire', 'cityhall'],                 // src/world/landmarks/<id>.js
  places: [{ kind: 'shop:storm-mart', x: -240, z: -700 }],
  traffic: { day: { tarpon: 4, taxi: 3, manatee: 1, pompano: 2 }, night: { tarpon: 2, taxi: 4, sailfin: 1 } },
  peds:    { day: { office: 5, courier: 1, tourist: 2 }, night: { clubber: 1, tourist: 1 } },
  density: { traffic: 1.0, peds: 0.9 },
  ambience: 'city', palette: 'meridian', signs: ['Bean There', 'First Bayhaven Savings'],
};
```

## Lot, road piece, landmark (made by `map.js` and generators)

```js
lot      = { id, cx, cz, x, z, w, d, rot, frontage: 'n'|'s'|'e'|'w', recipe, floors, seed, tags: ['shop:thrift'], hero: null|'landmark-id' }
roadPiece= { roadId, kind, ax, az, bx, bz, width, lanes, level, name }          // straight piece; splines are cut into pieces of 20 m or less
landmark = {                                                                    // src/world/landmarks/<id>.js
  id: 'spire', name: 'Meridian Spire', tier: 'A', seed: { x: 52, z: -900 }, footprint: { w: 60, d: 60 }, height: 260,
  build(B, ctx) {},            // pushes boxes into builders: B.solid, B.neon, B.lit, B.sign
  shell(B) {},                 // the LOD1 version, 300 triangles or fewer
  skyline(B) {},               // the LOD2 outline, 60 triangles or fewer
  colliders: [/* shapes */], places: [/* { kind, dx, dz } */], update(dt, ctx) {},   // update is optional (a turning wheel)
}
```

## Vehicle preset (`src/content/vehicles.js`, one entry per id)

```js
heron: {
  name: 'Heron', class: 'coupe', tier: 'A',
  size: { l: 4.46, w: 1.92, h: 1.40 }, wheelbase: 2.76, wheelR: 0.36, mass: 1300, seats: 2,
  top: 38, accel: 12, brake: 24, reverse: 9,               // m/s and m/s² (day 1's numbers)
  grip: 1.0, lateral: 6.5, handbrakeLateral: 1.2, steerLow: 0.55, steerHigh: 0.075,
  drift: 1.0, health: 100, wheels: 4, lean: 0, water: 'stalls',
  sound: { engine: 'coupe', horn: [440, 554] }, model: 'heron', price: 18000,
  paints: ['#ff4f6e', '#29b6e6', '#ffc23e', '#f7f3ea', '#8a5cff', '#3fd68a'],
}
```

## Person archetype (`src/content/people.js`)

```js
tourist: { name: 'Tourist', speed: 1.3, courage: 0.3, films: 0.8, hat: 'visor', bag: 'camera', palette: ['#ffc98f', '#8fe3cf', '#ff9eb5'],
           districts: { tideline: 5, meridian: 2, islands: 2 }, hours: [9, 20], hangouts: ['bench', 'railing', 'shopfront'] }
```

## Mission (`src/content/missions/<nn>-<id>.js`)

```js
export default {
  id: 'open-house', n: 5, title: 'Open House', tier: 'A', chapter: 1, act: 2,
  giver: 'mags', leads: ['mags', 'teo'], start: { x: -900, z: -1900 }, minutes: 7,
  pays: { cash: 4000, followers: 0 }, unlocks: ['as-seen-on-tv'], needs: ['stealth', 'birdie', 'mallardgreens'],
  steps: [
    { type: 'goto', at: { x: -900, z: -1900 }, r: 8, as: 'vehicle', cond: 'tidy', hint: 'Dents get you turned away.' },
    { type: 'say', lines: 'tour' },
    { type: 'goto', at: { x: -2000, z: -2100 }, r: 3, as: 'foot', stealth: { guards: 2 }, checkpoint: true },
    { type: 'collect', item: 'binder', at: { x: -2004, z: -2096 }, then: 'alarm' },
    { type: 'enter', vehicle: 'birdie', spawn: { x: -1990, z: -2080 } },
    { type: 'goto', at: { x: -2450, z: -2420 }, r: 6, heat: { set: 2 }, timer: 240, checkpoint: true },
    { type: 'heat', want: 'clear', hint: 'Out of sight, the viewers leave.' },
  ],
  fail: [{ when: 'stealth:seen', count: 3 }, { when: 'vehicle:destroyed' }, { when: 'timer' }],
  lines: { tour: [{ who: 'guide', text: "Welcome to Bayhaven Tomorrow. Please don't touch the lawn." }, { who: 'mags', text: "It's plastic." }] },
  card: { caption: 'Thank you for touring.', stamp: 'Delivered' },
  react: { squawk: 'someone drove a golf cart through the 14th green and i have never felt more alive', news: 'A golf cart left Mallard Greens today by an unapproved exit.' },
};
```

Step fields by type: `say { lines }` · `cutscene { id }` · `goto { at, r, as, cond, timer, heat, stealth }` · `enter { vehicle, spawn }` · `follow { target, keep }` · `chase { target, stopBy: 'ram'|'block'|'time', hits }` · `deliver { what, to, maxDamage, timer }` · `collect { item, at, count, then }` · `photo { subject, from, r }` · `heat { want: 'reach'|'hold'|'clear', level, seconds }` · `survive { seconds, spawn }` · `timer { seconds, onEnd }` · `defeat { enemies }` · `switch { to }` · `choice { options, flag }`. Any step may carry `hint`, `checkpoint`, `lead` (who must be active), `weather`, `hour`.

## Cutscene (`src/content/cutscenes/<id>.js`)

```js
export default { id: 'opening', seconds: 38, skippable: true, hour: 17.5, weather: 'clear',
  actors: { mags: { at: [-1250, -220] }, teo: { at: [-1246, -224] }, gerald: { at: [-1255, -215] } },
  shots: [
    { t: 0,  cam: { from: [-1270, 6, -200], look: [-1250, 2, -220], fov: 40, move: 'push', to: [-1262, 4, -208] } },
    { t: 6,  act: [{ who: 'marco', do: 'walk', to: [-1240, -230] }], line: { who: 'teo', text: 'They took my scooter.' } },
  ] };
```

## Radio station and song (`src/content/radio/<id>.js`)

```js
export default {
  id: 'tideline98', name: 'Tideline 98', freq: '98.1', tier: 'A', host: { name: 'Nightshift Nina', pitch: 220 },
  recipe: { bpm: [96, 118], scales: ['major', 'dorian'], kit: 'pop', instruments: ['pad', 'pluck', 'sawbass', 'lead'] },
  songs: [{
    title: 'Low Sun, High Tide', artist: 'Parasol Club', bpm: 104, key: 'A', scale: 'dorian', bars: 4,
    chords: ['Am7', 'D9', 'Fmaj7', 'E7'],
    kick: 'x...x...x...x...', snare: '....x.......x...', hat: 'x.x.x.x.x.x.x.x.', perc: null,
    bass: '1..1..5..1..b7..5', lead: '5.653.1.3.5.6...', pad: 'gate8',
    form: [['intro', 4], ['verse', 8], ['chorus', 8], ['verse', 8], ['chorus', 8], ['break', 4], ['chorus', 8], ['out', 4]],
  }],
  lines: ['It is 2 a.m., the roads are empty, and so is my fridge.'], idents: ['Tideline 98. Still up.'], ads: ['spf1000', 'lawyer-larry'],
};
```

**Pattern strings.** Sixteen steps are one bar of sixteenths. A drum step is one character: `x` hit, `X` accent, `o` ghost, `.` rest. A note step is one symbol: `.` rest, `-` hold, or a scale degree `1` to `7` with an optional `b` or `#` in front (a semitone down or up) and an optional `^` or `_` behind (an octave up or down). So `1..1..5..1..b7..5` is sixteen steps. Spaces and `|` are ignored. A string longer than one bar loops over the form section. **Degrees count from different places:** bass degrees count from the root of the chord that is playing at that moment; lead degrees count from the song's key. So with the chords above, a bass `1` over `D9` is D, while a lead `1` is always A. `pad` values: `whole`, `gate8`, `gate16`, `stab24` (stabs on beats 2 and 4), `off` (offbeats).

## Text reactions

```js
// src/content/squawk.js entries
{ on: 'drift:end', if: 'score > 5000', who: '@beachbum_brenda', text: 'whoever is drifting past {landmark} rn: marry me', tier: 'A' }
// src/content/chat.js entries (LIVE overlay)
{ on: 'heat:changed', if: 'level == 3', text: 'WE ARE LIVE', tier: 'A' }
// src/content/news.js entries (radio)
{ on: 'jump:landed', if: 'metres > 30', text: 'A man described as "airborne" was seen over {district} this afternoon.' }
```

`if` is a tiny expression over the payload and `state`: comparisons, `and`, `or`, and the names in the payload. Placeholders: `{district}`, `{street}`, `{landmark}`, `{vehicle}`, `{score}`, `{count}`, `{metres}`, `{handle}`, `{hour}`, `{weekday}`.

## Shop, clothing item, weapon, property

```js
shop     = { id: 'second-wind', name: 'Second Wind Thrift', kind: 'clothes', hours: [9, 21], stock: ['floral-3', 'visor'], perk: 'changeLook', clerk: { look: 'retiree', lines: [...] } }
clothing = { id: 'floral-12', name: 'Hibiscus shirt', slot: 'top', colours: ['#ff9eb5', '#fff1c9'], pattern: { kind: 'floral', seed: 12, size: 6, density: 0.4 }, price: 45, shops: ['second-wind'] }
weapon   = { id: 'noodle', name: 'Pool noodle', kind: 'melee', damage: 8, rate: 3, range: 1.8, knock: 0.2, ammo: null, price: 0, sound: 'bop' }
property = { id: 'tideline-motel-12', name: 'Tideline Motel, room 12', seed: { x: -520, z: -60 }, price: 8000, garage: 1, income: 0, upgrades: [{ id, name, price, effect }] }
```

## Activity, race, ramp, find, event, drop, clip

```js
activity = { id: 'bay-cab', name: 'Bay Cab fares', start: 'vehicle:taxi', loop: [...steps as in missions...], pay: 'base 40 + 0.9 * metres / 10 - 5 * bumps', levels: 5, tier: 'A' }
race     = { id: 'strand-sprint', name: 'Strand Sprint', class: 'any', laps: 1, checkpoints: [{ x, z }], rivals: 4, prize: [1500, 600, 200], when: { weekday: 4, hour: 23 } }
ramp     = { id: 'ba-03', seed: { x, z }, heading: 90, over: 'the fountain', medals: [18, 26, 34], tier: 'A' }
find     = { kind: 'flamingo', id: 'fl-tideline-03', seed: { x, z }, hint: 'Under the third lifeguard hut.' }
event    = { id: 'gator-return', tier: 'B', where: { district: 'northgate', r: 60 }, when: { hours: [10, 18], weather: ['clear'] }, beats: [...], ends: 'time 90 | player leaves 150', pay: 200, news: '...', squawk: '...' }
drop     = { day: 2, id: 'drift-night', marker: { x: 30, z: 37 }, start(ctx) {}, stop(ctx) {} }   // src/content/drops/day-2.js
clip     = { id: 'day-2', seconds: 12, hour: 19.4, weather: 'clear', lead: 'teo', vehicle: 'heron', at: { x: -160, z: 37, heading: 90 },
             camera: 'chase', inputs: [{ t: 0, hold: ['gas'] }, { t: 4.2, hold: ['gas', 'left', 'handbrake'] }, { t: 5.6, hold: ['gas'] }] }
```

## Save

The shape in `04-systems.md` section 18. Each module registers one section; `save.js` wraps them:

```js
{ v: 3, day: 9, savedAt, playSeconds, sections: { clock: {...}, economy: {...}, chars: {...}, missions: {...}, property: {...}, found: {...}, stats: {...}, settings: {...} } }
```

A section's `migrate[n]` lifts its own data from version `n` to `n + 1`. A section a build doesn't know is kept untouched and written back, so a save can pass through an older build without losing newer data.

## Quality table (`src/core/quality.js`)

```js
{            //  low    medium   high
  lod0Radius:  [1,     2,       2],     lod1Radius: [4, 5, 6],
  pixelRatio:  [1.5,   1.5,     2],     minPixelRatio: [0.75, 1, 1],
  trafficCap:  [14,    26,      40],    pedCap: [20, 40, 60],   copCap: [6, 9, 12],
  debrisCap:   [40,    80,      120],   windowGeometry: [false, true, true],
  shadows:     ['blob','blob',  'sun'], post: [false, false, true],
  fog:         [[150, 700], [220, 1000], [300, 1400]],
  rainStreaks: [300,   700,     1400],  audioVoices: [24, 36, 48],
  contentTier: 'A',                     // raised by the build for bonus and later content
}
```

## Changelog note (`changelog/<session-id>.md`)

```
# D4-S2 · Radio
Shipped: ...            (bullets a viewer can read)
Not shipped: ...        (and why, in one line each)
Rough edges: ...
Numbers: draw calls 96 / 212 (low / high) · triangles 141k / 480k · sim 3.1 ms · bundle 268 kB · lines +2,140
Stand-ins: ...
For integration: ...    (exact changes wanted in shared files)
```
