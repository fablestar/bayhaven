# Contract · src/ui (lane: Play)

The HUD is one 2D canvas, `#hud`, over the game canvas (CSS size × `min(devicePixelRatio, 2)`, `pointer-events: none`). Menus and touch buttons are page elements. Day 1 and 2's HUD elements in `index.html` (`#title #clock #speed #drift #hint #drop`) are still filled in but are not visible; earlier checks read them.

| Name | Signature | Meaning |
|---|---|---|
| modules.hud | `canvas` · `layout() → [{ id, x, y, w, h, excl, shown }]` · `mode` (`'D'`, `'P'`, `'portrait'`) · `show(id, on)` · `clipMode(on)` · `clip` · `wordmark(height) → canvas` · `insets { l, t, r, b }` · `drop(text)` · `state { drift, gear, kmh }` · `stats { frames, redraws, draws, minFont }` · `refresh()` | Pieces: `cash followers clock live heat speed badge drop drift prompt hint toast subtitle tag`, plus places held for `minimap` and `radio` (nothing is drawn there yet; their sessions should draw inside those rectangles). `excl` names pieces never on screen at the same time. `layout()` is in CSS pixels. `show(id, false)` hides a piece. `clipMode(true)` hides hints, prompts, toasts and touch buttons and keeps the badge |
| modules.ui | `toast(text, seconds)` · `prompt(key, text)` · `clearPrompt()` · `hint(id, text, seconds)` · `hintDone(id)` · `tag(text, sub)` | Each is the event below. `card(spec)` is not built |
| modules.menus | `open(id)` · `close()` · `back()` · `isOpen` · `current` · `register({ id, title, build(page, menus, kit) })` · `kit { title, row, slider, toggle, choice }` · `sprintLatched()` | Page-element menus. Built in: `pause`, `settings`, `controls`. Esc opens, steps back and closes. While open: `loop.timeScale` is 0, `state.ui.paused` is true, `body.menu-open` is set and the game's keys are not delivered. Owns `state.settings` (`quality master music sfx reduceMotion sprintToggle`) and `state.ui.paused`; settings other than quality are kept in `localStorage` under `bayhaven.settings` (not with `?test=1`) |
| modules.touch | `mode` (`'drive'`, `'foot'`, `'menu'`, `'off'`) · `layout() → [{ id, x, y, w, h }]` · `enable(id, on)` for `'phone'` and `'switch'` | Lays out `#touch` (from `index.html`) and `#foot-touch` (the player lane's stand-in), or makes both if they are missing. Adds `#touch-ui` (pause, camera on foot, phone and switch hidden until enabled; they press `phone` and `switch` on `ctx.input`) and `#touch-zone`, where the stick appears under the thumb |
| modules.coach | `prompt` | The first hints, and the door prompt (a stand-in, below) |
| `wordmark.js` | `drawWordmark(g, x, y, height) → width` · `wordmarkCanvas(height)` · `WORDMARK_ASPECT` | The word Bayhaven from strokes and arcs. No font |
| `hud-layout.js` | `layoutFor(W, H, touch, insets) → { mode, k, s(p, d), safe, rects }` · `TOUCH` | Pure; every rectangle of the HUD for a screen size |
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
| `district:entered` | `{ id }` | The luggage tag with the district's name and colour, and `map.neighbourhoodAt` under it |
| `view:resize`, `drift:end`, `input:first`, `game:ready`, `vehicle:entered`, `vehicle:exited` | | layout, the drift line, the first hints |

State I read: `economy.cash`, `economy.followers`, `clock.hour` (and `clock.weekday` if it is ever a string), `heat.level`, `heat.viewers`, `player.mode`, `player.vehicle`, `build.day`, `settings.reduceMotion`. Public objects I read: `vehicles.player`, `vehicles.models[id].name`, `map.neighbourhoodAt`, `player.nearest()`, `clock.skip()`, `save.write`, `quality.set`.

Stand-ins I left: `coach.mod.js` asks `modules.player.nearest()` ten times a second to raise the door prompt; the player module should emit `ui:prompt` itself. `hud.js` is the old page-element HUD, kept unseen for older checks; it goes when `index.html` loses those elements.

For other lanes:
- Sound: `settings:changed` with `master`, `music`, `sfx` (0 to 1) has no listener yet.
- Motion: `state.settings.reduceMotion` is honoured by the HUD only; the camera should read it.
- Garage: `src/vehicles/subtitle.js` can go; the HUD draws `ui:toast { kind: 'subtitle' }` and hides `#car-subtitle`.
- Player: `src/actors/foottouch.js` can go once `index.html` drops `#touch`; this lane then makes every button.
