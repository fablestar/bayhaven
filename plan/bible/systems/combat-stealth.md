# Bible · systems · Combat and stealth

Combat is a real part of the game, though driving comes first: seven weapons, a lock-on that works on a phone, and enemies who take cover behind cars, shoot back and run when they are alone. Weapons are lethal, for you and against you. Stealth is one small module: guards with a view cone drawn on the ground and a bar that fills when they notice you. This file extends `04-systems.md` section 8.

Tier: A (combat in D5-S4, the stealth module in D7-S3). B for the flare as a distraction. C for firing from vehicles and noise lures.

## Purpose

Give missions a fight and a sneak that take one thumb to play, with consequences: anyone at zero health stays down.
Keep it brief and low-poly. Nothing is graphic in close-up, and animals are never part of it.

## Data

Owner: `src/actors/combat.js`, `src/systems/health.js`, `src/content/weapons.js`, `src/systems/stealth.mod.js`.

### Weapons

| Weapon | Slot | Damage | Time between hits | Reach or range | Holds, reload | Knocks down |
|---|---|---|---|---|---|---|
| Fists | hand | 12 | 0.35 s | 1.4 m | | third hit of the three-hit combo |
| Pool noodle | hand | 8 | 0.22 s | 2.0 m | | every fifth hit; others stagger 0.3 s |
| Lawn flamingo | hand | 25 | 0.7 s | 1.8 m | breaks after 10 hits | every hit |
| Pistol | sidearm | 18 | 0.28 s | 50 m | 12 rounds, 1.4 s | no |
| Flare gun | sidearm | 5 | one shot | an arc at 30 m/s | 1 flare, 2.2 s | no |
| SMG | long | 9 | 0.083 s | 35 m | 30 rounds, 2.0 s | no |
| Shotgun | long | 60 at 5 m, 10 at 20 m | 0.9 s | 30 m | 6 shells, 0.5 s a shell | within 12 m |

The SMG sprays: its spread grows from 2 to 7 degrees over a second of fire. The flare burns 6 s, sets off fireworks crates and makes people within 40 m film. The noodle is free at any beach shop. Prices are in `economy.md`.

```js
shotgun = d <= 5 ? 60 : d >= 20 ? 10 : 60 - (d - 5) * (50 / 15);   // 0 past 30 m
```

### Who has how much

| Who | Health | Vest | Carries | Tier |
|---|---|---|---|---|
| The player | 100 | a life vest, 100 | the quick bar | A |
| Bystander | 50 | | nothing | A |
| Security guard | 60 | | baton, pistol | A |
| Rival crew | 50 | | fists, pistol | A |
| Deputy | 80 | 40 | baton, pistol | A |
| Tactical officer, heat 4 and above | 80 | 80 | SMG or shotgun | A |
| Chad and Brad | 150 each | 40 | fists, pistol | C |

### Lethal damage

```js
function hurt(t, dmg, ranged, by) {
  if (t.animal) return;                                       // never
  if (by.weapon === 'noodle') dmg = Math.min(dmg, t.health - 1);   // it is a pool noodle
  if (t.bystander && !by.player) return;                      // only the player can hurt a bystander
  if (t.player && by.weapon) dmg *= 0.5;                      // shots and blows at the player do half the table
  const soak = ranged ? Math.min(t.vest, dmg * 0.8) : 0;      // a vest takes 80% of a ranged hit while it lasts
  t.vest -= soak;  t.health -= dmg - soak;
  if (t.health <= 0) t.player ? knockedOut() : down(t, by);
}
```

| Other sources | Damage |
|---|---|
| A vehicle hitting a person | at 50 km/h or less: `kmh - 10`, and a tumble. Over 50 km/h: down |
| A vehicle hitting the player | `(dv - 4) * 5`, with `dv` in m/s |
| A vehicle exploding, within 6 m | `120 * (1 - d / 6)` to people, `60 * (1 - d / 6)` to vehicles |
| A fall over 4 m | `(height - 4) * 12` |

Shots it takes from the player to put someone down:

| | Bystander | Guard | Deputy | Tactical officer |
|---|---|---|---|---|
| Pistol | 3 | 4 | 7 | 9 |
| SMG | 6 | 7 | 14 | 18 |
| Shotgun at 5 m | 1 | 1 | 2 | 3 |
| Fists | 5 | 5 | 7 | 7 |

So a guard's pistol does 9 to the player, a tactical SMG round 4.5, and a life vest roughly doubles how long you last under fire. The player's health comes back after 6 s without a hit, 2 a second up to 30; food does the rest. Mags's lock-on spread is × 0.7. Teo swings every 0.30 s and is shoved 30% further.

### Down

- Anyone but the player who reaches zero health is **down**: they fall, lie still and do not get up. `combat:down { who, by }` fires.
- An enemy drops its weapon and one magazine. A lead can pick both up.
- An ambulance comes once the shooting has stopped (`traffic.md`). The crew takes them away. Left uncollected, a person who is down is removed after 90 s out of view.
- The player at zero health is **Knocked out** and wakes at Bayhaven General (`heat.md`).
- Putting a bystander down in view is the crime case `kill` (kind `killing`); wounding one is `hurt`; a deputy is `killcop` (kind `deputy-down`) (`heat.md`). None of them adds viewers or followers.
- There are no children in Bayhaven's crowds, and animals cannot be hit by anything.

### How it looks

`settings.blood` is on by default. A hit throws 3 to 5 small flat red quads that fall and fade within 1 s. A person who is down leaves one dark patch 0.8 m across that fades in 20 s. With the setting off, hits throw grey dust and there is no patch. In either case: no wounds on models, nothing comes off, and the camera never cuts to a body. On `low` there are no patches.

## Lock-on

Hold aim to lock on to the nearest threat in view. Mouse players may free-aim with no assist.

```js
// candidates: hostile enemies inside range and the cone, with a clear ray
range = Math.min(weapon.range, 40);
cone  = touch ? 50 : 35;                       // degrees either side of the camera
score = dist + 12 * angle - (c.attackingYou ? 8 : 0) - (c === last ? 4 : 0);   // angle in radians
target = lowest score;
```

- Next target: Q and E on foot, a flick of the right stick, a swipe on touch.
- The lock breaks when the ray is blocked for 1.2 s, the target goes down, or it passes `range * 1.2`.
- Spread while locked: 1 degree standing, 3 jogging, 6 sprinting.
- Deputies are candidates only from heat 3, or once they attack. Bystanders and animals never are, so the lock never picks one. Free aim and stray rounds can still hit a bystander.
- The mark is four chevrons round the target, cyan sliding to pink as its health falls.
- Quick bar: three slots, hand, sidearm and long. Keys 1, 2, 3; d-pad left and right on foot; tap on touch. It is a bar, not a wheel.

## Enemy states

```js
hitChance = clamp(0.75 - d / 60, 0.1, 0.75) * (sprinting ? 0.5 : 1) * (behindCover ? 0.3 : 1);
```

Enemies fire two or three shots, then wait 1.5 to 3 s. Any box between you and the shooter counts as cover for you; there is no cover button. An enemy holds fire while a bystander is in the line.

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Post | placed | stands, or walks a loop of waypoints, sweeping 40 degrees either side at 30 degrees a second at each stop | the bar reaches 50, a noise, an alarm |
| Suspicious | bar at 50, or a noise | turns, walks to the spot, says "Who is this?" | bar at 100, or 6 s of nothing |
| Call out | first sight of the player while hostile | one bark subtitle; allies within 30 m become hostile | 1 s |
| Engage | an alarm, or attacked | closes to its weapon's range and fires in bursts, or swings | hit while a car is near, alone, or target unseen 5 s |
| Cover | hit, or under half health, with a vehicle or wall within 15 m | crouches behind it; every 1.5 to 3 s leans out for 0.8 s and fires | flanked, or the cover moves or burns |
| Search | target unseen for 5 s | walks to the last seen point, looks round for 8 s | sees the player, or gives up and returns to Post |
| Flee | no ally standing within 20 m and health under 60% | runs at 5.5 m/s toward the nearest ally or exit | reaches an ally, or is removed out of view |
| Down | health 0 | lies still, weapon dropped | collected by an ambulance, or removed |

### Cover from cars

```js
// spots: for each vehicle box or solid prop within 15 m, the corner farthest from the player, pushed out 0.6 m
ok    = rayBlocked(spot, player) && !rayBlocked(spot + lean, player);
score = dist(enemy, spot) + 0.5 * dist(spot, player);      // lowest wins
```

If the car is driven away the enemy stands exposed for 1 s before choosing again. If it catches fire (health under 20) they leave at once, because it is about to explode. A guard clipped by a vehicle at 50 km/h or less tumbles and gets up hostile.

## Stealth

### The view cone

| Item | Value |
|---|---|
| Range | 14 m by day, 10 m at night or in rain |
| Angle | 35 degrees either side of the guard's facing |
| Close circle | 2.5 m all round |
| Hearing | sprinting within 6 m; an engine within 12 m; a gunshot within 60 m. The Birdie is silent |
| Turn rate | 90 degrees a second |

**How it is drawn.** A flat fan of 16 triangles lying 0.05 m above the ground. Each rim point is pulled in by a ray through the spatial hash, so the cone visibly stops at walls and parked cars. Cyan at 25% opacity when calm, mango when the bar is at 50 or more, pink in an alarm. The rim pulses once a second. Up to 6 cones are drawn, nearest first.

### The "who is this" bar

```js
if (inCone && clearRay) bar += (20 + 60 * (1 - d / range)) * pace * disguise * dt;
else if (unseenFor > 2) bar -= 15 * dt;
// pace: walking 0.5, jogging 1, sprinting 1.5.  disguise: 0.5 in a mission outfit, otherwise 1
// bumping a guard: bar += 34.  A drawn weapon in the cone: bar = 100
```

At the rim it fills in 5 s; face to face, in 1.25 s. Three bumps fill it, which is the Yacht Rock rule. The bar sits above the hint line, labelled "Who is this?".

| Bar | What happens |
|---|---|
| 50 | the nearest guard goes Suspicious |
| 100, zone mode `strikes: n` | one strike: the guard walks you back 5 m and the bar resets to 30. The nth strike fails the step or sounds the alarm. Open House uses 3 |
| 100, zone mode `alarm` | the alarm, at once |

A guard found down by another guard is an alarm.

### Alarms

`stealth:alarm { zone, x, z }`:

1. Every guard in the zone turns hostile and draws. Those who cannot see the player Search at the alarm point.
2. A bell rings for 45 s.
3. The zone's `heatOnAlarm` is applied as a `trespass` case (kind `property`): 100 points by default, heat 2 in Open House, heat 4 at the Spire vault.
4. It ends when the player has been outside the zone and unseen for 45 s. Guards still standing walk back to Post and `stealth:clear` fires.

Extras: a flare makes guards within 30 m watch it for 8 s (B). A horn beyond a wall draws one guard (C). Firing from a vehicle, pistol and SMG only, to the sides (C).

## Events

Emits: `weapon:fired { weapon, x, z }`, `player:knockedout`, and the new `combat:hit { target, dmg }`, `combat:down { who, by }`, `combat:lock { id }`, `stealth:seen { bar }`, `stealth:strike { n }`, `stealth:alarm`, `stealth:clear`.
Listens: `heat:changed` (deputies become candidates at 3), `mission:step` (zones on and off), `player:switched`, `vehicle:crash`, `vehicle:blast`.
State: `state.combat = { slot, weapon, ammo, lock }`, `state.stealth = { bar, strikes, alarm }`. Health and armour stay in `state.player`.

## Edge cases

- Booked takes your weapons. Knocked out does not.
- A broken flamingo is gone; pull another from any lawn. The pink collectible ones are picked up by touch and are never weapons.
- Mags and Teo cannot hurt each other. A character a mission needs alive cannot go below 1 health during that mission.
- No weapons while swimming or on a two-wheeler.
- A deputy at heat 1 or 2 never fires; he books you (`heat.md`).
- Enemies never hurt each other or bystanders. Only the player's rounds, cars and explosions do.
- With two guards looking, the bar takes the faster fill, not the sum.

## Low and high

| | `low` | `high` |
|---|---|---|
| Hostile people at once, deputies included | 6 | 12 |
| People lying down, kept on screen | 4 | 12 |
| Cones drawn | 3, with 8 triangles | 6, with 16 |
| Cone rays | 5 times a second | every frame |
| Cover searches | 2 a second | 5 a second |
| Tracers, sparks and hit quads | 16 | 48 |

## Script checks

New test entries: `test.combat.give(weapon)`, `test.combat.damageAt(weapon, metres)`, `test.guards()` returning `[{ id, state, health, x, z }]`, `test.stealth()` returning `state.stealth`.

1. `damageAt('shotgun', d)` is 60 at 5 m, 35 ± 1 at 12.5 m, 10 at 20 m and 0 at 31 m. A pistol empties after 12 shots and fires again 1.4 ± 0.1 s later.
2. With hostile guards at 10 m, 5 degrees off centre, and at 6 m, 30 degrees off, aim locks the first (scores 11.0 and 12.3). A bystander 3 m straight ahead is never locked.
3. Player health set to 0 fires `player:knockedout`; the player wakes within 30 m of `(-500, -1700)` with 5% less cash.
4. A guard takes exactly 4 pistol hits to reach `down` and never leaves that state. A guard shot once with a parked car within 15 m is in `cover` within 3 s.
5. Jogging at 7 m inside a 14 m cone fills the bar at 50 ± 5 a second. Three bumps fire `stealth:alarm`. Unseen, a full bar is empty within 9 s.
6. Three pistol hits put a bystander `down` and fire `crime` with kind `killing` and case `kill`. Fifty noodle hits leave a bystander at 1 health. No event in the whole run names an animal as a target.

## New names

Events `combat:hit`, `combat:down`, `combat:lock`, `stealth:seen`, `stealth:strike`, `stealth:alarm`, `stealth:clear` · state keys `state.combat`, `state.stealth` · zone fields `strikes`, `heatOnAlarm` · the tactical officer · `settings.blood` · test entries `test.combat.give()`, `test.combat.damageAt()`, `test.guards()`, `test.stealth()`.
