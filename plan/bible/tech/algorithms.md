# Bible · tech · Algorithms

The engine-level algorithms, written as pseudo-code a session can turn into JavaScript directly: the loop, streaming, collision, the road graph, simulation levels of detail, routing, crowds, tumbling, the audio scheduler, atlases, seeds and the clip recorder. Tuning numbers for each game system are in `bible/systems/`; this file is about how the machinery under them works and how its cost is kept flat.

Tier: A unless marked.

## 1. The loop

Fixed 60 Hz simulation, variable rendering, never more than three steps a frame.

```js
const STEP = 1 / 60;
let acc = 0, last = now();
function frame(t) {
  requestAnimationFrame(frame);
  let dt = min((t - last) / 1000, 0.1); last = t;
  dt *= loop.timeScale;                       // 1, 0.3 (phone open), 0 (paused)
  acc += dt;
  let n = 0;
  while (acc >= STEP && n < 3) { input.sample(); for (const m of modulesByOrder) m.update(STEP, ctx); acc -= STEP; n++; }
  if (n === 3) acc = 0;                       // too slow: drop time, never spiral
  const alpha = acc / STEP;                   // 0..1 between the last two steps
  for (const m of renderers) m.render?.(alpha, ctx);   // interpolate positions for drawing
  renderer.render(scene, camera);
  hud.draw();                                 // 2D canvas, dirty parts only
}
```

- Every moving thing keeps `prev` and `cur` transforms. Drawing uses `lerp(prev, cur, alpha)`. That is the only place render rate touches simulation.
- `simMs` in `test.stats()` is the time inside the `while` loop, averaged over 120 frames, with the 95th percentile kept as well.
- Modules that don't need 60 Hz register a slower tick with `loop.every(seconds, fn)`: heat logic 10 Hz, people's decisions 5 Hz, spawn rings 2 Hz, Squawk 1 Hz, autosave 1/60 Hz.

## 2. Streaming

```js
// every 0.25 s, or at once after a teleport
function wantRings(px, pz, vx, vz) {
  const c = chunkOf(px + vx * 1.5, pz + vz * 1.5);     // look 1.5 s ahead
  want0 = square(c, quality.lod0Radius); want1 = square(c, quality.lod1Radius) - want0;
}
// keep = want grown by one ring (hysteresis). Anything loaded and not in keep is dropped.
// queue = (want - loaded), sorted by distance along the velocity direction first, then by distance.

function pumpBuild(budgetMs = 4) {           // called once a frame, outside the sim steps
  const t0 = now();
  while (job = current || queue.shift()) {
    current = job;
    while (!job.done && now() - t0 < budgetMs) job.next();   // a generator: one lot, one road piece, one prop batch per call
    if (!job.done) return;                    // carry on next frame
    upload(job); current = null;              // one BufferGeometry per material, colliders into the hash, lanes into nav
  }
}
```

- A LOD0 chunk is at most **six meshes**: ground and roads, road paint, buildings and furniture, neon (unlit), signs (atlas), lit windows (additive, night only). Props, parked cars and people are instanced globally and only get per-chunk instance lists.
- **LOD1 shells are merged per group of 4 × 4 chunks** (640 m). One group is one draw call. A group rebuilds when any chunk in it changes ring, in the same sliced way.
- LOD2, the skyline, is built once at start from `map.js` alone: one mesh, 20,000 triangles or fewer.
- From day 8 the generator body runs in a Worker. The protocol is one message each way:

```js
// main → worker
{ kind: 'build', cx, cz, lod, seed, lots, roads, quality }
// worker → main (buffers are transferred, not copied)
{ kind: 'built', cx, cz, lod, meshes: [{ material, pos: Float32Array, nor: Int8Array, col: Uint8Array, uv?: Float32Array }], colliders: Float32Array, lanes: Float32Array, props: Float32Array }
```

  Canvas work (signs, murals, window textures) stays on the main thread: the worker returns atlas requests (`{ kind: 'sign', text, colour }`) and the main thread answers with UV rectangles before upload.
- A chunk's seed is `hash2(worldSeed, cx, cz)`. A lot's seed is `hash2(chunkSeed, lotIndex, 0)`. Nothing in generation reads the clock, the player or `Math.random`.

## 3. Collision

A uniform grid ("spatial hash") of 20 m cells, keyed `cellX * 73856093 ^ cellZ * 19349663`, one grid per deck level.

- **Static shapes** are inserted when a chunk loads and removed by owner when it unloads. Each cell holds a small array of shape indices; shapes live in flat typed arrays (`x0, x1, z0, z1` or `cx, cz, hw, hd, cos, sin`, plus `h`).
- **Dynamic bodies** (vehicles, people, loose props) are re-inserted every step into a second grid that is cleared by resetting counters, not by allocating.
- **Circle against box:** clamp the centre to the box (in the box's own rotated frame), push out along the difference; if the centre is inside, push out through the nearest face. That is day 1's car code, generalised.
- **Box against box (vehicles):** separating axis test on the four axes of two rectangles. On overlap, the smallest overlap gives the normal `n` and depth `d`. Split the push by inverse mass. Impulse along `n`:

```js
const rel = (a.vx - b.vx) * n.x + (a.vz - b.vz) * n.z;       // closing speed
if (rel < 0) {
  const j = -(1 + 0.25) * rel / (1 / a.mass + 1 / b.mass);   // restitution 0.25
  a.vx += j * n.x / a.mass; a.vz += j * n.z / a.mass;
  b.vx -= j * n.x / b.mass; b.vz -= j * n.z / b.mass;
  const r = cross(contact - a.pos, n); a.spin += j * r / a.inertia * 0.5;   // a little yaw from off-centre hits
}
```

- **Rays** walk the grid cell by cell (a 2D DDA) and test only the shapes in each cell. Line of sight for police and cameras is a ray at 1.2 m height against shapes whose `h` is taller than that.
- **Cost rule:** a body queries only the cells its bounding circle touches (at most four for a car). No pair is tested twice in a step: test only when `a.id < b.id`.

## 4. From roads to lanes and sidewalks

Roads are straight pieces (splines are cut into pieces of 20 m or less). When a chunk loads:

1. **Junctions:** two pieces meet where their end points are within 1 m, or where two grid lines cross. Each junction gets an id from its rounded position, so neighbouring chunks agree without talking.
2. **Lanes:** for a piece with `L` lanes each way and lane width `w = 3.2`, lane `i` (0 is innermost) runs parallel to the centre line, offset `(i + 0.5) * w` to the right of travel. Each lane is cut at junctions; it stops `width / 2 + 2` metres short of the junction centre.
3. **Connections:** at a junction, a lane connects to every outgoing lane whose turn is legal: straight on and right turns from the right lane, left turns from the left lane, no U-turns except at dead ends. A connection is a short quadratic curve; cars follow it by parameter.
4. **Signals:** an avenue-on-avenue or boulevard junction gets a signal with two phases of 13 s green, 2 s amber, both red for 0.5 s (a 30 s cycle with a little slack). The phase is `floor((clockSeconds + hash(junctionId) % 30) / 15) % 2`, so lights are in step for everyone and need no stored state. Street junctions are first in, first out: a car may enter when no car with an earlier arrival time is inside.
5. **Sidewalks:** each road piece gives two walking edges, offset `width / 2 + 1.5` from the centre line. At junctions they join across each arm by a crossing edge. People take a crossing only when the lanes it crosses are red or empty for 4 s.
6. Lanes and walking edges are stored in flat arrays per chunk and dropped with it. Cars on a dropped lane are removed (they are outside the spawn ring anyway).

## 5. Simulation levels of detail

Not everything needs the full step. Each moving thing has a level picked from its distance to the camera every 0.5 s.

| Level | Cars | People | Police |
|---|---|---|---|
| **Full** | within 90 m: full body, collisions, reactions, 60 Hz | within 40 m: steering, avoidance, states, 60 Hz position, 5 Hz decisions | always full while in pursuit |
| **Simple** | 90–200 m: on rails along the lane by parameter, car-following only, 20 Hz, no collisions | 40–100 m: slide along the edge, 10 Hz, no avoidance | patrol units as simple cars |
| **None** | past the despawn ring: removed | past 120 m: removed | off-screen pursuit units move on the road graph at 10 Hz (so they can cut you off) |

A car promoted from Simple to Full is given a body at its rail position with velocity along the lane; if that spot overlaps another body it waits one more tick.

## 6. Routing

One A* for the waypoint line, police cut-offs and AI drivers that need to be somewhere.

- Nodes are junctions; edges are road pieces with cost `length / speedLimit`; the heuristic is straight-line distance over the top speed limit (110 km/h), so it never overestimates.
- A binary heap of indices over typed arrays; `gScore` and `cameFrom` are `Float32Array` and `Int32Array` sized to the loaded junctions, reset by a generation counter rather than refilled.
- The whole city's junction graph is small (about 6,000 junctions) and is built once from `map.js`, not from loaded chunks, so a route can cross districts that are not streamed in.
- One route per frame at most. Requests queue; the waypoint line may be a frame late and nobody will notice.

## 7. Crowds on six draw calls

All people share six `InstancedMesh` objects (head, torso, two arms, two legs), each with capacity `pedCap`. Per person per frame:

```js
// root: position, heading, lean. Limbs: a hinge at the shoulder or hip. Same pivots as art/characters.md: the figure stands 1.80 m.
const sw = sin(p.phase) * p.swing;                        // phase advances with distance walked: phase += speed * dt * 3.4
M.torso = T(p.x, p.y + 1.12 + abs(sin(p.phase * 2)) * 0.03, p.z) * Ry(p.h) * Rx(p.lean);
M.head  = M.torso * T(0, 0.50, 0);
M.armL  = M.torso * T(-0.26, 0.28, 0) * Rx(+sw) * T(0, -0.30, 0);
M.armR  = M.torso * T(+0.26, 0.28, 0) * Rx(p.filming ? -1.9 : -sw) * T(0, -0.30, 0);
M.legL  = T(p.x, p.y + 0.80, p.z) * Ry(p.h) * T(-0.10, 0, 0) * Rx(-sw * 1.2) * T(0, -0.40, 0);
M.legR  = ... Rx(+sw * 1.2) ...
```

- Matrices are written straight into each mesh's `instanceMatrix.array`; colours go in `instanceColor` once at spawn. Set `count` to the number alive; never loop over dead slots.
- Faces are a quad on the head box whose UVs pick a cell of the face atlas; the expression is a per-instance offset attribute.
- People past 60 m skip the limb swing (limbs straight) and update their matrices every third frame.
- The same trick draws traffic: per vehicle model, one instanced mesh for bodies and one for wheels (four instances per car).

## 8. Tumbling

When a person is hit they become a ten-point rope for up to 4 s.

- Ten points: head, neck, chest, hips, two hands, two knees, two feet. Eleven sticks: head–neck, neck–chest, chest–hips, chest to each hand, hips to each knee, each knee to its foot, plus two that keep the shape (head–chest and knee–knee).
- Each step: `p += (p - prev) * 0.98 + gravity * dt²`; then three passes that pull each stick back to its rest length; then clamp `y` to the ground height with friction 0.6.
- The initial push is the vehicle's velocity times 0.6 plus 3 m/s upwards.
- When the average point speed is under 0.4 m/s for 0.5 s, or at 4 s, the person blends back to standing over 0.6 s and enters the get-up state. Birds circle the head meanwhile, only for a dazed bystander who will get up (an effect, three small quads on a ring). Never for the player, a deputy, or anyone who stays down.
- At most 6 tumbling at once on `low`, 12 on `high`; extra hits just knock people into the fall-over pose.

## 9. The audio scheduler

Web Audio has its own precise clock. Music is scheduled ahead on it; nothing musical is timed by the frame loop.

```js
const AHEAD = 0.12;                                   // seconds scheduled in advance
function pump() {                                     // called every 25 ms by setInterval, not by the frame loop
  while (nextStepTime < ctx.currentTime + AHEAD) {
    for (const track of song.tracks) { const ev = track.at(step); if (ev) synth.play(track.instrument, ev, nextStepTime); }
    nextStepTime += 60 / song.bpm / 4 * swingFor(step); step = (step + 1) % song.steps;
  }
}
```

- A synth voice is a few nodes created at `play` time and stopped at note end. A pool caps voices at `audioVoices`; the quietest oldest voice is stolen first.
- Every one-shot sound goes through `audio.sfx`, which drops the sound if the same name played within 40 ms (so twenty sparks are one spark sound) and pans and attenuates by distance: `gain = 1 / (1 + (d / 12)²)`, silent past 150 m.
- `music.beat` is `(ctx.currentTime - lastBeatTime) / beatLength`, which lets lights pulse in time without touching audio code.
- Sound starts only after the first key, click or touch. Until then calls are remembered as "wanted" loops and one-shots are dropped.

## 10. Canvas atlases

- **Signs:** a shelf packer on a 1024² canvas (2048² on `high`). Row height 128 px. A request is `(text, colour)`; the key is the two joined. If the atlas is full, the least recently used shelf is cleared and its users rebuilt next time their chunk loads.
- **Window grids:** eight variants (2 to 9 columns) drawn once: a dark wall with lit and unlit panes in the day 1 mix (75% warm, 15% cyan, 10% pink of the lit ones). LOD1 shells tile them by UV scale.
- **Faces:** a 4 × 2 grid of 32 px cells: six expressions and two spares.
- **Murals:** a 1024² canvas cut into 256 px cells, sixteen murals alive at once, painted on demand from `(seed, palette)`.
- **Minimap tiles:** 64 px per chunk, drawn when first needed from `roadsInChunk` and the land mask, kept in a map of at most 400 tiles.
- All atlases share one upload rule: draw, then set `texture.needsUpdate = true` at most once a frame.

## 11. Seeds, snapping and placement

```js
function snap(seed, need) {
  // 1. candidates within 25 m: lots (for 'lot'), walking edges ('sidewalk'), lane edges ('curb'), lanes ('road'), water cells ('water')
  // 2. drop candidates that overlap a collider, are on the wrong surface, or are closer than 3 m to a road centre line (unless need is 'road')
  // 3. return the nearest; if none, return null and record it in map.snapFailures
}
```

- Snapping needs the chunk's lots and roads but not its meshes, so it can run for any position at any time from `map.js`.
- The placement check loads every find, ramp, race checkpoint, shop and mission marker in the content tier being built and fails if `map.snapFailures` is not empty.
- A snapped position is cached by content id, so a find never moves between sessions of the same build.

## 12. The clip recorder (tier B)

```js
const rec = document.createElement('canvas');                 // 1280 × 720, or 720 × 1280 in portrait
const g = rec.getContext('2d');
function composite() { g.drawImage(gameCanvas, 0, 0, rec.width, rec.height); g.drawImage(hudCanvas, 0, 0, rec.width, rec.height); }
const stream = rec.captureStream(30);
const type = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm'].find(MediaRecorder.isTypeSupported);
const recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 6_000_000 });
```

- `composite()` runs after `hud.draw()` each frame while recording, and only then.
- The WebGL context must be created with `preserveDrawingBuffer: false` (the default); `drawImage` of the game canvas works as long as it is called in the same frame, right after `renderer.render`.
- A clip is 20 s at most. On stop, the chunks become one `Blob`, offered through a download link (`bayhaven-day-N-<time>.mp4` or `.webm`). Nothing is uploaded anywhere.
- Audio: a `MediaStreamAudioDestinationNode` on the master bus is added to the stream's tracks, so clips have the game's sound.
- If `MediaRecorder` or `captureStream` is missing, `capture.supported` is false, the record button is hidden, and photo mode still works (`rec.toBlob`).
- While recording, dynamic resolution is frozen so the picture doesn't change size mid-clip.

## 13. The week and the calendar

`clock.dayCount` counts game days since the save began; `weekday = dayCount % 7` with a new game starting on a Friday at 17:30. A calendar entry is `{ weekday, hour, lengthHours, id }`. Twice a game hour the calendar module starts entries whose window has opened and whose place is within 600 m of the player (or always, for city-wide ones like bin day), and stops entries whose window has closed. An entry that the player never came near costs nothing.

## 14. Saving without hitches

Saving collects each section's `get()`, runs `JSON.stringify`, and writes one `localStorage` key. On a phone that is 2 to 5 ms for a 20 kB save. It runs only when heat is zero and the player is not in the air, on the frame after a simulation step, never inside one. Export compresses with the browser's `CompressionStream('deflate-raw')` when present and encodes as base64url; without it the code is longer and still valid.
