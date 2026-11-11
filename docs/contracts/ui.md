# Contract · src/ui (lane: Play)

| Name | Signature | Meaning |
|---|---|---|
| modules.hud | `state { drift, gear, kmh }` · `drop(text)` · `clipMode(on)` | Speed, gear, rev bar, drift score, the clock text and the drop's score line. DOM elements in `index.html` for now |

Events I emit: none.

Events I listen to: `drift:end`, `input:first` (the hint fades).

Stand-ins I left: none. Not built yet: the canvas HUD, `layout()`, `show(id, on)`.
