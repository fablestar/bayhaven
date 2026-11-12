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
