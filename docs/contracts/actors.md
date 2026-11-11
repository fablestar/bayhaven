# Contract · src/actors (lane: Motion)

| Name | Signature | Meaning |
|---|---|---|
| modules.player | `get() → state.player` · `teleport(x, z, heading, level, speed)` | The player is always in the Heron on day 2. Owns `state.player`: the plan's fields plus `kmh vf vl w slip gear mu drift` |
| modules.camera | `mode` ('chase' or 'close') · `lookBack` · `next()` · `snap()` · `resize(w, h)` · `speedShake()` | Chase, close chase (C), look-back (hold B) |

Events I emit: `player:spawned { id, x, z }`.

Events I listen to: `input:press` (camera), `game:reset`, `view:resize`.

Stand-ins I left: none. Not built yet: `enter`, `exit`, `giveWeapon`, `setOutfit`, `freeze`.
