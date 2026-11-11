# Bible · systems · Wildlife

Nine kinds of animal live in Bayhaven, drawn as instanced box creatures with very small brains: rest, notice you, move away, come back. The rest of the game is lethal; this part is not. No animal can be hurt by anything, ever. This file lists each species, the shared state machine, flocks, the cold-morning iguanas and Gerald, who is a pelican and a member of the cast.

Tier: B (alligators, pelicans, gulls, herons, iguanas, the flamingo flock and Gerald on his post: bonus session B-09). C for manatees, dolphins, raccoons and Gerald sightings.

## Purpose

Make the swamp, the shore and the suburbs pass the "alive in ten seconds" test where there are few cars and people.
Do it for one draw call.

## Data

Owner: `src/actors/wildlife.mod.js`.

### Species

| Species | Where | When | How it moves | Near the player | Boxes | Most at once, `high` / `low` | Tier |
|---|---|---|---|---|---|---|---|
| Alligator | banks and channels in Mudcat Glades, golf ponds, and one very large one in Lake Serenity `(-2700, -1900)` | basks 08:00 to 17:00 in sun; in the water at night and in rain | walks 1.2 m/s, lunges 6 m/s for 2 m, swims 2.5 m/s | see "Alligators" below | 5 | 8 / 3 | B |
| Pelican | dock posts, pier rails, marinas, Pelican Rest, the Keys | daylight; roosts at night | perches; glides low over the water in lines of 3 to 5 at 12 m/s; folds and drops for a fish | lifts off at 5 m, circles, returns after 20 s | 4 | 8 / 3 | B |
| Gull | the beach, the pier, Northgate car parks | daylight | stands in groups of 5 to 12; the group lifts as one, wheels for 6 s and lands 20 to 40 m off | lifts at 8 m. Swoops once at anyone standing still for 5 s with food just bought: a gag that costs nothing | 2 | 24 / 8 | B |
| Heron | Heron Marsh, the edges of the Glades, golf ponds | dawn to dusk | stands still, fishing; stalks at 0.4 m/s; slow wingbeats | lifts at 10 m and lands 60 m along the shore | 4 | 4 / 2 | B |
| Iguana | Tideline palms and seawalls, Sandpiper hedges, the golf course, the roofs of parked cars | basks 09:00 to 17:00 | scuttles at 4 m/s to the nearest palm, hedge or drain | bolts at 4 m. On cold mornings, falls out of palms | 3 | 10 / 4 | B |
| Flamingo | one flock of 14 on a lawn at `(-950, 700)` on Sandpiper Isle; a second in the Lake Serenity shallows (C) | all day; sleeps standing | stands on one leg, preens, walks as a tight group at 0.8 m/s | at 7 m the flock walks away in step. At 3 m, or for any vehicle, a short run and a 30 m flight in formation back to the same lawn | 4 | 14 / 6 | B |
| Manatee | the west marina, the Cruise Basin, canals | all day | drifts at 0.5 m/s; surfaces every 20 s as a snout and a ripple | sinks 1.5 m when a hull is within 8 m. Buoys mark its zones: 10 km/h | 3 | 4 / 2 | C |
| Dolphin | open bay, more than 150 m from shore | daylight, most at dawn and dusk | pods of 3 to 5; an arcing jump every 4 to 8 s | rides the bow wave of a boat doing 30 to 70 km/h within 60 m, for up to 40 s | 3 | 5 / 3 | C |
| Raccoon | bins behind restaurants, Pelican Rest, Northgate car parks, Mallard Greens on bin day | 21:00 to 05:00 only | trots at 2 m/s, bolts at 5 m/s, tips bin lids | freezes for 1 s in headlights with glowing eyes, then bolts | 3 | 6 / 2 | C |

Across all species: 40 animals at once on `high`, 14 on `low`. The nearest habitats win.

### Rules that never bend

1. No animal has health, a hurt state, or a way to lie on the ground. The state list below is the whole list.
2. Nothing connects. Bullets and blasts pass through and only scare. Flying debris bounces off. Cars are stepped round, flown from, or lifted over.
3. Animals are never lock-on targets, never witnesses and never film anyone.
4. In a tropical storm or a hurricane there are none: birds roost out of sight and alligators stay under.
5. Only an alligator can touch the player, and it can never knock them out.

### Habitats and spawning

Each chunk carries habitat tags from the map: `shore`, `marsh`, `beach`, `dock`, `lawn`, `palm`, `openwater`, `canal`, `bins`. A species lists the tags it uses. Home spots come from `hash(worldSeed, cx, cz, species)`, so the heron by the seventh green is always by the seventh green. Animals are simulated and drawn within 120 m on `high` and 80 m on `low`, and only appear out of view or beyond 80 m.

### When they notice you

```js
r = species.alert * (inVehicle ? 2.4 : 1) * (sprinting ? 1.5 : 1);
if (shotWithin(60)) r = 60;                    // a shot or an explosion clears 60 m
if (dist < 1.5 * r) alert();
if (dist < r) moveAway();
// alert, metres: pelican 5, gull 8, heron 10, iguana 4, flamingo 7, raccoon 9, alligator 6, manatee 8 (hulls only)
```

Dolphins never flee. They come to you.

### Flocks

A flock is one object: a centre, a heading and a fixed offset per bird. No bird looks at its neighbours.

```js
centre += dir(heading) * speed * dt;           // after 6 s the heading turns toward the landing spot at 0.8 rad/s
bird.pos = centre + rotate(bird.offset, heading) + up * 0.4 * Math.sin(t * 3 + bird.phase);
bird.wing = Math.sin(t * flap + bird.phase);   // flap, rad/s: gull 9, flamingo 5, pelican 4, heron 2.5
```

### Alligators

| Situation | What the alligator does |
|---|---|
| Player on foot inside 9 m | lifts its head and hisses (a subtitle: "Hsss.") |
| Player on foot inside 2.5 m | lunges. The player is knocked back 2 m and loses 10 health, or nothing if they have 10 or less |
| A car inside 3 m, under 30 km/h | snaps at a tyre. No damage; the car loses 10% of its speed; `wildlife:snap` |
| A car over 30 km/h inside 15 m, or a shot | slides into the water and shows only its eyes for 30 s |
| A car drives straight over it | it flattens for 0.5 s; the car rides over as on a speed hump (`vy = 2.5`) and it hisses after you |
| It is on a road | traffic sees it in the 20 m cone, stops and honks |

The Lake Serenity alligator is 5 m long. The others are 2.5 to 3.5 m.

### Cold-morning iguanas

A morning is cold when the 04:00 band rolled clear the day after a tropical storm, or on one morning in ten by the day's seed. From 05:00 to 08:00, iguanas in palms within 60 m of the player drop one at a time, every 2 to 6 s, with a thud and `wildlife:iguanafall`. A fallen iguana lies stiff. It is a small solid prop: a car that touches it sends it sliding and spinning down the road like a puck, unharmed. At 08:30 they all blink, stand up and walk off. Local Man event 15 is this.

### Gerald

- A brown pelican with seven boxes (a bigger bill) and a pink band on one leg.
- **Home:** the post beside Mags's carport at Pelican Rest `(-1250, -220)`, 06:00 to 18:00. On the trailer roof at night. Inside the trailer in a storm.
- **He does not flee.** On his post he is a fixed circle of radius 0.4 m and cars slide round him. Nothing moves Gerald.
- **Feeding:** Mags only. With a fish in hand (bait from Bait & Ballistics or any catch from the pier), use the context button at the post. He tips his head back; `wildlife:fed`. If Teo tries, Gerald looks the other way.
- **After ten feeds** he follows Mags's car for one block whenever she leaves Pelican Rest, gliding 6 m up and 8 m behind.
- **Sightings (C):** the canon's 20 odd places. One is active each game day from 09:00 to 17:00, picked by `hash(saveSeed, day)`. He is there instead of on his post. A photo with him in frame ticks it off and he flies home. `@gerald.the.pelican` posts each one on Squawk. Someone else runs that account.
- **Local Man 20:** he sits on the roof of the player's car for 30 to 60 s. You may drive. He stays on, wings out above 40 km/h, and leaves when he is ready.
- The cutscene system places him in the first and last shots of the story.

### Instancing

- Every animal is boxes in one `InstancedMesh` of unit cubes with a colour per instance. Capacity 400 boxes on `high`, 150 on `low`. That is one draw call for all wildlife.
- Wings are thin boxes scaled by the flap. Blob shadows share the people's shadow mesh.
- Poses update every frame within 40 m and ten times a second beyond. A flock costs one update and one matrix per bird.
- Budget: 0.5 ms a frame on `high`, 0.4 ms on `low`, 4,800 triangles at most.

## States

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Rest | spawned, or back home | its idle: bask, perch, stand, float, preen | the player is inside 1.5 × `r`, or its hours end |
| Alert | player inside 1.5 × `r` | head up, turns to face the player | inside `r`, or 4 s after the player leaves |
| Move away | player inside `r`, or a shot | flies, slides into water, scuttles, sinks or walks off in step | reaches a safe spot 20 to 60 m off, or under water |
| Away | at the safe spot | waits there: 20 s for birds, 30 s for alligators | the timer ends and the player is beyond 2 × `r` |
| Return | the wait is over | goes back to its home spot | arrives |
| Special | a species trigger | snap or lunge, fall from a palm, dive for a fish, ride a bow wave, tip a bin | the act ends |

## Events

Emits: `wildlife:spooked { species, count }`, `wildlife:snap { x, z }`, `wildlife:fed { who }`, `wildlife:gerald { place }`, `wildlife:iguanafall { count }`.
Listens: `clock:hour`, `weather:changed`, `weapon:fired`, `vehicle:destroyed`, `chunk:loaded`, `chunk:unloaded`, `photo:taken`.
State: `state.wildlife = { count, gerald: { place, fed } }`.

## Edge cases

- A boat at speed over an alligator or a manatee passes straight over. They are already under.
- An animal found inside a building box after a chunk reload is put back on its home spot.
- The pink plastic lawn flamingos are things to find and belong to another system. They are never part of the flock.
- Photo mode freezes time; animals hold their pose and can be framed.
- If the species cap is full, a new habitat coming into range takes the place of the farthest animal that is out of view.
- A flock asked to land where the player is standing picks the next spot along.

## Low and high

| | `low` | `high` |
|---|---|---|
| Animals at once | 14 | 40 |
| Box capacity | 150 | 400 |
| Seen within | 80 m | 120 m |
| A gull group | 5 to 8 | 5 to 12, up to two groups |
| Splash and ripple puffs | 4 | 16 |

## Script checks

New test entries: `test.wildlife.list()` returns `[{ id, species, state, x, z }]`; `test.wildlife.stats()` returns `{ count, calls, boxes }`.

1. At Captain Nilda's dock `(1200, -3250)` at noon in clear weather on `high`: at least 2 alligators and 1 heron within 120 m, `calls` is 1 and `boxes` is 400 or fewer.
2. A Mullet driven at 20 km/h over a basking alligator: the alligator is still listed, in one of the six states, and the vehicle's health has not changed.
3. Walking at a gull group on the beach: every member is in `move away` by 8 m and in `rest` again within 60 s.
4. A pistol shot puts every animal within 60 m into `move away` inside 1 s, and `count` is the same 60 s later. Across the whole run no `combat:hit` names an animal.
5. At 12:00 the list holds `gerald` within 25 m of `(-1250, -220)`. Ramming his post at 40 km/h leaves his position unchanged.
6. `test.setWeather('hurricane')` brings `count` to 0 within 30 s. Back in `clear`, animals are present again within 120 s.

## New names

Events `wildlife:spooked`, `wildlife:snap`, `wildlife:fed`, `wildlife:gerald`, `wildlife:iguanafall` · state key `state.wildlife` · habitat tags `shore`, `marsh`, `beach`, `dock`, `lawn`, `palm`, `openwater`, `canal`, `bins` · test entries `test.wildlife.list()`, `test.wildlife.stats()`.
