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

## Day 6 (session D6-S1)

| Name | Signature | Meaning |
|---|---|---|
| `missions/<nn>-<id>.js` | the mission shape of schemas.md, plus `actors`, `offer`, `flags`, `hour`, and on steps `text say done cues set then fail` (see `systems.md`) | `01-final-notice.js`: mission 1, the six steps of plan/05 and all 40 lines of the script |
| `cast.js` | `CAST.<id> { name, voice { wave, hz, ms, rate, end }, shirt, skin, hair, hat, hatColour }` · `VIA` | Who speaks: `mags teo marco wendell guide`. A speaker not listed gets their id as a name and a 220 Hz blip |
| `drops/day-6.js` | the drop shape; returns `{ id, score { best, last, runs, finished, x, z }, running, ghost, recorded, begin(), label(), reset(), update(dt) }` · `CUP` | "The Getaway Cup": a mango ring at `(-1238, -208)` starts mission 1 in cup mode from its `enter` step. The run is sampled four times a second; the best is kept (in `localStorage` under `bayhaven.cup`, not with `?test=1`) and driven beside you as a see-through cyan coupe. `test.cup()`, `test.cup.begin()` |
| `clips/day-6.js` | the clip shape plus `mission` | Golden hour at the plaza: the third ram, the scooter slides to the kerb, the cut to the postcard |

## Day 6, the phone (session D6-S2)

| Name | Signature | Meaning |
|---|---|---|
| `squawk.js` | `SQUAWK: [{ n, on, if, who, text, tier }]` · `ACCOUNTS` · `HANDLES` · `REPLIES: [{ to, text }]` | The 40 tier A templates of `bible/voices/squawk.md`, word for word, with its row numbers. `if`: `min { field }`, `max { field }`, `is { field: value or [values] }`, `lead`, `he` (skipped while Mags leads), `after` (the weather before), `shots`. `kmh` is read from the payload's `speed`. `REPLIES` are seven lines for the Sheriff's account (`to` a row number, or `'mention'`) |
| `messages.js` | `MESSAGES: [{ id, from, to, on, when { id }, text, waypoint, once, tier }]` · `SENDERS.<id> { name, hz }` | The 22 mission offers of `bible/story/messages.md`, word for word |
| `missions/03-repo-woman.js` | the mission shape | Mission 3: eleven engine steps (the bible's ten and a closing `say`), all 39 lines, Chad as a scripted Grouper down Coral Boulevard |
| `missions/07-as-seen-on-tv.js` | the mission shape | Mission 7: six engine steps, all 30 lines, a parked Tarpon in the Sheriff's colours on Rosa Street to honk at |
| `cast.js` | adds `chad rucker deputy` | |
