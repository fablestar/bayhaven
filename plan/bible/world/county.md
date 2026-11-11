# Bible · world · Marlin County

The seven zones of the ring round the city, from canon section 3. With them the world is 12.8 × 9.6 km. Each zone is one zone file that the streamer loads like any district; each is built after release, one at a time. Nothing here is needed for chapter 1.

Tier: D. Every road, landmark, job, vehicle use and sign in this file is tier D.

## How to read this file

- Coordinates are seeds `(x, z)`. Control points are `(x,z)` pairs for a Catmull-Rom spline. Parts are width×depth×height in metres.
- County roads are two lanes, 10 m wide, 80 km/h, unless a line says otherwise. Dirt tracks are 6 m.
- Zones reuse city kits by id: `gl-` from the Glades, `ng-` from Northgate, `ky-` from the Keys.
- One gap in the canon: the strip `[-6400, -3200] × [400, 1280]` belongs to no zone. Treat it as open water and stream it with The Reef.
- Nothing in the county is taller than 90 m.

## 1. Driftwood

Bounds `[-6400, -3200] × [-3520, 1280]`: the town, its beach, and the shallows south to the Reef.

**Layout.** A sleepy beach town down the coast, and behind it 12 km² of pine scrub and trailer villages. The shore runs along `z = 200`, with the beach from `z` 140 to 220. The town is a grid of 80 m blocks, six by four, from `x` -5140 to -4660 and `z` -120 to 200, centred on `(-4900, 40)`. Lazy Inlet, 60 m wide, runs north from the sea along `x = -4560` to a lagoon at `(-4500, -600)`, cutting the town off from the city. Streets are named for retirement: Bingo Boulevard, Matinee Street, Decaf Drive, Nap Street. Buildings are two floors at most, in the faded pastel tints of Northgate: `ng-house` 40%, `ng-motel` 30%, `ng-strip` 30%. Everything shuts at 19:00 except the pain clinic on Decaf Drive: a queue from 07:00, plates from four counties, a guard with a shotgun on the door. Inland are three trailer villages, each 24 `gl-trailer` homes in a ring round one shuffleboard court: Golden Tide Village `(-3900, -1500)`, Sunset Shallows `(-5600, -900)` and Seventh Inning Estates `(-5000, -2400)`.

**Roads.**
- Coast Road, from the west end of the Bayline Expressway: (-3200,-1480) (-3600,-1300) (-4000,-900) (-4300,-400) (-4480,-60) (-4560,40) (-4660,40). In town it is Bingo Boulevard, straight on `z = 40` to (-5140,40), then west: (-5600,60) (-6100,120) (-6400,150).
- The Long Way, a dirt detour round the lagoon: (-4480,-60) (-4380,-500) (-4500,-800) (-4700,-700) (-4720,-300) (-4660,-80) (-4660,40). It is 2 km long.
- The boardwalk: timber, 8 m wide, straight on `z = 215` from `x = -5140` to `-4660`.

**Landmarks.**
- The drawbridge, `driftwood-drawbridge`, `(-4560, 40)`. It has been up for years. Parts: two towers 4×4×9 `#f7f3ea`, one with a control cabin 3×3×3 and a "Back soon" card in the window; two leaves 26×10×1, each raised 30°, tips 15 m apart and 13 m above the water; warning arms; a queue of six parked cars with their bonnets up. At night two red lamps blink in turn.
- The Shuffle Inn, `shuffle-inn`, `(-5000, 120)`. Sixteen shuffleboard courts 12×2 `#8fe3cf` in two rows; a clubhouse 14×8×4; a chalk scoreboard 4×2; eight floodlights that switch off at 20:00 sharp.
- Early Bird Row, `early-bird-row`, `(-4820, 40)`. Three diners 20×10×4 side by side: The Early Bird, The Earlier Bird, The Earliest Bird. One shared neon clock 5 m across, stopped at 16:30.
- The bandstand, `driftwood-bandstand`, `(-4900, 215)`. An 8-sided platform of radius 5 with a cone roof on eight posts, on the boardwalk. Twelve benches face it. A pier 80×6 runs south from it.

**The player.** Jump the drawbridge: the leaves are a ramp, and it is the only quick way in. Play shuffleboard for cash against people who do not lose. Rob the clinic's Friday cash run. Run the 16:00 dinner rush for Pelican Eats, when the whole town orders at once. Race Coots down the boardwalk.

**Traffic and people.** coot 5, tarpon 3, ibis 2, gallinule 2, birdie 2, manatee 1 (a tour bus), all at 0.6 of the limit. People: retiree 8, tourist 1. After 19:00 the count drops to a tenth.

**Signs.**
```text
Welcome to Driftwood. Please be quiet about it.
Bridge up. Back soon.
Pain clinic: cash only. No cameras. No refills, Gary.
```

## 2. Citrus Flats

Bounds `[-6400, -800] × [-6400, -3520]`.

**Layout.** Flat farmland. East of `x = -4400` it is orange groves: blocks 400 m square, trees in rows 8 m apart (an instanced green ball of radius 2 on a stick, dotted `#ffa02e`), divided by sand tracks `#f2ddb0`. Every block has one wind machine, a 12 m pole with a two-blade fan, and one irrigation rig, a wheeled pipe 200 m long crawling across the rows at 1 km/h. West of `x = -4400` it is pasture `#6a8f4e` with instanced cattle, 30 to a field, behind wire fences. A `gl-stand` with a pyramid of 55 oranges sits on Grove Road every 800 m. Tangelo, population 1,204, is one street at `(-3600, -4900)`. The sky is biggest here: no trees over 5 m, and the orange tower shows from 3 km. Three stills hide in the grove blocks, and their owners shoot at dust clouds.

**Roads.**
- Grove Road, from Route 44 through the North Glades: (700,-3900) (0,-3950) (-800,-4000) (-1600,-4300) (-2600,-4700) (-3600,-4900) (-4600,-5000) (-5600,-5200) (-6400,-5300).
- Peel Road, south from Tangelo to Driftwood: (-3600,-4900) (-3700,-4200) (-3900,-3520) (-4200,-2400) (-4300,-400).
- Only Street: Grove Road through Tangelo, from `x = -3750` to `-3450`, with the county's one traffic light. It blinks amber.
- Grove tracks: dirt, on a 400 m grid, east of `x = -4400`.

**Landmarks.**
- The orange water tower, `orange-tower`, `(-3600, -4960)`, 40 m. Six legs 0.8×0.8×22 `#6f6a78`; a 12-sided ball of radius 8 `#ffa02e` with "Tangelo" round it; a stalk 1×1×2 and a leaf 4×2×0.3 `#3d6b4a` on top. Lit from below at night, with a red lamp on the stalk.
- Only Street, `tangelo`, `(-3600, -4900)`. Fourteen false-front shops 10×12×6 in faded tints, seven a side: a feed store, a diner called The Rind, a bank, a barber, a post office. A welcome board 4×2 with the population on a hook.
- The juice plant, `juice-plant`, `(-2600, -4760)`. A tin shed 80×40×12; four silver silos of radius 6, 18 m high; a conveyor 30×2 on legs; a sign of a glass with a straw, 8 m, reading "Squeeze Play". Hogfish trucks leave it loaded with loose oranges. On the night shift one tanker in ten has a second tank, and it is not juice.
- The Last Orange, `last-orange`, `(-1500, -4270)`. A fruit stand inside half an orange: a dome of radius 6 `#ffa02e`, cut face to the road, with a counter in the cut.

**The player.** Haul a Hogfish of loose oranges to the plant without spilling them. Herd cattle off Grove Road with the horn; Bus Driver Voice moves the whole herd. Rally a Sandshark or a Cicada through the grove tracks. Dust the groves in a Sandhill from the lost airstrip, low enough to rattle the wind machines. Enter the Tangelo tractor pull on a Tortoise: drag a sled of orange crates 60 m down Only Street.

**Traffic and people.** mullet 5, osprey 3, tortoise 2, hogfish 2, cicada 1, possum 1. People: retiree 2, dock worker 2 (as farmhands), and nobody at all between towns.

**Signs.**
```text
Tangelo. Population 1,204.
The Last Orange for 40 km. It is not. Buy one anyway.
Trespassers: the dog is friendly. I am not.
```

## 3. Lake Minnow

Bounds `[-800, 2400] × [-6400, -4400]`.

**Layout.** One wide shallow lake where Route 44 ends. The lake is an ellipse centred on `(900, -5500)` with radii 1,200 and 700, 2 m deep, tea-brown `#5a4a32`, with reed beds on its west side and three wooded islands of radius 60 to 90: Near Island `(1000, -5350)`, Far Island `(1500, -5750)` and Other Island `(400, -5600)`. Fish camps of `gl-shack` cabins ring the shore every 300 m. The town, Minnow Landing, is at the south shore at `(700, -4760)`. The Big Mouth Open is fished every Saturday from 06:00. The weigh-in is at 15:00 and is rained off at 15:15. Half the winning fish have lead in them.

**Roads.**
- Route 44: straight on `x = 700` from (700,-4400) to (700,-4760).
- Shore Road, a loop round the lake: (900,-4670) (1840,-4915) (2230,-5500) (1840,-6085) (900,-6330) (-40,-6085) (-430,-5500) (-40,-4915), closed.
- Boat lanes: buoys from Minnow Landing to each island and to the Big Bobber.

**Landmarks.**
- Mermaid Cove, `mermaid-cove`, `(-150, -4850)`. A round spring of radius 25, clear water `#7fd6e8`, 6 m deep; a sunken theatre, a box 20×6×3 with a glass wall below the waterline and a stair down; a sign of a mermaid 12 m tall whose neon tail flaps; a ticket hut shaped like a clam, two half domes of radius 3. Shows at 11:00, 14:00 and 16:00: three swimmers with tails loop past the glass.
- The Barge Inn, `barge-inn`, starts at `(900, -5100)`. A floating tiki bar: a raft 16×16 on drums under a `ky-tiki` roof, with a ring of tyres as fenders. It drifts round a circle of radius 400 centred on the lake's middle, one lap an in-game day, so its blip moves and no shore can license it. The card room under the deck has never been raided.
- Minnow Landing, `minnow-landing`, `(700, -4760)`. Twenty `gl-shack` cabins; three pontoons 40×3; a bait shop; a weigh-in stage 12×6×1 with a scale 3 m tall, a leaderboard 6×4 and a banner reading "The Big Mouth Open".
- The Big Bobber, `big-bobber`, `(1500, -5300)`. A fishing float 10 m across standing in the water: a 12-sided ball, top half `#ff5a5a`, bottom half `#ffffff`, with a 6 m stick. It bobs 0.5 m.

**The player.** Fish the Big Mouth Open from a Minnow: the pier fishing game with a weigh-in and a prize. Find the Barge Inn and deliver its ice before it melts, or its card money before it is missed. Stand in for a mermaid when one calls in sick: swim Teo through five hoops behind the glass before his air runs out. Race Skipjacks round the three islands. Land a Cormorant seaplane on the lake and taxi it to the Landing.

**Traffic and people.** Roads: mullet 4 (half tow a boat), osprey 2, hermit 2, tarpon 1. Water: minnow 4, skipjack 3, swan 2, gatorback 1. People: retiree 3, tourist 3, and anglers standing in the lake up to the knee. On Saturdays double the boats.

**Signs.**
```text
Boat ramp: launch it or move it, asshole
Mermaid Cove: real mermaids, real spring, no refunds
The Barge Inn: last seen heading east
```

## 4. North Glades

Bounds `[-800, 6400] × [-4400, -3520]` and `[2400, 6400] × [-6400, -4400]`.

**Layout.** The Glades again, deeper and with nobody in them. Use the Mudcat Glades terrain classes with marsh at 70% and channels at 18%. Cypress domes are twice as common and reach 30 m. Swamp fog is twice as likely as in the city and lasts until 10:00. There are no lights except at the camp. There is one road and one ruin.

**Roads.**
- Route 44 crosses on a bank: straight on `x = 700` from (700,-3520) to (700,-4400).
- Mudhen Road, 10 m, gravel: (700,-3800) (1500,-3850) (2400,-3900) (3200,-4100) (3800,-4600) (3800,-4700).
- Airstrip track, dirt, half of it under water: (3800,-4700) (4400,-5000) (5000,-5300) (5200,-5400).
- The monorail beam, not a road but it can be ridden: (-800,-3560) (0,-3700) (700,-3760) (1600,-3800) (2600,-4000) (3600,-4300) (4200,-4500). West of `x = -800` it runs on to the Castaway Kingdom gate in Mudcat Glades.

**Landmarks.**
- Camp Mudhen, `camp-mudhen`, `(3800, -4700)`. The county work farm, a fenced yard 200×160: four tin dormitories 30×10×4; a mess hall 24×12×5; a water tower 14 m; a watchtower 4×4×10 with a guard asleep in a chair; twelve rows of vegetables; a Manatee bus in Sheriff's teal and white. Its inmates wear teal stripes, appear on *Bayhaven Blue: Live* on Tuesdays and are rented by the day to Bellweather's sites. The warden keeps the difference.
- The lost airstrip, `lost-airstrip`, `(5200, -5400)`. A cracked strip 600×20 running north-east, its far end under 0.4 m of water; a tin hangar 20×16×6 with a Sandhill under a sheet; oil drums; a stump of a windsock pole. It is not on the map until the player finds it. It is a working smugglers' strip: two men with rifles, a fuel bowser, a plane most nights at 03:00.
- The monorail line, `monorail-line`. Pylons 2×2×9 `#c8ccd2` every 40 m carrying a beam 1.5×1.5, broken in five places with gaps of 8 to 20 m. One train of four cars 8×2.5×2.5 `#8fe3cf` is stalled at `(1600, -3800)`; another hangs by one end at `(2600, -4000)`. The line ends at Car Park Z, `(4200, -4500)`: 400×300 of cracked asphalt, row signs A to Z, and one Spoonbill still parked in row Z.
- The fallen booster, `fallen-booster`, `(5600, -4100)`. An Upward rocket stage, a cylinder of radius 2 and 30 m long, lying at 20° and half sunk, with a board: "Property of Upward. Please return."

**The player.** Ride the monorail beam on a Cicada or a Needlefish from Car Park Z to the gate: 6 km, five jumps, no rails. Find the airstrip, shoot it out with its keepers and take the Sandhill. Enter the Mudhen 500, a race on Cricket mowers round the vegetable rows on Sundays. Run the Deep Loop, a 9 km airboat time trial with no markers but the pylons. Tow the booster out for Upward.

**Traffic and people.** Route 44: mullet 3, hogfish 2, hermit 1. Mudhen Road: the Sheriff's bus at 07:00 and 17:00, one mullet an hour. Channels: gatorback 1. People: none outside the camp. Alligators at 20 per km of channel.

**Signs.**
```text
Camp Mudhen: guests of the county
Castaway Kingdom parking: remember where you parked. Row Z.
Property of Upward. Please return.
```

## 5. Cape Calamity

Bounds `[3200, 6400] × [-3520, -400]`.

**Layout.** West to east: a mainland strip of scrub to `x = 3900`; Calamity Sound, a lagoon 1 m deep, to `x = 4600`; the barrier island, 1 km wide, to `x = 5600`; then open water. The island runs from `z = -3400` to `z = -500`. It is sand, scrub and Upward's launch site. A rocket goes up on Saturday at 14:00. Five Saturdays in six it does not. The exclusion zone is the water east of the island from `z = -2100` to `-900`, out to `x = 6400`, marked by yellow buoys. The east beach has fenced turtle nests every 150 m. Upward's security is forty contractors with rifles and a Hammerhead of their own.

**Roads.**
- Countdown Causeway, from the end of Runway Road: (3050,-2600) (3900,-2600) (4600,-2600). Ten boards along it count down from 10 to 1.
- Scrub Road, the island's spine: (5000,-3300) (5050,-2600) (5000,-1900) (5050,-1200) (4800,-600) (4700,-480), ending at the ferry landing.
- The crawlerway, 40 m of gravel in two strips, from the shed to the pad: (5000,-2300) (5150,-1900) (5300,-1500).

**Landmarks.**
- The pad, `launch-pad`, `(5300, -1500)`, mast 90 m. An 8-sided concrete mound of radius 40, 6 m high; a flame channel 60×12; a lattice service tower 8×8×70 `#6f6a78` with three swing arms and a lift cage; a mast 2×2×90; a water tower, a ball of radius 7 on 30 m legs. The rocket, the Optimist: a cylinder of radius 2.2, 52 m tall, `#ffffff`, a nose cone `#ff8f7a`, two boosters of radius 1.2 and 30 m, and Upward's mark, an arrow pointing up. At night it is floodlit, the brightest white thing in the county.
- The assembly shed, `assembly-shed`, `(5000, -2300)`. A white box 80×60×70 with one door 20×60 and the arrow 30 m tall on its side.
- The countdown clock, `countdown-clock`, `(4700, -1500)`. Bleachers 60×10×6 facing east over the Sound; a seven-segment clock 16×4 on legs, stuck at T-00:09 except on a launch day; four souvenir stalls.
- The Scrub Club, `scrub-club`, `(4800, -620)`. An arched tin hut 20×10×5 by the ferry landing with a rocket fin for a sign. One mission patch on the wall for every scrub: 300 instanced squares.

**The player.** Watch a launch. On a scrub every station groans; on a launch the screen shakes from here to Tideline, a white column climbs, and a booster comes back to the barge in East Bay. Cause a scrub by taking a boat into the exclusion zone east of the pad: heat 3 at once, and live fire. Ride the lift to 70 m. Drag race on the crawlerway on weekdays. Run a Sandshark down the east beach without touching a nest. Use a launch as cover, as chapter 2 does.

**Traffic and people.** Weekdays: pompano 3, egret 2, mullet 2, hogfish 1. Saturday from 10:00: tarpon 6, grouper 4, hermit 3, manatee 2 and two news vans, all parked on the causeway by 13:30. People: tourists with folding chairs, and office workers in white coats.

**Signs.**
```text
Upward: it's in the name
T-minus 9 and holding since Saturday
Exclusion zone: live fire. We bill the next of kin.
```

## 6. The Reef

Bounds `[-6400, 6400] × [1280, 3200]`.

**Layout.** Open water, 6 to 20 m deep. The reef itself is a band of shallows 200 m wide along `z = 2000` from `x = -4000` to `4000`, 0.8 m deep, pale `#7fd6e8` over sand. Snowbirds and anything bigger must use one of three buoyed cuts 80 m wide: West Cut at `x = -2400`, Middle Cut at `x = 300`, East Cut at `x = 2600`. Buoys are drums of radius 0.6 on a 2 m stalk, a lamp blinking every 4 s. Five sandbars stand 0.3 m dry, each about 200×40: `(300, 1700)`, `(-1600, 1800)`, `(1900, 1750)`, `(-3300, 2200)`, `(3700, 2300)`.

**Lanes.** There are no roads. The main channel is buoyed, red to the west and green to the east: (600,1280) (500,1700) (300,2000) (900,2400) (2200,2750).

**Landmarks.**
- The Rig, `the-rig`, `(2200, 2750)`, 66 m. An old platform turned nightclub. Four legs of radius 2 standing 20 m out of the water; a deck 50×50 at +20 and a second 40×40 at +26, `#6f6a78` and `#ffc300`; a lattice derrick 8×8×40 wrapped in pink, cyan and violet neon; a crane arm 30 m with a mirror ball of radius 2; a helideck of radius 10 hung off one corner; a boat landing with a lift cage; a boom that fires confetti at midnight. It plays Glitterball 107 and sits 20 m past the Sheriff's line: card tables on the lower deck, anything you can pay for on the upper. From Tideline beach it is a pink dot on the horizon.
- Tern Rock Light, `tern-rock-light`, `(-4200, 2500)`, 26 m. A rock 30×20×6 `#6f6a78`; a tower of radius 3, 20 m, white with one navy band; a glass lantern. One beam, a turn every 15 s, out of step with the light on Last Key.
- Three wrecks, `wrecks`. The Second Mortgage, a Snowbird hull heeled 30° on the reef at `(-900, 2050)`, mast still up. The Lazy Mackerel, a Shrimper sunk to its wheelhouse on the bar at `(1900, 1750)`, covered in pelicans. The Unsinkable II, a freighter 60 m long, bow up at 40°, at `(-2600, 2900)`, with two containers afloat beside it.
- The party bar, `party-bar`, the sandbar at `(300, 1700)`. After the Sunday boat parade thirty boats raft up here. Six umbrellas, a volleyball net 9 m wide, a grill.

**The player.** Race Skipjacks through all three cuts. Clean the reef for Dr. Okoro, by boat. Dive on the wrecks with Old Man Fitch's map; one holds his one real find. Take a Skimmer out to the Rig after 22:00. Run a load through East Cut at night with no lights, ahead of the Hammerhead. Chapter 3 ends on the Rig in a storm.

**Traffic and people.** skipjack 4, skimmer 3, snowbird 2, shrimper 2, minnow 1, hammerhead 1. From 22:00 to 03:00 add skipjack 6 on the main channel. The King Tide lies at anchor 300 m west of the Rig. People: only on the bars, the wrecks and the Rig; 80 clubbers on its decks at night.

**Signs.**
```text
Middle Cut: keep the green on your good side
The Rig: no law past this buoy
Tern Rock: landing is a matter of opinion
```

## 7. East Bay

Bounds `[3200, 6400] × [-400, 1280]`.

**Layout.** Deep water, 20 m, off the port. Two things cross it: the shipping lane to the container berth and the ferry to Cape Calamity. North of the lane is the anchorage, a box from `x` 5000 to 6200 and `z` -350 to 150, where ships wait for a berth for days and crews from the Keys board them at night to shop the containers. The watch is paid to sleep. The water is darker than the city's bay, `#2e4a6b`, with a slow 0.6 m swell. Lane buoys are green on the north side and red on the south, each with a lamp.

**Lanes.**
- The shipping lane, 400 m wide, buoyed in pairs every 300 m: (3200,-300) (3800,-100) (4600,300) (5600,800) (6400,1100). One freighter comes in every three in-game hours at 12 km/h and one goes out. They do not stop or steer for anybody.
- The ferry route, from the Bay Ferry terminal in Rustwater: (2300,150) (2700,420) (3300,470) (3900,380) (4350,60) (4650,-330) (4700,-480). It crosses the shipping lane once, near `(4150, 200)`, and waits there for any freighter.

**Landmarks.**
- The anchorage, `anchorage`. Six freighters on a grid at `x` 5200, 5600, 6000 and `z` -250, 50. Each: a hull 180×28×14, 8 m above water, in `#b5532f` or `#2e4a6b`; containers four high in the six Rustwater colours; a white bridge block 20×28×20 at the stern; a funnel; an anchor chain; a pilot ladder. Names on the sterns: Patient Whale, Slow Thursday, Long Weekend, Humble Barnacle, Late Lunch, No Rush. At night each shows a white lamp at bow and stern and amber deck lights.
- The Bay Ferry, `bay-ferry`. A hull 50×16×6 `#fdf6ea` with a teal band; two car decks for 24 cars; a wheelhouse at each end; a Shell Yeah kiosk; a horn two octaves below a bus. The crossing takes 14 real minutes. Cars drive on and off, and the player can walk about.
- The sea buoy, `sea-buoy`, `(6200, 1050)`. A red bell buoy 9 m tall at the seaward end of the lane: a drum of radius 2.5, a lattice cage, a lamp. It tolls with the swell.
- The booster barge, `booster-barge`, `(5600, 900)`. Upward's landing barge, 60×30, a painted X, a scorched ring, and the name Close Enough on its side.

**The player.** Ride the ferry to the Cape, or drive off it early. Climb a pilot ladder at night, crack a container and get the goods off before the watch wakes up armed. Work as the pilot boat: hold a Skipjack against a moving freighter's ladder for 5 s. Slalom the anchorage on a Skimmer, in and out of six anchor chains. On a launch Saturday, tow the booster that missed back to the barge.

**Traffic and people.** freighters as above, bay ferry 1, shrimper 2, skipjack 2, snowbird 1, hammerhead 1. People: a crew of 6 dock workers on each anchored ship, 20 passengers on the ferry.

**Signs.**
```text
Bay Ferry: Cape Calamity, 14 minutes, weather and freighters permitting
Customs dock: gifts welcome
Close Enough
```

## Checks

1. Every seed and control point in a zone's section lies inside that zone, except roads said to start in a neighbouring zone or the city.
2. The seven zones and the city cover `[-6400, 6400] × [-6400, 3200]` except the strip named at the top.
3. Every item in the county's content files is tagged tier D.
4. No mesh in the county is taller than 90 m.
5. Grove Road, Coast Road, Countdown Causeway and Route 44 each join a city road end within 25 m: `(700, -3520)`, `(-3200, -1480)` by way of the expressway, and `(3050, -2600)`.
6. Tangelo's welcome board reads 1,204.

## New names

- Driftwood: Coast Road, the Long Way, Lazy Inlet, Bingo Boulevard, Matinee Street, Decaf Drive, Nap Street, the Shuffle Inn, Early Bird Row (The Early Bird, The Earlier Bird, The Earliest Bird); villages Golden Tide Village, Sunset Shallows, Seventh Inning Estates.
- Citrus Flats: Grove Road, Peel Road, Only Street, The Rind, The Last Orange.
- Lake Minnow: Minnow Landing, Shore Road, The Barge Inn, the Big Bobber, The Big Mouth Open; Near Island, Far Island, Other Island.
- North Glades: Mudhen Road, Car Park Z, the Mudhen 500, the Deep Loop.
- Cape Calamity: Calamity Sound, Countdown Causeway, Scrub Road, the Optimist (Upward's rocket), the Scrub Club.
- The Reef: West Cut, Middle Cut, East Cut, Tern Rock Light, the party bar; wrecks Second Mortgage, Lazy Mackerel, Unsinkable II.
- East Bay: freighters Patient Whale, Slow Thursday, Long Weekend, Humble Barnacle, Late Lunch, No Rush; the barge Close Enough.
