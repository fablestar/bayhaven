# Contract · driving, effects, props (as of D2-S1)

Day 2's code is still flat in `src/`. Session D2-S2 moves it into the module layout; these are the shapes to keep.

## Handling (`src/handling.js`, no three.js)

- `step(body, inp, env)` advances one body by `DT` (1/60 s). `inp`: `{ steer (+1 left), gas 0..1, brake 0..1, handbrake, touch }`. `env`: `{ surfaceAt(body)` returning `{ grip, drag }`, `collide(body)`, `emit(name, data) }`.
- Body fields: `x z y h vf vl w steer gear (0..3) shiftT slip slipSigned sR mu acc braking handbrake wallHit drift { active, score, mult, held, banked }`.
- `PRESETS.heron`, `solveA(preset)`, `straightRun(preset, seconds, untilSpeed)`, `TUNE` (the two arcade aids), `SURFACES` (road, sand, sea).

## Events (through `src/events.js`, a stand-in bus)

| Event | Data |
|---|---|
| `drift:start` | `{}` |
| `drift:end` | `{ score, wall }` |
| `vehicle:crash` | `{ speed, what: 'wall', x, z, nx, nz }`, speed in m/s into the wall, for hits over 3 m/s |
| `vehicle:scrape` | `{ x, z, nx, nz, speed }`, sliding along a wall above 8 m/s |
| `vehicle:gear` | `{ gear, up }`, gear 1 to 4 |
| `prop:broken` | `{ kind, x, z, speed }`, kind is `lamp`, `lampLong`, `barrier` or `cone` |

## Props (`src/props.js`)

`props.add(kind, x, y, z, rot, { color, onChange(broken) })` before `props.finish()`; `props.hitTest(cx, cz, R, vx, vz, onHit)`; `props.update(dt, night)`; `props.reset()`; `props.count(kind, 'down' or 'up')`. One instanced mesh per part of each kind.

## Effects (`src/fx.js`)

`fx.puff(x, y, z, vx, vz)`, `fx.sparks(x, y, z, nx, nz, count)`, `fx.skid(tyre, x, z, on)`, `fx.shake(metres)`, `fx.step(dt)`, `fx.draw(camera, night, speedShake)`, `fx.count('smoke', 'sparks' or 'skid')`, `fx.seed(n)`. Caps: 96 puffs, 250 sparks, 300 skid segments (24, 100, 60 on coarse pointers).

## Input (`src/input.js`)

`input.poll(dt)` fills `steer gas brake throttle handbrake horn lookBack touch pad`. `input.script([{ t, hold: [...] }])` plays timed holds (`gas left right brake handbrake horn back`) in game time and resolves at the last entry.

## Test entries (`window.__game.test`)

`ready`, `stats()` (`calls tris simMs simTime`), `teleport(x, z, h, speed)`, `setHour(h)`, `input(steps)`, `advance(seconds)` (runs the fixed step now, without drawing), `player()` and `vehicle()`, `count(event)`, `reset()`, `topSpeed(seconds)`, `zeroToHundred()`, `clip.play(id)`.

## URL

`?clip=day-2` plays the clip. `?day=N` overrides the build day (the drop is built only on 2). `?hour=H` as on day 1.
