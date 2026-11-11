# Bible · art · Light

One clock drives the sky, the sun, the sea, the fog and every lamp in Bayhaven. This file extends day 1's colour keys in `sky.js` hour by hour without changing one of them, grades the same keys for each weather state, sets the night-light rules for each district, pins the post-processing in `07-art-and-audio.md` to exact numbers, and shows how wet roads are faked. Golden hour is the home key; night is blue and readable, never black.

Tier: A unless a row carries another tag.

## 1. The keys through the day

Rows marked † are day 1's, unchanged. The rest are new keys between them. Between two keys every value is blended with a smooth step, as day 1 does: `t = t × t × (3 - 2t)`.

**Sky and sun**

|Hour|Name|Sky top|Horizon|Sun colour|Sun strength|Cloud|Glow colour|Glow|Night factor|
|---|---|---|---|---|---|---|---|---|---|
|0 and 5.0 †|night|`#050818`|`#1d1650`|`#ff6a8a`|0|`#1c1a40`|`#3a1a6a`|0.3|1|
|5.6|first light|`#1a2a6a`|`#7a4a8a`|`#ff8a7a`|0|`#4a3a6a`|`#c0507a`|0.6|0.7|
|6.3 †|dawn|`#3558a8`|`#ffb59a`|`#ffb080`|1.2|`#ffc9b8`|`#ff9a6a`|0.8|0.25|
|7.0|morning|`#2a6ac8`|`#ffd9b8`|`#ffd2a0`|2.0|`#ffe9d8`|`#ffc08a`|0.45|0.05|
|8 †|day|`#1f7ae0`|`#a6dcf7`|`#fff1d6`|2.6|`#ffffff`|`#ffffff`|0.15|0|
|13.0 (B)|high noon|`#1a72de`|`#b4e2f8`|`#fff6e4`|2.75|`#ffffff`|`#ffffff`|0.12|0|
|16.8 †|day|`#1f7ae0`|`#a6dcf7`|`#fff1d6`|2.6|`#ffffff`|`#ffffff`|0.15|0|
|17.5|golden hour opens (a new game starts here)|`#2c74d8`|`#ffe0ae`|`#ffd08a`|2.5|`#fff0d8`|`#ffb45a`|0.5|0|
|18.4 †|golden hour|`#3a6fd0`|`#ffcf8f`|`#ffb866`|2.3|`#ffe2c2`|`#ff9a3a`|0.7|0.05|
|19.0|sun on the water|`#3a4aaf`|`#ffa070`|`#ff8a44`|2.0|`#ffa8b0`|`#ff6048`|0.95|0.2|
|19.5 †|sunset|`#3b2f8f`|`#ff7a5a`|`#ff6a30`|1.5|`#ff7aa8`|`#ff3a6a`|1.0|0.45|
|20.0|sun gone|`#261f74`|`#e45c74`|`#ff5050`|0.6|`#c0508c`|`#ff3a7a`|0.95|0.68|
|20.4 †|dusk|`#15145a`|`#c04a8a`|`#ff3f7a`|0|`#6a3a80`|`#ff3a8a`|0.8|0.85|
|21.0|blue hour|`#0b0d34`|`#5a2a70`|`#ff5282`|0|`#3a2860`|`#9a2a7a`|0.5|0.95|
|21.6 and 24 †|night|`#050818`|`#1d1650`|`#ff6a8a`|0|`#1c1a40`|`#3a1a6a`|0.3|1|

**Hemisphere light, fog, sea and shadow**

|Hour|Hemisphere sky|Hemisphere ground|Strength|Fog range ×|Sea deep|Sea shallow|Sun shadow (`high`)|
|---|---|---|---|---|---|---|---|
|0 and 5.0 †|`#4a55b0`|`#221638`|0.95|0.9|`#050a26`|`#122a55`|0|
|5.6|`#6a70c0`|`#3a2a48`|1.05|0.8|`#0c1c48`|`#2a4a70`|0|
|6.3 †|`#9fb4e8`|`#6a5560`|1.3|0.75|`#1c4a7a`|`#4aa0b0`|0.35|
|7.0|`#b9d4f4`|`#84706c`|1.65|0.9|`#155590`|`#40b4be`|0.5|
|8 †|`#cfeaff`|`#9a8a78`|1.9|1|`#0e5fa8`|`#35c8c8`|0.4|
|13.0 (B)|`#d6eeff`|`#a39280`|1.95|1|`#0c5aa6`|`#38ccc8`|0.35|
|16.8 †|`#cfeaff`|`#9a8a78`|1.9|1|`#0e5fa8`|`#35c8c8`|0.4|
|17.5|`#dcd4f2`|`#9a7c66`|1.75|1|`#145c9e`|`#48c0ba`|0.55|
|18.4 †|`#d9c4f0`|`#9a7460`|1.6|1|`#1a5a9a`|`#55b8b0`|0.6|
|19.0|`#c8a2e8`|`#8a5a60`|1.45|1|`#22408a`|`#7a84a4`|0.6|
|19.5 †|`#b884e0`|`#7a4660`|1.3|0.95|`#2a2a7a`|`#9a5a9a`|0.45|
|20.0|`#9a70d8`|`#583458`|1.2|0.9|`#1a1c60`|`#70407c`|0.15|
|20.4 †|`#7a60d0`|`#3a2450`|1.1|0.9|`#10124a`|`#4a2a6a`|0|
|21.0|`#6058c0`|`#2c1c44`|1.0|0.9|`#0a0e38`|`#2a2a60`|0|
|21.6 and 24 †|`#4a55b0`|`#221638`|0.95|0.9|`#050a26`|`#122a55`|0|

The fog column and the shadow column are new on every row; day 1 had neither.

## 2. How the keys are used

|Thing|Rule|
|---|---|
|Sun direction †|`a = clamp((hour - 6) / 14 × π, -0.2, π + 0.2)`, `c = -cos(a)`, direction = normalise(0.5c, sin(a), 0.87c). It rises behind the city and sets over the water at 20:00. Do not "fix" it|
|Sun light †|colour and strength from the key; placed 100 m along the direction, never lower than 0.08 up|
|Moon †|a second directional light, `#8f9fff`, from (-40, 80, -30), strength 0.55 × night|
|Fog colour †|the horizon colour|
|Fog range|`02-world.md`'s range for the quality level (`low` 150 to 700 m, `medium` 220 to 1,000, `high` 300 to 1,400), both ends × the key's fog factor × the weather's. Day 1's 150 to 560 m was for one block and ends on day 2|
|Lights-on amount †|`on = min(1, night × 1.6)`; with weather, `night` is first raised by the state's "night add"|
|Neon, signs, windows †|neon scalar 0.62 + 0.6 × on; lit signs 0.6 + 0.6 × on; lit windows × on|
|Lamps †|head `#fff2cc`; pool `#ffc27a` at 0.34 × on on an 18 m quad; a glow point `#ffd9a0`, size 7, at 0.9 × on|
|Headlights †|white × (0.75 + 0.6 × night); beam opacity 0.8 × night|
|Night sky and clouds †|as day 1's sky shader: its points of light scale with night², and clouds show where the noise passes 0.5 (the "cloud threshold" that weather moves)|
|Blob shadows|vehicles 0.6 - 0.25 × night †; people 0.45 - 0.2 × night|
|Sun shadows (`high`)|one 2048 map, 120 m square round the player, snapped to texels, updated every second frame. Darkness is the table's shadow column: strongest at golden hour. LOD0 solids, vehicles and people cast|
|Floor|after weather, hemisphere strength is never under 0.85, so night stays readable|
|Saturation|one uniform `uSat` in every shared material and in the sky and sea shaders: `rgb = mix(vec3(luma), rgb, uSat)`, luma = 0.2126 r + 0.7152 g + 0.0722 b. It is 1 in clear weather. It works on every quality level, with no post-processing|

### Water that is not the bay

|Water|Colours|Notes|
|---|---|---|
|The bay †|the key's deep and shallow colours; shallow where the water is under 1.2 m deep. Foam is white mixed 25% with the horizon, × (1 - 0.55 × night)|day 1's shader: sparkle power 70, strength 0.9; blends to the horizon colour between 160 and 800 m|
|Glades channels|deep is tea-brown `#5a4a32` from `07`; shallow is that mixed 40% with the key's shallow colour|no foam, no sparkle; ripples at a third of the bay's size|
|Mallard Greens lakes|the key's sea colours mixed 30% with lawn green `#3fb86a`|a fountain at the centre of each|
|Pools|`#35c8c8` at any hour; a cyan `#29e6ff` glow at 0.5 × on|recipes 10 and 12 in `kits.md`|
|Flood water|the key's sea colours mixed 60% with `#6a7a6a`|at y 0.3 over low streets|

### Reading a screenshot

The postcard rule from `07`, as four things a session can check on a 960×540 shot:

|Check|Pass|
|---|---|
|Sky|the sky fills a third of the frame or more with the default chase camera on flat ground|
|Big shapes|at 240×135 every building still reads as one block of colour|
|One accent|no more than one neon or saturated object in the middle third by day; at night the neon may take over|
|Direction|at 17:30 a 6.5 m lamp post throws a shadow longer than itself on `high`; at night every lamp has a visible pool|

Clips are shot between 17:30 and 20:30, or at night. The title screen sits at 18:40.

## 3. Weather grades the same keys

A state has a weight from 0 to 1. Each row's changes are applied at that weight on top of the hour's key. A state blends in over 4 game minutes (the 15:15 front crosses in 4 s) and out over 6. Fog factors match `systems/weather-time.md`.

|State|Sky top mixes to|Horizon mixes to|Sun ×|Hemisphere ×|`uSat`|Fog ×|Cloud threshold|Sea mixes to|Night add|
|---|---|---|---|---|---|---|---|---|---|
|`clear`|none|none|1|1|1|1|0.50 †|none|0|
|`haze`|20% `#8fb6e0`|35% `#e8e2d0`|0.85|1.05|0.92|0.7|0.56|shallow 20% `#9ad0c8`|0|
|`storm`|60% `#5f6b7d`|55% `#8793a3`|0.35|0.8|0.70|0.5|0.22|deep 50% `#2f4660`, shallow 50% `#5f8a90`|0.35|
|`tropical`|70% `#4a5566`|65% `#6f7a88`|0.2|0.7|0.66|0.4|0.12|65% `#26384c` and `#4f7078`|0.45|
|`hurricane`|75% `#2f4a3c`|70% `#8aa070`|0.12|0.62|0.60|0.3, near end never under 60 m|0.05|75% `#1f3a34` and `#5a7a5a`|0.6|
|`fog`|30% `#9ab0b8`|50% `#c8d4c0`|0.6|1|0.85|0.25|0.50|none|0|

- `storm` is `07`'s rule: saturation down 30% and a blue-grey. Its clouds mix 70% to `#5a6270`. The night add of 0.35 is what switches the neon on at 15:15.
- `hurricane` adds the green. Its hemisphere sky colour mixes 50% to `#8fae90`, its clouds move six times faster, and district lights flicker: every 6 to 20 s one district's lights drop to 15% for 0.4 to 2.5 s and come back through 2 to 5 flickers of 80 ms. Under reduce motion the drop is a 1 s fade with no flicker.
- `haze` adds 0.2 to the glow, so the sun wears a wide halo.
- `fog` is local: its weight rises over 300 m inside Mudcat Glades, Heron Marsh and round Lake Serenity, from 05:00, and burns off between 08:30 and 09:30.
- After rain, `uSat` is 1.10 for five game minutes, with a rainbow and steam (`vfx.md`).
- Lightning multiplies the hemisphere strength by 3 for 60 ms, 1 for 40 ms and 2 for 90 ms. Off under reduce motion.
- Knocked out: `uSat` falls to 0 over 600 ms as the view tilts. The HUD and the cards keep their colour.

## 4. District night lights

Each district lights a little early or late: `on_d = clamp(on + offset, 0, 1)`. Lamps are never real lights: a head box, a glow point and a ground pool.

|District|Street lamps|Windows|Neon and signs|Special|Offset|
|---|---|---|---|---|---|
|Tideline|day 1's: every 19 m, pool `#ffc27a` at 0.34, 18 m|30% lit in the warm, cyan and pink mix; shop glass 75% until 23:00, then 20%|a neon strip on every street building; neon signs|the pier wheel's rim lights|0|
|Meridian|9 m double-arm lamps every 24 m; head `#f4f8ff`; pool `#dfe8ff` at 0.30, 22 m|window grids, floor by floor: 30% at 21:00 easing to 12% by 02:00; lobbies lit all night|crown neon only|the Spire's tip: a 3 m pink `#ff3fa4` glow pulsing every 2 s, part of the skyline|-0.10|
|Palma Vieja|bracket lamps at 5 m every 16 m; head `#ffe2b0`; pool `#ffb86a` at 0.36, 14 m|30%, warm only|one frontage in ten has neon; painted signs dim|bulb strings every 20 m: 12 points in `#ffd58a`, size 1.6|-0.05|
|The Paintworks|every 28 m; head `#e8dcff`; pools take turns, violet `#b46bff` at 0.22 and mint `#5dff9b` at 0.18, 18 m|20%|bars and clubs only|mural wash at 0.25; club beams|-0.20, the last to light|
|Rustwater|12 m masts every 40 m; head `#ffb060`; pool `#ff9a3c` at 0.40, 24 m. Yard masts 20 m tall every 80 m with 40 m pools|10%|stencil signs, unlit|lamps come on pink `#ff7a8a` and reach sodium orange in 90 s; a red `#ff5a5a` dot on each crane top blinking 1 Hz; amber `#ffc300` beacons on moving cranes, one turn in 2 s|+0.15, the first|
|Northgate|9 m car-park poles on a 30 m grid; head `#eef4ff`; pool `#e8f0ff` at 0.32, 22 m|15%; 60% of shop units dark after 22:00|pole signs and fascias at full; billboards lit from below by three additive wedges|drive-through menu boards|+0.05|
|Mallard Greens|4 m lanterns every 40 m; pool `#ffc27a` at 0.25, 10 m|two a house, warm, off at 23:00|none|a porch light on every house at 2.2 m, `#ffd58a`, size 2.2. All of them come on in the same frame, when `on` passes 0.5|a step, not a ramp|
|Runway Flats|30 m apron masts; head `#eef4ff`; pool `#e8f0ff` at 0.35, 40 m|terminal glass 50% lit in `#dfe8ff`|stencil signs|runway edge points amber `#ffa02e` every 60 m; taxiway points blue `#4d7cff` every 30 m; 12 white approach points flashing in turn twice a second (steady under reduce motion); a mint glow in the tower cab; two size-12 landing lights coming down with each jet|always on|
|Mudcat Glades|none. Amber reflector points every 50 m on Mudcat Road at 0.25|one shack in two has a lit window|bug zappers, violet|the moon is × 1.3 here (0.72 × night) and the hemisphere + 0.1; fireflies; two mango floods under Big Earl|none|
|The Islands|Sandpiper Isle: lanterns `#ffd58a` on gate pillars and every 12 m of drive, pool at 0.30, 8 m. The Keys: none|Sandpiper Isle 60% of ground floors, warm; Keys shacks one in two|none|pools glow cyan; Keys lantern strings in pink, cyan, mango and mint; amber rail lights every 20 m on the Longspan; the lighthouse beam (tier B)|-0.12|

## 5. Post-processing, exactly

`high` only, four passes: scene, bloom down, bloom up, final. The scene is drawn to a half-float target with 4 samples.

|Effect|Numbers|
|---|---|
|Bloom|the bloom pass that ships with three, at half resolution, 5 levels, radius 0.55. Strength 0.6, plus 0.25 × `wet` in rain. Its bright pass is replaced by a mask: lit materials write alpha 0; neon, signs, lit windows, lamp heads and light quads write alpha 1; additive sprites add their own; the sky writes 0 except the sun's disc. `bright = rgb × alpha × smoothstep(0.35, 0.50, max(r, g, b))`. So only neon, lights and the sun bloom, whatever colour a wall is|
|Vignette|`rgb × (1 - 0.12 × smoothstep(0.45, 1, d))`, d the distance from the centre with a corner at 1: 12% at the corners|
|Colour grade|a gentle S-curve: `c = mix(c, c × c × (3 - 2c), 0.25)`. A warm lift in the shadows at golden hour: `c += (0.035, 0.012, -0.010) × (1 - luma)² × golden`, with `golden = smoothstep(16.8, 17.5, hour) × (1 - smoothstep(19.5, 20.4, hour))`|
|Speed|field of view 60° + 10° × speed / top speed (78° + 10° in portrait), as day 1. No motion blur|
|Cost|4 draw calls and 2.5 ms at 1080p. If frames run over 18 ms for 120 frames, bloom goes first, then the sun shadow map, and only then the pixel ratio|
|`low` and `medium`|none of the above. Day 1's glow points do the work, plus one point per 6 m of neon strip in its colour, size 4, at 0.5 × on; 400 points at most|

## 6. Wet roads and reflections

Nothing is reflected. `weather.wet` runs 0 to 1 and drives four cheap tricks.

|Trick|Rule|
|---|---|
|Darken|asphalt × (1 - 0.38 × wet); sidewalks × (1 - 0.20 × wet); sand × (1 - 0.25 × wet); road paint × (1 - 0.10 × wet)|
|Sheen|the ground material adds `horizon colour × wet × 0.18 × (1 - N·V)³`: the road picks up the sky at a low angle|
|Streaks|under each light an additive ground quad stretched towards the camera, from `vfx.md` row 20: length `clamp(6 + 0.35 × d, 6, 26)` m, opacity `wet × 0.35 × on × fade`. `low`: lights within 60 m, 12 at most. `high`: within 150 m, 60 at most. `fade` runs from 1 at 40% of that range to 0 at its end|
|Which lights|lamp heads (1.6 m wide); neon strips (one streak per 6 m, × 0.6); traffic signals in their colour; the player's headlights (two quads 0.5×14 m ahead) and tail lights (one 1.7×6 m behind, brighter when braking); police lenses in pink and cyan. On `high` also shop glass (one warm streak a cell, × 0.4) and traffic within 80 m|
|Sun streak|by day, one quad 6×60 m towards the sun in the sun's colour at 0.25 × wet, while the sun is under 35° up. This is the look of the morning after the hurricane|
|Puddles (B, `high`)|8 a chunk at seeded spots by the curb: flat ovals 2 to 5 m, road colour × 0.5 plus the horizon colour × 0.5, additive. Driving through one makes `spray`|
|Water|lights within 40 m of the bay throw streaks on it in any weather: the pier, the yacht club, the Longspan|
|Drying|`wet` falls to 0 over 6 game minutes; streaks and sheen fade with it; steam rises for five|

## 7. Fire and gun light

Still no real lights. Each is a ground pool of the glow texture, additive, with the numbers below.

|Source|Pool|Notes|
|---|---|---|
|Explosion|30 m, `#ffa02e` at 0.6, gone in 0.6 s|at night, within 60 m, the hemisphere strength is also × 1.3 for 100 ms; not under reduce motion|
|Burning wreck or engine|6 m, `#ffa02e` at 0.3 ± 0.1, flickering 9 times a second|for as long as it burns|
|Muzzle flash|4 m at 40% for 50 ms, `#fff1c9`|night only|
|Flare|20 m, `#ff3fa4` at 0.5|6 s|
|Police and ambulance lenses|10 m each: 0.10 by day, 0.25 at night|in the lens colour|
|Helicopter searchlight|an 18 m disc, `#e8f0ff` at 0.5|follows its target|

## New names

- Key names: first light, morning, high noon, golden hour opens, sun on the water, sun gone, blue hour.
- The uniform `uSat`, the per-district `on_d` and its offsets, the bloom mask in alpha.
- Colours not in `07`: every hex in the new key rows and in the weather table; lamp heads `#f4f8ff`, `#ffe2b0`, `#e8dcff`, `#ffb060`, `#eef4ff`; pools `#dfe8ff`, `#ffb86a`, `#e8f0ff`; warm-up pink `#ff7a8a`; taxiway blue `#4d7cff`.
- No new people, places or brands.
