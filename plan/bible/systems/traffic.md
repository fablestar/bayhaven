# Bible · systems · Traffic

Traffic is cars on rails: each one follows a lane, keeps a 2 second gap, obeys lights and stop signs, and picks a turn at each junction. A car only becomes a full physics body when something hits it. This file extends `04-systems.md` section 5 with the lane graph, the formulas, the signal phases, the density table and the vehicles that run to a timetable.

Tier: A (lanes, lights, spawning, parked cars day 2; sirens day 5; Mags's horn day 7). C for timetabled vehicles and anything tied to a weekday.

## Purpose

Fill every road the player can see with cheap, believable motion that reacts to them.
Stay inside 14 moving cars on a phone and 40 on a laptop without the road looking empty.

## Data

Owner: `src/vehicles/traffic.js` (brains, spawning), `src/world/nav.js` (the graph), `src/systems/signals.js` (lights).

### The lane graph

```js
node = { id, x, z, level, kind, arms }       // kind: 'signal' | 'stop' | 'merge' | 'circle' | 'end'
edge = { id, from, to, kind, limit, length, pts, level, next, left, right }
// one edge per lane per direction; next = lanes you may enter at the far node;
// left / right = the neighbouring lane going the same way, or null
```

Traffic drives on the right. Lanes are 3.5 m wide.

| Road kind | Limit km/h | Lane centres, metres from the centre line | Curb parking |
|---|---|---|---|
| Expressway | 110 | 2.25, 5.75, 9.25 | no |
| Boulevard | 70 | 3.75, 7.25, 10.75 | yes |
| Avenue | 60 | 1.75, 5.25 | yes |
| Street | 40 | 1.75 | yes |
| Suburb lane | 30 | 1.75 | no |
| Causeway | 80 | 1.75 | no |
| Dirt track | none; drivers hold 35 | 0, shared both ways | no |

On a dirt track two cars that meet each pull 1.5 m onto the verge.

### Tuning

| Item | Value |
|---|---|
| Moving cars | 40 on `high`, 14 on `low` |
| Spawn ring | 120 to 260 m from the player, out of the camera's view |
| Removed | past 320 m |
| Following gap | 2 s, plus 2.5 m at a standstill |
| Look-ahead cone | 20 m, 20 degrees either side |
| Pull | 2.5 m/s² for cars, 1.2 for buses and trucks |
| Braking | 3.5 m/s² comfortable, 8 hard |
| Parked cars | about 30% of curb spaces |
| Rush | × 1.5 at 08:00 and 17:30. Quiet: × 0.3 at 03:00 |

### Car following

```js
// gap = metres to the back of what is ahead: a car in the lane, a red stop line, or anything in the cone
want   = 2.0 * v + 2.5;                          // the 2 second rule
free   = pull * (1 - v / limit);
follow = 0.6 * (gap - want) + 1.2 * (vAhead - v);
a = clamp(Math.min(free, follow), -8, pull);
if (gap < 0.5 * v + 1) a = -8;                   // emergency
v = Math.max(0, v + a * dt);  s += v * dt;       // s = metres along the edge
```

A red or amber stop line is a stopped lead car at the line. Lane order gives the car ahead up to 80 m; the cone catches what is not in a lane: the player sideways, a person, a fallen sign.

### Signals

Every junction with an avenue or a boulevard has lights. Each row sums to the 30 s cycle.

| Junction | Big road green | Amber | All red | Other road green | Amber | All red |
|---|---|---|---|---|---|---|
| Avenue with avenue | 12 | 2 | 1 | 12 | 2 | 1 |
| Boulevard with avenue | 15 | 2 | 1 | 9 | 2 | 1 |
| Avenue or boulevard with street | 17 | 2 | 1 | 7 | 2 | 1 |

```js
offset = ((Math.abs(node.x) + Math.abs(node.z)) / 13.9) % 30;   // a 50 km/h green wave out from the plaza
phaseTime = (clockSeconds + offset) % 30;
```

People get a walk light during the green of the road they walk beside, less its last 4 s.

### Priority

1. **Lights:** stop on red and on amber if the line is more than `v * 1.2` m away. Right turn on red after a full stop and a 3 s gap.
2. **Left turns** wait in the junction for a 4 s gap in oncoming cars and clear on amber.
3. **Stop signs** (street with street): stop 1 s, then first in, first out. Two cars may cross together if their paths do not meet.
4. **Spire Circle:** yield to cars in the circle; enter on a 2.5 s gap.
5. **Ramps and merges:** the joining lane yields; 2 s gap.
6. **The box rule:** nobody enters a junction unless the exit lane has room for the car plus 2 m.
7. **Sirens** ignore all of the above. Everyone else gets out of the way.

### Turning and lanes

At each node a car picks from `edge.next`: straight 0.6, right 0.2, left 0.2, renormalised over what is legal. Weights are halved for a road that ends in a barrier and doubled for taxis onto avenues. A car needs the correct lane 60 m before its turn and changes when the gap is 1.0 s ahead and 1.5 s behind; the move takes 2 s.

### Density by district and hour

Target moving cars on `high`. On `low` use `round(n * 14 / 40)`. Values ease between bands over 30 game minutes.

```text
district           00-05  05-07  07-10  10-16  16-19  19-24
Tideline           10     19     40     32     40     31
Meridian           11     22     40     36     40     26
Palma Vieja        8      17     40     28     40     25
The Paintworks     14     12     30     24     34     36
Rustwater          8      20     30     20     28     12
Northgate          11     22     40     36     40     29
Mallard Greens     2      8      20     14     20     6
Runway Flats       6      14     30     20     30     16
Mudcat Glades      2      4      9      6      9      4
The Islands        4      7      18     12     18     10
Heron Marsh        2      4      9      6      9      4
Expressway deck    12     24     40     40     40     30
```

Weather multiplies the target: storm 0.8, tropical storm 0.5, hurricane 0.15, swamp fog 0.7.

### Mix

Weights live in each zone file. Models marked B join the mix only once they exist.

- Tideline: pinfish 3, taxi 3, tarpon 2, snook 2, heron 2, sailfin 1, tern 2 (B)
- Meridian: tarpon 4, taxi 3, pompano 2, manatee 1
- Palma Vieja: flounder 3, pompano 2, mullet 2, pinfish 2, tarpon 1
- The Paintworks by day: pompano 3, tarpon 2, snook 2. By night: sailfin 2, wahoo 2, taxi 2
- Rustwater: hogfish 4, mullet 3, pompano 1
- Northgate: tarpon 2, grouper 2, snook 2, mullet 2, pompano 2
- Mallard Greens: birdie 4, grouper 3, tarpon 2
- Runway Flats: taxi 3, pompano 2, manatee 1
- Mudcat Glades: mullet 4, grouper 1, bullfrog 1 (B)
- The Islands: on the Isle heron 3, grouper 2, sturgeon 1 (B); on the Keys mullet 3, pinfish 3

One Sheriff Tarpon on patrol joins the mix per 40 cars, so there is sometimes a cop to see you.

### Spawning

```js
target = Math.min(cap, Math.round(cap * density(district, hour) / 40 * weatherMul));
// each frame, at most one spawn: pick a lane point 120 to 260 m away that the camera cannot see
// (outside the view cone widened by 10 degrees, or behind a building). 65% of picks are ahead of the player's velocity.
// remove a car past 320 m, or past 200 m and unseen for 5 s while the count is over target.
```

On a long open road (the Longspan, the expressway, Runway Road) nothing hides a spawn, so cars may appear in view at 250 to 260 m, where a car is under 8 pixels tall on a phone. The last two vehicles the player drove are kept until both are past 320 m and out of view.

### Parked cars

Each chunk fills its curb spaces (6 m long) from `hash(worldSeed, cx, cz)`: 45% in Meridian and Motel Row, 30% elsewhere in the grid districts, 15% in Rustwater and the Keys, driveways only in Mallard Greens. A parked car is one static instance with a collision box. It wakes into a full vehicle when entered or hit harder than 2 m/s. Four in ten have an alarm that beeps for 6 s when hit.

### Vehicles on a timetable

| What | When | Where | Tier |
|---|---|---|---|
| City buses (Manatee) | six routes, see `transit.md` | route stops | C |
| Bin day (Pelican garbage trucks) | Monday 05:30 to 08:00 | every street, one truck per four chunks, stopping 6 s every 40 m; bins stand at the curb from 05:00 to 09:00 | C, needs the B model |
| Cruise crowd | Wednesday 10:00 to 17:00 | Tideline taxi weight × 2; a Manatee shuttle between the cruise terminal `(2500, 100)` and Gullwing Pier every 10 game minutes | C |
| Tank Farm meet | Thursday 23:00 | 8 to 12 fast cars parked at `(2400, -700)` | C |
| Race night, golf Sunday | Friday 19:00; Sunday by day | Route 44 traffic toward the Speedbowl × 1.5; Birdie weight × 2 in Mallard Greens | C |

A timetabled vehicle has a virtual position worked out from the clock. It becomes a real car when that position comes inside 260 m and counts toward the cap.

### Ambulances

An ambulance (a Pompano) comes for anyone who is down.

| Step | Rule |
|---|---|
| Call | 5 s after someone goes down. It waits while any shot has been fired within 60 m in the last 10 s |
| Arrive | spawns 150 to 260 m away out of view, siren on, at 1.3 × the limit. Everyone pulls over |
| With it | one Sheriff Tarpon follows 20 m behind and parks. It is a witness (`heat.md`) |
| On scene | stops within 8 m. Two medics get out, kneel 6 s by each person and carry them to the back doors. One ambulance takes up to 3 people within 15 m |
| Leave | drives toward Bayhaven General `(-500, -1700)` with the siren on and is removed out of view |
| Limits | 1 at once on `low`, 2 on `high`. None in a hurricane of category 3 or more. Anyone not collected is removed after 90 s out of view |
| If taken | it drives like any Pompano, with the scanner for a radio. Taking it is the case `cartheft` (kind `carjack`); the medics walk away |

A fire truck (a Hogfish) comes to a burnt shell still in view after 20 s, hoses it for 8 s and leaves (B).

## States

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Cruise | spawned, or the way is clear | follows its lane at the limit | a lead car, a line or an obstacle is inside `want` |
| Follow | something ahead | the following formula | the gap opens |
| Stop | red light, stop sign, queue | waits at the line | green, or its turn |
| Turn | enters a junction | follows a curve to the chosen lane, signals | reaches the exit lane |
| Swerve | cut off: time to collision under 1.2 s | honks 0.4 to 0.9 s, changes lane or brakes at 8 m/s² | 4 s |
| Pulled over | a siren within 60 m behind or 40 m ahead, or Mags's horn within 30 m | moves to the curb lane or shoulder and stops | the siren is 40 m past, or 5 s after the horn |
| Panic | `weapon:fired` or `vehicle:blast` within 80 m | limit × 1.6, ignores lights, gap 0.8 s. One driver in five bails and runs | 12 s, or 200 m away |
| Rubberneck | `vehicle:crash` over 8 m/s within 50 m | passes at 15 km/h, head turned | 10 s |
| Loose | hit harder than 2 m/s | the full step from `driving.md`, brakes on | at rest 3 s: back to its lane if health is over 40, else abandoned |
| Driverless | its driver is down | rolls on with the steering as it was and no brakes | it hits something or stops: abandoned |
| Abandoned | driver bailed or down, or the player took it | a parked car with its door open | removed out of view after 60 s |

Mags's horn also pulls over police cars, at heat 1 and 2 only. A driver whose car is taken gets out, complains in a subtitle and walks off; the vehicle module emits `crime { kind: 'carjack', case: 'cartheft', seen }`. A driver tries to bail when the car catches fire; not all make it (`driving.md`). Drivers have 50 health like anyone on foot.

## Events

Emits: `traffic:honk { x, z }`, `traffic:pulledover { count }`, `traffic:panic { count }`, `traffic:ambulance { x, z, step }`, `signals:phase { node, phase }`.
Listens: `clock:hour`, `weather:changed`, `weapon:fired`, `vehicle:crash`, `vehicle:blast`, `ped:down`, `combat:down`, `player:ability` (the horn), `chunk:loaded`, `chunk:unloaded`.
State: `state.traffic = { count, target, parked }`.

## Edge cases

- A car stopped 25 s with nothing the player can see ahead is removed if out of view; in view it honks and creeps round.
- At 110 km/h a car cannot stop inside the 20 m cone. On the expressway it changes lane; if it cannot, it hits you.
- In rain (`wet` over 0.3) or dark: wipers, headlights, limit × 0.85, cone × 1.25.
- A lane ending at a day barrier is a node of kind `end`: cars turn off one junction early.
- A chunk that unloads takes its parked cars with it. Moving cars carry on: the graph is never unloaded.
- Level 1 (the deck) and level 0 never see each other in gap or cone tests.

## Low and high

```text
                                  low                         high
moving cars                       14                          40
updated every step within         60 m                        80 m
further cars updated              every 4th step, 8th         every 2nd, 4th
                                  past 200 m                  past 200 m
parked car instances              24                          60
awake bodies at once              8                           20
ambulances at once                1                           2
wheels turn, indicators blink     within 40 m                 within 120 m
draw calls, moving and parked     16 or fewer                 24 or fewer
time per frame                    1.5 ms or less              1.2 ms or less
```

Each model is one `InstancedMesh`, with one more for all wheels and one for all lights. The budget assumes LOD1 building shells cost one call per 4 × 4 group of chunks.

## Script checks

New test entries: `test.traffic.list()` returns `[{ id, model, x, z, v, state, gapS }]`; `test.signals.at(x, z)` returns the phase at the nearest lit junction; `test.traffic.clear()`.

1. At `(0, 37)` at noon after 10 s: `test.stats().cars` ≥ 10 on `low` and ≥ 25 on `high`, and never above 14 or 40.
2. Over 60 s at `(52, -357)`: at least one car is in `stop` while its light is red, none crosses a red line faster than 2 m/s, and the median `gapS` of cars in `follow` above 20 km/h is between 1.5 and 3.
3. Over 60 s no car's box overlaps a building box or another car's box for more than 0.5 s.
4. Every car first appears between 120 and 260 m from the player; after a teleport of 1 km no car remains beyond 320 m once 2 s have passed.
5. `test.setHour(3)` brings the count to 0.35 of the noon count or less within 60 s; `test.setHour(8)` brings it to the cap.
6. With `test.setHeat(1)`, at least one car enters `pulledover` as the cruiser passes and leaves it within 10 s. After a person goes down at `(0, 45)`, an ambulance stops within 8 m inside 60 s with a Sheriff Tarpon behind it, and the person is gone when it leaves.

## New names

Events `traffic:honk`, `traffic:pulledover`, `traffic:panic`, `traffic:ambulance`, `signals:phase`, `player:ability` (owned by actors) · state key `state.traffic` · test entries `test.traffic.list()`, `test.traffic.clear()`, `test.signals.at()`.
