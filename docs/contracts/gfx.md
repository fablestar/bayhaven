# Contract · src/gfx (lane: World)

| Name | Signature | Meaning |
|---|---|---|
| builder.js | `new MeshBuilder({ uv })` with `box quad hexa cylX flat build()`, `glowTexture()` | Pushes boxes and quads into a few big buffers. Any lane may import this file |
| atlas.js | `signAtlas()`, `grainTexture()` | Day 1's two canvases |
| modules.sky | `night` (0 to 1) · `sunDir` · `update(hour, time, camera)` | Sky, sun, sea, fog and lights from the clock |
| modules.fx | `puff(x, y, z, vx, vz)` · `sparks(x, y, z, nx, nz, count)` · `skid(tyre, x, z, on)` · `shake(metres)` · `shakeX shakeY` · `count(kind)` · `seed(n)` | Caps: 96 puffs, 250 sparks, 300 skid pieces (24, 100, 60 on `low`), fixed at load |

Events I emit: none.

Events I listen to: `vehicle:crash` and `vehicle:scrape` (sparks, shake), `prop:broken` (shake).

Stand-ins I left: none. Not yet matching the bible: `fx.emit`, `fx.ribbon`, `fx.flash`, `fx.debris`, and the `atlas` module.
