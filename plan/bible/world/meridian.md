# Bible · world · Meridian

Meridian is downtown: a 1.6 by 1.1 km grid of glass and pastel-concrete towers behind the beach, with Coral Boulevard running up its middle to the Meridian Spire. It is the skyline the whole map is seen against, and the Spire is the story's last location. Below: the grid, the tower kit, each landmark as a parts list, street life, sound, signs and things to find.

Tier: A for the grid, the five tower recipes, street life and the canon A landmarks. Everything else carries its own tag.

Bounds `[-800, 800] × [-1440, -320]`. Sizes are width (x) × depth (z) × height in metres; footprints are width × depth. Every `(x, z)` is a seed. Hour bands: dawn 05:00 to 08:00, day 08:00 to 17:00, golden 17:00 to 21:00, night 21:00 to 05:00.

## 1. Feel

Cool, tall and tidy. Pale glass and white concrete stand on podiums with plazas, planters and flags. At street level it is lobbies, coffee and people walking fast, with an armed guard behind every glass door. One tower is coral, and everyone uses it to give directions. The money is clean by the time it gets here, and City Hall is cheaper than it looks. At dusk the towers light floor by floor. Once the offices empty, the plazas belong to guards, cleaners and whoever is selling in the park. From the beach, looking up Coral Boulevard, the Spire closes the view.

Any screenshot of Meridian must show:

1. A tower too tall for the frame.
2. A window grid: sky in it by day, lit squares by night.
3. Something small at its foot: a plaza, a full crossing, a palm.

## 2. Neighbourhoods

The grid is the shared one: streets every 80 m and 14 m wide, avenues 22 m, Coral Boulevard 30 m. A block is 66 × 66 m, or 62 m on a side that faces an avenue, and 58 m beside the boulevard. Its outer 4 m is sidewalk.

Height rule: tower floors are 3.8 m and podium floors 4.5 m. The tallest kit tower is 55 floors (209 m). With crowns and masts, nothing but the Spire passes 220 m.

### The kit

|id|Recipe|Footprint|Floors|Walls|Roof|Street level|Tier|
|---|---|---|---|---|---|---|---|
|M1|Slab|24×50|20 to 45|`#b8cfe0` `#e0e0e6` `#c4b8e0`|flat `#6f6a78`, a 3 m plant box|6 m glass lobby, revolving door, one shop a side|A|
|M2|Stepped|44×44 at the base|25 to 55|`#e0e0e6` `#d9b8c4` `#e6d3b8`|setbacks of 6 m at 40%, 70% and 90% of the height, a white neon crown|5 m colonnade with bank and café fronts|A|
|M3|Twin|two shafts 20×28, 12 m apart, on a 3-floor podium 58×34|18 to 40|`#b8cfe0` `#b8e0d3`|flat; a mast on the taller shaft|podium shops with awnings|A|
|M4|Curved corner|36×36, one corner rounded at radius 12 in 6 segments|16 to 36|`#e0e0e6` `#b8cfe0`|flat with a drum|corner door under a 4 m canopy, a clock|A|
|M5|Podium with a plaza|tower 30×30 on a 58×58 lot, half of it open plaza|30 to 55|`#e0e0e6` `#c4b8e0`|flat; a helipad disc on one in five|planters, benches, flagpoles, one box sculpture|A|
|M6|Old mid-rise|20×30|6 to 14, floor 3.4|`#e6d3b8` `#d9b8c4` `#e8c0b0`|water tank, masts and dishes|bar or newsstand, awning, fire stairs|B|
|M7|Civic block|50×40|4 to 8, floor 4.2|`#f7f3ea` `#e0e0e6`|flat, flagpole|eight square columns 1.2×9, wide steps|B|
|M8|Bayfront hotel|50×24|14 to 24, floor 3.4|`#f7f3ea`, balconies `#b8cfe0`|pool deck and roof sign|canopy, valet stand, Bay Cab bay|B|
|M9|Parking tower|30×58|6 to 9 levels of 3.0|`#e0e0e6`|open top deck|helix ramp, barrier arm|B|

Until a B recipe is built, its share goes to M1 at the same height.

### Block recipes

|Neighbourhood|Bounds|Lots|Recipes, share of lots|Heights|Parking|Per 100 m of street|
|---|---|---|---|---|---|---|
|Bayfront|z -600 to -320|58×58 or 29×58|M8 35%, M4 25%, M1 20%, M7 10%, M9 10%|50 to 100 m|M9 towers and hotel forecourts|6 palms, 5 lamps, 3 benches, 2 planters, 1 flag row|
|The Exchange|x -300 to 500, z -1100 to -600|58×58|M2 30%, M5 30%, M1 20%, M3 15%, M4 5%|120 to 220 m|basement ramp mouths, 6 m wide, on one block face in four|4 trees in grates, 6 lamps, 2 bollard rows, 1 kiosk, 1 bike rack|
|Radio Row|x -800 to -300, z -1100 to -600|20×30 to 29×58|M6 55%, M1 15%, M4 15%, M7 10%, M9 5%|22 to 60 m, two towers to 110 m|kerbside on both sides|5 trees, 5 lamps, 3 newspaper boxes, 2 café tables, 1 phone box|
|Uptown|z -1440 to -1100|58×58|M7 35%, M6 25%, M1 20%, M5 10%, M9 10%|16 to 120 m|40-bay lots behind civic blocks|6 trees, 5 lamps, 4 benches, 2 flagpoles, 1 bus shelter|

The canon gives no neighbourhood to x 500 to 800, z -1100 to -600. Build it with The Exchange's recipe capped at 120 m, and report it as The Exchange.

## 3. Streets

- **Coral Boulevard** is 30 m (x 37 to 67): three lanes each way and a 4 m median with a palm every 16 m. It ends at Spire Circle.
- **Spire Plaza** closes Seventh Street between Plaza Street and Poinciana Street, and the x = 52 line between Sixth Street and Tower Way.
- Other closed pieces: Gumbo-Limbo Street from Flamingo Avenue to Second Street and First Street from Egret Avenue to Cypress Street (Bayfront Park); Cypress Street from Second to Third Street (City Hall); Allspice Street from Tenth Street to Union Avenue and Eleventh Street from Tamarind to Pigeon Plum Street (The Shell).
- Every avenue crossing has lights on a 30 s cycle. No kerb parking on avenues or the boulevard.

### Canon roads

|Line|Name|Notes|
|---|---|---|
|x = 52|Coral Boulevard|boulevard, z -837 to -320|
|x = -52|Plaza Street| |
|x = -372|Egret Avenue|avenue|
|x = 372|Sandbar Avenue|avenue|
|x = -692|Founders Avenue|avenue|
|x = 692|Exchange Avenue|avenue; becomes Route 44 at the expressway ramp|
|z = -357|Flamingo Avenue|avenue|
|z = -437, -517, -597|First, Second, Third Street| |
|z = -677|Commerce Way|avenue|
|z = -757, -837, -917|Fifth, Sixth, Seventh Street| |
|z = -997|Tower Way|avenue; the Spire's service dock|
|z = -1077, -1157, -1237|Ninth, Tenth, Eleventh Street| |
|z = -1317|Union Avenue|avenue|
|z = -1397|Thirteenth Street| |

### New names: trees

Six are the canon's (Banyan, Cypress, Gumbo-Limbo, Mahogany, Poinciana, Sea Almond). All run from Flamingo Avenue to Thirteenth Street.

|Line|Name|Line|Name|
|---|---|---|---|
|x = -772|Buttonwood Street|x = 132|Poinciana Street|
|x = -612|Mahogany Street|x = 212|Jacaranda Street|
|x = -532|Sapodilla Street|x = 292|Sea Almond Street|
|x = -452|Banyan Street|x = 452|Tamarind Street|
|x = -292|Gumbo-Limbo Street|x = 532|Allspice Street|
|x = -212|Cypress Street|x = 612|Pigeon Plum Street|
|x = -132|Satinleaf Street|x = 772|Ironwood Street|
|x = 52, north of Tower Way|Kapok Street| | |

## 4. Landmarks

|Landmark|id|Seed|Footprint|Height|Tier|
|---|---|---|---|---|---|
|The Meridian Spire|`spire`|(52, -900)|podium 60×60, plaza 170×138|260 m|A|
|Spire Circle|`spire-circle`|(52, -837)|radius 30|palms 9 m|A|
|City Hall and fountain|`cityhall`|(-200, -560)|146×66|38 m|A|
|Bayfront Park|`bayfront-park`|(-300, -450)|142×142|8 m|B|
|The Twin Sails|`twinsails`|(430, -760)|two of 36×30|168 and 148 m|B|
|Bayhaven Public Radio|`public-radio`|(-420, -840)|34×30|64 m|B|
|Central Bus Terminal|`bus-terminal`|(-100, -1280)|66×62|16 m|C|
|The Shell|`the-shell`|(500, -1300)|146×142|34 m|C|
|Baylink loop|`baylink`|six stations, below|3.4 km of beam|9 m|C|
|First Bayhaven Savings|`savings-tower`|(96, -636)|36×36|184 m|B|
|The Groundbreaking|`golden-shovel`|(52, -838)|4×4|7 m|B|
|The Bayhaven Tide building|`tide-building`|(-572, -720)|40×30|52 m|B|
|Level Nine|`level-nine`|(330, -557)|30×58|27 m|B|
|Marlin County Courthouse|`courthouse`|(-414, -1197)|50×40|30 m|C|
|The Exchange Hall|`exchange-hall`|(252, -877)|40×30|22 m|C|

### The Meridian Spire
- Silhouette: a twisting taper with a light at the top, at the end of Coral Boulevard.
- Parts: plaza x -45 to 125, z -986 to -848, paving `#e0e0e6`, 24 palms. Podium 60×60×12 `#e0e0e6`. Shaft: 22 boxes, each 10 m tall, from 40×40 at 12 m to 16×16 at 232 m, each turned 4 degrees more than the one below, glass `#b8cfe0`, a band `#2e4a6b` at every joint. Penthouse 14×14×12 `#fdf6ea` holding the vault, beside a roof garden 16×16 at 232 m. Lantern 8×8×8 at 244 m, then a mast to 260 m. Service dock, a ramp mouth 12×6 into the basement, on Tower Way at (52, -980). Scaffold on the north face from 12 to 28 m. A cleaning cradle 4×1.5×2 on a rail up the north face from 28 to 232 m.
- Night: every joint band white, 30% of windows lit, a beacon `#ff3fa4` pulsing every 2 s. Six Bellweather guards with rifles on the plaza and the podium roof (B).
- Use: The Spire Job: the bus to the dock, Teo up the scaffold and the cradle, the vault, the cradle down. Dry Run's photos (B). The lobby stays locked until then, and the guards give one warning before they fire.

### Spire Circle
- Silhouette: a ring of palms where the boulevard stops.
- Parts: a roundabout of three lanes, outer radius 30. Island of radius 14, lawn `#3fb86a`, eight palms. Exits: Coral Boulevard south, Sixth Street east and west. North is the plaza steps, 40×6×1.5, no cars.
- Night: white street light, uplit palms.
- Use: Bay Cab rank on the east side. A drift score (B).

### City Hall and fountain
- Silhouette: a white colonnade under a small dome, with a jet of water in front.
- Parts: merged lot x -285 to -139, z -590 to -524. Hall 70×30×16 `#f7f3ea` on the north side. Twelve columns 1.2×12 across the south face, steps 40×6×2, a drum 14 across and an 8-sided dome to 38 m, a flagpole. Fountain at (-212, -540): basin of radius 8 `#7fd6e8`, a 6 m jet. A podium 2×1×1.2 with a banner for the mayor.
- Night: columns uplit warm, the basin cyan.
- Use: driving into the basin lifts the car, as a hydrant does. Mayor Bunny Castellano speaks here at 12:30. On the second floor the planning counter shuts at 15:00 and reopens for envelopes.

### Bayfront Park
- Silhouette: the one gap in the wall of towers.
- Parts: merged lot x -361 to -219, z -510 to -368, lawn `#3fb86a`. Two diagonal paths 4 m wide `#f2ddb0`. Bandstand, 8 sides, radius 6, 8 m, at (-290, -439). Pond 30×16 at (-320, -480). Forty trees, sixteen benches.
- Night: a lamp every 20 m along the paths. From midnight an Undertow seller and a lookout work the bandstand.
- Use: a short cut by car (grass grip 0.75). The lunch crowd from 12:00 to 13:30.

### The Twin Sails
- Silhouette: two leaning slabs, like sails on one boat, joined by a bridge.
- Parts: north tower at (414, -797), south tower at (414, -720), one each side of Fifth Street. Each is a stack of 10 m boxes 36 wide, depth shrinking from 30 at the base to 10 at the top, each box 1.2 m east of the one below. North: 16 boxes and an 8 m fin, 168 m. South: 14 boxes and a fin, 148 m. `#e0e0e6`, with glass `#b8cfe0` on the west faces. Skybridge 8×62×5 at 90 m over the street.
- Night: a cyan strip up each leaning edge, a warm bridge.
- Use: Dew Point is on the bridge, door at the south tower. A photo job for Zoom Ziegler (B).

### Bayhaven Public Radio
- Silhouette: an old mid-rise under a lattice mast with a red light.
- Parts: an M6 building 34×30×34 `#e6d3b8`, 9 floors, x -437 to -403, z -874 to -844, facing Sixth Street. Mast 4×4×30 in `#ff5a5a` and white bands, to 64 m. A box sign ON AIR over the door. A street-level studio window with Barbara's desk and microphone, and two taped bullet holes in the glass.
- Night: red beacon, red ON AIR, three lit floors.
- Use: The Binder ends at the door (B). A doorway speaker plays the station's news about you.

### Central Bus Terminal
- Silhouette: a long flat canopy and a clock.
- Parts: block x -125 to -59, z -1306 to -1244. Concourse 60×20×8 `#f7f3ea`. Canopy 60×30×0.6 on 12 posts over eight bays. Clock tower 4×4×16. A departure board that always reads Delayed.
- Night: white canopy lights. After 23:00 muggers work the benches in pairs.
- Use: Manatee spawn. Routes 1 and 15 call here; Route 9 does not. Bus rides between stops (C).

### The Shell
- Silhouette: a scallop shell lying on its back.
- Parts: merged lot x 459 to 605, z -1306 to -1164. Nine tapered ribs fan from a hinge at (532, -1180) to a scalloped edge 120 m wide along Union Avenue. The roof is 12 m at the hinge and 34 m at the edge. Ribs `#f7f3ea`, panels `#ff9eb5`. Ticket windows and a screen 30×10 at the seed.
- Night: ribs uplit pink, the screen showing tonight's act.
- Use: shows and a car-park derby (C). Ramp R5.

### Baylink loop
- Silhouette: a thin white beam above the sidewalks.
- Parts: one beam 1.2×1.5 at 9 m on pylons 1×1×9 every 40 m, `#e0e0e6`. Corners in order: (-452, -517), (452, -517), (452, -1317), (132, -1317), (132, -997), (-452, -997). Stations, each a platform 30×4 with a stair box: Spire (90, -997), Radio Row (-452, -840), City Hall (-180, -517), Bayfront (212, -517), Exchange (452, -760), The Shell (452, -1290). Two trains of three cars, 24×3×3, `#f7f3ea` with a pink stripe, 14 m/s, 20 s stops.
- Night: lit train windows, a cyan strip under the beam.
- Use: rides between stations. Teo can run along the beam.

### First Bayhaven Savings
- Silhouette: the one coral tower, with a red line up its front. People call it the Thermometer.
- Parts: an M4 tower 36×36×184 `#ff8f7a`, 46 floors, its round corner on Coral Boulevard. On the west face, a strip 3 m wide of 40 lamp boxes that fills from the bottom through the day and is full at 15:00. A bulb box 8×2×8 at its foot. A bank front with a Clam Secure bay and two guards with shotguns.
- Night: the strip glows `#ff5a5a` at the level it reached.
- Use: at tier A the generator only paints this lot's tower coral. The strip is tier B.

### The Groundbreaking
- Silhouette: a golden shovel stuck in a lawn.
- Parts: on the Spire Circle island. Blade 2×0.3×2.4 and shaft 0.4×0.4×5, both `#ffc300`. A plaque: Bayhaven Tomorrow starts here.
- Night: one spotlight.
- Use: a breakable prop. Knock it flat and it is back the next morning.

### The Bayhaven Tide building
- Silhouette: a dusty-pink block wearing a belt of moving words.
- Parts: an M6 building 40×30×52 `#d9b8c4`, 13 floors. A ticker band 1.5 m high wraps it at 12 m and scrolls the latest Local Man headline. A roof sign and a drone pad 6×6.
- Night: the ticker in `#ffa02e`.
- Use: Zoom Ziegler's Exclusive chain starts on the roof, by a stair door on the street.

### Level Nine
- Silhouette: a white parking tower with a spiral at one end.
- Parts: an M9 tower 30×58×27 `#e0e0e6`, nine levels, a helix ramp of radius 9 at the north end, 20 bays on the open roof.
- Night: cold white strips on every level.
- Use: the day 4 drop's stage stands on the roof. Parked on any level with the engine off counts as a garage for heat. Level 4 is where cars change hands and plates. Ramp R3.

### Marlin County Courthouse
- Silhouette: wide steps, eight columns, a flat triangle on top.
- Parts: an M7 block 50×40×24 `#f7f3ea`. Steps 30×10×4 on the south side. A pediment as one tapered box. Two billboards face it: Lawyer Larry and Attorney Annie.
- Night: columns uplit.
- Use: the steps are a stair jump. Larry's serving-papers jobs start here (B).

### The Exchange Hall
- Silhouette: a low columned hall among the towers, with a board of numbers on its face.
- Parts: hall 40×30×22 `#e6d3b8`, six columns. A board 24×8 on the south face lists Heat index, Humidity and Chance of storm, each with an arrow. All the arrows point up.
- Night: the board in `#5dff9b` and `#ff5a5a`.
- Use: the board shows the game's real forecast. A bell rings at 15:15.

## 5. Places of use

Shops listed in `04-systems.md` are tier A. A door goes on a kit building until its landmark is built.

|Place|Kind|Seed|Tier|
|---|---|---|---|
|Maison Sable|expensive clothes|(24, -636)|A|
|Second Wind Thrift|clothes|(-560, -880)|A|
|Storm Mart|life vest, flares, noodles|(650, -478)|A|
|Birdbath Car Wash|car wash|(650, -1270)|A|
|Shell Yeah stand|food|(-170, -535)|A|
|Bean There|food|(-90, -636)|B|
|Bun Voyage|food|(252, -1197)|B|
|Sandbar Market|food|(400, -557)|B|
|Pill Bill's|health|(-640, -478)|B|
|Dew Point|bar: drinks|(424, -745)|B|
|Feels Like 104|bar: drinks|(-490, -797)|B|
|Level Nine|public garage|(330, -557)|B|
|Bay Cab ranks, 3|taxi job|(86, -837), (-150, -520), (-92, -1240)|A|
|Bus stops, 7|Route 1 on Coral Boulevard at Bayfront (52, -517), Commerce Way (52, -677), Spire Circle (52, -820) and Radio Row (-372, -840); Route 4 on Commerce Way at x = -372 and 692; Route 44 at Union Avenue (692, -1317)|(52, -517)|B|
|Spire service dock|The Spire Job|(52, -980)|A|
|Dry Run photo spots, 3|mission|(52, -780), (-60, -900), (140, -960)|B|
|Public radio door|The Binder|(-420, -842)|B|
|Tide building roof|Zoom Ziegler, Exclusive|(-572, -720)|B|
|Day 4 drop stage|Level Nine's roof, or any M9 roof|(330, -557)|A|

## 6. Street life

Traffic weights by vehicle id. `taxi` is the Bay Cab version of `tarpon`. An id that is not built yet gives its weight to `tarpon`.

|id|dawn|day|golden|night|
|---|---|---|---|---|
|tarpon|4|4|4|2|
|taxi|2|3|4|4|
|pompano|3|2|1|0|
|hogfish|3|1|0|1|
|snook|1|2|2|1|
|grouper|1|2|2|1|
|pinfish|1|2|2|1|
|manatee|1|1|1|1|
|heron|1|1|1|1|
|gallinule|0|1|2|1|
|sturgeon|0|1|1|1|
|sailfin|0|0|1|2|

People weights, and how much of the people cap is in use. `courier` and `guard` are tier B kinds; until then a courier is an office worker and guards are left out. A guard is armed, stands at a lobby door and shoots back.

|kind|dawn|day|golden|night|
|---|---|---|---|---|
|office worker|3|5|4|0|
|courier|1|1|1|0|
|tourist|0|2|3|1|
|jogger|3|0|1|0|
|retiree|1|1|0|0|
|clubber|0|0|1|3|
|guard|1|2|2|3|
|cap in use|40%|100%|110%|25%|

At 08:00 and 17:30 the crowd at avenue crossings is 1.5 times larger. From 12:00 to 13:30, six people in ten are in a plaza or Bayfront Park.

Ambient vignettes (tier B):

|#|Where|When|What you see|
|---|---|---|---|
|1|(52, -800)|08:55|Forty office workers wait at one crossing. They step off together. One drops a stack of paper.|
|2|(96, -670)|10:00|Tourists photograph the Thermometer. It goes up one notch. They groan.|
|3|(-212, -545)|12:30|The mayor tells three gulls she will clean up City Hall. Behind her, two men carry boxes of files to a shredder van.|
|4|(-290, -420)|13:00|A yoga class on the lawn. A shot goes off uptown. Nobody breaks the pose.|
|5|(37, -690)|17:30|At the Commerce Way light a courier on a Pinfish takes an envelope through a Gallinule's window. He is gone on green.|
|6|(-420, -842)|18:00|A man outside the radio building holds a sign: Barbara, read my fucking letter.|
|7|(-490, -790)|23:00|A fight spills out of Feels Like 104 onto Sixth Street. Half of it is reporters. The other half film it.|
|8|(300, -700)|03:00|A cleaning cradle hangs halfway up a dark tower, light on. In one lit office, someone is feeding a shredder.|

After dark (tier B):

|Where|Who runs it|What happens|
|---|---|---|
|Spire Plaza and every Bellweather lobby|Bellweather security, under Chad and Brad|Rifles on the plaza from 20:00. Deputies wave their cars through.|
|City Hall, second floor|whoever paid last|Permits, inspections and dropped charges, by envelope.|
|Bayfront Park bandstand|the Undertow|One seller and one lookout from midnight to 04:00. Office workers buy on Friday.|
|Uptown, round the bus terminal|nobody|Robbers in pairs after 23:00. Alone here, you get a pistol in the ribs.|
|Coral Boulevard|Clam Secure|Two guards with shotguns on every cash truck. They do not warn.|

Parked cars:

- Streets fill to 30% by day and 10% at night. Avenues and the boulevard hold only bus bays and taxi ranks.
- The Exchange: one parked car in five is a `gallinule` or a `sturgeon`.
- Radio Row: two news vans each outside the public radio building and the Tide building.
- Uptown: two Sheriff Tarpons outside the courthouse.
- At dawn, one `hogfish` every 300 m is double-parked with its hazard lights on.
- From 20:00 a Bellweather `grouper` idles at each corner of Spire Plaza.

## 7. Sound bed

|Layer|Plays|Tier|
|---|---|---|
|City hum: low-passed noise, 80 to 200 Hz|always; 6 dB lower at night|A|
|Crossing beeps: 1 kHz ticks, faster on the walk light|06:00 to 24:00 within 40 m of an avenue crossing|A|
|Distant sirens: a far 600 to 1,200 Hz sweep, panned|one every 90 to 240 s|A|
|Footsteps and chatter|08:00 to 19:00, scaled by the people within 20 m|B|
|Fountain: a bright hiss|always within 60 m of City Hall|B|
|Tower wind: a slow whistle|above 20 m: roofs and the Spire's cradle|B|
|Air units: a steady 120 Hz drone|within 15 m of a podium|B|
|Guard radios: a squelch and a short voice blip|within 10 m of a lobby guard|B|
|Far shots: two cracks and a pause|23:00 to 04:00 in Uptown, a few times a night|B|
|Baylink: a rising whoosh and a two-note chime|when a train passes|C|

## 8. Signs

Signs with canon names are tier A. Signs with new names are tier B. The neon sign atlas draws in capitals, as day 1 does.

Shop, tower and roof signs:

```text
Meridian Spire
Bellweather Group
First Bayhaven Savings
Iguana Insurance
Maison Sable
Bean There
Dew Point
Feels Like 104
The Bayhaven Tide
Bayhaven Public Radio
On Air
Baylink
Sandbar Market
Pill Bill's
Bun Voyage
Wing It
Second Wind Thrift
Storm Mart
Birdbath Car Wash
Bay Cab
Central Bus Terminal
The Shell
Clam Secure
Dent-A-Car
Manatee Mattress
Level Nine Parking
Marlin County Courthouse
City Hall
```

Billboards and notices:

```text
Bayhaven Tomorrow: Now Leasing The Sky
Re-elect Mayor Bunny Castellano. Still Campaigning.
Lawyer Larry. Hurt? Flirt With A Lawsuit. 555-0144
Attorney Annie. Better Than Larry. 555-0155
City Hall Closed For Lunch, 11 To 3
Observation Deck Closed To Observers
Bellweather Security: One Warning. You Just Had It.
The Shell Tonight: To Be Announced
Route 15: Delayed
```

Bumper stickers:

```text
My Other Office Is Also On The 40th Floor
The Light Is Green, Dickhead
I'd Rather Be At The Beach. It Is Four Blocks Away.
```

## 9. Things to find

Flamingos: 10, all tier B. First picks for the tier A set of 40: F1 to F4.

|#|Seed|Tier|Why here|
|---|---|---|---|
|F1|(46, -837)|B|On the Spire Circle island. You drive round it every day.|
|F2|(-212, -540)|B|In the City Hall fountain, getting wet.|
|F3|(52, -500)|B|On the boulevard median, between two palms.|
|F4|(40, -975)|B|Beside the Spire's service dock, for players who scout early.|
|F5|(-290, -439)|B|On the bandstand in Bayfront Park.|
|F6|(330, -540)|B|On the roof of Level Nine, in bay 20.|
|F7|(414, -735)|B|On the podium roof of the south Sail. Climb the awning.|
|F8|(-420, -859)|B|Under the radio mast, up the roof stair.|
|F9|(-572, -716)|B|On the Tide building's drone pad.|
|F10|(676, -1430)|B|By the expressway sign on Exchange Avenue, where traffic backs up.|

Big Air ramps: 5. First pick for the tier A set of 15: R1, then R2.

|#|Seed|Heading|Tier|What it is|
|---|---|---|---|---|
|R1|(52, -470)|north|B|A road-works ramp on the boulevard median. Clears a bus.|
|R2|(0, -997)|east|B|A car transporter with its ramps down on Tower Way. Clears the queue at the service dock.|
|R3|(330, -586)|north|B|A tow bed left on Level Nine's roof. Lands on Third Street, 27 m down.|
|R4|(-300, -390)|east|B|A grass bank in Bayfront Park. Clears the pond path.|
|R5|(520, -1250)|north|C|Up a rib of The Shell and off its edge, over Union Avenue.|

Postcard views: 4. First pick for the tier A set of 10: P1.

|#|Stand at|Frame|Tier|
|---|---|---|---|
|P1|(52, -400)|The Spire up the palm median, looking north|B|
|P2|(-212, -520)|The City Hall dome through the fountain jet|B|
|P3|(380, -700)|The Twin Sails from below, bridge overhead|B|
|P4|(330, -560)|The skyline and the Thermometer from Level Nine's roof at sunset|B|

## 10. Checks

1. `map.districtAt` returns `meridian` at (52, -900), (-200, -560), (0, -330) and (790, -1430).
2. The top of `spire` is at 260 m. No other mesh in the district is above 220 m.
3. No lot overlaps x 37 to 67 between z = -807 and z = -320, so the Spire is in clear view from (52, -330).
4. Exactly one tower uses `#ff8f7a`: the one on the lot at (96, -636).
5. The Exchange has at least 12 towers of 150 m or more. Radio Row has none above 110 m.
6. All 15 tree-street lines have a name: the road name at (132, -700) is Poinciana Street and at (52, -1100) is Kapok Street. Counts: 10 flamingos, 5 ramps, 4 postcards, 40 sign strings, 6 Baylink stations.

## New names

- **Streets:** Buttonwood, Sapodilla, Satinleaf, Jacaranda, Tamarind, Allspice, Pigeon Plum, Ironwood and Kapok Streets (trees).
- **Spire Plaza:** the paved blocks round the Spire that the canon describes without naming.
- **The Thermometer:** the street name for the First Bayhaven Savings tower, the district's one coral tower.
- **The Groundbreaking:** a golden shovel sculpture on the Spire Circle island.
- **The Bayhaven Tide building:** the newspaper's office in Radio Row.
- **Level Nine:** a nine-level parking tower in Bayfront.
- **Marlin County Courthouse:** the courts the canon places in Uptown.
- **The Exchange Hall:** a hall with a weather board, in The Exchange.
- **Birdbath Car Wash:** the car wash chain, as in `bible/catalog/shops.md`.
- **The Undertow:** the crew that brings drugs into the city and sells them. Tier B. `guard` is the tier B kind the Mallard Greens file uses.
- **Baylink station names:** the canon's six, placed at the seeds in section 4.
