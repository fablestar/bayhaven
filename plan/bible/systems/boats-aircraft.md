# Bible · systems · Boats and aircraft

A boat is the same 2D body as a car with different rules for grip, drag and steering, plus a bow that lifts and a wake. An aircraft is that body with an altitude added, flown with arcade rules: it hovers or holds speed by itself, cannot stall and stops at 300 m. This file covers water handling, waves, docking, getting on and off, the two flyable aircraft and the blimp.

Tier: A for the Skipjack, Skimmer and Gatorback, depth and six marinas (D7-S2). B for the Minnow, the Hammerhead and more marinas. C for the Dragonfly, the Cormorant and the blimp as scenery. D for every other aircraft and the big boats.

## Purpose

Open the bay and the channels with the least new code: one body, new numbers.
Later, give the sky the same treatment without building flight physics.

## Data

Owner: `src/vehicles/boats.js`, `src/world/water.js`, `src/world/marinas.js`, and for tier C `src/vehicles/aircraft.mod.js`. The news helicopter in `src/vehicles/chopper.js` is an AI unit and belongs to `heat.md`.

### Boat presets

Top speed and mass for the first three are from `04-systems.md` section 3.

| id | Top km/h | Mass kg | Pull m/s² | Keel grip /s | Turn rad/s | Planes at | Draft m | Tier |
|---|---|---|---|---|---|---|---|---|
| `skipjack` | 95 | 900 | 5.0 | 2.2 | 0.9 | 55% of top | 0.4 | A |
| `skimmer` | 100 | 250 | 7.5 | 3.5 | 1.4 | 40% | 0.25 | A |
| `gatorback` | 80 | 600 | 4.0 | 0.9 | 1.1 | never | 0.05 | A |
| `minnow` | 35 | 200 | 2.0 | 1.8 | 1.2 | never | 0.2 | B |
| `hammerhead` | 105 | 1,400 | 5.5 | 2.4 | 0.9 | 55% | 0.5 | B |
| `swan` | 8 | 150 | 0.8 | 1.5 | 1.0 | never | 0.15 | C |

### Water rules

| Rule | Value |
|---|---|
| Wading, swimming | wading to 1.2 m, swimming beyond at 2.0 m/s |
| Cars | stall at 0.8 m and drift to shore. The Bullfrog wades to 1.0 m |
| Brakes | none. The brake input is reverse thrust at 40% of pull |
| Coasting drag | 0.25 /s |
| The hump | pull × 0.8 until the hull planes |
| Steering | needs thrust: turn × `(0.35 + 0.65 * gas)` |
| Bow lift | rises to 0.14 rad at planing speed, settles to 0.06 rad at top speed |
| Wake | two ribbons from the stern, each point living 3 s and spreading at 0.5 m/s |

### The boat step

```js
// the body and steps 5 to 8 are the car's (driving.md). Steps 1 to 4 are replaced by:
const s = Math.abs(v.vf) / p.vTop, planing = p.plane && s > p.plane;
const pull = p.A * (planing ? 1 : 0.8);
v.vf += (inp.gas * pull * (1 - v.vf / p.vTop) - inp.brake * 0.4 * p.A) * DT;
if (!inp.gas) v.vf -= v.vf * 0.25 * DT;
if (depthAt(v) < p.draft) v.vf -= v.vf * 6 * DT;                     // aground
const wWant = inp.steer * p.turn * (0.35 + 0.65 * inp.gas) * Math.min(1, Math.abs(v.vf) / 4) * Math.sign(v.vf || 1);
v.w  += (wWant - v.w) * Math.min(1, 2.5 * DT);
v.vl *= Math.exp(-p.keel * DT);                                      // 2.2 /s against a car's 6.5: boats carve wide

pitch = planing ? lerp(0.14, 0.06, (s - p.plane) / (1 - p.plane)) : 0.14 * s / (p.plane || 1);
v.y   = seaLevel + wave(v.x, v.z, t);                                // roll and extra pitch from bow, stern and both sides
```

### Waves

```js
H = { clear: 0.15, haze: 0.1, fog: 0.1, storm: 0.5, tropical: 1.0, hurricane: 1.8 }[weather.kind];   // metres, crest to trough
L = 18 + 12 * H;                                                       // metres between crests
wave = (x, z, t) => H / 2 * Math.sin(2 * Math.PI / L * (x * wind.x + z * wind.z) - 1.4 * t);
```

| Wave height | Effect |
|---|---|
| any | heading within 45 degrees of the wind: top speed × `(1 - 0.12 * H)` |
| 0.5 m or more | a craft under 400 kg leaves the water off a crest above 60 km/h and falls back at 18 m/s². A Skimmer that lands with slip over 0.6 rad throws its rider |
| 1.8 m | a craft under 700 kg is swamped: the engine cuts for 3 s in every 20 |

Waves alone never sink a boat. At zero health it explodes like any vehicle and the shell goes under.

### Shallows and land

| Where | Skipjack, Hammerhead | Skimmer, Minnow | Gatorback |
|---|---|---|---|
| Water shallower than the draft | aground: drag 6 /s, sand sprays, reverse to get off | the same | carries on; it needs 5 cm |
| Wet grass and marsh | stuck | stuck | 30 km/h at most, steering at 40% |
| Dry land | slides to rest at 9 m/s² | the same | 12 km/h, sparks, 2 health a second |

A boat left on land or adrift returns to its marina after 2 game hours.

### Marinas

| # | Marina | Seed | Tier |
|---|---|---|---|
| 1 | West marina, Yacht Club Bayhaven | `(-1150, 90)` | A, day 7 |
| 2 | Gullwing Pier landing | `(600, 440)` | A, day 7 |
| 3 | Cruise Basin | `(2500, 130)` | A, day 7 |
| 4 | East Strand slip | `(1500, 95)` | A, day 7 |
| 5 | Motel Row beach slip | `(-520, 85)` | A, day 7 |
| 6 | West End ramp | `(-1580, 100)` | A, day 7 |
| 7 | Captain Nilda's dock (Gatorbacks) | `(1200, -3250)` | A, day 8 |
| 8 | Sandpiper Isle south docks | `(-1000, 880)` | B |
| 9 | Flip-Flop Key | `(-2000, 330)` | B |
| 10 | Hammock Key houseboat marina | `(-2550, 780)` | B |
| 11 | The Stilt House | `(-2400, 640)` | B |
| 12 | Last Key | `(-3080, 1230)` | B |
| 13 | The fish camp | `(2300, -3350)` | B |
| 14 | Lake Serenity boathouse (Swans) | `(-2700, -1900)` | C |

Three boats cross the bay on fixed routes on `high`, one on `low`.

### Docking, getting on and off

- A berth is the boat's length plus 2 m by its beam plus 1.5 m, marked by two posts.
- **Assisted:** within 12 m of a free berth and under 15 km/h, a Dock prompt appears. Pressing it eases the boat in over 1.2 s and ties it.
- **By hand:** stopped inside the berth under 5 km/h for 1 s, it ties itself. Either way `boat:docked { marina }` fires.
- A tied boat does not move. An untied empty boat drifts downwind at 0.3 m/s.
- **On, from a dock or the beach:** within 2.5 m of the boarding point, the context button, a 0.8 s hop.
- **On, from the water:** swim to within 1.5 m of the stern and climb in over 1.2 s.
- **Off:** onto a dock if one is within 2.5 m; otherwise a dive, and you are swimming.
- **Bailing above 30 km/h:** the lead skips across the water three times, then swims. No damage.
- A Skimmer with nobody on it idles and stops within 10 m.

## Aircraft (C)

### Presets and controls

| id | Kind | Top km/h | Mass kg | Climb, sink m/s | Tier |
|---|---|---|---|---|---|
| `dragonfly` | helicopter | 160 | 1,100 | 8, 10 | C |
| `cormorant` | seaplane | 220 | 1,300 | a quarter of its speed up to 12, 10 | C |
| `gnat` | gyrocopter | 110 | 300 | 5, 8 | D |

| Input | Helicopter | Seaplane |
|---|---|---|
| Gas and brake | tilt forward and back: 9 m/s² along the nose | throttle up and down |
| Steer | yaw: 1.6 rad/s in a hover, 0.8 at top speed | bank and turn, up to 0.7 rad/s |
| Handbrake key, pad right trigger | climb | nose up |
| Special key, pad left trigger | descend | nose down |
| Touch | the stick moves; a slider on the right climbs and descends | the same |

### The flight step

Altitude `y` and vertical speed `vy` are added to the 2D body. Bank and nose angle are only drawn.

```js
// helicopter
vyWant = inp.climb ? 8 : inp.sink ? -10 : 0;                     // hands off, it hovers
acc    = (inp.gas - inp.brake) * 9 * (1 - Math.abs(v.vf) / 44.4);
if (!inp.gas && !inp.brake) v.vf -= v.vf * 0.5 * DT;             // stops in about 3 s
v.w   += (inp.steer * lerp(1.6, 0.8, Math.abs(v.vf) / 44.4) - v.w) * Math.min(1, 4 * DT);
v.vl  *= Math.exp(-2.5 * DT);

// seaplane, once in the air
v.vf  += (lerp(16.7, 61.1, throttle) - v.vf) * Math.min(1, 0.6 * DT);   // never under 60 km/h
v.w    = inp.steer * 0.7 * clamp(v.vf / 40, 0.5, 1);
vyWant = (inp.climb - inp.sink) * Math.min(12, 0.25 * v.vf);
if (v.vf < 19.4) vyWant = Math.min(vyWant, -4);                  // under 70 km/h it sinks gently and still steers

// both
if (v.y > 280 && vyWant > 0) vyWant *= (300 - v.y) / 20;         // the ceiling
v.vy += (vyWant - v.vy) * Math.min(1, 3 * DT);
v.y   = Math.min(300, v.y + v.vy * DT);
bank  = clamp(v.w * v.vf * 0.02, -0.5, 0.5);                     // drawn only; the seaplane may reach 0.87
```

There is no stall, no spin and no nose drop. Building boxes carry a height, so the same spatial hash stops an aircraft against a tower.

### Taking off and landing

| | Helicopter | Seaplane |
|---|---|---|
| Start | the rotor takes 2.5 s to spin up | leaves the water at 90 km/h, after about 300 m. Also the runway, or any straight road of 250 m |
| A good landing | anything flat and at least 8 m by 8 m, sinking slower than 4 m/s | on water under 130 km/h, sinking slower than 5 m/s. Then it is a boat: keel 1.5 /s, 25 km/h |
| A hard one | over 6 m/s: damage `(speed - 6) * 8`. A rotor into a wall: 15 and a bounce | on land off the runway it slides on its floats: 20 damage, 10 m/s² |
| On water | floats 5 s, settles, the pilot swims, the aircraft is returned to its pad | home |

| Landing spot | Seed | Notes |
|---|---|---|
| Hangar Row | `(2400, -2200)` | where the Dragonfly lives |
| The runway | `(1000, -2450)` to `(2800, -2450)` | both aircraft |
| Bellweather mansion helipad | `(-1000, 780)` | yours with the mansion |
| Bayhaven General roof | `(-500, -1700)` | |
| Cruise terminal roof | `(2500, 100)` | |
| Sheriff's HQ roof | `(200, -2150)` | landing here is `trespass` |
| Seaplane moorings | the west marina, Hammock Key, the fish camp | the Cormorant lives at the fish camp |

### Limits

- **Ceiling:** 300 m. Climb fades from 280 m.
- **Edge:** 200 m inside the world rectangle a line reads "Bayhaven Tower: the sky is closed past here. Turn back." and the aircraft is yawed round at 0.5 rad/s. `aircraft:turnback`.
- **Wind:** the `aWind` formula in `weather-time.md` with area 2. A tropical storm is flyable and hard. In a hurricane the engine will not start.
- **Damage:** under 40 health the aircraft sinks at 5 m/s and still steers. At 0 the pilot bails first under a beach umbrella, falling at 4 m/s and steering at 6 m/s, and the aircraft explodes like any vehicle.
- **Heat:** the Sheriff's Horsefly follows and its downwash shoves you sideways at 3 m/s². Stunts in view add viewers × 2. Landing under cover is how you lose it.
- **Streaming:** above 60 m only the chunk below keeps full detail, for its roofs. The LOD1 ring is unchanged and costs one draw call per 4 × 4 group of chunks, so flying is cheaper to draw than driving. At 220 km/h a chunk goes by every 2.6 s.

### The blimp

The Pufferfish is scenery. It circles `(600, 200)` at a radius of 900 m, 120 m up, at 25 km/h: a lap every 13.6 minutes. It carries one sign from the sign atlas (Lawyer Larry, SPF 1000, Bayhaven Tomorrow), lit at night, and at heat 5 the sign shows the viewer count. An aircraft that touches it bounces off softly with a squeak. In a tropical storm or hurricane it is moored at Hangar Row. One draw call, 300 triangles.

## States

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Moored | tied at a berth | does not move | boarded and untied |
| Afloat | untied, below planing speed | the boat step, bow rising | planing speed, or too shallow |
| Planing | above its planing speed | full pull, bow settles, long wake | slows |
| Aground | depth under draft | drag 6 /s, `boat:aground` | reversed into deeper water |
| Beached | on dry land | slides to rest, `boat:beached` | pushed back within 2 m of the water, or 2 game hours |
| Parked (aircraft) | on a pad, engine off | nothing | boarded |
| Flying | off the ground | the flight step | touches down, or health under 40 |
| Gliding | health under 40 in the air | sinks at 5 m/s, steers | lands, or the pilot bails |

## Events

Emits: `boat:docked`, `boat:aground`, `boat:beached`, `aircraft:takeoff`, `aircraft:landed { pad }`, `aircraft:ceiling`, `aircraft:turnback`, plus the vehicle events from `driving.md` (`jump:landed` fires for a wave jump).
Listens: `weather:changed`, `weather:phase`, `chunk:loaded`, `heat:changed`.
State: `state.vehicle` gains `depth`, `planing` and `altitude`.

## Edge cases

- A boat that hits a swimmer follows the vehicle rule: a tumble at 50 km/h or less, down above it. For the player, `(dv - 4) * 5`.
- A boat hitting a dock slides along it like a car along a wall.
- Leaving a seat in the air is a bail, umbrella included, from any height over 10 m.
- An aircraft cannot be stored except on a pad or mooring the player owns.
- If the chunk under a moored boat unloads, the boat is remembered by its marina, not by the chunk.

## Low and high

| | `low` | `high` |
|---|---|---|
| Wake ribbon points, all boats in one mesh | 12 each | 24 each |
| Wave samples per boat | 2 | 4 |
| Spray puffs | 8 | 32 |
| Boats on fixed routes | 1 | 3 |

## Script checks

1. A Skipjack spawned at `(600, 420)` reaches 70 km/h within 20 s. Above 55% of top speed `test.vehicle().planing` is true and pitch is between 0.05 and 0.15 rad.
2. A car driven into the sea fires `vehicle:stalled` at a depth of 0.8 ± 0.05 m. The player on foot is swimming beyond 1.2 m.
3. A Skipjack stopped in a berth at the west marina fires `boat:docked` within 2 s and has moved less than 0.2 m after 30 s.
4. A Gatorback on grass never passes 30 km/h. A Skipjack run at the beach at 60 km/h fires `boat:beached` and rests within 20 m of the waterline.
5. (C) Dragonfly: 60 s of climb never passes 300 m and fires `aircraft:ceiling`. With no input for 5 s, altitude changes by under 1 m and speed falls under 2 m/s.
6. (C) Cormorant: over 60 s of random input in the air its speed never falls under 60 km/h, and at the edge it fires `aircraft:turnback` and stays inside the world rectangle.

## New names

Marinas East Strand slip, Motel Row beach slip, West End ramp, Lake Serenity boathouse · events `boat:docked`, `boat:aground`, `boat:beached`, `aircraft:takeoff`, `aircraft:landed`, `aircraft:ceiling`, `aircraft:turnback` · state fields `state.vehicle.depth`, `planing`, `altitude` · module `src/vehicles/aircraft.mod.js`.
