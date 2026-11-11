# Changelog

Built from the notes in `changelog/` by `tools/changelog.mjs`. Newest day first.

## Day 3: On foot (Teo gets out of the car)

### D3-S1 · On foot (Teo gets out of the car)

**Shipped**

You can get out of the car. Press F and Teo steps out, walks, sprints, jumps, wades into the sea, and gets into any stopped car on the street.

1. **The rig** (`src/actors/rig.js`, `rigart.js`). A six-box toy person, 1.8 m tall, no knees or elbows, with the bible's boxes and pivots. Faces, shirt, sleeve and leg are drawn on one 256 × 128 canvas: all eight face cells of the bible's table (neutral, happy, shocked, angry, squint, dizzy, blink, talk). Poses are maths, straight from the bible's table: walk, jog and sprint on one formula (phase, swing, bob, lean, twist, roll into turns), idle (breath, sway, looks round, blinks), jump (crouch, arms up, arms out), fall, sit, driving, getting in or out, the bail-out roll, getting up, wading. A change of pose blends over 0.15 s.
2. **Teo** by his sheet: dark roots with the bleached block on top, the open cyan floral shirt over a white tank, the ink harness with its cross on the back, the chest phone on a stalk, the battery box with a pink light (a glow at night), violet board shorts with a white stripe, white socks and ink slides, two shirt tails that lift with speed and trail a turn. 16 boxes. His walk is the bible's "bouncy": swing × 1.15, bob × 1.5.
3. **On foot** (`player.js`). Walk 1.6, jog 3.4, sprint 6.8 m/s. 12 s of sprint, then a jog until Shift is let go; a full refill takes 6 s. A jump of 1.1 m (measured: 1.10) after a 0.08 s crouch. A circle of radius 0.35 m against the collision hash and against cars: he slides along walls, steps up anything 0.35 m or lower (curbs, the promenade), walks down the beach and wades at 1.2 m/s to 0.9 m deep, where he stops. Movement is relative to the camera.
4. **In and out of vehicles** (`doors.js`). F within 2.5 m of a door: he walks to the door and slides onto the seat in 0.8 s. Out the same way, by the driver's door, or the other one when a wall is in the way. Any stopped vehicle works: parked cars, cars you knocked loose, traffic waiting at a light. The car he leaves stays parked where he left it. Above 30 km/h he bails: full rolls along the road until the speed is gone (10 m from 61 km/h), then 1.2 s to get up, while the empty car brakes itself to a stop.
5. **Camera** (`camera.js`). On foot: 4.5 m back, 1.7 m up. Mouse drag, a finger on the picture or the right stick orbits. After 2 s of running with the view left alone it swings round behind him. A wall between him and the camera pulls it in (a ray through the collision hash). Getting out and in glides between the car camera and the foot camera over 0.7 s.
6. **State and events.** `state.player.mode` is `'car'` or `'foot'` (it was `'vehicle'`). `vehicle:exited`, `vehicle:entered`, `player:spawned`, plus `player:jumped`, `player:landed` and `player:step` (one a stride, with the surface under him: the hook for footsteps by surface).
7. **Input** (`src/core/input.js`). A foot mode: the same keys and script holds walk instead of drive, Space jumps, Shift sprints, the car gets nothing. Camera turning from mouse, touch and the right stick. Scripts can press a button and turn the camera, which is how the clip is written.
8. **Touch** (`foottouch.js`, a stand-in for the HUD session). On foot: a left stick, Jump, Sprint, and Get in when a door is in reach. In a car the driving layout is back with a Get out button. 72 px buttons, inside the safe areas, no overlaps in portrait or landscape.
9. **Test API:** `test.exit()`, `test.enter()`, `test.spawnVehicle(model, at)` (on foot it stands a parked car beside him), `test.foot()`, `test.rig(pose, seconds)`.
10. **Clip** `?clip=day-3`: 18:00. The coupe pulls up by the promenade, he gets out on the sea side at 3.8 s, the view swings round to the water and he walks onto the sand by 9.7 s. 12 seconds.

**Day 2 checks brought up to date (asked for at the top of this session):**

- `D2-S1.3` drives into the barrier at the real map edge: the place comes from the map's east bound (x 1593), the sections found there stand at x 1590, one is knocked over and the car is held at the edge.
- `D2-S2.4` asks the old promises of the real network: 782 lanes, equal to the lane count of all 353 road pieces counted from the map; keep right; every lane leads on; each of the one-lane T-junctions offers exactly two ways on; nobody is turned back unless the road truly ends (0 dead ends today, 0 turn-backs); no lane lies on any of the 50 barrier stubs; the route is between 1.0 and 1.3 times the grid distance.
- `D2.4`'s "9 chunks built during the drive" was a time budget in disguise (the streamer works once a frame inside a budget of real milliseconds). It is now two things. Counted while the car moves: 9 scaled by the share of 60 frames a second this machine drew and by k. Counted per distance: once the car has stopped and the streamer has caught up, at least 9 chunks built for the metres driven and nothing owed, with no clock on it. Also new: more building frames than chunks (proof of slices). The millisecond limits are unchanged.
- `D2-S1.3` and `D2-S1.6` now open with `day=2`. This note makes the build "day 3", and Drift Night's cones are day 2's drop, so without the pin both would fail from today for a reason that is not the game's.

**Not shipped**

- **A green run of the whole suite. `npm run check -- --id D3-S1` and `--day 2` did not pass in this session.** What was seen:
  - Each of this session's nine checks (D3.1, D3.2, D3-S1.1 to D3-S1.7) passed when run in groups of two to four with `--only`, on the build before this note was added. They were not all seen passing in one run.
  - The three reworked day 2 checks: `D2-S1.3` and `D2-S2.4` passed; `D2.4` passed all its chunk counts on both qualities, but in the same runs failed millisecond limits that this session did not change (longest simulation frame 39.8 ms against 34.3; chunk building p95 9.6 ms against 4 on one run, 3.3 on another).
  - Three full runs on the final build: two died with "Target crashed" (once in the first calibration, once in the gate drive on high). The third passed gates G1 to G6 and the first ten checks (D1.1 to D1.3, D2.1, D2.2, D2-S1.1 to D2-S1.5), then every page load timed out after 30 s from D2-S1.6 on, for every check, including ones this session never touched.
  - The same thing happened in smaller runs earlier in the session: once a page load timed out, every later one did.
  - **Not known: whether the machine or this session's code causes it.** For the machine: it drew 2 to 4 frames a second (day 2 measured 9), the crashes hit at different places, and a run of the unchanged day 2 code at the start of the session got past these same checks. Against: that first run was on day 2's code, so the new code is not cleared. The first thing to do next session is run `npm run check -- --day 2` at commit `5ecf0bd` and at this one, on a quiet machine, and compare.

- **The ten people on the beach and footstep sounds** ("if you finish early"). The `player:step` event carries the surface; nothing plays it (audio is not my folder).
- **Climbing and swimming.** Not in this session's list. He stops at waist depth.
- **Taking a moving car.** Only vehicles under 1.5 m/s can be entered; pulling a driver out belongs to the garage session.
- **Teo is not drawn inside the car.** The rig is hidden in a vehicle. The sit and driving poses exist and are checked, but nothing shows them yet.
- **Mags as a body.** Only `teo` has a look. `state.player.id` is now `teo`.
- **The page title and the hint in `index.html` still say day 2** (not my file). The stand-in adds the new keys to the hint line at load.
- No art requests were made.

### D3-S2 · Pedestrians (people on every sidewalk, and a flash mob)

**Shipped**

Bayhaven has people. They walk the sidewalks and the promenade, lie on the sand, wait at the lights, film you when you crash, jump out of your way, and get knocked over and get up cross.

1. **Everyone for eight draw calls** (`pedsdraw.js`). Six instanced meshes, one per body part, with the lead rig's boxes and pivots (1.8 m, head a fifth of that); one mesh of unit boxes for hair, hats, bags, phones and the birds round a dazed head; one of blob shadows. Seven of them share one material and one 256 x 128 people atlas: the rig's faces, eight shirt patterns, six sleeve and leg cuts. Each instance carries a cloth colour, a skin colour and an atlas cell, and the atlas's alpha says which colour a texel takes. Measured: hiding the people takes exactly 8 calls off the frame.
2. **Walking** (`peds.js`). People follow the sidewalk graph from `nav`, keep right with a side offset, pick a way on at each corner and walk 80 to 300 m before stopping somewhere. At a lit crossing they stop at the curb and wait for the walk light (the green of the road beside them), and set off only if they can be across before it ends, jogging if it will be close. At an unlit crossing they wait for cars inside 12 m. Each kind has a chance to jaywalk when no car is within 40 m. The promenade and the sand are open ground: promenade walkers keep right along it, beach people wander between spots on the sand. Someone close ahead means a step to the right.
3. **States**: walk, cross, hang out (sit, lean, chat in twos, sunbathe, phone), flee (hands in the air, 30 to 60 m, then 6 s to calm down), film, dodge, fall over (a ten-point rope, `pedstumble.js`), dazed, get up. Near people run every step; people past 40 m run ten times a second; poses are written every frame within 30 m and every fourth or eighth frame beyond, with a two-pose walk past 60 m.
4. **Filming** (`pedsreact.js`). A crash at 5 m/s or more (4 s), a drift (while it runs, plus 2 s), a jump landing (3 s; nothing emits `jump:landed` yet) or heat 1 and above starts a timer. Everyone within 40 m with a clear line to you decides once, by kind, from the bible's table: film, look, or shout. With three or more in range, at least three film. A phone comes up after 0.3 to 1.5 s, they turn to track you at up to 2.5 rad/s, and put it away 2 s after the interest ends. `ped:filming { count }` fires when the count changes, at most twice a second. Each phone pays 5 followers a second, times 60 / pedCap so a phone's smaller crowd pays the same.
5. **Eight kinds** (`pedskinds.js`): tourist, jogger, retiree, skater, office worker, dock worker, clubber, beachgoer. Each has its palette and shirt pattern, hair, a hat or bag, walk and flee speeds, courage, a chance to film and hours. The count comes from the bible's table by district and hour (Tideline 60 by day, 40 in the evening, 6 at night on `high`; a third on `low`), scaled by weather. The mix comes from the zone file's weights, with kinds that are not out at that hour dropped: beachgoers leave at 18:30, clubbers arrive at 20:00.
6. **Hit by a vehicle**: a tumble on the rope (the vehicle's velocity times 0.6 and 3 m/s upwards), 3 s lying dazed with three birds circling, 1.2 s to get up, then walking off with an angry face and a shaken fist, slower for 10 s. `ped:hit` fires with the speed. Measured at 40.1 km/h: thrown 4.9 m, walking again 5.5 s after the hit. A car under 10 km/h pushes nobody over: they step aside. People who can see a car coming jump clear of it, always under 30 km/h and by nerve up to 50; someone with their back to you does not, unless you sound the horn. The horn within 15 m also makes retirees and dock workers shout, tourists and office workers look, clubbers wave. A car up on the sidewalk or the sand sends the people within 6 m running, shouting or filming, by kind. Traffic cars knock people over by the same rules.
7. **The drop: Flamingo Flash Mob** (`src/content/drops/day-3.js`). From 17:30 to 20:15 on the day 3 build, 150 people in flamingo pink stand on the beach at (0, 64), 15 wide and 10 deep at 1.6 m, facing the promenade, doing four moves of two beats each at 104 beats a minute off one clock: arms up, step left, step right, spin. Walk in and the people within 2 m shuffle 0.6 m aside, and the two nearest stop and film for as long as you are among them, then go back to the dance. A moving vehicle within 6 m, or a shot, breaks the grid for the evening and all 150 run. While the mob is within 150 m the street drops to 20 people on `high` and 8 on `low`. The drop line on the HUD names it.

Also: `state.peds`, `modules.peds` with a small crowd interface (`crowd`, `join`, `hold`, `release`, `disband`), `test.peds.*`, a freeze for Mags's Bus Driver Voice (wired to `player:ability`, which nothing emits yet).

**Not shipped**

- **A green run of the whole suite.** See "Checks" at the end: my eight pass, six earlier checks and gate G4 fail, two of those six because of this session.

- **Nobody stays down.** My prompt listed six states; the bible's seventh (down: a hard hit over 50 km/h, health, an ambulance) is not built. A hit at any speed is a tumble and a get-up. `state.peds.down` is always 0.
- **Cars do not stop for people.** Traffic's 20 m cone does not see them (the vehicles lane). People wait for the walk light and for gaps, so it mostly works, but a turning car can drive into someone on a crossing and knock them over.
- **People are not solid to Teo on foot.** He walks through them; they sidestep him. No bump reaction.
- **Barks.** No lines are shown (that is `src/systems/barks.mod.js`, another session). The states and events it needs are there.
- **"If you finish early"**: nobody runs for an awning. Skaters exist as a kind with a rolling pose but have no board.
- Filming people do not step sideways for a clear view. No fame reactions. The queue at Ventanita Rosa and the towel crowds are not crowd objects (towels are two to four beachgoers spawned together).
- No art requests were made.

## Day 2: Drift (day 2 headline)

### D2-S1 · Drift (day 2 headline)

**Shipped**

1. **Handling with weight.** The driving is now a fixed 60-steps-a-second body with forward speed, sideways speed and spin (`src/handling.js`, the step from `plan/bible/systems/driving.md`). Handbrake on Space, pad A and a touch button: rear grip drops to 1.2 /s and the car pivots. Slides hold on the throttle and come back with countersteer. Touch gets the 30% countersteer assist and the slower 5 /s steering.
   - **Top speed: the Heron now reaches 137.0 km/h** (136.975 measured after 60 s of gas on the flat; 136.6 after 40 s; listed 137). Day 1's extra drag is gone and the pull is solved at load so 0 to 100 km/h takes 7.48 s (listed 7.5).
   - Page title is "Bayhaven | Day 2". The controls hint uses commas.
   - Phone fix: the hint wraps inside the screen. At 390x844 it sits from x 12 to 378, at 844x390 from 207 to 637, and document scrollWidth is 390 at 390 wide.
2. **Drift feedback.** Tyre smoke, skid marks that fade (20 s, 8 s on phones), and a drift score that counts while the slip angle is over 0.35 rad above 40 km/h, with the hold multiplier. A wall hit banks half.
3. **Hits.** Sparks and camera shake on wall hits, sparks when scraping a wall. 32 lamp posts, 32 barrier sections and 26 neon cones are separate objects that get knocked over. A lamp that goes down takes its light with it. R stands everything back up.
4. **Speedometer with gear** and a rev bar; four-gear engine sound, tyre squeal, impact thumps, lamp clang, cone clatter, a horn on H.
5. **Cameras.** Look-back (hold B, pad B, a touch button), close chase (C, right stick click, a touch button). In a slide the chase camera swings to show the car's side. **Gamepad** for everything: stick or d-pad steers, triggers for gas and brake, A handbrake, left stick click horn, B look-back, right stick click camera, Y skips time, Back resets, Start mutes.
6. **The drop: Drift Night.** A cone gate, a nine-cone slalom, a donut ring and an arc round the plaza corner on the beachfront street, a neon sign at the spawn, a score board on the promenade (best, last, tonight, cones down) and a score line on the HUD. Built only when the build day is 2 (`?day=3` shows none of it).
7. **The clip.** `?clip=day-2`: sunset, down the beachfront, brake, handbrake round the plaza corner through the cones, away up the side street. 12.0 game seconds, played through the real input and physics, so it is the same every time.

Also: the Heron comes in pink or teal, picked at random each load (the clip is always pink).

**Not shipped**

- **Parked cars that react when hit** (the other "if you finish early" item). They are still solid boxes.
- **No taxi in the clip.** The roadmap's clip line has a taxi swerving; traffic is session D2-S4.
- The hood camera, the air and landing rules and the other surfaces (grass, dirt, wet road) from the driving bible. They were not in this session's list. Sand (0.6 grip) and the sea are in.
- The scores are not saved between loads.
- No art requests were made.

### D2-S2 · Foundation (the frame every later session stands on)

**Shipped**

Nothing the player sees changed. Under the hood:

1. **The module layout.** Every file moved into its folder: `core`, `gfx`, `world`, `vehicles`, `actors`, `systems`, `content`, `audio`, `ui`. The car file was split into `vehicles/models.js` (the shape) and `vehicles/vehicle.js`. Largest file is `src/world/block.js` at 473 lines.
2. **The registry.** `src/core/registry.js` finds every `*.mod.js` with `import.meta.glob` and runs it in order. 16 modules today: clock, world, sky, nav, map, gulls, vehicles, props, fx, player, drops, clips, audio, camera, hud, debug. `src/main.js` is 50 lines of boot code. Adding a feature is adding a file.
3. **Core.** `events.js` (on, once, emit; a handler that throws is caught and counted), `state.js` (the shape in the plan), `rng.js` (day 1's generator plus `hash2`, `pick`, `weighted`), `quality.js` (low, medium, high; every budget number in one table), `input.js` (one actions object for keys, touch, pad and scripts, plus one-step presses), `loop.js` (60 fixed steps a second, at most three a frame, slow ticks with `every` and `after`).
4. **The test API** on `window.__game.test`: `ready`, `stats`, `errors`, `teleport`, `setHour`, `setQuality`, `input`, `wait`, `player`, and `advance`, `count`, `reset`, `drive` (a small autopilot that follows roads), `save.export` and `save.import`, `clip.play`.
5. **The check runner.** `npm run check -- --id <session>` or `--day N`: builds, runs the name check, opens the game on low and on high, runs gates G1 to G7 and the check files, prints one JSON object and writes `dist/report.json`. `--fps` mode (gate G8) is written and refuses to run without a real graphics card. `tools/checks/d1.mjs` holds day 1 as three checks.
6. **Tools.** `tools/lint-names.mjs` reads `plan/BANNED.txt` (52 patterns, 0 hits in 45 files). `tools/changelog.mjs` builds `CHANGELOG.md` from `changelog/*.md` before every build and writes the build day (the newest note's day) into `src/core/build.js`. The old hand-written day 1 and warm-up entries became `changelog/D1-S1.md` and `changelog/D0-S1.md`, word for word.
7. **Stand-ins for the next sessions.** `src/world/nav.js`: the block's four streets as 20 lanes (keep right, 3.5 m off centre) with `laneNear`, `next`, `lanesInChunk` and `route`. `src/world/map.js`: `districtAt`, `isLand`, `heightAt`, `depthAt`, `surfaceAt`, `nearestRoad`, `snap` for the day 1 block.
8. **Contracts.** `docs/contracts/` has one file per folder: core, gfx, world, vehicles, actors, systems, content, audio, ui.
9. **The save format, version 1.** `src/core/save.js`: `{ v, day, savedAt, playSeconds, sections, versions }` with a section for each group of fields in plan/04 section 18 (clock, economy, chars, missions, property, found, stats, settings), slots 1 to 3 and auto, export and import as a text code, a section it does not know is kept and written back. A real export is in `tools/fixtures/saves/v1.json`. No menu, and nothing saves or loads by itself yet.
10. **The `?debug` overlay** (the "if you finish early" item): calls, triangles, frame rate, simulation time, a frame-time graph and the nine costliest modules, with keys 1 to 9 to switch them off.

**Not shipped**

- **Rendering does not interpolate between steps yet.** The loop hands every module `alpha`; the car is still drawn at its last step, as before this session.
- **Gate G2's "at least 8 chunks".** The map is one block, so the 60 s gate drive is laps of the block (588 m, 4 chunk squares crossed). The gate reports this as a note. `route:beach-60` is in the runner and takes over when the beachfront streams (D2-S3).
- **Gate G8 was never run**: the studio machine has no graphics card.
- `test.setWeather`, `spawnVehicle`, `enter`, `exit`, `setHeat`, `mission`, `switchTo`: their systems do not exist yet. `t.spawn` in the harness moves the Heron.
- Changing quality while playing does not resize the effect pools (they are sized at load).
- The debug overlay has no chunk rings or simulation levels to show yet.

### D2-S3 · Streets (the whole beachfront, streamed)

**Shipped**

The map grew from one block to all of Tideline: 3.2 km of beachfront, 0.45 km deep. You can drive it end to end with no loading screen.

1. **The map, for real** (`src/world/map.js`, `zones/tideline.js`). Zone files are found by themselves. The road network is 45 named lines (40 north-south streets from Limpet Street to Barnacle Street, five east-west) cut into 403 road pieces at 200 junctions. Coral Boulevard is 14 m beside the day 1 block and 30 m north of Seagrape Street; eight avenues are 22 m. The map answers `districtAt`, `neighbourhoodAt`, `isLand`, `depthAt`, `heightAt`, `surfaceAt`, `lotsInChunk`, `roadsInChunk`, `nearestRoad`, `roadAt`, `snap`, `landmark`, `places`. 946 lots: 932 kit lots, the day 1 block, 11 lifeguard huts, and two sites kept clear for later sessions (Pelican Rest, Phase One).
2. **The chunk streamer** (`chunks.js`). 160 m chunks in three rings. LOD0: full detail and collision, 9 chunks on `low`, 25 on `high`, at most six meshes a chunk. LOD1: one box a building in its own colour, merged per 4 × 4 chunks into one draw call. LOD2: the skyline. Building is cut into pieces of about 1 ms and stops 1 ms short of the 4 ms budget; chunks ahead of the car's velocity go first; a chunk drops one ring further out than it loads; a dropped chunk's geometry is disposed, its colliders and props are taken out, and its builder buffers go back to a pool. The same seed gives the same city: a round trip of 2.8 km brings back the same vertex count, collider count and prop count.
3. **Collision in a spatial hash** (`collide.js`), 20 m cells, boxes and turned boxes in one flat typed array, added and removed by owner. `circle`, `box`, `ray` (a grid walk), `pushOutCircle`, `pushOutBox`, `blocked`, and a second grid for moving bodies. A query looks at about 12 shapes, not every box in the city.
4. **The beachfront kit** (`gen/tideline.js`, `gen/kit.js`): five recipes in day 1's style. T1 deco shopfront (day 1's building code, moved), T2 motel court with a pool and a pole sign, T3 hotel slab of 8 to 11 floors with setbacks, a fin and balconies, T4 beach shack, T5 bait shed, plus fenced empty lots in East Strand. Five neighbourhoods with the bible's shares.
5. **The day 1 block as a hero lot** (`landmarks/day1-block.js`). Its random numbers start where day 1's stream stood when it reached this block (13,112 numbers in, sign counter 17), so every colour, fin and sign is the one day 1 drew. The roof sign tops out at 26.2 m. Its five parked cars, lamps and plaza palms keep their places.
6. **Props and decor.** `props.js`: lamps, barriers and cones now come and go with chunks; a lamp carries its own pool of light and halo, which go out when it falls. `decor.js`: palms (four shapes and a far shape), umbrellas and benches, one instanced mesh a shape, culled by hand per chunk each frame. 12 or 13 instanced draw calls for all of it.
7. **The skyline** (`skyline.js`): one mesh, 9,400 triangles: 194 towers where Meridian will be, the Spire at the top of Coral Boulevard, the 26 beachfront buildings over 30 m, and the far ground.
8. **MeshBuilder v2**: float positions, byte normals, byte colours (18 bytes a vertex, was 36). Typed arrays that grow and are used again; chunk meshes let their copies go once uploaded.
9. **Lanes and sidewalks from the real roads** (`nav.js`, same contract): 782 lanes (one, two or three each way by road width, stopping width / 2 + 2 short of each junction, legal turns only, lights at 9 junctions on Heron Walk Drive), 1,506 walking edges with crossings. `route` is A* over junctions.
10. **Striped barriers where the map ends**: day 1's barrier across all 40 streets at the north edge and both ends of the five east-west streets.
11. **From the "if you finish early" list:** the 11 lifeguard huts, each in its own body and roof colours. Gullwing Pier was not built.

**Not shipped**

- **Gullwing Pier** (deck and ferris wheel). The promenade leaves its gap at x 592 to 608 and the canon data is in the zone file.
- **Two checks from other day 2 sessions now fail, and I did not edit them** (they are not my files): `D2-S1.3` expects a barrier at x = 100 on Heron Walk Drive, where the map used to end; `D2-S2.4` is the check of the old map and lane stand-ins (exactly 20 lanes, a dead end). The other 16 of those sessions' checks pass on the new city. `npm run check -- --id D2-S3` passes; `--day 2` will not until those two are brought up to date.
- **The sign atlas is still day 1's fixed sheet**, with four more names in its last four cells. The shelf packer of the bible's section 10 is not built, so kit shops share 14 signs.
- **The window-grid texture (`W` walls) is not built.** On `low`, upper floors get one ribbon of glass a floor instead.
- **No lit windows on the skyline** at night; it is one lambert mesh.
- **T6, T7, T8 and every tier B landmark**: their lots are T1 for now, as the bible says. Hotel Alba, Park & Sons and the others are still kit buildings.
- **The car and the camera were not moved to the new collision calls** (not my folder). `modules.world` keeps day 1's shape and hands the car only the boxes within 14 m.
- **Ordering in the pump is by chunk, not by lot**, and lanes are built once for the whole map instead of per chunk.
- No art requests were made.

### D2-S4 · Traffic (cars on every street, lights, crashes, parked cars)

**Shipped**

Bayhaven has other drivers now. They follow the lanes, queue at red lights, take turns at junctions, honk when you cut them off and get shoved down the road when you hit them.

1. **One vehicle class** (`vehicle.js`, `handling.js`). `Vehicle` is the body the player's car and every traffic car share, driven by a preset per model: top speed, time to 100 km/h and mass from the plan, plus grip, axle and box sizes. The pull of each model is solved so its 0 to 100 time matches the catalogue. The player can be put in any model (`modules.vehicles.swap`); it is the same object, so the camera and HUD keep their hold.
2. **Five models from the bible's sheets** (`models.js`): Snook, Tarpon, Mullet, Pompano and the Bay Cab, plus the Heron rebuilt from its sheet (same shape as day 1). A sheet line like `hood/f:1.25x1.79x0.46@1.67,0.44` is read straight into boxes and wedges. One mesh per model serves every colour: each vertex carries a mask (fixed, paint or accent) and the instance carries the two colours. Six factory colours a model; the stripe colour follows the paint (ink on pale, cyan on warm, pink on the rest).
3. **Traffic on rails** (`traffic.js`, `drive.js`). Cars follow the lanes from `nav`, use the bible's following rule (2 seconds plus 2.5 m), brake for the car ahead, for a red or amber line, and for anything in a 20 m path that is not in a lane (you, a car knocked loose). At a junction a car picks a legal turn (straight 0.6, right 0.2, left 0.2; a cab likes avenues twice as much) and follows a curve to it. Rules built: lights; a full second at a stop line, then first in, first out; side streets wait for the main road; left turns wait for a 4 second gap; nobody enters a junction whose exit lane is full; two cars share a junction only if their paths do not meet.
4. **Spawning** 120 to 260 m away where the camera cannot see (outside the view cone widened by 10 degrees, or behind a building, or at the far edge of an open road), 65% of picks ahead of where you are going, at most one a step. Removed past 320 m, or when out of view and over the target. Far cars are stepped every 2nd to 8th step.
5. **Lights** (`src/systems/signals.js`). Every junction where two big roads cross runs a 30 second cycle from the bible's table (12/2/1 twice, or 15/2/1 and 9/2/1, or 17 and 7), offset as a green wave. A pole with three lamps stands at each stop line near the player: two draw calls for all of them, with a small collision box each.
6. **Car against car** (`crash.js`): a separating-axis test on two turned boxes, a push apart split by inverse mass, an impulse with restitution 0.25 and a little yaw from off-centre hits. A traffic or parked car hit hard enough to change its speed by 2 m/s wakes into a full physics body (the same handling step as the player), brakes, and after 3 s at rest drives back into its lane if it can. A lighter tap leaves it where it is and it honks.
7. **Honk and swerve.** A driver with under 1.2 s to impact brakes at 8 m/s², leans away from you inside its lane and honks (`traffic:honk`). A driver stuck behind you for 4 s honks again.
8. **Parked cars** (`parked.js`): 6 m curb spaces down both sides of every road piece, 30% filled from the chunk's seed, any of five models. The nearest 24 (`low`) or 60 (`high`) are real vehicles you can ram.
9. **Rush hour and the quiet hour**: the bible's Tideline row (10, 19, 40, 32, 40, 31 out of 40 by hour band), eased over 30 game minutes at each edge. That is noon × 1.25 capped at the cap for the rushes and × 0.31 at 03:00.
10. **From the "if you finish early" list:** brake lights on every traffic car, and indicators that blink at 1.5 Hz from 32 m before a turn until it is done.

**Not shipped**

- **No sound for traffic.** `traffic:honk` and `vehicle:crash { what: 'vehicle' }` are emitted; the crash thump plays (audio already listens to `vehicle:crash`), the horn does not (audio is not my folder).
- **No lane changes.** A car takes a turn its lane allows, so it never needs one, but nobody overtakes.
- **No right turn on red, no dirt-track passing, no Spire Circle or ramp rules** (none of those roads exist yet).
- **States not built:** pulled over, panic, rubberneck, driverless, bailing out. They need sirens, weapons and people.
- **Parked cars have no alarms and do not use the static collision hash**: they are bodies in `collide.bodies`, and only vehicles test against them.
- **Traffic does not knock props over.** A traffic car drives through a Drift Night cone without moving it (so it cannot spoil the player's cone count).
- **No headlight beams on traffic at night**, no number plates, no hero build with separate panels, no cheaper far build (every car uses the traffic build at every distance).
- **Only Tideline has its own density row**; other districts use one default row until they exist. Weather does not change the count yet.
- **The Sheriff Tarpon in the mix, ambulances and timetabled vehicles** (tier C or later days).
- **`nav.green()` and `signals.state()` disagree**: nav has the older two-phase rule. Cars use `signals`. Whoever builds people crossing should use `modules.signals.state(lane)` or `phase(nodeKey)`.
- No art requests were made.

## Day 1: A block, a car, a sunset: the block comes alive (2026-11-11)

### D1-S1 · A block, a car, a sunset: the block comes alive (2026-11-11)

**Shipped**

today's roadmap line (one neon coastal block, a drivable car with a chase camera, a sky that goes
from day to sunset) was already standing after the warm-up. today it was checked again end to end
and then polished.

new today:
- asphalt, paving and sand have a fine speckled grain, so the ground rushes past and you can feel speed
- gulls circle over the beach, flapping and gliding; they go home at night
- sound: surf that swells like waves and gets louder near the sea, wind noise that rises with speed.
  M now mutes everything, and the game goes quiet when the tab is hidden
- the promenade lamps moved to the far side with long arms, so a post no longer blocks the camera
- the far sea no longer shimmers in a grid pattern (ripples fade out with distance)

numbers: 19 to 24 draw calls, about 56k triangles. gulls cost one draw call, the grain one small texture.

tested: build passes; headless-browser screenshots at day, sunset and night on desktop and phone
sizes; touch buttons under phone emulation; no console errors. not tested: the new sounds were never
heard by ear (the test browser has no speakers), only checked to run without errors. still no real phone test.

known rough edges: same as the warm-up (simple collisions, no traffic or people). driving feel is tomorrow.

## Day 0: Warm-up, before day 1: a block, a car, a sunset (2026-11-10)

### D0-S1 · Warm-up, before day 1: a block, a car, a sunset (2026-11-10)

**Shipped**

the game has a name and a place: **Bayhaven**, a pastel coastal city that lights up at night.

what's in the build:
- one playable city block by the sea: pastel low-poly buildings with shopfronts, neon trim and
  invented shop signs, a small plaza, a rooftop sign with the city's name, palms, street lamps,
  parked cars, zebra crossings
- a palm promenade, a beach with umbrellas and a lifeguard hut, and an ocean you can drive into (a bit)
- more blocks and skyline towers sketched in around it; striped "more city soon" barriers mark
  where today's map ends
- a drivable car with a chase camera: gas, brake, reverse, steering, a little slide, brake lights,
  headlights at night. it bumps into walls instead of driving through them. the camera stays out of buildings
- a sky that runs from afternoon to golden hour, sunset, dusk and night (then round again): sun,
  clouds, stars, sea colours, fog and city lights all follow one clock
- engine hum made from oscillators; touch buttons on phones; the game lowers its resolution if a phone can't keep up

controls: WASD / arrows drive · T (or tap the clock) skips time · R resets the car · M mutes

numbers: about 22 draw calls and 56k triangles on screen. everything is generated in code, no asset files.

tested: headless-browser screenshots at day, sunset, dusk and night, desktop and phone sizes; touch
buttons under phone emulation; wall and shoreline collisions. not yet tested on a real phone, and
driving feel was only checked by numbers, not by hand. that is tomorrow's line anyway.

known rough edges: collisions are simple (you slide along walls), no traffic or people yet, lamp
posts near the camera can block the view, sand and road have no texture.
