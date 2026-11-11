# 08 · Roadmap

Day 1 shipped on 2026-11-11: one block, one car, a sky that turns. Eight days are left. The last build ships on **2026-11-19**, the day GTA 6 comes out. After that the after-release track at the bottom takes over.

## How a day runs

- A day's sessions run in the 24 hours before its build. **Each day's build ships at 21:00 IST.**
- Every day has four sessions, in priority order:
  - **S1 is the headline.** It is the thing you can see in that day's clip. It always runs first and it is pinned to its day. It runs alone unless that day's run order says other sessions can start beside it. At the Mid and High levels it is never cut. (At the Low level there is one session a day, and some days it has to be an earlier session the headline depends on. That order is listed under "What ships at each compute level".)
  - **S2, S3 and S4** deepen the day. They run after S1, one after another or at the same time (each day says which can run together).
- **The backlog rule:** a session that didn't run goes to the backlog. Next day, after that day's S1, the backlog is run oldest first before the new S2–S4. A session marked **blocking** jumps to the front of the backlog.
- **The cut rule:** when compute is short, cut from the end: bonus pool first, then S4, S3, S2. Three day 2 sessions are never cut because the rest stands on them: Foundation, Streets and Traffic. The studio's operator keeps the full cut order.
- After the last session of the day comes the integration step (merge, checks, changelog), then `build_day.py`, then the clip.
- **Art runs.** If the art department is on, the day's asset requests are fulfilled outside the sessions and land as commits before the build. A build never waits for an asset: without it, the code-made version ships.
- **Never fake it.** If a headline didn't land, the build ships with what works and the changelog says what didn't.

Session IDs are `D<day>-S<n>`. Each session is given its own prompt. Checks named below go in `tools/checks/<session-id>.mjs` and use the test API from `06-tech-architecture.md`. The standing gates G1–G7 apply every day on top of the day's own checks; G8 (real frame rate) is measured every day and must pass from day 8.

## Overview

| Day | Date (IST) | Headline (S1) | S2 | S3 | S4 |
|---|---|---|---|---|---|
| 1 | 11-11 | A block, a car, a sunset (shipped) | | | |
| 2 | 11-12 | **Drift** | Foundation (blocking) | Streets: all of Tideline, streamed | Traffic |
| 3 | 11-13 | **On foot** | Pedestrians | Garage: 8 more vehicles | HUD and controls |
| 4 | 11-14 | **Downtown** | Radio: 3 stations | Port, Palma Vieja, Paintworks | Minimap and map |
| 5 | 11-15 | **Heat** | Heat 4–5 and the helicopter | Mayhem: damage, breakables | Combat |
| 6 | 11-16 | **Missions** | Phone and two missions | Expressway, Northgate, Mallard Greens | Money and shops |
| 7 | 11-17 | **The leads** | Boats and water | Two missions | Side jobs and things to find |
| 8 | 11-18 | **Weather** | Phones first (performance) | The rest of the map | Radio: 7 stations, soundscape |
| 9 | 11-19 | **Release build** | The Spire Job | Property and endgame | Final pass |

---

## Day 2 · 2026-11-12 · "It drives like a game"

**Goals**
- S1 **Drift:** handling with weight, a handbrake, slides you can hold, tyre smoke, skid marks, sparks, knock-over props, a speedometer, gear-change engine sound, look-back camera, gamepad, a handbrake button on touch. The Drift Night drop.
- S2 **Foundation (blocking):** the module layout, the registry, events, state, the test API, the check runner, the name check, the changelog builder, quality levels. No visible change; everything after depends on it.
- S3 **Streets:** `map.js`, the Tideline zone, the chunk streamer with three detail rings, the spatial hash, instanced palms and lamps, the skyline. The whole 3.2 km beachfront is drivable.
- S4 **Traffic:** the lane graph, 40 cars that follow lanes and lights, four new vehicle models (Snook, Tarpon, Mullet, Pompano) and the taxi, car-to-car collisions, parked cars per chunk.

**Run order:** S1 → S2 → S3 and S4 together.

**Checks**

| Check | Pass |
|---|---|
| D2.1 Slide | After 3 s of gas, then 1.5 s of gas + left + handbrake: peak slip angle ≥ 0.35 rad, at least one skid-mark segment exists, speed still ≥ 30 km/h |
| D2.2 Props | Driving into a lamp post at 60 km/h emits `prop:broken` and the car keeps at least 50% of its speed |
| D2.3 Layout | Registry lists ≥ 8 modules; `src/main.js` ≤ 60 lines; no file in `src/` over 500 lines; `npm run check -- --day 1` reproduces day 1's numbers within 10% |
| D2.4 Streaming | Teleport to `(-1500, -100)` and `(1500, -100)`: ≥ 9 chunks loaded at each and `districtAt` is `tideline`. A 60 s drive along Heron Walk Drive passes G4. |
| D2.5 Traffic | At `(0, 37)` at noon after 10 s: ≥ 10 moving cars on `low`, ≥ 25 on `high`. Over 60 s no car ends up inside a building box, and at least one stops for a red light. |
| D2.6 Models | Each of `snook`, `tarpon`, `mullet`, `pompano` spawns, is 300–600 triangles, and reaches 80% of its listed top speed |

**Clip:** sunset on the beachfront. The coupe comes down the drive, handbrakes round the plaza corner in smoke, a taxi swerves, neon cones scatter. 12 seconds.

---

## Day 3 · 2026-11-13 · "Get out of the car"

**Goals**
- S1 **On foot:** Teo as a walking, running, jumping character; getting in and out of any vehicle; third-person camera; on-foot touch controls; wading.
- S2 **Pedestrians:** instanced box people on a sidewalk graph, eight kinds, six states including filming you, horn reactions, tumble and get up. The Flamingo Flash Mob drop.
- S3 **Garage:** eight more vehicles (Wahoo, Sailfin, Grouper, Manatee, Pinfish, Needlefish, Birdie, Flounder), two-wheel handling, per-class engine sounds, taking a car from traffic.
- S4 **HUD and controls:** the stream-overlay HUD, context prompts, toasts, the pause menu with settings, the wordmark, the day badge, full gamepad map, portrait and landscape touch layouts.

**Run order:** S1 → S2, S3 and S4 together.

**Checks**

| Check | Pass |
|---|---|
| D3.1 Exit | `test.exit()` gives `mode: 'foot'` within 1.5 s. Holding forward 5 s moves 7–9 m; sprinting 5 s moves ≥ 28 m; a jump peaks ≥ 1.0 m. |
| D3.2 Enter | Standing within 2.5 m of a parked car, `test.enter()` gives `mode: 'car'` within 2 s |
| D3.3 Crowd | At `(0, 45)` at noon: ≥ 15 people within 150 m on `low`, ≥ 40 on `high`. All people cost ≤ 8 draw calls in total. |
| D3.4 Filming | A crash within 40 m makes ≥ 3 people enter the filming state within 3 s and `followers` rises |
| D3.5 Get up | A person hit at 40 km/h emits `ped:hit` and is walking again within 8 s |
| D3.6 Vehicles | All 13 land vehicles spawn and reach 80% of listed top speed; two-wheelers show non-zero lean while steering |
| D3.7 HUD | At 1920×1080, 844×390 and 390×844 no two HUD elements overlap and all sit inside the safe area; the badge reads `Day 3 build`; no text under 14 px |

**Clip:** golden hour. Teo steps out of the coupe on the promenade and walks down onto the beach into 150 people doing the same dance. Two of them stop to film him. 12 seconds.

---

## Day 4 · 2026-11-14 · "The city grows"

**Goals**
- S1 **Downtown:** the Meridian zone and generator (five tower recipes, podiums, plazas), Coral Boulevard, the Meridian Spire, lit window grids, the first avenues with lights.
- S2 **Radio:** the mixer, synth instruments, the sequencer, three stations with three songs each, host lines and ads on a ticker with blips, station switching. The Rooftop Launch Party drop.
- S3 **Port, Palma Vieja and Paintworks:** three zones and generators, the cranes and container ship, Domino Park and the bell tower, the paint factory, a mural painter shared by two districts.
- S4 **Minimap and map:** the minimap, the full map screen, blips, waypoints with a route, district name tags.

**Run order:** all four together (four separate sets of files). One at a time: S1, S4, S2, S3.

**Checks**

| Check | Pass |
|---|---|
| D4.1 Districts | `districtAt(52, -900)` is `meridian`, `(-1400, -900)` is `palmavieja`, `(1300, -800)` is `paintworks`, `(2500, -700)` is `rustwater` |
| D4.2 Spire | The landmark `spire` exists, is ≥ 250 m tall, and is part of the skyline mesh |
| D4.3 Budgets | G3 passes at `(52, -900)`, the densest spot in the game |
| D4.4 Radio plays | In a vehicle, the music bus measures above silence (RMS > 0.01) over 5 s; 3 stations each have ≥ 3 songs, ≥ 6 host lines, ≥ 4 ads; switching emits `radio:station`; a `radio:line` arrives within 120 s |
| D4.5 Minimap | The minimap canvas shows ≥ 3 distinct colours; setting a waypoint at the Spire from the beach gives a route 1.0–1.6 times the straight-line distance |
| D4.6 Long drive | A 90 s scripted drive from the beach to the port passes G2 and G4 |

**Clip:** dusk. Up Coral Boulevard as the towers light floor by floor, the Spire dead ahead, the radio pill flips from Tideline 98 to Bassline FM and the bass drops as the neon comes on. 13 seconds.

---

## Day 5 · 2026-11-15 · "Everyone is filming"

**Goals**
- S1 **Heat:** crimes and who saw them, heat 1–3, cruisers that chase, box in and ram, deputies on foot, the viewers meter, the LIVE overlay with chat, losing heat, Booked.
- S2 **Heat 4–5:** roadblocks, spike strips, tactical vans, the news helicopter with a spotlight, the helicopter cam, the Sheriff's show truck, radio interruptions. The Pilot Episode drop.
- S3 **Mayhem:** vehicle health, loose panels, smoke, fire, explosions, breakable props, hydrant geysers, tumbling people, pooled debris.
- S4 **Combat:** fists, noodle, flamingo, pistol, SMG, shotgun, lock-on, health and armour, Knocked Out, guards as enemies.

**Run order:** S1 → S2, S3 and S4 together.

**Checks**

| Check | Pass |
|---|---|
| D5.1 Response | `test.setHeat(1)` brings ≥ 1 cruiser within 10 s; ramming a cruiser from heat 0 gives heat ≥ 1 within 2 s |
| D5.2 Live | At heat 3: `heat:live` fires with viewers > 0, the LIVE pill is visible, ≥ 3 chat lines appear within 10 s, the helicopter exists |
| D5.3 Escape | Heat 2 then a teleport 1 km away out of sight: heat is 0 within 30 s. Heat 5: within 75 s. |
| D5.4 Stunts add viewers | At heat 3, a drift in view raises viewers |
| D5.5 Booked | Heat 1, stopped beside a deputy for 5 s: `player:booked`, cash down 10%, player at the Sheriff's HQ (or its stand-in point) |
| D5.6 Damage | Four 100 km/h wall hits put vehicle health under 40 with smoke; further hits emit `vehicle:destroyed`; debris never exceeds the cap |
| D5.7 Knocked out | Player health 0 emits `player:knockedout` and the player wakes at the hospital point with 5% less cash |
| D5.8 Load | G3 passes at heat 5 with the full unit cap on screen |

**Clip:** night. Heat 3 down the beachfront: the LIVE pill, the chat flying ("grandma???", "HE'S GOING FOR THE PIER"), the spotlight on the car, then a cut to the helicopter cam for the last three seconds. 14 seconds.

---

## Day 6 · 2026-11-16 · "A reason to drive"

**Goals**
- S1 **Missions:** the mission engine, markers, objectives, checkpoints, dialogue with blips, the postcard result card, and mission 1, Final Notice. The Getaway Cup drop.
- S2 **Phone and two missions:** the phone and its apps (Messages, Map, Camera, Squawk, Jobs, Stats, Settings), photo mode, missions 3 (Repo Woman) and 7 (As Seen on TV).
- S3 **Expressway, Northgate, Mallard Greens:** the raised road with ramps and deck levels, two zones and generators, the hospital, the Sheriff's HQ, the mall, the gated suburb and its golf course (mission 5 needs it tomorrow).
- S4 **Money and shops:** cash and followers, shop menus, clothing, food, Park & Sons, Bait & Ballistics, car washes, brand deals.

**Run order:** S1 → S2, S3 and S4 together.

**Checks**

| Check | Pass |
|---|---|
| D6.1 Mission 1 | `final-notice` runs from start to `mission:completed` by skipping steps; cash rises by 500; the result card is shown |
| D6.2 Fail and retry | Destroying the vehicle mid-mission emits `mission:failed`; retry resumes from the last checkpoint |
| D6.3 A real step | The `goto` step completes when the player is driven (not skipped) to its marker by an input script |
| D6.4 Phone | Opening the phone shows ≥ 7 apps; game speed is 0.3 while open; Camera returns a PNG over 50 kB with the postcard frame; Squawk has a new post within 5 s of a `drift:end` |
| D6.5 Missions 3 and 7 | Both complete by skipping steps; mission 7's `heat` steps complete for real when heat is set |
| D6.6 Deck | Driving up the ramp at `x = 700` gives `player.level === 1` and a height near 8 m; 30 s at 110 km/h on the expressway passes G4 |
| D6.7 Shops | A shop opens at its marker; buying a shirt lowers cash and changes the outfit; paint changes the car's colour; food raises health |

**Clip:** the tow-truck chase. Mags's coupe rams the truck, the scooter falls off the back, cut to the postcard result card and the `Delivered` stamp landing. 12 seconds.

---

## Day 7 · 2026-11-17 · "Two of them"

**Goals**
- S1 **The leads:** Mags playable, both abilities, the sky-swoop switch with vignettes, the cutscene system, the opening cutscene. The Switch Day drop.
- S2 **Boats and water:** depth, wading and swimming, the Skipjack, Skimmer and Gatorback, marinas, cars stalling in water, coast-following foam.
- S3 **Two missions:** 5 (Open House) and 11 (Yacht Rock), with their cutscene and guard view cones.
- S4 **Side jobs and things to find:** taxi fares, food delivery, four street races, repo runs, 15 Big Air ramps with replays, 40 flamingos, 10 postcards, the Stats app.

**Run order:** S1, S2 and S4 together → integration → S3 (it needs the leads and the boats).

**Checks**

| Check | Pass |
|---|---|
| D7.1 Switch | `test.switchTo('mags')` emits `player:switched`, completes within 4 s, and the two leads are at different places |
| D7.2 Abilities | Mags's horn puts ≥ 3 traffic cars within 30 m into the pulled-over state; Teo's Go Live doubles a follower gain |
| D7.3 Cutscene | The opening runs ≤ 45 s; skipping ends it within 1 s; the game is playable straight after |
| D7.4 Boats | A Skipjack spawned at `(600, 420)` reaches ≥ 70 km/h; a car driven to depth 0.8 m stalls; the player swims beyond 1.2 m |
| D7.5 Missions 5 and 11 | Both complete by skipping steps; mission 11 passes through both leads |
| D7.6 Placement | Every flamingo, ramp and postcard is on land, outside every building box, and at least 3 m from a road centre line (a script checks all 65) |
| D7.7 Jobs | A taxi fare and a delivery each complete by teleport; 4 races exist and each has ≥ 6 checkpoints on roads |

**Clip:** Teo on the end of the pier at sunset. The camera lifts straight up into the sky, slides across the bay, and drops onto Mags drifting a city bus round a corner with the horn going. 13 seconds.

---

## Day 8 · 2026-11-18 · "Storm warning"

**Goals**
- S1 **Weather:** rain, wet roads, wind in the palms, lightning and thunder, the 15:15 storm, the rainbow after it, swamp fog, hurricane mode, bloom and grading on `high`. The Hurricane Party drop.
- S2 **Phones first:** tuned quality levels, chunk building in a Worker, pooling, memory, touch polish, and the real frame-rate gate. Bug bash from `BUGS.md`. Runs alone, last.
- S3 **The rest of the map:** Runway Flats, Mudcat Glades and the Islands, with the Longspan and one landmark each.
- S4 **Radio and soundscape:** four more stations, news that reports what you did, the full ad pool, district ambience, weather sound, stingers, a mix pass.

**Run order:** S1, S3 and S4 together → integration → S2 alone, last.

**Checks**

| Check | Pass |
|---|---|
| D8.1 Rain | `setWeather('storm')`: rain particles > 0, `weather.wet` > 0.5 within 20 s, road grip multiplier 0.8 |
| D8.2 The 15:15 | From clear weather at 15:10, the storm starts by 15:20 game time |
| D8.3 Hurricane | People on the street fall to 0 within 30 s; at least one flying prop exists; with reduce-motion on there are no flashes |
| D8.4 Whole map | `districtAt` is right at ten sample points; a hop-and-drive tour (12 spots, 20 s each, every district) passes G2–G4 |
| D8.5 Longspan | A scripted drive from `(-2000, 300)` to `(-3100, 1200)` arrives without entering water |
| D8.6 Seven stations | 7 stations play; after a `drift:end`, the next Bayhaven Public Radio news line uses a drift template |
| D8.7 Soak | Over a 10-minute scripted tour, heap growth between minute 2 and minute 10 is under 15% |
| D8.8 Frame rate | **G8 passes on a real GPU at both sizes.** One real phone is checked by hand against the five-point list below. |

**Real-phone list (two minutes, by hand):** opens in under 6 s · steering and both pedals respond · no button under a thumb is cut off · sound starts on first touch · three minutes of driving with no freeze.

**Clip:** a sunny beach at 15:14. A wall of rain crosses the frame in four seconds, lightning, people run, the neon comes on and streaks down the wet road as the coupe drives through. 12 seconds.

---

## Day 9 · 2026-11-19 · "Release"

**Goals**
- S1 **Release build:** the title screen over the live city, new game and continue, saving with three slots and export, the Time machine, credits, the first-ten-minutes hints, and mission 20, Going Viral. The Launch Night drop.
- S2 **The Spire Job:** mission 18, the finale, in the hurricane, with both leads.
- S3 **Property and endgame:** eight properties, garages, businesses, the 100% list, free-roam hurricane events.
- S4 **Final pass:** bug bash, all gates, access settings, a last name check, save upgrades from every earlier build. Runs alone, last.

**Run order:** S1 alone (it changes the save code) → S2 and S3 together → S4 alone, last.

**Checks**

| Check | Pass |
|---|---|
| D9.1 Title | A fresh load shows the title within 3 s with the city moving behind it; New game leads through the opening into mission 1 |
| D9.2 Save | Export, reload, import: every whitelisted field matches. Fixture saves from each earlier format load and place the player on solid ground with cash intact. |
| D9.3 Ending | Missions 18 and 20 complete by skipping steps; credits play and end; free roam works afterwards |
| D9.4 Property | Buying the motel room makes it a save point; a stored car is still there after reload; a business pays at 09:00 |
| D9.5 Time machine | The title menu links to `../day-1/` through `../day-8/` |
| D9.6 First ten minutes | A scripted new game through Final Notice into free roam finishes with zero errors and shows each of the three hints once |
| D9.7 Everything | `npm run check -- --day 9` passes: G1–G8 and every earlier day's checks |

**Clip:** split screen, same spot, same camera: the plaza on day 1 (an empty block) and on day 9 (traffic, people, rain starting, a chase going past with the LIVE overlay). Then fireworks over the bay. 15 seconds.

---

## What ships at each compute level

The same roadmap, cut by the cut rule. Named so the changelog can say plainly which game was built.

| Level | Sessions run | The day 9 build is |
|---|---|---|
| **Low** | One session a day (two on day 2), 9 sessions, in the order below | "The beachfront": all 3.2 km of Tideline, drift handling, six vehicles, traffic, Teo on foot, heat 1–3 with the LIVE overlay, mission 1 and the ending drive, weather, a title screen and saving. No downtown, no crowds, no radio, no phone, one lead. |
| **Mid** | S1–S4, 32 sessions plus integration | The roadmap above. |
| **High** | Mid plus bonus pool part 1 (B-01 to B-14) | Mid plus the other 14 chapter 1 missions, more landmarks, wildlife, three interiors, six more side jobs, the first ten Local Man events. |
| **Max** | High plus bonus pool part 2 (B-15 to B-35) | Everything the bible marks tier B: the clip recorder, the seven-day week, transit, three Regulars, small games and the arcade, every district built to its bible file, the city's voices, twelve stations, 31 road vehicles, the full wardrobe, achievements, twenty races, working businesses. |

**The Low order.** A headline can't run before what it stands on (Heat needs Traffic; every district needs Streets; everything needs Foundation), so at one session a day the order is:

| Day | Low level runs | The build gains |
|---|---|---|
| 2 | D2-S1 Drift, then D2-S2 Foundation (two sessions, this day only) | drifting; the frame everything else needs |
| 3 | D3-S1 On foot | walking, getting in and out |
| 4 | D2-S3 Streets | the whole 3.2 km beachfront, streamed |
| 5 | D2-S4 Traffic | traffic, five more vehicles |
| 6 | D5-S1 Heat | police, viewers, the LIVE overlay |
| 7 | D6-S1 Missions | the first mission and the postcard |
| 8 | D8-S1 Weather | rain, the 15:15 storm, a hurricane |
| 9 | D9-S1 Release build | title, saving, the ending drive, credits |

Every day still has something to see. Day 4's headline becomes "the whole beachfront" instead of "downtown", and the changelog says so.

---

## After release

From 2026-11-20. Whether this runs at all is the owner's decision (freeze the day 9 build as "what one AI built in nine days", keep going while there is compute, or start something new). If it runs, the work is already written down: the bible holds the full-size game with a tier on every item, and each pool below is a list of ready prompts built from it.

| Pool | Tier | Sessions | What it adds |
|---|---|---|---|
| Bonus part 1 (B-01 to B-14) | B | 14 | The rest of chapter 1, landmark packs, interiors, wildlife, a vehicle pack, more side jobs, Local Man, a fuller Squawk, more to find |
| Bonus part 2 (B-15 to B-35) | B | 21 | The clip recorder, the week, transit, three Regulars, small games, the arcade, every district in depth, barks and signs and the phone's browser, five more stations, more vehicles, the full wardrobe, achievements, mixtapes, twenty races, businesses |
| The C pool (C-01 to C-22) | C | 22 | Nine more Regulars, aircraft, the monorail and ferry, more small games, Local Man to sixty, seasons, the full vehicle catalogue, more boats, silly weapons, tier C landmarks, more interiors, the last ramps and finds, sharing, missions players can write, difficulty and access, a second performance pass |
| The V pool (V-01 to V-17) | D | 17 | Marlin County's seven zones, the long roads, and chapters 2 and 3 |

Order: any B session that has not run, then C in number order, then V. As a calendar, at one or two sessions a day:

| When | What |
|---|---|
| Week 1 | Unrun B sessions · reruns of the eight daily drops from the title menu · C-01 to C-05 (every Regular) |
| Week 2 | C-06 to C-12: aircraft, Baylink and the ferry, more games, Local Man, seasons |
| Week 3 | C-13 to C-22: vehicles, boats, landmarks, interiors, the last finds, sharing, custom missions, difficulty, performance |
| Weeks 4 and 5 | V-01 to V-07: the county, zone by zone, then the long roads |
| Weeks 6 to 8 | V-08 to V-12: chapter 2, Hurricane Season |
| Weeks 9 to 11 | V-13 to V-17: chapter 3, Bayhaven Tomorrow |

Every after-release day still ships a playable build, still follows the lane rules, and still says plainly what did not land. Nothing in the C or V pools is promised by a date anywhere.
