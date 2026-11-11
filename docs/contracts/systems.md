# Contract · src/systems (lane: Play)

| Name | Signature | Meaning |
|---|---|---|
| modules.clock | `hour` · `set(hour)` · `skip()` | Owns `state.clock`. Runs on drawn time: afternoon 1/11 h per second, sunset 1/24, night 1/3. `skip()` is the T key |
| modules.drops | `id` · `active` | Runs the file in `src/content/drops/` whose `day` is the build day; `active` is what its `start(ctx)` returned |
| `signals.js` | `createSignals({ nav, scene, events, collide })` | Traffic lights. Owned by the Motion lane and registered from `src/vehicles/signals.mod.js`; its contract is in `vehicles.md` |
| modules.clips | `play(id) → Promise` · `ids` | Plays `src/content/clips/day-N.js`; `?clip=day-N` plays at load. Adds `test.clip.play(id)` |

Events I emit: `clock:hour { hour }`.

Events I listen to: `input:press` (skipTime), `game:reset`, `game:ready` (to start a clip).

Stand-ins I left: none.
