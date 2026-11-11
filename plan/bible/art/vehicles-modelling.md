# Bible · art · Vehicle modelling

How a vehicle is built from boxes and wedges, class by class. The per-model sheets (sizes, colours, quirks) are in `catalog/vehicles-road.md`; this file is the method behind them: how a sheet becomes `MeshBuilder` calls, the template each class follows, wheels, lights, paint, damage panels, the cheaper versions, the Sheriff livery, boats and the helicopter. Day 1's coupe, the Heron, is the reference and is not changed.

Tier: A unless a row carries another tag.

## 1. From a sheet to boxes

The vehicle faces +z. x is across, y is up, the origin is on the road under the centre. A sheet piece reads `name:L×W×H@f,y`: L along the vehicle, W across, H up, `f` the centre's distance ahead of the origin, `y` the underside's height.

|Piece|Call|
|---|---|
|plain|`box(0, y + H/2, f, W, H, L, colour, { bottom: true })`|
|`/f` wedge|`hexa`: the two top corners at the front drop to y + 0.6 H. `/r` drops the rear ones. `/f0` and `/r0` drop them to y|
|`cabin`|`hexa` in glass `#16263c`, `noTop`: bottom L×W at y; top at y + H, 0.2 narrower each side, front edge 0.6 back, rear edge 0.45 in (day 1)|
|`roof`|a paint slab 0.06 thick capping the cabin|
|`×2`|mirrored at x = ± (W_body / 2 - W_piece / 2) unless the sheet says otherwise|
|`sill`, `chassis`|dark `#1b1924`, bumpers included|

The Heron, checked against day 1's code: sill 1.92×0.24×4.46 at y 0.36 · body 1.86×0.48×2.90 at (0, 0.70, -0.70) · hood wedge from z 0.75 to 2.17, top falling 0.94 to 0.74 · cabin 1.72 wide at y 0.94, 1.32 wide at y 1.34 · roof at y 1.365 · spoiler 1.84×0.06×0.34 at (0, 1.14, -2.02) on two struts · stripe from y 0.66 to 0.73 at x ±0.936.

Triangles: 12 a piece, 72 a wheel with spokes, about 14 for lights and stripes. Every model is 300 to 600 in its hero version. A sheet under 300 spends the spare on 16-sided wheels.

## 2. Class templates

Pieces are listed front to back. Fractions are of the model's own L, W and H, so one template fits every model in the class. "Belt" is the top of the body, where the glass starts.

|Class|Tier A models|Wheel radius|Pieces|Proportions|
|---|---|---|---|---|
|Small car|Snook|0.24 to 0.31|sill, hood/f, body, cabin, roof, mirrors|hood 0.20 to 0.24 L; cabin 0.63 to 0.68 L, reaching the tail; belt at 0.59 H|
|Coupe|Heron|0.33 to 0.36|sill, hood/f, body, cabin, roof, spoiler on two struts|hood 0.32 L; cabin 0.47 L; belt at 0.67 H|
|Sedan, lowrider|Tarpon, Flounder|0.30 to 0.33|sill, hood/f, body, boot/r, cabin, roof, mirrors|hood 0.27 to 0.33 L; cabin 0.38 to 0.49 L; boot 0.21 to 0.25 L; belt at 0.62 H|
|Fast|Wahoo, Sailfin|0.34 to 0.36|sill, splitter, hood/f, body, cabin, roof, then one signature piece: scoop, sail or wing|hood 0.31 to 0.36 L; cabin 0.40 to 0.45 L, set back; H 1.10 to 1.38|
|Pickup|Mullet|0.38|chassis, bumper, hood/f, body, cabin, roof, bed, tailgate|hood 0.24 L; cab 0.32 L; bed 0.40 L, walls 0.5 high|
|SUV|Grouper|0.40|sill, hood/f, body, cabin, roof, rails, spare wheel|hood 0.25 L; cabin 0.69 L; belt at 0.63 H|
|Van|Pompano|0.36|chassis, bumper, hood/f, screen/f0, body, side glass, box, rear doors|hood 0.14 L; box 0.76 L and the full height|
|Box truck|Hogfish|0.48, twin rears|chassis, bumper, hood/f, body, cabin, roof, fairing/f0, box, roll door, tanks|cab and hood 0.29 L; box 0.69 L with its floor at 0.9|
|Bus|Manatee|0.50, twin rears|chassis, bumper, snout/f, screen/f0, body, glass band, roof, sign, doors, air unit|body 0.96 L; glass band 0.85 tall from y 1.8; two kerb-side doors|
|Scooter|Pinfish|0.22|mudguard, lamp, shield, column, bars, deck, seat, tail|seat at y 0.68; bars 0.70 wide at y 1.05|
|Motorbike|Needlefish|0.30|needle, fairing/f, screen/f0, bars, tank, frame, seat, pipe, tail/f0|seat at y 0.66; bars at y 0.86|
|Small and odd|Birdie|0.22|chassis, nose/f, screen, bench, backrest, four posts, canopy, bags|canopy at y 1.72; no doors|
|Off-road (B)|Bullfrog|0.6 to 0.9|frame, body, hood/f, cabin, roof, lights|the body rides on a frame 1.2 to 1.4 up|

## 3. Wheels

|Rule|Value|
|---|---|
|Shape|`cylX`, tyre `#15141a`, hub `#9a9aa8` (day 1's parked car used `#8a8a96`)|
|Width|0.83 × radius; 0.4 × radius on two-wheelers|
|Place|axles at ± wheelbase / 2; x at ± (W - 0.24) / 2; centre at y = radius|
|Spokes|two boxes 0.02 × 1.4 r × 0.28 r in `#2a2a34`, one on each face, so spin shows|
|Hero wheel|12 sides and spokes, 72 triangles|
|Traffic wheel|8 sides and spokes, 56 triangles; one instanced mesh for every traffic wheel|
|Parked wheel|8 sides, no spokes, 32 triangles, merged into the body mesh|
|Distant wheel|a box 0.83 r × 1.8 r × 1.8 r, 12 triangles|
|Spin|angle += speed / radius × dt (day 1)|
|Steer|front pivots turn 0.5 × steer (day 1)|
|Twin rears|drawn as one wheel 1.7 times as wide|
|Burst tyre|radius × 0.8, hub tilted 0.1; sparks from the rim|

Body motion, all from day 1 unless noted:

|Motion|Value|
|---|---|
|Roll|clamp(steer × speed × 0.004, ±0.07), eased at 6 a second. Trucks and buses × 1.5 with a ±0.10 cap; fast cars × 0.6|
|Pitch|-acceleration × 0.0022, eased at 6 a second|
|Landing squash|body drops 0.12 m, back on a spring (180, 14)|
|Two-wheel lean|up to 35 degrees into the turn; rider and bike together|
|Blob shadow|a quad (W + 1.48) × (L + 1.74) at y 0.04, opacity 0.6 - 0.25 × night|

## 4. Lights

Lights are never part of the paint. On the player's vehicle they are three small unlit meshes (head, tail, indicators). For traffic they are instances of one unit quad in a shared unlit mesh, up to 8 a car, coloured by state.

|Light|Size and place|Colours|
|---|---|---|
|Headlights|two quads 0.44×0.11, centred at x ±0.34 W, top edge 0.03 under the nose's front top edge, 0.005 proud|white × (0.75 + 0.6 × night); parked `#f4f0d8`|
|Tail strip|one quad (W - 0.20) × 0.13, top edge 0.11 under the belt, 0.005 proud|(0.5 + 0.35 × night, 0.04, 0.06); braking (1.6, 0.16, 0.12); parked `#a01828`|
|Indicators|four quads 0.14×0.10 at the corners, on the side faces|on (1.6, 0.9, 0.1), off `#7a4a10`; 1.5 Hz, half on|
|Reverse|two quads 0.12×0.08 inside the tail strip's ends|white × 1.2 while reversing|
|Beam, player|a ground quad 8×24 m, centred 11 m ahead at y 0.06, glow texture|`#fff0c8`, opacity 0.8 × night|
|Beam, traffic|6×14 m, centred 7 m ahead|opacity 0.45 × night; none on `low`|
|Two wheels|one headlight 0.16×0.12, one tail quad 0.12×0.06|as above|
|Cracked|the quad at × 0.3 with one dark slanted quad across it|below 60 health, one headlight|

Number plates: a quad 0.52×0.13 front and rear from `atlas.plate(text)`: fill `#fff1c9`, three ink letters and three digits by seed, a thin wave line under them.

## 5. Paint

Each vertex carries a mask in the spare byte beside its colour: 0 is drawn as painted (sill, glass, chrome, fixed second tones), 1 takes the instance's paint, 2 takes the instance's accent. One instanced mesh per model then serves every colour.

|Rule|Value|
|---|---|
|Paint|one of the model's six factory colours, by seed; the first is the showroom colour|
|Second tone|only where the sheet says: a roof, the lower body, a bed. Painted into the mesh|
|Stripe|a quad 0.07 tall on both sides, lower edge at the sheet's height, 0.006 outside the body, stopping 0.13 short of each end. Trucks 0.10 tall, buses 0.30|
|Accent|pale paint (luma over 0.78): ink `#150f3d`. Warm paint (hue 330 to 70 degrees): cyan `#29e6ff`. Anything else: pink `#ff4fa8`|
|Day 1 pairs, kept|`#ff4f6e` with `#29e6ff` (Mags's Heron) · `#29b6e6` with white · `#ffc23e` with `#2b2838` · `#f7f3ea` with `#ff3fa4` · `#8a5cff` with `#ffd23e` · `#3fd68a` with white|
|Chrome|`#c8ccd2`|
|Dirt|paint mixes towards `#8a7f70` on the lowest 40% of the body, up to 35% after 10 km; a car wash resets it|
|Wraps (shop)|a wrap swaps the accent mask for a pattern: twin stripes 0.25 wide nose to tail, a wave, or checks|

## 6. Damage panels

Health stages are in `04-systems.md`: 60 dents and a cracked light, 40 smoke, 20 fire and 8 seconds, 0 an explosion that hurts everything within 6 m. Nothing bends: panels turn on hinges, hang, flap and fall.

|Panel|Cut from|Hinge|Dented (under 60)|Loose|Falls off|
|---|---|---|---|---|---|
|Hood|the hood wedge|its rear top edge|lifts 0.06 to 0.15; colour × 0.85|flaps up to 1.1 with speed, on a spring|a front hit above 60 km/h under 40 health; at 0 it is thrown up at 9 m/s, spinning|
|Boot lid|a slab 0.06 thick over the body behind the cabin|its front edge|lifts 0.05 to 0.12|flaps up to 0.9|a rear hit above 60 km/h under 40|
|Doors|slabs 0.04 thick on the body's sides under the cabin, 0.55 of the cabin's length|the front edge, upright|pushed in 0.04; colour × 0.85|swing out up to 1.2 in turns|a side hit above 50 km/h under 50|
|Bumpers|the first and last 0.15 of the sill|one end|turned 0.1|hangs 0.5 from its far corner and drags, throwing sparks|under 30, or any hit above 70 km/h|
|Tailgate, roll door, rear doors|as the sheet names them|bottom, top, outer edges|ajar 0.2|swing or roll open; cargo falls out|a rear hit above 60 km/h under 40|

- Under the hood sits an engine box 0.6 of the hood's length, 0.6 W wide and 0.3 tall in `#3a3844`. Smoke and fire start there.
- A fallen panel becomes one debris box with its size and colour, inside the debris cap (40, 80 and 120 on `low`, `medium` and `high`).
- Extra triangles for a full split: about 48. No model passes 600.
- Bullets: a hole is a 0.1 m dark dot that rides on the panel it hit, 12 a car at most, hero builds only. A shot tyre takes the burst-tyre look. Shot cabin glass is removed, leaving the pillars' edges.
- A wreck: after the explosion the hero build stays where it stopped with every piece painted `#2b2838`, no glass, tyres burst, the hood gone. It burns for 20 s, blocks the road, and is cleared when out of view for 60 s.
- Traffic cars keep their panels baked into one mesh. A car that drops under 60 health, or that the player takes, is swapped for the hero build. Besides the player's, at most 3 hero builds exist on `low` and 6 on `high`; beyond that, damage shows as darker paint only.

## 7. Cheaper versions

|Version|Used for|Build|Heron|
|---|---|---|---|
|Hero|the player's vehicle, damaged cars, mission cars|every piece, panels separate, hero wheels, three light meshes|about 450|
|Traffic|moving cars in LOD0|one instanced body with panels baked, four traffic wheel instances, light quads|334|
|Parked|every parked car; moving cars past 60 m|one merged mesh; parked wheels; no struts, mirrors, rails or pipes|220, day 1's parked car|
|Distant|past 150 m, and on the expressway seen from the ground|sill, body, cabin and four box wheels; two light quads|84|

## 8. The Sheriff livery

Our own: white and teal with a pink stripe, and a light bar that alternates pink and cyan. Never black and white.

|Part|Colour|Where|
|---|---|---|
|Upper body, roof|white `#fdf6ea`|everything above the stripe|
|Lower body|teal `#1f8a8a`|everything below the stripe, and the whole hood|
|Stripe|pink `#ff4fa8`, 0.09 tall|both sides at the model's stripe height, and across the boot|
|Bar base|`#1b1924`, 1.10×0.10×0.26|across the roof centre; 1.30 wide on the Grouper, 1.60 on the van|
|Bar lenses|two boxes 0.48×0.12×0.22: left pink `#ff3fa4`, right cyan `#29e6ff`|unlit material, so they glow|
|Door text|"SHERIFF" in teal on white, 0.9×0.22, from the sign atlas (`plaque` style); under it "Bayhaven Blue: Live" 0.9×0.10|both front doors|
|Roof number|two ink digits 0.8 tall, read from the helicopter cam|roof, behind the bar|
|Push bar|teal box 0.9 W × 0.35 × 0.12 ahead of the bumper; pink on the tactical van, 2.2×0.5×0.2|front|
|Grille lights|two quads 0.12×0.06, pink and cyan, opposite phase to the bar|nose|

|Light pattern|Timing|
|---|---|
|Heat 1 and 2|pink 250 ms, cyan 250 ms, taking turns|
|Heat 3 and above|pink on 80, off 60, on 80, off 60; then cyan the same. One cycle is 560 ms|
|Each lit lens|a 3 m glow sprite and a 10 m ground pool in its colour: opacity 0.10 by day, 0.25 at night|
|Reduce motion|both lenses steady at 60%|

|Vehicle|Base|Changes|Tier|
|---|---|---|---|
|Sheriff Tarpon|Tarpon|livery, bar, push bar|A|
|Sheriff Grouper|Grouper|livery, wide bar, a spotlight box 0.15 on the left pillar|A|
|Sheriff tactical van|its own sheet in the catalogue|teal all over, white roof band, pink ram bar and stripe, side steps|A|
|Sheriff's show truck|Hogfish|box sides white with "BAYHAVEN BLUE: LIVE" 4.6×1.15 in pink neon style; pink neon strips on the box edges; four camera boxes 0.3 on arms 1.2 long; a roof dish 1.2 across|A|
|Horsefly|the helicopter in section 10|white, teal belly and boom, pink stripe along the boom, pink and cyan strobes under the nose|A, flown by AI|
|Hammerhead|the Skipjack hull with a cabin|white, a teal band at the gunwale, a pink waterline stripe, a bar on the cabin roof|B|

Other fleets:

|Fleet|Base|Livery|Tier|
|---|---|---|---|
|Bay Cab|Tarpon|`#ffd23e` with a cyan stripe; a roof box 0.5×0.16×0.2 in `#ffa02e` that lights when free|A|
|Ambulance|Pompano|white, a mint `#5dff9b` band 0.3 tall, a red `#ff5a5a` and white bar at 1.5 Hz|A|
|Fire truck|Hogfish|red `#ff5a5a`, white roof, a mango stripe, ladder boxes on the roof, a red bar|A|
|News van|Pompano|white with a mango `#ffa02e` band and "BHTV 6" on the box; a mast 0.1×0.1×1.6 with a dish 1.2 across|A|
|Mayfly|the helicopter|white, a mango band, "BHTV 6" each side, a camera ball 0.35 under the nose|A, flown by AI|
|Pelican Eats|Pinfish|a mango box 0.40×0.40×0.34 behind the seat|A|
|Clam Secure|Clam|`#c8ccd2` with a navy `#1f2f5a` band; no glass in the box|C|

## 9. Boats

Boats use the same sheet notation with y measured from the water. They have no wheels, so 300 triangles is about 24 pieces: spend them on rails, cleats, fenders, seats and a flag. If `catalog/vehicles-other.md` gives a different size, that size is used and the piece order here stays.

|Boat|L×W×H|Pieces|Tier|
|---|---|---|---|
|Skipjack, speedboat|6.8×2.3×1.6|bow/f0:2.2×2.3×0.75@2.3,-0.35 with its front corners pulled in to x ±0.15 · hull:4.6×2.3×0.75@-1.1,-0.35 · deck:4.4×2.1×0.06@-1.0,0.40 in `#fdf6ea` · well:2.2×1.7×0.04@-1.2,0.46 in `#1b1924` · screen/f0:0.5×1.8×0.45@0.35,0.46 · seats:0.5×0.6×0.5@-0.6,0.46×2 · bench:0.5×1.7×0.4@-2.4,0.46 · engine:0.7×0.5×0.7@-3.6,-0.1, turning ±0.5 with the steering · rails:1.8×0.04×0.04@2.0,0.55×2 in chrome · four cleats, two fenders, a flag|A|
|Skimmer, jet ski|3.1×1.15×1.05|hull/f0:3.1×1.15×0.5@0,-0.2 · saddle:1.3×0.4×0.35@-0.3,0.3 · pod:0.5×0.6×0.4@0.6,0.3 · bars:0.06×0.7×0.05@0.6,0.72 · footwells:1.2×0.25×0.04@-0.3,0.3×2 in `#1b1924` · bumper, intake grate, two mirrors|A|
|Gatorback, airboat|5.4×2.4×2.9|bow/f:1.4×2.4×0.45@2.0,-0.1, turned up · hull:4.0×2.4×0.45@-0.7,-0.1 · bench:0.5×1.6×0.45@0.6,0.35 · stand: four legs 0.06×0.06×1.1 · seat:0.5×0.6×0.5@-0.5,1.45 · engine:0.9×0.7×0.7@-1.6,0.9 · cage: a ring of 8 boxes, radius 1.1, at f -2.3 · two blades 0.12×2.0×0.05, a disc quad above 8 turns a second · rudders:0.7×0.05×1.4@-2.75,0.4×2, swinging ±0.6|A|
|Minnow, dinghy|3.2×1.4×0.6|hull/f0, two thwarts, a small engine|B|
|Others|by the catalogue|same hull method: a pinched bow wedge, a hull box, a deck slab, then cabin boxes|C to D|

|Boat rule|Value|
|---|---|
|Paint|hull in the paint; deck `#fdf6ea`; a 0.07 stripe at the gunwale in the accent; the lowest 0.25 of the hull `#fdf6ea`|
|Bow lift|pitch = min(0.14, 0.004 × speed), turning about a point 0.3 L from the stern|
|Roll|-0.2 × steer × speed / top speed|
|Bob|height ± 0.06 at 0.18 Hz, pitch ± 0.015, out of step by seed|
|Planing|the hull rises 0.12 at top speed|
|Lights|bow dots 0.1: red `#ff5a5a` left, green `#5dff9b` right; a white stern dot; glow points at night|
|Rider|the "cruiser, quad, jet ski" pose in `characters.md`; the Skimmer leans up to 0.5|

## 10. The helicopter

One build serves the Mayfly (news), the Horsefly (Sheriff) and, at tier C, the player's Dragonfly. Overall: 9.6 long, rotor 9.2 across, 3.1 high.

|Piece|Sheet|Notes|
|---|---|---|
|Cabin|cabin:2.6×1.7×1.7@0.6,0.5|paint|
|Nose|screen/f0:1.2×1.6×1.3@2.4,0.6|glass `#16263c`|
|Cowl|cowl:1.4×1.0×0.5@0.2,2.2|second tone|
|Boom|boom:4.6×0.4×0.4@-3.0,1.4|`taper` to 0.5 at the tail|
|Fin|fin/r0:0.9×0.08×1.2@-5.1,1.5|accent|
|Tail rotor|two blades 0.06×0.12×1.1 on the fin's left|25 turns a second; a disc quad above 8|
|Mast and hub|mast:0.16×0.16×0.5@0.5,2.7|`#1b1924`|
|Main rotor|two blades 4.6×0.34×0.04 from the hub; four on the Horsefly|6.5 turns a second. At speed: a disc quad of radius 4.6 at opacity 0.22 with two darker streaks turning 1.2 a second|
|Skids|skids:2.8×0.08×0.08@0.4,0×2 at x ±0.9, on four struts 0.06×0.06×0.5|chrome|
|Searchlight|a 0.3 box under the nose with an unlit lens|aims at its target; the cone is in `vfx.md`|
|Doors, steps, antenna|6 small boxes|to reach 300 triangles|

|Flight look|Value|
|---|---|
|Pitch|nose down 0.12 × speed / top speed|
|Roll|into turns, up to 0.25|
|Hover|bobs 0.15 at 0.4 Hz|
|Far version|four boxes and the disc, about 50 triangles|
|Strobes|a red `#ff5a5a` dot on the tail blinking 1 Hz; a white belly dot|

Other aircraft (tier C and D) are built the same way: a fuselage of two tapered boxes, wings as thin boxes with `taper`, floats or wheels from this file's rules.

## New names

- Version names: hero, traffic, parked, distant. Paint mask values 0, 1, 2.
- Boat and helicopter piece names (`bow`, `well`, `pod`, `cage`, `cowl`, `boom`, `fin`, `skids`) in the catalogue's sheet notation.
- Colours not in `07`: Sheriff teal `#1f8a8a` (from `story/characters.md`), dirt `#8a7f70`, engine box `#3a3844`, unlit indicator `#7a4a10`, navy `#1f2f5a`.
- No new vehicle names: every model is from canon section 7.
