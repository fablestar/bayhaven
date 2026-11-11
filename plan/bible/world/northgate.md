# Bible · world · Northgate

Northgate is the strip: six-lane roads, car parks bigger than their shops, pole signs taller than both, and forty lawyers smiling down from one road. You wake up here after a knockout, walk out of here after a booking, and drive through it on the way to everywhere north. The Sheriff's Office runs it like a set and takes a cut of whatever happens off camera. It is a grid of 320 m superblocks: big lots behind car parks.

Tier: A for the zone, its roads, and the kit recipes and three landmarks marked A (day 6). The rest is B or C.

## 1. Feel

Flat, wide and sun-faded. Every building is one floor of beige stucco behind a car park, and every sign is sized to be read from six lanes away. By day the asphalt shimmers and inflatable things wave. At night each car park is a pool of cold white light where two cars sit door to door, and a cruiser idles in view because it is paid to. The Meridian towers stand across the expressway to the south like somewhere better.

Any screenshot must show:

1. A pole sign taller than the shop it belongs to, in red and yellow.
2. A car park at least twice the area of its building.
3. A lawyer's face on a billboard, a bench or a roof.

## 2. Neighbourhoods

District bounds `[-800, 600] × [-2700, -1500]`. Lots are `grid`: avenues every 320 m with a minor street halfway between, so a block is 142×142 m inside its kerbs. To name a point, run these tests in order; the first match wins.

| # | Neighbourhood | Test |
|---|---|---|
| 1 | Sinkhole Park | `x < -360` and `z < -2280` |
| 2 | Medical Mile | `x < -360` |
| 3 | Motel Circle | `x > 40` and `z > -1785` |
| 4 | The Strip | `z > -1960`, or `x <= 40` and `z > -2120` |
| 5 | Studio Park | everything else |

### Kit

Sizes are width×depth in metres. Faded tints are a base pastel mixed half and half with the district beige `#e8dcc4`: pink `#f4bdbd`, mint `#bce0ca`, blue `#c4d7e2`, peach `#f4d3aa`. Trim `#fdf6ea`, roofs `#6f6a78` and flat unless noted, glass `#2e4a6b`.

| id | Recipe | Footprint | Floors × height | Walls | Details | Tier |
|---|---|---|---|---|---|---|
| `ng-strip` | Strip mall, a bar or an L | 120×24 | 1 × 5.5 | `#e8dcc4`, fascia band in one faded tint | a 1.2 m parapet; 6 to 9 shopfronts 13 m wide, a 3 m walkway on posts, a pole sign 14 to 22 m at the kerb | A |
| `ng-box` | Big-box store | 90×60 | 1 × 9 | `#e8dcc4`, one 2 m stripe `#ff5a5a` or `#ffa02e` | six roof units; a 12 m glass entrance under a 14 m portal | A |
| `ng-drive` | Drive-through | 14×10 | 1 × 4 | a faded tint | a shaped sign crown 3 m high; a 4 m lane looping it, menu board, window | A |
| `ng-motel` | Motel with pool | U: two wings 48×9, a bar 30×9 | 2 × 3.2 | `#f4bdbd`, `#bce0ca` or `#c4d7e2` | a walkway balcony with rails; a door every 4 m, a 12×6 pool in the court, a 12 m pole sign | A |
| `ng-clinic` | Clinic or pharmacy | 30×20 | 2 × 3.6 | `#f7f3ea`, `#c4d7e2` | glass door, mint cross sign, ramp | B |
| `ng-office` | Low office | 40×24 | 3 × 3.6 | `#e8dcc4`, ribbon windows | lobby, three flagpoles | B |
| `ng-lot` | Car lot | hut 8×6 | 1 × 3.2 | `#fdf6ea` | 30 to 40 cars in rows, bunting, one inflatable | B |
| `ng-house` | Ranch house | 16×10 | 1 × 3.0 | any faded tint | a hip roof at 20°; carport, a boat on a trailer in one yard in four | C |

Until a B or C recipe ships, its share goes to `ng-strip`.

### Block recipes

| Neighbourhood | Lot | Shares (%) | Parking | Per 100 m of street |
|---|---|---|---|---|
| The Strip | 142×142 or 142×71, building at the back | `ng-strip` 45, `ng-drive` 25, `ng-box` 15, `ng-lot` 10, `ng-motel` 5 | 60% of the lot, in front; 30% full by day, 5% at night | 2 palms, 3 pole signs, 4 light masts 12 m, 1 lawyer's bench |
| Medical Mile | 71×71 | `ng-clinic` 50, `ng-strip` 25, `ng-office` 15, `ng-drive` 10 | 40% of lot, 50% full by day | 4 round trees, 2 light masts, 1 bus shelter |
| Studio Park | 142×71 | `ng-office` 40, `ng-box` 25 (sound stages), `ng-strip` 20, `ng-lot` 15 | 50% of lot, 40% full by day, 15% at night | 2 palms, 3 light masts, 1 camera pole |
| Motel Circle | 71×106 | `ng-motel` 55, `ng-lot` 25, `ng-drive` 10, `ng-strip` 10 | one bay per door, 20% full by day, 50% at night | 3 palms, 2 pole signs, 1 ice machine |
| Sinkhole Park | house lots 23×36, six per block face | `ng-house` 70, `ng-strip` 15, `ng-lot` 15 (vacant, a "For sale" board) | driveways, 70% full; kerbs 20% | 5 trees, 3 mailboxes, 1 "Slow: sinkhole" sign |

## 3. Streets

Route 44 (`x = 700`) and the expressway (`z = -1480`) lie just outside the district. Rebate Road reaches the ramp at `x = -900` and Route 44. Avenues (22 m) are Outlet Road, Billboard Road, Hospital Road, Galleria Road, Voucher Avenue and Doorbuster Drive; the rest are 14 m streets. All are tier A except Closeout Circle (C). Avenue crossings have lights.

| Name | Line | Extent |
|---|---|---|
| Gateway Boulevard (30 m, 3 lanes each way and a turn lane) | `z = -1800` | `x` -800 to 600 |
| Outlet Road | `z = -2120` | `x` -800 to 600 |
| Billboard Road | `z = -2440` | `x` -800 to 600; once the Sinkhole ships, the road is cut where the hole is: -800 to -645 and -555 to 600, with the broken east end at `x = -555` serving as Big Air ramp 31 |
| Hospital Road, Voucher Avenue, Doorbuster Drive | `x = -520`, `120`, `440` | `z` -2700 to -1520 |
| Galleria Road | `x = -200` | `z` -1800 to -1520 and -2530 to -2120; the mall stands on the gap |
| Rebate Road (the expressway frontage), Coupon Street | `z = -1520`, `-1640` | `x` -800 to 600 |
| Clearance Street | `z = -1960` | `x` -800 to -360 and -40 to 600 |
| Warranty Street | `z = -2280` | `x` -800 to 120 and 440 to 600 |
| Receipt Road | `z = -2600` | `x` -800 to -230 and 30 to 600 |
| Layaway Lane, Refund Street | `x = -680`, `-360` | `z` -2700 to -1520 |
| Markdown Street | `x = -40` | `z` -1800 to -1520 and -2440 to -2120 |
| Bulk Street | `x = 280` | `z` -2120 to -1520 and -2700 to -2440 |
| Motel Circle (roundabout, 10 m) | centre `(280, -1640)`, radius 36 | where Coupon Street meets Bulk Street |
| Checkout Lane (the mall's one-way ring, 8 m) | rectangle `x` -340 to -60, `z` -2095 to -1830, corner radius 20 | inside the Galleria lot |
| Closeout Circle (one-way ring, 10 m) | centre `(-600, -2450)`, radius 80 | touches Layaway Lane and Hospital Road; Billboard Road's cut ends join it at `(-680, -2440)` and `(-520, -2440)` |

## 4. Landmarks

A seed is the landmark's door or tallest piece. Parts are width×depth×height in metres.

**Bayhaven General**, `hospital`, seed `(-500, -1700)` (the emergency doors), footprint 136×100, 34 m, tier A.
Silhouette: a mint slab on a beige base, a pink cross, a disc on top.
Parts: podium 120×80×8 `#e8dcc4`; tower 60×40×26 `#bce0ca` on the podium's east half, window bands `#2e4a6b`; cross 6×6×1 `#ff3fa4` at 28 m; helipad disc radius 9 `#6f6a78` at 34 m; canopy 16×12 `#fdf6ea` on four 5 m posts at the Hospital Road kerb; three ambulances in a bay.
Night: 40% of windows lit, the cross glowing, eight amber lights round the helipad.
Player: wakes here after a knockout. Ambulances can be stolen. A stair reaches the helipad. On Friday nights deputies wait at the doors for whoever was shot.

**Sheriff's HQ and studio**, `sheriff-hq`, seed `(200, -2150)` (the front steps), footprint 100×105, mast 45 m, tier A.
Silhouette: a white and teal box, a dish bigger than its roof, a red-lit mast.
Parts: office 100×60×16 `#f7f3ea` with a teal band `#7fd6e8` and a pink stripe `#ff3fa4`; windowless studio 60×40×14 `#c4d7e2` behind it; dish radius 7 on a 10 m pedestal on the studio roof; lattice mast 2×2×45 `#6f6a78`; an "On air" box 4×1 `#ff5a5a` over the door; a holding block with slit windows on the west side; a fenced motor pool 160×120 to the east with eight cruisers and a cage of seized cars.
Night: the dish up-lit cyan, three red lights on the mast, "On air" lit whenever heat is 3 or more.
Player: walks out of these doors after a booking, lighter by whatever the desk counted. Steal a cruiser and the deputies shoot.

**Galleria Flamingo**, `galleria`, seed `(-200, -2000)`, building 220×120 on a lot 306×294, roof 14 m, flamingo top 36 m, tier A.
Silhouette: a flat mall with a giant pink flamingo on it, on one leg.
Parts: mall 220×120×14 `#e8dcc4`; four entrance portals 16×4×16 `#f4bdbd`, one per side; glass roof lantern 40×20×4; flamingo in `#ff3fa4`: leg 1×1×10, body 8×5×5, a neck of five 1.2×1.2×2 boxes in an S, head 2×1.5×1.5, beak 1.5×0.6×0.6 `#150f3d`; loading dock 30×10 on the north side; 900 bays all round.
Night: the flamingo is the brightest pink thing north of the expressway.
Player: shops (section 5). The dock ladder reaches the roof. The car park slopes 2% south for the runaway trolley event.

**Starlite Drive-In**, `starlite`, seed `(350, -2400)` (the screen), lot 200×150, 22 m, tier B.
Silhouette: a white screen on legs facing a fan of parked cars.
Parts: screen 30×1×14 `#ffffff` on six 8 m legs, facing south; sunburst 3×3 `#ffa02e`; five car terraces 180×18, each tilted 6° toward the screen; snack hut 12×8×4 `#f4d3aa` at `(350, -2320)`; ticket booth 3×3×3 at the Doorbuster Drive entrance `(425, -2300)`.
Night: the screen loops drifting circles, squares and triangles in the neon set.
Player: park facing the screen with the engine off; it counts as parked for viewer drain. Tuesday at 20:00 is two for one. The back row is where Northgate's dealers do business.

**Wahoo World**, `wahoo-world`, seed `(100, -1750)` (the tube man), lot 130×93, sign 18 m, tier B.
Silhouette: a tube man and a fish on a pole over rows of cars.
Parts: sales hut 14×8×3.2 `#fdf6ea`; tube man of eight 1×1×1.1 boxes `#ff5a5a` bending on a sine; an 18 m pole sign with a fish of four boxes `#ffa02e`; 40 cars in five rows; bunting.
Night: bulbs on the bunting, the fish in orange neon.
Player: every car is drivable. Steal one in view of the salesman and he phones the deputy he pays.

**Lawyer Larry's office**, `larry-office`, seed `(420, -1830)` (the door), footprint 24×16, board top 17 m, tier B.
Silhouette: a small office under a billboard three times its size.
Parts: office 24×16×7 `#f4d3aa`; roof billboard 20×1×8 on a frame 2 m above the roof, Larry pointing; six bays.
Night: four floodlights on the board, one window lit.
Player: starts Billable Hours and mission 10. Once you have met him, booking and hospital costs halve.

**The Sinkhole**, `sinkhole`, seed `(-600, -2450)`, radius 45, depth 18, tier C.
Silhouette: a round hole with half a strip mall hanging over the edge.
Parts: a 16-sided pit, radius 45 at the rim and 30 at the floor, walls `#8a6f55`; pond radius 12 `#5a4a32`; half an `ng-strip` 60×24 on the east rim, tilted 8° inward; three stripped cars and a safe with its door off on the floor; rim fence at radius 52 with a gap on the north side; a 6 m dirt ramp spiralling down from the gap, one turn.
Night: one street lamp leans over the rim, still lit.
Billboard Road runs straight through the hole's footprint, so it is cut there: the west end drops into the pit and the broken east end, 7 m back from the rim, is Big Air ramp 31 (`bible/activities/big-air.md`).
Player: drive down the ramp, jump the hole from the broken end of Billboard Road, find what crews have dumped.

**Mount Seagull**, `mount-seagull`, seed `(-100, -2620)` (the summit), base 240×150, 35 m, tier C.
Silhouette: a green hill with a cloud of gulls on top.
Parts: four stacked elliptical tiers 240×150, 190×115, 130×80 and 70×40, each 8.75 m high, `#6a8f4e` with patches `#8a6f55`; a 6 m haul road spiralling up 1.5 turns from the gate at `(-200, -2530)`; 60 instanced gulls circling within 40 m of the summit.
Night: one red light on a summit pole.
Player: the best view in the district and a ramp off the top tier. At night the gate man takes cash to look away.

**Billboard Row**, `billboard-row`, north kerb of Billboard Road at `z = -2458`, 40 boards, 14 m, tier B (defacing is C).
Silhouette: forty identical boards on poles, receding to the horizon.
Parts: each board 12×0.4×5 on one 9 m pole `#6f6a78`. Six per block at `x = blockWest + 11 + 24i`, `i` 0 to 5, in the blocks whose west kerbs are -509, -353, -189, -33, 131 and 287, then four at `x` 462, 486, 510, 534. Owners in order, four times over: Larry, Annie, Larry, Gull, Annie, Larry, Limpet, Annie, Larry, Jellyfish. That is 16 Larry, 12 Annie and 4 each for the rest.
Night: every board floodlit; one lamp in five flickers.
Player: the 16 Larry boards count toward the 40 to deface.

**Motel Circle sign**, `motel-circle-sign`, seed `(280, -1640)`, island radius 26, 20 m, tier B.
Silhouette: a giant arrow that bends down to point at nothing.
Parts: mast 1×1×20 `#6f6a78`; a hooked arrow of three boxes, 10×1×3 `#ffa02e`; five letter boxes 2×0.5×2 spelling "Motel" down the mast `#ff5a5a`; twelve bulbs.
Night: the bulbs chase round the arrow once a second.
Player: the marker for the motels.

**Attorney Annie's office**, `annie-office`, seed `(420, -1765)`, footprint 24×16, board top 19 m, tier B.
Silhouette: Larry's office again, across the road, the billboard 2 m taller.
Parts: as `larry-office` in `#c4d7e2`, the board raised 2 m, Annie with arms folded.
Night: floodlit, and brighter than Larry's.
Player: the far end of the billboard war jobs.

**Madame Calypso's**, `calypso`, seed `(-120, -1760)`, one 13 m unit of an `ng-strip`, 5.5 m, tier C.
Silhouette: a glowing hand in a window between two closed units.
Parts: unit front 13×3; hand sign 1.5×2 `#b46bff`; a barometer the size of a door beside the entrance.
Night: the hand is the only violet light on the Strip.
Player: starts Forecast. The barometer shows the weather one in-game hour ahead.

## 5. Places of use

| Place | Use | Seed | Tier |
|---|---|---|---|
| Bayhaven General, emergency doors | wake-up point | `(-500, -1700)` | A |
| Sheriff's HQ, front steps | release point after a booking | `(200, -2150)` | A |
| Park & Sons Auto, Northgate | paint, parts, repairs | `(-120, -2160)` | A |
| Second Wind Thrift | cheap clothes, lose a heat level | `(60, -1835)` | A |
| Storm Mart | life vest, flares, noodles | `(200, -1845)` | A |
| Bait & Ballistics | guns and ammunition over the counter; bait at the back | `(520, -1840)` | A |
| Shell Yeah | food | `(-290, -1765)` | A |
| Birdbath Car Wash | doubles viewer drain; the car wash business in `04-systems.md` unless the catalogue names another | `(520, -1765)` | A |
| Galleria food court: Scoop Dreams, Squeeze Play, Key Lime Crimes | food | `(-200, -1945)` | B |
| Bun Voyage, Wing It, Bean There | drive-through food and coffee | `(-430, -1835)` `(320, -1835)` `(-600, -1765)` | B |
| Hush Hour Diner | food; Deputy Wade Purdy's booth (Off Camera) | `(60, -2170)` | B, chain C |
| Pelican Fuel | petrol, a place to change cars unseen | `(200, -1765)` | B |
| Pill Bill's, Sandbar Market | pharmacy, groceries | `(-600, -1840)` `(0, -1850)` | B |
| Manatee Mattress, Iguana Insurance, Mullet Over | sign-only shopfronts | `(330, -1760)` `(-160, -1760)` `(-80, -1760)` | B |
| Motel Sunburn, The Vacancy, Tan Line Inn, The Wet Towel | motels round the circle: by the night or the hour, cash, no names | `(200, -1590)` `(360, -1590)` `(200, -1700)` `(360, -1700)` | C |
| Second Tide Motors | used-car lot; stolen cars get new plates out back | `(520, -1590)` | C |
| Galleria south doors | Dawn Patrol meets at 06:00 | `(-200, -1935)` | C |
| Galleria loading dock | mission 16, the generator truck | `(-200, -2068)` | C |
| Bus stops, the 15 bus | shelters on Gateway Boulevard: the Gatehouse, Gateway and Galleria, Wahoo World, Lawyer Larry's | `(-800, -1800)` `(-200, -1800)` `(100, -1800)` `(420, -1800)` | B |

## 6. Street life

`taxi` is the Bay Cab Tarpon. Until a vehicle is built, its weight goes to `tarpon`. Ids marked * are tier C. Traffic moves at 0.8 of the limit.

| Band | Hours | Traffic weights |
|---|---|---|
| Dawn | 05:00 to 08:00 | tarpon 4, mullet 4, pompano 3, hogfish 3, grouper 2, snook 2, manatee 1, pelican 1 (5 on Mondays) |
| Day | 08:00 to 17:00 | tarpon 5, grouper 5, snook 4, mullet 3, pompano 3, heron 2, possum* 2, manatee 1, taxi 1, hogfish 1 |
| Golden | 17:00 to 21:00 | tarpon 4, grouper 4, wahoo 3, snook 3, heron 2, mullet 2, pinfish 2, manatee 1, sheriff tarpon 1; speed × 0.6 until 19:00 |
| Night | 21:00 to 05:00 | count × 0.3: tarpon 3, hogfish 2, mullet 2, sheriff tarpon 2, taxi 1 |

| Band | People weights |
|---|---|
| Dawn | retiree 4, jogger 2, office worker 2, medic* 1 |
| Day | shopper* 6, retiree 3, tourist 2, office worker 2, mascot* 1, medic* 1 |
| Golden | shopper* 4, tourist 2, clubber 1, skater 1 |
| Night | count × 0.2: dealer* 2, office worker 1, medic* 1 |

`shopper` (two bags, car to door and back), `mascot` (a food costume and an arrow sign, one corner), `medic` (mint scrubs) and `dealer` (waits under a broken lamp, walks to car windows, runs from sirens) are tier B kinds; until built they are `tourist`. 80% of people spawn inside car parks.

Vignettes:

1. Gateway Boulevard at Voucher Avenue, 10:00 to 18:00: a mascot spins a Bun Voyage arrow sign. Honk and he spins it faster.
2. Wahoo World, 15:15: the storm flattens the tube man. At 15:55 a salesman props up the fan and it rises again.
3. Behind The Vacancy, 23:00: two cars park door to door. A bag goes one way and an envelope the other. A cruiser sits 40 m off with its lights out. It collects on Fridays.
4. Bean There, 07:30: three cruisers queue at the drive-through. The deputies ignore anything short of gunfire.
5. Doorbuster Drive, Tuesday 20:00: cars queue for the Starlite and honk when the film loops.
6. Billboard Road, any hour: gulls follow every Pelican truck to the Mount Seagull gate.
7. The HQ's back gate, 03:00: two deputies load evidence-room boxes into a private Grouper. "Count it again and I'll fucking shoot you."

Parked cars: none at avenue kerbs, 20% of kerb spaces on minor streets. Bays fill from the door outward. The three ambulances and eight cruisers are always present.

## 7. Sound bed

| Layer | Recipe | When |
|---|---|---|
| Traffic wash | low-passed brown noise swelling every 30 s | always, 12 dB lower at night |
| Loudspeaker jingle | three marimba notes, then muffled voice blips | 08:00 to 21:00, every 40 to 90 s, within 60 m of an `ng-strip` or `ng-box` |
| Tube man | fan noise and a slow flap | 09:00 to 19:00, within 40 m of Wahoo World |
| Night shots | two flat cracks far off, then a siren that takes its time | 23:00 to 04:00, every 6 to 10 minutes |
| Gulls | falling chirps | daylight, within 300 m of Mount Seagull |

## 8. Signs

```text
Welcome to Northgate. Ample parking.
Galleria Flamingo: 140 stores, 9 open
Hurt? Flirt with a lawsuit. Larry 555-0144
Larry settled. I don't. Attorney Annie 555-0155
Arrested? Shut up and call Larry.
Shot? Stabbed? Sued? Attorney Annie 555-0155
This car park is watched by the Sheriff. Tip accordingly.
Gull, Gull & Gull: we repeat ourselves
Limpet Legal: we stick to you
Jellyfish Injury Law: it stung? We sting back
Billboard Road: next 40 billboards
Bayhaven General: walk-ins welcome, carry-ins preferred
Home of Bayhaven Blue: Live
Smile, asshole. You're on Bayhaven Blue.
Wahoo World: every car has been somewhere
Wahoo World: no title? No problem.
Starlite Drive-In: two for one Tuesdays
Tonight: Triangle Meets Circle. Again.
No chases during the feature
Motel Sunburn: nightly, hourly, no questions
The Vacancy: cash only. We saw nothing.
Tan Line Inn: the pool is evidence
The Wet Towel: under old management
Storm Mart: we were going to close anyway
Manatee Mattress: sleep like a sea cow
Iguana Insurance: we cover what falls out of trees
Pill Bill's: open 24 hours, awake for 9
Bun Voyage: drive through, bun appetit
Wing It: no plan, twelve sauces
Bean There: drive-through coffee. Done that.
Second Wind Thrift: somebody else's good idea
Sandbar Market: fresh-ish
Mullet Over: walk-ins, think it through
Pelican Fuel: fill your bill
Birdbath Car Wash: come out a different colour
Madame Calypso: psychic and notary. Rain at 3:15.
Mount Seagull County Landfill: what's buried stays buried
Sinkhole. No dumping. We know it's you, dipshit.
Closeout Circle: everything must go. It went.
Exit 44: Big Earl's. Thirty metres of alligator.
```

## 9. Things to find

Flamingos, all tier B:

| # | Seed | Why here |
|---|---|---|
| F1 | `(-195, -2005)` | On the Galleria roof at the giant flamingo's foot. |
| F2 | `(-600, -2452)` | Floor of the Sinkhole. On the rim until the hole ships. |
| F3 | `(-100, -2620)` | Summit of Mount Seagull, among the gulls. |
| F4 | `(350, -2412)` | Behind the Starlite screen. |
| F5 | `(100, -1752)` | At the tube man's base. |
| F6 | `(-430, -1720)` | On the hospital helipad, in the middle of the H. |
| F7 | `(280, -1640)` | The Motel Circle island. |
| F8 | `(190, -2245)` | On the studio roof under the dish. |
| F9 | `(420, -1836)` | On the ledge of Larry's roof billboard, by his ear. |
| F10 | `(-750, -1522)` | Under the expressway where Rebate Road starts. |

Big Air ramps:

- R1: Car transporter at Wahoo World, `(60, -1775)`, north over six lanes of Gateway Boulevard. Tier B.
- R2: Top tier of Mount Seagull, `(-70, -2600)`, south-east onto Billboard Road. Tier C.
- R3: Sinkhole leap, Big Air ramp 31, run-up from `(-515, -2440)`, west off the broken end of Billboard Road at `(-548, -2452)`, 90 m across the hole, needs 130 km/h. Tier C.

Postcards:

- P1: The giant flamingo with the Spire behind it. Stand at `(-200, -2110)`, look south. Tier B.
- P2: Forty lawyers at sunset. Stand at `(-500, -2430)`, look east along Billboard Road. Tier B.
- P3: The Starlite screen from the back row. Stand at `(350, -2295)`, look north, at night. Tier C.

## 10. Checks

1. `map.districtAt` returns `northgate` for the eight canon landmark seeds.
2. The lane graph has six lanes on `z = -1800` from `x = -800` to `600`, and signal nodes at `x` -520, -200, 120 and 440.
3. Billboard Row has 40 boards, none within 15 m of a north to south road's centre line.
4. After `player:knockedout` the player is within 25 m of `(-500, -1700)`; after `player:booked`, of `(200, -2150)`.
5. No mesh in the zone is taller than 45 m. The flamingo's top is at 36 m ± 1.
6. In every `ng-strip` and `ng-box` lot the car park is at least twice the building's footprint.

## New names

- Streets: Voucher Avenue, Doorbuster Drive, Refund Street, Markdown Street, Bulk Street, Receipt Road, Layaway Lane, Checkout Lane, Closeout Circle.
- Gull, Gull & Gull; Limpet Legal; Jellyfish Injury Law: three more billboard law firms.
- Tan Line Inn, The Wet Towel: motels. Second Tide Motors: a used-car lot. The 15 bus: the Northgate loop on Hospital Road, Gateway Boulevard and Outlet Road.
- Billboard Row; Triangle Meets Circle (the Starlite's one film, a six-minute loop of shapes).
- shopper, mascot, medic, dealer: four kinds of people, tier B.
