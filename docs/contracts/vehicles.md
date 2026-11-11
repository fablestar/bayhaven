# Contract · src/vehicles (lane: Motion)

| Name | Signature | Meaning |
|---|---|---|
| modules.vehicles | `player` (the vehicle the player is in) · `models` (presets by id) · `sounds` (engine and horn recipes by id) · `swap(model)` · `spawn(model, x, z, h) → vehicle` · `despawn(vehicle)` · `near(x, z, r, out) → [vehicle]` | `swap` puts the player in another model (the same object, so holders keep it). `spawn` stands a car that stays put until something hits it. The last three are added by the traffic module and are missing with `?day=1` |
| a vehicle (class `Vehicle`, vehicle.js) | `id x y z h vf vl w steer gear (0..3) slip slipSigned mu model preset mass hw hl r maxSpeed paint accent` · `setModel(id)` · `drive(inp, env)` · `wheelPos(i, out)` | One class for the player's car and every traffic car. Other lanes read, never write. A car's left is its +x |
| the player's car adds | `kmh drift { active, score, mult, held, banked } smoking skidding isPlayer lean lift (metres off the road in a hop) hops thrown (seconds left off the bike) blink special empty` · `reset(pose)` · `swap(model, paint, accent)` · `step(inp)` · `draw(dt, night)` | |
| a traffic car adds | `ridden` (a two-wheeler with its rider on) · `lean` · `kind ('traffic', 'parked', 'loose', 'wreck')` · `ai` (the driver: `lane s next kind curve state gapS red`) · `braking blink spin parked` | `blink` is +1 for a left turn, -1 for a right |
| handling.js | `step(body, inp, env)` · `PRESETS.<model>` · `ready(id) → preset` · `solveA(preset)` · `straightRun(preset, seconds, untilSpeed)` · `TUNE` · `SURFACES` · `DT` | No three.js. `inp`: `{ steer, gas, brake, handbrake, touch }`. Models: `heron snook tarpon mullet pompano taxi wahoo sailfin grouper manatee pinfish needlefish birdie flounder`. Preset flags other lanes may read: `two` (two wheels: `lean`, `throwDv`), `hop`, `pusher` (the bus), `sidewalk` and `quiet` (the cart), `oneGear`, `noPark` |
| models.js | `createParkedCar(paint, accent, model = 'heron')` · `sheet(id)` · `MODEL_IDS` · `addModel(B, id, paint, accent, masks, { baked, rider })` · `addRider(B, sheet.rider)` · `addHeadlights` · `addTaillights` · `addIndicators` · `indicatorSpots(id)` · `trafficGeometry(id, rider)` · `paintMaterial()` · `wheelGeometry(sides)` · `triangles(id)` · `pickPaint(id, r)` · `accentFor(paint)` | Shapes are read from the bible's model sheets. A sheet's `wheels` are `[x, z, width multiplier]`: two for a two-wheeler, four otherwise (twin rears are one wide wheel). World may import `createParkedCar` |
| src/content/vehicles.js | `SHEETS` · `PRESET_ROWS` · `SOUNDS.<model> { engine { id, a, b, sub, hz, lp, q, level, lope, noGears, hp }, horn [low Hz, high Hz, low-pass, gain], interval }` · `DISTRICT_MIX` · `THEFT_LINES` · `DRIVERS` | Day 3's eight models as data, every model's sound, the traffic mix by district, what a driver says. No three.js |
| modules.cartheft (`theft.mod.js`) | `count` · `last { model, kind, text, seen, witnesses, x, z, driver }` · `subtitle` | A driver brakes for the player on foot in the road or at their door. When `vehicles.despawn` takes a driven traffic car with him within 6 m, the driver is added to the street (`modules.peds.add`), says a line and walks off |
| modules.carvoice (`voice.mod.js`, `voice.js`) | `update(sound, ratio, throttle, gear, on)` · `honk(sound, seconds, loud)` · `stats` · `engineTone(recipe, ratio, throttle, gear)` | STAND-IN for the Sound lane: the class engine for the model being driven (all but the coupe recipe, which `modules.audio` already plays) and other drivers' horns on `traffic:honk` |
| modules.traffic | `count` · `target` · `cars` · `parked` · `loose` · `wrecks` · `all` · `list()` · `clear(keepOff)` · `enabled` · `density(district, hour)` · `honks` · `hits` · `mixFor(zone, district, hour)` · `walkers` (bodies on foot a driver brakes for) · `onTake` · `taken` | Moving and parked cars. Owns `state.traffic = { count, target, parked }`. `?traffic=0` starts it switched off. It stays away while a scripted clip plays |
| drive.js | `drive(car, dt, W, nav)` · `startOn(car, lane, s, nav, rnd)` · `rejoin(car, nav, rnd)` · `makeCurve(from, to, kind)` · `turnKind(from, to)` · `RULES` | The driver on rails. No three.js |
| crash.js | `overlap(a, b) → { nx, nz, depth, x, z } or null` · `closing(a, b, hit)` · `resolve(a, b, hit, fixedB)` · `bumpWorld(v, collide)` | Rotated boxes and a mass-scaled impulse. No three.js |
| parked.js | `curbSpaces(map, cx, cz) → [{ key, x, z, h, model, paint, accent }]` with `.total` | The filled 6 m curb spaces of a chunk, from its seed |
| fleet.js | `createFleet(scene, cap)` → `draw(cars, night, camX, camZ, time, wheelRange)` · `calls` · `instances` · `bodies` | One InstancedMesh per model, one for wheels, one for light quads, one for blob shadows |
| modules.signals (`src/systems/signals.js`, found through `src/vehicles/signals.mod.js`) | `state(lane) → 'green', 'amber' or 'red'` · `phase(nodeKey) → { ns, ew }` · `at(x, z)` · `cycle` · `count` · `poles` | Lights where two big roads cross. The phase comes from `loop.time` and the junction's place. `nav.green()` is the older two-phase rule and does not match this: use `signals.state` |
| test entries | `test.topSpeed(seconds, model)` · `test.zeroToHundred(model)` · `test.spawnVehicle(model, { x, z, heading })` (puts the player in that model there) · `test.placeVehicle(model, x, z, h)` · `test.vehicleInfo(model)` · `test.models()` · `test.traffic.list()` · `test.traffic.clear(keepOff)` · `test.traffic.on(yes)` · `test.traffic.counts()` · `test.traffic.firstSeen()` · `test.traffic.spaces(cx, cz)` · `test.signals.at(x, z)` · `test.ride()` (core owns `test.vehicle()`; this is the body: `model kmh vf vl w y lift mu lean steer gear thrown hops blink wheels two`) · `test.traffic.mix(district, hour)` · `test.traffic.models()` · `test.cartheft()` · `test.engineTone(model, ratio, throttle, gear)` · `test.carvoice()` | `list()` gives `[{ id, model, x, z, h, v, kind, state, gapS, red, crossedRed, lane, wait, born, hw, hl, braking, blink }]` |

Events I emit:

| Event | Data |
|---|---|
| `drift:start` | `{}` |
| `drift:end` | `{ score, wall }` |
| `vehicle:crash` | `{ speed, what: 'wall', x, z, nx, nz }` into a wall, or `{ speed, what: 'vehicle', x, z, nx, nz, model }` into another car; speed in m/s, for hits over 3 m/s |
| `vehicle:scrape` | `{ x, z, nx, nz, speed }`, sliding along a wall above 8 m/s |
| `vehicle:gear` | `{ gear, up }`, gear 1 to 4 |
| `vehicle:entered` | `{ model }`, the player is now in this model |
| `prop:broken` | `{ kind, x, z, speed }`, kind is `lamp`, `lampLong`, `barrier` or `cone` |
| `traffic:honk` | `{ x, z, id, seconds }`: a driver was cut off, hit or is stuck behind something. Nothing plays it yet (the audio lane's to pick up) |
| `vehicle:hop` | `{ x, z, model }`, the Flounder left the ground |
| `rider:thrown` | `{ x, z, dv, why: 'hit' or 'slide', model, damage }`; `damage` is the bible's `clamp((dv - 5) * 4, 5, 35)`, for whoever owns health |
| `crime` | `{ kind: 'cartheft', case: 'carjack', seen, witnesses, x, z, model }` when a driven car is taken. `seen` is `modules.heat.witnessed(x, z)` once heat exists; until then, anyone but the driver within 30 m on foot or 25 m in a car |
| `vehicle:taken` | `{ model, id, x, z, driver (a person's id or null), line }` |
| `ui:toast` | `{ kind: 'subtitle', who: 'Driver', text, seconds }`, the driver's line |
| `signals:phase` | `{ node, phase: 'green/red', ns, ew }` when a junction near the player changes |

Events I listen to: `game:reset` (back to the spawn), `quality:changed` (traffic is cleared and fills again at the new cap), `input:first` and `input:press` (`mute`) for the stand-in voice, `traffic:honk` (played as that model's horn).

Input: the hop reads `actions.special`, and until core has that action, `actions.sprint` (Shift) while in a car.

Stand-ins I left: `subtitle.js` (one line of speech at the bottom of the screen; the HUD lane should show `ui:toast` with `kind: 'subtitle'` and delete it) and `voice.js` / `voice.mod.js` (class engines and horns; the Sound lane should read `modules.vehicles.sounds`, after which these go). The player's car still reads `modules.world.colliders` and `bounds`; cars knocked loose use `modules.collide`.

Not yet matching the bible: no lane changes (a car takes whatever its lane allows), no right turn on red, no pulled over, panic or rubberneck states (they wait for sirens and weapons), no alarms, traffic does not knock props over, no ambulances or timetabled vehicles, no headlight beams on traffic.
