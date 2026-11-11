# Bible · systems · Heat

Heat is the Sheriff's attention, shown as five siren lights. From heat 3 the chase is a live show and the number that matters is viewers: they rise while a cop or a camera can see you and leave when nobody can. This file extends `04-systems.md` section 7: crimes, the viewer maths, dispatch, tactics, use of force by level, roadblocks, the helicopter and the two ways a chase ends badly.

Tier: A (heat 1 to 3, the LIVE overlay and Booked in D5-S1; heat 4 and 5, roadblocks and the helicopter in D5-S2). C for fixed cameras.

## Purpose

Turn trouble into an audience, and make escape a matter of being boring out of sight.
Give missions switches to script a chase.

## Data

Owner: `src/systems/heat.js`, `src/actors/cops.js`, `src/vehicles/chopper.js`, `src/ui/live.js`.

### Levels and what comes

| Heat | Name | Viewers | Units on `high` | On `low` | Also |
|---|---|---|---|---|---|
| 1 | Warm | not live yet | 1 cruiser | 1 | lights on, tries to pull you over |
| 2 | Hot | not live yet | 3 cruisers | 3 | they ram and box in |
| 3 | Trending | 1,000 to 20,000 | 5 cruisers | 5 | the news helicopter with a spotlight; the LIVE overlay; deputies shoot |
| 4 | Breaking News | 20,000 to 200,000 | 4 cruisers, 3 Sheriff SUVs, 2 tactical vans | 2, 2, 2 | roadblocks on avenues, spike strips, a second helicopter, radio cuts to the chase |
| 5 | Hurricane Dale | 200,000+ | 4 cruisers, 4 SUVs, 3 tactical vans, the show truck | 2, 1, 2, the truck | every unit in the county, two roadblocks |

Unit caps: 12 police vehicles on `high`, 6 on `low`. Helicopters are not counted.

### Crime kinds

The `crime` event's `kind` is one of these thirteen ids. The same list is in `tech/contracts.md`.

| Kind | What it is | Tier |
|---|---|---|
| `collision` | Hitting a vehicle in view of a deputy | A |
| `hit-and-run` | Hurting or knocking down a person in view, with a vehicle or a hand weapon. Over 50 km/h from a vehicle they stay down. | A |
| `carjack` | Taking an occupied vehicle in view | A |
| `cop-ram` | Hitting a Sheriff's vehicle or a deputy | A |
| `shots` | Firing a weapon, or aiming one at a deputy, with nobody put down | A |
| `killing` | Killing someone in view | A |
| `deputy-down` | Killing a deputy | A |
| `evade` | Not stopping for a pull-over for 20 seconds | A |
| `outlast` | Lasting 90 seconds at one heat level | A |
| `property` | Breaking public property in view (hydrant, lamp, sign), or entering a guarded zone | A |
| `theft` | Taking a parked vehicle in view | B |
| `explosion` | A vehicle blown up in view | B |
| `shoot-out` | Ten seconds or more of fire both ways, with deputies, a crew or guards | B |

### Crimes

100 points is one level. The event is `crime { kind, case, seen, points, x, z, weapon }`. Each row below is a `case`: the thing that happened, with its points. Its `kind` is the id from the list above, which the scanner and the news read.

```text
case       kind          points  counts     what
hitprop    property      10      seen       breaking a hydrant, lamp or sign
hitcar     collision     15      seen       hitting a car at 15 km/h or more
punch      hit-and-run   20      seen       hitting a bystander with a hand weapon
hitped     hit-and-run   25      seen       knocking a person over with a vehicle at 50 km/h or less
carparked  theft         30      seen       taking a parked car
cartheft   carjack       100     seen       taking an occupied car
hurt       hit-and-run   100     seen       wounding a bystander with a gun or a blast
flare      shots         100     seen       firing the flare gun
hitcop     cop-ram       100     always     hitting a police vehicle
punchcop   cop-ram       100     always     hitting a deputy
threat     shots         100     always     aiming a gun at a deputy at heat 1 or 2
gunfire    shots         100     always     pistol, SMG or shotgun, heard anywhere; 200 if seen at heat 1 or more
kill       killing       200     seen       putting anyone down: a bystander, a guard, a rival, a driver
killcop    deputy-down   300     always     putting a deputy down
evade      evade         100     automatic  outrunning a pull-over for 20 s
survive    outlast       100     automatic  90 s at a level
trespass   property      by zone alarm      a guarded zone
```

Two kinds have no row of their own. `explosion` (B) is added to whatever the blast does when a vehicle is blown up in view, and `shoot-out` (B) fires once when ten seconds of fire both ways have passed; both add no points beyond their cases.

- The small crimes (25 points or fewer) cannot lift heat past 2 by themselves.
- One event (one burst, one blast, one crash) adds at most 300 points.
- At heat 0, points fade at 5 a second after 10 quiet seconds. During Teo's Go Live, points are × 1.5.
- Hurting people adds points and nothing else: no viewers, no followers.

### Witnesses

- A deputy, on foot or in a vehicle: line of sight within 60 m by day, 45 m at night or in rain, 30 m in fog. A vehicle sees 100 degrees either side of its nose.
- The news helicopter: everything within 150 m that is not under cover.
- The Sheriff's show truck: 80 m all round.
- Fixed cameras on lit junctions in Meridian and Northgate: 35 m (C).

Bystanders never raise heat; they flee or film. But every ambulance brings a patrol cruiser (`traffic.md`), a witness to whatever happens next. Cover from the air: under the expressway deck, under Gullwing Pier, the Mangrove Tunnel, inside Big Earl, a garage, a car wash. Sight is tested four times a second; the result is `state.heat.seen`.

## The viewer maths

```js
const ENTRY = [0, 200, 600, 1000, 20000, 200000];       // meter on reaching a level
const CAP   = [0, 600, 1000, 20000, 200000, 1000000];   // top of the level's range

function tick(h, dt) {                          // h = state.heat
  const L = h.level; if (L === 0) return;
  if (h.seen) {
    h.unseenT = 0; h.levelT += dt;
    h.viewers = Math.min(CAP[L], h.viewers * Math.exp(Math.log(CAP[L] / ENTRY[L]) / 90 * dt));
    h.peak = Math.max(h.peak, h.viewers);
    if (L < 5 && (h.levelT >= 90 || h.viewers >= CAP[L])) addPoints(100);   // the survive rule
  } else if ((h.unseenT += dt) > 1.5) {
    const hide = hidden() ? 2 : 1;              // parked with the engine off, car wash, under a bridge, garage
    h.viewers -= 0.08 * h.peak / L * hide * dt;
    if (h.viewers <= 0) clear();                // heat:cleared
  }
}

// on a new level L: levelT = 0, viewers = max(viewers, ENTRY[L]), peak = max(peak, viewers)

// a one-level drop keeps the fraction: f = viewers / peak; level -= 1; peak = min(peak, CAP[level]); viewers = f * peak
```

Levels 1 and 2 are not live: the same meter runs unseen as the dispatcher's attention, and the lights dim with it (`0.35 + 0.65 * viewers / peak`). In view, the count climbs through the range in 90 s, the moment the survive rule fires. Out of view the level holds while viewers drain at 8% of peak per second ÷ heat level, and all of it clears at zero. Heat 1 clears in about 12 s (12.5) and heat 5 in about 60 s (62.5), after 1.5 s while the cameras look for you.

**Stunts add viewers** at heat 3 and above, only while seen. Reaching the cap this way raises the level early.

In view, as a share of `CAP`: a drift 1% a second; a jump 0.2% a metre; a crash at 8 m/s or more 3%; passing a cruiser inside 1 m above 60 km/h 1%; a vehicle exploding 5%; going through a roadblock 8%. Any of these with Mags driving a bus: × 1.5.

**Worked examples.** Heat 2, peak 800, unseen: `0.08 × 800 ÷ 2 = 32` a second, gone in 25 s; in a car wash, 12.5 s. Heat 4, peak 150,000: 3,000 a second, gone in 50 s. Swap cars unseen 10 s in: now heat 3, peak 20,000, viewers 16,000, draining 533 a second for 30 s, so 40 s in all.

**Losing heat.** Be unseen. Hidden doubles the drain. Changing car or outfit while unseen drops one level at once; the car must be one no unit has seen this chase, and 20 s must pass between drops. Units that lose you for 3 s search a loop round the last seen point, out to 150 m; the minimap marks it with a ring.

## Dispatch

The nearest patrol cruiser within 300 m answers first; failing that, one spawns 150 m ahead out of view and arrives inside 10 s. Later units spawn 150 to 260 m away, mostly ahead. A wrecked or outrun unit (400 m behind) is replaced after 8 s at heat 1 and 2, 5 s at heat 3, 3 s above. A unit more than 60 m behind may run at 1.08 × the player's current speed, never above 1.15 × the top speed of the player's vehicle. Inside 30 m it has only its own preset.

## Pursuit tactics

One state per unit. Nearest chases, second cuts off, third rams.

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Pull over | assigned at heat 1 | sits 8 m behind, lights on. The `evade` clock runs while the player is within 80 m and above 20 km/h | player stops, or 20 s pass: heat 2 |
| Chase | assigned at heat 2 or more | drives to the last seen point, then follows at the player's speed plus 10% | a new role, or sight lost for 3 s |
| Cut off | two or more units chasing | takes the next parallel street to come out ahead | 30 m ahead of the player |
| Ram | alongside within 2.5 m | steers into the rear quarter at 3 m/s sideways; 4 s between tries | the hit lands, or the player passes 150 km/h |
| Box in | player under 40 km/h, three units near | front, side and rear cars close to 1 m and brake | player over 50 km/h, or stopped 3 s |
| On foot | player stopped or walking within 25 m | the deputy gets out. Heat 1 and 2: walks to your door. Heat 3 and up: takes cover behind his car and fires | player 30 m away: back in the car in 1.5 s |
| Search | sight lost for 3 s | loops the last seen point | sees the player. On `heat:cleared`: lights off, rejoins traffic |

Mags's horn pulls police cars over for 5 s, at heat 1 and 2 only.

## Use of force

At heat 1 and 2 they arrest. At heat 3 and above they do not arrest, they shoot.

| Heat | Deputies on foot | From vehicles | Fire at | Out to |
|---|---|---|---|---|
| 1 | order you out, walk to your door, book you | follow with lights | nothing | |
| 2 | baton, and a tackle if you run: Booked | ram, box in | nothing | |
| 3 | pistols | ram; a passenger fires | you, and your vehicle | 40 m |
| 4 | pistols; tactical officers with SMGs and shotguns hold the roadblocks and dive aside at 15 m | the same, plus spike strips | the same | 50 m |
| 5 | everyone fires on sight | the same; the show truck only films | the same | 60 m |

- Nobody fires at heat 1 or 2. Your own gunfire, or a `threat`, raises the level first.
- A shot at the player does half the weapon's table damage: a deputy's pistol does 9 (`combat-stealth.md`).
- A shot at your vehicle does 4 for a pistol, 2 for an SMG round, 12 for a shotgun. One pistol hit in five on a moving car bursts a tyre.
- They hold fire while a bystander is in the line, and stop the moment nobody can see you.
- A deputy can be put down like anyone. That is `killcop`.

## Roadblocks and spike strips

```js
// every 2 s at heat 4 or more, while fewer than the limit are up
route = predict(player);          // the lane graph from the player's lane, straight on at each node
J2 = route.nodes[1];              // two junctions ahead
ok = J2.road >= AVENUE && route.metresTo(J2) >= 160 && route.metresTo(J2) <= 400 && !cameraSees(J2);
// place it 20 m before J2 on the player's side, so the junction before it is still a way out
```

- Two vehicles nose to nose at 30 degrees, with a 3.2 m gap at one curb. Every roadblock has a way through.
- A spike strip 25 m in front, 7 m by 0.6 m, across the lanes but not the gap. It bursts each tyre that crosses above 10 km/h: grip 0.3 on that corner, sparks. A vehicle in the air is untouched.
- It lifts when the player passes, when the route has left `J2` for 6 s, or after 40 s. The next comes 12 s later at heat 4, 6 s at heat 5.
- Limit: 1 at heat 4, 2 at heat 5, 1 on `low`. On the expressway: 600 m ahead between ramps, three vehicles, the gap on the shoulder.

## The helicopter and its camera

The Mayfly from BHTV 6 arrives within 8 s of heat 3 and orbits 60 m up, 45 m out, behind and to the left, at up to 70 m/s. At night its spotlight is a 12 m circle trailing the player by 0.4 s. A second joins at heat 4 on `high`. Both are grounded in a tropical storm or hurricane. Nobody shoots from them.

**Helicopter cam** (V, pad Back, or tap the LIVE pill; heat 3 and above): the view moves to the helicopter, 35 degree field of view, tagged `CHOPPER CAM`. Steering stays relative to the car. After 2 s under cover the chase camera returns.

## Getting caught

| | Booked | Knocked out |
|---|---|---|
| When | heat 1 or 2, under 1 m/s with a deputy within 1.5 m of your door (or of you) for 3 s | health reaches zero, however it happened |
| Screen | the mugshot board with the day number, then Lawyer Larry's card, 6 s | the screen tilts and drains of colour, then the hospital wristband slides in with the bill, 5 s |
| Cost | 10% of cash, up to $5,000, and your weapons | 5% of cash, up to $2,500 |
| After meeting Larry | half: 5%, up to $2,500 | half: 2.5%, up to $1,250 |
| Clock | plus 2 game hours | plus 3 game hours |
| You are | on foot outside the Sheriff's HQ `(200, -2150)` | at Bayhaven General `(-500, -1700)` with 50 health |
| Your car | a stolen one is gone; an owned one returns to its garage | the same |

They fire `player:booked` and `player:knockedout`. Heat clears in both. Inside a mission neither costs anything: the mission restarts from its checkpoint.

## How missions script heat

Heat reads `state.mission.flags.heat` every tick: `min` and `max` clamp the level, `frozen` stops the drain, `muted` makes crimes add no points (cutscenes, first lessons), `noHelicopter` and `holdFire` do what they say. A `heat` step can carry `set: n`, `reach: n`, `hold: { level, seconds }`, `clear: true` or `blackout: true` (viewers fall to zero over 3 s whoever is watching). The Spire Job uses `set: 4`, `min: 5`, then `blackout` at the pier.

## Events

Emits: `crime { kind, case, seen, points, x, z, weapon }`, `heat:changed { level, from }`, `heat:live { viewers, peak }` twice a second, `heat:cleared { peak, seconds }`, `player:booked`, and the new `heat:seen { seen }`, `heat:broadcast { on }` at heat 4 for the radio, `heat:roadblock { x, z }`, `heat:dropped { reason }`.
Listens: `vehicle:crash`, `vehicle:blast`, `ped:hit`, `combat:hit`, `combat:down`, `prop:broken`, `weapon:fired`, `drift:end`, `jump:landed`, `vehicle:entered`, `player:ability`, `mission:step`, `weather:changed`.
State: `state.heat = { level, viewers, peak, seen, points, levelT }`.

## Edge cases

- Switching leads is refused at heat 1 or more outside a mission. Nothing autosaves until heat is zero.
- A killing no deputy or camera saw adds nothing, but the ambulance's cruiser arrives within a minute.

## Low and high

`low`: 6 vehicles, 1 helicopter, 3 deputies on foot, 1 roadblock, sight tested 4 times a second. `high`: 12, 2, 6, 2, and 8 times a second. The meter and every timing are the same.

## Script checks

`test.heat()` returns `state.heat`.

1. `test.setHeat(1)` brings `test.stats().cops` to 1 or more within 10 s. Ramming a cruiser from heat 0 gives heat 1 or more within 2 s. Putting a bystander down in a deputy's view adds 200 points.
2. `test.setHeat(3)` fires `heat:live` with at least 1,000 viewers; viewers never pass 20,000 at level 3; after 90 s in view the level is 4. A deputy with a clear line inside 30 m fires within 5 s.
3. Heat 2, then a teleport 1 km away out of sight: heat is 0 in 26.5 ± 2 s. Heat 5: 64 ± 3 s, and 33 ± 3 s inside a car wash.
4. At heat 3 in view, a 3 s drift leaves viewers at least 400 above the same run without it.
5. At heat 2 no deputy fires in 30 s. Heat 1, stopped beside a deputy for 5 s: `player:booked`, cash down 10% (at most $5,000), no weapons, the player within 30 m of `(200, -2150)`.
6. Heat 4, north on Coral Boulevard at 80 km/h for 30 s: a `heat:roadblock` lands 160 to 400 m ahead on an avenue or bigger, `cops` never passes the cap, and G3 holds.

## New names

The thirteen crime kinds and the `case` field of `crime` · events `heat:seen`, `heat:broadcast`, `heat:roadblock`, `heat:dropped` · state fields `state.heat.points`, `levelT`, `state.mission.flags.heat`.
