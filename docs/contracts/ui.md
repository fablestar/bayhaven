# Contract · src/ui (lane: Play)

The HUD is one 2D canvas, `#hud`, over the game canvas (CSS size × `min(devicePixelRatio, 2)`, `pointer-events: none`). Menus and touch buttons are page elements. Day 1 and 2's HUD elements in `index.html` (`#title #clock #speed #drift #hint #drop`) are still filled in but are not visible; earlier checks read them.

| Name | Signature | Meaning |
|---|---|---|
| modules.hud | `canvas` · `layout() → [{ id, x, y, w, h, excl, shown }]` · `mode` (`'D'`, `'P'`, `'portrait'`) · `show(id, on)` · `clipMode(on)` · `clip` · `wordmark(height) → canvas` · `insets { l, t, r, b }` · `drop(text)` · `state { drift, gear, kmh }` · `stats { frames, redraws, draws, minFont }` · `refresh()` | Pieces: `cash followers clock live heat speed badge drop drift prompt hint toast subtitle tag`, plus places held for `minimap` (drawn by `minimap.mod.js`) and `radio` (a page element from `radio.mod.js`). `excl` names pieces never on screen at the same time. `layout()` is in CSS pixels. `show(id, false)` hides a piece. `clipMode(true)` hides hints, prompts, toasts and touch buttons and keeps the badge |
| modules.ui | `toast(text, seconds)` · `prompt(key, text)` · `clearPrompt()` · `hint(id, text, seconds)` · `hintDone(id)` · `tag(text, sub)` | Each is the event below. `card(spec)` is not built |
| modules.menus | `open(id)` · `close()` · `back()` · `isOpen` · `current` · `register({ id, title, build(page, menus, kit) })` · `kit { title, row, slider, toggle, choice }` · `sprintLatched()` | Page-element menus. Built in: `pause`, `settings`, `controls`. Esc opens, steps back and closes. While open: `loop.timeScale` is 0, `state.ui.paused` is true, `body.menu-open` is set and the game's keys are not delivered. Owns `state.settings` (`quality master music sfx reduceMotion sprintToggle`) and `state.ui.paused`; settings other than quality are kept in `localStorage` under `bayhaven.settings` (not with `?test=1`) |
| modules.touch | `mode` (`'drive'`, `'foot'`, `'menu'`, `'off'`) · `layout() → [{ id, x, y, w, h }]` · `enable(id, on)` for `'phone'` and `'switch'` | Lays out `#touch` (from `index.html`) and `#foot-touch` (the player lane's stand-in), or makes both if they are missing. Adds `#touch-ui` (pause, camera on foot, phone and switch hidden until enabled; they press `phone` and `switch` on `ctx.input`) and `#touch-zone`, where the stick appears under the thumb |
| modules.radioPill | `shown` · `station` · `song` · `ticker` · `rect` | `radio.mod.js` (lane: Sound). A page element in the HUD's `radio` rectangle: the station and song, and a ticker for `radio:line`. D: up for 4 s on `radio:station` and `radio:song` and while a line is spoken. P: always in a vehicle. A tap is the next station, a swipe right the one before. `test.radioPill()` |
| modules.minimap | `addBlip({ id, x, z, icon, colour, pulse, edge, label }) → blip` · `moveBlip(id, x, z)` · `removeBlip(id)` · `blips` (a Map) · `zoom` (metres across: 300, or 520 above 60 km/h) · `explored` (a Set of district ids) · `tiles` · `canvas` · `icons { drawIcon, iconIds }` | `minimap.mod.js` (D4-S4). Painted at 10 Hz on its own canvas and copied into the HUD's `minimap` rectangle every frame. Up is the car's heading, or the camera's on foot. **The blip registry:** any module adds a blip by id; adding the same id again replaces it. Icons: `player waypoint mission drop house wrench clothes umbrella carwash food marina taxi landmark dot` (an unknown icon is `dot`). `edge: true` keeps a blip on the rim when it is off the minimap (the default for `waypoint`, `mission`, `drop`). Every `map.places()` entry is a blip `place:<id>` from the start; the day's drop is the blip `drop` if `modules.drops.active.marker` is `{ x, z }`. Owns the save section `map` (`{ explored }`) |
| modules.mapscreen | `open()` · `close()` · `isOpen` · `view { x, z, zoom }` · `toScreen(x, z)` · `toWorld(px, py)` | `mapscreen.mod.js` (D4-S4). The menu page `map`, full screen: M opens and closes it, and the pause card has a Map row. Drag pans, the wheel, a pinch or the round buttons zoom (0.3 to 4 px a metre), a tap sets the waypoint (`modules.gps.setWaypoint`), a tap on the pin clears it. Draws every blip of the registry, the route, district names and landmark icons |
| `maptiles.js` | `createTiles(map) → { paint(g, x, z, rx, rz, scale, explored, budgetMs) → owed, count, stats }` · `drawIcon(g, id, x, y, size, colour, rot)` · `iconIds` · `COL` · `PLACE` · `readBack` · `countColours` | One 64 px canvas a chunk, made on first need from `map.surfaceAt`, `depthAt`, `lotsInChunk` and the park landmarks, at most 400 kept. Roads are drawn again as lines when a metre is over 0.6 px. Districts not in `explored` get an ink veil |
| modules.coach | `prompt` | The first hints, and the door prompt (a stand-in, below) |
| `wordmark.js` | `drawWordmark(g, x, y, height) → width` · `wordmarkCanvas(height)` · `WORDMARK_ASPECT` | The word Bayhaven from strokes and arcs. No font |
| `hud-layout.js` | `layoutFor(W, H, touch, insets) → { mode, k, s(p, d), safe, rects }` · `TOUCH` | Pure; every rectangle of the HUD for a screen size |
| test (D4-S4) | `test.minimap()` (colours, rect, span, heading, paints, tiles, explored, blips) · `test.map()` (open, view, colours, note) · `test.mapScreen(x, z)` · `test.mapWorld(px, py)` | |
| test | `test.hud()` (mode, smallest text, paint counts, what is showing) · `test.hudInsets({ l, t, r, b })` (pretend safe area) | |

CSS variables on `:root`: `--sl --st --sr --sb` (the safe-area insets; use them rather than `env()` so the pretend safe area reaches you), `--steer-l`, `--stick-l`.

Events I emit: `hud:layout { mode }` (after a resize), `menu:opened { id }`, `menu:closed`, `settings:changed { key, value }`, and from `coach` `ui:prompt`, `ui:hint`, `ui:hint:done`.

Events I listen to:

| Event | Payload | What happens |
|---|---|---|
| `ui:toast` | `{ text, seconds, tone }`, tone `'gain'` or `'bad'` | A toast at the top centre: three at once on a desktop, one on a phone. Waits while the tag is down |
| `ui:toast` | `{ kind: 'subtitle', who, text, seconds }` | A spoken line; hides the hint and prompt while up |
| `ui:prompt` | `{ key, text }`, or `null` to clear | `F  Get in`. Not drawn on touch (the context button carries it) |
| `ui:hint` | `{ id, text, seconds }` | One line, once per id, 8 s unless told |
| `ui:hint:done` | `{ id }` | The hint fades over 0.8 s |
| `ui:tag` | `{ text, sub, colour }` | The luggage tag |
| `district:entered` | `{ id }` | The luggage tag with the district's name (`map.zone(id).name`) and colour, and `map.neighbourhoodAt` under it. The minimap adds the id to `explored` |
| `view:resize`, `drift:end`, `input:first`, `game:ready`, `vehicle:entered`, `vehicle:exited` | | layout, the drift line, the first hints |

State I read: `economy.cash`, `economy.followers`, `clock.hour` (and `clock.weekday` if it is ever a string), `heat.level`, `heat.viewers`, `player.mode`, `player.vehicle`, `build.day`, `settings.reduceMotion`. Public objects I read: `vehicles.player`, `vehicles.models[id].name`, `map.neighbourhoodAt`, `player.nearest()`, `clock.skip()`, `save.write`, `quality.set`.

Keys: M is the map and 0 is mute since D4-S4 (`src/core/input.js` no longer maps M to the press `mute`; the audio lane already listens for 0).

Stand-ins I left: `coach.mod.js` asks `modules.player.nearest()` ten times a second to raise the door prompt; the player module should emit `ui:prompt` itself. `hud.js` is the old page-element HUD, kept unseen for older checks; it goes when `index.html` loses those elements.

For other lanes:
- Sound: `settings:changed` with `master`, `music`, `sfx` (0 to 1) has no listener yet.
- Motion: `state.settings.reduceMotion` is honoured by the HUD only; the camera should read it.
- Garage: `src/vehicles/subtitle.js` can go; the HUD draws `ui:toast { kind: 'subtitle' }` and hides `#car-subtitle`.
- Player: `src/actors/foottouch.js` can go once `index.html` drops `#touch`; this lane then makes every button.

## The LIVE overlay (session D5-S1: `live.mod.js`, `live-booked.js`)

| Name | Signature | Meaning |
|---|---|---|
| modules.live | `say(user, text)` · `fire(trigger, data) → rows queued` · `line(on, data, force)` (the ticker) · `rows` · `ticker` · `up` · `booked { show(data), hide(), open, info() }` · `stats` | Painted on the HUD canvas after the HUD and the minimap (render order 73), in its own boxes: the chat under the clock (D: 320 x 130, five rows; P: 220 x 60, three; portrait: left, under the minimap) and the Sheriff's ticker under it (D from heat 3, P from heat 4, none in portrait). Up while heat is 3 or more and for 4 s after it clears. A row is `user: line`, the name pink, cyan or mango by its number; it comes in from below in 180 ms, lives 6 s and fades over the last 800 ms. An event shows two to four matching rows over 2 s; after 4 quiet seconds filler runs at 0.5 a second at 1,000 viewers up to 4 at 200,000. A row is not one of the last three shown, and not one of the last 30 if another fits. One soft ping per row on the `ui` bus, four a second at most |
| the booking screen | `#booked`, a page overlay holding one 900 x 560 canvas and the `Walk out` button | Shown on `player:booked`: the lead with the board (`Marlin County`, the name, `No. 0005` from the build day), the sand panel with the cost, Lawyer Larry's card sliding in at 1.8 s. Leaves on the button, Enter, Space, Esc or after 6 s. It does not pause the game |
| test | `test.live()` → `{ up, shown, rows, ticker, tickerLines, onHud, box, stats, lines, tierA, users, booked }` | |

Listens: `heat:changed`, `heat:live`, `heat:cleared`, `heat:dropped`, `drift:end`, `jump:landed`, `vehicle:crash`, `prop:broken`, `ped:hit`, `vehicle:destroyed`, `vehicle:entered`, `cop:fired`, `crime`, `player:knockedout`, `player:booked`, `game:reset`, `hud:layout`, `view:resize`. Emits nothing.

Not done here: the siren lights do not dim with the meter at heat 1 and 2, and the LIVE pill has no unseen look or `OFF AIR` (both are pieces in `hud-draw.js`, outside this session's files). Tapping the pill does nothing (the helicopter cam is D5-S2).

## The fight's page elements (session D5-S4: `weapons.mod.js`)

| Name | Signature | Meaning |
|---|---|---|
| modules.weapons | `bar` · `vitals` · `knockedOut { open, data, show(data), hide(), dismiss() }` · `layout() → [{ id, x, y, w, h }]` | Page elements, on foot only, hidden in clips, menus and while knocked out. `#combat-ui`: the three-slot quick bar (above the radio pill on a desktop, under the clock on a phone; a slot is 84 x 44 px, 72 x 64 on touch) with the health and armour bars over it, shown only when not full. `#combat-touch`: `Fire` (hold) and `Lock` (a toggle), 72 px. `#hurt-flash`: a pink edge for half a second on `player:hurt`. This module sets `input.actions.aim` and `.fire` when no script is running |
| keys | | Right mouse or L holds the lock, left mouse or Ctrl fires, 1 2 3 pick a slot (not with `?debug`, which uses the digits), G is the next target. Pad: left trigger, right trigger, d-pad left and right |
| Knocked out | `#knockedout` and one 1200 x 120 canvas | On `player:knockedout`: `#game` gets the class `ko` (12 degrees, grey, over 600 ms; no tilt with reduce motion), the wristband slides in from the left at 900 ms with the name, a bar code and the bill. A press, Enter or Space after 1.4 s sends it out and calls `modules.health.wake()`; `player:woke` fades from white |
| settings | `state.settings.blood` (true) | A `Blood` switch on the settings page (`menus.mod.js`); off: grey dust, no patch |
| test | `test.weaponsUi() → { shown, slots, vitals, knockedOut, layout, held, aim, fire }` | |

For core: on foot the pad's triggers still walk (input.js adds gas and brake to `moveY`); they should not once aim and fire are theirs. `aim` and `fire` are not wired in `input.js`; this module does it.

## The mission's screen (session D6-S1: `missionui.mod.js`, `mission-card.js`)

| Name | Signature | Meaning |
|---|---|---|
| modules.missionui | `card` · `info()` · `rects() → { objective, block, subtitle }` · `portrait(who) → canvas` · `stats` | Reads `modules.missions.view` and `modules.dialogue.current`; decides nothing. Painted on the HUD canvas after the HUD (render order 74): the **objective line** (a cyan chevron, italic 700, D left 24 top 104, P left 14 top 58; a new step strikes the old line in pink and slides the new one in), the **timer** (pink and pulsing under 10 s, with a bar when the step has a total; a running clock in cup mode), a **bar** (`Hook 1/3`, pips up to six), and the **subtitle** in the HUD's `subtitle` rectangle: ink 70%, a portrait of the speaker drawn in code on their shirt colour, the name in mango, the line in white, two rows at most. While a line is up the HUD's `hint`, `prompt` and its own `subtitle` are hidden; while an objective is up the HUD's `drop` line is hidden (they share a corner) |
| markers | world and minimap | A place is a ring and a beam (pink for the objective, cyan for a mission on offer); a vehicle, a pickup or a moving target is a small spinning pointer above it. One blip each in the minimap's registry: `mission:goal`, `mission:target`, `mission:pick<n>`, `mission:offer:<id>`, with `edge: true`. A step with `route: true` sets the GPS waypoint. 2 draw calls a place, 1 a pointer |
| page elements | `#mission-ui` | Two ink bars for the cutscene stub with `Tap or press Enter to skip`, and the `choice` step's cyan pills (keys 1 to 9 too). Hidden in a clip |
| the postcard (`mission-card.js`) | `createCard(ctx, { retry, replay, closed, stamped }) → { show(data, photo), hide(now), primary(), save(), open, info(), canvas, stats, timings }` | `#postcard`: one 1760 x 1120 canvas (the kit's 880 x 560 design at twice the size), shown at up to 880 px wide, turned -3 degrees. A snapshot of the mission's last frame in the white border (grey when failed), the mission's name in pink over a cyan copy, `Greetings from Bayhaven`, a postage stamp with Gerald and the day, three lines (`Time`, `Cash`, `Followers`; `Best` in the cup), the caption, and the rubber stamp: `Delivered` in pink, or `Return to sender` in ink. Up from below in 420 ms with an overshoot, lines written on at 500, 650 and 800 ms, the stamp lands at 1,100 ms with a thud and confetti. Pills under it: `Continue`, `Replay`, `Save image` (a PNG), or `Retry` and `Give up`. Enter is the first pill. With reduce motion: fades, no confetti. It is never a banner |
| test | `test.missionUi() → { objective, objectiveInk (its width in px), timer, clock, bar, cutscene, markers, meshes, blips, route, subtitle { who, name, text, rows, rect, px, face }, portraits, card { open, failed, title, stamp, stamped, rows, rect, widthShare, buttons }, rects, stats, choice }` | |

Emits `mission:stamped { id, failed }`, `ui:toast` (a new job on offer), `ui:tag` (the mission's name when it starts). Listens: `mission:*`, `hud:layout`, `view:resize`, its own `keydown` and `pointerdown`.

Rough: the rubber stamp sits where the kit puts it (centre 760, 190), which overlaps the end of the `Time` line. The objective block is not a piece of `hud.layout()`; `rects()` gives its place.

## The phone's screen (session D6-S2: `src/ui/phone/`)

Page elements, made by `src/systems/phone.mod.js` (its contract is in `systems.md`): `#phone` (z 38; D 360 x 720 at right 80, top 180 when the window is at least 1000 x 900; otherwise P 300 x 366 at right 14, top 12), `#phone-veil` (ink 25%, z 37), `#phone-pill` (a new text, above the HUD's `minimap` rectangle), `#photo-ui` (photo mode's drag area, buttons and the card it shows after a shot, z 45). The menu veil (z 40) covers the phone, so Map and Settings open over it. `shell.js` exports `ICONS`, `PHONE_CSS`, `skyOf(hour)`, `createShell`. Body classes: `photo-mode`, `photo-nohud`.
