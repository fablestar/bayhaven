# Bible · world · The Paintworks

The Paintworks is the arts and nightlife district: a square kilometre of brick and metal warehouses east of downtown, painted edge to edge, round a shut paint factory with three chimneys. By day it is artists and vans. By night it is clubs, queues and fast cars. Below: the grid, the building kit, each landmark as a parts list, street life, sound, signs and things to find.

Tier: A for the grid, the kit recipes marked A, street life and the paint factory. Everything else carries its own tag.

Bounds `[800, 1800] × [-1280, -320]`. Sizes are width (x) × depth (z) × height in metres; footprints are width × depth. Every `(x, z)` is a seed. Hour bands: dawn 05:00 to 08:00, day 08:00 to 17:00, golden 17:00 to 21:00, night 21:00 to 05:00.

## 1. Feel

Rough walls, loud paint. Every warehouse here has become a wall for somebody: birds, fish, waves, suns and hands in every colour, over brick and corrugated metal. The streets are wide and half empty by day, with a van, a ladder and a person looking at a wall. After dark the same streets fill with queues, bass and beams of violet and mint light from the roofs, and Seventh Street turns into one long row of doors with a man in a jacket on each. What is sold behind those doors comes from the Undertow. The three chimneys show from anywhere, with paint running down them, and the factory under them is not as shut as it looks.

Any screenshot of The Paintworks must show:

1. A mural that covers a whole wall.
2. Bare brick `#a8553a` or metal `#7d8590` somewhere beside it.
3. One of: a chimney, a stacked container, a roof light beam.

## 2. Neighbourhoods

The grid is the shared one: streets every 80 m and 14 m wide, avenues 22 m. A block is 66 × 66 m, or 62 m on a side that faces an avenue. Its outer 4 m is sidewalk.

Height rule: warehouse floors are 5.0 m and loft floors 4.2 m. No kit building passes 26 m.

### The kit

|id|Recipe|Footprint|Floors|Walls|Roof|Street level|Tier|
|---|---|---|---|---|---|---|---|
|W1|Brick warehouse|30×40|2 to 3, floor 5.0|brick `#a8553a`, a mural on one or two walls|three to five sawteeth, or flat `#6f6a78`|steel windows 3×2 in a grid, a loading door 4×4.5, a steel stair, bins|A|
|W2|Metal shed|24×36|1, eave at 8 m|metal `#7d8590`, a mural on one long wall|low gable with three vents|a sliding door 6×5, a stack of pallets|A|
|W3|Loft conversion|24×30|4 to 5, floor 4.2|brick `#a8553a`; the top floor is a glass box `#b8cfe0`|a deck with a water tank and a bulb string|a gallery or café glass front, zigzag fire stairs|B|
|W4|Container bar|two to six containers 12.2×2.6×2.6, stacked 2 or 3 high|none|violet `#b46bff`, mint `#5dff9b`, pink `#ff3fa4`, cyan `#29e6ff`, orange `#ffa02e`, at 80% brightness|a railed deck on the top container|one side folded down as a bar counter, stools, a neon arrow|A|
|W5|Rooftop club|30×30|3, floor 5.0|metal `#7d8590` under a full mural|a terrace with a truss 20×12×5 and eight moving lights|a door with a rope line, a poster wall|A|
|W6|Gallery box|12×18|1 to 2, floor 4.5|brick painted `#f7f3ea`, or a mural|flat|a full glass front, one object on a plinth, a sandwich board|B|
|W7|Yard|30×30 open lot, 2.4 m mesh fence|none|none|none|box sculptures, a kiln and pallets, or 20 parking bays|B|

Every W1, W2 and W5 gets at least one mural wall, drawn from the lot's seed in the pastel and neon sets. Until a B recipe is built, its share goes to W1.

### Block recipes

|Neighbourhood|Bounds|Lots|Recipes, share of lots|Parking|Per 100 m of street|
|---|---|---|---|---|---|
|The Lofts|z -1280 to -1020|29×29|W3 45%, W1 25%, W6 10%, W5 10%, W7 10%|yards; kerbs 30% full|3 trees in barrel planters, 4 lamps, 6 parked bicycles, 2 skips, 1 food cart|
|Wet Paint Alley|x 800 to 1180, z -1020 to -320|12×18 to 30×40|W6 35%, W1 25%, W3 20%, W2 10%, W7 10%|kerbs only; none on the alley|2 trees, 4 lamps, 3 ladders, 2 paint-pot clusters, 4 poster frames|
|Factory Yard|x 1180 to 1800, z -1020 to -660|30×58|W1 35%, W2 35%, W5 15%, W7 15%|yards of 20 bays|2 trees, 5 lamps, 4 pallets, 3 barrels, 2 parked Fiddlers, 1 skip|
|Container Row|x 1180 to 1800, z -660 to -320|30×30 yards, and 24×36|W4 clusters 40%, W2 25%, W7 20%, W1 15%|kerbs: 30% by day, 70% at night|2 palms in tubs, 6 bulb strings, 4 cable-drum tables, 6 stools, 2 neon arrows|

The club run (tier B): on Seventh Street from Pigment Avenue to Carmine Street, every lot that faces the street is a W5 club or a W4 cluster, door to door, with a neon sign over each door and a rope line on the sidewalk.

## 3. Streets

- The bounds stop at z = -1280, 37 m short of Union Avenue. `02-world.md` gives the strip from there to the expressway to no district, so nothing in this file is placed in it.
- The canon calls Gantry Avenue the line with Rustwater, but the bound is x = 1800. The 148 m east of the avenue is still this district.
- **Wet Paint Alley** is the x = 1092 line from Commerce Way to First Street: 222 m with no cars, and bollards at both ends and at the Second and Third Street crossings. North and south of it the same line is Cobalt Street.
- The factory's merged lot closes Umber Street from Fifth to Seventh Street, and Sixth Street from Vermilion Street to Pigment Avenue.

### Canon roads

|Line|Name|Notes|
|---|---|---|
|x = 1012|Factory Avenue|avenue|
|x = 1332|Pigment Avenue|avenue|
|x = 1652|Gantry Avenue|avenue|
|z = -357|Flamingo Avenue|avenue|
|z = -437, -517, -597|First, Second, Third Street| |
|z = -677|Commerce Way|avenue|
|z = -757, -837, -917|Fifth, Sixth, Seventh Street| |
|z = -997|Tower Way|avenue|
|z = -1077, -1157, -1237|Ninth, Tenth, Eleventh Street| |
|x = 1092, z -666 to -444|Wet Paint Alley|on foot only|

### New names: pigments

Six are the canon's (Cobalt, Ochre, Vermilion, Umber, Viridian, Cadmium). All run from Flamingo Avenue to Eleventh Street.

|Line|Name|Line|Name|
|---|---|---|---|
|x = 852|Madder Street|x = 1412|Viridian Street|
|x = 932|Ochre Street|x = 1492|Cadmium Street|
|x = 1092|Cobalt Street|x = 1572|Indigo Street|
|x = 1172|Vermilion Street|x = 1732|Carmine Street|
|x = 1252|Umber Street| | |

## 4. Landmarks

|Landmark|id|Seed|Footprint|Height|Tier|
|---|---|---|---|---|---|
|The paint factory|`paint-factory`|(1300, -800)|142×146|chimneys 62, 54 and 46 m|A|
|Wet Paint Alley|`wet-paint-alley`|(1100, -600)|8×222|walls 6 m, gates 9 m|B|
|Humidity|`humidity`|(1450, -950)|50×44|14 m, light rig to 20 m|B|
|Food-truck yard|`food-truck-yard`|(1000, -1100)|62×66|bulb poles 6 m|B|
|Container Row|`container-row`|(1500, -500)|66×66|stacks 7.8 m, sign 12 m|C|
|June's loft|`junes-loft`|(1180, -1180)|24×30|21 m|C|
|The Spray Can|`spray-can`|(1610, -1117)|10×10|28 m|B|
|The Big Brush|`big-brush`|(1110, -700)|4×10|16 m|B|
|The Paint Chart|`paint-chart`|(1350, -720)|a wall 60 m long|20 m|B|
|Blank Canvas|`blank-canvas`|(970, -557)|22×22|14 m|C|
|Palette Park|`palette-park`|(1612, -720)|40×30|2 m|C|

### The paint factory
- Silhouette: three tall chimneys with paint running down them.
- Parts: merged lot x 1179 to 1321, z -910 to -764. Main hall 70×50×16 brick `#a8553a` centred on (1272, -802), with a six-tooth sawtooth roof and steel windows. Three chimneys, each an 8-sided column of radius 2.2, at (1200, -885), (1222, -885) and (1244, -885): 62 m tipped pink `#ff3fa4`, 54 m tipped cyan `#29e6ff`, 46 m tipped mint `#5dff9b`. On each, the top 12 m is solid colour, and six drips 0.5 m wide run 4 to 14 m further down the brick. Four pigment vats, 8-sided, radius 3, height 8, in violet, orange, pink and cyan, every 20 m from (1200, -850) to (1260, -850). A loading dock 30×8×1.2 on Pigment Avenue. A ladder up the tallest chimney to a platform at 40 m.
- Night: each chimney's colour glows at the top and fainter down the drips. One hall window is lit: from 22:00 to 05:00 the Undertow cuts and packs in the old vat room, with four men inside and two with rifles on the loading dock (B).
- Use: Teo can climb to the platform. The roof is ramp R1. Paint It Pink passes through the yard (C). Walk in at night and they shoot.

### Wet Paint Alley
- Silhouette: a narrow lane of colour under bulbs, with a gate of paint tins at each end.
- Parts: a lane 8 m wide between walls 6 m tall at x = 1088 and x = 1096, from z = -666 to z = -444. Both walls are murals from edge to edge, a new seed every 12 m. The ground is stripes 2 m wide in the six neon colours. Each gate is two posts and a beam of stacked tin boxes 1×1×1, 9 m high. Ten bulb strings. Twelve W6 gallery fronts. The bar Wet Paint is at (1100, -540), with a stage box 4×3×0.4 outside.
- Night: bulbs, and wall washers in violet and mint by turns.
- Use: on foot, though a scooter fits. Open mic on Thursday at 20:00. Tag the wrong wall and a gallery's security will break your fingers. The murals reseed each in-game week (C).

### Humidity
- Silhouette: a dark shed with beams of light swinging over its roof.
- Parts: shed 50×44×14 metal `#7d8590` under one mural of a storm cloud. A roof truss 30×20×6 with twelve moving lights: cones in violet `#b46bff` and mint `#5dff9b` that swing at the tempo of Bassline FM. A roof vent 1×1×2 that puffs steam every 20 s. A door on Seventh Street with a rope line 20 m long and four door staff with pistols under their jackets. A sign whose number reads between 94% and 100%.
- Night: lights from 21:00 to 04:00. By day only the mural.
- Use: drinks, and a dance floor you only hear. Full on Friday. Sellers work the queue and the house takes its cut. About once a week somebody is shot outside, and the queue does not lose its place. The beams show from the expressway.

### Food-truck yard
- Silhouette: a ring of vans under bulbs.
- Parts: the block x 939 to 1001, z -1150 to -1084, gravel `#e2c998`. Eight bays in a horseshoe, each with a `pompano` food truck: Pressed, Bun Voyage, Wing It, Shell Yeah, Scoop Dreams, Fry Tide, Rain Bowl, Brine Time. Twelve picnic tables 2×1.6×0.8. Eight 6 m poles carry bulb strings. A chalkboard at the gate. A burnt patch marks where a ninth truck used to park.
- Night: bulbs, and a light in each open hatch.
- Use: food. Priya Raman's Lunch Rush chain starts at Pressed (C). One truck is the food truck business.

### Container Row
- Silhouette: a block of bright boxes stacked like bricks.
- Parts: the block x 1499 to 1565, z -510 to -444. Twenty-four containers 12.2×2.6×2.6 in the five W4 colours, stacked 2 and 3 high round a court 30×24, joined by steel stairs and gangways 1.2 m wide. Six are bars with a side folded down, among them Heat Index and Sea Can. The sign is one container stood on end, 12 m, lettered down its side.
- Night: neon arrows, bulb strings, coloured light out of every open side.
- Use: the cheapest drinks in the city, and a bottle fight most nights around 02:00. The gangways are a roof run for Teo. Ramp R3.

### June's loft
- Silhouette: a brick block with a lit glass floor on top.
- Parts: a W3 building 24×30×21, x 1181 to 1205, z -1197 to -1167. Four brick floors and a glass top floor with a ring light in the window. A neon sign LIVE in `#ff3fa4` on the parapet. Zigzag fire stairs on the east wall.
- Night: the glass floor glows cyan. LIVE is lit when June is in.
- Use: June's missions start at the street door. Teo can climb the fire stairs.

### The Spray Can
- Silhouette: an old water tower repainted as a giant spray can.
- Parts: an 8-sided drum of radius 5 and height 14 `#ff3fa4` with a label band `#f7f3ea`, on six legs 0.6×0.6×12. A cap 6×6×1 and a nozzle 1.5×1.5×1, both `#f7f3ea`. A ladder up one leg.
- Night: a slow-turning cone of violet light from the nozzle, as if it were spraying the sky.
- Use: Teo can climb to the cap. Postcard P4.

### The Big Brush
- Silhouette: a paintbrush three floors tall, leaning on a wall.
- Parts: a handle 2×2×16 `#ffa02e` leaning at 60 degrees on the south wall of a W1 warehouse. A ferrule 2.4×2.4×2 `#7d8590`. Bristles 3×3×3 `#3b3946` tipped pink. A pink puddle 8×6 on the sidewalk and a streak down the wall.
- Night: one pink spotlight.
- Use: the handle is ramp R2. It marks the alley's north gate.

### The Paint Chart
- Silhouette: a wall of coloured squares, like a paint chart.
- Parts: the west wall of a W1 warehouse on Pigment Avenue, 60 m long and 20 m tall: 48 squares of 5×5 in 12 columns and 4 rows, each a different colour, each with a small name plate. Four of the names: Sunburn, Low Tide, Mildew, Gerald.
- Night: squares light at random, like a level meter, in time with Bassline FM.
- Use: stand at the square that matches your shirt for followers (C).

### Blank Canvas
- Silhouette: the only white box in the district.
- Parts: a cube 22×22×14 `#f7f3ea` with no mural and no windows, one door, and a sign that reads Do not paint. Each morning one small scribble appears on it. At 12:00 a box figure paints over it.
- Night: lit plain white.
- Use: Teo can tag it for followers and heat 1 (C).

### Palette Park
- Silhouette: a lawn shaped like a painter's palette with six blobs of colour.
- Parts: a kidney-shaped lawn 40×30 `#3fb86a`. The thumb hole is a round pond of radius 3. Six 8-sided domes of radius 2.5 and height 2 in the six neon colours.
- Night: each blob glows from inside.
- Use: a person or vehicle that lands on a blob bounces 3 m.

## 5. Places of use

Shops, properties and businesses listed in `04-systems.md` are tier A. A door goes on a kit building until its landmark is built.

|Place|Kind|Seed|Tier|
|---|---|---|---|
|Paintworks loft|property, $90,000, 2 slots|(1430, -1117)|A|
|Food truck|business, $45,000, pays $700 a day|(1000, -1100)|A|
|Second Wind Thrift|clothes|(892, -720)|A|
|Bay Cab rank|taxi job, busiest 22:00 to 04:00|(1450, -917)|A|
|Wet Paint|bar: drinks, open mic|(1100, -540)|B|
|Humidity|club: drinks|(1450, -950)|B|
|Heat Lightning|rooftop club on a W5 lot|(1700, -880)|B|
|Bean There|food|(1050, -478)|B|
|Pelican Fuel|petrol|(1700, -400)|B|
|June's street door|June: Yacht Rock by phone (A), Glow Up (B), Paint It Pink (C)|(1180, -1180)|B|
|Bus stop, 1|Route 4 at the Paint Factory, on Commerce Way|(1332, -677)|B|
|Pressed|Priya Raman, Lunch Rush|(985, -1100)|C|
|Paint It Pink billboards, 5|mission|(850, -400), (1200, -660), (1500, -700), (1700, -1000), (1050, -1200)|C|

## 6. Street life

Traffic weights by vehicle id. `taxi` is the Bay Cab version of `tarpon`. An id that is not built yet gives its weight to `tarpon`.

|id|dawn|day|golden|night|
|---|---|---|---|---|
|pompano|4|3|1|1|
|hogfish|3|2|0|0|
|mullet|2|2|1|1|
|tarpon|2|2|2|2|
|pinfish|1|3|2|1|
|snook|1|2|2|1|
|taxi|0|1|3|5|
|sailfin|0|0|2|4|
|wahoo|0|1|2|3|
|tern|0|1|2|2|
|needlefish|0|1|1|2|
|bonito|0|0|1|2|

People weights, and how much of the people cap is in use. `artist`, `photographer` and `guard` are tier B kinds; until then the first two are tourists and guards are left out. Here a guard is door staff: armed, at a club door, and quick to shoot back.

|kind|dawn|day|golden|night|
|---|---|---|---|---|
|artist|1|4|2|0|
|photographer|0|3|3|0|
|tourist|0|3|3|1|
|skater|0|2|2|1|
|office worker|2|1|1|0|
|jogger|2|0|1|0|
|clubber|0|0|3|8|
|guard|0|0|1|2|
|cap in use|25%|80%|110%|130%|

On Friday night the clubber weight doubles. On Thursday at 20:00 thirty extra people stand at Wet Paint.

Ambient vignettes (tier B):

|#|Where|When|What you see|
|---|---|---|---|
|1|(1200, -880)|07:00|The tallest chimney gives one pink puff. The factory shut years ago. Nobody looks up, and nobody asks what the night shift makes.|
|2|(1092, -560)|10:00|Two artists paint one wall from opposite ends. They meet in the middle and stare.|
|3|(985, -1100)|12:15|Fourteen people queue at Pressed. Nobody queues at the next truck. Its owner watches, holding a tyre iron.|
|4|(1348, -720)|16:30|An influencer poses at the Paint Chart square that matches her jacket, moves along three and changes jacket.|
|5|(1510, -440)|18:00|A photographer backs up to frame a mural and into a row of Sanderlings. They go down one by one.|
|6|(1100, -540)|Thursday 20:00|Open mic. A man reads a poem called Fuck The Spire. Twelve people clap, none of them on the beat.|
|7|(1450, -917)|Friday 23:00|The Humidity queue wraps the block. A seller works down it like a waiter while the door staff study the sky.|
|8|(1500, -917)|02:30|Clubbers sit on the kerb with trays of chips. Two men fight over a taxi across the road. Nobody puts their chips down.|

After dark (tier B):

|Where|Who runs it|What happens|
|---|---|---|
|The club run, Seventh Street|the Undertow, through the door staff|Sellers work every queue from 21:00 to 04:00 and each house takes a cut. Door staff carry pistols and settle things themselves.|
|The paint factory|the Undertow|The night shift cuts and packs. Nobody on Pigment Avenue has ever seen a thing.|
|Container Row|whoever is biggest that night|Cheap drinks, bottle fights, and about one stabbing a month.|
|Tower Way, behind Humidity|robbers|Clubbers walking back to their cars are held up at gunpoint. Park under a light.|
|The Lofts|a private patrol in a `grouper`|Quiet. The patrol shoots at anyone on a fire escape after dark, Teo included.|
|Wet Paint Alley|the gallery owners|Safe. The worst thing here is the art.|

Parked cars:

- Kerbs fill to 30% by day. From 21:00 they fill to 70% in Factory Yard and Container Row, and one car in three is a `sailfin`, `wahoo` or `bonito`.
- By day, one parked vehicle in three is a `pompano` with its back doors open and a ladder on the roof.
- The Lofts: six bicycles or Sanderlings per 100 m, in heaps, as props.
- Yards hold 20 bays each. Nothing parks on the alley.
- On the club run, one parked car in ten has someone sitting in it with the engine off.

## 7. Sound bed

|Layer|Plays|Tier|
|---|---|---|
|Bass through walls: a 50 to 90 Hz pulse at Bassline FM's tempo|21:00 to 04:00 within 80 m of a club; 6 dB louder on Friday|A|
|Spray cans: a hiss of 0.3 to 1.2 s, then a rattle of clicks|09:00 to 18:00 near the alley and any wall being painted|A|
|Distant saw: band-passed noise in bursts of 2 to 5 s|09:00 to 17:00, from Factory Yard|A|
|Door burst: the bass opens to full range for 1 s|whenever a club door opens|B|
|Queue murmur: voice blips|21:00 to 03:00 beside rope lines|B|
|Sizzle and an extractor hum|11:00 to 15:00 and 18:00 to 23:00 at the food-truck yard|B|
|Bottle bin: one long crash of glass noise|03:00, once behind each club|B|
|Skate clatter: wheel roll and a board slap|10:00 to 22:00 in The Lofts|B|
|Far shots: two cracks from the club run, then the bass again|23:00 to 04:00, a few nights a week|B|

## 8. Signs

Signs with canon names are tier A. Signs with new names are tier B. The neon sign atlas draws in capitals, as day 1 does.

Shop, club and truck signs:

```text
Humidity
Tonight: 94%
Wet Paint
Open Mic Thursday. Please Clap.
Pressed
Flat On Purpose
Bun Voyage
Wing It
Shell Yeah
Scoop Dreams
Fry Tide
Rain Bowl
Brine Time
Heat Lightning
Heat Index
Sea Can
Mildew Projects
Squall Space
Sunstroke Studio
Blank Canvas
Second Wind Thrift
Bean There
Pelican Fuel
Bay Cab
Live
```

Painted words and notices:

```text
Wet Paint. No, Really.
Do Not Paint
Post No Bills
Bill Was Here
Tag This Wall, Get Your Ass Kicked
Mural In Progress Since Last Year
No Dealing In The Queue. Deal Inside.
Artists Only Past This Point. Everyone Is An Artist.
Bayhaven Tomorrow: Lofts From The Low Nine Hundreds
Colour 31: Gerald
```

Bumper stickers:

```text
This Van Is A Gallery
Starving Artist On Board
I Park Where The Mural Says
My Other Ride Is A Rental Scooter
Don't Honk. I'm Hung Over.
```

## 9. Things to find

Flamingos: 10, all tier B. First picks for the tier A set of 40: F1 to F4.

|#|Seed|Tier|Why here|
|---|---|---|---|
|F1|(1312, -790)|B|On the factory's loading dock, facing Pigment Avenue.|
|F2|(1200, -874)|B|At the foot of the tallest chimney, splashed pink.|
|F3|(1430, -590)|B|Against a Third Street wall painted with nine flamingos. It is the tenth.|
|F4|(1740, -346)|B|At the last lamp post on Flamingo Avenue before the port.|
|F5|(1094, -600)|B|In Wet Paint Alley, with a brush taped to its beak.|
|F6|(1450, -950)|B|On Humidity's roof, inside the light rig.|
|F7|(990, -1117)|B|Under a picnic table at the food-truck yard.|
|F8|(1610, -1117)|B|On the cap of the Spray Can.|
|F9|(1112, -692)|B|Standing in the Big Brush's pink puddle.|
|F10|(1346, -745)|B|At the Paint Chart, in front of the square of its own colour.|

Big Air ramps: 5. First pick for the tier A set of 15: R1.

|#|Seed|Heading|Tier|What it is|
|---|---|---|---|---|
|R1|(1290, -802)|east|B|One tooth of the factory roof, reached by the dock. Lands on Pigment Avenue.|
|R2|(1110, -696)|north|B|The handle of the Big Brush. Lands on the warehouse roof, or past it.|
|R3|(1532, -450)|south|C|A container tipped on end at Container Row. Clears First Street.|
|R4|(932, -1117)|east|B|A caterer's ramp on Ochre Street. Clears the yard fence and lands between the trucks.|
|R5|(1572, -720)|east|C|A rubble pile on Indigo Street. Lands on a blob in Palette Park and bounces.|

Postcard views: 4. First pick for the tier A set of 10: P1.

|#|Stand at|Frame|Tier|
|---|---|---|---|
|P1|(1222, -984)|The three chimneys in a row, looking south from Tower Way|B|
|P2|(1092, -446)|Wet Paint Alley from its south gate, under the bulbs|B|
|P3|(1450, -1010)|Humidity's light beams at night|B|
|P4|(1650, -1117)|The Spray Can spraying the night sky|B|

## 10. Checks

1. `map.districtAt` returns `paintworks` at (1300, -800), (1100, -600), (810, -330) and (1790, -1270).
2. The three chimneys are 62, 54 and 46 m tall and stand at z = -885. Nothing else in the district is over 28 m.
3. At least 80% of kit buildings carry a mural wall, and no two murals in one chunk share a seed.
4. No lane-graph edge runs along x = 1092 between z = -666 and z = -444.
5. The food-truck yard holds 8 trucks. Container Row holds at least 24 containers in 5 colours.
6. All 9 minor north-south lines carry a pigment name: the road name at (1492, -900) is Cadmium Street. Counts: 10 flamingos, 5 ramps, 4 postcards, 40 sign strings.

## New names

- **Streets:** Madder, Indigo and Carmine Streets (pigments).
- **The Spray Can:** a water tower painted as a spray can, in The Lofts.
- **The Big Brush:** a giant paintbrush at the alley's north gate.
- **The Paint Chart:** a wall of 48 colour squares on Pigment Avenue.
- **Blank Canvas:** a gallery, and the only unpainted building.
- **Palette Park:** a small park with six bouncing blobs.
- **The Undertow:** the crew that brings drugs into the city and sells them. Tier B. `guard` is the tier B kind the Mallard Greens file uses.
- **The club run:** the row of clubs on Seventh Street.
- **Heat Lightning:** a rooftop club. **Heat Index** and **Sea Can:** container bars.
- **Fry Tide, Rain Bowl, Brine Time:** food trucks.
- **Mildew Projects, Squall Space, Sunstroke Studio:** galleries on the alley.
