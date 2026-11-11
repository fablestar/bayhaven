# 06 · Tech architecture

## Where day 1 left us

Day 1 is 1,228 lines of plain JavaScript in seven files (`main.js`, `world.js`, `sky.js`, `car.js`, `builder.js`, `input.js`, `audio.js`), three.js 0.187 and Vite 8, `base: './'`. It draws about 22 draw calls and 56,000 triangles, the bundle is 564 kB (143 kB gzipped), and it has a headless screenshot tool (`tools/shot.mjs`, Playwright with software GL). Its ideas are good and are kept:

- **`MeshBuilder`** pushes boxes and quads into a few big buffers, so a whole block is a handful of draw calls.
- **Vertex colours and flat shading**, no image textures apart from two canvases (signs, glow).
- **One clock drives everything**: sky, sun, sea, fog, neon, windows.
- **Resolution drops by itself** when frames are slow.
- **`window.__game`** exposes state for tests.

The rest of this file is how that grows into a streamed city that several sessions can build at once.

## Stack

| Choice | Decision | Why |
|---|---|---|
| Renderer | three.js `WebGLRenderer`, pinned to 0.187.x | Works on every phone today. WebGPU is not needed for this look. |
| Language | Plain JavaScript modules, no TypeScript, no framework | Nothing to compile but the bundle. Sessions read less. |
| Build | Vite, `base: './'`, target `es2020` | Already in place. Each daily build runs from its own folder. |
| Physics | **Our own**, no engine | The world is flat and the game is arcade. 2D bodies, boxes and circles in a spatial hash cost almost nothing on a phone. A physics library would add 1–2 MB and a second source of bugs. |
| Post-processing | three's own `EffectComposer` (ships inside the `three` package), high quality only | No extra dependency. |
| Audio | Web Audio API directly | All sound is synthesised. |
| Tests | Playwright (dev dependency), browsers in `/studio/.pw` | Already installed by day 1. |
| Dependencies | `three`, `vite`, `playwright`. Nothing else without a line in the changelog saying why. Never a CDN link. | Small bundle, no supply surprises. |

## Assets: code first

Everything below is made in code, and the game is complete with nothing else. An optional asset layer puts made hero assets on top (see "The asset layer" at the end of this file).

| Thing | How it's made |
|---|---|
| Buildings, props, landmarks | `MeshBuilder` calls in generator files. Merged per chunk by material. |
| Vehicles | One builder function per model (`src/vehicles/models.js`), 300–600 triangles, drawn with `InstancedMesh` for traffic. |
| People | Six boxes each, six `InstancedMesh` for everyone on screen, limbs posed by maths. Faces and shirt patterns come from a canvas atlas. |
| Textures | Drawn on canvases at start: the sign atlas (day 1), a window-grid atlas for LOD1 walls, a face atlas, a mural generator, road decals, minimap tiles. Never an image file. |
| Palms, lamps, small props | `InstancedMesh` per kind, placed per chunk. Palms sway in the vertex shader. |
| Sky, sea, weather | Shaders (day 1's, extended). |
| Sound and music | Oscillators, noise and envelopes (`07-art-and-audio.md`). |
| Text | System fonts. The wordmark is drawn from shapes in code. No font files. |

`MeshBuilder` v2 (day 2) stores colours as bytes and normals as signed bytes. That halves vertex memory from 36 to 18 bytes with no visible change.

## Module layout

Day 2's foundation session moves the seven files into this tree. After that, **every session owns named folders and edits nothing else.**

```
src/
  main.js                 boots the renderer and the module registry. Nobody edits it after day 2.
  core/                   LANE: Core
    registry.js           finds and runs every *.mod.js
    events.js             the event bus
    state.js              the one shared game state object
    input.js              keyboard, mouse, gamepad, touch → one actions object
    quality.js            low / medium / high and dynamic resolution
    save.js               save, load, migrate
    rng.js                seeded random numbers
    testapi.js            window.__game.test
  gfx/                    LANE: World
    builder.js  materials.js  atlas.js  sky.js  sea.js  weather.js  post.js  fx.js
  world/                  LANE: World
    map.js  chunks.js  collide.js  nav.js  props.js  skyline.js
    zones/<district>.js       one file per district (data)
    gen/<district>.js         one generator per district
    landmarks/<id>.js         one file per landmark
  vehicles/               LANE: Motion
    vehicle.js  handling.js  models.js  traffic.js  damage.js  boats.js  chopper.js
  actors/                 LANE: Motion
    rig.js  player.js  characters.js  peds.js  cops.js  combat.js
  systems/                LANE: Play
    clock.js  heat.js  missions.js  dialogue.js  cutscene.js  switch.js  economy.js
    shops.js  property.js  wardrobe.js  phone.js  gps.js  signals.js  health.js
    activities/<job>.js
  content/                LANE: Play (radio/ belongs to Sound)
    missions/<nn>-<name>.js  events/<name>.js  drops/day-<n>.js  clips/day-<n>.js
    vehicles.js  weapons.js  shops.js  clothes.js  properties.js  squawk.js  names.js
    radio/<station>.js  cutscenes/<name>.js
  audio/                  LANE: Sound
    engine.js  synth.js  music.js  radio.js  sfx.js  ambience.js  voice.js
  ui/                     LANE: Play
    hud.js  minimap.js  mapscreen.js  menus.js  title.js  credits.js  touch.js
    missionui.js  live.js  phone/<app>.js  styles.css
tools/
  check.mjs               the acceptance runner
  checks/<session-id>.mjs one file of checks per session
  shot.mjs  lint-names.mjs  changelog.mjs
changelog/<session-id>.md one note per session; CHANGELOG.md is built from these
docs/contracts/<folder>.md  what each folder offers to the others, 10–30 lines each
plan/                     a copy of this plan (read-only for sessions); the deep specs are in plan/bible/
```

### How modules plug in without a shared list

A module is a file ending in `.mod.js` that exports one object. (The tree above leaves out the `.mod` to save space: a file the registry should run is named `heat.mod.js`; a helper it imports is plain `rope.js`.)

```js
// src/systems/heat.mod.js
export default {
  name: 'heat',
  order: 40,                       // update order; lower runs first
  needs: ['player', 'traffic'],    // other module names; init waits for them
  init(ctx) { /* ctx = { scene, camera, state, events, map, quality, modules }; returns this module's public object */ },
  update(dt, ctx) {},
  dispose() {},
};
```

`core/registry.js` collects them with `import.meta.glob('../**/*.mod.js', { eager: true })`. Content works the same way: the mission engine globs `content/missions/*.js`, the radio globs `content/radio/*.js`, the map globs `world/zones/*.js`.

`init` returns the module's public object and the registry stores it at `ctx.modules.<name>`. A lane reaches another lane's module only through that object, events and state, never by importing its file. The signatures are in `bible/tech/contracts.md`.

**Nobody ever edits a central list to add a feature.** Two sessions adding two modules touch two different new files. That is what makes parallel sessions safe.

Order bands: 0–9 input and clock · 10–19 world and streaming · 20–29 vehicles and traffic · 30–39 actors · 40–49 systems · 50–59 audio · 60–69 camera · 70–79 UI · 90 test API.

### The four lanes

| Lane | Owns | Typical sessions |
|---|---|---|
| **World** | `src/world/**`, `src/gfx/**` | districts, landmarks, streaming, weather, post |
| **Motion** | `src/vehicles/**`, `src/actors/**` | handling, traffic, people, police, boats, damage |
| **Play** | `src/systems/**`, `src/ui/**`, `src/content/**` except `content/radio/` | missions, phone, shops, HUD, map, saving |
| **Sound** | `src/audio/**`, `src/content/radio/**`, `src/ui/radio.js` | radio, effects, ambience |
| **Core** (solo only) | `src/core/**`, `src/main.js`, `index.html`, `vite.config.js`, `package.json`, `tools/check.mjs` | foundation, performance, release |

Rules that keep lanes apart:

1. A session edits only its own lane's folders, plus its own new files in `tools/checks/`, `changelog/` and `docs/contracts/`.
2. Lanes talk through **events** and **state**, never by importing each other's internals. The only cross-lane imports allowed are the ones listed in `docs/contracts/`.
3. If a session needs something from another lane that doesn't exist yet, it writes the smallest stand-in inside its own folder, marks it `// STAND-IN: replace with <contract>`, and lists it in its changelog note. It does not reach into the other lane.
4. New event names and new state fields are added by writing them into the session's own `docs/contracts/<folder>.md`. Names are prefixed by the owner (`heat:changed`, `state.heat.level`), so two sessions can't collide.
5. Core files change only in Core sessions, which never run alongside anything else.
6. No source file over 500 lines. Split it. Short files are cheap for the next session to read.

### Events

`events.emit(name, payload)` / `events.on(name, fn)`. The starting set, by owner:

| Owner | Events |
|---|---|
| core | `game:ready`, `game:pause`, `game:resume`, `quality:changed`, `save:loaded` |
| clock, weather | `clock:hour`, `clock:sunset`, `weather:changed`, `weather:lightning` |
| world | `chunk:loaded`, `chunk:unloaded`, `district:entered` |
| vehicles | `vehicle:entered`, `vehicle:exited`, `vehicle:crash` (speed, what), `vehicle:destroyed` (owner), `vehicle:blast`, `vehicle:nearmiss` (what, gap), `drift:start`, `drift:end` (score), `jump:landed` (distance), `prop:broken` |
| actors, combat | `player:spawned`, `ped:hit` (speed, weapon), `ped:down` (weapon), `ped:fled`, `ped:filming` (count), `player:knockedout`, `player:switched`, `player:ability`, `weapon:fired`, `combat:hit`, `combat:down` (weapon), `stealth:seen`, `stealth:alarm` |
| heat | `crime` (kind, case, seen, points, weapon), `heat:changed` (level, from), `heat:live` (viewers), `heat:cleared`, `heat:roadblock`, `player:booked` |
| traffic | `traffic:honk`, `traffic:pulledover`, `traffic:panic`, `traffic:ambulance` |
| missions | `mission:offered`, `mission:started`, `mission:step`, `mission:failed`, `mission:completed` |
| economy | `cash:changed`, `followers:changed`, `followers:milestone`, `shop:opened`, `property:bought` |
| radio | `radio:station`, `radio:song`, `radio:line` |
| ui | `ui:toast`, `ui:prompt`, `waypoint:set`, `photo:taken` |

**Crime kinds** (the `kind` of `crime`): `collision`, `hit-and-run`, `carjack`, `cop-ram`, `shots`, `killing`, `deputy-down`, `evade`, `outlast`, `property` (tier A), and `theft`, `explosion`, `shoot-out` (tier B). The full events table, with every payload and the events the bonus and later sessions add, is in `bible/tech/contracts.md`; on a conflict that table wins.

Squawk, the radio news and the stats page are built only from these events. If a feature wants the world to react to it, it emits an event and writes it down.

### State

One plain object, `state`, from `core/state.js`. Each module owns one key and only it writes there; everyone may read.

```js
state = {
  build:   { day, commit },
  clock:   { hour, speed },             weather: { kind, wet, wind },
  player:  { id, mode, x, z, y, h, level, speed, health, armour, vehicle },
  chars:   { mags: {...}, teo: {...} },
  heat:    { level, viewers, peak, seen },
  economy: { cash, followers },
  mission: { id, step, flags },
  world:   { district, chunksLoaded },
  ui:      { phoneOpen, paused },
  settings:{ quality, music, sfx, reduceMotion },
}
```

The save file (`04-systems.md` §18) is a filtered copy of this object. That is why the format can be fixed on day 2.

## Collision and movement

- **Static world:** every building and solid prop adds a box (axis-aligned, or rotated) to a **spatial hash** with 20 m cells when its chunk loads, and removes it on unload. A query asks only the cells a body touches. Day 1's loop over every collider is replaced on day 2.
- **Vehicles:** a rotated rectangle. Against the world, push out and slide (day 1's response). Against each other, a separating-axis overlap test and an impulse scaled by mass.
- **People:** a circle. Step up 0.35 m, slide along walls.
- **Height:** `map.heightAt(x, z, level)`. Curbs, beach slope, ramps and decks. No terrain mesh to trace against.
- **Rays** (bullets, camera, line of sight for police): a grid walk through the same spatial hash.
- **Fixed step:** simulation runs at 60 steps a second with at most three steps per frame; rendering interpolates. Results are the same at 30 and 144 fps.

## Performance budgets

Two reference devices. "Mid phone" means a mid-range Android from 2021–22 or an iPhone 11. "Laptop" means integrated graphics at 1080p.

| Budget | Mid phone (`low`) | Laptop (`high`) |
|---|---|---|
| Frame rate | 30 fps steady (33 ms) | 60 fps steady (16.6 ms) |
| Draw calls | ≤ 150 | ≤ 300 |
| Triangles on screen | ≤ 180,000 | ≤ 600,000 |
| Pixel ratio | 1.5, falling to 0.75 by itself | up to 2 |
| LOD0 / LOD1 radius | 1 / 4 chunks | 2 / 6 chunks |
| Moving cars / people / police | 14 / 20 / 6 | 40 / 60 / 12 |
| Simulation time per frame (JavaScript, not drawing) | ≤ 6 ms | ≤ 4 ms |
| Chunk building per frame | ≤ 4 ms | ≤ 4 ms |
| Longest single frame while driving | ≤ 50 ms | ≤ 33 ms |
| Canvas textures | ≤ 6 at 1024² | ≤ 8 at 2048² |
| Shadows | blob shadows only | one 2048 sun shadow map, 120 m around the player |
| Post-processing | none (glow sprites, as day 1) | bloom, vignette, colour grade |
| JavaScript heap | ≤ 250 MB | ≤ 600 MB |
| JavaScript bundle, gzipped | ≤ 450 kB by day 9 (143 kB on day 1) | same |
| First frame after opening the link | ≤ 6 s on 4G | ≤ 3 s |

`medium` sits between the two. `core/quality.js` holds every one of these numbers in one table, so tuning is one file.

**No loading screen.** The first frame shows the nine chunks around the spawn; everything else streams in behind the fog.

## Tests a script can run

`npm run check -- --id <session-id>` builds the game, serves `dist/`, opens it in headless Chromium, and runs that session's checks plus the standing gates. It prints one JSON object and exits non-zero on any failure. `npm run check -- --day N` runs every check for days 1 to N.

Two modes, because the studio's server has no graphics card:

- **Budget mode** (default, software GL, runs inside the sandbox): checks everything that doesn't depend on a real GPU: no console errors, draw calls, triangles, simulation milliseconds, chunk-build milliseconds, bundle size, and that each feature can be reached and behaves.
- **Frame-rate mode** (`--fps`, run on a machine with a GPU): the same script measures real frame times, once at 1920×1080 and once at 844×390 with pixel ratio 1.5 and the CPU slowed four times to stand in for a phone.

### The test API

`src/core/testapi.js` puts this on `window.__game.test`. Checks use only this, so they don't break when internals move. Each lane adds its own entries when it ships the feature.

```js
test.ready                          // promise: first frame drawn, spawn chunks loaded
test.stats()                        // { calls, tris, simMs, chunkMs, fps, heapMB, chunks, cars, peds, cops }
test.errors()                       // console errors and warnings seen so far
test.teleport(x, z, h)              // move the player (and their vehicle)
test.setHour(h); test.setWeather(kind); test.setQuality(q)
test.input([{ t: 0, hold: ['gas','left'] }, { t: 2.5, hold: ['gas','handbrake'] }, { t: 4, hold: [] }])
test.wait(seconds)                  // advances real time
test.player()                       // copy of state.player
test.spawnVehicle(id); test.enter(); test.exit()
test.setHeat(n); test.heat()
test.mission.start(id); test.mission.skipStep(); test.mission.state()
test.switchTo('mags' | 'teo')
test.save.export(); test.save.import(code)
test.clip.play('day-5')             // runs that day's scripted clip; resolves when done
```

### Standing gates (every session, every day)

| Gate | Pass |
|---|---|
| G1 Build | `npm run build` exits 0 |
| G2 Clean console | 0 errors, 0 warnings, 0 page errors over a 60 s scripted drive through at least 8 chunks |
| G3 Budgets | `test.stats()` at five fixed spots (beach, downtown, port, expressway, swamp, as far as the map exists): calls, triangles and `simMs` inside the `low` and `high` budgets |
| G4 Streaming | over the 60 s drive, `chunkMs` p95 ≤ 4 and no frame's simulation over 12 ms |
| G5 Names | `node tools/lint-names.mjs` finds 0 banned words in `src/` and `index.html` (not in `dist/`, where the bundled three.js would give false hits) |
| G6 Size | gzipped JavaScript inside the bundle budget for that day (day 2: 220 kB, rising 35 kB a day, cap 450 kB) |
| G7 Earlier days | every earlier day's checks still pass |
| G8 Frame rate (`--fps` only) | 5th-percentile frame rate ≥ 55 at laptop size and ≥ 30 at phone size with 4× CPU slow-down |

Day-specific checks are listed per day in `08-roadmap.md`.

### The name check

`tools/lint-names.mjs` searches the game's own source for strings the game must never contain, case-insensitive, and fails the build on a hit. The list lives in `plan/BANNED.txt`, one pattern per line. It starts with:

- names from other games in this genre (their cities, states, districts, lead characters, studios, and the abbreviation for the series)
- anything that reads as digital money or its jargon: `\bsol\b`, `solan`, `solen`, `solar[ao]`, `crypto`, `blockchain`, `\btoken`, `\bcoins?\b`, `\bnft`, `wallet`, `airdrop`, `memecoin`
- a short list of real car makers, real fast-food chains, real social apps and real places

Ordinary words that contain a pattern by accident (`console`, `solid`) are handled with word boundaries, and a session may add a narrow exception line with a reason. It may not delete a pattern.

## Clips

Each day has a scripted clip so the day's footage is repeatable: `src/content/clips/day-N.js` is a timeline of inputs, a camera choice, an hour and weather, lasting 10–15 seconds. Opening the build with `?clip=day-N` plays it once, with the HUD's day badge on and hints off, then holds the last frame. Anyone can record it with any screen recorder; nothing is faked, because it is the real game being driven by a script. `test.clip.play()` runs the same thing in the checks.

## Saving

Covered in `04-systems.md` §18. Technically: `core/save.js` reads `state` through a whitelist, writes JSON to `localStorage` under `bayhaven.save.<slot>`, and keeps a list of `migrate[n]` functions that lift a version `n` save to `n + 1`. The check for day 9 loads a save made by every earlier build that had saving and confirms the player lands on solid ground with their cash intact.

## Working rules for every session

These are also in the standing rules every session is given.

1. Read `plan/README.md`, your prompt, and only the `docs/contracts/*.md` you need. Don't read the whole source tree.
2. Stay in your lane's folders.
3. Commit after each working piece, with a message a viewer can follow.
4. Add your checks to `tools/checks/<session-id>.mjs` as you go and run them.
5. Look at no more than four screenshots a session, at 960×540. Use `test.stats()` for everything a number can answer.
6. End with `npm run build`, `npm run check -- --id <session-id>`, a note in `changelog/<session-id>.md` (what shipped, what didn't, known rough edges, real numbers), and an updated `docs/contracts/<folder>.md`.
7. If something isn't done, say so in the note. Never fake a feature to pass a check.

## Branches when sessions run in parallel

- Each parallel session works in its own copy of the repository on a branch named `lane/<session-id>`.
- The day's first session and any Core session run alone on `main`.
- When the parallel sessions end, an **integration session** merges the branches into `main` one at a time, runs the day's checks after each, fixes what broke, and writes nothing new.
- Because of the lane rules, merges should only ever conflict in `package-lock.json` (rebuild it) or not at all. A conflict anywhere else means a session left its lane; the integration note names it.

## Going deeper

`bible/tech/` holds the engineering detail: `contracts.md` (every module's public object), `schemas.md` (the shape of every kind of content file), `algorithms.md` (the loop, streaming, collision, lanes, simulation levels, routing, crowds, audio scheduling, the clip recorder), `perf-playbook.md` (ledgers that add up to the budgets, and what to do when a number goes over) and `test-harness.md` (how `npm run check` works).

## The asset layer

Sessions never download or generate assets. They may ask for one by writing a request file in `art/requests/`. An art department outside the sandbox makes the file with generative models, converts it to the game's formats and budgets, and commits it under `public/assets/` with an entry in `public/assets/manifest.json`. The `assets` module (`src/gfx/assets.mod.js`, session B-00) loads made assets after the first frame and swaps them in for their code-made versions; without them, or with `?assets=off`, the game is exactly the code-made one. Models are converted to the same flat-shaded, vertex-coloured buffers as everything else, so the look and the draw-call budgets hold. The request format, the manifest, every budget and the checks are in `bible/tech/art-pipeline.md`.
