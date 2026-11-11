# Contract · src/actors (lane: Motion)

| Name | Signature | Meaning |
|---|---|---|
| modules.player | `get() → state.player` · `mode` ('car' or 'foot') · `me` (the body on foot) · `rig` · `exit() → bool` · `enter() → bool` · `nearest() → { veh, side, d } or null` · `teleport(x, z, heading, level, speed)` · `stamina` (0..1) · `inputMode` · `foot` · `doors` | The player is Teo. Owns `state.player`: the plan's fields plus `kmh vf vl w slip gear mu drift stamina grounded depth pose act`. `mode` is `'car'` or `'foot'` (day 2 wrote `'vehicle'`). `vehicle` is the model id in a car and `null` on foot. `teleport` moves the car when he is in it and him when he is not. `nearest()` is the door F would use, for a prompt |
| the body on foot (`player.js`, `createFoot`) | `me { x y z h vx vz vy speed grounded air stamina tired depth yawRate pose surface sprinting r }` · `step(dt, actions, camYaw)` · `move(dt, skipCar)` · `place(x, z, h)` · `clear(x, z, skipCar)` · `groundAt(x, z, feet)` · `depthAt(x, z)` · `FOOT` (the numbers) | A circle of radius 0.35 m against `modules.collide` and against cars (turned boxes from `modules.vehicles.near` and `.player`). No three.js. `pose` is one of `idle move wade jump fall door roll getup` |
| doors (`doors.js`, `createDoors`) | `enter()` · `exit(car) → 'out' or 'roll'` · `nearest()` · `step(dt) → 'seated' or null` · `adopt(vehicle)` · `act` (`null toDoor in out roll getup`) · `DOORS` | Reach 2.5 m, 0.8 s in or out, a roll above 30 km/h. `adopt` makes a stopped vehicle the player's car: the player's car object takes its model, paint and place, the vehicle is despawned, and the car he left is spawned parked where it stood |
| rig (`rig.js`, `createRig(id)`) | `group` · `update(dt, { state, v, yawRate, air, vy, steer, sideG, crash, t, k, night, lift, wet, face })` · `pose` (the angles) · `face` · `state` · `land()` · `count() → { meshes, tris }` · `dispose()` | The six-box person. States: `idle move wade jump fall sit drive door roll getup`. `rigart.js` holds the canvas sheet (`drawSheet(look)`, `FACES`, `CELL`, `LOOKS.teo`) and `boxes(list)`. Only `teo` has a look; Mags needs a `LOOKS.mags` row and her extra boxes |
| modules.camera | `mode` ('chase' or 'close') · `lookBack` · `target` ('car' or 'foot') · `yaw` · `pitch` · `mix` (0 car .. 1 foot) · `next()` · `snap()` · `resize(w, h)` · `speedShake()` · `setTarget(target, body)` · `step(dt, actions)` | Chase, close chase (C), look-back (hold B) in a car. On foot: 4.5 m back, 1.7 m up, orbit by `actions.lookX/lookY`, recentre after 2 s of running, pulled in by walls (`collide.ray`), a 0.7 s glide between the two. Walking is relative to `yaw` |
| modules.loosecar | `{}` | Keeps the walls round the player's empty car in `modules.world.colliders` while it still rolls after a bail-out |

Test API entries: `test.exit()` · `test.enter() → bool` · `test.spawnVehicle(model, { x, z, heading })` (in a car: puts the player in that model, as on day 2; on foot: stands a parked car, by default 2.4 m to his right) · `test.foot()` (the body, `act`, `near`, `numbers`) · `test.rig(state, seconds)` (runs the rig through a pose and returns its angles).

Events I emit:

| Event | Data |
|---|---|
| `player:spawned` | `{ id, x, z }` at load |
| `vehicle:exited` | `{ model, id, x, z, speed, bailed }`; speed in m/s |
| `vehicle:entered` | `{ model, id, x, z, reset }` when he sits down; `reset: true` when `game:reset` put him back. (`modules.vehicles.swap` still emits its own `{ model }` when a test swaps the model) |
| `player:jumped` | `{ x, z }` |
| `player:landed` | `{ x, z, air, speed, surface }` |
| `player:step` | `{ x, z, surface, speed }`, one a stride; surface is `road sidewalk sand dirt water`. Nothing plays it yet (the audio lane's to pick up) |

Events I listen to: `input:press` (`interact` gets out or in; `camera` in a car), `game:reset` (back in the car at the spawn), `view:resize`.

Stand-ins I left: `foottouch.js` is a STAND-IN for the on-foot part of `src/ui/touch.js`: a left stick (`#foot-stick`), `Jump`, `Sprint`, a `Get in` button shown by a door and a `Get out` button in a car, made in code, with `body.on-foot` hiding `#touch`. It also adds the new keys to the hint line. The HUD session should take it over and delete the file.

Not built yet: climbing ledges, swimming (he stops at 0.9 m deep), taking a moving car from traffic (only vehicles under 1.5 m/s can be entered), a passenger seat, Mags as a body, `giveWeapon`, `setOutfit`, `freeze`, the driving pose seen through the car's glass (the rig is hidden in a car).
