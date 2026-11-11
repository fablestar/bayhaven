# Bible · art · Effects

Forty-six effects, from tyre smoke to a car going up in flames, each as a build recipe with counts for `low` and `high`, a lifetime, colours and the event that starts it. All of them are drawn by six instanced meshes on a phone and eight on a laptop, from one small canvas of shapes. Nothing here is a real light. Violence is real but stylised: low-poly, brief, never shown in close-up, and one setting turns blood off.

Tier: A unless a row carries another tag.

## 1. How effects are drawn

An effect is asked for with `fx.emit(id, x, y, z, opts)`, `fx.ribbon(id)` or `fx.debris(kind, …)`. Every particle lives in one of these families. A family is one instanced mesh and one draw call.

|Family|What it draws|Blend|Alive at once: `low` / `medium` / `high`|
|---|---|---|---|
|`smoke`|soft quads that face the camera and grow: smoke, dust, steam, mist|alpha|120 / 300 / 500|
|`sparks`|small quads stretched along their velocity, and glow dots|additive|100 / 250 / 400|
|`rain`|streak quads in a box round the camera, moved in the vertex shader|alpha|300 / 700 / 1,400|
|`bits` (the "splashes" family in `tech/perf-playbook.md`)|hard-edged quads that spin: drops, rings, paper, leaves, shards, small birds|alpha|160 / 400 / 640|
|`debris`|unit boxes with spin and bounce: panels, furniture, coconuts|lit|40 / 80 / 120|
|`ribbons`|strips built point by point: skid marks, wakes, tracers, rings, bolts|premultiplied, so a strip can be solid or additive|600 / 1,400 / 2,400 segments|
|`beams` (`high` and `medium`)|cones and ground streaks|additive|12 / 40 / 80 quads; on `low` the few allowed are drawn by `ribbons`|
|`glow` (`high` and `medium`)|big soft sprites for lights that are not lamps|additive|16 / 40 / 80; on `low` they use `sparks`|

The fx atlas is one 256×256 canvas of sixteen 64 px cells, white on clear, tinted per particle:

|Cell|Shape|Cell|Shape|
|---|---|---|---|
|0 `puff`|day 1's glow gradient|8 `leaf`|a pointed oval|
|1 `wisp`|a stretched puff with a ragged edge|9 `bird`|a shallow V|
|2 `dot`|a hard disc|10 `glint`|a four-point sparkle|
|3 `streak`|a line fading at both ends|11 `flame`|a teardrop|
|4 `ring`|a 4 px circle|12 `shard`|a triangle|
|5 `drop`|a small teardrop|13 `note`|a music note|
|6 `crown`|a ring of five spikes|14 `ripple`|two thin rings|
|7 `paper`|a plain square|15 `blank`|solid white|

Rules for every effect:

- An emitter more than 120 m from the camera (80 m on `low`) makes nothing. A particle nearer than 0.6 m to the camera is not drawn.
- When a family is full, the oldest particle is reused.
- `smoke` is tinted by the hemisphere sky colour × 0.9, so it sits in the scene at any hour. Additive families ignore fog.
- Gravity for particles is 12 m/s² unless a row says otherwise. Wind from `weather.wind` pushes `smoke`, `rain` and paper `bits`.
- Sizes written "a to b" grow from a to b over the particle's life. Opacity fades to zero over the last 40%.

## 2. The effects

Counts are `low` / `high`; `medium` sits halfway.

|#|id|Tier|Built from|Count|Life|Colours|Starts when|
|---|---|---|---|---|---|---|---|
|1|`tyre-smoke`|A|`smoke` puffs from each sliding wheel, 0.6 to 2.4 m, rising 0.8 m/s|24 / 96 alive|0.9 s|`#f7f3ea` at 50%|slip of 0.35 rad or more above 40 km/h; the handbrake; wheelspin from rest|
|2|`skid`|A|a `ribbons` strip per tyre on the road at y 0.025, 0.24 wide, a point every 0.5 m|60 / 300 segments|fades over 8 s / 20 s|`#1b1924` at 55%|as 1, and hard braking above 50 km/h|
|3|`sparks`|A|`sparks` streaks 0.3 m long thrown at 4 to 9 m/s|6 / 24 a burst|0.35 s|`#fff1c9` to `#ffa02e`|scraping a wall above 8 m/s; a hanging bumper (4 a second); a burst tyre's rim; the Flounder's hop|
|4|`dust`|A|`smoke` puffs per wheel, 0.5 to 1.8 m; on grass, green `leaf` bits as well|10 / 30 a second|1.2 s|sand `#e2c998`, dirt `#8a6f55`, grass `#3fb86a`|above 5 m/s on sand, dirt or grass|
|5|`landing`|A|a ring of puffs moving outwards at 3 m/s|8 / 16|0.5 s|the surface's dust colour; on road `#b7b0b8`|`jump:landed`; a person dropping more than 1 m|
|6|`speed-lines`|B|`ribbons` streaks 6 m long passing the camera|12 / 40|0.3 s|white at 20%|above 120 km/h. Off under reduce motion|
|7|`engine-smoke`|A|`smoke` puffs from the engine box, 0.4 to 1.6 m, rising 2 m/s|6 / 16 a second|1.6 s|`#6f6a78` at 60%; under 20 health `#2b2838`|vehicle health under 40|
|8|`engine-fire`|A|`sparks` in the `flame` cell, 0.3 to 0.7 m, rising 1.5 m/s, and one 2 m glow|8 / 24 a second|0.5 s|`#ffa02e` to `#ff5a5a`|health under 20, for the 8 seconds|
|9|`explosion`|A|a real one, in order: a 6 m white glow for 80 ms; a fireball of `flame` sparks growing 1 to 4 m over 0.5 s; embers, `sparks` thrown up in a 50° cone at 6 to 14 m/s with gravity 6; a ring of 12 dust puffs racing out to 6 m, the radius that hurts; a column of `smoke` puffs 1 to 3 m rising 3 m/s for 6 s; the hood as `debris` going up at 9 m/s, with 4 / 10 more boxes in the car's paint; on `high` eight smoke trails behind the debris, `ribbons` 3 m long. The wreck stays, painted `#2b2838`, and burns with row 8 for 20 s on a 6 m scorch mark|60 / 240 embers; 20 / 60 fireball; 12 / 40 smoke|2.4 s for the burst|fireball `#fff1c9` to `#ffa02e` to `#ff5a5a`; smoke `#2b2838` at 70%; scorch `#1b1924` at 60%|`vehicle:destroyed`; a fuel pump or a fireworks crate hit hard. Not every driver gets out|
|10|`glass`|A|`shard` bits 0.08 to 0.2 m|12 / 40|1.0 s|`#9fd2ff` at 70%|shop glass, bus shelters, a car light cracking at 60 health|
|11|`prop-bits`|A|by prop: fence splinters as `debris` boxes (6 / 14, `#8a6f55`); hedge leaves as `leaf` bits (12 / 40); café tables and chairs as whole `debris`; two coconuts, 0.2 m boxes in `#6a4630`|by prop|3 s, then they fade|the prop's own|`prop:broken`|
|12|`geyser`|A|two crossed quads 0.8×7 m with a scrolling `streak`; `drop` bits falling from the top; mist puffs at the base; a wet patch 6 m across. It lifts cars|20 / 60 drops a second; 4 / 10 puffs|25 s, shrinking over the last 3|white to `#9fd2ff`|`prop:broken` on a hydrant|
|13|`confetti`|A|`paper` bits falling from 6 m over the player|40 / 160|2.5 s|neons and sand|`followers:milestone`; the postcard's rubber stamp; the day 9 drop|
|14|`splash`|A|one `crown` 1 to 3 m; `drop` bits thrown at 3 to 6 m/s; a `ribbons` ring growing 0.5 to 3 m|8 / 24 drops|0.8 s|white at 80%, tinted 25% by the horizon colour|anything entering water above 2 m/s. A wading step makes 3 drops|
|15|`wake`|A|two `ribbons` from the stern corners, 0.4 to 3.5 m wide over 40 m, a point every 1.5 m|54 segments a boat; on `low` only boats within 150 m|6 s|white mixed 25% with the horizon, × (1 - 0.55 × night), as day 1's foam|a boat above 2 m/s|
|16|`spray`|A|`drop` bits in a fan|10 / 30 a second|0.6 s|white at 70%|a bow above 30 km/h; the airboat's fan; wheels in flood water or a puddle; wheels above 60 km/h on a wet road|
|17|`sprinkler`|B|an arc of `drop` bits reaching 5 m, turning once in 2 s. Fountains are three upright jets 3 m tall|12 / 30 a second each; the nearest 4 / 10 only|0.9 s|white at 60%|Mallard Greens lawns 06:00 to 09:00 and 18:00 to 20:00; the City Hall fountain always|
|18|`rain`|A|`rain` streaks 0.02×0.9 m in a box 30×20×30 m round the camera, falling 22 m/s, slanted by the wind, wrapped in the vertex shader|300 / 1,400, times the weather's rain amount up to 1|while it rains|`#cfe0ff` at 35%|weather with rain (see `light.md`)|
|19|`ripples`|A|`ripple` bits lying on road and water within 25 m, 0.1 to 0.5 m|40 / 160 alive|0.4 s|white at 30%|while it rains|
|20|`wet-streaks`|A|an additive ground quad under each light, stretched towards the camera: 1.6 m wide for a lamp, 6 m for each 6 m of neon; length clamp(6 + 0.35 × d, 6, 26) m, d the camera's distance; the `streak` cell wobbling by sin(v × 40 + t × 3) × 0.02|the nearest 12 / 60 lights, plus the player's own|while wet|the light's colour × wet × 0.35|`weather.wet` over 0.05. Full rules in `light.md`|
|21|`lightning`|A|a bolt: an additive `ribbons` line of 6 to 9 points from 400 m up, 1.5 to 3 km away, with one fork. The sky answers: hemisphere light × 3 for 60 ms, normal for 40 ms, × 2 for 90 ms|1|120 ms|`#e8f0ff`|`weather:lightning`. Thunder follows by distance / 343 s. Under reduce motion: the bolt only|
|22|`rainbow`|A|half a ring of 48 segments, radius 900 m, opposite the sun, six stripes across a 40 m band, additive at 35%|1|in over 20 s, holds 5 game minutes, out over 30 s|`#ff5a5a` `#ffa02e` `#fff1c9` `#5dff9b` `#29e6ff` `#b46bff`|the 15:15 storm ends with the sun up|
|23|`steam`|A|`wisp` puffs rising 0.5 m/s off the road within 40 m|30 / 120 alive|3 s|white at 12%|the 5 game minutes after rain, by day|
|24|`wind-litter`|A|`leaf` bits crossing at wind speed. A hurricane adds flying furniture as `debris`: lawn chairs (3 boxes), umbrellas, sign boards and bins tumbling at 14 to 22 m/s, and they hit|60 / 240 leaves; 12 / 40 furniture|4 s|greens; the props' own|leaves in a tropical storm; both in a hurricane|
|25|`storm-sheets`|A|big `smoke` quads 20×8 m of spray crossing the road with the wind, one every 2 to 5 s. The `rain` family switches to streaks 1.4 m long at 30 m/s, slanted 70°|3 / 6 sheets|2 s each|`#cfe0ff` at 18%|hurricane|
|26|`flood`|A|a flat quad of the sea shader at y 0.3 over low streets; cars push `spray` through it|one a chunk|while flooded|tinted `#6a7a6a`|`weather.flood` above 0|
|27|`fog-wisps`|A|`wisp` puffs 12 m wide between y 0.5 and 2, drifting 0.3 m/s|20 / 60|20 s each|the horizon colour at 25%|swamp fog. Heron Marsh keeps 6 / 16 at dawn|
|28|`fireflies`|A|`sparks` dots 0.12 m with a 0.5 m glow, wandering 0.4 m/s within 30 m of the camera; brightness max(0, sin(2π(0.4t + phase)))⁴|40 / 200|while there|`#d8ff7a`|Mudcat Glades and Heron Marsh, 20:30 to 05:00, dry weather|
|29|`flock`|B|`bird` bits in the sky: gulls wheeling 30 to 60 m up in a 40 m circle over beach and pier; herons in the Glades. A horn or crash within 60 m scatters them upwards|6 / 20 gulls; 3 / 8 herons|while there|white with `#6f6a78` tips|by district, by day|
|30|`dizzy-birds`|A|small `bird` bits 0.12 m on a ring 0.35 m across, 0.25 m over the head, 1.2 turns a second, bobbing 0.04 m, wings flipping at 8 Hz, with two `glint`s. Only for the dazed: never over anyone who is down for good, and never on the Knocked out screen|3 / 5|while dazed, 3 s at least|`#ffd23e`; glints `#fff1c9`|`ped:hit` after a light hit (under 50 km/h), once the tumble ends|
|31|`filming`|A|a `glint` at the phone for 0.15 s when a person starts filming; a pink dot blinking 1 Hz on the phone while they film; `+5` pops drawn on the HUD canvas, rising 0.6 m|6 / 16 pops|0.7 s|`#ff3fa4`; pops cyan|`ped:filming`; follower gains|
|32|`club-beams`|B|four cones a roof, 40 m long, 0.3 to 4 m wide, sweeping ±0.6 rad once per four beats of the club's song (`music.beat`)|4 / 8|while open|violet, mint and pink at 15%|21:00 to 04:00 on roofs flagged `club`; Humidity|
|33|`fireworks`|A|a shell: a `streak` rising for 1.2 s to 120 to 180 m, then `sparks` on a sphere at 22 m/s with drag 1.8 and gravity 4. On `high`, glitter trails. The sea's sun sparkle takes the shell's colour for 0.3 s|80 / 300 a shell; 3 shells alive|1.8 s|one or two neons a shell|the day 9 drop: a shell every 0.8 s for 60 s at midnight; the flare gun on a fireworks crate|
|34|`searchlight`|A|a cone of two crossed quads from the helicopter's lamp to the ground, radius 0.6 to 9 m, at 18%; an 18 m ground disc at 50%; dust puffs when it flies under 30 m|one a helicopter; 6 / 16 puffs|while lit|`#e8f0ff`|heat 3 and up. The lighthouse (tier B) uses the same cone: two beams 1,200 m long in `#fff6e0`, one turn in 10 s|
|35|`siren-pools`|A|for each lit lens on a light bar, a 3 m glow and a 10 m ground pool; on wet roads a streak as 20|6 / 12 vehicles|while lit|`#ff3fa4` and `#29e6ff`|any police light bar running|
|36|`muzzle`|A|a flash at the barrel: a `glint` 0.5 m for 50 ms and a 1.5 m glow for 50 ms that lights nothing but looks as if it does (a 4 m ground pool at 40%, night only). SMG: 0.35 m, one flash a shot. Shotgun: 0.8 m, plus a puff. A tracer: a `ribbons` line 6 m long flying 120 m/s; the shotgun sends six in a 0.12 rad cone. On `high`, one brass `debris` box 0.03 m a shot, gone in 1.5 s|by weapon|0.15 s|`#fff1c9`; brass `#ffc300`|`weapon:fired`, from the player, crews and deputies alike|
|37|`bop`|A|four puffs in a ring and two short `ribbons` dashes|6|0.2 s|white|a hit with fists, noodle or flamingo; a sprint into a wall|
|38|`flare`|A|a shot at 30 m/s carrying a 2 m glow and a 12 m `ribbons` smoke trail; where it lands it burns with sparks and a 20 m pink ground pool|10 / 30 sparks a second|6 s|`#ff3fa4`|the flare gun. People within 40 m start filming|
|39|`pickup`|A|lawn flamingos carry a 1.2 m glow at 25% at night, bobbing. On collection: a `ribbons` ring growing to 2 m in 0.3 s and 12 `glint`s rising. Postcard spots: two cyan footprints that pulse|12 glints|0.6 s|pink; cyan|a collectible in view; `photo:taken`|
|40|`buoy`|A|the mission marker: a life-ring on the ground, 3 m across, 16 segments in white and the marker colour, one turn in 8 s, with a 4 m pole and a 0.6 m pennant that waves. Route chevrons: flat cyan Vs on the road every 12 m at 35%, sliding forwards 2 m/s. Ability rings: Mags's horn sends a mango ring out to 30 m in 0.5 s; Teo's Go Live a pink ring to 12 m|20 / 40 chevrons|while shown|cyan for "go here", pink for a target, mango for a side job|a mission step with a place; `waypoint:set`; an ability|
|41|`impact-wall`|A|where a bullet meets a wall, the road or a prop: a dust puff 0.3 to 0.8 m; `shard` chips thrown back at 2 to 5 m/s; two sparks on metal or brick; a hole, a 0.12 m `dot` lying on the surface. Glass uses row 10|3 / 6 chips; 40 / 160 holes kept|puff 0.4 s; a hole 60 s|the surface colour mixed half with `#b7b0b8`; hole `#1b1924`|a bullet's ray ends on the static world|
|42|`impact-car`|A|sparks, paint chips in the car's own paint, and a 0.1 m hole that rides on the panel (hero builds only, 12 a car). A shot tyre goes to the burst-tyre look; shot cabin glass is removed with row 10|4 / 10 sparks; 2 / 5 chips|0.3 s; holes last as long as the panel|`#fff1c9`; hole `#1b1924`|a bullet's ray ends on a vehicle|
|43|`impact-water`|A|a thin upright `crown` 0.3 to 0.9 m, `drop` bits, a `ripple` growing to 1 m. Automatic fire stitches a line of them|3 / 6 drops|0.5 s|white at 80%|a bullet's ray ends on water|
|44|`blood`|A|small and flat, never a pool: `dot` bits 0.06 to 0.14 m thrown 1 to 3 m/s along the shot, and one puff 0.25 to 0.5 m at 50%. No marks are left on bodies or the ground. With the Blood setting off, the same event makes the dust puff of row 41 in white|3 / 6 dots|0.35 s|`#c8372d`|a bullet, a blade of debris or a vehicle over 50 km/h hits a person|
|45|`down`|A|no particles. A person who stays down lies in the down pose (`characters.md`), their colours ease 30% towards grey over 2 s so they never read as asleep, and their blob shadow becomes 0.9×1.9 m. They are removed when the ambulance leaves, after 45 s out of view, or after 120 s|6 / 12 bodies kept|until removed|their own, greyed|a person at zero health; a hit over 50 km/h|
|46|`ambulance-light`|A|the ambulance's bar: red and white lenses taking turns at 1.5 Hz, each with a 3 m glow and a 10 m ground pool as row 35; a steady 6 m white pool behind the open rear doors while the crew works|2 / 4 ambulances|while lit|`#ff5a5a` and `#fdf6ea`|an ambulance answering a `down`|

## 3. Screen and camera effects

These go through `fx.shake` and `fx.flash`. Every row is off under "reduce motion" unless it says otherwise.

|Effect|Value|Starts when|
|---|---|---|
|Crash shake|min(0.25, speed change × 0.02) m, fading at 6 a second|`vehicle:crash`|
|Speed shake|0.03 × min(1, (km/h - 120) / 80) m at 22 Hz|above 120 km/h|
|Speed zoom|field of view 60° plus 10° × speed / top speed; 78° plus 10° in portrait (day 1)|always; fixed at the base value under reduce motion|
|Lightning flash|the light change in row 21|`weather:lightning`|
|Camera flash|white at 80% for 80 ms|the mugshot; photo mode's shutter|
|Knock-out tilt|the view rolls 12° over 600 ms and drains of colour (saturation to 0 over the same 600 ms)|`player:knockedout`. Under reduce motion: the colour drain only|
|Hurt edge|a pink glow 40 px deep on the screen edge facing the shot, 120 ms|the player takes damage. Stays under reduce motion|
|Blast muffle|the effects bus is low-passed at 800 Hz, opening over 0.4 s|an explosion within 10 m|
|Switch swoop|eight `wisp` clouds rush past as the camera lifts, 2.5 s|`player:switched`. Under reduce motion: a 300 ms fade through sky colour|
|Go Live frame|a 6 px pink edge round the screen, pulsing 1 Hz for 20 s|Teo's ability. Stays under reduce motion, steady|
|Slow-motion replay|time × 0.25 for 1.2 s from a side camera|landing a Big Air ramp|

## 4. What an effect may cost

|Budget|`low`|`high`|
|---|---|---|
|Draw calls for all effects|6|8|
|Largest burst in one frame|80 particles|300 particles|
|Time to update every particle|0.6 ms|0.8 ms|
|Canvas memory|the 256² fx atlas, shared|the same|

- Particles are moved in typed arrays, never as objects. Position, velocity, age, size, colour and cell fit in 12 floats.
- A burst bigger than the per-frame limit is spread over the next frames.
- In a clip (`?clip=day-N`), the random seed for effects is fixed, so the same smoke rolls every time.

## New names

- Family names `smoke`, `sparks`, `rain`, `bits`, `debris`, `ribbons`, `beams`, `glow`; the sixteen fx atlas cells.
- The forty-six effect ids in section 2. The mission marker is called the buoy.
- Colours not in `07`: rain `#cfe0ff`, cold light `#e8f0ff`, lighthouse `#fff6e0`, flood tint `#6a7a6a`, bird yellow `#ffd23e` (a day 1 sign colour), blood `#c8372d`.
