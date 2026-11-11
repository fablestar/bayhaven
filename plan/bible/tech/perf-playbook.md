# Bible · tech · Performance playbook

How the game stays inside its budgets: ledgers that add every system's cost up to the limit, the rules that keep the garbage collector quiet, how three.js is used so draw calls stay flat as the city grows, the start-up timeline, and what to do when a number goes over. The budgets themselves are in `06-tech-architecture.md`; this file is how they are met.

Tier: A.

## 1. Ledgers

Every session that adds something to the frame adds its line to the ledger in its changelog note. The totals below are the plan; the check compares real numbers to the budget, not to these lines.

### Draw calls

| System | `low` (phone) | `high` (laptop) | How it stays flat |
|---|---|---|---|
| Sky, sea, skyline | 3 | 3 | One mesh each |
| LOD0 chunks | 30 | 70 | 6 meshes a chunk, 9 or 25 chunks loaded, about half in view; lit windows and neon pools hidden by day |
| LOD1 shells | 6 | 12 | One mesh per 4 × 4 group of chunks |
| Street props | 6 | 8 | One `InstancedMesh` per kind: palms, lamps, lamp glow points, umbrellas, benches, bins, hydrants, barriers |
| Parked cars | 6 | 10 | One instanced mesh per model (body and wheels merged for parked cars) |
| Traffic | 12 | 20 | Two per model on screen (bodies, wheels) |
| People | 7 | 7 | Six body parts and one for props in hand |
| Player and their vehicle | 6 | 6 | Not instanced: panels, wheels, lights |
| Police extras | 4 | 6 | Light bars, the helicopter, the spotlight cone |
| Effects | 6 | 8 | One instanced mesh per effect family: smoke, sparks, rain, splashes, debris, ribbons |
| Blob shadows | 1 | 1 | One instanced quad |
| Sun shadow pass | 0 | 30 | Only casters within 120 m, `high` only |
| Post-processing | 0 | 4 | Bloom down, bloom up, composite, grade |
| **Total** | **87** | **185** | Budget 150 and 300 |

### Triangles

| System | `low` | `high` |
|---|---|---|
| LOD0 chunks | 76,000 (9 × 8,400) | 350,000 (25 × 14,000) |
| LOD1 shells | 43,000 (72 × 600) | 86,000 (144 × 600) |
| Skyline | 20,000 | 20,000 |
| Traffic and parked cars | 14,000 (28 × 500) | 40,000 (80 × 500) |
| People | 2,900 (20 × 144) | 8,700 (60 × 144) |
| Props | 9,000 | 30,000 |
| Effects, shadows, the rest | 8,000 | 40,000 |
| **Total** | **173,000** | **575,000** |

A box person is 6 boxes × 12 triangles × 2 (the head carries a face quad and a hat) = 144.

### Simulation time per frame, phone

| System | ms | Notes |
|---|---|---|
| Input, clock, loop | 0.2 | |
| Player vehicle or character | 0.3 | |
| Traffic | 0.7 | 14 cars, most at the Simple level |
| People | 0.6 | 20, decisions at 5 Hz |
| Police | 0.5 | 6 units |
| Collision queries | 0.8 | Grid, typed arrays |
| Heat, missions, economy, calendar | 0.3 | Slow ticks |
| Effects | 0.6 | Pools, no allocation |
| Audio control | 0.3 | Parameter updates only |
| Camera | 0.1 | |
| HUD canvas | 1.0 | Dirty parts; minimap at 10 Hz |
| **Total** | **5.4** | Budget 6. Chunk building has its own 4 ms and runs outside the steps. |

### Memory, phone

| What | MB |
|---|---|
| three.js and game code, parsed | 30 |
| LOD0 geometry (9 chunks × 8,400 triangles × 3 vertices × 18 bytes) | 4 |
| LOD1 and skyline geometry | 4 |
| Canvas textures (6 × 1024² × 4 bytes) | 25 |
| Instanced buffers, pools, grids | 10 |
| Minimap tiles (400 × 64² × 4) | 7 |
| Content data (missions, radio, text) | 5 |
| Audio (noise buffers, impulse tables) | 2 |
| Slack for the browser | 60 |
| **Total** | **about 150** | Budget 250 |

## 2. Rules that keep frames even

1. **Allocate nothing per step.** No object or array literals, no closures, no `map` or `filter`, no string building inside `update`. Use module-level scratch vectors and typed arrays. The check `G4` catches the hitches this causes.
2. **Pools for everything that comes and goes:** particles, debris, ribbons, people, traffic cars, audio voices, chunk buffers. A pool hands out an index; "dead" is a swap with the last live item.
3. **Typed arrays for anything counted in hundreds.** Shapes in the collision grid, lanes, walking edges, instance matrices.
4. **Events are for things that happen, not for things that are.** At most a few dozen events a second. Per-frame values are read from `state`.
5. **Slow ticks.** If a decision can be 0.2 s late, make it 5 Hz.
6. **No `scene.traverse` in a frame.** Keep your own lists.
7. **Strings for the HUD are rebuilt only when the number changes.** Compare the number, not the string.

## 3. Using three.js so it stays cheap

- **Static meshes:** `matrixAutoUpdate = false`, `frustumCulled = true`, and call `geometry.computeBoundingSphere()` once after building. Chunk meshes sit at the origin with world-space vertices.
- **Instanced meshes:** `frustumCulled = false` (the bounds would be the whole map), and cull by hand: an instance list per chunk, concatenated for the chunks in view. Set `mesh.count` every frame. Mark `instanceMatrix.needsUpdate` only when something moved.
- **Materials:** twelve in the whole game, made once in `gfx/materials.js`: lambert vertex-colour, lambert vertex-colour double-sided (palms), road paint (polygon offset), unlit neon, unlit atlas, additive lit windows, additive glow points, additive light pools, sky shader, sea shader, instanced lambert (colour per instance), instanced unlit. A new material needs a line in the changelog saying why.
- **Vertex format:** position `Float32` × 3, normal `Int8` × 3 normalised, colour `Uint8` × 3 normalised. 18 bytes with padding. No index buffers for chunk meshes (flat shading needs split vertices anyway).
- **Shaders:** `mediump` on phones where it holds; no loops with dynamic bounds; no more than one texture read in a fragment shader on `low`. Palm sway and rain are done in the vertex shader.
- **Lights:** one hemisphere, one sun, one moon. Lamps and neon are unlit geometry and additive sprites, never real lights.
- **Shadows on `high`:** one 2048 map, orthographic, 120 m square, snapped to texel steps so it doesn't shimmer, updated every second frame.
- **Dispose:** when a chunk drops, `geometry.dispose()` for each of its meshes; its arrays go back to the pool before that. Check `renderer.info.memory.geometries` returns to its starting count after a round trip.
- **`renderer.info`:** read `render.calls` and `render.triangles` after the frame; with post-processing on, set `renderer.info.autoReset = false` and reset once a frame so the passes are counted.

## 4. Resolution

- Start at `pixelRatio` from the quality table. Every 120 frames, if more than 70 were slower than 1/35 s, drop by 0.25 down to the minimum (day 1's rule). If fewer than 5 were slow for three windows in a row, step back up by 0.25.
- The HUD canvas always stays at the device's real pixel ratio (capped at 2), so text is sharp when the game canvas is not.
- Frozen while a clip is recording.

## 5. Start-up timeline

Budget from tapping the link to the first frame: 3 s on a laptop, 6 s on a phone on 4G.

| Step | Laptop ms | Phone ms | Rule |
|---|---|---|---|
| HTML with inline critical CSS | 50 | 200 | No external CSS, no fonts |
| JavaScript download (450 kB gzipped at most) | 300 | 2,500 | One file; no lazy chunks before first frame |
| Parse and run | 150 | 600 | No work at import time beyond declarations |
| Renderer, sky, sea | 60 | 200 | |
| The spawn chunk at LOD0 | 60 | 250 | Built in one go, the only un-sliced build |
| **First frame** | **about 620** | **about 3,750** | |
| The other eight LOD0 chunks | next 30 frames | next 60 frames | Sliced |
| LOD1, skyline | next 60 frames | next 120 frames | Fog hides the gap |
| Sign and mural atlases | on demand | on demand | |
| Audio | on first input | on first input | |
| Content tiers above A | after 5 s idle | after 5 s idle | A second file, loaded with `import()` |

No loading screen, no spinner, no progress bar. The title menu fades in over the first frame.

## 6. When a number goes over

| Symptom | First thing to check | Usual fix |
|---|---|---|
| Draw calls over | `renderer.info.render.calls` by toggling systems off in the debug overlay | Something not instanced or not merged; a material made per object |
| Triangles over downtown | LOD0 radius and window geometry | Windows as texture on that recipe; lower the tower's floor count in LOD0 only |
| `simMs` over | The debug overlay's per-module timings | A module doing per-frame work that should be a slow tick; a full-level simulation that should be Simple |
| Hitches while driving | `chunkMs` and the 95th percentile frame | A generator step doing too much in one `next()`; an atlas upload more than once a frame |
| Heap grows in the soak | Chunk round trips | Arrays not returned to the pool; event handlers added on load and not removed on unload |
| Phone gets hot and slows after minutes | Pixel ratio history | Lower the starting pixel ratio on `low` to 1.25; cap frame rate at 30 on `low` |

## 7. The debug overlay (`?debug`)

One small canvas, top centre, off in release clips: frame time graph (last 120 frames), `calls`, `tris`, `simMs`, `chunkMs`, loaded chunks by ring, counts of cars, people and police by simulation level, heap in MB, and a per-module time bar. Keys 1 to 9 toggle systems off to see what each costs. This is the tool a performance session uses first.

## 8. Numbers every build writes down

`npm run check` writes `dist/report.json` beside the build:

```json
{ "day": 5, "commit": "abc1234", "lines": 21840, "files": 96, "bundleKb": 311,
  "spots": [{ "name": "beach", "low": { "calls": 81, "tris": 151000, "simMs": 3.9 }, "high": { "calls": 170, "tris": 498000, "simMs": 2.7 } }],
  "checks": { "passed": 61, "failed": 2, "failedIds": ["D5.4", "G6"] } }
```

It is the honest record of each day's build, and anything that shows the build's numbers to people reads this file rather than a hand-typed figure.
