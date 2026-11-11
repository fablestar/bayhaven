# Bible · systems · People

The people of Bayhaven are instanced box figures with seven states that read from a moving car: walk, hang out, flee, film you, fall over, get up, and down. Filming is the signature: trouble makes phones come out, and phones make followers. This file extends `04-systems.md` section 6 with twelve archetypes, the sidewalk graph, the follower maths and a reaction table.

Tier: A (eight kinds, seven states, filming, followers, day 3). B for fame reactions. C for four more kinds and weekday crowds.

## Purpose

Put a crowd on every sidewalk for eight draw calls and make it the audience for whatever the player does.
Make that crowd matter: a person hit hard or shot stays down, an ambulance comes, and the heat rises.

## Data

Owner: `src/actors/peds.js`, with the tumble in `src/actors/tumble.js`. Body: a circle of radius 0.35 m, 1.8 m tall. Every bystander has 50 health. Everyone on the street is an adult; there are no children in Bayhaven's crowds.

### Archetypes

Courage is how hard a person is to scare (0 to 1). Films is the chance they raise a phone.

| id | Walk m/s | Flee m/s | Courage | Films | Where | Hours | Tier |
|---|---|---|---|---|---|---|---|
| `tourist` | 1.2 | 4.0 | 0.3 | 0.9 | Tideline, Meridian, the pier | 09 to 22 | A |
| `jogger` | 3.2 | 5.5 | 0.5 | 0.2 | Heron Walk, Bayfront Park, Fairway Drive | 05:30 to 09, 17 to 20 | A |
| `retiree` | 1.0 | 2.5 | 0.7 | 0.4 | Mallard Greens, West End, Domino Park | 06 to 19 | A |
| `skater` | 4.0 | 6.0 | 0.8 | 0.8 | the promenade, plazas, The Paintworks | 10 to 23 | A |
| `office` | 1.5 | 4.5 | 0.4 | 0.5 | Meridian | 07 to 19, thickest 12 to 13:30 | A |
| `docker` | 1.4 | 4.0 | 0.9 | 0.3 | Rustwater | shifts change at 06, 14, 22 | A |
| `clubber` | 1.3 | 4.0 | 0.6 | 0.9 | The Paintworks, the neon end of Tideline | 20 to 04 | A |
| `beachgoer` | 1.1 | 3.5 | 0.35 | 0.7 | the sand, `z` 50 to 80 | 08 to 18:30 | A |
| `courier` | 1.8 | 5.0 | 0.6 | 0.2 | Meridian, Radio Row | 08 to 18 | C |
| `vendor` | 0.8 | 3.0 | 0.75 | 0.3 | Palma Vieja, the Mercado | 07 to 21 | C |
| `shopper` | 1.2 | 3.5 | 0.3 | 0.6 | Northgate, the Galleria | 09 to 21 | C |
| `traveller` | 1.4 | 3.5 | 0.25 | 0.7 | Runway Flats, the cruise terminal | flights and ship days | C |

### Tuning

| Item | Value |
|---|---|
| People on screen | 60 on `high`, 20 on `low` |
| Spawn ring | 60 to 140 m, out of view. Removed past 150 m |
| Filming radius | 40 m with line of sight |
| A light hit | a vehicle at 50 km/h or less: a tumble, `kmh - 10` health lost, walking again within 8 s |
| A hard hit | a vehicle over 50 km/h: down |
| Sidewalk width | 3 m on streets, 4 m on avenues, 6 m on boulevards |
| Personal space | 1.2 m; sidestep to the right |

### Targets by district

People on `high`; `low` is a third.

| District | 07 to 19 | 19 to 24 | 00 to 05 |
|---|---|---|---|
| Tideline | 60 | 40 | 6 |
| Meridian | 50 | 25 | 4 |
| Palma Vieja | 45 | 40 | 6 |
| The Paintworks | 25 | 60 | 30 |
| Rustwater | 20 | 10 | 8 |
| Northgate | 35 | 20 | 3 |
| Mallard Greens | 20 | 6 | 0 |
| Runway Flats | 25 | 15 | 5 |
| Mudcat Glades | 4 | 2 | 0 |
| The Islands | 15 | 15 | 2 |

Weather multiplies the target: humid haze 0.9, afternoon storm 0.3, swamp fog 0.5, tropical storm 0.1, hurricane 0 within 30 s. On Wednesdays from 10:00 to 17:00 Tideline's `tourist` weight triples (C).

## States

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Walk | spawned, or another state ends | follows the sidewalk graph to a spot 80 to 300 m away, obeying the crossing rules | arrives, or a stimulus fires |
| Hang out | reaches a bench, wall, towel, queue or table | sits, leans, chats, sunbathes or looks at a phone for 20 to 90 s | timer, or a stimulus |
| Flee | the reaction table says run | runs at flee speed 30 to 60 m directly away, then to the nearest awning or doorway; shocked face | 6 s with no threat |
| Film | wins the filming roll | stops, raises one arm with a phone, turns to track the player, steps up to 8 m to keep a clear view. Never steps into the road | interest ends plus 2 s, or a stronger scare |
| Fall over | a light hit, a shove, or sprinted into over 6 m/s | tumbles on a 10-point rope body, lies dazed for 3 s; emits `ped:hit` | 3 s after coming to rest |
| Get up | the 3 s end | stands in 1.2 s, dazed face, one bark, walks off at 0.8 × speed | 1.2 s |
| Down | a hard hit, or health at zero from a shot, a blast or repeated hits | tumbles and lies still. Emits `ped:down { cause, by }`. An ambulance is called (`traffic.md`) | never gets up. Collected by the crew, or removed after 90 s out of view |

Mags's horn is not a state: it pauses whatever a person is doing for 5 s. Health, weapons and what counts as a crime are in `combat-stealth.md` and `heat.md`.

## The sidewalk graph

`nav.js` builds it from the roads. Each road side gives one edge, `halfWidth + 1.5` m from the centre line, with nodes at block corners. Each junction arm gives a crossing edge flagged `signal` or `plain`. Hand-placed extras: the Heron Walk promenade (`z` 44 to 50), the Gullwing Pier deck, Wet Paint Alley, plazas, boardwalks, and beach areas where people pick random points. People keep right, hold a side offset inside ± 1 m, and avoid each other through a 4 m spatial hash.

### Crossing rules

1. At a `signal` crossing a person waits at the curb for the walk light: the green of the road beside them, less its last 4 s. They cross at 1.2 × walk speed and jog if the amber catches them.
2. At a `plain` crossing they go when no car inside 12 m is approaching faster than 3 m/s. Cars see them in the 20 m cone and stop.
3. Jaywalking, per block: `skater` 0.3, `courier` 0.25, `clubber` 0.2 at night, `tourist` 0.1, `retiree` 0, others 0.05. Only when no car is inside 40 m.
4. Nobody walks on the expressway deck, a causeway or a runway.
5. A car under 10 km/h pushes nobody over: people step aside.

## Filming and followers

Something interesting sets a timer. While it runs, or while the show is live, everyone filming pays: `+5` per person filming per second, and `+1` per 100 viewers per second at heat 3 and above.

| Trigger | Interest lasts |
|---|---|
| Crash at 5 m/s or more | 4 s |
| Drift | while it runs, plus 2 s |
| Jump with 0.4 s of air or more | until 3 s after landing |
| Chase: heat 1 or more and a cop within 60 m | all the time |
| A vehicle explodes | 6 s |
| Hydrant geyser | 5 s |
| Flare gun | 6 s |
| Three Flounder hops inside 2 s | 3 s |

Gunfire and people going down are not on the list. They empty the street; they do not fill a feed.

When a timer begins, each person within 40 m who can see the player rolls `films` once (× 1.25 past 10,000 followers). Winners raise a phone after 0.3 to 1.5 s. If three or more people are in range, at least three always film.

```js
interest = Math.max(0, interest - dt);
let gain = 0;
if (interest > 0 || heat.level >= 3) gain += 5 * filming * crowdScale * dt;
if (heat.level >= 3)                 gain += heat.viewers / 100 * dt;
followers += gain * (goLive ? 2 : 1);
crowdScale = 60 / pedCap;        // 1 on high, 3 on low: the same stunt pays the same on a phone
```

One-off bonuses, paid only if someone is filming or the show is live, and doubled by Go Live: a banked drift `score / 20`, a jump 10 per metre, a hydrant geyser under a car 50, a postcard photo 250.

Worked example: a 6 s drift past five people filming on `high` earns `5 × 5 × 6 = 150`, plus 100 for a 2,000-point drift. With Go Live on, 500. Teo's own stream counts as one person filming while Go Live runs.

## Reactions

Codes: W walks on · L looks · F films · R runs · J jumps aside · C takes cover · S shouts a bark · V waves · Z freezes · T tumbles · H helps: kneels by the person until the ambulance comes. Two codes mean first one, then the other. Columns are the twelve archetypes in table order.

```text
stimulus                                          tou jog ret ska off doc clu bea cou ven sho tra
car on the sidewalk within 6 m                    JR  J   JS  JF  JR  JS  JF  R   J   JS  R   R
horn within 15 m                                  L   W   S   W   L   S   V   L   W   S   L   J
Mags's Bus Driver Voice within 30 m               Z   Z   Z   Z   Z   Z   Z   Z   Z   Z   Z   Z
crash, or sirens and a chase, within 40 m         F   L   L   F   F   L   F   F   L   L   F   F
drift, jump or hop within 40 m                    F   L   S   F   L   L   F   F   W   L   F   F
shots within 60 m                                 R   R   C   R   R   C   R   R   R   C   R   C
a vehicle explodes within 40 m                    R   R   C   RF  R   C   RF  R   R   C   R   R
someone goes down within 40 m                     R   H   C   R   R   H   R   R   R   C   R   R
bumped by the player on foot                      S   W   S   S   S   S   V   S   W   S   S   S
a light hit from a vehicle                        T   T   T   T   T   T   T   T   T   T   T   T
rain begins                                       C   W   C   C   C   W   C   R   W   C   C   C
a lead with 10,000 followers within 10 m (B)      F   V   W   F   L   W   F   V   W   V   F   F
```

A `docker` who is bumped shoves back and the player stumbles for 0.5 s. A person who helps leaves at the next shot.

## Crowds

A crowd is one object that owns its members' positions and a shared animation clock. Members have no brain of their own until the crowd scatters.

| Crowd | Size `high` / `low` | Where and when | Tier |
|---|---|---|---|
| The queue at Ventanita Rosa | 6 / 3 | `(-1020, -640)`, all hours | A |
| Beach towels | 2 to 4 each | the sand, 08 to 18:30 | A |
| Domino tables | 12 / 4 | Domino Park `(-1400, -880)`, 10 to 22; league Tuesday 18:00 | C |
| The line outside Humidity | 10 / 4 | `(1450, -950)`, 21 to 03, double on Friday | C |
| Farmers' market | 30 / 10 | Domino Park, Saturday from 08:00 | C |
| Flamingo Flash Mob | 150 / 150 | the beach at `(0, 64)` at sunset, day 3 build only | A, a drop |

**The flash mob.** A grid 15 wide and 10 deep at 1.6 m spacing. One dance clock at 104 beats a minute drives four moves of two beats each: arms up, step left, step right, spin. It is drawn through the same six instanced meshes. While it is inside 150 m, ordinary street people drop to 20 on `high` and 8 on `low`. Walk in and dancers within 2 m shuffle 0.6 m aside; the two nearest stop and film. A vehicle within 6 m, or a shot, breaks the grid for good: dancers flee and the hit rules above apply to each of them.

## Instancing limits

- Six `InstancedMesh`: head, torso, two arms, two legs. One more for hats, bags and phones, one for blob shadows. Eight draw calls or fewer for everyone.
- Capacity per mesh: 256 on `high` (60 people, 150 dancers, 46 spare for deputies, guards, medics and bailed drivers), 192 on `low`.
- Per instance: a matrix, a colour, an atlas cell for the face or shirt.
- Pose rate: every frame within 30 m, 15 times a second out to 80 m, a two-pose walk beyond.
- People who are down are posed once and cost no updates. At most 12 are kept on `high` and 4 on `low`; beyond that the oldest out of view goes.

## Events

Emits: `ped:hit { speed }`, `ped:filming { count }` twice a second while the count changes, and the new `ped:down { cause, by }`, `ped:fled { count }`, `ped:recognised`, `crowd:formed { id, size }`, `crowd:scattered { id }`.
Listens: `vehicle:crash`, `vehicle:blast`, `drift:start`, `drift:end`, `jump:landed`, `vehicle:hop`, `prop:broken`, `weapon:fired`, `combat:down`, `player:ability`, `heat:changed`, `weather:changed`, `clock:hour`, `followers:milestone`, `signals:phase`.
State: `state.peds = { count, filming, interest, down }`.

## Edge cases

- Light hits add up. A person at 20 health who is clipped at 40 km/h goes down.
- A person knocked into water swims to the nearest shore and gets up there.
- A driver who bails becomes a person of the district's most common kind, with the same 50 health.
- Spawns never happen in view. If the ring has no hidden spot, the count stays low until one appears.
- A street that has emptied after gunfire refills only once 30 s have passed without a shot or anyone going down.
- With `settings.blood` off, nothing here changes but the marks (`combat-stealth.md`).

## Low and high

`low`: 20 people, `crowdScale` 3, avoidance against the nearest 2, two rope tumbles at once (others play a canned roll), hats and bags on half the people, 1.2 ms a frame or less. `high`: 60 people, `crowdScale` 1, nearest 6, eight rope tumbles, props on everyone, 1.0 ms or less.

## Script checks

New test entry: `test.peds.stats()` returns `{ count, calls, filming, down, byState, frozen }`.

1. At `(0, 45)` at noon: at least 15 people within 150 m on `low` and 40 on `high`, and `calls` is 8 or fewer.
2. A crash at 30 km/h within 40 m of the promenade puts `filming` at 3 or more within 3 s, and over the next 2 s followers rise by `5 * filming * crowdScale` per second, within 20%.
3. A person hit at 40 km/h fires `ped:hit` and is in `walk` again within 8 s. A person hit at 60 km/h fires `ped:down`, never leaves `down`, and an ambulance is within 20 m of them inside 60 s.
4. The same scripted crash on `low` and on `high` gives follower gains within 25% of each other.
5. Over 60 s at the lights at `(52, -357)`, no person without the jaywalk flag is on a `signal` crossing while its walk light is off.
6. After the horn ability as Mags, everyone within 30 m is `frozen` for 5 ± 0.5 s. After `test.setWeather('hurricane')`, `count` is 0 within 30 s.

## New names

Archetype ids `courier`, `vendor`, `shopper`, `traveller` · events `ped:down`, `ped:fled`, `ped:recognised`, `crowd:formed`, `crowd:scattered` · state key `state.peds` · `crowdScale` · test entry `test.peds.stats()`.
