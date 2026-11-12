# Contract · src/systems (lane: Play)

| Name | Signature | Meaning |
|---|---|---|
| modules.clock | `hour` · `set(hour)` · `skip()` | Owns `state.clock`. Runs on drawn time: afternoon 1/11 h per second, sunset 1/24, night 1/3. `skip()` is the T key |
| modules.drops | `id` · `active` | Runs the file in `src/content/drops/` whose `day` is the build day; `active` is what its `start(ctx)` returned |
| `signals.js` | `createSignals({ nav, scene, events, collide })` | Traffic lights. Owned by the Motion lane and registered from `src/vehicles/signals.mod.js`; its contract is in `vehicles.md` |
| modules.clips | `play(id) → Promise` · `ids` | Plays `src/content/clips/day-N.js`; `?clip=day-N` plays at load. Adds `test.clip.play(id)` |
| modules.gps | `setWaypoint(x, z) → bool` · `clear()` · `waypoint` (`{ x, z }` or null) · `route` (`[{ x, z }]` or null) · `distance` (metres of route left) · `straight` · `stats { routes, reroutes, ms, nodes, edges, expanded, chevrons }` | `gps.mod.js` (D4-S4). A* over every junction of `map.nodes` and every piece of `map.pieces` that is not a stub, cost length / speed limit; built once, so a route crosses districts that are not loaded. The route starts at the point of the nearest road to the player, runs junction to junction, and ends at the point of the nearest road to the waypoint and then the waypoint. Four times a second the part behind the player is dropped; more than 35 m off it, a new route is found (once a second at most). Within 22 m of the waypoint, or 10 m of the end of the road to it, it clears with a toast. Draws up to 24 chevrons on the road ahead (one draw call, 96 triangles). Adds the blip `waypoint` to the minimap. `test.gps()`, `test.waypoint(x, z)` (no arguments clears) |

Events I emit: `clock:hour { hour }`, `waypoint:set { x, z }`, `waypoint:cleared { reached }` (gps).

Events I listen to: `input:press` (skipTime), `game:reset`, `game:ready` (to start a clip).

Stand-ins I left: none.

## Heat (session D5-S1: `heat.mod.js`, `heat-sound.js`)

| Name | Signature | Meaning |
|---|---|---|
| modules.heat | `level` · `set(n)` · `clear()` · `addPoints(n)` · `crime(case, x, z, { seen, points, weapon }) → { points, seen }` · `witnessed(x, z) → bool` · `book() → { cost, level, x, z, standIn, cash }` · `drop(reason) → bool` · `stunt(share)` · `hidden()` · `sight()` (metres a deputy sees: 60, or 45 at night or in weather) · `hold` (a clip or a check holds the level: no drain, no level-up, always seen) · `sound` · `numbers` · `ENTRY` · `CAP` · `CASES` | Owns `state.heat = { level, viewers, peak, seen, points, levelT, unseenT, last { x, z } }`. 100 points is a level. `last` is where a deputy last saw the player, or the last crime that counted; cruisers are sent there. The viewer maths is the bible's, to the letter: in view the meter climbs through the level's range in 90 s and then the level rises; unseen for 1.5 s it drains at 8% of peak a second divided by the level, doubled when `hidden()` (today: within 12 m of a `carwash` place). Sight is asked of `modules.cops.sees` four times a second (eight on `high`). Reads `state.mission.flags.heat { min, max, frozen, muted }` |
| the cases | `hitprop 10 · hitcar 15 · punch 20 · hitped 25 · carparked 30 · cartheft 100 · hurt 100 · flare 100 · hitcop 100 · punchcop 100 · threat 100 · gunfire 100 (200 seen at heat 1 or more) · kill 200 · killcop 300 · evade 100 · survive 100` | Fired today: `hitcar` (`vehicle:crash` into a vehicle at 15 km/h or more), `hitcop` (the same into a cruiser, unless the cruiser was the one swinging), `hitped` and `kill` (`ped:hit` by the player, at or under 50 km/h and over), `hitprop` (`prop:broken`, not cones), `gunfire` and `flare` (`weapon:fired { weapon, x, z }`), `carparked` (`vehicle:entered` in a car that was not his), the vehicles lane's own carjack `crime` (100 if seen), `evade`, `survive`. Crimes of 25 points or fewer cannot pass 299 points. The others wait for weapons and health |
| `heat-sound.js` | `createHeatSound(ctx) → { call(kind, level, seen), fill(text), update(dt, cops), stats() }` | One siren voice on the `effects` bus (a wail at heat 1 and 2, a yelp from 3), as loud as the nearest lit cruiser is close, out to 220 m. The scanner: a call from `src/content/scanner.js` for every `crime` that was seen or counted, spoken as the dispatcher's blips on the `voice` bus with static before and a beep after, and shown as a subtitle, when a cruiser is within 30 m. One call at a time; `killing` and `deputy-down` cut in |
| a clip with heat | `heat: n`, `viewers`, `cops` on a `src/content/clips/day-N.js` file | When that clip starts the level is set and held, the viewers set, and `cops` cruisers staged round the player |
| test | `test.setHeat(n)` · `test.heat()` (the state plus `hidden hold evadeT streamT cops`) · `test.crime(case, x, z, opts)` · `test.heatSound()` | |

Events heat emits: `crime { kind, case, seen, points, x, z, weapon, level }` (`level` is the heat before any rise), `heat:changed { level, from }`, `heat:live { viewers, peak }` twice a second at heat 3 and above, `heat:cleared { peak, seconds, from, why }`, `heat:seen { seen }`, `heat:dropped { reason, level }`, `player:booked { cost, level, x, z, standIn, cash }`, `cash:changed { cash, by, why }`, `scanner:call { kind, level, text, heard }`, and the dispatcher's `ui:toast` subtitle.

Events heat listens to: `vehicle:crash`, `ped:hit`, `prop:broken`, `weapon:fired`, `vehicle:entered`, `player:spawned`, `jump:landed`, `crime` (another lane's, without `points`), `game:reset`, `game:ready`.

Stand-ins and gaps: Booked puts the player at the kerb of the road nearest the Sheriff's HQ place `(200, -2150)` pulled inside today's map (about `(200, -1406)`), on foot, two hours on. Weapons are not taken (there are none). `state.economy.cash` has no owner yet, so `book()` writes it and emits `cash:changed`. Heat 4 and 5 run in the meter but bring no new units, roadblocks or helicopter (D5-S2). "Parked with the engine off", bridges and garages do not hide yet. Since D5-S2 `heat:broadcast` and `heat:roadblock` are emitted by `modules.copsheavy`, heat 4 and 5 bring their units and roadblocks, and `modules.cops.sees` (which heat asks) includes the news helicopter's spotlight: see `actors.md` and `vehicles.md`.

## Health (session D5-S4: `health.mod.js`)

| Name | Signature | Meaning |
|---|---|---|
| modules.health | `hurt(dmg, { ranged, weapon, by, x, z, raw }) → taken` · `heal(n)` · `vest(n = 100)` · `knockOut()` · `wake()` · `down` · `hospital() → { x, z, standIn }` · `numbers` · `max { health: 100, vest: 100 }` | Writes `state.player.health` and `.armour`. A weapon in someone's hands does half its table number to the player (`raw: true` skips that); a vest takes 80% of a ranged hit. After 6 s without a hit health creeps to 30 at 2 a second. Save section `health` |
| Knocked out | health 0 | 5% of cash up to $2,500 is taken at once (`cash:changed`, why `knockedout`), input is held, and after 5 s (or `wake()`, which the wristband screen calls on a press) heat clears and the player stands on foot at the hospital point with 50 health. Weapons are kept. **Stand-in:** Bayhaven General `(-500, -1700)` pulled inside today's map, at the kerb of the nearest road (about `(-500, -1406)`), until Northgate exists |
| test | `test.health() → { health, armour, down, bill, sinceHit, hospital, max }` · `test.health.set(n)` (0 knocks out) · `.vest(n)` · `.hurt(dmg, opts)` · `.wake()` | |

Emits `player:hurt { dmg, health, armour, by, weapon, x, z }`, `player:knockedout { bill, cash, lead, x, z, seconds }`, `player:woke { x, z, health, standIn }`, `cash:changed`. Listens: `combat:hit` with `target: 'player'` and no `applied` (a deputy's round: 9 on foot; in a car it goes to `modules.damage.hurt` on the car), `vehicle:blast` (on foot within the radius: `120 × (1 - d / r)`), `game:reset`.

Not built: damage from a vehicle hitting the player on foot, falls, food. `heat.mod.js` now ignores `weapon:fired` with `melee: true`.
