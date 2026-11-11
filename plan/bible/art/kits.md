# Bible · art · Kits

Every building in Bayhaven is boxes and wedges pushed through `MeshBuilder` into a few meshes per chunk. This file fixes the standard dimensions, twelve parametric recipes that every district kit is built from, the level-of-detail rules, the sign atlas, the window-grid texture and the mural painter. Day 1's numbers are kept as they are and marked †.

Tier: A unless a row or line carries another tag.

## 1. The box grammar

|Call|Makes|Triangles|
|---|---|---|
|`box(cx, cy, cz, sx, sy, sz, colour, opts)`|a box. `taper [tx, tz]` shrinks the top, `shift [dx, dz]` slides it, `rot` turns it round y, `top` recolours the roof|10; 12 with `bottom`; 8 with `noTop`|
|`hexa(corners, colour)`|any six-sided solid from 8 corners: wedges, hoods, sloped roofs|as `box`|
|`quad`, `flat`|one rectangle|2|
|`tri`|one triangle|1|
|`cylX(cx, cy, cz, r, w, colour, cap, n)`|a cylinder along x: wheels, pipes, tanks|4n|

Day 1's colour sets are used by name below. Pastel walls: `#ff9eb5` `#8fe3cf` `#ffc98f` `#9fd2ff` `#fff1c9` `#c9a8ff` `#ff8f7a` `#7fd6e8` `#f7f3ea`. Neon: pink `#ff3fa4`, cyan `#29e6ff`, violet `#b46bff`, orange `#ffa02e`, mint `#5dff9b`, red `#ff5a5a`. Towers: `#d9b8c4` `#b8cfe0` `#e6d3b8` `#c4b8e0` `#b8e0d3` `#e0e0e6` `#e8c0b0`. Road `#3b3946`, sand `#f2ddb0`, wet sand `#e2c998`.

A LOD0 chunk is six meshes, in day 1's letters: `G` ground, `M` road paint, `B` solids, `N` neon and lamp heads (unlit), `S` signs (atlas), `L` lit windows (additive, night only). Two more appear only where needed: `W`, walls that carry the window-grid texture, and `U`, murals. Palms, lamps and small props are instanced, not in the chunk.

## 2. Standard dimensions

|Thing|Size|Notes|
|---|---|---|
|Storeys|ground 3.6 m, upper 3.2 m, parapet 0.8 m|height = 3.6 + 3.2 × upper floors + 0.8†. District files that count the ground floor write 4.4 + 3.2 × (floors - 1): the same number|
|Tower cell|4.6 m wide, 3.8 m tall; far towers 7×6 m|window 0.8 × cell width, 0.55 × cell height, 0.05 m proud, from y 8†|
|Base band|3.5 m tall, 0.15 m proud each side|†|
|Floor band|0.14 m thick, 0.25 m proud, at y = 3.6 + 3.2k|†|
|Parapet cap|0.5 m tall, 0.2 m proud, centred at h + 0.2|trim `#fdf6ea`, roof `#6f6a78`†|
|Shop glass|3.4×2.2 m in a 4.2×2.6 m cell, y 0.5 to 3.1, 0.19 m proud|glass `#2e4a6b`, shade 0.8 to 1.2†|
|Upper window|1.9×1.6 m in a 3.2×3.2 m cell, 0.04 m proud|†|
|Door|single 1.0×2.2 m, double 1.8×2.4 m, 0.19 m deep|one per 8 m of frontage|
|Garage and roller doors|2.6×2.2 m, 4.8×2.2 m, 4.2×4.4 m|`#fdf6ea` or `#6f6a78`|
|Awning|1.2 m deep, back edge y 3.1, front edge y 2.6, 0.08 m thick, cell width less 0.4 m|one sloped `hexa`, stripes 0.6 m|
|Neon strip|tube 0.16×0.12 m at y 3.62, 0.2 m off the wall, 0.2 m past each end|†|
|Sign board|6.6×1.8×0.45 m at y 4.0 to 5.8, face 6.4×1.6 m|board `#140c2c`†|
|Fin|2.2 m wide, 0.7 m deep, y 3.5 to h + 2.6, a 0.2 m tube up the front|†|
|Curb|0.14 m|side `#9c948f`, top `#d6cdc4`†|
|Sidewalk|4 m from curb to building line; promenade 6 m|plaza paving `#e9b9a2`†|
|Block|66 m between 14 m streets, pitch 80 m|gives up 4 m beside an avenue, 8 m beside the boulevard|
|Lanes|street 14 m: 2 of 4.6 m and 2 kerb strips of 2.4 m · avenue 22 m: 4 of 3.8 m, 2 kerb strips of 2.4 m, a 2.0 m centre strip · boulevard 30 m: 6 of 3.6 m, a 4.0 m palm median, 2 kerb strips of 2.2 m · expressway 26 m: 6 of 3.6 m, a 0.8 m barrier, 2 shoulders of 1.8 m · suburb lane 10 m: 2 of 3.2 m, 2 verges of 1.8 m · dirt track 6 m: one of 4.0 m, 2 shoulders of 1.0 m · causeway 14 m: 2 of 4.2 m, 2 shoulders of 1.6 m, 2 walkways of 1.2 m|widths from `02-world.md`|
|Parking bay|kerbside 2.4×6.0 m; car park 2.7×5.4 m, aisle 6.5 m|line 0.12 m, `#f4efe6`|
|Road paint|dash 3.0×0.24 m every 9 m, `#f2e6b0`, at y 0.02; zebra stripe 0.7×2.5 m every 1.4 m, white|†|
|Lamp post|pole 0.18×6.5 m `#2b2838`; arm 1.8 m at y 6.45; head 0.55×0.14×0.55 m `#fff2cc` at y 6.32; pool 18×18 m at y 0.2|every 19 m, taking turns with palms; 27.5 m on the promenade; 34 triangles†|
|Palm|7 to 10 m. Trunk: 5 boxes from 0.5 m wide, × 0.86 each, `#8a6a4a` and `#7a5c40`. 9 fronds of 4 segments, 2.7 to 3.8 m, greens `#2f9e58 #3fb86a #2a8a50 #4bbf62`|194 triangles; 4 seeded shapes, instanced; far shape 70 triangles (3 trunk boxes, 5 fronds of 2 segments)†|
|Map-edge barrier|rails 0.3×0.14 m at y 0.55 and 1.05, 1.2 m pieces in white and `#ff7a1e`, a post every third|†|
|Small props|hydrant 0.3×0.75 m · bench 1.8×0.45×0.5 m · bin 0.5×0.9 m · bollard 0.2×0.9 m · bus shelter 3.6×2.4×1.4 m · signal pole 5.5 m with a 5 m arm · umbrella r 1.7 m†|10 to 40 triangles each, one instanced mesh per kind|

## 3. The twelve recipes

District files list their own kits (`T1`, `ng-strip`, `mg-ranch` and so on). Each kit row is one of these recipes with a preset: `recipe(lot, preset, rnd)`. Where a district file gives a number inside a range below, the district number is used. Example, Tideline: T1 `deco-hotel` · T2 `motel-pool` · T3 `deco-hotel` preset `slab` · T4 `stilt-shack` preset `beach-shack` · T5 `warehouse` preset `gable` · T6 `warehouse` preset `barrel` · T7 `strip-mall` preset `souvenir` · T8 `parking-deck` preset `frame`.

|#|id|Lot, w × d in m|Height|Triangles LOD0 `high`, typical / cap|LOD0 `low`|Shell|
|---|---|---|---|---|---|---|
|1|`deco-hotel`|13-20×16-26|2 to 7 upper floors|280 / 520|180|10|
|2|`shop-house`|unit 6-9×14-20|2 or 3 floors|80 / 110 a unit|50|16 a row|
|3|`glass-slab`|24-36 square|60 to 220 m|520 / 640|290|20|
|4|`stepped-tower`|24-36 square|60 to 180 m|500 / 620|300|30|
|5|`warehouse`|14-50×10-60|8 to 12 m|230 / 340|150|10|
|6|`strip-mall`|3 to 9 units of 7.5-13×16-24|5.2 to 5.5 m|330 / 460|240|20|
|7|`ranch-house`|14-24×9-16|1 or 2 floors|130 / 170|100|20|
|8|`stilt-shack`|5-9×4-7|2.4 m on stilts of 0 to 3.0 m|150 / 190|110|20|
|9|`container-stack`|12.2×2.6 each|up to 5 high|8 a container|8|10 a stack|
|10|`motel-pool`|wings 9 deep, 30-48 long|2 floors|480 / 600|260|30|
|11|`parking-deck`|30-58 square|3 to 6 levels|420 / 560|250|10|
|12|`villa`|16-24×10-14|2 floors|330 / 420|230|30|

**1 · `deco-hotel`** Day 1's `detailBuilding`, unchanged. Tideline, Meridian.
- Build: body box in a pastel, roof `#6f6a78`. Base band in `#fdf6ea`, `#2f2b40`, `#3d7f8f` or `#e86a8a`. A floor band per floor. Parapet cap. Up to two roof boxes in `#b7b0b8`. Preset `slab`: 8 to 11 floors, two 3 m setbacks, a 6 m neon fin, a balcony slab 1.2 m deep per floor.
- Street level: shop glass in every cell; an awning on half of them in the neon colour and white; a neon strip per street side; the first street side gets a fin (40%) or a sign board, the others a sign 35% of the time.
- Night: neon and signs brighten. Shop glass 75% lit until 23:00, then 20%. Upper windows 30% lit.

**2 · `shop-house`** Palma Vieja; the Keys at tier B.
- Build: a row call fills a frontage with units that share party walls; only front and back get detail. Unit walls in mango `#ffb347`, turquoise `#2ec4b6`, rose `#ff6f91` or lime `#b5e48c`, never the neighbour's colour. Roof: flat with a parapet (60%) or a tile pitch in `#c8643c`, ridge 1.6 m up. Upper floors: a window per 3.2 m with two 0.5 m shutter quads; half the units get a balcony slab 0.9 m deep with a two-box rail. Preset `arcade`: ground floor 2.4 m back behind 0.4 m columns every 3 m.
- Street level: one shop glass, a door, an awning (70%), a sign in style `paint`, crates or a table on the sidewalk.
- Night: bulb strings across the street every 20 m: 12 glow points in `#ffd58a` from y 5.2 sagging to 4.4 (6 on `low`). Windows 30% lit.

**3 · `glass-slab`** Meridian, Runway Flats.
- Build: a podium of 1 to 3 floors on the lot less 2 m, built as recipe 1 without neon. A shaft on 0.6 to 0.8 of the podium in `#b8cfe0` or `#e0e0e6`: four `W` walls and a roof. One tower per 2×2 chunks is coral `#ff8f7a`: the lot nearest that group's centre. Four corner fins 0.6 m square in `#fdf6ea`. A plant box on top, half the footprint, 6 m high. Crown above 34 m (75%): four neon strips at h - 0.5 and, half the time, an antenna 0.3×8 m†. The five Meridian tower forms are presets: `slab`, `twin` (two shafts on one podium), `wedge` (the top fifth has `shift` 4 m), and recipe 4's `stepped` and `lantern`.
- Street level: podium shopfronts, a canopy slab 8×0.3×4 m on two posts, a 6 m plaza strip.
- Night: floors light from the bottom up (section 6). Crown neon.

**4 · `stepped-tower`** Meridian.
- Build: podium as recipe 3. Three tiers with footprints 1.0, 0.78 and 0.56 and heights 50%, 30% and 20% of the total. A 0.5 m trim band on each ledge, and half the time a neon strip on four sides. Top: a mast 0.3×12 m (`stepped`) or a 4 m lantern cube in the neon mesh (`lantern`).
- Street level and night: as recipe 3.

**5 · `warehouse`** The Paintworks, Rustwater, Runway Flats.
- Build: one box in brick `#a8553a`, metal `#7d8590` or rust `#b5532f`. Roof preset: `flat`, `sawtooth` (a wedge per 6 m), `gable`, or `barrel` (8 segments: hangars, arcade halls). Slit windows 1.6×0.8 m every 4 m, 1.6 m below the eaves.
- Street level: 1 to 3 roller doors; a dock 1.2 m high and 3 m deep with a step wedge; a sign in style `stencil`. Paintworks: one or two whole walls are murals. Rustwater: a 0.6 m hazard band along the base from the decal atlas.
- Night: Paintworks walls get a wash, an additive quad over the lowest 4 m in violet or mint at 0.25. Rustwater: a bracket flood every 12 m with a 12 m pool in `#ff9a3c`.

**6 · `strip-mall`** Northgate, Tideline, Runway Flats.
- Build: one long box plus a fascia parapet of 1.2 to 1.6 m in a faded tint. A walkway roof 2.4 to 3 m deep on one 0.25 m post per unit. Bar or L plan. One roof unit per two shops. Presets: `box` (one unit 90×60×9 m, a 14 m portal), `drive` (14×10×4 m, a 3 m sign crown), `souvenir` (10×18 m, one 4 m roof prop).
- Street level: per unit two shop glass quads, a door, a fascia sign in style `lightbox`. A car park in front with one light pole per 30 m. A pole sign at the kerb: a 0.5 m square pole of 12 to 22 m carrying a lightbox 5×2.5×0.6 m in red `#e23b2e` and yellow `#ffc300`.
- Night: fascias and pole signs glow. 60% of units go dark after 22:00.

**7 · `ranch-house`** Mallard Greens.
- Build: a main box and a garage wing 6×7 m, floors of 3.0 to 3.2 m, in cream, sage, dove or blush, cycling along the lane. Hip roofs at 22 degrees in `#6f6a78`: a box with `taper [0.2, 0.2]`, 0.2 × the short side high. A chimney box on one in three.
- Street level: garage door, front door under a porch slab on two 0.15 m posts, windows 1.9×1.2 m with shutter quads, a driveway 5.5×8 m in `#c8ccd2`, lawn `#3fb86a`, a hedge box 1.0×0.9 m, a mailbox.
- Night: one porch light at 2.2 m on every house, all `#ffd58a`. Two windows lit, warm only. Everything but the porch light is off at 23:00.

**8 · `stilt-shack`** Mudcat Glades, the Keys, Pelican Rest.
- Build: a deck slab on stilts 0.2 m square (day 1's lifeguard hut) at the corners and every 3 m. A cabin in weathered wood `#8a6f55`; on the Keys the front wall is 0.8 m beach-towel bands in two pastels. A lean-to or gable roof in tin `#9aa3ad`. A porch 1.2 m deep with a two-box rail. Presets: `trailer` (4.2×12 m on 0.4 m blocks, flat roof, an awning on two poles), `beach-shack` (8×6 m on the sand, hip roof `#29b6e6`, a 3 m serving hatch), `lifeguard` (day 1's hut).
- Street level: stairs (one wedge on `low`, 4 to 8 step boxes on `high`), a door, a window 0.9 m square and, by seed, a dish, a boat on a trailer or a net rack.
- Night: one window lit half the time. A bug zapper: a 0.2 m neon box in `#b46bff` with a glow point. Keys shacks hang four lantern points.

**9 · `container-stack`** Rustwater; preset `bar` is tier C.
- Build: a container is one box 12.2×2.6×2.44 m, or 6.1 m long, in red `#c8372d`, blue `#2f6fb5`, green `#3f8f5a`, yellow `#ffc300`, rust `#b5532f` or white `#f7f3ea`. Rows sit 0.3 m apart, up to 5 high. Faces within 0.4 m of a neighbour are skipped. Door ends take a decal quad. Preset `bar`: 2 or 3 containers, one long side opened to glass quads and a counter, a roof deck with a rail, a stair wedge, a neon sign.
- Night: yard masts 20 m tall every 80 m, four heads, a 40 m pool in `#ff9a3c`.

**10 · `motel-pool`** Northgate, Tideline.
- Build: a U or L of two-floor wings, floors of 3.0 to 3.2 m, a room every 4.0 m. A walkway balcony 1.4 m deep with a rail quad, a post per two rooms, a stair wedge at each wing end. An office box 8×6 m with a canopy slab 6×0.3×8 m. A pool 12×6 m: a flat quad at y 0.02 in `#35c8c8` inside a 0.4 m coping, with loungers and two umbrellas.
- Street level: per room a door in one of two colours and a window 1.6×1.2 m; on `high` an air-conditioner box 0.7×0.4×0.3 m under ground-floor windows. Bays face the rooms. A pole sign of 9 to 12 m, or a fin sign 1.2×9×0.4 m.
- Night: the pool glows, an additive quad in `#29e6ff` at 0.5. The sign's "No" flickers. Rooms 30% lit, warm.

**11 · `parking-deck`** Meridian, Runway Flats, Northgate.
- Build: levels of 3.0 m. Each level is one slab box 1.5 m tall with a dark inset quad per side, so the gap reads as an open deck, and 8 columns 0.6 m square (4 on `low`). A stair tower 4×4 m, 3 m taller than the top deck. A ramp wedge, drivable from tier C. Preset `frame` (tier B): 14 to 22 levels of 3.4 m in `#e0e0e6`, the lower third filled with `#b8cfe0` glass, rebar boxes on top.
- Street level: a 6 m entry with a barrier arm. 30% of top-deck bays hold a car.
- Night: each inset is repeated in the lit-window mesh at 0.25 in cold white.

**12 · `villa`** Sandpiper Isle.
- Build: a main block of two 3.4 m floors in white `#ffffff`, flat roof, 0.6 m parapet. A one-floor wing 6 to 8 m wide each side. A portico of 4 to 6 columns 0.5 m square and 6.4 m tall under a slab. Windows 2.4×2.6 m. A hedge wall 1.8 m high and 0.9 m thick in `#2f7d4a`; two gate pillars 0.8×2.4 m with lantern boxes. Shutters, doors and awnings in navy `#1f2f5a`. A pool as recipe 10. Shore lots add a dock on 0.25 m piles. A gate and a driveway loop face the street.
- Night: lantern points in `#ffd58a`. Ground-floor windows 60% lit, warm.

## 4. Level of detail

|Ring|Buildings|Windows|Street level and props|Signs, neon, murals|
|---|---|---|---|---|
|LOD0 `high`|full recipe|quads up to 30 m; `W` walls above|everything|everything|
|LOD0 `low`|boxes only: no shutters, rails, roof clutter or air-conditioners|shop glass quads; every upper wall is a `W` wall|glass, doors, awnings; small props within 60 m|signs, neon and murals stay|
|LOD1|one shell per building, merged per 4×4 chunks|`W` walls|a 3.5 m base band colour, no glass; pole signs and masts over 12 m as one box|none; a mural wall takes its background colour; a tower crown is one neon box per side|
|LOD2|towers over 30 m and landmark outlines, one box per tier|`W` walls|none|crown neon only|

- Chunk budget from `02-world.md`: 14,000 triangles on `high` (20,000 downtown), 8,400 on `low`. Split: ground and paint 600 / 500 · buildings 9,800 / 5,600 · props 2,400 / 1,500 · signs, neon and lit windows 1,200 / 800. LOD1 is 600 or fewer a chunk; the skyline 20,000 or fewer.
- A building over its cap drops, in order: roof clutter, shutters and rails, lit quads above floor 3, floor bands above floor 6. No building has more than 160 window quads.
- A building never changes shape between rings: the shell is its LOD0 body box in the same colour. Swaps happen 160 m away or more, inside the fog.
- Lit share: 30% of upper windows, as `07` says (day 1's code used 0.45 and 0.5), 75% of shop glass. Mix: 75% warm `#ffd58a`, 15% cyan `#8fe8ff`, 10% pink `#ff8fd0`, brightness 0.45 to 1.0†.

## 5. The sign atlas

One canvas: 1024² on `low` and `medium`, 2048² on `high`, background `#0d0820`. A shelf packer with 128 px rows; least recently used shelves are cleared when it fills.

|Slot|Pixels|Used for|Fits|
|---|---|---|---|
|`wide`|512×128 (day 1's cell)|every sign on `high`; rooftop, pole and landmark signs everywhere|16 at 1024², 64 at 2048²|
|`shop`|256×64, two stacked per shelf|shop boards on `low` and `medium`|64 at 1024²|
|`tile`|128×128|logos, parking signs, four stacked number plates of 128×32|64 at 1024²|

Day 1's drawing at 512×128 (halve every measure for `shop`): fill `#140c2c`; a 6 px border in the sign colour with an 18 px glow of the same colour, inset 12 px; text in the heavy italic system stack day 1 uses, weight 900, starting at 76 px and stepping down 4 px until it is 440 px wide or less, centred at y 68; drawn twice in the colour with the glow, then once in white at 75% without it. UVs are inset half a texel.

|Style|Districts|Drawing|
|---|---|---|
|`neon`|Tideline, Meridian, bars anywhere|day 1's, above|
|`paint`|Palma Vieja, Glades, Keys|fill `#fff1c9`; upright weight 900 letters in the sign colour, each turned up to 3 degrees and moved up to 3 px by seed, with an ink `#150f3d` shadow at (4, 4); two brush stripes under the text|
|`stencil`|Rustwater, Runway Flats|fill `#f7f3ea` or `#ffc300`; upright ink letters spaced 6 px; a 10 px hazard band top and bottom|
|`lightbox`|Northgate|fill a faded tint; letters `#fdf6ea` with a 3 px darker outline; one corner patch 10% lighter|
|`plaque`|Mallard Greens, Sandpiper Isle|fill `#fdf6ea`; a 2 px border in `#b7c9a8` or `#1f2f5a`; upright weight 700 letters in `#2e4a6b` at 60% height|

Sign quads carry a glow flag in their vertex colour. Lit styles (`neon`, `lightbox`) use day 1's scalar, 0.6 + 0.6 × on. Painted styles use 1.0 - 0.4 × on. `on` is `min(1, night × 1.6)`†.

## 6. The window-grid texture

One 1024² canvas, drawn once. Eight vertical strips of 128 px; strip k holds k + 2 window columns (2 to 9). Each strip is 16 rows of 64 px and repeats top to bottom. A 4 px gutter at each strip edge copies the wall.

|Texel|RGB (what the wall adds at night)|Alpha (pane mask)|
|---|---|---|
|Wall|0|0|
|Unlit pane|`#0c1420`|1|
|Lit pane, 30% by `rng(4102 + k)`|75% `#ffd58a`, 15% `#8fe8ff`, 10% `#ff8fd0`, × 0.45 to 1.0|1|

- A pane is 0.6 of its cell wide and 0.5 tall, centred: day 1's 1.9×1.6 m in 3.2×3.2 m. A lit pane's right-hand neighbour is lit half the time, so floors read as offices.
- The shell material reads the texture once: `albedo = mix(vertexColour, #2e4a6b × 0.9, alpha)` and `emissive = rgb × lit`, with `lit = smoothstep(0, 0.08, on - 0.10 - 0.80 × y / 260)` and y the world height. Low buildings light together at dusk; a tower lights floor by floor; the top of the Spire lights last.
- UVs: u runs across one strip (inset 4 px); v = wall height / (16×3.2), or 16×3.8 on tower cells. In LOD0 a wall with more than 9 cells is cut into equal quads of 9 or fewer. LOD1 and LOD2 never cut: they take the strip nearest to wall width / 6 m.
- Mipmaps on, anisotropy 4.

## 7. The mural painter

One canvas of sixteen square cells: 256 px cells on 1024² (`low`, `medium`), 512 px on 2048² (`high`). `atlas.mural(seed, palette)` paints a cell on demand; least recently used cells are reused. A wall takes one cell per 12 m of length (seed, seed + 1 and so on), each stretched no more than 2 to 1. Murals are drawn unlit at 1.0 - 0.5 × night, plus any wash.

Shapes, each drawn in a unit box and then scaled and turned:

|Shape|Built from|
|---|---|
|`band`|a slanted bar, edge to edge|
|`disc`|a circle and 12 ray triangles|
|`halfdisc`|a half circle cut by 3 stripes|
|`wave`|a row of quarter-circle scallops|
|`bird`|an oval body, a curved neck stroke, a beak triangle, one wing arc|
|`fish`|an oval, a tail triangle, an eye dot|
|`hand`|a rounded palm and five rounded fingers fanned over 60 degrees|
|`frond`|a spine line and 7 leaf triangles each side|
|`eye`|two arcs and a disc|
|`flamingo`|an S-shaped neck stroke, an oval, two leg lines|
|`dots`|a 5×5 grid of circles|
|`zigzag`|a stripe of 8 chevrons|

How a seed picks a composition, with `r = rng(seed)`:

1. Layout = `floor(r() × 5)`: `hero` (one shape at 70% of the height, centred on a third), `parade` (5 to 7 of one shape in a row, colours alternating), `collage` (9 to 14 shapes at 20% to 60% scale, overlapping), `horizon` (a `halfdisc`, three `wave` rows, two `bird`s), `split` (two halves in swapped colours, one shape mirrored).
2. Fill the cell with palette colour 0. Add 1 to 3 `band`s in colours 1 and 2.
3. Place the layout's shapes. Neighbours never share a colour. Five colours at most.
4. Outline every shape with a 3 px stroke (6 px in a 512 px cell), all ink `#150f3d` or all white, by seed.
5. Speckle: 300 dots at 6% alpha. The Paintworks adds three drips: rounded bars 4 to 8 px wide and 20 to 90 px long under a shape.
6. A tag in the lower right corner: three small shapes in a row.

Palettes: Palma Vieja is `#ffb347 #2ec4b6 #ff6f91 #b5e48c #fff1c9`. The Paintworks takes violet `#b46bff`, mint `#5dff9b` and three more by seed from the neon and pastel sets.

## New names

- Recipe ids and presets in section 3. Mesh letters `W` and `U`.
- Sign slots `wide`, `shop`, `tile`; sign styles `neon`, `paint`, `stencil`, `lightbox`, `plaque`. Mural shapes and layouts in section 7.
- Colours not in `07`: tile `#c8643c`, tin `#9aa3ad`, hedge `#2f7d4a`, navy `#1f2f5a`, sign red `#e23b2e`, container red `#c8372d`, blue `#2f6fb5`, green `#3f8f5a`, bay line `#f4efe6`, unlit pane `#0c1420`.
