# Bible · world · Rustwater

Rustwater is the port: 1.4 by 1.8 km of container yards, sheds, tanks and scrap at the east end of the map, with a quay down its east side and along its south. Four gantry cranes over a moored ship give the district its shape from anywhere on the bay. Below: the roads and yards, the building kit, each landmark as a parts list, street life, sound, signs and things to find.

Tier: A for the roads, the kit recipes marked A, street life, the cranes and berth, and the cruise terminal. Everything else carries its own tag.

Bounds `[1800, 3200] × [-1600, 200]`. Sizes are width (x) × depth (z) × height in metres; footprints are width × depth. Every `(x, z)` is a seed. Hour bands: dawn 05:00 to 08:00, day 08:00 to 17:00, golden 17:00 to 21:00, night 21:00 to 05:00.

## 1. Feel

Big, slow and orange. Nothing here was built to be looked at: stacks of boxes in six colours, rust sheds with hazard stripes, pipes, rails, fences. The scale is wrong for a person. A truck is small beside a stack, and a stack is small beside a crane. Nobody strolls. People in hi-vis walk in straight lines and machines beep. Guards with rifles stand at every gate, and the Sheriff's cameras stop at the fence, by contract. Whatever goes missing in here was never on the list. At night it all turns sodium orange, and the cranes keep working.

Any screenshot of Rustwater must show:

1. Rust `#b5532f` or safety yellow `#ffc300`.
2. A stack of containers, or a crane over the roofs.
3. A hazard stripe, a fence or a rail in the foreground.

## 2. Neighbourhoods

The avenues are on the shared grid, 22 m wide. Minor streets are on the 80 m lines, 14 m wide, but large yards swallow whole blocks, so many lines are broken (section 3). The quay edge is at x = 3024 on the east side and z = 130 on the south. Past both is open water.

Height rule: a container is 12.2×2.6×2.6. A stack is 1 to 5 high (13 m). No kit building passes 14 m.

### The kit

|id|Recipe|Footprint|Floors|Walls|Roof|Street level|Tier|
|---|---|---|---|---|---|---|---|
|R1|Container stack|bays of 12.2×2.6; 3 to 6 bays wide, 2 to 8 long|1 to 5 high|rust `#b5532f`, yellow `#ffc300`, red `#ff5a5a` at 75%, blue `#2e4a6b`, green `#3d6b4a`, white `#e0e0e6`|none|6 m truck aisles, a number painted at each aisle end|A|
|R2|Transit shed|40×60|1, eave at 10 m|corrugated rust `#b5532f`; a 2 m band of `#ffc300` and black stripes round the base|low gable `#6f6a78` with a ridge vent|four dock doors 4×4.5 at 1.2 m, a bay number, sodium lamps|A|
|R3|Brick depot|30×40|2, floor 5.0|rust `#b5532f` at 85%|flat, with a rusted tank|a roller door, small barred windows, a painted name half worn off|B|
|R4|Site cabin stack|units 12×3, two high|2, floor 2.6|`#ffc300` or `#e0e0e6`|flat|an outside stair, a notice board, a row of hard hats|B|
|R5|Dockers' café|12×18|1, floor 3.6|`#e0e0e6` with a rust base band|flat, with a neon sign|a counter hatch, eight bollards as seats|B|
|R6|Silo|8 sides, radius 5|height 14|`#e0e0e6`|cone cap|a pipe rack and a ladder|B|

`07-art-and-audio.md` names container red, blue and green without values. The three above are taken from the plan's other palettes. Until a B recipe is built, its share goes to R2.

Street light: masts 18 m tall with four heads, lamp colour `#ff9a3c`.

### Block recipes

|Neighbourhood|Bounds|Lots|Recipes, share of lots|Parking|Per 100 m of street|
|---|---|---|---|---|---|
|The Gantries|x 2600 to 3200, z -900 to -100|yards, and 40×60|R1 60%, R2 25%, R4 10%, R5 5%|a marked queue lane for 10 trucks at each gate|6 masts, 4 bollards, 2 hazard barriers, 1 parked Fiddler, 1 loose container|
|Cruise Basin|z -100 to 200|40×60 and 30×40|R2 40%, R3 25%, R1 15%, R4 10%, R5 10%|a 120-bay lot and coach bays at the terminal|4 palms in tubs, 5 lamps, 4 bollards, 2 luggage carts, 1 flag row|
|Tank Farm|x 1800 to 2600, z -900 to -100|30×40 and 40×60|R2 35%, R3 30%, R6 15%, R1 10%, R4 10%|yard aprons|5 masts, 30 m of pipe rack, 3 barrels, 2 hazard signs|
|Scrap Mile|x 1800 to 2600, z -1600 to -900|fenced yards of 30×40|R3 35%, open scrap lot 30%, R2 20%, R4 10%, R5 5%|on the verge|4 masts, 5 tyre stacks, 3 car shells, 1 cube of crushed car|
|Drydock|x 2600 to 3200, z -1600 to -900|yards|R2 40%, R3 20%, R4 20%, R1 10%, R6 10%|a 60-bay workers' lot|5 masts, 3 stacks of steel plate, 2 anchor chains, 1 propeller on blocks|

### Yards

Each yard is one fenced lot that replaces the blocks and streets inside it.

|Yard|x|z|
|---|---|---|
|Container yard, north|2699 to 2921|-666 to -368|
|Container yard, south|2699 to 2921|-346 to -204|
|Quay apron|2943 to 3024|-986 to 130|
|Tank farm|2303 to 2601|-986 to -688|
|Rail yard|1983 to 2281|-346 to -204|
|Scrapyard|2059 to 2205|-1306 to -1164|
|Shipyard|2699 to 3024|-1306 to -1008|
|Cruise terminal|2303 to 2700|50 to 130|

## 3. Streets

- `02-world.md` gives the strip from x = 1600 to x = 1800 south of z = -320 to no district. Gunwale Road and Driftwood Street each need a 200 m link across it to reach Tideline. Nothing in this file is placed there.
- The Bayline Expressway (z = -1480, raised 8 m) ends at x = 3000. Its ramp at x = 2200 comes down to Union Avenue beside Keel Street. The avenues pass under it.
- Breakwater Road runs between the crane legs. It ends at Tower Way, where the shipyard starts.
- A minor street stops at the fence of any yard in its way and goes on at the far side.

### Canon roads

|Line|Name|Runs|
|---|---|---|
|x = 1972|Dockside Avenue|z -1440 to 37|
|x = 2292|Container Road|z -1440 to 37|
|x = 2612|Drydock Road|z -1440 to 37|
|x = 2932|Breakwater Road|z -997 to 37|
|z = -197|Driftwood Street|x 1800 to 2932|
|z = -357|Flamingo Avenue|x 1800 to 2932; the port gate|
|z = -437, -517, -597|First, Second, Third Street|x 1800 to 2692|
|z = -677|Commerce Way|x 1800 to 2932|
|z = -757, -837, -917|Fifth, Sixth, Seventh Street|x 1800 to 2292, and x 2612 to 2932|
|z = -997|Tower Way|x 1800 to 2932|
|z = -1077, -1157, -1237|Ninth, Tenth, Eleventh Street|x 1800 to 2692|
|z = -1317|Union Avenue|x 1800 to 3000|
|z = -1397|Thirteenth Street|x 1800 to 2932|

### New names: ship parts

Six are the canon's (Bollard, Capstan, Keel, Hawser, Bilge, Windlass).

|Line|Name|Line|Name|
|---|---|---|---|
|x = 1812|Bollard Street|x = 2452|Davit Street|
|x = 1892|Cleat Street|x = 2532|Rudder Street|
|x = 2052|Capstan Street|x = 2692|Hawser Street|
|x = 2132|Windlass Street|x = 2772|Scupper Street|
|x = 2212|Keel Street|x = 2852|Transom Street|
|x = 2372|Bilge Street|z = 37|Gunwale Road|
|z = -1540|Fairlead Road| | |

The north-south streets run from Thirteenth Street to Gunwale Road, less the yards. Scupper and Transom Streets exist only from Tower Way to Commerce Way. Gunwale Road is the south port road, x 1800 to 2932, on the line of Heron Walk Drive. Fairlead Road is a frontage road north of the expressway, x 1800 to 3000.

## 4. Landmarks

|Landmark|id|Seed|Footprint|Height|Tier|
|---|---|---|---|---|---|
|Gantry cranes, 4|`gantry-cranes`|(2900, -300)|each 200×24|70 m|A|
|Container ship berth|`ship-berth`|(3050, -300)|40×300|44 m|A|
|Cruise terminal|`cruise-terminal`|(2500, 100)|hall 120×40, ship 280×36|funnel 52 m|A|
|Bay Ferry terminal|`ferry-terminal`|(2300, 150)|pier 12×60|10 m|C|
|Beach-ball tanks, 9|`beach-ball-tanks`|(2400, -700)|298×298|18 m|B|
|Scrapyard and crusher|`scrapyard`|(2200, -1200)|146×142|22 m|B|
|Dry dock|`dry-dock`|(2950, -1100)|180×48|gantry 40 m|C|
|Union hall|`union-hall`|(2650, -500)|30×20|9 m|B|
|Port gate|`port-gate`|(2706, -357)|12×30|9 m|B|
|Port railway|`port-railway`|line z = -277, x 1800 to 2900|1.1 km|4 m|B|
|Breakwater light|`breakwater-light`|(3150, 130)|mole 136×10|16 m|C|
|The Breakwater Hotel|`breakwater-hotel`|(2800, 0)|40×24|34 m|C|
|Tyre Hill|`tyre-hill`|(1930, -1360)|50×50|22 m|C|
|Harbour tower|`harbour-tower`|(2984, 60)|10×10|38 m|C|

### Gantry cranes and the ship berth
- Silhouette: four yellow portals with long arms out over a ship.
- Parts: four cranes at z = -450, -350, -250 and -150. Each has four legs 2×2×56 `#ffc300`: a landside pair at x = 2900, a waterside pair at x = 3012, 24 m apart along z, with a sill beam at 14 m. A boom 200×4×6 at 56 m from x = 2885 to x = 3085. An A-frame to 70 m over the waterside legs. A trolley 6×6×3 with a cab under the boom, and a spreader on four cables. Black stripes on the lowest 4 m of each leg. Breakwater Road and four R1 rows pass under the sill beams. The ship *Slack Tide* lies at x 3030 to 3070, z -450 to -150: hull 40×300×14 `#2e4a6b` with a rust band at the waterline, a bridge block 30×16×30 `#e0e0e6` at the north end to 44 m, R1 stacks four high on deck.
- Night: floodlights along every boom, a red light on each A-frame, trolleys still moving.
- Use: each crane moves one container every 40 s. Crane Game (B): the player works crane 2 from its cab, with the truck at (2932, -350). Teo can climb the leg stairs to the boom.

### Cruise terminal
- Silhouette: a white ship taller than anything on shore, beside a long hall with flags.
- Parts: hall 120×40×12 `#e0e0e6`, x 2440 to 2560, z 70 to 110, under a wave canopy of three tapered boxes `#29b6e6`. Twelve flagpoles. Two gangways 3×20×3 at 8 m. The ship *Early Supper* lies at x 2360 to 2640, z 134 to 170: hull 280×36×18 `#f7f3ea`, six decks of 3 m stepping in, a funnel 10×8×12 `#ff9eb5` to 52 m, a row of lifeboats `#ffa02e`.
- Night: bulbs from bow to stern, a white hall, uplit flags.
- Use: the ship is in port on Wednesday from 08:00 to 18:00. Until the calendar is built it is always there. Bay Cab rank and coach bays at (2500, 56).

### Bay Ferry terminal
- Silhouette: a short pier with a blue-roofed shed.
- Parts: pier 12×60×2 from (2300, 130) to z = 190. Shed 10×16×5 `#e0e0e6`, roof `#29b6e6`. A car ramp 8×12 at the head. The Bay Ferry, 40×8×12, white with a blue stripe, on the west side.
- Night: pier lamps, a green and a red light at the head.
- Use: the ferry to Cape Calamity (D). Before that, a boat spawn and a fishing spot.

### Beach-ball tanks
- Silhouette: nine giant beach balls in a square.
- Parts: inside the tank farm yard, behind a 2 m bund wall `#e0e0e6`. Nine 16-sided drums of radius 18 and height 18, centred on x = 2400, 2485, 2570 and z = -722, -822, -922. Each is painted in six gores, white by turns with one of red, yellow, blue, green, orange or pink, under a white cap of radius 4. No two neighbours share a colour. A stair spirals up each. Pump house 12×8×5 at (2340, -700). A pipe rack 3×280×4 along x = 2370. An open apron, x 2303 to 2360.
- Night: lit from below in sodium orange.
- Use: the street race meet gathers on the apron on Thursday at 23:00. Teo can climb any tank.

### Scrapyard and crusher
- Silhouette: hills of flat cars and a crane with a round magnet.
- Parts: the scrapyard yard, mesh fence 3 m, gate on Keel Street at (2205, -1200). Crusher 10×6×6 `#ffc300` with a lid 9×5×0.5 that drops every 90 s and gives a cube 1.5×1.5×1.5 in the car's colour. A pyramid of cubes 12×12×6. Magnet crane: mast 2×2×18, jib 16 m, a disc of radius 1.5. Six piles of car shells, three high. An R4 office with a price board.
- Night: two masts lit, the crusher still.
- Use: drive a stolen car onto the pad at (2190, -1200) to sell it for 5% of its value, once per car. Then watch. The crusher has made more than cars disappear.

### Dry dock
- Silhouette: a ship's hull standing in a hole, under a yellow frame.
- Parts: inside the shipyard yard. Basin x 2844 to 3024, z -1124 to -1076, 12 m deep, concrete `#c8ccd2`, sides in three steps of 4 m. A steel gate 4×48×12 at the quay edge. A hull 120×16×22 `#b5532f` on blocks, with a half-painted band `#2e4a6b` and scaffold down one side. A travelling gantry 60×52×40 `#ffc300` over the basin.
- Night: white-blue welding flicker on the scaffold.
- Use: the basin floods and drains on a 10 minute cycle; boats can enter when it is full. Ramp R5.

### Union hall
- Silhouette: a plain brick box with a hand-painted banner.
- Parts: an R3 depot 30×20×9, x 2635 to 2665, z -510 to -490. A banner 20×3 across the front. A flagpole, a notice board, twelve lockers outside. Dess's office is the upper corner window with a crane-shaped lamp. A `fiddler` and a `mullet` in the yard.
- Night: one lit window.
- Use: Dess gives Crane Game here (B). After it, a car left in the bay at (2660, -480) is gone by morning, and its heat with it (C).

### Port gate
- Silhouette: a flat canopy over four striped arms.
- Parts: on Flamingo Avenue at the yard fence. A canopy 12×30×1 at 7 m on six posts over four lanes, each with a barrier arm and a booth 2×3×2.6 `#ffc300`. Six port guards with rifles. A sign beam reading PORT BAYHAVEN. A weighbridge plate 18×3.
- Night: white canopy lights, a red or green light on each lane.
- Use: Crane Game ends by driving out past it. Arms lift for trucks. Snapping a barrier arm in view of a deputy is heat 1. The guards do not wait for the deputy.

### Port railway
- Silhouette: a line of flat wagons with one box each.
- Parts: one track on the z = -277 line from x = 1800 to a buffer at x = 2900. Six sidings in the rail yard. Twenty-four flat wagons 14×2.8×1.2, each carrying one or two containers. A level crossing with bells and two arms at each of the nine streets it meets. A yard engine 10×3×4 `#ffc300` pulls eight wagons at 3 m/s every 6 minutes (C).
- Night: red crossing lights.
- Use: a train holds a crossing for 40 s, which can cut off a chase for you or against you. Teo can ride the wagons. So do boxes that never pass the gate.

### Breakwater light
- Silhouette: a red and white post at the end of a line of rocks.
- Parts: a rock mole 10 m wide from (3024, 130) east to (3160, 130), with a 3 m walkable cap. A tower 4×4×16 in red and white bands at the tip.
- Night: one red flash every 4 s.
- Use: fishing. Postcard P3.

### The Breakwater Hotel
- Silhouette: an old brick block with a ship's funnel for a chimney.
- Parts: block 40×24×30 `#b5532f` at 85%, 8 floors. A roof sign. A funnel 4×4×6 `#2e4a6b`. A corner bar door.
- Night: half the roof sign's letters are lit.
- Use: drinks, and a fight most nights.

### Tyre Hill
- Silhouette: a dark stepped mound.
- Parts: five rings of tyre-black boxes `#3b3946`, each 4 m high and 5 m narrower than the one below, from 50×50 at the ground to a 10×10 top at 22 m. A dirt path spirals up it.
- Night: unlit.
- Use: drivable to the top on two wheels or in a Bullfrog. Ramp R4.

### Harbour tower
- Silhouette: a white post with a glass room and a turning bar on top.
- Parts: shaft 6×6×30 `#e0e0e6`. A glass room 10×10×4 `#b8cfe0`. A radar bar 6×1×0.4 that turns once in 3 s. A mast to 38 m.
- Night: a green glow in the room.
- Use: Teo can climb the outside stair.

## 5. Places of use

Shops and properties listed in `04-systems.md` are tier A. A door goes on a kit building until its landmark is built.

|Place|Kind|Seed|Tier|
|---|---|---|---|
|Park & Sons Auto, port branch|mod garage, repairs|(2020, -470)|A|
|Rustwater warehouse|property, $150,000, 6 slots|(1930, -557)|A|
|Storm Mart|life vest, flares, noodles|(1850, -400)|A|
|Scrapyard pad|sell a stolen car|(2190, -1200)|A|
|Port boat steps|boats: a Skipjack and a Minnow|(2760, 126)|A|
|Bay Cab rank|taxi job|(2500, 56)|A|
|Hammerhead berth|the Sheriff's patrol boat|(2880, 126)|B|
|The Bilge Pump|food|(2660, -460)|B|
|Shell Yeah stand|food|(2440, 60)|B|
|Pelican Fuel|petrol, a truck stop|(1990, -1260)|B|
|Union hall|Dess, Crane Game|(2650, -500)|B|
|Crane 2 cab|Crane Game|(2900, -350)|B|
|Race meet|Thursday 23:00|(2330, -840)|B|
|Bus stops, 2|Route 4 on Commerce Way at Dockside (1972, -677) and Union Hall (2612, -677)|(1972, -677)|B|
|Clam Secure depot|cash trucks start here|(1850, -720)|C|
|Bay Ferry|to Cape Calamity|(2300, 150)|D|

## 6. Street life

Traffic weights by vehicle id. `taxi` is the Bay Cab version of `tarpon`. An id that is not built yet gives its weight to `tarpon`. A `fiddler` stays on yards and aprons.

|id|dawn|day|golden|night|
|---|---|---|---|---|
|hogfish|5|5|3|2|
|mullet|3|3|2|1|
|fiddler|2|3|1|1|
|pompano|2|2|1|1|
|tarpon|1|1|1|1|
|osprey|1|1|1|0|
|whelk|1|1|0|0|
|manatee|1|0|1|0|
|remora|0|1|1|1|
|taxi|0|1|1|0|
|wahoo|0|0|0|2|

People weights, and how much of the people cap is in use. `guard` is a tier B kind: port security, armed, at gates and on yard patrol.

|kind|dawn|day|golden|night|
|---|---|---|---|---|
|dock worker|6|6|3|2|
|guard|2|2|2|3|
|office worker|1|1|0|0|
|tourist|0|1|1|0|
|retiree|0|1|0|0|
|clubber|0|0|0|1|
|cap in use|60%|70%|40%|20%|

On Wednesday from 08:00 to 18:00, Cruise Basin runs tourist 6 and retiree 4, with `taxi` 4 and `manatee` 2 on Gunwale Road. At 06:00, 14:00 and 22:00 the shift changes, and for ten minutes the gate holds one and a half times the cap.

Ambient vignettes (tier B):

|#|Where|When|What you see|
|---|---|---|---|
|1|(2690, -350)|06:00, 14:00, 22:00|Forty dock workers walk in as forty walk out. Each pair nods as it passes.|
|2|(2940, -250)|11:00|Crane 3 lifts a box off the ship that is on nobody's list. The foreman turns a page, and now it is.|
|3|(2190, -1212)|09:00 to 17:00|Every 90 s the crusher makes a car into a cube. Nobody asks why this one still had its plates on.|
|4|(2660, -452)|12:00|Thirty workers sit on a row of bollards and open identical lunch boxes one after another.|
|5|(2700, -500)|13:00|Two Fiddlers meet in an aisle. Both reverse. Both advance. It goes on.|
|6|(2500, 60)|Wednesday 10:00|Two hundred tourists in matching visors follow a pool noodle held up as a flag. A pickpocket follows the last six.|
|7|(2330, -840)|Thursday 23:00|Two rows of cars with their hoods up. Cash changes hands. One driver keeps a pistol on the dashboard.|
|8|(2990, 20)|03:00|A worker fishes off the quay beside a No Fishing sign. Behind him a box goes into the water. A cruiser idles past. Nobody looks.|

After dark (tier B):

|Where|Who runs it|What happens|
|---|---|---|
|The gate and the container yards|port security, with rifles|One shout, then they shoot.|
|The boxes|Dess Whitlock's local|The union decides which containers customs opens. Two customs officers inspect one box in forty, and it is always the same box.|
|North container yard, the back rows|the Undertow|Its boxes come off *Slack Tide* on the night shift and leave by rail before dawn.|
|Scrap Mile|the yard owners|A stolen car is a cube by lunch. After 22:00 every yard has a man with a shotgun, and nobody calls a deputy.|
|Fairlead Road, under the expressway|nobody|The worst 1.2 km in the city at night: robberies, burnt cars, and a body most Mondays.|
|The Breakwater Hotel|the Undertow's captains|Do not start anything in the front bar unless you mean to finish it.|

Parked cars:

- Kerbs fill to 15%, mostly `mullet` and `possum`.
- Up to 10 `hogfish` wait in each gate's queue lane, engines running.
- The workers' lot at the gate has 60 bays, 80% full by day. The cruise lot has 120 bays, 70% full on Wednesday and 10% otherwise.
- Trailers with no cab line Bollard Street.
- Scrap Mile verges hold one car shell every 20 m. Shells are props.
- A white port security `grouper` sits at each yard gate with its engine running.

## 7. Sound bed

|Layer|Plays|Tier|
|---|---|---|
|Ship horn: one low blast of 3 s, a 90 Hz saw through a low-pass|every 4 to 9 minutes; the cruise ship answers an octave up at 10:00 and 17:00 on Wednesday|A|
|Crane alarm: a two-tone beep, 0.4 s on and 0.4 s off|while a trolley moves, within 250 m|A|
|Clanks: a noise burst through a 300 to 900 Hz band-pass|one every 2 to 10 s, across the district|A|
|Reversing beepers|near any Fiddler or truck in reverse|B|
|Quay water: slow slaps|within 40 m of a quay edge|B|
|Crossing bells|while a train is within 60 m of a crossing|B|
|Crusher: a groan of 4 s, then a crunch|every 90 s from 09:00 to 17:00, within 200 m|B|
|Lamp buzz: a 100 Hz hum|at night within 15 m of a mast|B|
|Far shots: three flat cracks off metal|a few times a night in Scrap Mile and on Fairlead Road|B|

## 8. Signs

Signs with canon names are tier A. Signs with new names are tier B. The neon sign atlas draws in capitals, as day 1 does.

Gate, shop and hull signs:

```text
Port Bayhaven
Gate 1
Have Papers Ready
Dockworkers' Union Hall
Local 315
Park & Sons Auto
Port Branch. Still No Sons.
Storm Mart Trade Counter
Bay Ferry
To Cape Calamity. Saturdays, Probably.
Cruise Terminal
Welcome Back. Please Reboard By Five.
The Breakwater Hotel
The Bilge Pump
Hot Food. Cold Looks.
Clam Secure
Pelican Fuel: Diesel
Shell Yeah
Bay Cab
Scrap Mile
Cars Bought. One Question Asked.
Used Tyres. Barely.
Early Supper
Slack Tide
```

Notices and container stencils:

```text
Days Since Last Dropped Container: 0
Armed Guards. No Warning Shots.
Caution: The Crane Does Not Know You Exist
No Fishing
Slow. The Train Is Slower.
Tyre Hill. Do Not Climb.
This Side Up. Other Side Also Fine.
Fragile: Flamingos
Property Of Bellweather Group. Do Not Open.
SPF 1000. Keep Out Of Sunlight.
Lava Abuela: Export
Bayhaven Tomorrow: Site Materials
```

Bumper stickers:

```text
My Other Truck Is A Crane
Union Made, Union Parked
Wide Load, Narrow Patience
How Is My Driving? Fuck Off.
```

## 9. Things to find

Flamingos: 10, all tier B. First picks for the tier A set of 40: F1 to F4.

|#|Seed|Tier|Why here|
|---|---|---|---|
|F1|(2904, -350)|B|At the foot of crane 2, wearing a hard hat.|
|F2|(2500, 64)|B|Outside the cruise terminal doors, among the flagpoles.|
|F3|(2980, -100)|B|On top of a single container left on the quay apron.|
|F4|(1812, -346)|B|By the first hazard barrier on Flamingo Avenue, where the paint stops and the rust starts.|
|F5|(2400, -722)|B|On the white cap of the first beach-ball tank.|
|F6|(2130, -1240)|B|On the pyramid of car cubes.|
|F7|(2650, -488)|B|At the foot of the union hall flagpole.|
|F8|(2706, -366)|B|On the port gate canopy.|
|F9|(2140, -277)|B|On a flat wagon in the rail yard. It travels when the train does.|
|F10|(2612, -1480)|B|In the dark where Drydock Road passes under the expressway.|

Big Air ramps: 5. First pick for the tier A set of 15: R1, then R2.

|#|Seed|Heading|Tier|What it is|
|---|---|---|---|---|
|R1|(2932, -120)|north|B|A flatbed trailer with its ramps down on Breakwater Road. Clears the truck queue under crane 4.|
|R2|(2700, 100)|south|B|A boat slip on the south quay. Lands on a barge 12×30 moored at (2700, 165), or in the water.|
|R3|(2190, -1180)|west|B|A ramp of car cubes in the scrapyard. Clears three piles of shells.|
|R4|(1930, -1340)|south|C|The top terrace of Tyre Hill. Clears Union Avenue.|
|R5|(2850, -1100)|east|C|The lip of the dry dock. Lands on the deck of the hull.|

Postcard views: 4. First pick for the tier A set of 10: P1.

|#|Stand at|Frame|Tier|
|---|---|---|---|
|P1|(2800, 120)|The four cranes in a row at sunset, from the south quay|B|
|P2|(2350, -664)|The beach-ball tanks from Commerce Way|B|
|P3|(3150, 124)|The cruise ship from the breakwater light|C|
|P4|(2130, -1160)|The crusher with its lid coming down|B|

## 10. Checks

1. `map.districtAt` returns `rustwater` at (2900, -300), (2500, 100), (2200, -1200) and (1810, -1590).
2. There are 4 cranes, at z = -450, -350, -250 and -150. Each top is at 70 m. Nothing else in the district is over 52 m.
3. No crane part is below 14 m between x = 2921 and x = 2943, so Breakwater Road is clear under all four.
4. There are 9 tanks at the listed centres, and no two neighbours share a colour.
5. Containers use exactly six colours, and every street light in the district is `#ff9a3c`.
6. `map.isLand` is false at (3050, -300) and (2500, 150), and true at (3000, -300) and (2500, 120). The road name at (2212, -1400) is Keel Street. Counts: 10 flamingos, 5 ramps, 4 postcards, 40 sign strings.

## New names

- **Streets:** Cleat, Davit, Rudder, Scupper and Transom Streets, Gunwale Road, Fairlead Road (ship parts).
- **The Undertow:** the crew that brings drugs into the city and sells them. Tier B. `guard` is the tier B kind the Mallard Greens file uses.
- **Port Bayhaven:** the port's name on its gate.
- ***Slack Tide*** and ***Early Supper:*** the container ship and the cruise ship.
- **The port railway:** one track and a rail yard on the unused z = -277 line.
- **Breakwater light:** a small harbour light on a rock mole.
- **Tyre Hill:** a mound of used tyres in Scrap Mile.
- **Harbour tower:** the port's control tower.
- **The Bilge Pump:** a dockers' café by the union hall.
- **Local 315:** the union's number, after the 15:15 storm.
