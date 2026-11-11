# Bible · world · Mudcat Glades

Mudcat Glades is the swamp along the whole north edge of the map: sawgrass in ankle-deep water, cypress domes, channels for airboats and one long two-lane road with a 30 m alligator standing over it. Few people, no grid and almost no light at night. Captain Nilda lives here, and Bellweather wants it drained. Most of what reaches Bayhaven untaxed comes through these channels after dark, on boats with no lights.

Tier: A for the zone, Mudcat Road, Route 44, the terrain, the kit recipes marked A, Big Earl and Captain Nilda's dock (day 8). The rest is B or C.

## 1. Feel

Green, brown and slow. The horizon is a flat line of sawgrass broken by clumps of cypress, and the sky is two thirds of every frame. The road is a raised strip with water on both sides, so leaving it costs. Dawn is fog you cannot see 80 m through. Night is the darkest place in the game: moonlight, your headlights and thousands of fireflies. Some shacks are homes. Some are stash shacks with a man on the porch and a shotgun. You find out which by getting close.

Any screenshot must show:

1. Standing water with grass growing out of it.
2. A cypress dome, a stilt shack or a hand-painted sign.
3. No straight kerb, no street lamp and no building over one floor.

## 2. Neighbourhoods

District bounds `[-3200, 3200] × [-3520, -2700]`. The canon names no neighbourhoods here, so five areas carry the recipes. Run the tests in order. The first match wins.

| # | Area | Test | What it is |
|---|---|---|---|
| 1 | The Levee | `z > -2790` | the bank that keeps the swamp out of the suburbs, and the canal at its foot |
| 2 | West Glades | `x < -1400` | drier, pines on the hammocks, the old theme park, the dish trailer |
| 3 | Earl's Mile | `x < 300` | roadside stands, the bait shop, Big Earl |
| 4 | The Crossing | `x < 1600` | where Route 44 meets Mudcat Road; the gator farm, Nilda's dock |
| 5 | East Glades | everything else | the deepest water, the fish camp, the biggest cypress dome |

### Terrain

Lots are `free`. The ground is one of five classes, set by distance from the splines in section 3 and a seeded noise field.

| Class | Height (m) | Share | Driving |
|---|---|---|---|
| Road bank | +1.0 | 4% | normal on asphalt; dirt tracks, grip 0.7 |
| Hammock (a tree island) | +0.6 | 14% | grass, grip 0.8; trees block cars |
| Marsh | -0.4 (0.4 m of water over mud) | 62% | cars keep 40% of grip and top out at 30 km/h; the Bullfrog and Gatorback are not slowed |
| Channel and pond | -1.5 | 12% | cars stall and drift; boats only |
| Levee | +4.0 | 8% with its canal | a 6 m dirt track on the crest |

Colours: sawgrass `#6a8f4e`, hammock `#3d6b4a`, mud `#8a6f55`, water `#5a4a32`.

Plants are instanced. Sawgrass: one tuft per 1.5 m² of marsh in LOD0, a flat texture beyond. A cypress dome: 30 to 60 trunks 12 to 18 m tall in a disc of radius 40 to 70, tallest in the middle, knees 0.5 m high at the edge; one dome per 500 m of road, 80 to 300 m off it. Hammocks carry cabbage palms and, west of `x = -1400`, pines.

### Kit

Sizes are width×depth in metres. Wood `#8a6f55`, tin roofs in the Rustwater rust `#b5532f`, paint long gone.

| id | Recipe | Footprint | Floors × height | Roof | Details | Tier |
|---|---|---|---|---|---|---|
| `gl-shack` | Stilt shack | 8×6 on six posts 2 m high | 1 × 2.6 | tin gable, 25° | a porch 8×2 with steps; a Mullet or a boat on a trailer underneath. One in five is a stash shack (B): boarded windows, a padlock, a generator, an armed guard on the porch | A |
| `gl-boardwalk` | Boardwalk | 2.4 wide, any length | none | none | planks on posts 1.2 m over the water, one rail | A |
| `gl-dock` | Dock and boathouse | deck 12×3, boathouse 6×5 | 1 × 3 | tin, one slope | cleats, a fuel drum, a lantern post | B |
| `gl-trailer` | Trailer | 14×4 | 1 × 2.8 | flat | walls `#f7f3ea` with a green tide mark, an awning | B |
| `gl-stand` | Roadside stand | 6×3, open front | 1 × 2.6 | tin, one slope | a counter, a hand-painted board 3×1 | B |
| `gl-barn` | Tin barn | 16×10 | 1 × 5 | tin gable | double doors, an engine on a hoist | B |

### Block recipes

| Area | One lot per | Shares (%) | Vehicles at a lot | Per 100 m of Mudcat Road |
|---|---|---|---|---|
| West Glades | 260 m of road, alternate sides | `gl-trailer` 50, `gl-shack` 30, `gl-barn` 20 | a Mullet at 60%, a wreck at 30% | 6 pines, 1 mailbox, 1 sign per 300 m |
| Earl's Mile | 180 m | `gl-stand` 40, `gl-shack` 40, `gl-trailer` 20 | a Mullet at 60%, a boat on a trailer at 40% | 3 cabbage palms, 1 sign per 150 m |
| The Crossing | 180 m | `gl-shack` 50, `gl-barn` 25, `gl-stand` 25 | a Mullet at 70% | 3 cabbage palms, 1 reflector, 1 sign per 150 m |
| East Glades | 320 m | `gl-shack` 70, `gl-dock` 30 | a boat at every one | 1 cabbage palm, 1 reflector |
| The Levee | none | none | none | 1 marker post, 20 m of rip-rap |

Until a B recipe ships, its share goes to `gl-shack`. There is no kerb and no kerb parking in the zone.

## 3. Streets

No grid and no street names. Tracks are named by the hand-painted signs at their mouths. Fit a Catmull-Rom spline through each list of `(x,z)` control points. Widths in metres.

### Roads

| Name | Width | Control points | Tier |
|---|---|---|---|
| Mudcat Road | 8 of asphalt, a 2 m dirt shoulder each side | (-3100,-3000) (-2900,-3020) (-2600,-2985) (-2300,-3010) (-2000,-3040) (-1700,-3015) (-1400,-2990) (-1000,-3000) (-700,-2985) (-400,-2980) (-100,-2990) (300,-3005) (700,-3000) (1000,-3020) (1200,-3040) (1500,-3025) (1900,-2990) (2300,-3005) (2700,-3030) (3100,-3000) | A |
| Route 44 | 10, on a bank | straight on `x = 700` from (700,-2700) to (700,-3520); bridges at (700,-2765) and (700,-3420) | A |

### Dirt tracks

All 6 m wide, dirt. A track crosses a channel on a plank bridge 4 m wide, no rails.

| Sign at its mouth | Control points | Tier |
|---|---|---|
| "Nilda's. No surveyors." | (1200,-3040) (1180,-3120) (1230,-3190) (1200,-3250) | A |
| "Camp. Fish fry Fridays." | (2300,-3005) (2330,-3100) (2280,-3200) (2300,-3290), then 60 m of boardwalk | B |
| "The Kingdom. Closed. We mean it." | (-2000,-3040) (-2030,-3110) (-1990,-3160) (-2000,-3200) (-2010,-3260) (-1980,-3330) | C |
| "Dish. Private. I can see you." | (-2900,-3020) (-2900,-3050) (-2960,-3110) (-3050,-3090) (-3100,-3000) | C |
| "Back Way (it is not shorter)" | (-1700,-3015) (-1720,-3150) (-1500,-3290) (-1100,-3330) (-700,-3290) (-400,-3230) (-100,-3260) (300,-3290) (700,-3250) | B |
| "Boat ramp" | (300,-3005) (320,-3080) (280,-3140) | B |
| "Shortcut" (from the north end of Hospital Road) | (-520,-2700) (-540,-2800) (-500,-2900) (-520,-2983) | B |
| "Surveyors only" (continues Mallard Greens' Easement Track) | (-2640,-2700) (-2620,-2850) (-2600,-2985) | B |
| "Not a road" | (1900,-2990) (1930,-3080) (1900,-3170) (1840,-3230), ending under water beside a plank dock in the reeds: the smugglers' landing | B |
| "Patrol" | (1500,-3025) (1520,-3090) (1500,-3140) | B |
| Levee track (no sign) | (-3100,-2740) (-2000,-2745) (-1000,-2738) (0,-2742) (640,-2740), then (760,-2740) (1600,-2745) (2400,-2738) (3100,-2742) | B |

### Channels

Water 1.5 m deep. Airboats spawn and race here.

| Name on the channel markers | Width | Control points | Tier |
|---|---|---|---|
| The Long Slough | 30 | (-3150,-3420) (-2400,-3380) (-1600,-3430) (-800,-3400) (0,-3440) (700,-3420) (1200,-3400) (1800,-3440) (2300,-3400) (2900,-3430) (3150,-3400) | A |
| Nilda's Cut | 14 | (1200,-3250) (1230,-3320) (1200,-3400) | A |
| Gator Alley | 12 | (-1600,-3430) (-1450,-3300) (-1150,-3200) (-850,-3230) (-800,-3400) | B |
| Catfish Bend | 16 | (0,-3440) (60,-3300) (240,-3180) (280,-3140) (200,-3060) (150,-2999) (120,-2880) (60,-2775) | B |
| Kingdom Lagoon | 20 | (-2400,-3380) (-2250,-3290) (-2100,-3250) (-1900,-3270) (-1800,-3340) (-1600,-3430) | C |
| Stilt Creek | 14 | (2300,-3400) (2300,-3350) (2360,-3260) (2500,-3180) (2700,-3120) (2900,-3160) (2900,-3430) | B |
| Borrow Canal | 10 | straight on `z = -2765`, `x` -3150 to 3150, at the levee's north foot | B |

## 4. Landmarks

A seed is the landmark's centre. Parts are width×depth×height in metres.

**Big Earl**, `big-earl`, seed `(-400, -2980)`, 30 long × 14 wide, 9 m, tier A.
Silhouette: an alligator the size of a building along the road, mouth open to the east. The road goes in the mouth.
Parts, west to east, body `#3d6b4a`, underside `#6a8f4e`: tail, six tapering boxes from 3×3 down to 0.6×0.6, arching 5 m over the road and curling south to the ground; body, two side walls 14×2×5 and a back slab 14×11×2.5 at 4.5 m, making a tunnel 7 wide and 4.5 high, with ten scutes 1×1×1 along the ridge; four legs 3×2×2, splayed; head block 4×9×3 over the road with two eye domes of radius 0.7 `#d8ff7a`; upper jaw, a wedge 8×9×2.2 hinged at the head and raised 28°; lower jaw, two slabs 8×1×0.5 flanking the road; 28 teeth 0.5×0.5×0.8 `#fdf6ea`; mouth lining `#ff8f7a`. On the north side: Big Earl's, a store 20×12×4 in wood and tin, 20 bays, and a pen 10×10.
Night: the eyes glow firefly green, bulbs run down the spine, the mouth is lit pink from inside.
Player: drive through him. Food at Big Earl's. Gus's Wrangler chain starts here (B). The tail is a ramp onto his back.

**Captain Nilda's dock**, `nilda-dock`, seed `(1200, -3250)`, 30×20, 4 m, tier A.
Silhouette: a T of planks, a tin boathouse and two airboats with cage fans.
Parts: deck 20×3 and a cross piece 10×3 on posts; boathouse 8×6×4; one `gl-shack`; a fuel drum; two Gatorbacks; a fence made of 40 pulled survey stakes with pink ribbons; a sign board 3×2.
Night: one lantern on the end post.
Player: the Glades marina: Gatorbacks spawn here. Mission 8 and the airboat races start here (B). Nilda runs crates for anyone but Bellweather; the boathouse has a false floor.

**The fish camp**, `fish-camp`, seed `(2300, -3350)`, platform 30×20 over water, 6 m, tier B.
Silhouette: a wooden raft of cabins on legs with a lantern string.
Parts: platform 30×20 on twenty posts, deck at +2; cabin 12×8×3; bunkhouse 8×5×2.6; a fish-cleaning table; a boat slip 8×4; a car port 8×6 at the land end of the boardwalk `(2300, -3290)`.
Night: the lantern string, and one blue bug lamp.
Player: the Fish camp property: save point, wardrobe, two cars and a boat. It was a stash house until its owner stopped coming back.

**Castaway Kingdom gate**, `castaway-gate`, seed `(-2000, -3200)`, 30×12, 12 m, tier C.
Silhouette: two fake-rock towers, a sign beam under vines, a giant coconut in a captain's hat.
Parts: two towers 6×6×12 `#8a6f55`; a beam 18×1×2 with eleven letter boards, four missing; Captain Coconut, an 8-sided ball of radius 2.5 with a hat 3×3×1, cracked across the top; four ticket booths 3×3×3; a map board; one monorail pylon 2×2×9 with a snapped beam 14×1.5×1.5 sloping to the ground; vine strips `#3d6b4a` over 60% of every face.
Night: one letter still flickers.
Player: walk the ruined main street behind it. The snapped beam is a ramp.

**The dish trailer**, `dish-trailer`, seed `(-2900, -3050)`, trailer 14×4, dish top 17 m, tier C.
Silhouette: a satellite dish bigger than the home it belongs to.
Parts: one `gl-trailer` with foil in the windows; dish, a 12-sided bowl of radius 9 `#f7f3ea` on a lattice mount 8 m high; a cable drum; one lawn chair facing the dish.
Night: the window flickers television blue. A red light blinks on the dish's feed arm.
Player: at 21:00 the dish turns with a groan. Its owner sells the Sheriff's radio traffic to the crews, by the hour.

**Scale & Tail**, `scale-and-tail`, seed `(700, -3350)`, 80×60 on the east side of Route 44, sign 10 m, tier C.
Silhouette: low fences, a small grandstand, a sign of an alligator in a bow tie.
Parts: three pens 24×18 with 1.5 m fences and a pond each; 30 instanced alligators; bleachers 10×4×3; a feeding platform 4×4 on a 3 m post; a shop 12×8×3.5; a sign 6×4 on a 6 m pole.
Night: thirty pairs of eye glints. One bulb on the sign.
Player: wrangled alligators are delivered here; until it ships, to the pen at Big Earl's. Crews pay for a second feeding at 02:00 and nobody asks what is in the sacks.

**Bait & Ballistics, Glades**, `glades-bait`, seed `(-1000, -3020)`, 16×10, 5 m, tier B.
Silhouette: a tin-roofed store on a plinth with a deep porch.
Parts: store 16×10×4 on a 0.8 m plinth; porch 16×3 with two rocking chairs; an ice chest; a live-bait tank 2×1; a sign 4×2 of a worm in sunglasses; a row of tin cans on a rail out back.
Night: the worm in mint neon.
Player: guns and ammunition over the counter, no paperwork; bait in the tank.

**Pump Station 4**, `pump-station`, seed `(-1500, -2760)`, 14×10 on the levee, 10 m above the marsh, tier C.
Silhouette: a concrete box on the bank with four fat pipes bending over it.
Parts: box 14×10×6 `#c8ccd2`; four pipes of radius 0.8 over the crest into the Borrow Canal; a control hut 3×3; a fence; two contractors with rifles; a board reading "Bayhaven Tomorrow: draining today"; two floodlight masts 8 m.
Night: floodlit cold white, the only such light in the Glades.
Player: a target for the story files, and a climb.

**The patrol station**, `patrol-station`, seed `(1500, -3140)`, 8×6 and a dock, mast 12 m, tier B.
Silhouette: a stilt hut with a flag, a mast and two teal airboats.
Parts: one `gl-shack` painted `#7fd6e8` and white; mast 0.3×0.3×12; dock 12×3; two patrol Gatorbacks.
Night: a teal lamp on the mast.
Player: the wildlife patrol of mission 8 starts from here. It is paid twice: by the county, and by the crews to be somewhere else on moonless nights.

**Swamp Country 94's tower**, `radio-tower`, seed `(-680, -3270)`, mast 3×3, 60 m, tier C.
Silhouette: a thin mast with guy wires, three red lights, a shack at its foot.
Parts: mast 3×3×60 `#6f6a78`; six guy wires to anchors 30 m out; a shack 5×4×2.6 with a porch and a banjo on a chair.
Night: three red lights blink in turn: the one landmark to steer by after dark.
Player: Swamp Country 94 plays through a porch speaker within 30 m.

**Rattle Bridge**, `rattle-bridge`, seed `(150, -2999)`, 30×9, deck at +2.5, tier B.
Silhouette: a low timber bridge on many legs.
Parts: deck 30×9×0.4 of loose planks; twelve posts; rails 0.8 m; two reflector posts. Until it ships, Mudcat Road crosses Catfish Bend on a plain bank with a culvert.
Night: the two reflectors.
Player: the planks rattle under any car. Airboats pass beneath.

**The Cathedral**, `cathedral-dome`, seed `(2700, -3280)`, radius 70, trees to 24 m, tier B.
Silhouette: the tallest cypress dome, with a gap of light in the middle.
Parts: 60 trunks 18 to 24 m in a ring from radius 25 to 70; a round pond of radius 20; an island 3×3 in the pond; hanging moss strips; a rope swing.
Night: 200 fireflies `#d8ff7a`, the densest in the game.
Player: an airboat slalom between the trunks, and a postcard.

## 5. Places of use

| Place | Use | Seed | Tier |
|---|---|---|---|
| Nilda's dock | marina: two Gatorbacks, and a Minnow (B) | `(1200, -3250)` | A |
| Big Earl's | food; Gus Thibodeaux, the Wrangler chain (B) | `(-400, -2960)` | A |
| Bait & Ballistics | guns, ammunition and bait | `(-1000, -3020)` | B |
| Smugglers' landing, end of "Not a road" | night drops, 01:00 to 03:00: three airboats, one Mullet, four armed men | `(1840, -3230)` | B |
| Fish camp | property, $60,000, 2 cars and a boat | `(2300, -3350)` | B |
| Boat ramp | launch or land a boat | `(280, -3140)` | B |
| Swamp Honey, Boiled & Salted | roadside food stands | `(-1700, -3000)` `(1900, -2975)` | B |
| Pelican Fuel | the last petrol, at the crossing | `(740, -2975)` | B |
| Mission 8 crates | five survey-marker crates, by airboat | `(-1450, -3300)` `(-850, -3230)` `(60, -3300)` `(1230, -3320)` `(2500, -3180)` | B |
| Airboat races | four routes on the Long Slough, Gator Alley and Stilt Creek, from Nilda's dock | `(1200, -3270)` | B |
| Bus stop "Exit 44" | the 44 bus, Mudcat Road stop | `(700, -3000)` | C |
| Bus stop "Big Earl's" | the 44 bus's last stop | `(-400, -2980)` | C |
| Scale & Tail | gator deliveries | `(700, -3350)` | C |

No car wash, garage or clothes shop.

## 6. Street life

Until a vehicle is built, its weight goes to `mullet` on roads and `gatorback` on water. Ids marked * are tier C. The zone runs at half the city's car count.

| Band | Hours | Mudcat Road and Route 44 | Channels |
|---|---|---|---|
| Dawn, in fog | 05:00 to 08:00 | mullet 5, bullfrog 2, osprey* 2, hogfish 1 | gatorback 1 |
| Day | 08:00 to 17:00 | mullet 5, bullfrog 2, osprey* 2, tarpon 1, grouper 1, pompano 1, hermit* 1, tortoise* 1 | gatorback 3, minnow 1 |
| Golden | 17:00 to 21:00 | mullet 4, bullfrog 2, wahoo 1, bowfin* 1 | gatorback 2 |
| Night | 21:00 to 05:00 | count × 0.2: mullet 2, bullfrog 1 | gatorback 3, no lights, 01:00 to 03:00 |

People: at most 8 in view. angler* 4 (a rod and a bucket, stands at water), retiree 2 (on porches), tourist 2 (at Big Earl only, 10:00 to 18:00). `angler` is tier B; until built it is `retiree`.

Wildlife (tier B): alligators bask on banks and shoulders, 12 per km of channel, and slide off at 10 m. Herons take off at 15 m. Fireflies replace both at night.

Vignettes:

1. Big Earl, 10:00 to 18:00: tourists photograph each other in his mouth. One is always standing on the road.
2. Mudcat Road near `(-1700, -3015)`, dawn: an alligator lies across both lanes to warm up. Honking does nothing. Bus Driver Voice works.
3. Bait & Ballistics porch, all day: two men in rocking chairs turn their heads together to follow your car. One has a rifle across his lap.
4. Nilda's dock, 16:30: the sunset tour leaves. Six tourists in ear defenders.
5. The Long Slough, 01:30: three airboats run nose to tail with no lights and their fans throttled back. They unload at the end of "Not a road" in ninety seconds.
6. Pump Station 4, 22:00: a surveyor hammers in pink-ribbon stakes by torch. By dawn they are part of Nilda's fence.
7. Rattle Bridge, 15:15: the storm starts and the frog chorus doubles.
8. Any stash shack, any night: the man on the porch stands when your headlights touch the yard. Stop for 5 s and he fires into the air. Stay, and he stops aiming at the air.

Parked cars: none on the road. Rusted wrecks, one per km, are props and cannot be driven.

## 7. Sound bed

| Layer | Recipe | When |
|---|---|---|
| Cicadas | a 4 kHz buzz that swells for 6 s and stops | 08:00 to 19:00 |
| Frogs | low croaks at random pitches, 2 to 5 voices | 19:00 to 06:00, doubled for an hour after rain |
| Far airboat | a filtered saw drone, panned, 20 s | every 2 to 4 minutes by day |
| Sawgrass | a soft hiss with the wind | always |
| Birds | one squawk, one long wail | dawn and dusk |
| Night run | two or three fans throttled low on the Long Slough, no lights; some nights one shotgun, far off | 01:00 to 03:00 |

## 8. Signs

Hand-painted on plywood.

```text
Big Earl's: thirty metres of alligator
Big Earl's: zero metres of museum
Exit 44
You are now entering Big Earl
You are now leaving Big Earl. Tell your friends.
Little Earl: do not pet
Nilda's. No surveyors.
Airboat tours: 10, 1 and 4:30. Hold your hat.
Private. Fuck off. This is your warning.
Camp. Fish fry Fridays.
The Kingdom. Closed. We mean it.
Captain Coconut's Castaway Kingdom
Dish. Private. I can see you.
Back Way (it is not shorter)
Boat ramp
Shortcut
Surveyors only
Not a road
Patrol
Slow: gators warming up
If you can read this you're in range
Do not feed. Do not pet. Do not negotiate.
Bait & Ballistics: guns, ammo, worms. No paperwork.
Stash? What stash. Keep driving.
Swamp Honey: the bees are fine
Boiled & Salted: peanuts, hot
Scale & Tail: feeding at 2. Don't ask what.
Scale & Tail: see 30 gators. Count your party.
Pelican Fuel: last petrol before more swamp
Bayhaven Tomorrow: draining today
Pump Station 4. Keep out. This means Nilda.
Swamp Country 94: you are standing in it
Rattle Bridge: it is meant to do that
Road floods at 3:15
No signal. No law. No shit.
Lost? Good.
Mudcat Road
Route 44 north: Lake Minnow
Fish camp for sale. Owner not coming back.
Welcome to Mudcat Glades. Mind your own fucking business.
```

## 9. Things to find

Flamingos, all tier B:

| # | Seed | Why here |
|---|---|---|
| F1 | `(-400, -2980)` | Inside Big Earl, on a ledge in the roof of his mouth. |
| F2 | `(1200, -3256)` | End of Nilda's dock, in the bait bucket. |
| F3 | `(2300, -3350)` | On the fish camp's roof ridge. |
| F4 | `(-2000, -3204)` | In the crack in Captain Coconut's head. |
| F5 | `(-2900, -3050)` | In the middle of the giant dish. |
| F6 | `(-1500, -2760)` | Riding the pump station's pipes. |
| F7 | `(2700, -3280)` | On the island in the Cathedral's pond. |
| F8 | `(-680, -3274)` | On the radio shack's porch chair. |
| F9 | `(1840, -3230)` | On the sunk pickup at the end of "Not a road". |
| F10 | `(150, -3003)` | Under Rattle Bridge, on a post. Come by boat. |

Big Air ramps:

- R1: Big Earl's back, `(-412, -2980)`, east: up the tail, along the spine, off the snout. Tier B.
- R2: The levee at the Shortcut, `(-530, -2745)`, heading north into the marsh. Tier B.
- R3: The snapped monorail beam, `(-2010, -3215)`, heading south over the gate. Tier C.

Postcards:

- P1: Big Earl at golden hour, mouth open at you. Stand at `(-340, -2982)`, look west. Tier B.
- P2: Dawn fog on the Long Slough. Stand on Nilda's dock at `(1200, -3255)`, look north. Tier B.
- P3: The Cathedral at night. Stand at `(2700, -3215)`, look north. Tier C.

## 10. Checks

1. `map.districtAt` returns `glades` for the seven canon seeds in this file.
2. Mudcat Road is one unbroken spline from `x = -3100` to `x = 3100` and crosses Route 44 within 10 m of `(700, -3000)`.
3. A box 7 m wide and 4.5 m high can pass along the road through Big Earl without touching him.
4. A Gatorback can path by water from `(1200, -3250)` to `(2300, -3350)`.
5. The zone has no traffic lights and no street lamps, and no mesh over 12 m except the dish, the trees and the radio tower.
6. Every dirt track reports grip 0.7, and marsh caps a Tarpon at 30 km/h.

## New names

- Areas: The Levee, West Glades, Earl's Mile, The Crossing, East Glades.
- Tracks, by their signs: Back Way, Shortcut, Not a road, Patrol, Surveyors only.
- Channels: The Long Slough, Nilda's Cut, Gator Alley, Catfish Bend, Kingdom Lagoon, Stilt Creek, Borrow Canal.
- Landmarks: Pump Station 4, the patrol station, Rattle Bridge, The Cathedral, Swamp Country 94's tower.
- Little Earl: the live alligator in the pen at Big Earl's.
- Swamp Honey, Boiled & Salted: roadside stands. The smugglers' landing: the dock at the end of "Not a road".
- angler: a kind of person, tier B.
