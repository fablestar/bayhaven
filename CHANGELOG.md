# Changelog

Built from the notes in `changelog/` by `tools/changelog.mjs`. Newest day first.

## Day 6: Missions

### D6-S1 · Missions

**Shipped**

(being written)

## Day 5: Heat

### D5-S1 · Heat

**Shipped**

1. **Crimes.** `src/systems/heat.mod.js`. Listens for `vehicle:crash`, `ped:hit`, `prop:broken`, `weapon:fired`, `vehicle:entered` and the vehicles lane's own carjack `crime`; asks the deputies whether one of them could see it (60 m by day, 45 m at night, 100 degrees either side of a cruiser's nose, a clear line); emits `crime { kind, case, seen, points, x, z, weapon, level }` and adds the points from the bible's table. 100 points is a level. Small crimes stop at 299. Gunfire counts unseen. A cruiser that swings into you does not get you charged with hitting it.
2. **Heat 1 to 3 and the cruisers.** `src/actors/cops.mod.js`, `cops-brain.js`, `cops-draw.js`. 1, 3 and 5 cruisers. Each is a Tarpon the traffic system holds (so your car hits it and traffic brakes for it) driven by a pursuit brain through the same handling step as the player's car: pull over (8 m behind at heat 1), chase, cut off, ram (alongside, then into the rear quarter, 4 s between tries), box in (front, side and rear slots under 40 km/h), search (the last seen point, then a loop out to 150 m) and leave. White with teal doors, a pink stripe, a push bar and a pink and cyan light bar that flashes and washes the road at night. When you stop, the deputy gets out on your side and walks to your door; at heat 3 he stands behind his car and fires.
3. **Viewers.** The bible's maths to the letter: in view the meter climbs through the level's range in 90 s and then the level rises; unseen for 1.5 s it drains at 8% of peak a second divided by the level; at zero the heat clears. A drift in view adds 1% of the range a second, a crash at 8 m/s or more 3%, a jump 0.2% a metre. Changing car while nobody can see drops one level at once and keeps the meter's share, once in 20 s. Heat 1 with a unit within 80 m and you above 20 km/h for 20 s is heat 2.
4. **The LIVE overlay.** `src/ui/live.mod.js`, painted on the HUD canvas so clips include it. A chat of 67 written lines (the bible's 40 A rows for this session and 27 B rows of the same groups, word for word) from 30 usernames, reacting to going live, the level, drifts, jumps, crashes, hiding, car swaps and getaways, with filler between. The Sheriff's ticker under it scrolls 18 lines keyed to the same events.
5. **Five siren lights** were already a HUD piece reading `state.heat.level`; they now have something to read. **Sirens**: one voice, a wail at heat 1 and 2 and a yelp from 3, as loud as the nearest lit cruiser is close. **The scanner**: 27 dispatcher calls (nine crime kinds at heat 1 to 3), spoken as blips with static before and a beep after, with a subtitle, when a cruiser is within 30 m.
6. **Booked.** Heat 1 or 2, under 1 m/s, a deputy at your door for 3 s: `player:booked`, 10% of cash up to $5,000, two hours on the clock, on foot at a stand-in point, and our own booking screen (`src/ui/live-booked.js`): the lead holding the board, the cost on a sand panel, Lawyer Larry's card sliding in, a `Walk out` button.
7. **Test API**: `test.setHeat(n)`, `test.heat()`, and `test.crime`, `test.cops.*`, `test.live()`, `test.heatSound()`. **Clip** `?clip=day-5`: night on the beachfront at heat 3, three cruisers, the chat running.
8. One art request: `art/requests/veh-sheriff-tarpon.json`.

**Not shipped**

- **Neither finish-early item is done as asked.** Cruisers do not pull over for Mags's horn. Car washes do double the drain (`hidden()` checks for a `carwash` place within 12 m) but no check drives into one, so treat it as untested.
- **Heat 4 and 5 bring nothing new.** The meter runs (heat 5 clears in 63 s unseen) and five cruisers come; SUVs, vans, roadblocks, spikes and the helicopter are D5-S2. D5.2's "the helicopter exists" is not checked here.
- **The deputy's shots hurt nobody.** He fires, sparks fly, `cop:fired` and `combat:hit` go out, and nothing takes health off yet.
- **Weapons are not taken** when booked (there are none), and Lawyer Larry's half price is not there.
- **The siren lights do not dim with the meter** at heat 1 and 2, and the LIVE pill has no unseen look or "Off air": both live in `src/ui/hud-draw.js`, which this session did not own.
- "Parked with the engine off", bridges and garages do not hide you. I first made standing still for 2 s count; it halved every escape time, so it came out.
- Fixed cameras, `threat`, `punch`, `killcop`, `explosion`, `shoot-out`: no weapons or health yet to fire them.

### D5-S2 · Heat 4 and 5

**Shipped**

1. **The news helicopter.** `src/vehicles/chopper.mod.js`. BHTV 6's Mayfly, built from boxes off the bible's sheet (white pod, violet boom, a 6 on each side, a spotlight and a camera ball under the nose), with a two-blade rotor at 6 turns a second. From heat 3 it is made 380 m away and is on the scene in 4.8 s, then holds 60 m up and 45 m out, behind and to the left, and circles when you stop. The rotor is looped noise chopped at 12 Hz through a 900 Hz low-pass, louder as it gets nearer. Its spotlight is a 14 m disc on the road with a faint cone down to it, bright at night and barely there by day, trailing you by 0.4 s. While the disc is on you it is a camera: you count as seen with no deputy near.
2. **The helicopter cam.** V (or a pad's Back button, or the on-screen `Chopper cam` button, which is the way in on a phone) moves the view to the helicopter: 59 m up, 35 degrees wide, looking at you, with a red `CHOPPER CAM` tag on the HUD canvas. V again, the heat clearing, the helicopter leaving, or 2 s under cover gives the chase camera back.
3. **Heat 4.** `src/actors/cops-heavy.mod.js`, `cops-heavy-draw.js`, `cops-roadblock.js`. Sheriff Grouper SUVs (they shove with one and a half times their mass) and tactical vans join the cruisers: 2, 2 and 2 on `low`, 4, 3 and 2 on `high`, always inside the cap. **Roadblocks**: every 2 s your road is followed straight on, and the first junction 160 to 400 m ahead on an avenue or boulevard gets two units nose to nose at 30 degrees with a 3.2 m gap at the kerb on your side, barriers to the far kerb, deputies out and firing, and a **spike strip** 25 m in front. A tyre crossing it above 10 km/h bursts: that corner keeps 0.3 of its grip, the car pulls to that side, each burst tyre drags, and the rim throws sparks. One roadblock at a time (two at heat 5 off `low`); it lifts when you are past, after 40 s, or when you turn away for 6 s.
4. **Heat 5, Hurricane Dale.** Sheriff Rucker's show truck: a stage on a truck with a screen each side, a camera crane, a dish, two speakers and the Sheriff at his podium with a megaphone. It never rams: it pulls alongside to film, its cameras see 80 m all round, and its horn is the show's four notes (D4 F4 A4 D5). With it come cruisers, SUVs and vans up to the cap: 6 on `low` in 11 s, 12 on `high` in 24 s.
5. **For the radio and the overlay.** `heat:broadcast { on, level }` goes out when the level crosses 4 either way. 20 more chat rows and 10 more ticker lines, word for word from the bible (`src/content/heat-high.js`): the heat 4 and heat 5 groups, two for the helicopter cam, and the Sheriff's lines for stepping up and for 50,000, 150,000, 250,000 and 500,000 viewers.
6. **The day's drop: "Bayhaven Blue: Pilot Episode".** `src/content/drops/day-5.js`, build day 5 only. A red button on a plinth in the plaza of the day 1 block. Walk or drive into it and heat goes straight to 5. The sign beside it and the HUD's drop line show viewers while you are on air and your peak afterwards.
7. **Both finish-early items.** A second helicopter at heat 4 (Sheriff's colours, 40 m up, ahead of you; not on `low`). Roadblock deputies dive aside when a car comes at them inside 15 m.
8. Two art requests: `art/requests/veh-news-mayfly.json`, `veh-sheriff-showtruck.json`.

**Not shipped**

- **The van and the truck are bodywork over other vehicles.** There is no `tactical` or Hogfish model yet, so the van is drawn over a Pompano and the truck over a Mullet: their own wheels, wheelbase and engines show through. Size, mass and top speed are the bible's.
- **The truck's screens do not show the live count.** They are dark panels with a red pill and white blocks. A canvas there would be one more texture on a phone.
- **How the helicopter loses you is my rule.** The bible has it see everything within 150 m that is not under cover, and names bridges, garages and a tunnel as cover. None of those is on the map, so heat 3 and up would have had no way out but a car wash. What I built: it is a witness only while its disc is on you (above about 70 km/h in a straight line you are ahead of the disc); it keeps station on a car within 150 m, but one that stays out of the light for 12 s with no deputy watching is lost, and it goes to sweep the last place it had you. This wants replacing when cover exists.
- **The spike strip is wider than the bible's 7 m.** It runs from the far kerb to the gap (26.8 m on Coral Boulevard), because two vehicles and a row of barriers cannot close a 22 or 30 m road and a 7 m strip was easy to miss.
- **A roadblock can go up in the camera's view** if it is more than 220 m ahead. On a straight avenue the second junction is always in view, so the bible's rule as written would never fire there.
- **Burst tyres mend** when the heat clears, when you change car, on a reset and when booked. There is no garage to fix them yet.
- **The helicopter cannot be shot down**, the second one has no speaker or marksman, and tactical deputies look like ordinary deputies and are `smg` in name only (their shots still hurt nobody, as in D5-S1).
- **The radio does not cut to the chase.** The event is there; the audio lane has to take it.
- Chat row 34 and the helicopter rows 163 to 170 are not in: the prompt asked for 20.
- Heavy units do not shove traffic aside, and the expressway roadblock (three vehicles, 600 m ahead) is not built: there is no expressway.

### D5-S3 · Mayhem

**Shipped**

1. **Vehicle health.** `src/vehicles/damage.mod.js`. The player's car and every traffic car within 90 m are watched; a change of speed of more than 3 m/s in one step is a hit and costs `max(0, dv - 3) × 0.8` health (the bible's formula and class multipliers). Under 60: every panel dented and a headlight cracks in a spray of glass. Under 40: grey smoke from the engine. Under 20: fire, dark smoke and an 8 second fuse (the player gets a line on the HUD). At 0 or when the fuse runs out: the explosion. It throws the hood up at 9 m/s with more boxes in the car's paint, leaves a scorch mark, takes up to 60 health off vehicles and up to 120 off people within 6 m, and can set off a burning car beside it half a second later. The wreck is dark, cannot be driven and burns for 20 s. Measured: a 100 km/h wall hit costs 18.6 (the car loses a little speed over the 5 m run-up); four leave 25.4 with smoke, the fifth sets it alight, the sixth ends it.
2. **AI drivers bail.** A traffic driver whose car catches fire stands on the brakes, and 1.5 s after it is under 20 km/h gets out and is a person on the street. One still moving when the fuse ends does not make it (`driverDied` on the event). The empty car goes up and is left as a wreck.
3. **Panels.** `src/vehicles/panels.js`. Hood, boot lid, two doors and two bumpers on the player's car, placed from each model's sheet, as six slabs in one mesh (one draw call, 72 triangles). The end that is hit comes loose: the hood and boot lid flap up with speed on a spring, doors swing out in turns, a bumper hangs from one corner and drags sparks. They fall off by the bible's table (hood: a front hit over 60 km/h under 40 health, and so on) and become a box of the same size in the debris pool. Where one has gone a dark slab shows.
4. **Breakable props.** `src/world/props.js`, `src/world/breakables.mod.js`. Five new kinds: hydrant, cafe table, chair, picket fence, sandwich board. They stand along the sidewalks of every loaded chunk, placed from the chunk's seed (round the spawn on `high`: 14 hydrants, 7 tables, 14 chairs, 21 fence sections, 14 signs). Lamp posts now bend: 0.66 rad at 40 km/h, flat at 110. A hydrant leaves a geyser for 25 s that lifts the player's car (2.6 m at the top of the first bounce, then held about 1.8 m up). Fences vanish into 14 splinters (6 on `low`). Tables and chairs are thrown 7 to 9 m. Signs fall. A palm that takes a hit drops two coconuts. `prop:broken` goes out for each.
5. **People.** `src/actors/tumble.js` (the rope file, renamed from `pedstumble.js` to the bible's name), `peds.js`. Everyone has 50 health; a hit takes off km/h minus 10. At 50 km/h or less they tumble on the ten-point rope, lie dazed and get up, as before. Over 50, or at zero health, they stay down: `ped:down`, the lying pose, no birds, until an ambulance takes them, 45 s out of view, or 120 s. A blast throws everyone within 6 m and puts the near ones down.
6. **The ambulance.** `src/vehicles/ambulance.mod.js`. A white Pompano with a red and white bar and a wailing siren. Called 5 s after someone goes down, it starts 150 to 260 m away, follows the roads, brakes for cars in front, pulls out round one that is standing still, stops within 8 m, spends 6 s on each person (up to three within 15 m), takes them away and drives off towards Bayhaven General. In the check it was on the scene 27.5 s after the hit, 7.4 m from the person.
7. **Effects.** `src/gfx/fx.js`, `fx-debris.js`, `fx-recipes.js`. The pooled debris family: one instanced mesh of boxes with spin and bounce, capped at 40, 80 and 120 by quality, oldest used again. The smoke family now carries colour, size, gravity and glow, so it also draws flame, mist and the fireball; the sparks family draws embers, glass and water drops. `fx.emit(id, …)` runs the bible's recipes: `engine-smoke`, `engine-fire`, `column`, `explosion`, `glass`, `prop-bits`, `geyser`, `landing`. All effects are four draw calls (three before).
8. **Sounds.** `src/vehicles/mayhem-sound.mod.js`, from the sound bible's recipes: glass (25), the hydrant's burst and the geyser's loop (27), splinter (28), clatter (29), thud (30), the explosion (55) with its crackle of falling debris and a 4 dB duck on the music, and the ambulance's wail (40). By distance, silent past 150 m.
9. **Events.** `vehicle:destroyed` (and `vehicle:blast` with the same data), `vehicle:damaged`, `panel:fell`, `driver:bailed`, `ped:down`, `ped:collected`, `traffic:ambulance`, `geyser:start`, `geyser:end`. Repair is free at the spawn: a reset puts health at 100 and every panel back.
10. The finish-early hook: `fx.steamHook(puff)` is handed every new tyre puff and does nothing yet; wet-road steam goes there. Scratches as darker paint: on traffic cars only (see below).
11. One art request: `art/requests/sfx-explosion.json`.

**Not shipped**

- **Traffic cars have no panels.** The bible swaps a damaged traffic car for a hero build (3 on `low`, 6 on `high`). That swap is not built. A traffic car shows damage as darker paint in four steps, and throws a box into the debris pool where a panel would have fallen, but its own shape does not change.
- **A fallen panel leaves a dark patch, not a hole.** The player's body is still one baked mesh; the panels are slabs laid over it. With the hood gone you see a dark slab, not an engine.
- **Smoke and fire do not slow the car.** Top speed × 0.9 and pull × 0.85 while smoking, and the wandering steering while burning, are not in.
- **The player inside a blast** is hurt only if the combat module (D5-S4, running beside this session) is there: `modules.combat.damagePlayer` is called if it exists. I could not test that path.
- **Only the player's car breaks props.** Traffic, police cars and the ambulance drive through the new furniture without touching it, as they already did with lamps. The geyser lifts only the player's car.
- **Palms are found by their collision box**: any 0.6 m square, 1 m tall solid counts as a palm trunk. Every such box on the map today is one.
- **The ambulance has no medics and no Sheriff car behind it**, and traffic does not pull over for it. People are simply taken after 6 s each. It is moved along its route by its own module, not by the traffic driver; if you ram it hard it becomes an ordinary loose Pompano and the call is dropped. It still runs in a hurricane.
- **A person who is down does not grey out** and keeps the normal shadow. Nobody kneels to help.
- **The mayhem sounds are a stand-in** in the vehicles folder, because the Sound lane has no `audio.sfx` yet. The audio module still plays its own lamp clang for any `prop:broken` it does not know, so a fence or a table also clangs. Explosions do not muffle the effects bus.
- Not built from the bible's effect list: the `bits`, `glow` and `beams` families and the 16-cell atlas (glass and drops are sparks, the flash is a smoke quad), smoke trails behind debris, bursts spread over frames, typed-array particles. Umbrellas do not fly off in wind (there is no wind yet). Tyres bursting on spike strips was D5-S2's.
- A damaged traffic car that the player takes starts again at 100.
- **Police vehicles and the helicopter have no health.** They are not traffic cars, so the damage module does not see them: a cruiser can be rammed for ever and is not hurt by a blast.

### D5-S4 · Combat

**Shipped**

1. **Health and armour.** `src/systems/health.mod.js`. Health 100, armour 100 (a life vest, from the first pickup spot). A weapon in someone's hands does half its number to the player; the vest takes 80% of a ranged hit. After 6 s without a hit health creeps back to 30. The bars sit over the quick bar and show only when not full.
2. **Seven weapons, three slots.** `src/content/weapons.js`, `src/actors/combat.mod.js`. Fists 12 (the third hit of the combo knocks down), pool noodle 8 (never takes the last point, makes people film, goes "bop"), lawn flamingo 25 (knocks down, snaps after 10 hits into pink chips), pistol 18 (12 rounds, 1.4 s), SMG 9 (30 rounds, 12 a second, spread opens from 2 to 7 degrees), shotgun 60 at 5 m to 10 at 20 m (eight rays, 6 shells loaded one at a time), flare gun 5 (burns 6 s, people film it). A bar of three pills: hand, sidearm, long.
3. **Aiming.** Hold aim to lock the nearest threat in view by the bible's score; without a lock a round goes where the camera looks (free aim). Right mouse and left mouse, L and Ctrl, triggers on a pad, `Lock` and `Fire` buttons on touch.
4. **Enemies.** `src/actors/combat-guards.js`. Guards (60 health) and crew (50) with a pistol: post, call out (a subtitle, and allies within 30 m turn hostile), engage in bursts of two or three, run to the far side of a car within 15 m and lean out to fire, search when they lose you, run when alone under 60% health. They hold fire with a bystander in the line. At zero they lie down for good and drop the pistol.
5. **Bystanders.** 50 health. They run from any shot within 60 m (not from a swing). Hurting one is the crime `hurt`, putting one down is `kill`; both go to the heat system.
6. **Knocked out.** `src/ui/weapons.mod.js`. The view tilts 12 degrees and drains of colour, a hospital wristband slides in with the name, a bar code and the bill: 5% of cash, $2,500 at most. Heat clears, weapons are kept, and you wake on foot with 50 health at the hospital point.
7. **Deputies.** A deputy's round that lands (9) now comes off health through the same system; from heat 3 the lock takes them, they have 80 health and a 40 vest, and one put down stays down (`deputy-down`).
8. **Events and pickups.** `weapon:fired`, `player:knockedout`, `player:woke`, `player:hurt`, `combat:hit`, `combat:down`, `combat:lock`. Three cyan-posted spots by the spawn, on the minimap: noodle, flare gun and life vest; flamingo and pistol; SMG and shotgun. They refill after a minute.
9. **Finish early:** the flare sets off a fireworks crate (one stands by the third spot); the noodle's bop.
10. **Blood setting.** Settings, `Blood`: on, a hit throws three to five small red quads and a person who is down leaves one dark patch for 20 s (not on `low`); off, grey dust and no patch.

**Not shipped**

- **The hospital is a stand-in.** Bayhaven General is at `(-500, -1700)` and Northgate is not built, so you wake at the kerb nearest that point inside today's map, about `(-500, -1406)`.
- **The bible and the catalogue disagree** on health and ranges (a guard has 60 in one and 100 in the other). I followed `systems/combat-stealth.md`, whose checks say four pistol hits put a guard down; the SMG is in the long slot as that file has it.
- **The player's rig has no aiming or punching pose.** The weapon is drawn at his hand and lifts when he aims; his arm does not move.
- **Cover is cars only.** Guards do not use walls or props, do not patrol, and are not hit by vehicles. The stealth half of the bible (view cones, the bar) is D7-S3.
- **Not built:** firing from a vehicle, the head box, rounds through doors, a round bursting a tyre, health lost to a car hitting the player on foot or to a fall, food, tactical officers' own weapons, Q and E for the next target (they are the radio's keys; G does it).
- **On a pad the triggers still walk on foot**, because `src/core/input.js` adds gas and brake to the walk. That file is not mine; it is in the contract note for core.
- **The fight's HUD is page elements**, not the HUD canvas, so a saved photo would not include the quick bar.
- **Heat rose only to 1** after a killing nobody from the Sheriff saw; that is the heat system's rule for unseen crimes, not changed here.
- **Sounds are a stand-in** (`combat-sound.js`) until the Sound lane has `audio.sfx`.
- Small edits outside my four files, all in my lanes' folders: `cops.mod.js` and `cops-draw.js` (a deputy who is down), `heat.mod.js` and `pedsreact.js` (a swing is not gunfire), `menus.mod.js` (the Blood switch).
- No art requests this session.

## Day 4: Downtown (day 4 headline)

### D4-S1 · Downtown (day 4 headline)

**Shipped**

1. **The Meridian grid.** `zones/meridian.js`: 1.6 by 1.1 km behind the beach, 19 named north-south streets and 14 east-west, every fourth line an avenue (8 avenues, 22 m), and **Coral Boulevard**, 30 m with a palm median, from the beach to the Spire. North of Tower Way the same line is Kapok Street. The beachfront's streets now run on into downtown: the barriers that closed them between x -800 and 800 are gone. Lights stand at every crossing of two big roads (18 of them).
2. **Five tower recipes.** `gen/meridian.js`: M1 slab, M2 stepped (setbacks at 40%, 70% and 90%), M3 twin shafts on a podium, M4 curved corner (a 12 m curve in six segments), M5 tower with an open plaza (planters, benches, flagpoles, a box sculpture, a helipad on one in five). 317 towers in four neighbourhoods at the bible's heights: Bayfront 50 to 100 m, The Exchange 120 to 220 m, Radio Row 22 to 60 m with two at 106 m, Uptown 16 to 120 m. Pale glass and pastel concrete, and exactly one coral tower: First Bayhaven Savings, 184 m, at (96, -636). At street level: lobby and shop glass, a door under a canopy, a name board, awnings on the twin podiums, colonnades on the stepped towers, a clock on the curved corners, crown neon.
3. **Window walls.** One 1024 x 1024 window-grid canvas (`gfx/windowgrid.js`), read by one material. About 30% of panes are lit, in day 1's warm, cyan and pink. Towers light floor by floor at dusk: measured, the lit line is at 15 m at 18:36, 61 m at 18:48, 119 m at 19:00, 187 m at 19:18, and at the top of the Spire (260 m) at night. The same walls are used near, in the far shells and in the skyline, so a tower is the same tower at every distance.
4. **The Meridian Spire** at (52, -900), 260 m: a 60 m podium, 22 boxes each turned 4 degrees more than the one below, tapering from 40 m to 16 m, a dark band at every joint (white at night), penthouse, lantern, mast, and a pink light on top that pulses every 2 s and is never lost in the fog. Also the plaza, its palms, the service dock on Tower Way and the scaffold on the north face.
5. **City Hall** at (-200, -560): the hall, twelve columns, steps, a drum and an eight-sided dome to 38 m, and the fountain at (-212, -540) with its jet, cyan at night. Cypress Street is closed across the plaza.
6. **The skyline** is now built from the real map: every tower over 30 m (288 of them) and both landmarks, 7,114 triangles (budget 20,000). The made-up downtown from day 2 is gone.
7. **Bayhaven Tomorrow billboards** ("Bayhaven Tomorrow / Now Leasing The Sky") from the sign atlas, on the strip where downtown meets the beachfront, two of them flanking the foot of the boulevard. The sign sheet grew by eight cells.
8. **The clip.** `?clip=day-4`: dusk, 13 s up Coral Boulevard from the beach end, 304 m, ending at 119 km/h, the towers lighting (the lit line climbs from about 25 m to about 165 m) and the Spire dead ahead.

Also: Bayfront Park is a lawn with palms (its landmark is tier B), kept clear of towers.

**Not shipped**

- **Nothing from the "if you finish early" list:** no Twin Sails or skybridge, no rooftop water tanks. (Helipads are on some M5 towers because the recipe asks for them.)
- **Spire Circle is not a roundabout.** Traffic drives straight through junctions, so an island in the middle would be driven through. The ring of eight palms stands on a half-round lawn on the plaza side instead, and the junction is a plain T.
- **The radio flip in the roadmap's clip line** belongs to session D4-S2.
- **D4.1's other three districts** (Palma Vieja, The Paintworks, Rustwater) are session D4-S3's. My D4.1 checks Meridian only.
- Tier B and C pieces in the bible file were not in scope: the M6 to M9 recipes (their share is M1, as the bible says), the Thermometer's lamp strip, the Spire's cleaning cradle and guards, Baylink, the other landmarks, shop doors, vignettes, sound.
- No art requests were made.

### D4-S2 · Radio

**Shipped**

1. **The mixer.** `src/audio/engine.js`: master, then music (-10 dB), effects (-6), ambience (-14), voice (-8) and UI (-12). Ducks are gain ramps, and two at once use the deeper one. The master ends in a soft limiter (a hard compressor at -3 dB, then tanh to 0.98). Day 1's engine, squeal, hits and horn now go to the effects bus, wind and surf to ambience, trimmed so they are as loud as before. The pause card takes every bus but UI to -60 dB. `0` mutes.
2. **The synth.** `src/audio/synth.js`: the ten on the list (kick, snare, clap, hats closed and open, 808 bass, saw bass, lead, pad, pluck, bell) and thirteen small ones the three stations' recipes call for (tom, marimba, piano, brass, cowbell, clave, rim, conga, güiro, riser, sub drop, foghorn), 23 patches. A plate reverb and a tempo delay built from delay nodes only. The oldest voice is stolen at the cap.
3. **The sequencer.** `src/audio/music.js`: 16 steps a bar, scheduled ahead on the audio clock by a 25 ms timer, never by the frame loop. A song is a tempo, key, scale, chord loop, pattern strings and a form. Each song has two more melodies made from its seed (an answer for the chorus, a fill for the verse), fixed once and the same for everyone.
4. **Three stations, three songs each,** as content files the radio finds by itself, from the bible's songbooks: Tideline 98 (gated pad, glass arp, long-tail snare; 98 to 112 bpm), Radio Palma (two dembow songs and one salsa at 180 with clave, bell, congas, güiro and a piano montuno), Bassline FM (two half-time 808 songs with sliding bass and hat rolls, one club song with a riser). Nine songs, 85 to 133 s each, the largest 661 bytes as data.
5. **Talk.** Six host lines and two idents per station and a shared pool of 12 ads (the six samples word for word, six more from the bible), each station running 10 or 11. Lines are spoken as blips, one per syllable, in each speaker's own voice (Nina a low sine that falls at the end of a sentence, Memo a quick triangle that rises, Subtropic a sub with an echo, an announcer, Larry, Kiki), paced to the ticker at 14 characters a second, with the music ducked 6 dB under them. Lines know when they may play (night, day, the 15:15 rain, after an ad).
6. **The radio.** `src/audio/radio.mod.js`: in vehicles only. Tuning in speaks the ident at once; then song, song, and over the next song's held intro the host, an ad between two marimba stings, and the ident. Q and E, the d-pad and the pill change station, with a breath of static. The lead's choice is kept in `state.chars.<lead>.radio`, which the save already carries; before any choice a vehicle opens on its own class's station. Step out and it is muffled beside the car and gone past 20 m. Emits `radio:station`, `radio:song`, `radio:line`, `radio:off`.
7. **The radio pill.** `src/ui/radio.mod.js`: station and song in the HUD's radio slot, and the ticker that scrolls each spoken line. On a desktop it comes up for 4 s on a change and stays while someone talks; on a phone it is always there in a vehicle. Tap or swipe to change station.
8. **The day's drop: Rooftop Launch Party.** A stage on a Meridian roof by the beach end of Coral Boulevard: a truss of twelve lamps whose colours step on every beat and six beams that sway on the bar and flash on every kick of whatever the radio is playing (its own clock at 104 bpm when the radio is off). Three draw calls, 336 triangles, day 4 only.

**Not shipped**

- **The ramp to the rooftop.** Vehicles and people follow flat ground only (`world.heightAt`), so nothing can climb yet. The party is seen from the street; you cannot stand on it.
- **The radio flip in the day 4 clip** (Tideline 98 to Bassline FM as the neon comes on). The clip file is outside my lane. `modules.radio.tune('bassline')` is there for it.
- **The Sheriff's show at heat 4,** so the `cut` and `back` host lines are written but never play. That is one of the six lines on Tideline 98 and on Radio Palma and two on Bassline FM.
- **Nothing from the "if you finish early" list:** no fourth songs, no ident melody.
- Tier B: segments, songs 4 to 6, lines 7 to 20, doorway radios, shops playing stations, the plate rattle, the phone's low-pass, the browser-speech setting. `audio.sfx` and `loop` are still to come.
- No art requests were made.

### D4-S3 · Port, Palma Vieja and Paintworks

**Shipped**

1. **The mural painter.** `src/gfx/murals.js`: `mural(seed, palette)` paints a square cell on one canvas sheet and hands back its UVs. Twelve shapes (disc, half disc, wave, bird, fish, hand, frond, eye, flamingo, dots, zigzag, and slanted bands), five layouts (hero, parade, collage, horizon, split), an outline in ink or white, speckle, a three-shape tag, and paint drips for The Paintworks. The same seed and palette always give the same picture. The sheet also holds 16 hand-painted sign boards (`board(text, colour)`): crooked letters with an ink shadow over two brush stripes. Murals and boards are one unlit mesh a chunk and dim to half at night.
2. **Palma Vieja.** Zone and generator. 1,500 and more shop-house lots in mango, turquoise, rose and lime, two or three floors, no two neighbours the same colour; each block is cut by an alley into two rows. A house has a tiled strip along its roof edge, a striped awning, folding doors, shuttered windows, a balcony rail, two chairs, and on seven in ten a hand-painted board. Some corner houses carry a mural on their bare side wall. Strings of twelve bulbs hang across the streets: six strings to 100 m in La Plaza and Calle Mural, two in Los Patios, one in El Bajo. All 15 north-south and 14 east-west roads carry the bible's names and join downtown's and the beachfront's streets with no barrier.
3. **Domino Park and the bell tower.** The park: paving, a low wall with four gates, twelve shade trees with bulbs between them, a tin pergola over eight tables with stools and a lamp each, Rafa's table under the largest tree with a rose parasol, the chalk board. Calle Mamey is closed across it. The church: a white nave under a tiled roof and a 34 m tower with three mango bands, an open top round a yellow bell, a tiled cap, warm light inside at night.
4. **Rustwater.** Zone and generator. Container stacks one to five high in exactly six colours, drawn as instances (one draw call a chunk), in the two container yards and on kit blocks; transit sheds with a yellow and black hazard band and four dock doors; the port railway along z = -277 with six sidings and flat wagons in the rail yard; 18 m sodium masts with four heads in `#ff9a3c` and no ordinary street lamps anywhere in the district. The quay is land to x = 3024 and z = 130 and water past it (`map.isLand`, `heightAt`, `depthAt`, `surfaceAt`), with a low solid edge and bollards.
5. **The cranes, the ships.** Four gantry cranes at z = -450, -350, -250 and -150: yellow legs, a sill beam at 14 m that Breakwater Road runs under, a 200 m boom at 56 m, an A-frame to 70 m, a red light on top. The container ship Slack Tide lies under them with boxes four high on deck. The cruise terminal: a white hall under a wave canopy with flagpoles and gangways, and the white ship Early Supper with six stepped decks, lifeboats and a pink funnel to 52 m.
6. **The Paintworks.** Zone and generator. Brick warehouses (two or three 5 m floors, sawtooth or flat roofs, steel windows, a loading door, a steel stair, bins), metal sheds, container bars (bright boxes stacked two and three high, a counter with stools, a neon arrow, bulbs over the court) and rooftop clubs (a truss with eight lamps and eight beams of violet and mint light that swing after dark). Every warehouse, shed and club has at least one wall that is a mural from edge to edge. Wet Paint Alley is closed to cars; Container Row hangs bulbs across its streets.
7. **The old paint factory.** A brick hall under a six-tooth roof with murals on two walls, and three eight-sided chimneys at z = -885: 62 m tipped pink, 54 m tipped cyan, 46 m tipped mint, each with six drips of paint running down the brick and a glow at the top after dark. Four pigment vats, a loading dock, a ladder to a platform at 40 m.
8. **Mixes.** Each of the three zone files carries the bible's day band for traffic and people (`traffic`, `peds`); Palma Vieja and The Paintworks also carry the night band (`night`).
9. **Skyline.** The four cranes, both ships, the terminal hall, the three chimneys with the factory hall, and the bell tower are drawn in the far skyline mesh from the same outline code as up close. The skyline is 8,048 triangles of a 20,000 budget.

**Not shipped**

- **Nothing from the "if you finish early" list:** no scrapyard with a crusher, no Mercado. The scrapyard, the tank farm and the shipyard are flat fenced yards with masts.
- **Tier B recipes.** Palma Vieja builds only P1, the shop-house (P2 to P6 are shop-houses at their neighbourhood's frontage). The Paintworks builds W1, W2, W4 and W5 (W3, W6, W7 are brick warehouses). Rustwater builds R1 and R2.
- **Palma Vieja's mural wall and Ventanita Rosa** (both tier A in the bible, neither on this session's list). The coffee window is in `places` only.
- **The link roads from the beachfront to the port.** The bible leaves the strip x 1600 to 1800 south of z = -320 to no district, so Gunwale Road and Driftwood Street start at Bollard Street and the beachfront's streets still end at barriers at x = 1600. The way to the port is Flamingo Avenue.
- Fairlead Road, level-crossing arms, the yard engine, moving crane trolleys, bay numbers and every stencilled port sign.
- **The dawn and golden bands** of the mixes: nothing reads the clock for them yet.
- No art requests were made.

### D4-S4 · Minimap and map

**Shipped**

1. **The minimap.** `src/ui/minimap.mod.js`. A rounded rectangle in the HUD's `minimap` place, bottom left: 133 px at 960 x 540, 120 px on a phone. Up is the car's heading (the camera's on foot); the player's arrow sits at 60% of the height. It shows 300 m across, or 520 m above 60 km/h. It is painted ten times a second on its own canvas and copied onto the HUD canvas each frame, so photos and clips include it.
2. **Map tiles.** `src/ui/maptiles.js`. One 64 px canvas per 160 m chunk, drawn the first time it is needed from `map.surfaceAt`, `map.depthAt`, `map.lotsInChunk` and `map.roadsInChunk`, then reused by both the minimap and the map screen. A chunk that is all sea or all bare land needs no canvas. At most 400 are kept.
3. **The blip registry.** `minimap.addBlip({ id, x, z, icon, colour, pulse, edge, label })`, `moveBlip`, `removeBlip`. Fourteen icons, each its own shape as well as its own colour: `player waypoint mission drop house wrench clothes umbrella carwash food marina taxi landmark dot`. Waypoint, mission and drop blips wait on the rim when they are off the map. Every `map.places()` entry is a blip from the start.
4. **The map screen.** `src/ui/mapscreen.mod.js`. M opens and closes it, and the pause card has a Map row. Drag to pan, wheel, pinch or the round buttons to zoom (0.3 to 4 px a metre), tap to set a waypoint, tap the pin to clear it. District names, landmark icons, every blip, the route, and a line that says how far the waypoint is by road.
5. **Mute moved from M to 0.** `src/core/input.js` no longer maps M to the press `mute`; the audio lane already listened for 0.
6. **GPS.** `src/systems/gps.mod.js`. A* over every junction of the road graph, cost length over speed limit, built once at load so a route can cross districts that are not loaded. The route is drawn on the minimap and the map screen in cyan on an ink edge, and on the road as up to 24 faint chevrons. Four times a second the part behind you is dropped; more than 35 m off it, a new route is found. Within 22 m it clears with "You have arrived". Emits `waypoint:set` and `waypoint:cleared`.
7. **Unexplored districts.** A district is drawn faint on both maps until `district:entered` fires for it. The set is in the save (section `map`).
8. **The day's drop** is the blip `drop` whenever `modules.drops.active.marker` is `{ x, z }`. A mission adds its marker the same way, with `icon: 'mission'`.
9. **Both extras:** a distance pill on the minimap while a waypoint is set, and an N tab that rides the rim.

**Not shipped**

- No mission markers exist yet, so the `mission` icon is only exercised by the check.
- Landmark icons are one shape for every landmark; no per-landmark drawings.
- No art requests were made.

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

### D3-S3 · Garage (eight more vehicles, two wheels, a hop, a bus that shoves, and stealing a car with someone in it)

**Shipped**

Bayhaven's road fleet went from five models and a cab to thirteen and a cab. All eight new ones drive, park, turn up in traffic and can be taken.

1. **Eight models** (`src/content/vehicles.js` holds the sheets as data, `models.js` builds them): Wahoo (muscle, two accent stripes down the hood, a scoop, side pipes), Sailfin (sports, the sail and a wing in the accent), Grouper (SUV, grey cladding, roof rails, a spare on the back), Manatee (city bus, 11.5 m, cream body, mango band, two kerb-side doors, twin rear wheels), Pinfish (scooter), Needlefish (motorcycle, tank and tail in the accent), Birdie (golf cart, canopy on four posts, two golf bags) and Flounder (lowrider, cream roof and skirts, a sun visor). Sizes, pieces, the six factory paints and stripe heights are the catalogue's. Handling rows are the bible's: drive, grip caps, pull.
2. **Two wheels** (`handling.js`, `vehicle.js`, `fleet.js`). `lean = clamp(atan(vf × w / 9.81) × 0.9, ±0.75)`, drawn as roll with the wheels and the rider. The rider is eight boxes on the seat with hands on the bars; the shirt takes the stripe colour. A hit that changes speed by 5 m/s (7 on the Needlefish), or 0.4 s at over 0.9 rad of slip above 40 km/h, throws the rider: `rider:thrown`, the rider tumbles ahead for 1.2 s while the bike lies down and slides to rest at 8 m/s², then they are back on. Traffic scooters lean through their turns too, and have riders; a parked one has none and rests on its stand.
3. **The Flounder hops** on `special` (Shift in a car): 4.2 m/s up, 0.53 m at the top, 0.48 s in the air, 0.6 s before the next. Hold left or right for a side hop, gas or brake to tip an end. `vehicle:hop` fires. **The Birdie** is 1.2 m wide with collision circles sized to it (so it fits where a car will not), has one gear, and its engine is 0.4 of a car's level. **The Manatee** wakes and shoves any car it leans on at over 0.4 m/s (other cars need a real hit), and at 9 tonnes barely slows.
4. **Engines and horns by class** (`voice.js`, recipes in `src/content/vehicles.js`): eleven recipes across the fourteen ids. Waveform A, a second oscillator at its own ratio and gain, a sine sub on big engines, a low-pass that opens with revs, a level, the idle lope on the Wahoo and Flounder, a high-pass on the scooter, no gears on the cart. Each model has its own two horn notes: fast a fourth, trucks a fifth, the bus an octave (F2 and F3), two wheels a major second, the cart a minor second. Other drivers' horns are now heard: `traffic:honk` plays that model's horn, quieter with distance.
5. **Taking a car from traffic** (`theft.mod.js`). A driver brakes for Teo standing in the road, and stays put while he is at their door. When he gets in, the driver gets out the far side as a person on the street, says one of the bible's 21 lines in a subtitle ("At least leave the beach towels!") and walks off along the sidewalk. Emits `crime { kind: 'cartheft', case: 'carjack', seen, witnesses, x, z, model }`, `vehicle:taken` and `ui:toast`.
6. **District mixes**. A zone file's own `traffic` row is used as it stands (Tideline: scooters 4, buses 1, Sailfins, Groupers). A district with no zone file yet falls back to the bible's row for it (`DISTRICT_MIX`: Meridian gets buses and cabs, Mallard Greens gets carts, Palma Vieja gets lowriders, The Paintworks changes at night). Before this, a zone without a row gave every model the same weight.
7. **Lights as separate pieces on every model**. The player's build has three unlit meshes: headlights (one on two wheels), a tail strip that brightens under braking, and four amber corner indicators (new) that blink at 1.5 Hz on the side being steered to under 50 km/h and are dull amber otherwise. Traffic draws the same pieces as instances, sized per model. Parked one-mesh cars carry the dull indicators too.

Also: `test.ride()`, `test.traffic.mix()`, `test.traffic.models()`, `test.cartheft()`, `test.engineTone()`, `test.carvoice()`; a wheel list per model (two, or four with a width each, so twin rears are one wide wheel).

**Not shipped**

- **"If you finish early"**: neither. No random two-tone paint, no Sheriff or ambulance models.
- **The Sound lane still plays the Heron's engine and horn under everything.** Engines live in `src/audio`, which I do not own. My class voice plays on top for every model not on the coupe recipe, so a scooter is a buzz over a quiet low hum, and the Birdie is not "nearly silent" to the ear: its own voice is at 0.4, the Heron hum under it is not. The player's horn is still the Heron's two notes for every model; the per-model notes are in `modules.vehicles.sounds` and are only heard from other drivers. Fix: the Sound lane reads `modules.vehicles.sounds[car.model]`, then `voice.js` and `voice.mod.js` are deleted.
- **A thrown rider is drawn, not played.** Teo is not put on foot, nothing takes health (the event carries `damage` for whoever owns it), and after 1.2 s the rider is simply back on the seat.
- **Sidewalks**: nothing stopped any car from mounting one before, and nothing does now. "Fits on sidewalks" is the Birdie's width, its small collision circles and a `sidewalk` flag on its preset; people do not step aside for it any differently than for a car.
- **Hop extras**: a hop does not clear spike strips (there are none) and three hops in 2 s do not count as interesting to people filming.
- **Two-tone paint by rule**: the Flounder's roof and skirts are cream on every paint, not "a second factory colour".
- **Traffic lights and indicators**: traffic cars show indicators only while signalling (lit); unlit ones are not drawn, to save instances.
- The Wahoo, Needlefish, Birdie and Flounder are in no built district's moving mix (their districts have no zone file yet). They are reachable as parked cars (not the Birdie) and through the test API.
- No art requests were made.

### D3-S4 · HUD and controls (the stream overlay, the wordmark, a pause menu, touch layouts)

**Shipped**

1. **The HUD is one canvas** (`src/ui/hud.mod.js`, `hud-layout.js`, `hud-draw.js`). `#hud` sits over the game canvas at CSS size × `min(devicePixelRatio, 2)` and lets touches through. Fourteen pieces, each with its own rectangle: cash pill (mango chip with a `$`), followers pill (`212`, `12.8K`, `1.25M`), clock pill, LIVE pill (pink, from heat 3, with the viewer count and a blinking dot), five siren lights (pink and cyan, swapping every 400 ms, every 200 ms from heat 3), speed with the vehicle's name (`86 km/h · Heron`, hidden on foot), the day badge (`Bayhaven · Day 3 build`), the drop's line, the drift score, prompt, hint, toasts, a spoken line, and the luggage tag. Places are held for the minimap and the radio pill; nothing is drawn in them.
   A piece is wiped and repainted only when its value changes or while it moves, and may paint only inside its own wiped box. In two idle seconds at most 2 pieces are repainted (the check's limit; frames keep being drawn).
2. **Three placements**: desktop, a phone held sideways with touch, and a phone held upright. Sizes slide between the bible's phone and 1920×1080 numbers. Safe-area insets are added to every edge.
3. **The wordmark** (`wordmark.js`): "Bayhaven" from straight strokes and circle arcs, one stroke weight, slanted forward, the `y`'s tail running on as a wave under the rest of the word; pink over a cyan offset copy. No font. `modules.hud.wordmark(height)` hands out the canvas. It heads the pause card.
4. **Prompts, hints, toasts** on `ui:prompt`, `ui:hint`, `ui:hint:done`, `ui:toast` (and `modules.ui.*`, the contract's API). A hint shows once per id and fades when its thing is done or after 8 s. Toasts: three at once on a desktop, one on a phone; they wait while the tag is down. `ui:toast { kind: 'subtitle' }` is drawn as a spoken line with the speaker's initial on a mango square, and hides the hint and prompt. `coach.mod.js` gives the first driving and walking hints and raises `F  Get in` beside a car.
5. **The luggage tag** on `district:entered`: sand tag with cut corners, a band in the district's colour, "Now entering", the district, the neighbourhood. Drops in 350 ms, swings by `14° × e^(-2.2t) × cos(6.9t)`, leaves upwards at 3 s.
6. **Pause menu** (`menus.mod.js`, page elements): Esc or the touch Pause button. Resume, Settings, Controls, Save. Settings: quality (auto, low, medium, high), master, music and effects volume, reduce motion, sprint as hold or tap-to-toggle. Controls lists what works today, for keys or touch. Time stops, the street blurs, arrow keys and Enter work. `menus.register()` lets other lanes add pages.
7. **Touch** (`touch.mod.js`): driving, on-foot and menu layouts, sideways and upright, at the bible's places: gas 84, brake 72, steer 72 beside the minimap, the rest 64. A Pause button, and Camera on foot. On foot the stick appears under the thumb anywhere in the lower left. Everything uses the safe-area insets.
8. **If you finish early, both**: `hud.clipMode(true)` hides hints, prompts, toasts and touch buttons and keeps the badge. Cash digits roll for 600 ms with a mint ring on a gain and a pink ring and shake on a loss; followers get a cyan ring on a jump of 50 and a pop when a thousand is crossed; a new siren light pops; LIVE drops in.

**Not shipped**

- **Volumes do nothing yet.** The sliders write `state.settings` and emit `settings:changed`, but sound lives in `src/audio`, which I do not own, and it does not listen. There is no voice-blip slider (the prompt asked for three volumes).
- **Reduce motion** is honoured by the HUD only (no swing, shake, pop or blink). The camera's shake and speed zoom belong to another lane.
- **Sprint toggle** works on the keyboard (Shift). Touch Sprint is still a hold; there is no aim to toggle yet.
- **No minimap, radio pill, chat, health bar, objective, timer or quick bar**: not in this prompt. Their sessions draw into `hud.layout()`'s rectangles.
- **`ui.card(spec)`** (postcard, wristband, mugshot board) is not built.
- **The weekday** on the clock: state has none, so the pill shows the time only.
- **The `+$500` that rises from the cash pill** and the level name under the siren lights are not drawn.
- **The speaker's face** in a spoken line is their initial.
- Pause has no Map, Phone or Quit to title rows: those screens do not exist.
- **Phone and switch-lead touch buttons** exist but are hidden (`touch.enable(id, true)`), since neither feature exists.
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
