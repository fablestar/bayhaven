# Contract · src/vehicles (lane: Motion)

| Name | Signature | Meaning |
|---|---|---|
| modules.vehicles | `player` (the vehicle the player is in) · `models` (presets by id) · `swap(model)` · `spawn(model, x, z, h) → vehicle` · `despawn(vehicle)` · `near(x, z, r, out) → [vehicle]` | `swap` puts the player in another model (the same object, so holders keep it). `spawn` stands a car that stays put until something hits it. The last three are added by the traffic module and are missing with `?day=1` |
| a vehicle (class `Vehicle`, vehicle.js) | `id x y z h vf vl w steer gear (0..3) slip slipSigned mu model preset mass hw hl r maxSpeed paint accent` · `setModel(id)` · `drive(inp, env)` · `wheelPos(i, out)` | One class for the player's car and every traffic car. Other lanes read, never write. A car's left is its +x |
| the player's car adds | `kmh drift { active, score, mult, held, banked } smoking skidding isPlayer` · `reset(pose)` · `swap(model, paint, accent)` · `step(inp)` · `draw(dt, night)` | |
| a traffic car adds | `kind ('traffic', 'parked', 'loose', 'wreck')` · `ai` (the driver: `lane s next kind curve state gapS red`) · `braking blink spin parked` | `blink` is +1 for a left turn, -1 for a right |
| handling.js | `step(body, inp, env)` · `PRESETS.<model>` · `ready(id) → preset` · `solveA(preset)` · `straightRun(preset, seconds, untilSpeed)` · `TUNE` · `SURFACES` · `DT` | No three.js. `inp`: `{ steer, gas, brake, handbrake, touch }`. Models: `heron snook tarpon mullet pompano taxi` |
| models.js | `createParkedCar(paint, accent, model = 'heron')` · `sheet(id)` · `MODEL_IDS` · `addModel(B, id, paint, accent, masks)` · `trafficGeometry(id)` · `paintMaterial()` · `wheelGeometry(sides)` · `triangles(id)` · `pickPaint(id, r)` · `accentFor(paint)` | Shapes are read from the bible's model sheets. World may import `createParkedCar` |
| modules.traffic | `count` · `target` · `cars` · `parked` · `loose` · `wrecks` · `all` · `list()` · `clear(keepOff)` · `enabled` · `density(district, hour)` · `honks` · `hits` | Moving and parked cars. Owns `state.traffic = { count, target, parked }`. `?traffic=0` starts it switched off. It stays away while a scripted clip plays |
| drive.js | `drive(car, dt, W, nav)` · `startOn(car, lane, s, nav, rnd)` · `rejoin(car, nav, rnd)` · `makeCurve(from, to, kind)` · `turnKind(from, to)` · `RULES` | The driver on rails. No three.js |
| crash.js | `overlap(a, b) → { nx, nz, depth, x, z } or null` · `closing(a, b, hit)` · `resolve(a, b, hit, fixedB)` · `bumpWorld(v, collide)` | Rotated boxes and a mass-scaled impulse. No three.js |
| parked.js | `curbSpaces(map, cx, cz) → [{ key, x, z, h, model, paint, accent }]` with `.total` | The filled 6 m curb spaces of a chunk, from its seed |
| fleet.js | `createFleet(scene, cap)` → `draw(cars, night, camX, camZ, time, wheelRange)` · `calls` · `instances` · `bodies` | One InstancedMesh per model, one for wheels, one for light quads, one for blob shadows |
| modules.signals (`src/systems/signals.js`, found through `src/vehicles/signals.mod.js`) | `state(lane) → 'green', 'amber' or 'red'` · `phase(nodeKey) → { ns, ew }` · `at(x, z)` · `cycle` · `count` · `poles` | Lights where two big roads cross. The phase comes from `loop.time` and the junction's place. `nav.green()` is the older two-phase rule and does not match this: use `signals.state` |
| test entries | `test.topSpeed(seconds, model)` · `test.zeroToHundred(model)` · `test.spawnVehicle(model, { x, z, heading })` (puts the player in that model there) · `test.placeVehicle(model, x, z, h)` · `test.vehicleInfo(model)` · `test.models()` · `test.traffic.list()` · `test.traffic.clear(keepOff)` · `test.traffic.on(yes)` · `test.traffic.counts()` · `test.traffic.firstSeen()` · `test.traffic.spaces(cx, cz)` · `test.signals.at(x, z)` | `list()` gives `[{ id, model, x, z, h, v, kind, state, gapS, red, crossedRed, lane, wait, born, hw, hl, braking, blink }]` |

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
| `signals:phase` | `{ node, phase: 'green/red', ns, ew }` when a junction near the player changes |

Events I listen to: `game:reset` (back to the spawn), `quality:changed` (traffic is cleared and fills again at the new cap).

Stand-ins I left: none. The player's car still reads `modules.world.colliders` and `bounds`; cars knocked loose use `modules.collide`.

Not yet matching the bible: no lane changes (a car takes whatever its lane allows), no right turn on red, no pulled over, panic or rubberneck states (they wait for sirens and weapons), no alarms, traffic does not knock props over, no ambulances or timetabled vehicles, no headlight beams on traffic.
