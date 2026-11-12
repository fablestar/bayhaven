# Contract · src/content (lane: Play; radio/ belongs to Sound)

| Name | Signature | Meaning |
|---|---|---|
| drops/day-N.js | `export default { day, id, marker: { x, z }, start(ctx) → { score, reset(), update(dt, night) }, stop(ctx) }` | The daily drop. Day 2 is Drift Night. Day 3 is the Flamingo Flash Mob (`drops/day-3.js`, lane Motion): it returns `{ formed, broken, size, beat, move, filming, members, numbers, moves, reset(), update(dt) }` and exports `MOB` |
| clips/day-N.js | `export default { id, seconds, hour, weather, vehicle, camera, at: { x, z, heading }, inputs: [{ t, hold }] }` | The day's scripted clip |

Shapes for every other kind of content are in plan/bible/tech/schemas.md. Content files are found by a glob; never listed by hand.

Events I emit: `crowd:formed { id, size }` and `crowd:scattered { id }` (the flash mob). Events I listen to: `drift:end`, `prop:broken` (Drift Night's score board); `weapon:fired`, `peds:rebuilt` (the flash mob).

Stand-ins I left: none.

## Day 5 (session D5-S1)

| Name | Signature | Meaning |
|---|---|---|
| `chat.js` | `CHAT: [{ n, on, if, text, tier }]` · `USERS` (30) | The LIVE chat's rows, word for word from the bible: 67 today (the 40 A rows of groups 1, 2, 5, 6, 7, 9, 10, 11, 15, 16 and 27 B rows of the same groups). `on` is a trigger of `modules.live.fire`: `live heat3 filler3 copfire drift jump crash prop pedhit unseen swap dropped mags cleared knockedout`. `if` is an object: `score metres kmh seconds` (at least), `kind`, `lead`, `inCar`, `near: [landmark id, metres]`, `half`, `unseen`, `under`, `first`, `chopper`, `parked`, `gunfire`, `healthUnder` |
| `scanner.js` | `CALLS[kind] = [heat 1, heat 2, heat 3]` · `CALL_AS` · `DISPATCH_VOICE` · `TICKER: [{ id, on, when, text }]` | 27 of the scanner's calls (the nine A kinds at heat 1 to 3) and the 18 A ticker lines for heat 3 |
| `clips/day-5.js` | the clip shape plus `heat`, `viewers`, `cops` | Night on the beachfront at heat 3 with three cruisers |

## Day 5, heat 4 and 5 (session D5-S2)

| Name | Signature | Meaning |
|---|---|---|
| `heat-high.js` | `CHAT_HIGH` (20 rows) · `TICKER_HIGH` (10 lines) | Chat rows 25 to 33, 35 to 43, 161 and 162 and ticker lines D04 to D09 and D12 to D15, word for word. `src/actors/cops-heavy.mod.js` pushes them onto `CHAT` and `TICKER` at load and fires their triggers: `heat4 heat5 filler4 filler5 roadblock spikes chopper2 shootout truck truckfire big choppercam`; ticker `step4 step5 chopper2 viewers` |
| `drops/day-5.js` | the drop shape; returns `{ id, score { best, last, live, presses, x, z }, armed, pressed, running, label, press(), reset(), update(dt, night) }` · `PILOT` | "Bayhaven Blue: Pilot Episode": a red button on a plinth in the plaza of the day 1 block (found as the widest gap in the block's front row). Touching it on foot or with a car sets heat 5. The sign and the HUD's drop line show viewers while on air and the peak afterwards. Emits `drop:pilot { on, x, z }` and `{ on: false, peak, best }` |

## Weapons (session D5-S4: `weapons.js`)

`WEAPONS.<id>` is `{ id, name, slot: 'hand' | 'sidearm' | 'long', damage, every, reach or range, holds, reload, spread, pack (rounds a pickup gives), most, sound, boxes [[along, up, side, length, height, width, colour]] }` for `fists noodle flamingo pistol flare smg shotgun`, with the numbers of plan/04 section 8 and the timings of the combat bible. Also `SLOTS`, `SLOT_NAMES`, `damageAt(id, metres)`, `WHO` (health, vest and colours for `player bystander guard crew deputy`), `COMBAT` (every number of the fight that is not one weapon's, the bill and the hospital point), `BARKS` (guards' lines: `callout cover flee hit search`) and `PICKUPS` (the three spots that stand in for shops).
