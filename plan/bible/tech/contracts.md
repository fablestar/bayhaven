# Bible · tech · Contracts

What each folder offers the others, as function signatures. This is the target that `docs/contracts/*.md` in the game repository grows towards: a session that builds a module makes its public object match this file, and a session that needs another lane's module calls only what is listed here. If a session has to change a signature, it says so in its note and updates its `docs/contracts/` file.

Tier: A for everything the 32 roadmap sessions build; later additions are marked.

## The one rule

**Never import another lane's file.** A module's `init(ctx)` returns its public object. The registry stores it at `ctx.modules.<name>`. Other lanes reach it only through `ctx.modules`, events and `state`.

```js
// src/systems/heat.mod.js
export default {
  name: 'heat', order: 40, needs: ['player', 'traffic'],
  init(ctx) {
    // private state lives in this closure
    return { add, set, lock, get level() { return ctx.state.heat.level; } };   // the public object
  },
  update(dt, ctx) {},
};
// elsewhere, in another lane:
ctx.modules.heat.add(1, 'cartheft');
```

A module that needs another module which may not exist yet (a parallel lane, a later day) guards the call: `ctx.modules.heat?.add(...)`. A missing module is never an error.

`ctx` holds: `scene`, `camera`, `renderer`, `state`, `events`, `modules`, `quality`, `input`, `map` (shortcut to `modules.map`), `rng`, `build` (`{ day, commit }`).

## Core (lane: Core)

| Module | Public object |
|---|---|
| `events` | `on(name, fn) → off()` · `once(name, fn)` · `emit(name, payload)`. Handlers run in the same step, in registration order. An exception in one handler is caught, counted in `test.errors()`, and does not stop the others. |
| `state` | The plain object in `06-tech-architecture.md`. Each key is written only by its owner. |
| `input` | `actions` (read every step) and `pressed(name)` (true for one step). `inject(script)` for tests. See below. |
| `quality` | `level` ('low', 'medium', 'high') · `get(key)` · `set(level)` · emits `quality:changed`. Every budget number is a key. |
| `save` | `section(key, { version, get(), set(data), migrate: { 1: fn, 2: fn } })` · `write(slot)` · `load(slot)` · `list()` · `exportCode()` · `importCode(str)` · `auto()` |
| `rng` | `rng(seed) → () => number in [0, 1)` (day 1's generator) · `hash2(seed, a, b) → uint32` · `pick(r, array)` · `weighted(r, { key: weight })` |
| `loop` | `time` (seconds of simulation) · `step` (count) · `timeScale` (1, or 0.3 with the phone open, 0 when paused) · `every(seconds, fn)` · `after(seconds, fn)` |

**Input actions** (one object, the same for keyboard, mouse, gamepad and touch):

```js
actions = {
  steer: 0,        // -1 right .. +1 left (day 1's sign)
  throttle: 0,     // -1 brake/reverse .. +1 gas
  handbrake: false,
  moveX: 0, moveY: 0,     // on foot, camera-relative
  lookX: 0, lookY: 0,     // camera orbit, radians per second
  sprint: false, aim: false, fire: false, horn: false,
}
// one-step presses, read with input.pressed('interact'):
// interact, jump, radioNext, radioPrev, switchLead, phone, map, camera, heliCam, pause, ability, weaponNext, hop, lookBack
```

## World (lane: World)

| Module | Public object |
|---|---|
| `map` | `districtAt(x, z) → id or null` · `neighbourhoodAt(x, z)` · `isLand(x, z)` · `depthAt(x, z)` (metres of water, 0 on land) · `heightAt(x, z, level)` · `surfaceAt(x, z, level) → 'road' 'sidewalk' 'sand' 'grass' 'dirt' 'water' 'deck'` · `lotsInChunk(cx, cz)` · `roadsInChunk(cx, cz)` · `landmark(id) → { x, z, w, d, h, level }` · `places(kind) → [{ id, x, z, district }]` for kinds such as `shop:thrift`, `hospital`, `sheriff`, `marina`, `carwash`, `garage`, `busstop` · `nearestRoad(x, z) → { x, z, heading, roadId }` · `snap(seed, need) → { x, z }` (resolves a seed position to the nearest valid spot for `need`: 'lot', 'sidewalk', 'curb', 'road', 'water', 'sand') · `bounds` |
| `chunks` | `isLoaded(cx, cz)` · `loadedCount` · `ensure(x, z, radius) → Promise` (used by teleport, switching and cutscenes) · emits `chunk:loaded`, `chunk:unloaded` with `{ cx, cz, lod }` |
| `collide` | Static: `add(owner, shape)`, `removeOwner(owner)`. Queries: `circle(x, z, r, level, out) → count` · `box(obb, level, out)` · `ray(x0, z0, x1, z1, level) → { t, x, z, owner } or null` · `pushOutCircle(body)` · `pushOutBox(body)`. Dynamic bodies: `bodies.add(body)`, `bodies.remove(body)`, `bodies.near(x, z, r, out)`. A shape is `{ x0, x1, z0, z1, level }` or `{ cx, cz, hw, hd, rot, level }`, with optional `h` (height, for cameras and rays). |
| `nav` | Lanes: `laneNear(x, z, heading) → lane` · `lane(id)` · `next(lane, r) → lane` (a legal random turn) · `lanesInChunk(cx, cz)`. Walking: `walkNear(x, z) → edge` · `walkNext(edge, r)` · `crossings(edge)`. Routing: `route(from, to, opts) → [{ x, z }]` (A* on roads; `opts.avoid` for closed roads). A lane is `{ id, ax, az, bx, bz, len, heading, speed, level, kind, next: [ids], signal, left, right }`. |
| `props` | `spawn(kind, x, z, opts) → id` · `remove(id)` · `hit(id, vx, vz, mass)` · `near(x, z, r, out)` · emits `prop:broken { kind, x, z }` |
| `signals` | `stateOf(signalId) → 'green' 'amber' 'red'` · `phaseAt(x, z)` |
| `sky` | `night` (0 to 1, day 1's value) · `sunDir` · `update(hour, time, camera)` |
| `weather` | `kind` · `wet` (0 to 1) · `wind` `{ x, z, strength }` · `set(kind, seconds)` · `lock(kind or null)` · `grip` (multiplier) · `flood` (metres) · emits `weather:changed`, `weather:lightning { distance }` |
| `fx` | `emit(kind, x, y, z, opts)` · `ribbon(kind) → { push(x, y, z), end() }` (skid marks, wakes) · `shake(amount, seconds)` · `flash(colour, seconds)` (off under reduce motion) · `debris(kind, x, y, z, vx, vy, vz)` |
| `atlas` | `sign(text, colourHex) → uv` · `face(expression) → uv` · `mural(seed, palette) → uv` · `plate(text) → uv` |

## Motion (lane: Motion)

| Module | Public object |
|---|---|
| `vehicles` | `spawn(modelId, x, z, heading, opts) → vehicle` (`opts`: `paint`, `locked`, `ai`, `mission`) · `despawn(v)` · `near(x, z, r, out)` · `models` (the presets by id) · `player` (the vehicle the player is in, or null) · emits the vehicle events in `06` |
| `traffic` | `density` (multiplier, set by hour and district) · `setDensity(mult, seconds)` · `clearArea(x, z, r)` · `reserve(n)` (keeps `n` slots free for a mission) · `routeTo(v, x, z)` (drive an AI car to a point on roads) · `count` |
| `player` | `get() → state.player` · `teleport(x, z, heading, level)` · `enter(vehicle)` · `exit()` · `giveWeapon(id, ammo)` · `setOutfit([ids])` · `freeze(bool)` |
| `characters` | `active` ('mags' or 'teo') · `switchTo(id) → Promise` · `other() → { x, z, vignette }` · `ability()` · `canSwitch` · emits `player:switched` |
| `peds` | `spawn(archetype, x, z, opts) → ped` · `crowd(x, z, r, n, dance)` · `near(x, z, r, out)` · `filmingCount` · `setDensity(mult, seconds)` · emits `ped:hit`, `ped:filming` |
| `cops` | `dispatch(kind, n)` (kinds: `cruiser`, `suv`, `tactical`, `heli`, `showtruck`, `boat`) · `units` · `seePlayer` (true while any unit or camera has line of sight) · `standDown()` |
| `combat` | `damagePlayer(n, source)` · `damage(target, n, source)` · `spawnEnemy(kind, x, z)` · emits `weapon:fired`, `player:knockedout` |
| `boats` | Boats are vehicles; this adds `wakeFor(v)` and `dockNear(x, z)` |
| `chopper` | `camera` (a camera object that follows the player from above) · `active` |

A **vehicle** as other lanes see it: `{ id, model, x, y, z, heading, level, speed, vx, vz, slip, health, onGround, driver, ai, paint, mods, seats }`. Other lanes read these fields and never write them; they ask through the public objects.

## Play (lane: Play)

| Module | Public object |
|---|---|
| `clock` | `hour` · `weekday` (0 Monday to 6 Sunday) · `dayCount` · `set(hour)` · `skipTo(hour)` · `speed` · emits `clock:hour`, `clock:sunset`, `clock:day` |
| `heat` | `level` · `viewers` · `add(points, reason)` · `set(level)` · `lock(level or null)` (missions) · `clear()` · `witnessed(x, z) → bool` · emits `crime`, `heat:changed`, `heat:live`, `heat:cleared`, `player:booked` |
| `economy` | `cash` · `followers` · `addCash(n, reason)` · `spend(n, reason) → bool` · `addFollowers(n, reason)` · emits `cash:changed`, `followers:changed`, `followers:milestone` |
| `missions` | `start(id)` · `abort()` · `state()` · `available()` · `done(id)` · `flag(name)` · `stepType(name, { enter, update, exit })` (how another module makes a step type real) · emits the mission events |
| `dialogue` | `say(lines, opts) → Promise` where a line is `{ who, text, face }` · `skip()` |
| `cutscene` | `play(id) → Promise` · `skip()` · `playing` |
| `gps` | `setWaypoint(x, z)` · `clear()` · `route` · `distance` · emits `waypoint:set` |
| `shops` | `open(shopId)` · `close()` · `isOpen` · `nearest(kind, x, z)` · emits `shop:opened` |
| `wardrobe` | `items` · `owned(id)` · `wear(lead, [ids])` · `outfit(lead)` |
| `property` | `owned(id)` · `buy(id) → bool` · `garage(id)` · `store(id, vehicle)` · `retrieve(id, index)` · emits `property:bought` |
| `phone` | `open(appId)` · `close()` · `isOpen` · `registerApp({ id, name, icon, open, badge })` · `jobs.register({ id, name, start })` · `stats.register({ id, label, get })` · `notify(appId, text)` |
| `activities` | `start(id, opts)` · `active` · `end(result)` |
| `stealth` (day 7) | `guard(x, z, route, opts) → guard` · `suspicion` (0 to 1) · emits `stealth:seen`, `stealth:alarm` |

## Sound (lane: Sound)

| Module | Public object |
|---|---|
| `audio` | `sfx(name, opts)` (`opts`: `x`, `z`, `gain`, `pitch`) · `loop(name, opts) → { set(opts), stop() }` · `bus(name) → GainNode` · `duck(bus, dB, seconds)` · `started` · `muted` · `mute(bool)` |
| `music` | `play(song)` · `stop()` · `beat` (0 to 1 phase of the current beat, for lights that pulse in time) · `bar` · `key` |
| `radio` | `stations` · `current` · `tune(id)` · `next()` · `prev()` · `interrupt(lines)` (the Sheriff's show at heat 4+) · emits `radio:station`, `radio:song`, `radio:line` |
| `voice` | `blip(who, text) → Promise` (resolves when the blips end) · `pitchOf(who)` |
| `ambience` | `set(bedId)` · `layer(name, gain)` |

## UI (lane: Play)

The in-game HUD is drawn on **one 2D canvas** (`#hud`) layered over the game canvas, in device pixels, so that photos and recorded clips can composite it. Menus, the phone, shop menus, the map screen and settings are DOM.

| Module | Public object |
|---|---|
| `hud` | `canvas` · `layout() → [{ id, x, y, w, h }]` (for the overlap check) · `show(id, bool)` · `clipMode(bool)` (hints off, badge on) |
| `ui` | `toast(text, seconds)` · `prompt(key, text)` · `clearPrompt()` · `hint(id, text)` (one line, shown once, gone when done) · `card(spec) → Promise` (the postcard result card, the wristband, the mugshot board) · `tag(text)` (the luggage tag) |
| `minimap` | `addBlip({ id, x, z, icon, colour, pulse })` · `moveBlip(id, x, z)` · `removeBlip(id)` · `zoom` |
| `menus` | `open(id)` · `close()` · `isOpen` · `register({ id, title, build })` |
| `live` | `say(user, text)` (push a chat line) · `ticker(text)` · `visible` |
| `capture` (tier B) | `photo(opts) → Blob` · `startClip(seconds)` · `stopClip() → Blob` · `supported` · emits `photo:taken`, `clip:saved` |

## Events, with payloads

This is the one merged list: the starting set in `06-tech-architecture.md`, every event the systems files in `bible/systems/` add, `vehicle:nearmiss` (asked for by `bible/voices/live-chat.md`) and the ten events `bible/catalog/achievements.md` needs. A lane that emits an event writes it, with its payload, into its own `docs/contracts/` file. Payload fields the news and the scanner read: `ped:hit` carries `speed`, `vehicle:destroyed` carries `owner`, and every hit, down and kill event carries `weapon`.

| Event | Owner lane | Payload | Tier |
|---|---|---|---|
| `crime` | Play, heat | `{ kind, case, seen, points, x, z, weapon }` where `kind` is one of the thirteen in the crime list and `case` is the row in `systems/heat.md` | A |
| `heat:changed` | Play, heat | `{ level, from }` | A |
| `heat:live` | Play, heat | `{ viewers, peak }` twice a second while live | A |
| `heat:cleared` | Play, heat | `{ peak, seconds, from, where }` | A |
| `heat:seen` | Play, heat | `{ seen }` | A |
| `heat:broadcast` | Play, heat | `{ on }` (heat 4 and up, for the radio) | A |
| `heat:roadblock` | Play, heat | `{ x, z }` | A |
| `heat:dropped` | Play, heat | `{ reason }` | A |
| `player:booked` | Play, heat | `{ cost }` | A |
| `player:knockedout` | Motion, combat | `{ cost }` | A |
| `ped:hit` | Motion, peds | `{ id, target, down, head, dist, speed, weapon }`; `weapon` is a weapon id, `vehicle`, `blast` or `fall` | A |
| `ped:down` | Motion, peds | `{ cause, by, weapon }` | A |
| `ped:fled` | Motion, peds | `{ count }` | A |
| `ped:recognised` | Motion, peds | `{ id }` | B |
| `ped:filming` | Motion, peds | `{ count, x, z }` (at most twice a second) | A |
| `crowd:formed` | Motion, peds | `{ id, size }` | B |
| `crowd:scattered` | Motion, peds | `{ id }` | B |
| `weapon:fired` | Motion, combat | `{ weapon, x, z }` | A |
| `combat:hit` | Motion, combat | `{ target, dmg, weapon }` | A |
| `combat:down` | Motion, combat | `{ who, by, weapon }` | A |
| `combat:lock` | Motion, combat | `{ id }` | A |
| `stealth:seen` | Play, stealth | `{ bar }` (replaces `stealth:spotted`) | A |
| `stealth:strike` | Play, stealth | `{ n }` | A |
| `stealth:alarm` | Play, stealth | `{ zone, x, z }` | A |
| `stealth:clear` | Play, stealth | `{ zone }` | A |
| `player:ability` | Motion, actors | `{ lead, affected }`; `ability:used` in the achievements file is the same event and is renamed to this | A |
| `vehicle:crash` | Motion, vehicles | `{ v, speed, what, x, z }` for hits over 3 m/s | A |
| `vehicle:destroyed` | Motion, vehicles | `{ id, by, owner }`; `owner` is `player`, `traffic`, `mission` or `police` | A |
| `vehicle:blast` | Motion, vehicles | `{ x, z, by }` | A |
| `vehicle:hop` | Motion, vehicles | `{ id }` | A |
| `vehicle:nitro` | Motion, vehicles | `{ on }` | B |
| `vehicle:stalled` | Motion, vehicles | `{ id, depth }` | A |
| `vehicle:tyre` | Motion, vehicles | `{ corner }` | A |
| `vehicle:nearmiss` | Motion, vehicles | `{ what, gap }` where `what` is `ped`, `car` or `police` and `gap` is in metres. Fires when the player's vehicle passes within 1 m of a person or vehicle at over 60 km/h and no `vehicle:crash` or `ped:hit` follows within 0.5 s. | B |
| `rider:thrown` | Motion, vehicles | `{ id, speed }` | A |
| `vehicle:entered` | Motion, vehicles | `{ id, dropped }` | A |
| `drift:end` | Motion, vehicles | `{ score, seconds, metres, x, z }` | A |
| `jump:landed` | Motion, vehicles | `{ metres, airSeconds, x, z, clean }` | A |
| `boat:docked` | Motion, boats | `{ id, berth }` | C |
| `boat:aground` | Motion, boats | `{ id }` | C |
| `boat:beached` | Motion, boats | `{ id }` | C |
| `aircraft:takeoff` | Motion, aircraft | `{ id }` | C |
| `aircraft:landed` | Motion, aircraft | `{ id, pad }` | C |
| `aircraft:ceiling` | Motion, aircraft | `{ id }` | C |
| `aircraft:turnback` | Motion, aircraft | `{ id }` | C |
| `traffic:honk` | Motion, traffic | `{ x, z }` | A |
| `traffic:pulledover` | Motion, traffic | `{ count }` | A |
| `traffic:panic` | Motion, traffic | `{ count }` | A |
| `traffic:ambulance` | Motion, traffic | `{ x, z, step }` | A |
| `signals:phase` | World, signals | `{ node, phase }` | A |
| `wildlife:spooked` | Motion, wildlife | `{ species, count }` | B |
| `wildlife:snap` | Motion, wildlife | `{ x, z }` | B |
| `wildlife:fed` | Motion, wildlife | `{ who }` | B |
| `wildlife:gerald` | Motion, wildlife | `{ place }` | B |
| `wildlife:iguanafall` | Motion, wildlife | `{ count }` | B |
| `clock:day` | Play, clock | `{ day, weekday }` | A |
| `weather:phase` | World, weather | `{ phase, category }` | A |
| `weather:flood` | World, weather | `{ level }` | A |
| `weather:warning` | World, weather | `{ category, hours }` | A |
| `economy:payday` | Play, economy | `{ amount, followers }` | A |
| `minigame:started` | Play, activities | `{ id, bet }` | B |
| `minigame:ended` | Play, activities | `{ id, result, prize }` | B |
| `economy:charge` | Play, economy | `{ kind, amount }` (a cost the game takes: hospital, booking, tow) | A |
| `economy:declined` | Play, economy | `{ price }` | A |
| `cash:changed` | Play, economy | `{ delta, reason }` | A |
| `followers:milestone` | Play, economy | `{ followers, milestone }` | A |
| `transit:boarded` | Play, transit | `{ mode, route, stop }` | B |
| `transit:alighted` | Play, transit | `{ mode, stop }` | B |
| `transit:skipped` | Play, transit | `{ mode, from, to, fare }` | B |
| `transit:arrived` | Play, transit | `{ route, stop }` | B |
| `transit:refused` | Play, transit | `{ reason }` | B |
| `transit:shift` | Play, transit | `{ route, state, pay }` | B |
| `clip:started` | Play, recorder | `{ kind, auto }` | B |
| `clip:ready` | Play, recorder | `{ kind, seconds, bytes, score }` | B |
| `clip:saved` | Play, recorder | `{ kind }` | B |
| `clip:dropped` | Play, recorder | `{ reason }` | B |
| `clip:unsupported` | Play, recorder | `{}` | B |
| `unlock:opened` | Play, progression | `{ id }` | B |
| `unlock:teased` | Play, progression | `{ id }` | B |
| `progress:percent` | Play, progression | `{ percent }` | B |
| `difficulty:changed` | Play, progression | `{ level }` | C |
| `collect:found` | Play, things to find | `{ kind, id, district }` | B |
| `job:completed` | Play, activities | `{ kind, pay, tip }` | B |
| `race:finished` | Play, activities | `{ id, place, time }` | B |
| `fish:caught` | Play, activities | `{ kind, value }` | B |
| `localman:ended` | Play, events | `{ id, result }` | B |
| `shop:bought` | Play, economy | `{ shop, kind, item, price }` | B |
| `wardrobe:changed` | Play, wardrobe | `{ lead, slots, seen, dropped }` | B |
| `property:upgraded` | Play, property | `{ id, step }` | B |
| `switch:vignette` | Play, switch | `{ lead, id }` | B |
| `mission:step` | Play, missions | `{ id, step, type }` | A |
| `mission:completed` | Play, missions | `{ id, seconds, cash, followers }` | A |
| `district:entered` | World | `{ id, was }` | A |
| `player:switched` | Motion, characters | `{ to, from }` | A |
| `photo:taken` | Play, capture | `{ x, z, facing, subject }` where `subject` is a landmark id, 'gerald', a postcard id or null | A |

`ped:filming`, `drift:end` and the rest of the starting set keep the payloads written above. `game:*`, `quality:changed`, `save:loaded`, `clock:hour`, `clock:sunset`, `weather:changed`, `weather:lightning`, `chunk:*`, `prop:broken`, `drift:start`, `mission:offered`, `mission:started`, `mission:failed`, `followers:changed`, `shop:opened`, `property:bought`, `radio:*`, `ui:*` and `waypoint:set` are as in `06`.

### Crime kinds

The `crime` event's `kind` is one of these thirteen ids. They are the union of the seven kinds this file used to list and the twelve in `bible/radio/scanner.md`, with duplicates joined: `hit-ped` and `hit-car` became `hit-and-run` and `collision`, `hit-cop` became `cop-ram`, `cartheft` became `carjack`, `flee` became `evade`. `systems/heat.md` lists the same thirteen and says which points case maps to which kind.

| Kind | What it is | Tier |
|---|---|---|
| `collision` | Hitting a vehicle in view of a deputy | A |
| `hit-and-run` | Hurting or knocking down a person in view, with a vehicle or a hand weapon. Over 50 km/h from a vehicle they stay down. | A |
| `carjack` | Taking an occupied vehicle in view | A |
| `cop-ram` | Hitting a Sheriff's vehicle or a deputy | A |
| `shots` | Firing a weapon, or aiming one at a deputy, with nobody put down | A |
| `killing` | Killing someone in view | A |
| `deputy-down` | Killing a deputy | A |
| `evade` | Not stopping for a pull-over for 20 seconds | A |
| `outlast` | Lasting 90 seconds at one heat level | A |
| `property` | Breaking public property in view (hydrant, lamp, sign), or entering a guarded zone | A |
| `theft` | Taking a parked vehicle in view | B |
| `explosion` | A vehicle blown up in view | B |
| `shoot-out` | Ten seconds or more of fire both ways, with deputies, a crew or guards | B |

New events are named `<owner>:<what>` and written into the owner's `docs/contracts/` file with their payload.

## What `docs/contracts/<folder>.md` looks like

Ten to thirty lines. One table: name, signature, one-line meaning. Then "Events I emit" and "Events I listen to". Then "Stand-ins I left" with the file and the contract that should replace each. Nothing else.
