# Bible · activities · Races

Twenty routes: eight street races, four boat races, four airboat races that also cross mud and grass, and four specials. Each has its class, its checkpoints in order, its rivals, three prizes, its day and hour from the canon's week, and what it unlocks. Street checkpoints are road junctions from the canon's grid.

Tier: A for street races SR1 to SR4. B for SR5 to SR8, the boat races, the airboat races and specials SP1, SP2 and SP4. C for SP3, which needs the Coot.

## Rules every race shares

| Rule | Value |
|---|---|
| Files | Routes are data in `src/content/races.js`. The runner is `src/systems/activities/races.js`. |
| Grid ring | 4 m radius, a chequered blip. Drive in with a vehicle of the class during the route's hours. |
| Grid | Slots 6 m apart, two abreast. The player starts at the back. |
| Start | A starter drops a beach towel after 3 s. Moving early costs a 2 s hold. |
| Checkpoint | A ring 12 m across on roads, 16 m between two buoys or posts on water, 6 m on the promenade. Taken in order. A missed one must be taken before the next counts. |
| Level on the deck | Checkpoints on the Bayline Expressway are at deck level 1 |
| Finish | The grid line for lap races, the last seed for point to point |
| Out | Not finished 45 s after the winner, vehicle destroyed, out of the vehicle for 10 s, or heat 3 |
| Traffic | Half the usual number of cars on the route while a race runs. People line the pavement and film. Anyone you hit stays hit, and it is a crime if a deputy sees. |
| Prizes | First, second, third. Second is 40% of first, third is 15%. A repeat win at a level already won pays 20%. |
| Side bets | At any grid, put $100 to $5,000 on yourself with whoever holds the cash. A win pays the stake times the level's odds: 1, 1.5, 2, 2.5, 3. Any other place loses it. |
| Levels | Five steps of rival pace, as in `side-jobs.md`: 86%, 90%, 94%, 97%, 100% |
| Ghost | From tier B your best run on each route is saved as a ghost and can be raced alone at any hour, for no prize |
| Wrap | Winning a route at level 5 unlocks a wrap named after the route at Park & Sons Auto |
| Before the week exists | The tier A build has no weekdays. Its four races run every night at the hours given. |
| Events | `race:started {id}`, `race:checkpoint {id, n}`, `race:finished {id, place, time}` |
| Test API | `test.race.list()`, `test.race.start(id)`, `test.race.state()` returns `{id, lap, next, checkpoints: [{x, z}], place, time}` |

### Classes

| Class | Vehicles |
|---|---|
| Small cars | Snook, Anchovy, Guppy, Snapper, Possum |
| Cars | Heron, Tarpon, Gallinule, Egret, Tern, Coquina, Ibis, Spoonbill, Flounder |
| Fast | Wahoo, Sailfin, Cobia, Bonito, Swordtail, Gar |
| Trucks | Mullet, Osprey, Grouper, Pompano |
| Two wheels | Pinfish, Needlefish, Bowfin, Cicada |
| Buses | Manatee, Manatee S |
| Boats | Skipjack or Skimmer, as the route says |
| Airboats | Gatorback |

### How rivals drive

- A rival follows a line through the checkpoints on the lane graph and ignores traffic lights.
- Straight-line pace is the level's share of the vehicle's top speed. Corner speed is `sqrt(grip × 9.8 × corner radius)`.
- A rival more than 80 m behind the player gains 6%. One more than 80 m ahead loses 6%. This is off at level 5.
- At each corner a rival has a 3 in 100 chance of braking late and running wide, which costs about 1.5 s.
- Rivals change lane round traffic. From level 3 they ram.
- At level 5 on SR4, SR5 and SR8, one rival carries a passenger with a pistol who shoots at your tyres on the straights.
- A rival's vehicle at 0 health explodes like any other. The driver bails at the fire stage if they can.

## Street races

### SR1 · Beachfront Dash
`race-beachfront-dash` · tier A · Small cars and Cars · 2 laps of 2.3 km
- **Grid:** `(0, 37)` on Heron Walk Drive, facing east
- **Checkpoints:** `(212, 37)` `(372, 37)` `(372, -197)` `(372, -357)` `(52, -357)` `(-372, -357)` `(-372, -197)` `(-372, 37)`
- **Rivals:** 3: a Snook, a Tarpon, a Heron
- **Prizes:** $500, $200, $75
- **When:** every night, 20:00–04:00
- **Unlocks:** Spire Run
- **Note:** four right-angle corners and two long straights. The plaza corner is drift corner 1.

### SR2 · Spire Run
`race-spire-run` · tier A · Cars and Fast · 2 laps of 2.6 km
- **Grid:** `(52, -437)` on Coral Boulevard, facing north
- **Checkpoints:** `(52, -677)` `(52, -837)` `(-212, -837)` `(-372, -837)` `(-372, -997)` `(52, -997)` `(372, -997)` `(372, -677)` `(212, -677)` `(52, -597)`
- **Rivals:** 4: two Tarpons, a Heron, a Wahoo
- **Prizes:** $1,000, $400, $150
- **When:** Tuesday and Thursday, 21:00–03:00
- **Unlocks:** Bell Tower Rally
- **Note:** a figure of eight. The way out and the way back cross at Coral Boulevard and Commerce Way. Three quarters of Spire Circle are part of the lap.

### SR3 · Bell Tower Rally
`race-bell-tower-rally` · tier A · any road class · 1 lap of 3.0 km
- **Grid:** `(-1012, -597)` on Avenida Rosa, facing north
- **Checkpoints:** `(-1012, -837)` `(-1012, -997)` `(-1172, -997)` `(-1332, -997)` `(-1332, -1157)` `(-1332, -1317)` `(-1652, -1317)` `(-1652, -997)` `(-1652, -677)` `(-1332, -677)` `(-1332, -437)` `(-1012, -437)`
- **Rivals:** 4: two Flounders, a Mullet, a Snook
- **Prizes:** $1,500, $600, $225
- **When:** Tuesday, 20:00–24:00, after the domino league
- **Unlocks:** Tank Farm Trophy
- **Note:** runs the length of the mural wall, passes the bell tower and Domino Park. Strings of lights mark the route. The Flounders hop over the junction humps.

### SR4 · Tank Farm Trophy
`race-tank-farm-trophy` · tier A · Fast · 3 laps of 2.7 km
- **Grid:** `(2292, -677)` on Container Road at Commerce Way, facing east, beside the beach-ball tanks
- **Checkpoints:** `(2612, -677)` `(2932, -677)` `(2932, -437)` `(2932, -277)` `(2612, -277)` `(2292, -277)` `(1972, -277)` `(1972, -437)` `(1972, -677)`
- **Rivals:** 5: two Wahoos, two Sailfins, a Needlefish
- **Prizes:** $2,500, $1,000, $375
- **When:** Thursday, 23:00–03:00, the street race meet
- **Unlocks:** SR5 to SR8
- **Note:** Breakwater Road runs along the open quay under the cranes. There is no barrier on the water side. A car in the bay is out. The biggest side bets in the city are placed here.

### SR5 · Expressway Express
`race-expressway-express` · tier B · Fast · point to point, 4.6 km
- **Grid:** `(-2400, -1480)` at the top of the west ramp, facing east
- **Checkpoints:** `(-1972, -1480)` `(-1332, -1480)` `(-900, -1480)` `(-372, -1480)` `(52, -1480)` `(700, -1480)` `(1332, -1480)` `(1972, -1480)` `(2200, -1480)`
- **Rivals:** 5: a Bonito, two Sailfins, a Wahoo, a Needlefish
- **Prizes:** $3,000, $1,200, $450
- **When:** Sunday, 22:00–02:00, when the roads are empty
- **Unlocks:** nitro at half price at Park & Sons Auto
- **Note:** flat out on the deck. Traffic is the only corner. The last seed is the top of the east ramp.

### SR6 · Strip Mall Shuffle
`race-strip-mall-shuffle` · tier B · Trucks · 3 laps of 1.9 km
- **Grid:** `(-200, -1800)` on Gateway Boulevard at Galleria Road, facing west
- **Checkpoints:** `(-360, -1800)` `(-520, -1800)` `(-520, -1960)` `(-520, -2120)` `(-520, -2280)` `(-520, -2440)` `(-360, -2440)` `(-200, -2440)` `(-200, -2280)` `(-200, -2120)` `(-200, -1960)`
- **Rivals:** 4: two Mullets, a Grouper, a Pompano
- **Prizes:** $2,000, $800, $300
- **When:** Tuesday, 22:30–02:00, when the Starlite empties
- **Unlocks:** the Osprey for sale at Wahoo World
- **Note:** Gateway Boulevard, Hospital Road, Billboard Road, Galleria Road. The corner at Hospital Road and Billboard Road is 35 m from the edge of the Sinkhole.

### SR7 · Chimney Sweep
`race-chimney-sweep` · tier B · Two wheels · 2 laps of 2.6 km
- **Grid:** `(1012, -437)` on Factory Avenue, facing north
- **Checkpoints:** `(1012, -677)` `(1012, -997)` `(1332, -997)` `(1652, -997)` `(1652, -837)` `(1652, -677)` `(1492, -677)` `(1332, -677)` `(1332, -517)` `(1332, -357)` `(1172, -357)` `(1012, -357)`
- **Rivals:** 5: three Needlefish, a Bowfin, a Pinfish
- **Prizes:** $1,800, $720, $270
- **When:** Friday, 22:00–02:00, while Humidity is full
- **Unlocks:** the Cicada for sale at Park & Sons Auto
- **Note:** laps the paint factory and passes the queue for Humidity, which films. Followers earned here are doubled.

### SR8 · Longspan Sunset
`race-longspan-sunset` · tier B · Fast · point to point, 2.4 km
- **Grid:** `(-1972, -677)` on Mangrove Avenue at Commerce Way, facing south
- **Checkpoints:** `(-1972, -517)` `(-1972, -357)` `(-1936, -88)` `(-1900, 180)` `(-2000, 300)` `(-2280, 520)` `(-2550, 750)` `(-2830, 980)` `(-3100, 1200)`
- **Rivals:** 5: a Bonito, a Sailfin, a Wahoo, a Tern, a Needlefish
- **Prizes:** $5,000, $2,000, $750
- **When:** Saturday, 17:30–20:00
- **Unlocks:** The Whole Coast, once all eight street races are won
- **Note:** Mangrove Avenue, Marsh Road, then the whole Longspan to the lighthouse on Last Key. Run it into the sun. The causeway is two lanes with water on both sides.

## Boat races

Seeds snap to open water. Buoy gates are 16 m wide.

### BR1 · Pier Pressure
`race-pier-pressure` · tier B · Skimmer · 3 laps of 1.1 km
- **Grid:** `(450, 120)`, west of Gullwing Pier, facing south
- **Checkpoints:** `(450, 260)` `(480, 400)` `(600, 470)` `(720, 400)` `(750, 260)` `(750, 130)` `(600, 150)` `(520, 130)`
- **Rivals:** 3 Skimmers
- **Prizes:** $600, $240, $90
- **When:** every day, 09:00–15:00. On Wednesday the pier crowd doubles followers.
- **Unlocks:** Bridge to Bridge
- **Note:** round the end of the pier, then back under it between the pilings at `(600, 150)`. The gap is 9 m.

### BR2 · Bridge to Bridge
`race-bridge-to-bridge` · tier B · Skipjack · point to point, 1.7 km
- **Grid:** `(-1050, 200)`, off the Yacht Club, facing west
- **Checkpoints:** `(-1100, 280)` `(-1300, 330)` `(-1550, 320)` `(-1780, 300)` `(-1960, 420)` `(-2180, 600)` `(-2400, 680)` `(-2480, 760)` `(-2540, 810)`
- **Rivals:** 4 Skipjacks
- **Prizes:** $1,200, $480, $180
- **When:** Saturday, 19:00–21:00, before the yacht party
- **Unlocks:** Port Authority
- **Note:** under Sandpiper Bridge, along the north shore of the Isle, then down the south side of the Longspan, round the Stilt House and into the houseboat marina on Hammock Key.

### BR3 · Port Authority
`race-port-authority` · tier B · Skipjack · 2 laps of 2.2 km
- **Grid:** `(2300, 260)`, off the Bay Ferry terminal, facing east
- **Checkpoints:** `(2500, 280)` `(2800, 300)` `(3100, 320)` `(3150, 500)` `(2900, 620)` `(2600, 640)` `(2350, 560)` `(2200, 400)`
- **Rivals:** 4: three Skipjacks and a Minnow that started early
- **Prizes:** $1,500, $600, $225
- **When:** Wednesday, 17:30–19:30, in the cruise ship's wake as it leaves
- **Unlocks:** Round the Isle
- **Note:** the ship's wake is a 1 m swell that crosses the course once a lap. Hit it square and the boat flies.

### BR4 · Round the Isle
`race-round-the-isle` · tier B · Skipjack or Skimmer · 2 laps of 2.9 km
- **Grid:** `(-650, 400)`, off the north-east corner of Sandpiper Isle, facing south
- **Checkpoints:** `(-620, 660)` `(-650, 950)` `(-1100, 980)` `(-1550, 950)` `(-1580, 660)` `(-1550, 380)` `(-1100, 300)` `(-850, 340)`
- **Rivals:** 4: two Skipjacks, two Skimmers
- **Prizes:** $2,000, $800, $300
- **When:** Sunday, 13:00–15:00, before the boat parade
- **Unlocks:** a mooring at the Yacht Club
- **Note:** past the private docks on the south shore and under Sandpiper Bridge at `(-1100, 300)`. Bellweather's two security jet skis fire a warning shot if you pass within 30 m of a dock. The second shot is not a warning.

## Airboat races

All four pay the $800 in `05-content.md`, start from Captain Nilda's water and use the Gatorback. A gate is two cypress posts. Seeds snap to water or wet grass. Grass and mud are slower than water but shorter.

### AB1 · Dock Loop
`race-dock-loop` · tier B · Gatorback · 2 laps of 1.5 km
- **Grid:** `(1200, -3250)`, Nilda's dock, facing east
- **Checkpoints:** `(1400, -3300)` `(1600, -3380)` `(1500, -3470)` `(1250, -3480)` `(1000, -3420)` `(900, -3330)` `(980, -3260)` `(1100, -3230)`
- **Rivals:** 3 Gatorbacks
- **Prizes:** $800, $320, $120
- **When:** every day, 06:00–18:00
- **Unlocks:** Fish Camp Flyer
- **Note:** open channels all the way. The teaching race.

### AB2 · Fish Camp Flyer
`race-fish-camp-flyer` · tier B · Gatorback · point to point, 1.3 km
- **Grid:** `(1200, -3250)`, facing east
- **Checkpoints:** `(1380, -3290)` `(1560, -3360)` `(1740, -3300)` `(1900, -3220)` `(2050, -3290)` `(2150, -3400)` `(2250, -3440)` `(2300, -3370)`
- **Rivals:** 3 Gatorbacks
- **Prizes:** $800, $320, $120
- **When:** Monday, Wednesday and Friday, 06:00–18:00
- **Unlocks:** Earl's Run
- **Note:** a 120 m sawgrass flat lies between the fourth and fifth gates. Straight across saves 4 s. The finish is under the fish camp's stilts.

### AB3 · Earl's Run
`race-earls-run` · tier B · Gatorback · point to point, 1.7 km
- **Grid:** `(1200, -3250)`, facing west
- **Checkpoints:** `(1050, -3300)` `(880, -3360)` `(700, -3300)` `(500, -3380)` `(300, -3300)` `(100, -3220)` `(-100, -3160)` `(-250, -3100)` `(-400, -3060)`
- **Rivals:** 3 Gatorbacks
- **Prizes:** $800, $320, $120
- **When:** Tuesday, Thursday and Saturday, 06:00–18:00
- **Unlocks:** Castaway Run
- **Note:** the third gate is under the Route 44 bridge, 7 m wide. The last 200 m is mud. It ends in the pond behind Big Earl.

### AB4 · Castaway Run
`race-castaway-run` · tier B · Gatorback · point to point, 2.0 km
- **Grid:** `(-1000, -3100)`, the channel behind Bait & Ballistics, facing west
- **Checkpoints:** `(-1200, -3180)` `(-1400, -3260)` `(-1600, -3200)` `(-1800, -3260)` `(-2000, -3240)` `(-2200, -3300)` `(-2400, -3220)` `(-2600, -3140)` `(-2800, -3100)` `(-2900, -3080)`
- **Rivals:** 3 Gatorbacks
- **Prizes:** $800, $320, $120
- **When:** Sunday, 05:00–08:00, in the dawn fog
- **Unlocks:** Nilda's own Gatorback paint, swamp green with a hand-painted number
- **Note:** fog cuts sight to 60 m, so each gate carries a lantern. The fifth gate passes the vine-covered gate of Castaway Kingdom. Herons on the posts fly off as you come.

## Specials

### SP1 · The Ninth Fairway Derby
`race-ninth-fairway-derby` · tier B · Birdie · an arena, not a lap
- **Grid:** the centre of the 9th fairway `(-1850, -2230)`. This is the golf cart derby in `side-jobs.md`: last cart rolling.
- **Boundary flags, clockwise from the north:** `(-1850, -2290)` `(-1815, -2279)` `(-1793, -2249)` `(-1793, -2211)` `(-1815, -2181)` `(-1850, -2170)` `(-1885, -2181)` `(-1907, -2211)` `(-1907, -2249)` `(-1885, -2279)`
- **Rivals:** 7 Birdies, 11 from level 4
- **Prizes:** $1,000, $400, $150
- **When:** Sunday, 18:00–20:00, after the golf tournament. Before the week exists: every day, 06:00–09:00.
- **Unlocks:** a roll cage for the Birdie
- **Note:** the ten flags mark a 60 m circle. A ring of sprinklers starts on the flags and closes to 20 m. A cart outside the ring for 5 s is out.

### SP2 · Sea Cow Classic
`race-sea-cow-classic` · tier B · Buses · 1 lap of 4.0 km
- **Grid:** `(-100, -1317)` on Union Avenue outside Central Bus Terminal, facing east
- **Checkpoints:** `(372, -1317)` `(692, -1317)` `(692, -997)` `(692, -677)` `(372, -677)` `(52, -677)` `(-372, -677)` `(-692, -677)` `(-692, -997)` `(-692, -1317)` `(-372, -1317)`
- **Rivals:** 3 Manatees
- **Prizes:** $2,000, $800, $300
- **When:** Sunday, 20:00–23:00, when the depot is idle
- **Unlocks:** a depot air horn for any vehicle
- **Note:** four corners in a bus that takes 22 s to reach 100 km/h. Brake early. Bus Driver Voice works on rivals once a lap.

### SP3 · Early Bird Special
`race-early-bird-special` · tier C · Coot · point to point, 720 m
- **Grid:** `(-300, 47)` on the Heron Walk promenade, facing east
- **Checkpoints:** `(-220, 47)` `(-140, 47)` `(-60, 47)` `(20, 47)` `(100, 47)` `(180, 47)` `(260, 47)` `(340, 47)` `(420, 47)`
- **Rivals:** 5 Coots, ridden by neighbours from Pelican Rest
- **Prizes:** $750, $300, $110
- **When:** Wednesday, 07:00–09:00, before the cruise crowd
- **Unlocks:** a flag and a basket for the Coot
- **Note:** the promenade is 6 m wide and in use: joggers, skaters and a tai chi class at `(20, 47)`. Nobody moves for you. Bumping a person costs 2 s while you apologise. The neighbours bet on this one harder than on anything at the Tank Farm.

### SP4 · The Whole Coast
`race-the-whole-coast` · tier B · any road class · point to point, about 22 km
- **Grid:** `(52, 37)`, the plaza corner, facing west
- **Checkpoints:** `(-1012, 37)` `(-1900, 180)` `(-3100, 1200)` `(-1972, -357)` `(-2000, -1520)` `(-2000, -2100)` `(-900, -1900)` `(-200, -1800)` `(700, -3000)` `(700, -1480)` `(2200, -1480)` `(2932, -677)` `(52, -837)` `(52, 37)`
- **Rivals:** 5: a Sailfin, a Wahoo, a Tern, a Grouper, a Manatee that never stops
- **Prizes:** $5,000, $2,000, $750, and 10,000 followers for finishing at all
- **When:** Saturday, grid at 06:00. Opens when all eight street races are won.
- **Unlocks:** a plaque at the plaza with your time, and the endurance stripe wrap
- **Note:** the route between seeds is yours to choose. In order: the beachfront, the Longspan out to the lighthouse and back, the south gate, Clubhouse Circle, the Gatehouse, Gateway Boulevard, Route 44 up to Mudcat Road and back down, the expressway east, the quay, Spire Circle and home down Coral Boulevard. It touches all ten districts. Fuel is not a thing. Damage is: there are no repairs on the way.

## Checks

| Check | Pass |
|---|---|
| Count | `test.race.list()` has 4 routes in a tier A build and 20 with everything in |
| Surface | Every checkpoint snaps within 25 m: road seeds to a road, water seeds to water at least 1.2 m deep, airboat seeds to water or grass |
| Roads | Each street race has at least 6 checkpoints within 7 m of a road centre line |
| Finish | A route follower completes every race, and `race:finished` carries a place and a time |
| Pay | A win at level 1 pays the first prize in this file; second and third pay 40% and 15% |
| Bet | A $100 bet and a win at level 3 return $200 on top of the stake; a second place loses the $100 |

## New names

| Name | What it is |
|---|---|
| Beachfront Dash, Spire Run, Bell Tower Rally, Tank Farm Trophy, Expressway Express, Strip Mall Shuffle, Chimney Sweep, Longspan Sunset | Street races SR1 to SR8 |
| Pier Pressure, Bridge to Bridge, Port Authority, Round the Isle | Boat races BR1 to BR4 |
| Dock Loop, Fish Camp Flyer, Earl's Run, Castaway Run | Airboat races AB1 to AB4 |
| The Ninth Fairway Derby, Sea Cow Classic, Early Bird Special, The Whole Coast | Specials SP1 to SP4 |
