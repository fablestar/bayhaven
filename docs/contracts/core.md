# Contract · src/core (lane: Core)

`ctx` (handed to every module): `scene camera renderer state events quality input save loop registry test params rng build modules map`.

| Name | Signature | Meaning |
|---|---|---|
| registry | a file `src/**/<name>.mod.js` exporting `{ name, order, renderOrder?, needs?, init(ctx), update(dt, ctx), render(alpha, ctx), dispose() }` | Found by itself. `init` returns the public object, kept at `ctx.modules.<name>`. `render` runs once a frame in `renderOrder` (else `order`). `registry.list()`, `registry.toggle(name)` |
| events | `on(name, fn) → off()` · `once(name, fn)` · `emit(name, payload)` · `count(name)` | Handlers run at once, in order; a throw is caught and lands in `test.errors()` |
| state | `ctx.state`, the shape in plan/06, plus `property`, `found`, `stats` for the save | Each key is written only by its owner |
| input | `actions { steer (+1 left), throttle, gas, brake, handbrake, moveX, moveY, lookX, lookY, sprint, aim, fire, horn, lookBack, touch, pad }` · `pressed(name)` · `press(name)` · `inject(timeline or fn(actions, dt) → done) → Promise` · `stop()` | One actions object for keyboard, touch, pad and scripts. Press names: `camera skipTime reset mute interact radioNext radioPrev` |
| quality | `level` · `get(key)` · `set(level)` · `pixelRatio` · `TABLE` | Every budget number is a row `[low, medium, high]` in `quality.js` |
| loop | `time` · `step` · `timeScale` · `dt` · `alpha` · `frameTime` · `every(s, fn) → stop()` · `after(s, fn)` · `stepOnce()` | 60 fixed steps a second, at most three a frame |
| save | `section(key, { version, get, set, migrate })` · `snapshot()` · `apply(data)` · `write(slot)` · `load(slot)` · `list()` · `exportCode()` · `importCode(str)` · `auto()` | Format v1: `{ v, day, savedAt, playSeconds, sections, versions }`, key `bayhaven.save.<slot>` |
| rng | `rng(seed) → () => [0, 1)` · `hash2(seed, a, b)` · `pick(r, array)` · `weighted(r, weights)` | Day 1's generator |
| test | `ready stats() errors() modules() teleport(x, z, h, speed) setHour(h) setQuality(q) input(script) wait(s) advance(s) player() count(event) reset() resetStats() drive(stops, opts) save.export() save.import(code) save.snapshot()` | `window.__game.test`. Lanes add entries with `ctx.test.<name> = fn` |
| debug | `?debug` overlay; `modules.debug.text()` | Keys 1 to 9 switch the costliest modules off |

Events I emit: `game:ready` (first frame drawn), `game:reset` (R key, `test.reset()`), `quality:changed { level, from }`, `save:loaded { day, v }`, `input:first`, `input:press { name }`, `view:resize { w, h }`.

Events I listen to: none.

URL: `?quality=low|medium|high`, `?day=N`, `?hour=H`, `?clip=day-N`, `?debug`, `?test=1` (no autosave).

Stand-ins I left: none in core. `test.stats().chunkMs` reads `modules.chunks.buildMs` and is 0 until streaming ships.
