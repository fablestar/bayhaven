# Contract · src/content (lane: Play; radio/ belongs to Sound)

| Name | Signature | Meaning |
|---|---|---|
| drops/day-N.js | `export default { day, id, marker: { x, z }, start(ctx) → { score, reset(), update(dt, night) }, stop(ctx) }` | The daily drop. Day 2 is Drift Night |
| clips/day-N.js | `export default { id, seconds, hour, weather, vehicle, camera, at: { x, z, heading }, inputs: [{ t, hold }] }` | The day's scripted clip |

Shapes for every other kind of content are in plan/bible/tech/schemas.md. Content files are found by a glob; never listed by hand.

Events I emit: none. Events I listen to: `drift:end`, `prop:broken` (Drift Night's score board).

Stand-ins I left: none.
