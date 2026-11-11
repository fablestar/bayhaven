# Contract · src/content (lane: Play; radio/ belongs to Sound)

| Name | Signature | Meaning |
|---|---|---|
| drops/day-N.js | `export default { day, id, marker: { x, z }, start(ctx) → { score, reset(), update(dt, night) }, stop(ctx) }` | The daily drop. Day 2 is Drift Night. Day 3 is the Flamingo Flash Mob (`drops/day-3.js`, lane Motion): it returns `{ formed, broken, size, beat, move, filming, members, numbers, moves, reset(), update(dt) }` and exports `MOB` |
| clips/day-N.js | `export default { id, seconds, hour, weather, vehicle, camera, at: { x, z, heading }, inputs: [{ t, hold }] }` | The day's scripted clip |

Shapes for every other kind of content are in plan/bible/tech/schemas.md. Content files are found by a glob; never listed by hand.

Events I emit: `crowd:formed { id, size }` and `crowd:scattered { id }` (the flash mob). Events I listen to: `drift:end`, `prop:broken` (Drift Night's score board); `weapon:fired`, `peds:rebuilt` (the flash mob).

Stand-ins I left: none.
