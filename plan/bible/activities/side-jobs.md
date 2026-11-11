# Bible · activities · Side jobs

Jobs 1 to 20 of the 28 repeatable side jobs: the twelve in `05-content.md` with their pay and counts unchanged, and eight new ones. Each entry gives the giver and start, the loop, fails, the pay formula, five levels and a script check. These are the mostly honest jobs; the eight criminal ones, jobs 21 to 28, are in `side-jobs-crime.md`. Race routes are in `races.md`; the fish are in `minigames.md`.

Tier: A for jobs 01, 02 and 04, street races 1 to 4 and drift corner 1. B for jobs 05 to 10, street races 5 to 8 and drift corners 2 to 10. C for jobs 12 to 17. D for jobs 18 to 20.

## Rules every job shares

| Rule | Value |
|---|---|
| File | `src/systems/activities/<id>.js`, one per job, found by the registry |
| Start ring | 3 m radius, a briefcase blip. Interact starts it (F, Y, the context button). |
| Jobs app | Starts `bay-cab`, `pelican-eats` and `repo-run` anywhere. For any other job it sets a waypoint to the ring. |
| Blocked when | A mission or another job is running, or heat is 1 or more |
| Levels | 1 to 5, picked at the start. Level `n + 1` opens after 3 completions of level `n`. |
| Ends early | Out of the job vehicle for 20 s, Interact held for 1 s, heat 2, booked or knocked out. A fail pays nothing unless the entry says so. |
| The world is lethal | People hit hard or shot stay down, vehicles at 0 health explode, and guards, crews and deputies shoot back, as `04-systems.md` sets out. Killing in view raises heat on any job. |
| Events | Every job emits `job:started {id, level}`, `job:step {id, step}`, `job:completed {id, level, cash, followers}` and `job:failed {id, reason}`. Cash goes through the economy module. |
| Test API | `test.job.start(id, level)`. `test.job.state()` returns `{id, level, step, targets: [{x, z}], timer, meters}`. `test.job.skip()` ends the current step as a success. |
| Default check | `test.job.start(id, 1)`, then `test.job.skip()` until `job:completed`. The cash gained is inside the job's pay range. An entry lists a check only when it needs more than this. |

## 01 · Bay Cab fares
`bay-cab`, tier A, endless, pays $40–$180

- **Giver and start:** the Bay Cab dispatcher, a voice on the cab radio. Start from the Jobs app or the meter in any Bay Cab (a taxi Tarpon). Ranks: the plaza `(75, 20)`, City Hall `(-200, -590)`, Galleria Flamingo `(-200, -1960)`, the terminal `(1500, -1970)`.
- **Loop:** 1. A fare waves 150–400 m away. 2. Stop within 4 m at under 5 km/h. 3. Drive to the pin; the tip meter starts at 100. 4. Stop within 5 m of the pin. Paid. Next fare in 5 s.
- **Tip meter:** each `vehicle:crash` takes `speed km/h ÷ 2`, at most 40. Hitting a person takes 25. Past par (`25 s + route metres ÷ 9`) it drains 2 a second.
- **Fails:** the cab drops to 20 health and the fare runs.
- **Pays:** `fare + tip`. `fare = $0.03 × route metres`, held between $40 and $100. `tip = $80 × meter ÷ 100`.
- **Levels:** 1 routes of 400–900 m; 2 700–1,400 m, fares in a hurry (the drain starts 10 s early); 3 1,000–2,000 m, a fare holding a wedding cake (crash losses doubled); 4 1,400–2,800 m with a second stop; 5 1,800–3,400 m, only in rush hour or the 15:15 storm.
- **Check:** `test.job.start('bay-cab', 1)`, teleport to `targets[0]` then `targets[1]`. Cash gained: 40 to 180.

## 02 · Pelican Eats
`pelican-eats`, tier A, endless, pays $30–$120, Teo only, on the Pinfish

- **Giver and start:** the Pelican Eats app, from the Jobs app. Pick-up is the nearest food shop door; fallback seeds the plaza `(10, -20)` and Ventanita Rosa `(-1020, -640)`.
- **Loop:** 1. Reach the kitchen within 60 s. 2. The bag's heat starts at 100. Ride 300–1,800 m to the customer. 3. Walk the last 10 m to the door. Paid.
- **Heat meter:** cools by `100 ÷ (par × 1.4)` a second, where `par = route metres ÷ 9`. Rain cools it 1.5 times faster. A crash over 20 km/h spills 15; falling off spills 30.
- **Fails:** heat reaches 0; the scooter is destroyed.
- **Pays:** `$30 + $90 × heat ÷ 100`. A delivery during Go Live adds 20 followers.
- **Levels:** 1 300–600 m; 2 500–900 m; 3 two bags, two doors; 4 800–1,400 m with soup (a hop over 0.3 m spills 10); 5 three bags, 1,200–1,800 m, 18:00 to 21:00 only.
- **Check:** `test.switchTo('teo')`, `test.job.start('pelican-eats', 1)`, teleport to both targets. Cash gained: 30 to 120.

## 03 · Street races
`street-race`, tier A for routes 1–4, B for routes 5–8, 4 then 8, pays $500–$5,000

- **Giver and start:** the starter, who drops a beach towel. Drive a car of the route's class into the grid ring during its hours. Seeds, classes and hours are in `races.md`.
- **Loop:** 1. Line up with 3–5 drivers. 2. The towel drops after 3 s. 3. Checkpoints in order (ring 12 m). 4. The line. 5. Placings.
- **Fails:** not finished 45 s after the winner; vehicle destroyed; out of the car for 10 s; heat 3, when the meet scatters.
- **Pays:** `route prize × place share`: first 100%, second 40%, third 15%. Route prizes run from $500 to $5,000. A repeat win at a level already won pays 20%.
- **Side bet:** at the grid, put $100 to $5,000 on yourself with the starter's cousin. A win pays the stake times the level's odds: 1, 1.5, 2, 2.5, 3. Anything else loses it.
- **Levels** (rival pace against the ideal lap): 1 86%; 2 90%; 3 94%, and rivals ram; 4 97%; 5 100%, with one rival from the class above.
- **Events:** `race:started {id}`, `race:checkpoint {id, n}`, `race:finished {id, place, time}`.
- **Check:** `test.race.start('race-beachfront-dash')`, teleport through `test.race.state().checkpoints`. Expect `race:finished` with place 1.

## 04 · Repo runs
`repo-run`, tier A, endless, pays $200–$400, opens after mission 3, `repo-woman`

- **Giver and start:** Wendell Park, at the clipboard by the bay door of Park & Sons Auto `(340, -230)`, or the Jobs app.
- **Loop:** 1. Wendell texts an address 500–2,500 m away. 2. Take the car. 3. Deliver it to the bay ring. Paid.
- **Timer:** `90 s + route metres ÷ 8`.
- **Fails:** timer out; damage past the level's limit; the car in water; heat 3.
- **Pays:** `$200 + $200 × (health − floor) ÷ (100 − floor)`, where `floor = 100 − damage limit`. A spotless car pays $400.
- **Levels:** 1 a Snook or Tarpon, limit 30%, nobody home; 2 a Mullet, the owner follows in a Snook; 3 a Wahoo, limit 25%, the owner rams you in a Grouper; 4 a Sailfin in a guarded lot, limit 20%, two guards with pistols; 5 the fastest car in the build, at night, limit 15%: its owner is connected, and a crew car with an SMG comes after it.
- **Check:** `test.job.start('repo-run', 1)`, teleport to `targets[0]`, `test.enter()`, teleport to `(340, -230)`. Cash gained: 200 to 400.

## 05 · Airboat races
`airboat-race`, tier B, 4 routes, pays $800

- **Giver and start:** Captain Nilda Ferro, at the end of her dock `(1200, -3250)`. She lends a Gatorback.
- **Loop:** as street races, against 3 Gatorbacks. A gate is two cypress posts 16 m apart. Routes AB1 to AB4 are in `races.md`.
- **Fails:** stuck on dry ground for 8 s; not finished 45 s after the winner.
- **Pays:** $800 for first, $320 for second, $120 for third. Side bets as street races, with Nilda holding the cash.
- **Levels:** rival pace as street races. From level 3 rivals take the grass shortcuts and shove.
- **Check:** `test.race.start('race-dock-loop')`, teleport through the gates. Expect `race:finished`.

## 06 · Jet-ski slalom
`jetski-slalom`, tier B, 4 courses, pays $600

- **Giver and start:** the board on the nearest lifeguard hut. Ride a Skimmer through a start gate: Motel Row `(-600, 110)`, The Strand `(0, 110)`, Pier `(450, 115)`, Jetty `(1300, 115)`.
- **Course:** buoy `i` is at `(x0 + 28 × i, 115 + 8 × (−1)^i)`, heading east. Pass red buoys on their north side, yellow on their south.
- **Timer:** par is `buoys × 2.6 s`. A missed buoy adds 3 s, a touched one 1 s.
- **Fails:** thrown off twice; 60 m off the course.
- **Pays:** `$600 × medal share`: gold (par) 100%, silver (par + 10%) 50%, bronze (par + 25%) 25%. Gold pays once per course and level; repeats pay 20%.
- **Levels:** 1 16 buoys, flat water; 2 20 buoys; 3 20 buoys, 0.4 m swell; 4 24 buoys 24 m apart, boat wakes; 5 24 buoys in the 15:15 storm or Sunday's boat parade.

## 07 · Gator wrangling
`gator-wrangle`, tier B, 6 pools, pays $350

- **Giver and start:** Gus Thibodeaux, by his truck at Big Earl's `(-400, -2980)`. He lends a Mullet with a cage and a rubber chicken on a rope. It squeaks.
- **Pools, in order:** 1 Tideline Motel `(-520, -60)`; 2 a Motel Circle pool `(450, -2050)`; 3 the model home `(-1100, -2300)`; 4 the clubhouse `(-2000, -2100)`; 5 Glow Camp `(-1350, 600)`; 6 the Bellweather mansion `(-1000, 780)`.
- **Loop:** 1. Drive to the pool. 2. Hold Aim and release Fire to throw the chicken within 3 m of the alligator. 3. Walk backwards; it follows at 2.2 m/s while the chicken is within 6 m. 4. Lead it up the ramp into the cage. 5. Drive it to Gus's pond `(-430, -3040)`. Paid.
- **Meters:** within 1.5 m of its head it bites: 35 health and a 3 m throw. Nothing you do hurts the alligator. On the drive a calm meter drops with bumps; at 0 it climbs out at your next stop and walks to the nearest water.
- **Fails:** it returns to the pool three times; the truck is destroyed; you go 150 m from it.
- **Pays:** $350 a pool, plus followers equal to `calm × 5`.
- **Levels:** 1 pool 1; 2 pool 2; 3 pools 3 and 4, with armed guards who do not want you there; 4 pool 5, two alligators; 5 pool 6, a 4 m alligator and Bellweather's security.

## 08 · Golf cart derby
`cart-derby`, tier B, 1 arena, pays $1,000

- **Giver and start:** the Dawn Patrol's noticeboard at the clubhouse `(-2000, -2100)`. Drive a Birdie into the ring on the 9th fairway `(-1850, -2230)`. Hours are in `races.md`, SP1.
- **Loop:** eight carts start on a 60 m circle. Last cart rolling wins. A cart is out when it is at 0 health (it burns), on its side, or outside the sprinkler ring for 5 s. The ring shrinks from 60 m to 20 m over 3 minutes.
- **Pays:** $1,000 for the last cart, $400 for the second last, $150 for the third. The Dawn Patrol runs a book: side bets as street races.
- **Levels:** 1 seven timid carts; 2 they hunt the leader; 3 sprinklers on, grass grip 0.55; 4 eleven carts, the ring closes in 2 minutes; 5 dusk, eleven carts, and two security carts join at 2:00 swinging batons.
- **Events:** `race:finished {place}`, `vehicle:destroyed` per cart.

## 09 · Pier fishing
`pier-fishing`, tier B, endless, pays $5–$900

- **Giver and start:** the rod rack and ring at the end of Gullwing Pier `(600, 425)`. Rods are free. Not in a hurricane.
- **Loop:** cast, wait, strike, reel, weigh, photograph, release. The timing game, the twelve fish and the boot are in `minigames.md`. The pier's tally board pays.
- **Fails:** a snapped line loses the catch.
- **Pays:** the catch's value, from $5 for the boot to $900 for the marlin.
- **Levels** are lures, bought once at Bait & Ballistics: 1 bread ball, free; 2 spoon lure, $40; 3 feather jig, $120; 4 glow lure, $300; 5 the lucky lure, given for landing all twelve.
- **Events:** `fish:caught {kind, value}`.
- **Check:** `test.minigame.start('pier-fishing')` with odds forced to each row. Each returns its listed cash.

## 10 · Valet at Hotel Alba
`valet`, tier B, endless, pays $60 each

- **Giver and start:** the bell captain at the key stand on the forecourt of Hotel Alba `(290, -5)`. A shift is six cars.
- **Loop:** 1. Get in the guest's car. 2. Park it in the lit bay of the car park behind the hotel `(252, -77)`, within 0.4 m and 6°. 3. Run back. 4. From car four, guests also want cars back within 40 s.
- **Timer:** 45 s a car.
- **Fails:** two cars late; any guest's car below 60 health.
- **Pays:** $60 each for a clean park, $20 for a car that took any `vehicle:crash`. A clean shift adds 300 followers. Driving off in a guest's car instead is theft: heat 2 and no more shifts that day.
- **Levels:** 1 bays 3.0 m wide, Snooks and Tarpons; 2 parallel bays; 3 Groupers and a Sturgeon; 4 bays 2.5 m wide, two cars at once; 5 Wednesday's cruise crowd: ten cars and unlabelled keys, so find each car by colour.

## 11 · Drift scores
`drift-score`, tier A for corner 1, B for corners 2–10, 10 corners, pays $250

- **Giver and start:** a chalk scoreboard at each corner. Enter the 60 m zone above 40 km/h. No ring.
- **Loop:** a drift counts as `04-systems.md` defines it: slip angle over 0.35 rad above 40 km/h. It scores `speed km/h × slip angle × 10` a second, times a multiplier that grows 0.1 a second to a cap of 3. Straightening for 1 s banks it. A crash voids it.
- **Pays:** $250 the first time you beat a level's target at a corner.
- **Levels:** the target is the corner's base score times 1, 1.5, 2, 2.75 and 3.5.
- **Check:** `test.teleport(0, 37, 1.57)`, then the input script from check D2.1. `test.job.state().meters.best` is over 0.

| # | Corner | Seed | Base score |
|---|---|---|---|
| 1 | Plaza Corner | `(52, 37)` | 1,500 |
| 2 | Rosa Street Bend | `(-1012, 37)` | 1,800 |
| 3 | Spire Circle | `(52, -837)` | 3,000 |
| 4 | Bell Tower Turn | `(-1332, -997)` | 2,000 |
| 5 | Pigment Hook | `(1332, -677)` | 2,200 |
| 6 | Tank Farm Loop | `(2292, -677)` | 2,600 |
| 7 | Gateway Sweep | `(-200, -1800)` | 2,800 |
| 8 | Clubhouse Circle | `(-2000, -2100)` | 2,400 |
| 9 | Runway Hold | `(2800, -2450)` | 4,000 |
| 10 | Flip-Flop Kink | `(-2000, 300)` | 2,400 |

## 12 · Speedbowl time trials
`speedbowl-trial`, tier C, 6 classes, pays $1,500

- **Giver and start:** the timing booth in the Speedbowl's pit lane `(2700, -1790)`. It lends the class car. Shut during Friday's race night.
- **Loop:** one warm-up lap, then three timed laps of the oval, about 1,000 m on the racing line. Best lap counts. A wall touch voids the lap.
- **Classes and record laps:** Snook 33.9 s; Heron 31.0 s; Mullet 32.6 s; Manatee 44.6 s; Sailfin 22.3 s; Needlefish 21.2 s. A record is 85% of top speed held for a lap; retune when the oval exists.
- **Pays:** $1,500 the first time you beat a class record. The four ghosts below it pay 200 followers each.
- **Levels** (the ghost to beat, as a share of the record lap): 1 Rookie, 120%; 2 Club, 112%; 3 Pro, 106%; 4 Wendell, 102%; 5 Calloway, 100%: Mags's own lap from 35 years ago.

## 13 · Route 9
`route-9`, tier C, endless, pays $40–$235

- **Giver and start:** the dispatcher's window at Central Bus Terminal `(-100, -1280)`. The ring is at bay 9, beside a Manatee.
- **Stops, in order:** Terminal `(-100, -1317)`; The Shell `(372, -1317)`; Twin Sails `(372, -757)`; Bayfront `(372, -437)`; Hotel Alba `(300, 37)`; The Plaza `(0, 37)`; Egret `(-372, 37)`; City Hall `(-372, -597)`; Radio Row `(-372, -837)`; then the terminal.
- **Loop:** stop with the front door within 2 m of the pole at under 3 km/h. Doors open for 4 s. Leave on the timetable.
- **Comfort meter:** starts at 100. Braking harder than 6 m/s² takes 3, a kerb 5, a crash 20, a full-lock turn above 30 km/h 2 a second.
- **Fails:** comfort at 0; three stops missed; a rider or a pedestrian killed.
- **Pays:** `$15 for each stop made within 15 s of its time + $1 for each comfort point left`, never under $40.
- **Levels:** 1 midday; 2 rush hour; 3 the 15:15 storm; 4 standing room, comfort losses doubled; 5 the timetable is 15% tighter and one street is closed.
- **Check:** `test.job.start('route-9', 1)`, teleport to each stop in turn. Cash gained: 40 to 235.

## 14 · Bin day
`bin-day`, tier C, Mondays 05:00–09:00, pays $40–$350

- **Giver and start:** the yard radio at the scrapyard gate `(2200, -1200)`. The ring is beside a Pelican.
- **Loop:** 1. Drive to the marked street. 2. Pull within 2.5 m of each bin at under 8 km/h and press Interact. 3. A ring closes on the bin: release in the green band and the arm tips it and sets it down. Outside the band the bin is flung. 4. Return to the yard.
- **Timer:** `20 s for each bin + route metres ÷ 6`.
- **Fails:** timer out; the truck is destroyed.
- **Pays:** `$12 for each bin set down + $6 for each bin flung − $10 for each parked car hit`, plus $60 if no bin was flung, never under $40.
- **Levels:** 1 West End, 12 bins; 2 Los Patios, 14 bins, narrow streets; 3 Radio Row, 16 bins, traffic; 4 Mallard Greens, 20 bins, and a crooked bin there is fined $25; 5 The Strip, 24 bins on six lanes before the 08:00 rush.
- **Check:** `test.calendar.set('mon', 5)`, then the default.

## 15 · Storm run
`storm-run`, tier C, daily 13:30–15:00, pays $40–$265

- **Giver and start:** the loading door of any Storm Mart; fallback seed `(-360, -1830)` on Gateway Boulevard. A loaded Mullet waits.
- **Loop:** 1. Carry plywood, water jugs, sandbags and one pool noodle to 3–5 addresses, 400–1,500 m apart. 2. Stop within 4 m of each door; the items unload in 3 s. 3. Finish before the storm at 15:15.
- **Load:** a sideways pull over 0.5 g or a bump over 0.2 m sheds an item. Walk over it to reload (2 s).
- **Fails:** every item lost; the truck is destroyed.
- **Pays:** `$14 for each item delivered dry + $7 for each delivered after 15:15`, plus $40 if every address is done before the rain, never under $40.
- **Levels:** 1 six items, three stops; 2 eight items; 3 ten items, four stops, one behind the speed bumps of Mallard Greens; 4 twelve items, five stops, gusts push the plywood from 14:45; 5 sixteen items, five stops in two districts, from 14:15.
- **Check:** `test.setHour(13.5)`, then the default.

## 16 · Lifeguard patrol
`lifeguard`, tier C, daily 09:00–18:00, not in the storm, pays $40–$400

- **Giver and start:** the chair of the lifeguard hut at `(0, 63)`. A red Skimmer waits at the waterline.
- **Calls, at random:** a sunbather asleep on a drifting pool float (pass within 3 m at under 15 km/h to hook it, tow it inside `z = 85`); a lost beach ball; a Swan pedal boat out of puff; a swimmer beyond the buoys who is going under (stop within 2 m and they grab on).
- **Timer:** 45–70 s a call. A swimmer left past the timer drowns, and the shift ends.
- **Wake rule:** passing within 12 m of a swimmer at over 30 km/h is a complaint. Hitting one is not a complaint; it is a crime.
- **Pays:** `$30 for each call + $2 for each second left (at most $20 a call) − $15 for each complaint`, never under $40.
- **Levels:** 1 three calls; 2 five calls; 3 six calls in Wednesday's crowd; 4 a current pulls floats east at 1.5 m/s; 5 from 14:30: clear eight floats before 15:15.

## 17 · Scoop round
`scoop-round`, tier C, daily 11:00–18:00, pays $40–$280

- **Giver and start:** the Scoop Dreams kiosk at the foot of Pier Road `(620, 20)`. The ring is beside a Conch.
- **Loop:** 1. Drive to the next marked corner with the jingle on (Horn toggles it). 2. A queue of 4–8 forms. 3. Each customer shows 1–3 coloured scoops. Press the flavour buttons in that order within 4 s (J K L, or X Y B, or three touch buttons). 4. Next corner.
- **Timer:** the shift lasts 150 s at level 1 and 210 s at level 5.
- **Fails:** five wrong cones; the van is destroyed.
- **Pays:** `$4 for each right cone + $1 for each second of patience left (at most $3 a customer)`, never under $40.
- **Levels:** 1 three corners, one scoop; 2 four corners, two scoops; 3 five corners, three scoops and sprinkles (a fourth button); 4 a rival van wants your corners, and its driver shoots out your speaker if you get there first; 5 the 13:00–15:00 heat: patience halves.

## 18 · Baggage dash
`baggage-dash`, tier D, daily 06:00–22:00, pays $40–$290

- **Giver and start:** the Low Altitude Airlines ramp office at the terminal's airside door `(1520, -2090)`. The ring is beside a Gopher tug.
- **Stands:** `(1300, -2300)`, `(1600, -2300)`, `(1900, -2300)`.
- **Loop:** 1. Back up to the carts to hitch them. 2. Tow the train to the stand on the flight board. 3. Stop under the wing for 3 s. 4. Next flight.
- **Train:** each cart holds six bags. A turn tighter than 8 m above 20 km/h spills a cart. Walk over a bag to reload it (2 s). A taxiing jet has right of way; its blast pushes carts and its engines kill.
- **Timer:** each flight leaves `50 s + route metres ÷ 5` after it is posted.
- **Fails:** two flights missed.
- **Pays:** `$10 for each cart delivered on time + $1 for each bag still aboard`, never under $40.
- **Levels:** 1 two carts, one flight; 2 three carts, two flights; 3 four carts, across the taxiway; 4 five carts, three flights, rain; 5 six carts, three flights, and one stand changes on the way.

## 19 · Lawn order
`lawn-order`, tier D, daily 07:00–17:00, pays $40–$270

- **Giver and start:** the work-order board outside the clubhouse `(-2000, -2100)`. The ring is beside a Cricket mower.
- **Loop:** 1. Drive to the flagged lawn, a grid of 1 m cells. 2. Set the blade height on the order with Radio next and previous. 3. Mow at least 96% of the cells in straight stripes. 4. A man with a ruler measures three spots. Paid.
- **Stripe score:** the share of cells cut while your heading was within 5° of the lawn's long side.
- **Hazards:** sprinkler heads rise every 10 s (hitting one makes a geyser and voids its cell); flower beds; the neighbour's lawn.
- **Timer:** `2 s for each square metre`.
- **Fails:** timer out; the wrong blade height.
- **Pays:** for each lawn, `$30 + $40 × stripe score + $20 if no cell next door was cut − $20 for each flower bed`, never under $40 a shift.
- **Levels:** 1 one lawn, 20 × 14 m; 2 two lawns, sprinklers; 3 an L-shaped lawn with beds; 4 three lawns, with the man and his ruler walking behind you; 5 the apron of the 9th green, 40 × 30 m, before Sunday's tournament.

## 20 · Dual controls
`dual-controls`, tier D, daily 08:00–18:00, pays $50–$220

- **Giver and start:** the desk at Slow Tide Driving School `(-60, -1840)` on Gateway Boulevard. The ring is beside a Permit, the school car with two sets of pedals.
- **Loop:** a learner drives a set route. You have three tools: your own brake (Brake), a grab at the wheel (Steer applies 40% of your input for 1.5 s, then rests 3 s) and a kind word (Interact lowers nerves by 15, once every 8 s).
- **Nerves meter:** 0 to 100, starts at 50. High nerves mean late braking and wandering. The horn adds 20, a hard brake from you 10. Each calm 10 s takes off 5.
- **Faults:** a wheel over the centre line; a stop sign run; a stall at a light; a kerb.
- **Fails:** a crash over 15 km/h; four faults; anyone run over.
- **Pays:** `$50 + $40 × (3 − faults) + $0.50 × (100 − nerves)`.
- **Levels:** 1 six cones in the Galleria Flamingo car park; 2 1.2 km of Gateway Boulevard; 3 Spire Circle, twice round; 4 the expressway ramp at `x = -900` and a merge; 5 the learner is Mayor Bunny Castellano, filming a campaign ad, who waves at voters instead of steering.

## New names

| Name | What it is |
|---|---|
| Slow Tide Driving School | The driving school on Gateway Boulevard that owns the Permit cars |
| Route 9, Bin day, Storm run, Lifeguard patrol, Scoop round, Baggage dash, Lawn order, Dual controls | The eight new jobs |
| Plaza Corner, Rosa Street Bend, Bell Tower Turn, Pigment Hook, Tank Farm Loop, Gateway Sweep, Runway Hold, Flip-Flop Kink | Drift corners |
