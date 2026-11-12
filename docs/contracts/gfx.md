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

## Day 4 (session D4-S1)

| Name | Signature | Meaning |
|---|---|---|
| `windowgrid.js` | `windowGrid() → texture` · `windowMaterial() → material with setOn(on)` · `wallUV(width, y0, y1, cell, floor) → [u0, u1, v0, v1]` · `PLAIN_UV` | The window-grid texture of `plan/bible/art/kits.md` section 6 (one 1024² canvas) and the Lambert material that reads it: panes darken the wall by day and glow at night, `lit = smoothstep(0, 0.08, on - 0.10 - 0.80 × y / 260)`. A face whose u is below 0 is plain wall |
| `chunkMaterials().W` | the window material | `update(night)` also sets it, and keeps `on` |
| `atlas.js` | `signUV(i)` for cells 0 to 23 · `TOWER_SIGNS` | The sign sheet is 1024 × 1536 now (12 rows). New cells: 16 Bayhaven Tomorrow, 17 Now Leasing The Sky (stacked, they are the billboard), 18 Meridian Spire, 19 City Hall, 20 First Bayhaven Savings, 21 Iguana Insurance, 22 Maison Sable, 23 Bay Cab |
| `murals.js` (D4-S3) | `mural(seed, palette, { drips }) → uv` · `board(text, colour, 'paint' or 'stencil') → uv` · `muralWall(U, a, b, y0, y1, seed, palette, { cells, drips }) → cells` · `muralAtlas(size)` · `muralMaterial()` · `muralMesh(builder)` · `paintCell(ctx, x, y, size, seed, palette, drips) → layout` · `PALMA` · `paintworksPalette(seed)` · `SHAPE_NAMES` · `LAYOUTS` · `stats` | The mural painter of `plan/bible/art/kits.md` section 7. One canvas (1024² on `low`, 2048² otherwise): 48 square mural cells in six rows of eight, and under them 16 sign boards, 4 to 1. A cell is painted the first time it is asked for; when the sheet is full the one asked for longest ago is painted over. A uv is `[u0, v0, u1, v0, u1, v1, u0, v1]`, as `MeshBuilder.quad` takes it. `muralWall` lays one cell per 12 m from `a` to `b` (left to right as you face the wall). `muralMesh` gives an unlit mesh that dims to half at night. Not as the bible has it: 48 cells, not 16 (a street of murals needs more than 16 pictures in view) |
| `modules.murals` | `{ stats }` | Test API: `test.murals() → { size, cells, boards, painted, reused, boardsPainted, layouts, shapes }` · `test.murals.paint(seed, palette) → { hash, colours, layout }` (on a scratch canvas) · `test.murals.ask(seed, palette) → uv` (on the sheet) |
