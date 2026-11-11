# Bible · systems · Driving

Every land vehicle is one 2D body stepped 60 times a second: position, heading, forward speed, sideways speed and spin. This file gives the whole step, the numbers behind it, and how air, two wheels, the hop, nitro, damage and the cameras hang off it. It extends `04-systems.md` sections 2 to 4 on day 1's base.

Tier: A (handling and drift day 2, two-wheelers and the hop day 3, damage day 5, nitro and parts day 6).

## Purpose

Make any vehicle feel good inside 30 seconds on keys, pad and touch, with slides you hold on purpose.
The player, the police and any traffic car off its rails share it.

## Data

Owner: `src/vehicles/handling.js`, `vehicle.js`, `damage.js`; presets in `src/content/vehicles.js`.

Body fields: `x z y h level vf vl w vy steer gear air slip sR health tyres[4]`. Heading `h` is 0 facing `+z` and grows turning left. `vf` is forward speed, `vl` speed to the left, `w` spin in rad/s. Steer is `+1` for left.

### Constants

- **Sideways grip:** sideways speed decays at 6.5 /s (day 1).
- **Handbrake:** rear grip drops to 1.2 /s, rear cap 5 m/s², drive cut to 30%, 5 m/s² of drag.
- **Steering lock:** 0.55 rad at rest falling to 0.075 rad at 34 m/s, curve power 0.6 (day 1). Response 7 /s, or 5 /s for digital touch buttons.
- **Drift:** slip angle over 0.35 rad above 40 km/h.
- **Countersteer assist:** 30% on touch controls.
- **Gears:** four. Up at 30%, 55%, 78% of top speed, down at 24%, 48%, 70%. Pull per gear 1.30, 1.05, 0.92, 0.80. A shift cuts drive to 20% for 0.18 s.
- Brakes (24 m/s²), coasting drag (0.45 /s), the traction limit and Mags's bonus (grip × 1.15, damage × 0.75) are in the step and the damage formula.

### Surfaces

```text
surface                          grip   drag /s
road                             1.0    0
wet road                         0.8    0
grass                            0.75   0.25
dirt                             0.7    0.15
sand                             0.6    0.5
flood water, 0.05 m or deeper    0.5    1.2
boardwalk and pier deck (new)    0.9    0
a corner with a burst tyre       0.3    +1.5
```

Wet road blends by `weather.wet`: `grip = 1.0 - 0.2 * wet`. Grip multiplies the decay rate, the axle caps and the traction limit.

### Presets

`A` is the pull in m/s² at rest. Caps are the sideways acceleration each axle can supply. A lower rear cap means the tail lets go first.

```text
id          drive  capF capR  A      special
heron       rear   15   17    6.64   the baseline
snook       front  16   17    5.59   body roll x 1.4
tarpon      front  14   16    5.41
mullet      rear   13   14    5.57
pompano     front  12   14    4.98
wahoo       rear   15   13    7.62   slide hold 0.6
sailfin     rear   20   22    8.76
grouper     all    13   15    5.39
manatee     rear   10   12    2.76   lock x 0.7, steering response 3 /s, damage x 0.5
pinfish     rear   14   15    6.04   two wheels, damage x 1.5
needlefish  rear   18   19    11.0   two wheels, damage x 2.0
birdie      rear   11   12    3.0    one gear, silent
flounder    rear   13   14    5.97   hop
hogfish     rear   10   12    3.73   damage x 0.6
tactical    all    12   14    5.08   damage x 0.4
```

Defaults: slide hold 0.35, lock × 1, `a = b =` half the wheelbase (2.7 m on the Heron). Mass, top speed and the 0 to 100 time are those in `04-systems.md` section 3.

### Solving the engine from the table

Day 1's curve is kept (`pull = A * (1 - vf / vTop)`), but day 1's numbers do not reach the listed top speed. Its pull cuts off at 38 m/s (137 km/h), yet its extra 0.12 /s drag balances the pull at about 27.5 m/s, which is 99 km/h. So a Heron on day 1 never passes about 99 km/h. **Session D2-S1 retunes the drag (or the cut-off) so that every vehicle really reaches its listed top speed**: the extra drag term is removed from the road step and `A` is solved per vehicle below, so the balance point is `vTop` itself. The checks that prove it are script checks 1 and 7: after 40 s of gas on a cleared straight every preset is at 93% of its listed top or more, and after 60 s at 97% to 101%.

```js
vRef = Math.min(27.78, 0.9 * vTop);        // 100 km/h, or 90% of top for slow vehicles
A0   = (vTop / t100) * Math.log(vTop / (vTop - vRef));
// at load: run the real step on dry road and bisect A until the time to vRef is within 1% of t100
```

**The 0 to 100 column in `04-systems.md` section 3 means this:** for a vehicle whose top speed is under 100 km/h, or too close to it to reach 100 in the model (under 111 km/h: Manatee, Pinfish, Hogfish, Pelican, Bullfrog), the listed time is the time to 90% of top speed instead. Every other file in the bible reads the column the same way. The Birdie has no listed time and uses 8 s.

## States

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Grip | entered, or hit harder than 2 m/s while parked or on rails | the full step | slip ≥ 0.35 rad above 40 km/h, or the ground falls away |
| Drift | slip ≥ 0.35 rad above 40 km/h | step, score, smoke, skid marks, `drift:start` | slip under 0.2 rad for 0.6 s, under 30 km/h, or a wall hit (`drift:end`) |
| Air | ground below the free-fall path, speed over 6 m/s | gravity only | `y` reaches the ground: squash for 0.25 s, damage, `jump:landed` |
| Stalled | water 0.8 m deep | engine off, drifts to shore at 1.5 m/s | depth under 0.5 m, then 2 s |
| Burning | health under 20 | 8 s to get out; pull × 0.6, steering wanders ± 0.05 | the timer or health 0: it explodes. Or a repair |
| Wrecked | it explodes | hurts everything within 6 m, throws the hood, `vehicle:blast`; a burnt shell is left | removed out of view after 60 s |

## The step

```js
const DT = 1 / 60, G = 18;

function step(v, inp) {            // inp: steer, gas, brake, handbrake, special, touch
  const p = v.preset, s = surfaceAt(v);
  const mu = v.air ? 0 : s.grip * v.tyreMul * (v.driver === 'mags' ? 1.15 : 1);

  // 1 steering and the touch assist
  const k = Math.min(1, Math.abs(v.vf) / 34);
  const lock = (0.55 + (0.075 - 0.55) * Math.pow(k, 0.6)) * p.lockMul;
  let cmd = inp.steer;
  if (inp.touch && v.slip > 0.15) cmd = 0.7 * cmd + 0.3 * clamp(v.slipSigned / lock, -1, 1);
  v.steer += (cmd - v.steer) * Math.min(1, p.steerRate * DT);
  const tanD = Math.tan(v.steer * lock);

  // 2 engine, brakes, drag
  updateGear(v);
  let acc = 0;
  if (inp.gas > 0)
    acc = v.vf < -0.3 ? 20
        : p.A * v.accMul * GEAR[v.gear] * Math.max(0, 1 - v.vf / (p.vTop * v.topMul)) * inp.gas;
  if (inp.brake > 0) acc = v.vf > 0.3 ? -24 * inp.brake : (v.vf > -9 ? -7 : 0);
  if (v.shiftT > 0) { acc *= 0.2; v.shiftT -= DT; }
  if (inp.handbrake) acc = acc * 0.3 - 5 * Math.sign(v.vf);
  acc = clamp(acc, -24 * mu, 14 * mu) + (v.nitroOn ? 6 * mu : 0);
  v.vf += acc * DT;
  const coast = inp.gas === 0 && inp.brake === 0 ? 0.45 : 0;
  if (!v.air) v.vf -= v.vf * (s.drag + coast + 0.25 * Math.min(1, v.slip)) * DT;
  if (coast && Math.abs(v.vf) < 0.25) v.vf = 0;

  // 3 grip per axle: decay rate g, cap c; t is weight transfer
  const t = clamp(acc / 24, -1, 1);
  let gF = 6.5 * mu, gR = 6.5 * mu;
  let cF = p.capF * mu * (1 - 0.15 * t) * (v.tyres[0] + v.tyres[1]) / 2;
  let cR = p.capR * mu * (1 + 0.15 * t) * (v.tyres[2] + v.tyres[3]) / 2;
  if (inp.handbrake) { gR = 1.2 * mu; cR = 5 * mu; }
  else if (inp.gas > 0.5 && p.drive !== 'front' && Math.abs(v.sR) > 1.5) cR *= 1 - p.slideHold;

  // 4 shed sideways speed at each axle, rebuild vl and w
  let sF = v.vl + v.w * p.a - v.vf * tanD, sR = v.vl - v.w * p.b;
  sF -= clamp(sF * (1 - Math.exp(-gF * DT)), -cF * DT, cF * DT);
  sR -= clamp(sR * (1 - Math.exp(-gR * DT)), -cR * DT, cR * DT);
  v.w  = (sF - sR + v.vf * tanD) / (p.a + p.b);
  v.vl = sR + v.w * p.b;
  v.sR = sR;

  // 5 turn the body; left is (fz, -fx)
  const d = v.w * DT, c = Math.cos(d), sn = Math.sin(d);
  [v.vf, v.vl] = [v.vf * c + v.vl * sn, v.vl * c - v.vf * sn];
  v.h += d;
  const fx = Math.sin(v.h), fz = Math.cos(v.h);
  v.x += (fx * v.vf + fz * v.vl) * DT;
  v.z += (fz * v.vf - fx * v.vl) * DT;

  // 6 walls, vehicles, props
  collide(v);

  // 7 height and air
  const hf = heightUnder(v, p.a), hr = heightUnder(v, -p.b), g = (hf + hr) / 2;
  if (!v.air) {
    const fall = v.y + v.vy * DT - 0.5 * G * DT * DT;
    if (g < fall - 0.02 && Math.abs(v.vf) > 6) takeOff(v);
    else { v.y = g; v.vy = v.vf * (hf - hr) / (p.a + p.b); }
  }
  if (v.air) {
    v.vy -= G * DT; v.y += v.vy * DT; v.airT += DT;
    if (v.y <= g) land(v, g);
  }

  // 8 slip angle and drift
  v.slipSigned = Math.atan2(v.vl, Math.max(Math.abs(v.vf), 0.5));
  v.slip = Math.abs(v.slipSigned);
  updateDrift(v);
}
```

Why it slides: with both caps intact the front gives up first, so full lock at speed only runs wide. The tail steps out when the rear cap drops below the front: the handbrake, braking into a turn, or power in a rear-drive car already sliding, which is how a drift is held on the throttle.

### Weight transfer, drift score, landing

```js
pitch = clamp(-acc * 0.0022, -0.06, 0.06);                  // rad; eases to target at 6 /s
roll  = clamp(v.vf * v.w * 0.0045, -0.07, 0.07) * p.rollMul;

score += 6 * v.slip * kmh * mult * DT;      // mult = 1, plus 0.5 for each 2 s held, up to 5

function land(v, g) {
  const hit = -v.vy;
  v.y = g; v.vy = 0; v.air = false;
  v.squash = Math.min(0.18, hit * 0.02);
  if (hit > 7) damage(v, (hit - 7) * 2.5);
  if (v.slip > 0.5) v.vf *= 0.7;                            // landed sideways
  if (v.airT >= 0.4) emit('jump:landed', { distance: dist(v.x0, v.z0, v.x, v.z), airTime: v.airT });
}
```

A wall hit banks half the drift score. In the air the nose follows the arc (at most 0.5 rad) and steering adds up to 0.4 rad/s² of spin.

### Two wheels

The same step with `a = b = 0.65 m`. Lean is `clamp(atan(vf * w / 9.81) * 0.9, -0.75, 0.75)` rad, drawn as roll. The rider is thrown when a hit changes speed by 5 m/s or more (Needlefish 7), when a landing has slip over 0.6 rad, or when slip stays over 0.9 rad for 0.4 s above 40 km/h. Thrown means `rider:thrown`, a 1.2 s tumble, health down by `clamp((dv - 5) * 4, 5, 35)`, and the bike sliding to rest at 8 m/s².

### The Flounder's hop

The `special` action (Shift, pad X, a touch button above the gas). A tap sets `vy = 4.2 m/s`: 0.49 m high, 0.47 s in the air, cooldown 0.6 s. Hold left or right for a side hop (roll 0.25 rad, 0.8 m/s sideways); hold gas or brake to lift one end (pitch 0.18 rad). A hopping car clears spike strips. Three hops inside 2 s count as interesting to people filming.

### Nitro and parts

`special` on any other vehicle with nitro. A tank burns for 4 s and refills in 20 s, from 3 s after release. While burning: 6 m/s² extra pull, top speed × 1.18, rear cap × 0.9. The Flounder cannot fit it. Engine levels add 6%, 12%, 18% pull and 3%, 6%, 9% top speed. Grip tyres multiply road grip by 1.08. Off-road tyres halve the loss on sand, dirt and grass.

### Damage, fire and the blast

```js
dmg = Math.max(0, dv - 3) * 0.8 * p.damageMul * (driver === 'mags' ? 0.75 : 1);   // dv in m/s
// car against car: j = 1.2 * closing / (1 / m1 + 1 / m2); each velocity changes by j / mass along the normal
// light props: v.vf *= 1 - Math.min(0.5, 4 * propMass / (propMass + mass));
// the blast at zero health, d metres away: people take 120 * (1 - d / 6), vehicles 60 * (1 - d / 6), nothing past 6 m
```

A 100 km/h wall hit costs 19.8: four leave 21 health, the fifth ends the car. Stages from `04`: 60 dents, 40 smoke (top speed × 0.9, pull × 0.85), 20 fire and 8 seconds to get out, 0 the explosion. A burst front tyre pulls the steering 0.04 rad to its side.

- The player still inside at the blast is Knocked out. A blast can set off a burning car beside it 0.5 s later.
- An AI driver bails in 1.5 s once the car is on fire and under 20 km/h. One whose car is still moving, pinned on both sides, or finished early by another hit does not make it. That is a `kill`.
- A vehicle that hits a person at 50 km/h or less knocks them over. Over 50 km/h they stay down (`people.md`).

## Cameras

| Camera | Rig |
|---|---|
| Chase | 7.4 m back plus 1.6 m with speed, 2.9 m up (portrait 9.5 and 3.6). Yaw follows heading at 4 /s. Looks 3 m ahead, 1.25 m up. Field of view 60 plus 10 with speed (portrait 78). Pull-in steps 1, 0.8, 0.62, 0.45, 0.3, 0.15. |
| Close chase | 4.6 m back, 1.7 m up, field of view 64 plus 10 |
| Hood | on the body at `(0, 1.15, 0.55)`, rolling half as much as the body |
| Look-back | the chase rig turned half a circle while held. The helicopter camera is in `heat.md` |

Rig distances scale with body length over 4.46 m, capped at × 2.2. In a slide over 0.2 rad the chase yaw aims 30% toward the direction of travel, so the car shows its side. Shake above 120 km/h is `0.03 * min(1, (kmh - 120) / 80)` m at 22 Hz; hits add `min(0.25, dv * 0.02)` m, fading at 6 /s. Both, and the speed zoom, are off under reduce motion.

## Events

Emits: `vehicle:crash { speed, what }` for hits over 3 m/s, `drift:start`, `drift:end { score }`, `jump:landed { distance, airTime }`, `prop:broken`, `vehicle:destroyed`, and the new `vehicle:blast { x, z, by }`, `vehicle:hop`, `vehicle:nitro { on }`, `vehicle:stalled`, `vehicle:tyre { corner }`, `rider:thrown`.
Listens: `weather:changed`, `player:switched` (driver bonus), `quality:changed`, `game:pause`.
State: `state.vehicle = { id, model, health, slip, drift: { active, score, mult }, air, nitro }` for the car the player is in.

## Edge cases

- Landing on another vehicle bounces (`vy = 3`); bodies never stack.
- A curb is a 0.15 m rise. Sampling under both axles makes it a bump, not a launch.

## Low and high

The physics is identical; a 30 fps phone runs two steps a frame. `low`: 60 skid segments, 24 smoke puffs, squash on the player's car only, 8 awake bodies. `high`: 300 segments, 96 puffs, squash on every awake vehicle, 20 awake bodies.

## Script checks

New test entries: `test.vehicle()` gives `state.vehicle` plus `vf, vl, w, y, mu, lean`; `test.count(name)` counts an event's firings; `test.traffic.clear()` empties the road.

1. For each preset on a cleared Heron Walk Drive: time to `vRef` is within 10% of the table, and speed after 40 s of gas is at least 93% of top.
2. In a Heron, 3 s of gas then 1.5 s of gas, left and handbrake: peak `slip` ≥ 0.35, `test.count('drift:start')` is 1, speed stays ≥ 30 km/h. After release `drift:end` arrives with a score above 0.
3. On the beach at `(0, 65)` at 40 km/h, `test.vehicle().mu` is 0.6. On the road under `test.setWeather('storm')` it reaches 0.8.
4. Off a Big Air ramp at 100 km/h: `air` is true, `vy` falls by 18 ± 0.5 m/s each second, and `jump:landed` fires with `distance` > 15.
5. One 10 s input script under `test.setQuality('low')` and `'high'` ends within 0.5 m and 0.05 rad of the same pose.
6. A Pinfish at 40 km/h with left held shows `lean` between 0.05 and 0.75, and a 60 km/h wall hit fires `rider:thrown`. A Flounder with `special` tapped peaks 0.4 to 0.6 m up. A car taken to zero health fires `vehicle:blast` and a person 2 m away goes down.
7. Top speed: on a cleared straight, 60 s of gas in each road preset ends at 97% to 101% of its listed top speed, on day 1's Heron as well (137 km/h, not 99).

## New names

Events `vehicle:blast`, `vehicle:hop`, `vehicle:nitro`, `vehicle:stalled`, `vehicle:tyre`, `rider:thrown` · state key `state.vehicle` · input action `special` · test entries `test.vehicle()`, `test.count()`, `test.traffic.clear()` · surface `boardwalk`.
