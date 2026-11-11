# Bible · world · Tideline

Tideline is the beachfront: 3.2 km of sand, a palm promenade and five rows of pastel blocks behind it. It holds the day 1 block at the origin, the pier, the trailer park where the story starts and the half-built condos that threaten it.

Tier: A for the grid, the kit recipes marked A, street life and the canon A landmarks. Everything else carries its own tag.

Bounds `[-1600, 1600] × [-320, 130]`. Sizes are width (x) × depth (z) × height in metres; footprints are width × depth. Every `(x, z)` is a seed. Hour bands: dawn 05:00 to 08:00, day 08:00 to 17:00, golden 17:00 to 21:00, night 21:00 to 05:00.

## 1. Feel

Sun-bleached and loud. Pastel deco blocks of 3 to 6 floors face the sea across a two-lane drive and a row of palms. At dusk the neon comes on, pink and cyan. To the west it gets older and cheaper: bait sheds, boats on trailers, motels that rent by the hour. To the east it gets newer and emptier: condo frames behind printed fences, and men with shotguns. The front row is the postcard. Two rows back, after midnight, it is somebody's corner.

Any screenshot of Tideline must show:

1. A palm in front of a pastel wall.
2. One neon tube or sign, lit or not.
3. The sea, or the open sky over it, in a third of the frame.

## 2. Neighbourhoods

The grid is the shared one: streets every 80 m and 14 m wide, avenues 22 m. A block is 66 × 66 m, or 62 m on a side that faces an avenue. Its outer 4 m is sidewalk, as on day 1.

Block rows by z: A is -30 to 30 (the beachfront row, 60 m deep), B is -110 to -44, C is -190 to -124, D is -270 to -204, E is -320 to -284 (a half block; its north half belongs to the district behind). South of row A: Heron Walk Drive (z 30 to 44), the promenade (44 to 50), dry sand (50 to 72), wet sand sloping under the water (72 to 130, waterline near 80).

Height rule, from day 1: `4.4 + 3.2 × (floors - 1)` metres (ground floor 3.6, upper floors 3.2, parapet 0.8). Kit buildings stop at 40 m.

### The kit

|id|Recipe|Footprint|Floors|Walls|Roof|Street level|Tier|
|---|---|---|---|---|---|---|---|
|T1|Deco shopfront (day 1's building)|13 to 19 × 26|3 to 6|any of the nine pastels|flat `#6f6a78`, parapet `#fdf6ea`, 0 to 2 roof boxes|shop glass 3.4×2.2, neon tube at 3.6 m, sign board 6.4×1.6 or a deco fin|A|
|T2|Motel court|44×30, a U round a 12×6 pool|2, floor 3.0|`#8fe3cf` `#ffc98f` `#7fd6e8`|flat, 0.6 m eave `#fdf6ea`|open walkways, a door every 4 m in two colours, 9 m pole sign|A|
|T3|Hotel slab|40×22|8 to 11|`#ff9eb5` `#fff1c9` `#9fd2ff`|two 3 m setbacks, 6 m neon fin|canopy 12×6, valet stand, a balcony slab a floor|A|
|T4|Beach shack|8×6|1, floor 3.0|`#ff8f7a` `#7fd6e8` `#fff1c9`|tapered hip `#29b6e6`|3 m serving hatch, board rack, chalkboard|A|
|T5|Bait shed|14×10|1, floor 3.4|`#f7f3ea` `#8fe3cf`|low gable `#6f6a78`|ice chest, net rack, hand-painted sign|A|
|T6|Arcade hall|24×26|2, ground 4.2|`#c9a8ff` `#ff9eb5`|barrel vault, 8 segments|12 m open front, bulb marquee, lit cabinets|B|
|T7|Souvenir box|10×18|1 to 2|`#ffc98f` `#9fd2ff`|flat, one 4 m roof prop (shell, flip-flop, fin)|racks of pool noodles and postcards outside|B|
|T8|Condo frame|30×30|14 to 22, floor 3.4|bare slabs `#e0e0e6`, lower third glazed `#b8cfe0`|open slabs and rebar|2.4 m printed fence, site cabin|B|

Row A takes only T1, T3, T4 and T7. T2 and T5 go in rows B to E. Until a B recipe is built, its share goes to T1.

### Block recipes

|Neighbourhood|x|Lots (frontage × depth)|Recipes, share of lots|Parking|Per 100 m of street|
|---|---|---|---|---|---|
|West End|-1600 to -900|14 to 22 × 26 to 30|T5 30%, T1 25%, T2 20%, T4 15%, T7 10%|one gravel lot a block; half its bays hold boat trailers|5 palms, 4 lamps, 2 benches, 3 crab-trap stacks, 1 boat on a trailer|
|Motel Row|-900 to -300|44×30, and 13 to 19 × 26|T2 45%, T1 25%, T7 20%, T4 10%|8 to 12 nose-in bays at each motel|8 palms, 5 lamps, 2 pole signs, 1 ice machine, 3 loungers in view|
|The Strand|-300 to 400|13 to 19 × 26|T1 55%, T3 30%, T7 10%, T4 5%|kerbside both sides; valet bays at hotels|5 palms and 5 lamps by turns every 19 m (day 1), 2 benches, 1 planter|
|Pier Quarter|400 to 1000|24×26, and 13 to 19 × 26|T1 40%, T6 25%, T7 20%, T4 15%|a 60×40 lot at the pier, 120 bays|6 palms, 6 lamps joined by bulb strings, 2 food carts, 3 dumped Sanderlings|
|East Strand|1000 to 1600|30×30, and fenced empty lots|T8 30%, fenced empty lot 30%, T1 25%, T3 10%, T4 5%|mud lots with site trucks|3 staked young palms, 4 lamps, 8 cones, 2 site cabins, 30 m of printed fence|

## 3. Streets

- **Heron Walk Drive** keeps day 1's 14 m (z 30 to 44) for its whole length; the promenade is its south sidewalk. As the canon's boulevard it gets that speed limit and a light at every avenue, not the 30 m width.
- **Coral Boulevard** stays 14 m beside the day 1 block (x 45 to 59, z -44 to 44). North of Seagrape Street it is 30 m (x 37 to 67) with a 4 m palm median.
- **Flamingo Avenue** (z = -357) is 37 m north of the bounds. Its lots belong to the districts behind.

### Canon roads

|Line|Name|Notes|
|---|---|---|
|z = 37|Heron Walk Drive|boulevard, x -1600 to 1600|
|z = -37|Seagrape Street| |
|z = -117|Conch Street| |
|z = -197|Driftwood Street|Pelican Rest's gate|
|z = -277|Urchin Street| |
|x = -52|Plaza Street| |
|x = 52|Coral Boulevard|boulevard|
|x = -372|Egret Avenue|avenue|
|x = 372|Sandbar Avenue|avenue|
|x = -1012|Rosa Street|avenue; Avenida Rosa's name south of Flamingo Avenue|
|x = 600|Pier Road|z 44 to 430, 8 m carriageway|
|x = -1100|Sandpiper Bridge|its approach leaves Heron Walk Drive opposite Cowrie Street|

### New names: shells and shore birds

All run from Heron Walk Drive to Flamingo Avenue. The five other avenue lines get Tideline names, as Rosa Street does.

|Line|Name|Line|Name|
|---|---|---|---|
|x = -1572|Limpet Street|x = 132|Wentletrap Street|
|x = -1492|Dunlin Street|x = 212|Kittiwake Street|
|x = -1412|Cockle Street|x = 292|Angelwing Street|
|x = -1332|Curlew Avenue|x = 452|Oystercatcher Street|
|x = -1252|Whimbrel Street|x = 532|Jingle Street|
|x = -1172|Periwinkle Street|x = 612|Sundial Street|
|x = -1092|Cowrie Street|x = 692|Turnstone Avenue|
|x = -932|Scallop Street|x = 772|Nerite Street|
|x = -852|Fulmar Street|x = 852|Petrel Street|
|x = -772|Murex Street|x = 932|Abalone Street|
|x = -692|Willet Avenue|x = 1012|Avocet Avenue|
|x = -612|Junonia Street|x = 1092|Shearwater Street|
|x = -532|Dowitcher Street|x = 1172|Moon Snail Street|
|x = -452|Nautilus Street|x = 1252|Surfbird Street|
|x = -292|Tellin Street|x = 1332|Godwit Avenue|
|x = -212|Gannet Street|x = 1412|Cerith Street|
|x = -132|Auger Street|x = 1492|Yellowlegs Street|
| | |x = 1572|Barnacle Street|

Interrupted lines: Whimbrel Street is Pelican Rest's gravel lane between Driftwood and Urchin Streets. Angelwing Street passes under Hotel Alba through an arch. Surfbird Street is fenced off between Seagrape and Conch Streets by the condo site. Sundial Street meets Pier Road with a 12 m jog.

## 4. Landmarks

|Landmark|id|Seed|Footprint|Height|Tier|
|---|---|---|---|---|---|
|The day 1 block and plaza|`day1-block`|(0, 0)|90×60|26.2 m|A|
|Heron Walk|`heron-walk`|z 44 to 50, x -1600 to 1600|3200×6|palms to 10.5 m|A|
|Hotel Alba|`hotel-alba`|(290, -5)|60×51|49 m|B|
|Gullwing Pier|`gullwing-pier`|(600, 80) to (600, 430)|16×350, head 80×70|wheel top 53 m above the sea|B|
|Coral Arcade hall|`coral-arcade-hall`|(585, 415)|26×18|9 m|B|
|Pelican Rest|`pelican-rest`|(-1250, -220)|142×66|5 m|A|
|Yacht Club Bayhaven and west marina|`yacht-club`|(-1150, 90)|40×22, docks 180×110|flagpole 18 m|A|
|Park & Sons Auto|`park-and-sons`|(340, -230)|62×66|pole sign 8 m|A|
|Tideline Motel|`tideline-motel`|(-520, -60)|50×56|pole sign 10 m|B|
|Gator Putt|`gator-putt`|(-600, -150)|66×66|pole sign 10 m|C|
|The Jetty|`the-jetty`|(1550, 100)|8×70|4 m|C|
|Lifeguard huts, 11|`lifeguard-huts`|x = 34 + 300k, z = 63|3.4×3.4|4.7 m|A|
|Bayhaven Tomorrow, Phase One|`phase-one`|(1300, -60)|142×66|frames to 75 m, crane 92 m|B|
|The Pink Heron|`pink-heron`|(-420, -2)|20×26|22 m|B|
|The Tide Clock|`tide-clock`|(640, 22)|5×5|18 m|B|
|The Big Lounger|`big-lounger`|(-755, 14)|5.5×14|3.6 m|C|

### The day 1 block and plaza
- Silhouette: a low pastel block with a gap in its sea side and the city's name in lights behind it.
- Parts: a hand-written hero lot, x -45 to 45, z -30 to 30: day 1's central block moved to its own file and never regenerated. Two rows of T1 lots split at z = 0. South row, middle lot: the plaza, paving `#e9b9a2`, four palms, a 3×3 planter. North row, middle lot: a 6-floor building (20.4 m) with the roof sign, a board 16×4.2 reading BAYHAVEN in `#ff4fa8`, pink tubes above and below, cyan at the sides. Ten shop signs in day 1's order: Club Luma, The Pink Heron, Tideline Motel, Mango Moon, Coral Arcade, Bayhaven Grand, Diner · 24h, Surf & Vinyl, Hotel Alba, Low Tide Bar. A name with a bigger home elsewhere keeps this as its first shopfront.
- Night: sign at full, 45% of windows lit, warm lamp pools.
- Use: first spawn at (-24, 40.5), facing east. The day 5 button and the day 9 billboard go in the plaza.

### Heron Walk
- Silhouette: one unbroken row of palms between road and sand.
- Parts: slab 0.14 m high, top `#d6cdc4`. Palms every 10 m at z = 47.4, 7.5 to 10.5 m. Lamps every 27.5 m at z = 45. A bench every 40 m. Gaps for the pier ramp (x 592 to 608) and the yacht club gate (x -1160 to -1140).
- Night: a lamp pool every 27.5 m.
- Use: walking, skating, food stands, the day 3 flash mob.

### Hotel Alba
- Silhouette: the tallest pink slab on the strip, a round tower at one corner, a street through its base.
- Parts: slab 60×24×42.8 `#ff9eb5`, x 260 to 320, z -30 to -6, 13 floors, with an arch 14×7 where Angelwing Street passes under. Corner drum, 8 sides, radius 9, height 45, `#fff1c9`, at (260, -6). Pool deck 25×26×7.2 `#fdf6ea` at (272, 8), pool 14×6 `#7fd6e8`. Crown of two 1.5 m setbacks. Roof sign 24×4, HOTEL ALBA in `#7fd6ff`. Fin 2×1.4×49 `#fdf6ea`. Awning `#ff3fa4` over the arch.
- Night: a pink tube under each balcony, cyan up the fin, the pool glowing.
- Use: valet job, Bay Cab rank, Repo Woman car 1 at (296, 24), a drive-through shortcut.

### Gullwing Pier
- Silhouette: the wheel.
- Parts: deck 4.5 m above the water, x 592 to 608, boards and paired piles every 10 m `#8a6f55`, rails `#fdf6ea`. A ramp from Heron Walk Drive reaches deck height at z = 80. Gate: two towers 3×3×9 `#9fd2ff` and a beam with two wing shapes. Twelve T4 stalls, z 140 to 340. Head: x 560 to 640, z 360 to 430. Wheel at (600, 400): diameter 44, hub 26.5 m above the deck, rim of 32 boxes, 16 spokes, 16 cars 2×2×2 in eight pastels, legs 28 m. It faces the beach and turns once in 90 s.
- Night: rim and spokes in chasing bulbs, pink then cyan; lit cars.
- Use: drivable to the end. Pier fishing (B). Heat clears here in The Spire Job. Boat steps at (624, 126).

### Coral Arcade hall
- Silhouette: a lilac barrel roof under the wheel.
- Parts: hall 26×18×6 `#c9a8ff`, vault in 8 segments to 9 m, open east front 12 m wide, the day 1 sign in `#b98bff`, twelve lit cabinets, of which three play (Heat Lap, Gull Patrol, Tide Pool Panic) beside the Grabby Crab claw machine.
- Night: the brightest thing on the pier head.
- Use: business, $120,000, pays $1,500 a day.

### Pelican Rest
- Silhouette: two rows of low trailers under one sagging line of bulbs.
- Parts: merged lot, x -1321 to -1179, z -270 to -204. Gravel lane `#f2ddb0`, 8 m wide, along z = -237. Twelve trailers 14×4.2×3.2, six a side, 9 m apart, `#e0e0e6` with one pastel band each and a 3×3 awning. Mags's: north row, east end, band `#8fe3cf`, carport 6×6×3 `#fdf6ea` for the Heron. Teo's: next door, band `#ffc98f`. Gate arch (two 4.5 m posts, board 9×1.2) and the notice board 1.2×1.6 at (-1250, -206). Gerald's post 0.4×0.4×3 `#8a6f55` at (-1244, -210). Eight 5 m poles carry the bulbs.
- Night: warm bulbs, a porch light a trailer, blue flicker in three windows.
- Use: the free starting property: save, wardrobe, one garage slot. Final Notice starts here. Going Viral's cones are at (-1230, -237).

### Yacht Club Bayhaven and the west marina
- Silhouette: a white veranda, a flagpole, a row of masts.
- Parts: seawall and lawn `#3fb86a` instead of beach, x -1300 to -1110. Clubhouse 40×22×9 `#f7f3ea`, hip roof `#2e4a6b`, veranda 44×6, cupola 4×4×3. Gate arm at (-1150, 46). Main dock 4 m wide from (-1150, 104) to z = 200, six finger docks 30×2.4, a T-head 60×6 where *King Tide* (62×11×14, white, navy stripe, not drivable) lies. Fuel dock 16×6 at (-1230, 122), two pumps `#ffc300`. Jet-ski float at (-1196, 118). Fourteen hulls with 12 m masts.
- Night: warm veranda, a light on every dock post, party lights on Saturday at 21:00.
- Use: boat spawn: two Skipjacks, two Skimmers, a Minnow. Yacht Rock: gangway at the T-head, Mags at the fuel dock.

### Park & Sons Auto
- Silhouette: three roller doors and a sign with two words added later.
- Parts: block x 299 to 361, z -270 to -204. Workshop 30×18×6 `#9fd2ff` at (334, -240), three doors 5×4.2 facing south, one open on a car on a lift. Office 8×8×3.4 `#fdf6ea`. Roof sign 14×2.4, "& Sons" on a newer board. Paint tent 6×8×4 `#ff9eb5`. Tow yard 24×20 behind, six bays.
- Night: warm open door, cyan sign, one flickering tube.
- Use: paint, wraps, engine, tyres, nitro, horns, repairs. Wendell gives Repo Woman. Final Notice ends here. Repo cars go to the tow yard.

### Tideline Motel
- Silhouette: a two-floor U of doors round a small bright pool.
- Parts: lot x -525 to -475, z -105 to -49, open to Seagrape Street. Two wings 8×40×6.4 and a back range 50×8×6.4 `#ffc98f`, doors `#8fe3cf` and `#ff9eb5` by turns, walkway at 3.2 m. Pool 12×6 `#7fd6e8`. Pole sign in `#ffa02e` with a bulb arrow.
- Night: a bulb over every door, cyan pool.
- Use: room 12 (upper floor, east wing, pink door) is a property: $8,000, one garage slot.

### Gator Putt
- Silhouette: a windmill and a very large open mouth.
- Parts: block x -605 to -539, z -190 to -124, floor `#3fb86a`. Eighteen holes 2×8. Seventeen alligators 2.4 m long `#3d6b4a`; hole 18 has an empty plinth marked On break. The gate alligator is 9×3×3 and its jaw is the ticket hut. Windmill 3×3×6.
- Night: one coloured lamp a hole, mint eyes.
- Use: business, $200,000, pays $2,600 a day. Mini-golf (C).

### The Jetty
- Silhouette: a dark line of rocks out to a red post.
- Parts: sixty day 1 rocks of 2 to 4 m from z = 60 to z = 130, a 3 m walkable cap, a red post at the tip, three foam lines on the east side.
- Night: a red light on the post.
- Use: surfers 08:00 to 18:00; the view of the port cranes.

### Lifeguard huts
- Silhouette: a box on stilts with a hat.
- Parts: day 1's hut: stilts 2.2 m, platform 3.4×3.4, cabin 2.6×2.4×2, tapered roof. k runs from -5 to 5. Body and roof by x: -1466 `#8fe3cf` `#ff3fa4`; -1166 `#2e4a6b` `#fdf6ea`; -866 `#ffc98f` `#5dff9b`; -566 `#c9a8ff` `#ffa02e`; -266 `#9fd2ff` `#ff5a5a`; 34 `#ff8f7a` `#29b6e6` (day 1's); 334 `#ff9eb5` `#29e6ff`; 634 `#fff1c9` `#b46bff`; 934 `#7fd6e8` `#ffa02e`; 1234 `#f7f3ea` `#ff3fa4`; 1534 `#b8e0d3` `#ff5a5a`.
- Night: one small lamp under each roof.
- Use: Teo can climb them. A flag shows the weather.

### Bayhaven Tomorrow, Phase One
- Silhouette: three empty concrete racks and a yellow crane, far too tall for the beach.
- Parts: merged site, x 1179 to 1321, z -110 to -44. Three T8 frames 30×30 centred on x = 1205, 1250 and 1295, of 22, 18 and 15 floors (75, 61 and 51 m). Crane at (1228, -96): mast 2×2×88 `#ffc300`, jib 60 m. A 2.4 m fence printed with the finished towers.
- Night: one white work light a floor, a red light on the jib, no lit windows. Two Bellweather guards with shotguns on the fence.
- Use: Teo can climb to floor 15. Ramp R4.

### The Pink Heron
- Silhouette: a neon heron on a roof, on one leg.
- Parts: a 2-floor T1 building `#ff9eb5`. On the roof, a heron 14 m tall in pink tubes: legs 6 m, tapered body 4×3, a five-segment neck, a beak. Every 8 s it changes legs.
- Night: the brightest pink on Motel Row.
- Use: drinks. Tideline 98 leaks from the door, and sometimes a fight.

### The Tide Clock
- Silhouette: a cream tower with one hand on each face.
- Parts: shaft 5×5×18 `#fff1c9`, four 4 m dials reading High, Ebb, Low, Flood, a red wedge at 3:15, a box gull on top.
- Night: cyan dials, pink hands.
- Use: a meeting marker for Bay Cab and Pelican Eats. A marimba run at 15:15.

### The Big Lounger
- Silhouette: one giant sun lounger with its back raised.
- Parts: a frame 5.5×14×0.6 `#fdf6ea` on six short legs. The seat is pink and white stripes, flat for 8 m at the north end. The back rest is 6 m long and tilts up to 3.6 m at the south end. A towel box `#29e6ff` hangs over one side.
- Night: uplit pink.
- Use: the back rest is ramp R3.

## 5. Places of use

Shops and properties listed in `04-systems.md` are tier A. A door goes on a kit building until its landmark is built.

|Place|Kind|Seed|Tier|
|---|---|---|---|
|Park & Sons Auto|mod garage, repairs, repo jobs|(340, -230)|A|
|Pelican Rest trailer|property, free, 1 slot|(-1250, -220)|A|
|Tideline Motel, room 12|property, $8,000|(-520, -60)|A|
|Second Wind Thrift|clothes|(-840, -76)|A|
|Storm Mart|life vest, flares, noodles|(480, -156)|A|
|Birdbath Car Wash|car wash|(-470, -236)|A|
|Shell Yeah stand|food|(118, 47)|A|
|Squeeze Play stand|food|(-206, 47)|A|
|Scoop Dreams|food|(566, 8)|B|
|Hush Hour Diner|food|(-560, 4)|B|
|Pelican Fuel|petrol|(-960, -156)|B|
|Cash 4 Jet Skis|Skip Lindqvist, Repo Depot|(-1450, 2)|C|
|Coral Arcade|business|at `coral-arcade-hall`|B|
|Gator Putt|business|at `gator-putt`|C|
|West marina|boats|(-1150, 110)|A|
|Pier boat steps|boats, jet-ski slalom|(624, 126)|B|
|Public boat ramp|boats|(-1500, 76)|B|
|Bay Cab rank|taxi job|(300, 26)|A|
|Route 9 bus stops, 8|Heron Walk Drive at x = -1560, -1250, -520, 0, 290, 600, 1300 and 1560, z = 37|(-1560, 37)|B|
|Drift corner|first drift score|(52, 37)|A|
|Old Man Fitch|Buried chain|(-866, 68)|C|

## 6. Street life

Traffic weights by vehicle id. `taxi` is the Bay Cab `tarpon`. An id not yet built gives its weight to `tarpon`.

|id|dawn|day|golden|night|
|---|---|---|---|---|
|tern|1|4|5|2|
|pinfish|2|4|4|2|
|taxi|2|3|4|5|
|tarpon|3|3|3|2|
|snook|2|3|2|1|
|heron|1|2|2|2|
|sailfin|0|1|2|3|
|grouper|1|2|2|1|
|pompano|2|2|1|1|
|mullet|2|1|1|0|
|manatee|1|1|1|1|
|conch|0|1|1|0|

People weights:

|kind|dawn|day|golden|night|
|---|---|---|---|---|
|beachgoer|1|6|3|0|
|tourist|1|5|5|3|
|jogger|5|1|3|0|
|retiree|4|2|2|0|
|skater|0|2|3|1|
|clubber|0|0|1|5|
|office worker|1|1|1|0|
|cap in use|50%|100%|120%|50%|

On Wednesday from 10:00 to 17:00 the tourist weight doubles. Two thirds of all people stay south of Seagrape Street.

Ambient vignettes (tier B):

|#|Where|When|What you see|
|---|---|---|---|
|1|(-200, 58)|06:00|Eight retirees do tai chi on the sand. One is always a beat late.|
|2|(-1500, 70)|06:30|A Mullet backs a low-riding boat down the ramp. The driver keeps one hand under his shirt.|
|3|(1290, -36)|08:00|Two guards with shotguns walk the fence of a site where nobody works.|
|4|(-520, -48)|11:00|A man in a towel shouts "My fucking keys" at a motel door.|
|5|(120, 62)|15:10|Everyone on the sand looks up and packs in step. At 15:15 the umbrellas close together.|
|6|(150, 74)|18:30|A photographer waves a wedding couple backwards until a wave gets them.|

After dark (tier B). The Undertow is the crew that sells drugs on this beach. Its lookouts wear a dry towel round the neck.

- West End boat ramp: loads land from 02:00 to 04:00.
- Motel Row, rows C and D: sellers in parked cars after 22:00, and armed robbers.
- Under the pier ramp: one seller, two lookouts.
- Phase One: the guards shoot after one warning.
- Pelican Rest: nobody sells here.

Parked cars:

- Kerbs fill to 30%. Motel bays fill to 60% at night and 20% by day.
- No parking on the south kerb of Heron Walk Drive, except the Bay Cab rank and bus stops.
- Day 1's five parked cars round the hero lot keep their places and colours.
- West End: one car in four is a `mullet`; one kerb space in ten holds a boat trailer.

## 7. Sound bed

|Layer|Plays|Tier|
|---|---|---|
|Waves: slow swells of filtered noise|always; louder towards z = 80, silent north of z = -200|A|
|Gulls: two-note chirps|06:00 to 19:00, more near the pier and marina|A|
|Bar leak: the current Tideline 98 song, low-passed at 250 Hz|18:00 to 03:00 within 30 m of a bar door|A|
|Rigging: thin metal ticks|always within 150 m of the marina, faster in wind|B|
|Pier organ: an eight-bar waltz on the pluck|10:00 to 23:00 within 200 m of the wheel|B|
|Pile driver: a 60 Hz thump every 2.4 s|07:00 to 16:00 within 300 m of Phase One|B|

At 15:15 rain and thunder sit on top and the gulls stop.

## 8. Signs

Signs with canon names are tier A. Signs with new names are tier B. The neon sign atlas draws in capitals, as day 1 does.

Shop and roof signs:

```text
Bayhaven
Club Luma
The Pink Heron
Tideline Motel
Mango Moon
Coral Arcade
Bayhaven Grand
Diner · 24h
Surf & Vinyl
Hotel Alba
Low Tide Bar
Shell Yeah
Scoop Dreams
Key Lime Crimes
Squeeze Play: Fresh Juice
Hush Hour Diner
Park & Sons Auto
Yacht Club Bayhaven: Members And Guests
Gator Putt: One Is On Break
Cash 4 Jet Skis
Reel Estate: Bait And Houses
Second Wind Thrift
Storm Mart
Pelican Fuel
Birdbath Car Wash
Motel Sunburn: Hourly Rates
The Vacancy: No Vacancy
Bun Voyage
Mullet Over
Gullwing Pier
```

Painted words and notices:

```text
Pelican Rest
Notice To Vacate
Do Not Feed Gerald. He Has Eaten.
No Lifeguard After 3:15. No Shit.
Bayhaven Tomorrow: Coming Soon To Where You Are Standing
Valet: Hotel Guests Only, And Whoever Tips
Greetings From Bayhaven
```

Bumper stickers:

```text
I Brake For Pelicans
Fuck Bayhaven Tomorrow
Honk If You Saw Me On Bayhaven Blue
```

## 9. Things to find

Flamingos: 10, all tier B. First picks for the tier A set of 40: F1 to F4.

|#|Seed|Tier|Why here|
|---|---|---|---|
|F1|(-1262, -212)|B|Beside the gate at Pelican Rest.|
|F2|(2, 12)|B|In the plaza planter.|
|F3|(250, -170)|B|On the first drive out from Park & Sons.|
|F4|(604, 70)|B|In the shade under the pier ramp.|
|F5|(-606, -122)|B|Under the gate alligator at Gator Putt.|
|F6|(-500, -76)|B|In the Tideline Motel pool.|
|F7|(272, 8)|B|On the Hotel Alba pool deck.|
|F8|(1295, -60)|B|On floor 2 of the shortest condo frame.|
|F9|(-1184, 72)|B|On the yacht club lawn.|
|F10|(-1500, 66)|B|Among the crab traps at the boat ramp.|

Big Air ramps: 5. First pick for the tier A set of 15: R1, then R2.

|#|Seed|Heading|Tier|What it is|
|---|---|---|---|---|
|R1|(330, -196)|east|B|Wendell's loading ramp on Driftwood Street. Clears a parked box truck.|
|R2|(-170, 40)|south|B|A builder's plank ramp over the promenade kerb. Land on the sand.|
|R3|(-755, 14)|south|C|The back rest of the Big Lounger. Lands on Heron Walk Drive.|
|R4|(1210, -40)|north|B|A tipped slab on Seagrape Street. Clears the Phase One fence into a sand pile.|
|R5|(-1490, 50)|south|B|The raised lip of the boat ramp. Lands on a sandbar 40 m out, or in the water.|

Postcard views: 4. First pick for the tier A set of 10: P1.

|#|Stand at|Frame|Tier|
|---|---|---|---|
|P1|(4, 47)|The plaza and the Bayhaven roof sign, looking north|B|
|P2|(540, 70)|The ferris wheel against the sunset|B|
|P3|(-1190, 60)|The marina masts and Sandpiper Bridge|B|
|P4|(1480, 70)|The Jetty with the port cranes behind|C|

## 10. Checks

1. `map.districtAt` returns `tideline` at (0, 0), (-1250, -220) and (1550, 100).
2. No generated lot overlaps x -45 to 45, z -30 to 30, and the top of the roof sign is at 26.2 m, give or take 0.2.
3. There are 11 lifeguard huts at z = 63, at x = 34 + 300k for k from -5 to 5, with 11 different body colours.
4. No kit building is over 40 m. `hotel-alba` is 49 m, the Phase One crane is 92 m, and nothing else in the district is over 80 m.
5. All 40 north-south grid lines from x = -1572 to x = 1572 have a name. The road name at (132, -80) is Wentletrap Street.
6. Counts: 10 flamingos, 5 ramps, 4 postcards, 8 bus stops, 40 sign strings. Every seed in section 9 is on land.

## New names

- **Streets:** the 30 streets and 5 avenues in section 3 (Limpet Street to Barnacle Street; Curlew, Willet, Turnstone, Avocet and Godwit Avenues).
- **Bayhaven Grand** and **Diner · 24h:** two signs already on the day 1 block.
- **Bayhaven Tomorrow, Phase One:** the three condo frames in East Strand.
- **The Tide Clock:** a clock tower at the pier that shows the tide.
- **The Big Lounger:** a giant sun lounger statue on Motel Row.
- **Birdbath Car Wash:** the car wash chain, as in `bible/catalog/shops.md`.
- **The Undertow:** the crew that brings drugs into the city and sells them. Tier B.
- **Route 9:** the beachfront bus line, the 9 Beachline of `bible/systems/transit.md`, Heron Walk Drive end to end.
