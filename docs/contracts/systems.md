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
