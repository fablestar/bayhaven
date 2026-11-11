# Contract · src/world (lane: World)

| Name | Signature | Meaning |
|---|---|---|
| modules.world | `colliders [{ x0, x1, z0, z1 }]` · `buildings` · `bounds` · `spawn` · `heightAt(x, z)` · `insideBuilding(x, y, z, pad)` · `triangles` | The day 1 block, in day 1's shape. Goes away when `chunks` and `collide` ship |
| modules.map | `districtAt(x, z)` · `isLand(x, z)` · `heightAt(x, z)` · `depthAt(x, z)` · `surfaceAt(x, z)` · `nearestRoad(x, z)` · `snap(seed, need)` · `chunkOf(x, z)` · `bounds` · `drawn` | Answers for the day 1 block only; `tideline` inside it, `null` outside |
| modules.nav | `lanes` · `lane(id)` · `laneNear(x, z, heading)` · `next(lane, r)` · `lanesInChunk(cx, cz)` · `route(from, to, { avoid }) → [{ x, z }]` · `streets` | 20 lanes on the block's four streets, keep right, 3.5 m off centre. A lane is `{ id, roadId, name, kind, ax, az, bx, bz, len, heading, speed, level, next: [ids], signal, left, right }` |
| modules.props | `add(kind, x, y, z, rot, { color, onChange })` (during init only) · `hitTest(cx, cz, R, vx, vz, onHit)` · `reset()` · `count(kind, 'down' or 'up')` | Lamps, barriers, cones; one instanced mesh per part. Updates at order 26, after vehicles |
| modules.gulls | `{}` | Gulls over the beach |

Allowed import from another lane: `block.js` imports `createParkedCar` from `src/vehicles/models.js`.

Events I emit: `district:entered { id, was }` (map). `prop:broken` is emitted by vehicles for now.

Events I listen to: `game:reset` (props stand back up).

Stand-ins I left: `map.js` and `map.mod.js` (replace with the `map` contract in plan/bible/tech/contracts.md), `nav.js` and `nav.mod.js` (replace with the `nav` contract; `walkNear`, `walkNext`, `crossings` return nothing).
