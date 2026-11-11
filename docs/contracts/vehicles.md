# Contract · src/vehicles (lane: Motion)

| Name | Signature | Meaning |
|---|---|---|
| modules.vehicles | `player` (the car the player is in) · `models` (presets by id) | One vehicle so far, the Heron. `spawn`, `despawn`, `near` are not built |
| the car | `x y z h vf vl w steer gear (0..3) slip slipSigned mu kmh maxSpeed drift { active, score, mult, held, banked } smoking skidding model` · `reset(pose)` · `wheelPos(i, out)` | Other lanes read, never write |
| handling.js | `step(body, inp, env)` · `PRESETS.heron` · `solveA(preset)` · `straightRun(preset, seconds, untilSpeed)` · `TUNE` · `SURFACES` · `DT` | No three.js. `inp`: `{ steer, gas, brake, handbrake, touch }` (the input actions) |
| models.js | `createParkedCar(paint, accent)` · `addBody` · `WHEELS` · `WHEEL_R` | World may import `createParkedCar` |
| test entries | `test.topSpeed(seconds)` · `test.zeroToHundred()` | Added by this module |

Events I emit:


| Event | Data |
|---|---|
| `drift:start` | `{}` |
| `drift:end` | `{ score, wall }` |
| `vehicle:crash` | `{ speed, what: 'wall', x, z, nx, nz }`, speed in m/s into the wall, for hits over 3 m/s |
| `vehicle:scrape` | `{ x, z, nx, nz, speed }`, sliding along a wall above 8 m/s |
| `vehicle:gear` | `{ gear, up }`, gear 1 to 4 |
| `prop:broken` | `{ kind, x, z, speed }`, kind is `lamp`, `lampLong`, `barrier` or `cone` |

Events I listen to: `game:reset` (back to the spawn).

Stand-ins I left: none. The car reads `modules.world.colliders` and `bounds` directly until `collide` ships.
