# Bible · systems · Transit

Bayhaven has six bus routes, a monorail loop called Baylink, the Bay Ferry and Bay Cab taxis. The player can ride any of them as a passenger, pay a taxi to skip a drive, or take a shift driving the bus. Everything here runs on roads and names from the canon, and none of it is needed to finish the story.

Tier: B for the bus routes, riding, taxi skips and the bus-driver job (Route Duty): all four are built in bonus session B-17. The Manatee bus as plain traffic is A; Bay Cab fares as a job you drive are A (day 7). The Baylink and the ferry routes inside the city are C. Ferry routes to the county are D.

## Purpose

Give a player who is tired of driving a way across town that still shows off the city.
Give Mags her old job back, with a meter that rewards a smooth ride.

## Data

Owner: `src/systems/transit.mod.js` (routes, riding, skips), `src/systems/activities/busroute.js` (the job). Buses are ordinary traffic cars that follow a route instead of picking turns (`traffic.md`).

### Services

| Service | Runs | A vehicle every | Fare | Stops for |
|---|---|---|---|---|
| Buses 1, 4, 15 | 05:00 to 24:00 | 100 to 150 real seconds | $2 | hurricanes of category 2 and up; Sunday after 20:00 |
| Bus 9 | all day and night | 90 s; 240 s from 00:00 to 05:00 | $2 | the same |
| Buses 7, 44 | 06:00 to 22:00 | 300 s | $2 | the same; tropical storms |
| Baylink | 06:00 to 24:00 | about 180 s | $3 | hurricanes of category 2 and up |
| Bay Ferry | 07:00 to 21:00 | 12 to 25 real minutes | $5 on foot | tropical storms, any hurricane |
| Bay Cab | always | on call, within 20 s | `$15 + $20` a kilometre | category 3 and up |

Posted times use the game clock. Vehicles move in real time.

### Bus routes

Each route runs out and back along the roads named, except the 15, which is a loop. Stops are seed positions.

**1 · Coral.** Coral Boulevard, round Spire Circle, west on Sixth Street, north on Egret Avenue, east on Union Avenue.
The Plaza `(52, 20)` · Flamingo Avenue `(52, -357)` · Bayfront `(52, -517)` · Commerce Way `(52, -677)` · Spire Circle `(52, -820)` · Radio Row `(-372, -840)` · Central Bus Terminal `(-100, -1280)`

**4 · Crosstown.** Commerce Way from end to end.
Mangrove Avenue `(-1972, -677)` · The Mercado `(-1500, -677)` · Ventanita Rosa `(-1012, -677)` · Egret Avenue `(-372, -677)` · Coral Boulevard `(52, -677)` · Exchange Avenue `(692, -677)` · Paint Factory `(1332, -677)` · Dockside `(1972, -677)` · Union Hall `(2612, -677)`

**7 · Keys Hopper.** Mangrove Avenue, Marsh Road, the Longspan.
Mangrove Avenue `(-1972, -677)` · Marsh Road `(-1972, -357)` · Flip-Flop Key `(-2000, 300)` · Tackle Key `(-2280, 520)` · Hammock Key `(-2550, 750)` · Lime Key `(-2830, 980)` · Last Key `(-3100, 1200)`

**9 · Beachline.** Heron Walk Drive from end to end. This is the bus Mags drives for fun.
West End `(-1560, 37)` · Pelican Rest `(-1250, 37)` · Tideline Motel `(-520, 37)` · The Plaza `(0, 37)` · Hotel Alba `(290, 37)` · Gullwing Pier `(600, 37)` · East Strand `(1300, 37)` · The Jetty `(1560, 37)`

**15 · Northgate loop.** North on Hospital Road, Gateway Boulevard west to the gate and then east to its end, back along Outlet Road, south on Galleria Road.
Central Bus Terminal `(-100, -1280)` · Bayhaven General `(-520, -1720)` · The Gatehouse `(-800, -1800)` · Gateway and Galleria `(-200, -1800)` · Wahoo World `(100, -1800)` · Lawyer Larry's `(420, -1800)` · Sheriff's HQ `(200, -2120)` · Galleria Flamingo `(-200, -2120)`

**44 · Glades Express.** Exchange Avenue, Route 44, Terminal Loop, Mudcat Road.
Exchange Avenue `(692, -677)` · Union Avenue `(692, -1317)` · Bayhaven International `(1500, -2000)` · The Layover Diner `(900, -2100)` · Mudcat Road `(700, -3000)` · Big Earl's `(-400, -2980)`

The 15 stops outside the Mallard Greens gate because the association voted against a stop inside. Sandpiper Isle has no bus and likes it that way. Routes 4 and 7 share the Mangrove Avenue stop; 1 and 15 share the terminal; 1 and 9 meet at the plaza.

```js
lap   = route.length / 7.8 + route.stops.length * 8;     // seconds: 28 km/h between stops, 8 s at each
buses = Math.ceil(lap / headway);
where = route.pointAt(((realSeconds + i * headway) % lap) / lap);   // bus i, worked out, not simulated
// a bus becomes a real Manatee when `where` comes inside 260 m, and goes back to a number past 320 m
```

### Baylink

One loop of 3,408 m, 9 m above the street on pylons every 40 m, as drawn in `world/meridian.md`. The beam runs between corners (-452, -517), (452, -517), (452, -1317), (132, -1317), (132, -997) and (-452, -997), and back. Trains run clockwise on the map in the order below.

| Station, in travel order | Seed |
|---|---|
| City Hall | `(-180, -517)` |
| Bayfront | `(212, -517)` |
| Exchange | `(452, -760)` |
| The Shell | `(452, -1290)` |
| Spire | `(90, -997)` |
| Radio Row | `(-452, -840)` |

Two trains of three cars run opposite each other at 50 km/h and wait 20 s at each station. A lap takes about 363 s. Nobody drives the Baylink. The ride camera sits in the nose of the front car.

### Bay Ferry

| Route | Calls at | Crossing | Tier |
|---|---|---|---|
| Pier Hopper | Bay Ferry terminal `(2300, 150)` · Gullwing Pier `(600, 440)` · west marina `(-1150, 110)` | 3.5 minutes a leg | C |
| Keys Run | terminal · Hammock Key `(-2550, 780)` · Last Key `(-3080, 1230)` | 11 minutes | C |
| Cape Calamity | terminal · East Bay · the Cape | | D |
| The Rig, night boat | Gullwing Pier · The Rig, 21:00 to 03:00 | | D |

The ferry sails at 30 km/h. A passenger stands at one of three rail spots and can look around. Taking a vehicle aboard (six spaces, $20) is D.

### Bay Cab as a paid skip

1. **Hail.** The Jobs app has "Call a Bay Cab": the nearest taxi within 300 m is sent, or one spawns out of view and reaches the nearest curb within 20 s. Or walk up to a taxi going under 20 km/h and tap the context button at a rear door. Holding it takes the car, as with any vehicle.
2. **Where to.** The waypoint if one is set, otherwise a tap on the map. Any road point on the open map.
3. **Fare.** Shown before you agree.
4. **Ride or skip.** Ride is real time from the back seat, with the radio. "Step on it" adds 50%: the driver holds 1.3 × the limit and runs ambers. Skip costs the same as a plain ride.

```js
fare = Math.ceil((15 + 20 * routeKm) * (weather.wet > 0.5 ? 1.5 : 1));   // routeKm from the road graph
// Pelican Rest to Park & Sons, 1.7 km: $49.   The plaza to the Sheriff's HQ, 2.6 km: $67.
// The plaza to Big Earl, 4.1 km: $97.          West edge to east edge, 6.4 km: $143.
```

**The cut-away** lasts 3.5 s. The door shuts, the camera rises 12 m, and a meter card ticks up to the fare while a dotted line draws the route on a small map. The destination's chunks build behind it; the card holds until they are ready, 6 s at most. The view fades in at the curb and the cab drives off. The clock moves on 10 game minutes. No skip of any kind moves the clock more than 30 game minutes, so paydays cannot be farmed.

### Driving the bus as a job

"Route Duty". Begin from any Manatee parked at the end of a route, or from the Jobs app.

| Rule | Value |
|---|---|
| A stop counts when | the bus is in the bay (14 m by 3.2 m), within 0.8 m of the curb line, under 3 km/h, with the handbrake held 1 s to open the doors |
| Due time | the lap formula above: 28 km/h between stops and 8 s at each |
| Boarding | one person every 0.6 s; 2 to 6 wait at a stop; up to 12 heads show through the windows |
| Comfort | begins at 1.0. Each rough event costs 0.05: braking harder than 6 m/s², cornering above 5 m/s², any hit over 2 m/s. Never under 0.5 |
| Early | the bus must wait for its due time |
| Ends | the last stop, any heat, 20 s out of the seat, or bus health under 40 |

```js
stopPay = (20 + 4 * boarded) * comfort * (late ? 0.7 : 1) * (driver === 'mags' ? 1.25 : 1);
runPay  = Math.min(400, sum(stopPay));        // inside the $40 to $400 band for side jobs
// route 9, eight stops, four boarding at each, comfort 0.9, on time: $259. As Mags: $324
```

Bus Driver Voice is allowed and clears the lane ahead.

## States

The rider, for bus, Baylink, ferry and taxi alike:

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Waiting | the player is within 6 m of a stop, station, dock or hailed cab | a prompt shows the route, the next arrival and the fare | the vehicle is there with doors open |
| Boarding | the context button; the fare is paid | walks in over 0.8 s; `transit:boarded` | seated |
| Riding | seated | window-seat camera that looks 120 degrees either way, or an outside view; the radio plays; the map shows the line | get off is pressed and a stop arrives; a skip is chosen; the vehicle is blocked for 20 s |
| Skipping | a stop or destination is picked | the cut-away; chunks build; the clock moves 10 game minutes a stop, 30 at most | chunks are ready |
| Getting off | arrival | the player stands on the sidewalk facing along the street; `transit:alighted` | 0.8 s |

A timetabled bus:

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Virtual | more than 320 m away | a position worked out from the clock | inside 260 m |
| Cruise | made real | follows its route in the curb lane with the usual 2 s gap | 40 m from a stop |
| Dwell | at the bay | signals, stops, doors open 8 s. Waits up to 15 s if the player is within 12 m | time is up |
| Depart | doors shut | signals and merges on a 2 s gap; `transit:arrived` was fired on stopping | in lane |

## Rules with heat and missions

- A taxi takes nobody with any heat: `transit:refused { reason: 'heat' }`.
- A bus takes you at heat 1 if you are unseen, and riding counts as hidden, so the drain is doubled. At heat 2 and above the driver refuses.
- Baylink and the ferry have staff at the gate: heat 0 only.
- Reaching heat 2 while aboard puts you off at the next stop.
- During a mission transit is off unless the step sets `allowTransit`.
- A cab will not enter a gated place you have not unlocked. It drops you at the gate.

## Events

Emits: `transit:boarded { mode, route, stop }`, `transit:alighted { mode, stop }`, `transit:skipped { mode, from, to, fare }`, `transit:arrived { route, stop }`, `transit:refused { reason }`, `transit:shift { route, state, pay }`.
Listens: `clock:hour`, `clock:day`, `weather:changed`, `weather:phase`, `heat:changed`, `mission:started`, `mission:completed`, `waypoint:set`.
State: `state.transit = { mode, route, stop, riding }`.

## Edge cases

- A fare the player cannot pay is declined before boarding. Nobody is thrown off for it later.
- If the bus catches fire everyone gets off and runs, the player included. It explodes 8 s later like any vehicle.
- A stop whose chunk is not loaded cannot be a skip target until the cut-away has built it.
- A real bus and its worked-out position can drift apart in traffic. On going virtual again it snaps back to the timetable, out of view.
- On Wednesdays an extra Manatee shuttles between the cruise terminal `(2500, 100)` and Gullwing Pier (see `traffic.md`).
- Saving aboard is not allowed. The autosave waits until you are on the sidewalk.

## Low and high

| | `low` | `high` |
|---|---|---|
| Real timetabled buses at once | 2 | 4 |
| Baylink trains drawn | 1 | 2 |
| Heads in bus windows | 6 | 12 |
| Baylink pylons | one merged mesh per chunk, LOD1 only | instanced, with the rail |
| Ferry wake | 12 segments | 24 |

## Script checks

New test entries: `test.transit.routes()`, `test.transit.board(mode, route, stop)`, `test.transit.taxi(x, z, { skip })`, `test.transit.state()`.

1. Every stop on the six routes is within 25 m of a lane on its named road, and each stop can be reached from the one before on the lane graph. The Baylink loop measures 3,408 ± 60 m with six stations.
2. At noon a route 9 bus reaches `(0, 37)` within 100 s and stays 8 ± 1 s.
3. Boarding there costs $2 and fires `transit:boarded`. A skip to Gullwing Pier puts the player within 15 m of `(600, 37)` in under 10 s, with the clock 10 to 30 game minutes on.
4. A cab from the plaza to the Sheriff's HQ charges `ceil(15 + 20 * routeKm)`, and a skip ends within 30 m of the destination, on a sidewalk.
5. At heat 1 a cab fires `transit:refused`. At heat 2 a bus does.
6. A scripted shift on route 9 that makes every bay on time with no rough events pays between $160 and $400. The same shift with ten hard stops pays at least 40% less.

## New names

Route names Coral (1), Crosstown (4), Keys Hopper (7), Beachline (9), Northgate loop (15), Glades Express (44) · ferry routes Pier Hopper, Keys Run · the job Route Duty · events `transit:boarded`, `transit:alighted`, `transit:skipped`, `transit:arrived`, `transit:refused`, `transit:shift` · state key `state.transit` · step field `allowTransit`.
