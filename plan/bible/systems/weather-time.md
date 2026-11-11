# Bible · systems · Weather and time

One clock drives the sky, the lights, the crowds and the pay. Six weather states sit on top of it, with one fixed appointment: it rains hard at 15:15 every day. This file extends `04-systems.md` section 16 with the clock bands, the week, chances by hour, hurricane phases and categories, flooding and what each state does to grip, sight, traffic, people and sound.

Tier: A (the clock day 1; all six states, the 15:15 storm and the category 3 hurricane in D8-S1). C for weekday events, king tides and categories 1, 2 and 4. D for category 5.

## Purpose

Make the same street feel different six times a day without drawing anything new.
Give every other system one place to ask what time it is, how wet it is and how deep the water is.

## Data

Owner: `src/systems/clock.js`, `src/gfx/weather.js`.

### The clock

| Band | Hours | One game hour lasts | The band lasts |
|---|---|---|---|
| Day | 04:00 to 17:30 and 20:00 to 24:00 | 60 s | 17.5 min |
| Sunset | 17:30 to 20:00 | 120 s | 5 min |
| Night | 00:00 to 04:00 | 45 s | 3 min |

A full day is 25.5 real minutes, the "about 26" in `04`. A new game begins at 17:30 on a Tuesday. It is dark (lamps on, night crowds) from 20:00 to 06:00, which is wider than the fast band on purpose: neon hours are long, the small hours are short.

```js
speed = (h >= 17.5 && h < 20) ? 1 / 120 : (h < 4 ? 1 / 45 : 1 / 60);    // game hours per real second
hour += dt * speed * (ui.phoneOpen ? 0.3 : 1);
if (hour >= 24) { hour -= 24; day += 1; weekday = (day + 1) % 7; }       // 0 is Monday; day 0 is a Tuesday
```

### The week

The day counter is A, because brand deals pay on it. Named days and what they do are C unless marked.

| Day | What happens | Read by |
|---|---|---|
| Monday | Pelican garbage trucks on every street at dawn. The association inspects lawns. | `traffic.md` |
| Tuesday | Domino league in Domino Park at 18:00. Two-for-one at the Starlite at 20:00. | crowds |
| Wednesday | Cruise ship in port: Tideline full of tourists from 10:00 to 17:00. | `people.md`, `traffic.md` |
| Thursday | Open-mic at Wet Paint. Street race meet at the Tank Farm at 23:00. | traffic |
| Friday | Race night at the Speedbowl at 19:00. Humidity is full. | crowds, traffic |
| Saturday | Farmers' market in Domino Park at 08:00. Launch day at Cape Calamity at 14:00, usually scrubbed (D). Yacht party at 21:00. | crowds |
| Sunday | Golf tournament. Boat parade off Tideline at 16:00. Shops shut at 18:00 and buses stop at 20:00. | shops, `transit.md` |
| Every day | Brand deals at 09:00 (A). The storm at 15:15 (A). | |

### What each state does

| id | Name | `wet` | Road grip | Fog range | Wind km/h | Traffic | People | Waves m |
|---|---|---|---|---|---|---|---|---|
| `clear` | Clear | 0 | 1.0 | × 1.0 | 5 to 15 | × 1.0 | × 1.0 | 0.15 |
| `haze` | Humid haze | 0 | 1.0 | × 0.7 | 0 to 8 | × 1.0 | × 0.9 | 0.1 |
| `storm` | Afternoon storm | 1 | 0.8 | × 0.5 | 35 to 60 | × 0.8 | × 0.3 | 0.5 |
| `tropical` | Tropical storm | 1 | 0.8; flooded 0.5 | × 0.4 | 70 to 110 | × 0.5 | × 0.1 | 1.0 |
| `hurricane` | Hurricane | 1 | 0.8; flooded 0.5 | × 0.3 | by category | × 0.15 | 0 | 1.8 |
| `fog` | Swamp fog | 0.2 | 1.0 | × 0.25 | 0 to 5 | × 0.7 | × 0.5 | 0.1 |

- Fog range multiplies both ends of the fog in `02-world.md` (300 to 1,400 m on a laptop, 150 to 700 m on a phone). Weather may shrink the detail rings to match, never grow them.
- Swamp fog is local to Mudcat Glades, Heron Marsh and Lake Serenity. The rest of the city keeps its own state.
- Sound: haze turns the cicadas up. Storm adds rain and thunder. Tropical adds a wind howl. Hurricane adds a roar, debris knocks and gaps in the city hum as power flickers. Fog puts a low-pass at 2 kHz on everything and brings the frogs forward.
- Light, from `07`: storm pulls saturation down 30% and adds blue-grey; hurricane adds green to the sky and flicker to district lights; after rain everything is 10% more saturated for five in-game minutes.
- In rain, cars run wipers and headlights and people run for cover under the nearest awning within 30 m.

### Chances by hour

Rolled at the start of each band from `hash(saveSeed, day, band)`, so a save always gets the same weather.

| Band | Clear | Haze | Storm | Tropical | Swamp fog, in its zones |
|---|---|---|---|---|---|
| 04:00 to 07:00 | 68% | 30% | 0 | 2% | 70% |
| 07:00 to 11:00 | 70% | 28% | 0 | 2% | 10% |
| 11:00 to 15:15 | 43% | 55% | 0 | 2% | 0 |
| 15:15 to 15:55 | 0 | 0 | 100% | | 0 |
| 15:55 to 20:00 | 75% | 20% | 3% | 2% | 0 |
| 20:00 to 04:00 | 80% | 15% | 3% | 2% | 35% |

A tropical storm lasts 3 to 5 game hours, then the table resumes. That is about one every 8 game days. Hurricanes are not on the table.

### The 15:15 storm

| Game time | What |
|---|---|
| 14:45 | haze thickens, cloud builds over the bay |
| 15:10 | first thunder, far off |
| 15:15 | a wall of rain crosses the view from the sea in 4 s. `weather:changed { kind: 'storm', reason: 'daily' }`. `wet` passes 0.5 inside 20 s and reaches 1 by 40 s. Lightning every 8 to 20 s |
| 15:55, give or take 4 minutes by the day's seed | the rain stops in 10 s |
| 15:55 to 16:10 | a rainbow to the north over the city; roads steam; `wet` falls to 0 over 6 game minutes |

It lasts about 40 in-game minutes, which is 40 real seconds. It is skipped only when a tropical storm or hurricane is already running or a mission has locked the weather.

### Hurricane categories

| Category | Wind km/h | Rain | Flood level m | Depth on a 0.7 m street | Landfall lasts | Also shuts | Tier |
|---|---|---|---|---|---|---|---|
| 1 | 120 to 150 | × 1.5 | 0.8 | 0.1 m | 2 game hours | the beach, pier rides, the Bay Ferry, markets | C |
| 2 | 150 to 180 | × 2 | 0.9 | 0.2 m | 2 | buses, Baylink, the airport, every shop but Storm Mart | C |
| 3 | 180 to 210 | × 2.5 | 1.0 | 0.3 m | 3 | taxis, helicopters; traffic falls to 15% | A |
| 4 | 210 to 250 | × 3 | 1.15 | 0.45 m | 3 | barriers on the Longspan and Sandpiper Bridge; two districts dark at a time; traffic 5% | C |
| 5 | 250 and up | × 3.5 | 1.3 | 0.6 m | 4 | all power but the Spire and Bayhaven General; no traffic; Heron Walk Drive under water | D |

Each row includes the rows above it. Nobody is on the street in any category. Category 3 is the story's storm, the day 8 drop and what `test.setWeather('hurricane')` gives: flooded low streets at 0.3 m with grip 0.5. After the story a hurricane arrives about one game day in 12, with a warning on every station; category odds are 35, 30, 20, 10 and 5%.

### Flooding and the king tide

`state.weather.flood` is a water level in metres above the mean sea. Depth at a point is `max(0, flood - streetHeight)`. At 0.05 m or more the surface is flood water (grip 0.5). Cars stall at 0.8 m.

| Street | Height m |
|---|---|
| Marsh Road, off its bridges | 0.5 |
| Mudcat Road at its three creek dips (`x` = -1800, 300, 2000) | 0.5 |
| Breakwater Road; side tracks on the Pelican Keys; Coot Circle by Lake Serenity | 0.6 |
| Heron Walk Drive from `x` = 900 to 1600; Seagrape Street in West End; Calle Uno and Calle Dos west of Avenida Campana; the Cruise Basin apron | 0.7 |
| Pier Road | 0.8 |
| Everywhere else | 1.5 or more. Meridian 2.5. Decks never flood |

```js
kingDay = day % 5 === 4;                                   // every fifth day
tide    = kingDay && near(hour, 9.5, 21.83, 0.75) ? 0.85 : 0.3;   // 90 game minutes round each peak, eased over 20
flood   = Math.max(tide, { tropical: 0.8, hurricane: [0, 0.8, 0.9, 1.0, 1.15, 1.3][category] }[kind] || 0);
```

A king tide puts 0.15 m on the 0.7 m streets under a clear sky, and 0.35 m on Marsh Road. At category 5 Marsh Road and the Mudcat dips reach 0.8 m and stop cars; the Bullfrog and the Gatorback still get through.

### Wind

```js
gust  = 0.6 + 0.8 * noise(t / 5);                              // 0.6 to 1.4
aWind = Math.pow(wind * gust / 100, 2) * 220 * area / mass;    // m/s² sideways along windDir
// area: two-wheelers 0.6 (mass includes a 70 kg rider), cars 1, vans and trucks 3, buses 6
```

A Pinfish in a 60 km/h storm gust is pushed at 0.26 m/s²; in a 200 km/h hurricane, 2.9 m/s². A Heron in the same hurricane, 0.68. Palms bend in the vertex shader by `min(1, wind / 200) * 0.6` rad at the crown. Flying lawn furniture and umbrellas come out of the debris pool, up to half of it; a hit shoves a vehicle and knocks the player over for no more than 5 health.

## Hurricane phases

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Watch | 3 game hours before landfall | `weather:warning` on every station; the sky yellows; people fall to half | 3 game hours |
| Outer bands | the watch ends | tropical storm numbers; people leave within 30 s; traffic thins | 1 game hour |
| Landfall | the outer bands end | the category's wind and rain, sideways; the flood rises to its level over 10 game minutes; furniture flies; power flickers | half the landfall time |
| Eye | categories 3 and up only | 10 game minutes of no wind and no rain under a ring of cloud. Roads stay wet and flooded | 10 game minutes |
| Back wall | the eye ends | landfall again with the wind reversed | the other half |
| Aftermath | the back wall ends; below category 3, landfall ends | clear sky, `wet` 1, debris left lying, the flood drains over 30 game minutes, people return | 1 game hour, then `clear` |

A mission may hold any phase. The Spire Job locks category 3 at landfall. Eye of the Storm holds the eye. Going Viral sets 07:30, clear, `wet` 0.6. The fields are `state.mission.flags.weather = { kind, category, phase, frozen }` and `flags.clock = { hour, frozen }`.

## Events

Emits: `clock:hour { hour, day, weekday }`, `clock:sunset` at 17:30, `weather:changed { kind, from, reason }`, `weather:lightning { distance }`, and the new `clock:day { day, weekday }`, `weather:phase { phase, category }`, `weather:flood { level }`, `weather:warning { category, hours }`.
Listens: `mission:step`, `game:pause`, `save:loaded`, `quality:changed`.
State: `state.clock = { hour, speed, day, weekday }`, `state.weather = { kind, wet, wind, windDir, flood, category, phase }`.

## Edge cases

- Thunder follows its flash by `distance / 343` s. Under reduce motion there is no flash; the thunder still comes.
- A save made mid-storm restores the state, the phase and the time left.
- `test.setHour` to a time inside 15:15 to 15:55 begins the storm. Jumping past it does not replay it.
- When two things set the flood, the higher level wins. They never add.
- A storm beats fog in the swamp zones.
- The day 8 drop brings a category 3 hurricane at 21:00, on build day 8 only.
- With the clock frozen by a mission, payday and the 15:15 storm wait.

## Low and high

| | `low` | `high` |
|---|---|---|
| Rain streaks | 300 | 1,400 |
| Splashes | none | 200, pooled |
| Wet-road light streaks | lights within 60 m | within 150 m |
| Lightning | a sky tint | a sky tint and bloom |
| Flying props | 20 | 60 |
| Bloom, vignette, grade | none | on; bloom 0.6, more in rain |
| Flood surface | flat | ripples |
| LOD1 radius in fog or a hurricane | 4 chunks down to 2 | 6 down to 3 |

## Script checks

New test entries: `test.weather()` returns `state.weather` plus `{ rain, flying, depthAt(x, z) }`; `test.setDay(n)`.

1. Six real seconds advance the clock 0.1 ± 0.01 h at 12:00, 0.05 at 18:00 and 0.133 at 02:00.
2. `test.setWeather('storm')`: `rain` is above 0, `wet` passes 0.5 within 20 s, and `test.vehicle().mu` on a road is 0.8.
3. From clear weather at 15:10, `kind` is `storm` by 15:20 game time and `clear` again by 16:05.
4. `test.setWeather('hurricane')`: `test.stats().peds` is 0 within 30 s, `flying` is 1 or more, `flood` is 1.0, `depthAt(1300, 37)` is 0.3 ± 0.05 and `mu` there is 0.5. With reduce motion on, no flash is drawn.
5. `test.setDay(4)` and `test.setHour(9.5)` under a clear sky: `depthAt(1300, 37)` is 0.15 ± 0.05. On day 3 it is 0.
6. Running the clock through seven midnights fires `clock:day` seven times, `weekday` comes back to its first value, and day 0 reports Tuesday.

## New names

Weather ids `clear`, `haze`, `storm`, `tropical`, `hurricane`, `fog` · events `clock:day`, `weather:phase`, `weather:flood`, `weather:warning` · state fields `state.clock.day`, `weekday`, `state.weather.windDir`, `flood`, `category`, `phase`, `state.mission.flags.weather`, `flags.clock` · test entries `test.weather()`, `test.setDay()`.
