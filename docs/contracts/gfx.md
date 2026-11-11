# Contract · src/gfx (lane: World)

| Name | Signature | Meaning |
|---|---|---|
| builder.js | `new MeshBuilder({ uv, size })` with `tri quad flat hexa box cylX`, `reset()`, `build({ free, groundUv })`, `count`, `triangles`; `glowTexture()` | v2: float positions, byte normals, byte colours (18 bytes a vertex). Typed arrays that grow and are used again after `reset()`. `free` lets the copies go once uploaded. Any lane may import this file |
| materials.js | `chunkMaterials() → { G, M, B, N, S, L, leaf, update(night), lit }` | The seven materials every streamed chunk, shell, the skyline and the decor share |
| atlas.js | `signAtlas()`, `grainTexture()`, `signUV(i)`, `SHOP_SIGNS` | Day 1's two canvases, made once. The sign sheet has 16 cells of 512×128; four new shop names fill the last four |
| modules.sky | `night` (0 to 1) · `sunDir` · `update(hour, time, camera)` · `setFog(near, far)` | Sky, sun, sea, fog and lights from the clock. Fog distances come from the quality table. The sea is 6.8 km wide |
| modules.fx | `puff(x, y, z, vx, vz)` · `sparks(x, y, z, nx, nz, count)` · `skid(tyre, x, z, on)` · `shake(metres)` · `shakeX shakeY` · `count(kind)` · `seed(n)` | Caps: 96 puffs, 250 sparks, 300 skid pieces (24, 100, 60 on `low`), fixed at load |

Events I emit: none.

Events I listen to: `vehicle:crash` and `vehicle:scrape` (sparks, shake), `prop:broken` (shake).

Stand-ins I left: none. Not yet matching the bible: `fx.emit`, `fx.ribbon`, `fx.flash`, `fx.debris`, and the `atlas` module.
