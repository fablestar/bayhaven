# Bible · activities · Big Air

Fifty marked ramps, five in each district. Hit one, fly, and a slow-motion replay from a side camera plays as you land. This file gives every ramp's seed, launch heading, what it clears and its three medal distances, plus the ramp kits, the scoring, the replay and the checks.

Tier: A for ramps 1 to 15. B for ramps 16 to 30. C for ramps 31 to 50. Tier A ramps use only tier A landmarks, roads and props the ramp brings with it.

## How a ramp works

| Rule | Value |
|---|---|
| Data | `src/content/ramps.js`, one row per ramp: `{id, x, z, heading, kit, over, bronze, silver, gold}` |
| Marker | Painted chevrons on the ramp, a striped arch 4 m before it, and a wing blip on the minimap once you have been within 150 m |
| Launch | The vehicle crosses the ramp's lip inside a 5 m wide gate, travelling within 25° of the ramp's heading, at any speed |
| Distance | Flat distance from the lip to the first wheel (or hull) to touch down, in metres to one decimal. Taken from the `metres` of `jump:landed`. |
| A landing counts | The vehicle still has health above 0 two seconds after touching down. A car that explodes on landing scores nothing. Landing on its roof counts. Landing in water deeper than 0.8 m counts as bronze at most. |
| Medals | Bronze, silver and gold are the three distances in the table. Under bronze is "Short" and pays nothing. |
| Vehicles | Anything. Ramp 24 is 4 m wide and needs two wheels. Ramp 42 needs an airboat. |
| Heat | A ramp raises no heat by itself. What you land on might. |
| Events | `jump:landed {metres, airSeconds, x, z, clean}` from the vehicle code, then `collect:found {kind: 'bigair', id, district}` once the ramp's medal is counted |
| Save | `found.bigair` holds the ids landed at bronze or better. `stats.bigair[id]` holds the best distance and medal. |
| Test API | `test.bigair.list()`, `test.bigair.launch(id, speedKmh)` places the player's vehicle on the approach at that speed |

Headings are in degrees: 0 is north (towards `−z`), 90 is east (towards `+x`), 180 is south, towards the sea.

## Ramp kits

Each ramp is one of six shapes, built in code. The approach needs 60 m of clear run behind the seed; the placement check measures it.

| Kit | Name | Angle | Lip height | Length | Looks like |
|---|---|---|---|---|---|
| K1 | Tow bed | 14° | 1.2 m | 5 m | The tilted bed of a tow truck |
| K2 | Plywood | 18° | 1.6 m | 5 m | Storm Mart plywood on scaffold poles |
| K3 | Steps | 12° | 1.5 m | 7 m | Stairs, a slipway or a kerb that is already there, with chevrons painted on |
| K4 | Mound | 20° | 2.2 m | 6 m | A pile of sand, mud or builder's spoil |
| K5 | Hauler | 16° | 2.0 m | 7 m | The loading ramps of a car transporter |
| K6 | Kicker | 25° | 2.6 m | 6 m | A steel stunt ramp |

On flat ground a jump carries about `speed² × sin(2 × angle) ÷ 18` metres, with speed in m/s and gravity at the 18 m/s² in `04-systems.md`. Use it to tune medals after the handling is final.

| Speed | K1, 14° | K2, 18° | K4, 20° | K6, 25° |
|---|---|---|---|---|
| 100 km/h | 20 m | 25 m | 28 m | 33 m |
| 140 km/h | 39 m | 49 m | 54 m | 64 m |
| 170 km/h | 58 m | 73 m | 80 m | 95 m |
| 190 km/h | 73 m | 91 m | 99 m | 119 m |

## Scoring and rewards

| When | Reward |
|---|---|
| First landing at bronze or better on a ramp | $500, once per ramp |
| Every counted landing | Followers equal to `distance × 10`, doubled at silver, tripled at gold |
| First gold on a ramp | 1,000 followers more |
| The same ramp again within 60 s | Nothing. The crowd has seen it. |
| People filming | The usual `+5` per person per second from `04-systems.md` still applies, and the replay makes everyone within 40 m film |
| All of ramps 1 to 15 at bronze | The Big Air wrap for any car: a painted arc from the back wheel over the roof |
| All 50 at bronze | The Frequent Flyer jacket |
| All 50 at gold | A K6 kicker that the Garage app delivers to the nearest road for $50, to place where you like |

A result strip slides in under the LIVE pill, never across the middle of the screen: the distance, the medal, the cash and the followers. If heat is 3 or more, the jump also adds viewers as any stunt does.

## The replay

1. The vehicle code keeps the last 4 s of the player vehicle's position, heading, pitch and roll, 60 samples a second.
2. On `jump:landed` with a flight of 8 m or more from a ramp gate, the game freezes input for the replay and plays the stored samples from lip to landing.
3. The camera stands 12 m to one side of the midpoint of the flight, 3 m up, on the side that faces away from the nearest wall. It pans with the vehicle.
4. Playback speed is 0.35 until the wheels touch, then 1.0 for half a second.
5. Real length is capped at 3 s. Any key, button or tap skips it.
6. Under "reduce motion" the replay still plays, at 0.5 speed and with a fixed camera.
7. During a mission step or at heat 3 or more there is no replay. The live game keeps running and only the result strip shows.
8. On the phone quality level the replay shows the vehicle, the ramp and the ground only. Traffic and people are hidden for its length.

## The fifty ramps

| # | District | Seed | Heading | Kit | What you jump over | Bronze | Silver | Gold | Tier | Hint |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Tideline | `(318, -207)` | 270 | K2 | The queue of cars outside Park & Sons Auto | 15 | 25 | 35 | A | Wendell left the ramp down again. |
| 2 | Tideline | `(270, 60)` | 90 | K4 | The lifeguard hut at `x = 300`, off a sand mound | 14 | 22 | 30 | A | The lifeguard has seen everything but this. |
| 3 | Tideline | `(-1185, 72)` | 90 | K3 | The slipway and two boats on trailers at the west marina | 16 | 26 | 36 | A | A boat ramp is still a ramp. |
| 4 | Tideline | `(-1215, -240)` | 270 | K1 | Three trailers at Pelican Rest | 15 | 24 | 34 | A | Mind Gerald's post. |
| 5 | Meridian | `(64, -805)` | 0 | K2 | The island in the middle of Spire Circle | 25 | 40 | 55 | A | Straight on at the roundabout. |
| 6 | Meridian | `(-200, -575)` | 180 | K3 | Down City Hall's steps and over the fountain | 15 | 25 | 35 | A | The mayor calls it a water feature. |
| 7 | Meridian | `(64, -650)` | 0 | K5 | The Commerce Way junction, lights and all | 22 | 34 | 48 | A | Red means jump. |
| 8 | Palma Vieja | `(-1362, -852)` | 180 | K1 | Eight domino tables along the east side of Domino Park | 14 | 22 | 30 | A | Nobody at the tables looks up. |
| 9 | Palma Vieja | `(-1024, -720)` | 0 | K2 | A painter's scaffold on the mural wall | 20 | 32 | 44 | A | The scaffold is the ramp. The painter is at lunch. |
| 10 | The Paintworks | `(1270, -830)` | 90 | K2 | Three open vats of paint in the factory yard | 18 | 28 | 38 | A | Land short and the car comes out pink. |
| 11 | The Paintworks | `(1342, -766)` | 180 | K5 | A parked Hogfish and a wall of paint drums | 16 | 26 | 36 | A | The drums are empty. Mostly. |
| 12 | Rustwater | `(2880, -340)` | 180 | K5 | A line of containers on the quay under the cranes | 22 | 36 | 50 | A | Go when the crane is not lowering one. |
| 13 | Rustwater | `(2470, 80)` | 270 | K1 | A train of baggage carts outside the cruise terminal | 18 | 28 | 40 | A | Welcome to Bayhaven. Mind the luggage. |
| 14 | Northgate | `(-260, -1960)` | 270 | K2 | A trolley corral and eight parked cars at Galleria Flamingo | 20 | 32 | 44 | A | The car park is the attraction. |
| 15 | Mallard Greens | `(-2440, -2410)` | 315 | K4 | The hedge behind the 14th green, off a bunker lip | 15 | 25 | 35 | A | Why use the hole? |
| 16 | Tideline | `(606, 110)` | 0 | K1 | The entrance arch of Gullwing Pier, back onto Pier Road | 18 | 28 | 40 | B | Leave the pier the fast way. |
| 17 | Meridian | `(-330, -450)` | 270 | K4 | The bandstand in Bayfront Park | 18 | 30 | 42 | B | The band plays on. Usually. |
| 18 | Meridian | `(402, -770)` | 90 | K2 | The pool between the Twin Sails, under the skybridge | 20 | 32 | 44 | B | Under the bridge, over the water. |
| 19 | Palma Vieja | `(-1530, -800)` | 90 | K1 | The fruit stalls outside the Mercado | 18 | 28 | 40 | B | Fresh mango, briefly airborne. |
| 20 | Palma Vieja | `(-1675, -500)` | 270 | K2 | A van being loaded with Lava Abuela | 16 | 26 | 36 | B | Clear the van. Rafa counts the bottles. |
| 21 | Palma Vieja | `(-1420, -400)` | 90 | K5 | Five lowriders nose to tail, all hopping | 22 | 34 | 46 | B | Go when they are down. |
| 22 | The Paintworks | `(1480, -930)` | 270 | K5 | The lighting truck outside Humidity | 20 | 30 | 42 | B | On Friday the queue films it. |
| 23 | The Paintworks | `(970, -1120)` | 90 | K6 | Four food trucks in the middle of lunch | 24 | 36 | 48 | B | Do not spill the Pressed. |
| 24 | The Paintworks | `(1100, -640)` | 180 | K2 | A row of gallery signboards in Wet Paint Alley | 12 | 20 | 28 | B | The alley is 4 m wide. Bring a scooter. |
| 25 | Rustwater | `(2360, -730)` | 90 | K6 | The pipe rack between two beach-ball tanks | 20 | 32 | 46 | B | Thread it. The gap is 9 m. |
| 26 | Rustwater | `(2170, -1220)` | 90 | K4 | The crusher's conveyor at the scrapyard | 22 | 34 | 48 | B | Land before the crusher does. |
| 27 | Rustwater | `(2100, -610)` | 0 | K6 | A freight train of flat wagons at walking pace | 24 | 38 | 52 | B | Jump the train. Do not ride it. |
| 28 | Northgate | `(330, -2370)` | 0 | K2 | The snack bar in front of the Starlite's screen | 20 | 32 | 44 | B | On Tuesday the audience is doubled. |
| 29 | Northgate | `(70, -1765)` | 90 | K5 | The front row of Wahoo World and the tube man | 22 | 34 | 46 | B | Every car on the lot is now "lightly used". |
| 30 | Northgate | `(390, -1845)` | 90 | K1 | Lawyer Larry's own parked Sturgeon | 16 | 26 | 36 | B | He will sue. He will also represent you. |
| 31 | Northgate | `(-548, -2452)` | 270 | K6 | The Sinkhole, all 90 m of it, from the broken end of Billboard Road | 40 | 65 | 98 | C | Bring the fastest thing you own. |
| 32 | Mallard Greens | `(-870, -1890)` | 270 | K1 | The barrier arm and Bev's hut at the Gatehouse | 15 | 24 | 34 | C | Bev has seen worse. Bev has seen you. |
| 33 | Mallard Greens | `(-2640, -1900)` | 270 | K6 | A corner of Lake Serenity and its fountain | 30 | 45 | 60 | C | The alligator moves aside. He is used to it. |
| 34 | Mallard Greens | `(-1970, -2085)` | 270 | K2 | The clubhouse pool, the long way | 25 | 38 | 50 | C | The sign says no running. |
| 35 | Mallard Greens | `(-2960, -2480)` | 270 | K4 | Twelve mailboxes with no houses in Phase Four | 25 | 40 | 55 | C | The street ends. You need not. |
| 36 | Runway Flats | `(1900, -2462)` | 90 | K6 | A parked Low Altitude Airlines jet, off a stair truck | 50 | 80 | 110 | C | 1,800 m of run-up. Use it. |
| 37 | Runway Flats | `(2870, -1850)` | 90 | K3 | The catch fence on turn two of the Speedbowl, off the banking | 25 | 40 | 55 | C | Turn two was always optional. |
| 38 | Runway Flats | `(1070, -1770)` | 90 | K5 | Twelve rental Snooks on Rental Row | 28 | 42 | 56 | C | Return them full. Or at all. |
| 39 | Runway Flats | `(870, -2120)` | 90 | K2 | The roof of the Layover Diner, under the plane on the pole | 20 | 30 | 42 | C | Duck. |
| 40 | Runway Flats | `(2370, -2200)` | 90 | K5 | A crop duster inside an open hangar on Hangar Row | 30 | 44 | 58 | C | In one door, out the other. |
| 41 | Mudcat Glades | `(-388, -2980)` | 90 | K3 | Out of Big Earl's mouth, down his tongue, over the ticket hut | 20 | 32 | 44 | C | Thirty metres of alligator make a good tunnel. |
| 42 | Mudcat Glades | `(1230, -3270)` | 90 | K4 | A sawgrass island, by airboat | 15 | 25 | 35 | C | Nilda calls this a short cut. |
| 43 | Mudcat Glades | `(2000, -3012)` | 90 | K3 | A channel where the boardwalk bridge is out | 25 | 38 | 52 | C | Bridge out. Sign also out. |
| 44 | Mudcat Glades | `(-2030, -3215)` | 90 | K4 | The ticket booths of Castaway Kingdom, under the vines | 24 | 36 | 50 | C | The park is closed. The ramp is not. |
| 45 | Mudcat Glades | `(-2870, -3060)` | 270 | K2 | The dish trailer and its dish | 20 | 30 | 42 | C | Clear both or meet the owner. |
| 46 | The Islands | `(-1090, 425)` | 180 | K1 | The barrier at the island gatehouse | 16 | 26 | 36 | C | Residents only. You reside briefly. |
| 47 | The Islands | `(-1040, 765)` | 90 | K4 | Bellweather's helipad, helicopter included | 22 | 34 | 46 | C | He will bill you for the lawn. |
| 48 | The Islands | `(-1320, 600)` | 270 | K2 | A row of white tents at Glow Camp | 20 | 32 | 44 | C | They asked the universe for a sign. |
| 49 | The Islands | `(-2520, 745)` | 225 | K3 | The marina channel on Hammock Key, off a boat slip | 26 | 40 | 54 | C | The far dock is a dock. The near one is somebody's house. |
| 50 | The Islands | `(-3075, 1180)` | 230 | K4 | The rocks at the end of the Longspan, onto the lighthouse lawn | 30 | 46 | 62 | C | The last jump on the map. Do it at sunset. |

## Notes for the builder

- **Ramp 1 is the first one a new player meets.** `05-content.md` puts a ramp on the way from Park & Sons Auto to the first marker of free roam. Keep ramp 1 in line with Driftwood Street so a player driving west hits it without trying, and make its bronze reachable at 85 km/h.
- **What a ramp brings with it.** The things in the "over" column that are not landmarks (queued cars, trailers on a slipway, domino tables, vats, drums, containers, baggage carts, trolleys, lowriders, food trucks, signboards, a train) are props that belong to the ramp's row and spawn with it. A ramp must still work if a prop is knocked away: distance is all that is measured.
- **People near ramps.** Landing zones are not fenced. People sit at the domino tables of ramp 8, queue at ramp 22 and lie in the tents of ramp 48. Clear them and they film. Land on them and they stay down, which is a crime if a deputy sees and costs nothing in distance. The alligator at ramp 33 swims aside when a vehicle is within 40 m; nothing here hurts an animal.
- **Moving things.** The crane at ramp 12 lowers a container on a 20 s cycle. The lowriders at ramp 21 hop on a 2 s cycle. The train at ramp 27 moves at 6 km/h and is 120 m long. All three are timing tests, not walls: touching them costs health, not the medal.
- **Short landings that are jokes.** Ramp 10: landing in a vat repaints the car a random factory colour and still counts. Ramp 31: a short landing drops into the Sinkhole, 18 m down, for 60 health; a dirt track spirals out of it. Ramp 34: a short landing is a car in the pool, which stalls and drifts to the edge.
- **Ramp 31 and Billboard Road.** The Sinkhole is 90 m across with its centre at `(-600, -2450)`, so Billboard Road is cut between `x = -645` and `x = -555`. The broken road end on the east side is the ramp, 7 m from the rim. Gold clears the far rim and needs about 175 km/h off a K6.
- **Ramp 37** is inside the Speedbowl and can only be reached from the track. During Friday's race night it is fenced off.
- **Ramp 41.** Enter Big Earl by the tail. The ramp is the tongue.
- **Ramp 42** is in water. The gate is two posts and the kit is a mud bank.

## Checks

| Check | Pass |
|---|---|
| Placement | Every seed snaps within 25 m to land (water for ramp 42), outside every building box and at least 3 m from a road centre line. This is check D7.6 for ramps 1 to 15. |
| Run-up | 60 m behind each ramp, along its heading reversed, is free of buildings |
| Bounds | `map.districtAt` at each seed is the district in the table |
| Jump | `test.bigair.launch(1, 110)` then 3 s of gas emits `jump:landed` with `metres` of 15 or more and `collect:found` with kind `bigair` |
| Pay | The first counted landing on a ramp adds $500; the second adds no cash |
| Replay | After a counted landing `test.stats()` shows no error and input returns within 3.5 s |

## New names

| Name | What it is |
|---|---|
| Tow bed, Plywood, Steps, Mound, Hauler, Kicker | The six ramp kits, K1 to K6 |
| Big Air wrap | A car wrap for landing ramps 1 to 15 |
| Frequent Flyer jacket | Clothing for landing all 50 |
