# Bible · world · Mallard Greens

Mallard Greens is the gated suburb: curving lanes, near-identical houses in four approved colours, a golf course through the middle and a homeowners' association with a rule for everything. Gordon Bellweather is its president and Greens Patrol, his armed private security, is its law, so this is where the story finds its proof. Roads are splines and lots follow them.

Tier: A for the zone, the roads, the kit recipes and four landmarks marked A, and the golf course (day 6, for mission 5). The rest is B or C.

## 1. Feel

Calm to the point of threat, and the threat is real: the golf cart doing 20 km/h has a shotgun in its bag rack. Every lawn is the same green and the same height and every porch light is the same bulb. The player's dented car is the loudest object for a kilometre. The lanes curve so you never see more than eight houses at once, and the clock tower shows above every roof.

Any screenshot must show:

1. Four houses that differ only by colour.
2. A lawn in `#3fb86a`, one ball-shaped tree, no car at the kerb.
3. A golf cart, a sprinkler arc or the clock tower.

## 2. Neighbourhoods

District bounds `[-3200, -800] × [-2700, -1500]`. Lots are `spline`: they line the lanes in section 3.

**The perimeter** is a wall 2.4 m high in `#f5ecd7`; on the north side, a hedge 3 m high and 2 m thick in `#3d6b4a`. East wall `x = -810`, `z` -1540 to -2430. North hedge `z = -2430`, `x` -810 to -2650, then north along `x = -2650` to `z = -2680` and west along `z = -2680`. West fence `x = -3190`. South wall `z = -1540`. Three openings: Starling Approach, the south gate and the hole in the hedge. Between the hedge and the Glades is **the Easement**: scrub, the cart barn and a dirt track.

To name a point, run these tests in order. The first match wins.

| # | Neighbourhood | Test |
|---|---|---|
| 1 | The Easement (not in the canon) | outside the perimeter |
| 2 | The Gatehouse | `x` -1000 to -800 and `z` -2050 to -1700 |
| 3 | Model Mile | `x > -1400` |
| 4 | Clubhouse Circle | `x` -2200 to -1800 and `z` -2250 to -1950 |
| 5 | Phase Four | `x < -2650` and `z < -2330` |
| 6 | Lake Serenity | `x < -2650`, or `x < -2450` and `z > -2100` |
| 7 | The Fairways | everything else |

### Kit

Sizes are width×depth in metres. Walls take one of the four approved colours: cream `#f5ecd7`, sage `#b7c9a8`, dove `#c9cdd4`, blush `#f0d0c8`. Along a lane they cycle in that order from a seeded start, so no two neighbours match. Every roof is a hip at 22° in `#6f6a78`. Trim and garage doors are `#fdf6ea`. Every house has one warm porch light at 2.2 m.

| id | Recipe (the sales name) | Footprint | Floors × height | Street level | Tier |
|---|---|---|---|---|---|
| `mg-ranch` | The Mallard | 18×12 | 1 × 3.2 | a 5 m garage door, a porch on two posts | A |
| `mg-two` | The Drake | 14×12 and a garage 6×7 | 2 × 3.0 | a balcony nobody stands on | A |
| `mg-villa` | The Teal, a twin villa | 24×12 | 1 × 3.2 | two mirrored doors and garages | A |
| `mg-lake` | The Canvasback | 22×16 | 2 × 3.2 | a screen cage 12×10×6 over a pool at the back | B |
| `mg-show` | any of the above as a show home | as above | as above | six feather flags, a banner, no car | B |
| `mg-pad` | a Phase Four lot | slab 6×9 | none | driveway, mailbox, a "Sold" board | C |

### Block recipes

A lot is 22 m of frontage by 36 m deep, the house set back 8 m, a 6 m driveway on the left, the mailbox at the kerb. Kerb parking is zero everywhere. The Gatehouse and Clubhouse Circle have no house lots: car parks of 40 and 60 bays, palms every 12 m.

| Neighbourhood | Lot | Shares (%) | Driveways | Per 100 m of lane |
|---|---|---|---|---|
| Model Mile | 22×36 | `mg-show` 100 (as Drake 40, Mallard 30, Teal 20, Canvasback 10) | empty | 9 trees, 9 mailboxes, 4 lamps, 12 feather flags |
| The Fairways | 22×36 | `mg-ranch` 45, `mg-two` 35, `mg-villa` 20 | a car on 60%, a Birdie on 40% | 9 trees, 9 mailboxes, 4 lamps, 5 sprinklers, 1 speed sign |
| Lake Serenity | 28×44 | `mg-lake` 60, `mg-two` 25, `mg-ranch` 15 | a car on 70%, a Birdie on 60% | 7 trees, 7 mailboxes, 4 lamps |
| Phase Four | 22×36 | `mg-pad` 100 | empty | 4 lamps, 9 mailboxes, 3 survey stakes with pink ribbon |

## 3. Streets

Lanes are 10 m wide, 30 km/h. Fairway Drive adds a 2 m cart lane each side, painted sage. A cul-de-sac ends in a bulb of radius 14. Fit a Catmull-Rom spline through each list of `(x,z)` control points. All are tier A except Dodo Drive, Loon Lane and Buzzard Bend (C) and the Easement Track (B).

| Name | Control points |
|---|---|
| Fairway Drive, east half | (-900,-1900) (-1020,-1885) (-1160,-1830) (-1320,-1770) (-1480,-1790) (-1620,-1880) (-1760,-1990) (-1900,-2070) (-1910,-2100) |
| Clubhouse Circle (one-way ring) | centre (-2000,-2100), radius 90 |
| Fairway Drive, west half | (-2090,-2100) (-2180,-2130) (-2300,-2200) (-2420,-2240) (-2560,-2260) (-2700,-2300) (-2840,-2390) (-2940,-2460) (-3000,-2500) |
| Starling Approach (from Gateway Boulevard) | (-800,-1800) (-850,-1840) (-900,-1900) |
| Grackle Lane, signed "Model Mile" | (-1100,-2340) (-1108,-2200) (-1135,-2060) (-1175,-1930) (-1200,-1815) (-1225,-1700) (-1245,-1600) |
| Muscovy Court (cul-de-sac) | (-1108,-2200) (-1040,-2190) (-960,-2210) (-900,-2250) |
| Goose Crossing | (-1020,-1885) (-1010,-1980) (-985,-2090) (-960,-2210) |
| Pigeon Place (cul-de-sac) | (-1225,-1700) (-1150,-1680) (-1060,-1660) (-980,-1620) |
| Coot Circle (stem and ring) | stem (-1480,-1790) (-1514,-1752); ring centre (-1560,-1700), radius 70 |
| Gull Close (cul-de-sac) | (-1620,-1880) (-1640,-1830) (-1660,-1780) |
| Vulture Loop | (-1985,-1720) (-1900,-1700) (-1800,-1690) (-1740,-1740) (-1745,-1830) (-1810,-1880) (-1900,-1860) (-1975,-1850) |
| Crow Court (cul-de-sac) | (-1900,-1860) (-1870,-1810) (-1840,-1770) |
| Cormorant Way (south gate to the circle) | (-2000,-1520) (-2000,-1600) (-1985,-1720) (-1975,-1850) (-1990,-1950) (-2000,-2010) |
| Magpie Mews (cul-de-sac) | (-1978,-1800) (-2030,-1810) (-2045,-1870) (-2040,-1930) |
| Ibis Bend | (-2000,-1600) (-2100,-1585) (-2250,-1580) (-2400,-1600) (-2550,-1650) (-2700,-1680) (-2850,-1690) (-2960,-1740) (-3030,-1850) (-3030,-1960) (-2990,-2050) |
| Moorhen Court (cul-de-sac) | (-2550,-1650) (-2560,-1600) (-2600,-1575) |
| Anhinga Lane (to the chained boat dock) | (-3030,-1850) (-2990,-1870) (-2930,-1900) |
| Limpkin Loop | (-2700,-2300) (-2725,-2220) (-2780,-2150) (-2870,-2120) (-2950,-2150) (-2975,-2230) (-2930,-2300) (-2840,-2390) |
| Dodo Drive (Phase Four loop) | (-3000,-2500) (-3080,-2480) (-3140,-2530) (-3150,-2610) (-3080,-2650) (-2980,-2655) (-2880,-2640) (-2800,-2600) (-2760,-2520) (-2790,-2440) (-2840,-2390) |
| Loon Lane (cul-de-sac) | (-3000,-2500) (-2990,-2560) (-2960,-2600) |
| Buzzard Bend (cul-de-sac) | (-2800,-2600) (-2850,-2560) (-2880,-2500) |
| Gander Road (14 m frontage outside the south wall; becomes Rebate Road at `x = -800`) | straight, `z = -1520`, `x` -2400 to -800; expressway ramps at both ends |
| Easement Track (6 m dirt, outside the hedge) | (-800,-2440) (-1200,-2470) (-1700,-2460) (-2100,-2480) (-2450,-2455) (-2620,-2470) (-2640,-2690) |

## 4. Landmarks

A seed is the landmark's door or tallest piece. Parts are width×depth×height in metres.

**The Gatehouse**, `gatehouse`, seed `(-900, -1900)`, footprint 18×10, 5 m, tier A.
Silhouette: a tiny hut under a wide canopy, two striped arms.
Parts: hut 5×4×3.2 `#f5ecd7` with a hip roof; canopy 18×10×0.5 `#fdf6ea` on two piers at 4.5 m; two 4 m barrier arms, sage and white; sign wall 12×1×2.4 with a box duck 1 m high on top; a mirror on a pole for looking at dents; a shotgun under the counter.
Night: the sign up-lit, a red strip on each arm.
Player: Bev lifts the arm for any Birdie and for a car with health above 60. Break the arm and you get heat 1, both barrels and two patrol carts.

**The clubhouse**, `clubhouse`, seed `(-2000, -2100)`, footprint 64×40 on the island of Clubhouse Circle, clock tower 25 m, tier A.
Silhouette: a long hipped hall with a square clock tower.
Parts: hall 64×40×9 `#f5ecd7`; hip roof 68×44×5; portico 20×6 on six 7 m columns; clock tower 6×6×22 with a 3 m pyramid cap and four clock faces 4 m across; south terrace 40×10×0.6; pro-shop wing 20×14×4.5 `#b7c9a8`; the office upstairs at the west end.
Night: warm windows, four white clock faces.
Player: the clock shows the game clock and is always right. The binder of mission 5 is in the office, past two armed guards. The next room holds the week's fines, in cash, unaudited.

**The model home**, `model-home`, seed `(-1100, -2300)`, lot 22×36, 9 m, tier A.
Silhouette: a blush two-floor house under six feather flags.
Parts: `mg-two` in `#f0d0c8`; a plastic lawn 22×24, brighter than the rest; six flags 0.6×4 on 5 m poles; a banner 8×1.2 reading "Bayhaven Tomorrow"; a flat cut-out family in the front window.
Night: every window lit on a timer.
Player: step on the lawn and a recorded voice says not to.

**The hole in the hedge**, `hedge-hole`, seed `(-2450, -2420)`, gap 1.8 wide × 1.9 high in the north hedge, tier A.
Silhouette: a dark notch in a green wall behind a flag.
Parts: the gap; a flattened "No exit" sign; two tyre ruts as a decal leading to the Easement Track.
Night: unlit. Fireflies drift through from the Glades.
Player: the escape in mission 5. A Birdie, a bike or a person fits. A car does not. The patrol will not shoot the hedge: repairs are billed to the association.

**Lake Serenity**, `lake-serenity`, seed `(-2700, -1900)`, an ellipse 440×300, tier B.
Silhouette: flat water with one tall white jet.
Parts: water 0.6 m below the lawn, `#7fd6e8`; a centre platform 3×3 with a 12 m jet; six 3 m jets in a ring of radius 90; Bylaw, an alligator 4.5 m long, on the bank at `(-2470, -1890)` from 11:00 to 14:00 and in the water otherwise.
Night: the jets are lit in the four approved colours in turn. The minutes list two process servers as "lost to the water feature".
Player: swim, wrangle, and find the gnome in Bylaw's mouth.

**Phase Four**, `phase-four`, seed `(-3000, -2500)`, 550×350, sales board 9 m, tier C.
Silhouette: rows of lamps and mailboxes with no houses.
Parts: three lanes; 96 `mg-pad` lots; 60 lamps; a roundabout of radius 20 at the seed; a sales board 14×0.4×6 on two posts showing Bellweather's smile.
Night: every lamp is lit over nothing.
Player: empty curving roads, the best drift practice in the district. After midnight the estate buries things here: nobody lives near enough to hear.

**The south gate**, `south-gate`, seed `(-2000, -1520)`, footprint 8×6, 4 m, tier B.
Silhouette: one arm, one camera, one empty hut.
Parts: hut 3×3×3 `#c9cdd4`; arm 5 m; a card post; sign 2×1.
Night: one porch light.
Player: the arm lifts for a Birdie, or for a car within 4 s of the one in front.

**The sales centre**, `sales-centre`, seed `(-960, -1940)`, footprint 30×16, 6 m, tier B.
Silhouette: a glass box under too much roof.
Parts: glass pavilion 30×16×5 `#2e4a6b`; flat roof 36×22×1 `#fdf6ea`; a table model 4×3 of Bayhaven Tomorrow, a tower where Pelican Rest should be; three six-seat tour Birdies.
Night: lit like a fish tank.
Player: the tour carts leave from here.

**The notice board**, `notice-board`, seed `(-1960, -2035)`, 12×1, 3 m, tier B.
Silhouette: a roofed wall of framed pages and a bank of mailboxes.
Parts: wall 12×1×3 `#f5ecd7` under a hip roof; 20 frames 0.5×0.7, one rule each (section 12); mailbox bank 16×1×1.6 with 240 doors.
Night: two gooseneck lamps.
Player: walk up to a frame to read its rule. Dee Pfeffer's Violations chain starts here (C); her Birdie, with its rack of rulers, is here from 09:00 to 17:00.

**Pool and pickleball**, `pool-pickleball`, pool seed `(-2000, -2045)`, courts `(-2050, -2150)`, tier B.
Silhouette: a pool ringed by identical loungers; four fenced courts.
Parts: pool 25×12; 24 loungers 2×0.7; court pad 30×16 `#b7c9a8` with white lines, a 3 m fence.
Night: the pool glows cyan.
Player: a jet ski event ends in this pool (Local Man 7).

**The cart barn**, `cart-barn`, seed `(-2300, -2500)`, footprint 40×16, 6 m, tier B.
Silhouette: a grey shed in the scrub beside a heap of pink.
Parts: shed 40×16×6 `#c9cdd4` with three roller doors; 20 Birdies; a heap 6×6×2 of confiscated lawn ornaments, mostly flamingos.
Night: one floodlight.
Player: Greens Patrol's armed Birdies start from here in mission 5. Its gun locker is the steel door at the east end.

## 5. Places of use

| Place | Use | Seed | Tier |
|---|---|---|---|
| Gatehouse barrier | mission 5, the tidy-car check | `(-900, -1900)` | A |
| Clubhouse office | the binder | `(-2025, -2100)` | A |
| Birdie rank, clubhouse east side | 12 carts, always | `(-1955, -2100)` | A |
| Hole in the hedge | mission 5 exit | `(-2450, -2420)` | A |
| The Nineteenth, clubhouse terrace | food | `(-2000, -2075)` | B |
| 9th fairway | golf cart derby arena | `(-1700, -2220)` | B |
| Lake Serenity east bank | gator wrangling; Gus's Wrangler chain | `(-2470, -1890)` | B |
| Bus stop "The Gatehouse" (outside) | the 15 bus; buses may not enter | `(-800, -1800)` | B |
| Notice board | Violations chain, Dee Pfeffer | `(-1960, -2035)` | C |
| First tee | Sunday tournament; Dawn Patrol races | `(-1890, -2120)` | C |

No shops, car washes or garages inside the wall: rule 20.

## 6. Street life

Until a vehicle is built, its weight goes to `grouper`. Ids marked * are tier C. Traffic moves at 0.7 of the limit.

| Band | Hours | Traffic weights |
|---|---|---|
| Dawn | 05:00 to 08:00 | birdie 6, grouper 2, coot* 2, cricket* 1, egret* 1, pelican 1 (4 on Mondays) |
| Day | 08:00 to 17:00 | birdie 7, grouper 4, tarpon 3, gallinule* 2, egret* 2, pompano 1, cricket* 1 |
| Golden | 17:00 to 21:00 | birdie 5, grouper 3, tarpon 2, gallinule* 1 |
| Night | 21:00 to 05:00 | count × 0.15: birdie 2 (Greens Patrol, armed), grouper 1 |

People: retiree 6, jogger 3 (power-walkers, in pairs), golfer* 3, guard* 1 (Greens Patrol: grey shirt, pistol, shoots at heat 1). `golfer` and `guard` are tier B; until built they are `retiree`. Count × 0.1 after 21:00.

Vignettes:

1. Vulture Loop at `(-1800, -1690)`, 09:00: a man measures his neighbour's lawn with a ruler, then your car.
2. Fairway Drive, 07:00 to 19:00: one groundskeeper walks Gatehouse to clubhouse and back, blowing a single leaf.
3. Everywhere, 06:00 and 18:00: every sprinkler starts on the same second. Also at 15:15, in the rain.
4. Ibis Bend, 14:00: Bylaw crosses the road to the lake. Traffic waits. Nobody honks.
5. The Gatehouse, all day: Bev does a crossword with a shotgun across her knees. To a dented car: "Fuck off and fix it."
6. Phase Four, 02:00: a mini digger works by torchlight on Lot 418. By dawn the lot is level and the "Sold" board is back.
7. Ibis Bend, 22:00: a patrol cart stops a jogger at gunpoint and asks for his lot number. He is the treasurer. They ask again.

Parked cars: none at any kerb. Leave yours on a lane for 30 s and Local Man event 12 starts.

## 7. Sound bed

| Layer | Recipe | When |
|---|---|---|
| Leaf blower | band-passed saw noise near 400 Hz, placed at the groundskeeper | 07:00 to 19:00 district-wide; fainter at night |
| Sprinklers | a tick, tick, hiss loop per lawn within 40 m | 06:00, 18:00 and 15:15, ten minutes each |
| Approved birdsong | four chirps looped from pole speakers | daylight, every 20 s |
| Golf and pickleball | a soft click, a hollow pop | daylight, within 80 m of a fairway or the courts |
| Clock chime | one bell stroke per hour of the game clock | on the hour, district-wide |

## 8. Signs

```text
Mallard Greens: a Bellweather community
Welcome home. Please slow down. Slower.
Speed limit 30. Greens Patrol is armed.
No ducks.
Do not feed the alligator. He ate Tuesday.
Lake Serenity: no swimming, fishing, boating, wading or reflecting
Bayhaven Tomorrow: tour starts here
Model home: please don't touch the lawn
Phase Four: now selling. Houses to follow.
Lot 418: sold
Fuck the association
Fairway Drive
Grackle Lane
Muscovy Court
Coot Circle
Cormorant Way
Vulture Loop
Ibis Bend
Dodo Drive: no through road yet
Carts have right of way. Cars have been warned.
Armed response. No warning shots: rule 9.
Trespassers will be shot. Survivors will be fined.
Hole 14, par 3. Lost balls are the property of the hedge.
Hole 16, par 5. The lake keeps what it catches.
Championship course. Par 72. The card is wrong.
The Nineteenth: members and their regrets
Pool rules: no running, no splashing. Floating by permit.
Pickleball: line calls are final. Appeals in writing.
Violations desk. Take a number. It is your number now.
Notice: the notice board has moved. See notice.
Approved colours: cream, sage, dove, blush
Sprinklers run at 06:00 and 18:00. So should you.
No exit
Tidy cars only. Dents will be noted.
This lawn is monitored for height.
Bin day is Monday. Bins seen on Tuesday will be discussed.
The clubhouse clock is always right. Do not check it.
Sales centre: ask about Phase Five
Caution: leaf blower in use since 2009
You are now leaving Mallard Greens. Standards end here.
```

## 9. Things to find

Flamingos, all tier B. Lawn ornaments are banned here.

| # | Seed | Why here |
|---|---|---|
| F1 | `(-1800, -1692)` | On the lawn of the man with the ruler. |
| F2 | `(-2296, -2494)` | On top of the confiscated heap at the cart barn. |
| F3 | `(-2450, -2426)` | Inside the hole in the hedge. |
| F4 | `(-2700, -1900)` | On the fountain platform in the lake. |
| F5 | `(-2000, -2098)` | On the clock tower ledge at 14 m. |
| F6 | `(-1085, -2312)` | Behind the model home, where the tour never goes. |
| F7 | `(-2960, -2600)` | End of Loon Lane: the only resident of Phase Four. |
| F8 | `(-898, -1904)` | On the Gatehouse roof, behind Bev. |
| F9 | `(-1700, -2220)` | Middle of the 9th fairway, as a yardage marker. |
| F10 | `(-2000, -1545)` | Taped to the back of the south gate's sign. |

Big Air ramps:

- R1: Cart barn loading ramp, `(-2300, -2480)`, south over the hedge onto the 11th green. Tier B.
- R2: The 16th tee deck, `(-2520, -1990)`, south-east over 60 m of lake. Tier B.

Postcards:

- P1: Twelve identical houses and one clock. Stand at `(-1985, -1720)`, look east. Tier B.
- P2: The fountain at sunset. Stand at `(-2700, -2060)`, look south. Tier B.

## 10. Checks

1. Every house wall is one of the four approved hex values; no two neighbours on a lane share one.
2. The pars in section 11 sum to 71; all 36 tee and green seeds are inside the perimeter.
3. The traffic system generates zero kerb-parked cars in the zone.
4. A Birdie can path from `(-2000, -2100)` through `(-2450, -2420)` to the Easement Track. A Tarpon cannot.
5. The clubhouse clock hands match the game clock to the minute.
6. Fairway Drive is 2,300 to 2,500 m long, from within 15 m of `(-900, -1900)` to within 15 m of `(-3000, -2500)`.

## 11. The golf course

Eighteen holes, tier A as terrain; the derby on the 9th is B. A fairway is a capsule 40 m wide from tee to green (60 m on the 9th); a green is a disc of radius 12 with a 2.4 m flag. A 3 m cart path joins each green to the next tee, crossing Fairway Drive at `(-2295, -2197)`, `(-2400, -2233)` and `(-2553, -2260)`. The brochure says par 72. The card adds up to 71. The association has ruled that the card is wrong.

| Hole | Tee | Green | Par | Hazard |
|---|---|---|---|---|
| 1 | (-1890,-2120) | (-1620,-2105) | 4 | Sprinklers start when a ball lands. |
| 2 | (-1600,-2060) | (-1680,-1975) | 3 | Fairway Drive, 45 m past the green. |
| 3 | (-1650,-1950) | (-1450,-1860) | 4 | A bunker shaped like a duck. |
| 4 | (-1450,-1905) | (-1460,-2050) | 3 | Show-home gardens down the right. |
| 5 | (-1455,-2090) | (-1470,-2370) | 4 | A ball within 5 m of the leaf blower moves 3 m. |
| 6 | (-1500,-2395) | (-1880,-2390) | 5 | The hedge, the whole right side. |
| 7 | (-1900,-2350) | (-1790,-2290) | 3 | Three ponds with fountains. |
| 8 | (-1760,-2310) | (-1540,-2290) | 4 | Twelve identical palms down the middle. |
| 9 | (-1520,-2230) | (-1880,-2210) | 5 | None. Wide and flat. |
| 10 | (-2110,-2180) | (-2140,-2390) | 4 | Carts cut across at their own pace. |
| 11 | (-2190,-2390) | (-2300,-2280) | 3 | Bunkers front and back. |
| 12 | (-2290,-2160) | (-2200,-1900) | 4 | A patrol cart parks on the green. |
| 13 | (-2240,-1870) | (-2400,-2130) | 4 | Bylaw suns himself here from 11:00 to 14:00. |
| 14 | (-2380,-2270) | (-2450,-2400) | 3 | The hedge, 20 m behind the green, and its hole. |
| 15 | (-2510,-2380) | (-2600,-2130) | 4 | Fairway Drive crosses the middle. |
| 16 | (-2560,-2100) | (-2440,-1740) | 5 | 135 m of Lake Serenity to carry. |
| 17 | (-2410,-1740) | (-2190,-1660) | 4 | Ibis Bend gardens. Balls come back, harder. |
| 18 | (-2150,-1650) | (-2100,-2010) | 5 | A plastic green as fast as glass. |

## 12. The association's rules

Exact text, one per frame.

```text
1. Lawns shall be between 6.0 and 6.5 centimetres. Measurements are taken at random and at dawn.
2. Houses may be cream, sage, dove or blush. Requests for other colours will be framed and displayed.
3. No vehicle may be parked on a street. A vehicle that has stopped moving is parked.
4. Garage doors shall remain closed, including while a car is passing through them.
5. One tree per lot. The tree is provided. The tree is not to be encouraged.
6. Ducks, grackles, coots, cormorants, vultures, ibis and all birds in Appendix B are banned from the lake. The birds have been notified.
7. Residents shall not name, feed, photograph or make eye contact with the alligator.
8. Honking is permitted on the second Tuesday of the month between 14:00 and 14:05.
9. Firearms may be discharged at trespassers between 08:00 and 20:00. After 20:00, fit the suppressor provided.
10. Holiday lights may be displayed for nine days. They shall be white. They shall not twinkle.
11. Garden gnomes are not permitted. A gnome seen leaving is no longer the association's concern.
12. Laundry shall not be visible from the street, the fairway, the lake or the air.
13. Buses are prohibited. This includes buses that are only visiting.
14. Golf carts have right of way over cars, pedestrians, weather and rule 3.
15. Pool noodles are flotation devices and require a permit. Flamingo-shaped items require a hearing.
16. Guests staying longer than one sunset must be registered at the Gatehouse and described.
17. A complaint about a rule must cite the rule. Complaints about rule 17 will not be read.
18. One flag per house. The flag shall be the association's.
19. The clubhouse clock is correct. Residents whose watches disagree shall adjust the watch.
20. No trade may be carried on within the wall. Fines double when paid late and triple when paid with a remark.
```

## New names

- Lanes: Starling Approach, Goose Crossing, Pigeon Place, Gull Close, Crow Court, Magpie Mews, Moorhen Court, Anhinga Lane, Limpkin Loop, Dodo Drive, Loon Lane, Buzzard Bend, Gander Road.
- The Easement and its track, outside the north hedge.
- The Mallard, The Drake, The Teal, The Canvasback: house models.
- Bylaw: the alligator in Lake Serenity. Greens Patrol: Bellweather's armed security, run by Chad and Brad.
- The Nineteenth: the clubhouse terrace bar.
- golfer, guard: two kinds of people, tier B.
