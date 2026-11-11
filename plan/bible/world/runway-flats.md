# Bible · world · Runway Flats

Runway Flats is Bayhaven International and the Speedbowl: a glass terminal, a tower, an 1,800 m runway you can drive on, a row of hangars, and a banked oval where Mags won in a car she built. It is the flattest, emptiest, windiest part of the city, made of long fences and longer straights. Route 44 runs up its west edge on the way to the Glades. After the last flight the real traffic starts: planes with no lights, vans with no plates, and a customs office paid not to count.

Tier: A for the zone, its roads, the kit recipes marked A, the terminal, the tower, the runway and the oval itself (day 8). The rest is B, C or D.

## 1. Feel

Wide and windy. The ground is concrete, mown grass and painted lines. A jet comes in low over Route 44 every few minutes and everything shakes. At the east end the Speedbowl is a bright bowl of grandstands, empty six days a week and deafening on Fridays. At night it is rows of blue and amber lights at ground level and one green and white beacon turning.

Any screenshot must show:

1. A long chain-link fence with something big and flat behind it.
2. A light on a pole: a runway light, a floodlight mast or the tower beacon.
3. An aircraft, a windsock or a grandstand against the sky.

## 2. Neighbourhoods

District bounds `[700, 3200] × [-2700, -1600]`. The canon names no neighbourhoods here, so seven areas carry the block recipes. Run the tests in order; the first match wins.

| # | Area | Test |
|---|---|---|
| 1 | Airfield | `z < -2300` |
| 2 | Speedbowl grounds | `x >= 2440` and `z > -2140` |
| 3 | Hangar Row | `x >= 2140` and `z <= -2140` |
| 4 | Terminal | `x` 1250 to 1800 |
| 5 | Long Stay | `x > 1800` |
| 6 | Rental Row (`z > -1960`) and Layover (`z <= -1960`) | `x < 1250` |

### Kit

Sizes are width×depth in metres. Concrete `#c8ccd2`, glass `#b8cfe0` and `#2e4a6b`, trim `#fdf6ea`, metal `#e0e0e6`. Lights: runway edge white `#fdf6ea`, taxiway blue `#4d8dff` (new to the palette), amber `#ffa02e`, threshold green `#5dff9b` and red `#ff5a5a`.

| id | Recipe | Footprint | Floors × height | Walls and roof | Street level | Tier |
|---|---|---|---|---|---|---|
| `rf-garage` | Parking garage | 100×60 | 5 × 3 | open concrete decks `#c8ccd2`, rail bands `#fdf6ea`, a drivable roof | a spiral ramp of radius 12 at one end, a barrier arm | A |
| `rf-hangar` | Hangar | 50×40 | 1 × 14 | `#c8ccd2`, shallow arched roof `#e0e0e6` | a sliding door 40×10 on the airside, a number 6 m high on the landside | A |
| `rf-rental` | Rental lot | hut 10×6, canopy 20×8 | 1 × 3.2 | `#f7f3ea` with one band from the pastel set | 24 identical cars in rows, a pole sign 12 m | A |
| `rf-lot` | Surface car park | 150×100 | none | asphalt `#3b3946` | 400 bays, 6 light masts 14 m, a shuttle shelter | A |
| `rf-hotel` | Airport hotel | 60×16 | 6 × 3.2 | `#c8ccd2`, window bands `#b8cfe0` | a canopy 12×8, a sign on the roof edge | B |
| `rf-shed` | Cargo shed | 60×30 | 1 × 9 | `#e0e0e6`, flat roof | four roller doors, a loading dock | B |

### Block recipes

| Area | Shares (%) | Parking | Per 100 m of street |
|---|---|---|---|
| Terminal | hero lots, and two `rf-garage` inside Terminal Loop at `(1400, -1860)` and `(1600, -1860)` | garages 60% full by day, 30% at night | 4 palms, 3 light masts, 2 signs |
| Rental Row | `rf-rental` 70, `rf-lot` 20, `ng-drive` 10 (Northgate kit) | the lots themselves | 1 palm, 2 pole signs, 4 flagpoles |
| Layover | `rf-hotel` 40, `ng-motel` 30, `rf-shed` 30 | 40% of lot, half full at night | 1 palm, 2 light masts, 30 m of chain-link |
| Long Stay | `rf-lot` 100 | 70% full, always | 3 light masts, 1 row sign |
| Hangar Row | `rf-hangar` 85, `rf-shed` 15 | 10 bays per hangar, 30% full | 100 m of chain-link, 2 light masts |
| Airfield | no buildings: pavement `#c8ccd2`, grass `#6a8f4e` | none | lights as section 12 |
| Speedbowl grounds | car parks, 6 souvenir stalls 4×3 | 2,000 bays, empty except Friday | 2 light masts |

## 3. Streets

Route 44, Holding Pattern Road and Tailwind Avenue are 22 m avenues; the rest are 14 m streets. All are straight and tier A.

| Name | Line | Extent |
|---|---|---|
| Route 44 (4 lanes) | `x = 700` | `z` -2700 to -1600; on to the expressway south and the Glades north |
| Holding Pattern Road (Gateway Boulevard continues as this) | `z = -1800` | `x` 600 to 1280 |
| Terminal Loop (one way, anticlockwise, 14 m, 3 lanes) | rounded rectangle `x` 1280 to 1720, `z` -1960 to -1760, corner radius 40 | the terminal kerb is its north side |
| Final Call Road | `z = -1800` | `x` 1720 to 2440, ending at the Speedbowl's west gate |
| Red-Eye Road | `z = -1640` | `x` 700 to 3050 |
| Tailwind Avenue (north from the expressway ramp at `x = 2200`) | `x = 2200` | `z` -2140 to -1600 |
| Go-Around Road (the hangars' landside) | `z = -2140` | `x` 2200 to 3050 |
| Crosswind Road | `x = 3050` | `z` -2600 to -1640 |
| Runway Road (outside the north fence) | `z = -2600` | `x` 700 to 3050 |
| Layover Lane | `z = -2100` | `x` 700 to 1250 |
| Standby Street | `x = 1000` | `z` -2100 to -1640 |
| Carry-On Court (cul-de-sac) | `z = -1720` | `x` 1000 to 1180 |
| Lost Luggage Lane (service lane, 8 m) | `x = 1250` | `z` -2260 to -2100 |
| Pit Road (the racers' way in) | `x = 2700` | `z` -2140 to -1980, then across the track into the infield |

## 4. Landmarks

A seed is the landmark's centre unless stated. Parts are width×depth×height in metres.

**The terminal**, `terminal`, seed `(1500, -2000)`, footprint 260×230 with its pier, roof 18 m, tier A.
Silhouette: a long glass box under a thin white roof tilted like a wing.
Parts: hall 240×60×14, glass `#b8cfe0` in a concrete frame; roof slab 260×72×1.5 `#fdf6ea`, tilted 4° up to the north; kerb canopy 240×10 at 6 m; pier 30×160×8 running north from the hall's middle, with six jet bridges 12×3×3; roof letters 1.5 m high; two parked jets, each a box 30×3.4×3.4 with a 28 m wing and a tail in `#ff8f7a`.
Night: the hall is a lit cyan box. The apron floodlights are amber.
Player: the Bay Cab rank is at the kerb. The front is breakable glass with doors 12 m wide: a car fits through the hall.

**The control tower**, `control-tower`, seed `(1650, -2100)`, base 8×8, 58 m, tier A.
Silhouette: a concrete stalk with a wider dark glass cab.
Parts: shaft 8×8×44 `#c8ccd2`; cab, an 8-sided drum of radius 7, 6 m high, glass `#2e4a6b`, walls leaning out 15°; a catwalk at 44 m; a 6 m mast; a caged ladder up the south face.
Night: the cab glows dim green. A roof beacon turns every 5 s, green then white.
Player: the tallest thing in the district; a climb for Teo.

**The runway**, `runway`, from `(1000, -2450)` to `(2800, -2450)`, 1,800×60, tier A. Geometry in section 12.
Silhouette: a strip of lights converging on the horizon.
Player: drive it. A follow-me truck tries to lead you off, and a jet goes around if you are in its way.

**The Speedbowl**, `speedbowl`, seed `(2700, -1850)`, oval 400×250, stands to 24 m, tier A for the oval, wall and plain stands; B for the full grandstands and pit lane. Geometry in section 11.
Silhouette: a pale bowl, a stepped stand on one side, eight light masts.
Night: on Fridays the masts turn the bowl white. Other nights, four safety lamps.
Player: Friday race night at 19:00, mission 14, time trials (C), and laps whenever you like: the Pit Road gate is never shut. Bookies work the infield, and some races are fixed.

**Hangar Row**, `hangar-row`, seed `(2400, -2200)`, six hangars over 350 m, 14 m, tier B.
Silhouette: six arched sheds with giant numbers.
Parts: six `rf-hangar` at `x = 2250 + 60i` for `i` 0 to 5, centred on `z = -2190`, doors facing north. Hangar 1: a Low Altitude Airlines jet with its nose off. Hangar 2: Bellweather's Tropicbird (D). Hangar 4: a Sandhill (D). Hangar 5: the Dragonfly (C). Hangar 3: empty by day; the 02:40 night flight unloads here behind a shut door. Hangar 6: empty, door open.
Night: one door open and warm; the rest dark with a red lamp each.
Player: aircraft spawn here when their tiers ship. Hit Hangar 3 during the night flight and six armed men shoot back.

**Rental Row**, `rental-row`, seed `(1100, -1750)`, three lots along Standby Street and Carry-On Court, signs 12 m, tier B.
Silhouette: three pole signs over fields of identical white cars.
Parts: three `rf-rental` lots: Dent-A-Car at the seed, Tern Around at `(1060, -1690)`, Shore Thing at `(1140, -1690)`. Every car is a white Snook with a band in the lot's colour.
Night: canopy lights on.
Player: any car can be stolen. They are the nearest undented cars for the Mallard Greens gate. Shore Thing rents for cash with no licence: the crews' car pool.

**The Layover Diner**, `layover-diner`, seed `(900, -2100)`, footprint 24×10, plane top 16 m, tier C.
Silhouette: a silver diner under a small plane on a pole, nose up.
Parts: diner 24×10×4 `#e0e0e6` with a stripe `#ff5a5a` and rounded ends; pole 1×1×12; plane: fuselage 14×1.6×1.6, wing 12×2×0.3, tail fin 2×0.3×2.5, pitched up 15°, white with a `#ff8f7a` stripe
Night: pink and cyan neon round the diner; the wingtips blink red and green.
Player: food.

**The radar dome**, `radar-dome`, seed `(2950, -2360)`, base 6×6, 30 m, tier B.
Silhouette: a white ball on a lattice tower.
Parts: lattice tower 6×6×18 `#6f6a78`; a 12-sided ball of radius 6 `#ffffff`; a ladder.
Night: up-lit pale blue, one red light on top.
Player: a climb, and a marker for the runway's east end.

**Spotters' Mound**, `spotters-mound`, seed `(800, -2530)`, 60×40, 8 m, tier B.
Silhouette: a grassy bump with a bench, under the flight path.
Parts: three stacked ellipses to 8 m, `#6a8f4e`; a bench; three folding chairs.
Night: dark, beside the approach lights.
Player: a jet passes 25 m overhead. The east face is a Big Air ramp.

**Lost Luggage**, `lost-luggage`, seed `(1200, -2200)`, shed 60×30, 9 m, tier C.
Silhouette: a cargo shed beside a hill of suitcases.
Parts: one `rf-shed`; a heap 12×12×5 of 200 instanced suitcases 0.8×0.3×0.5 in the pastel set; a conveyor 20×1×1 that ends in mid-air; four Gopher tugs (C).
Night: one roller door open and lit.
Player: suitcases scatter as pooled debris. One in twenty spills cash or sealed packets: the handlers' side business.

**The blimp mast**, `blimp-mast`, seed `(2800, -2250)`, mast 24 m, blimp 50 m long, tier D.
Silhouette: a fat pink airship nosed up to a pole.
Parts: mast 2×2×24 `#6f6a78`; the Pufferfish blimp, an 8-sided ellipsoid 50×18×18 `#ff9eb5`, four fins, a gondola 6×2×2, "SPF 1000" along its side.
Night: lit from inside like a paper lantern.
Player: it swings with the wind.

## 5. Places of use

| Place | Use | Seed | Tier |
|---|---|---|---|
| Bay Cab rank, terminal kerb | cab fares start here | `(1440, -1962)` | A |
| Runway crash gates | breakable gates onto the airfield | `(1000, -2570)` `(2800, -2570)` | A |
| Pit Road gate | the way onto the oval | `(2700, -1980)` | A |
| Garage roofs | change cars unseen; rooftop ramp on the east one | `(1400, -1860)` `(1600, -1860)` | A |
| Bus stop, the 44 bus | Bayhaven International, terminal kerb on Terminal Loop (the airport's own Long Stay shuttle is not a city route) | `(1500, -2000)` | B |
| Dent-A-Car, Tern Around, Shore Thing | rental lots | `(1100, -1750)` `(1060, -1690)` `(1140, -1690)` | B |
| Birdbath Car Wash | doubles viewer drain inside | `(1180, -1730)` | B |
| Pelican Fuel | petrol, Route 44 at Holding Pattern Road | `(745, -1830)` | B |
| Storm Mart | life vest, flares, noodles | `(760, -1960)` | B |
| Speedbowl south gate | Friday race night, 19:00 | `(2700, -1685)` | B |
| Speedbowl infield, hauler park | mission 14 | `(2700, -1900)` | B |
| Start and finish line | time trials | `(2700, -1734)` | C |
| The Layover Diner | food | `(900, -2100)` | C |
| Bus stop, the 44 bus | The Layover Diner | `(900, -2100)` | B |
| Hangar 5 | Dragonfly helicopter | `(2490, -2190)` | C |
| Hangar 3 | the night flight, 02:40: twelve bales, six armed men, one Pompano | `(2370, -2190)` | B |

## 6. Street life

`taxi` is the Bay Cab Tarpon. Until a vehicle is built, its weight goes to `pompano`. Ids marked * are tier C.

| Band | Hours | Traffic weights |
|---|---|---|
| Dawn | 05:00 to 08:00 | taxi 5, tarpon 3, pompano 3, manatee 2, hogfish 2, grouper 1 |
| Day | 08:00 to 17:00 | taxi 6, tarpon 4, snook 3, pompano 3, manatee 2, grouper 2, hogfish 1, sturgeon 1 |
| Golden | 17:00 to 21:00 | taxi 5, tarpon 3, snook 2, manatee 1. On Fridays, until 23:00, add wahoo 4, mullet 4, hogfish 2, remora 1, all bound for the Speedbowl |
| Night | 21:00 to 05:00 | count × 0.3: taxi 3, hogfish 2, pompano 1 |

Airside, outside the lane graph: four gopher* tugs looping the apron and one mullet with a "Follow me" board.

Jets (scenery, tier B): one Low Altitude Airlines jet every 3 real minutes, from the west on a 3° slope. It crosses Route 44 at 40 m, touches down at `x = 1300`, slows to `x = 2600`, leaves by taxiway D and parks. If a vehicle is on the runway it climbs away at 60 m and tries again in 90 s.

People: traveller* 6 (a wheeled bag, kerb to door), tourist 3, office worker 2 (crew in pairs), dock worker 1 (ground crew). `traveller` is tier B; until built it is `tourist`. On Fridays from 17:00 add 60 fans (tourist and clubber) at the Speedbowl gates.

Vignettes:

1. Terminal kerb, all day: a wheeled bag gets away. Its owner follows at a dignified walk.
2. Rental Row, 10:00: a family circles a white Snook, photographing every scratch already on it.
3. Spotters' Mound, 17:30 to 19:00: three people in folding chairs duck as one when a jet passes.
4. The runway, whenever you are on it: the follow-me truck comes out to be followed. After 20 s it gives up and reports you: heat 1.
5. Taxiway D, 02:40: a twin-engine plane lands with no lights and rolls to Hangar 3. A Pompano with no plates backs in. Ninety seconds later both are gone. The tower stays dark; somebody is paid for that.
6. Pit Road, Friday 18:00: haulers queue nose to tail. In the infield a bookie takes bets out of a toolbox, and a deputy places one.
7. Lost Luggage, 04:00: two handlers slit a suitcase lining, take out a brick, tape the case shut and send it on. "Not my fucking bag."

Parked cars: none at any kerb. Car parks fill from the shuttle shelter outward. Rental lots are always full.

## 7. Sound bed

| Layer | Recipe | When |
|---|---|---|
| Wind | band-passed noise in slow gusts | always, louder on the airfield |
| Jet pass | an 8 s noise sweep falling in pitch; a camera shake under the flight path | with each jet |
| Terminal chime | two notes, then muffled voice blips | every 60 to 120 s, within 150 m of the terminal |
| Halyards | a clink on a flagpole | in wind, at rental lots and the Speedbowl |
| Speedbowl | an engine drone rising and falling once a lap, and a crowd swell | Friday 19:00 to 22:00, across the district |
| Night flight | one pair of propellers, low, no lights, then quiet | 02:40 |

## 8. Signs

```text
Bayhaven International: you are almost somewhere
Departures
Arrivals. Good luck.
Low Altitude Airlines: we see your house from here
Low Altitude Airlines: now boarding group 9
Terminal Loop: one way. The other way is not a way.
Kiss and fly. Hug and circle.
Long Stay parking. Longer than you think.
Row Q. You parked in Row Q. Remember Row Q.
Rental returns: follow the white Snooks
Dent-A-Car: it comes that way
Tern Around Rentals: back before you know it
Shore Thing Rentals: cash, no licence, no questions
Holding Pattern Road
Layover Lane
Carry-On Court
Red-Eye Road
Final Call Road
Lost Luggage Lane
Unattended bags will be opened, enjoyed and sold
Caution: low aircraft. Hold on to your hat.
Customs: nothing to declare? Sure you don't.
Spotters' Mound: duck
Airfield: trespassers will be shot at. Badly, but often.
Follow me
Runway 09
Runway 27
Hangar 3: private. Fuck off.
The Layover Diner: pie holds better than your flight
Exit 44: Big Earl's, 1 km
Route 44 north: Mudcat Glades, Lake Minnow
The Speedbowl: racing every Friday
Speedbowl: left turns since 1961
Gate 1: grandstand. Gate 2: also grandstand.
Pit lane: slow the fuck down
Tonight: stock cars. Ear plugs $2.
No betting. Bets at window 3.
Track record: M. Calloway. Still.
SPF 1000: the sun can't see you
Welcome to Bayhaven. Mind the weather at 3:15.
```

## 9. Things to find

Flamingos, all tier B:

| # | Seed | Why here |
|---|---|---|
| F1 | `(1650, -2096)` | On the tower catwalk at 44 m, up the ladder. |
| F2 | `(1900, -2390)` | At the windsock, between the taxiway and the runway. |
| F3 | `(2790, -2450)` | On the painted "27" at the runway's east end. |
| F4 | `(900, -2104)` | Under the plane on a pole. |
| F5 | `(2700, -1850)` | At the foot of the Speedbowl's scoring pylon. |
| F6 | `(2700, -1697)` | Top row of the main stand, under the press box. |
| F7 | `(1400, -1860)` | Last bay on the roof of the west garage. |
| F8 | `(1205, -2206)` | On top of the suitcase hill. |
| F9 | `(800, -2530)` | On the Spotters' Mound bench, watching. |
| F10 | `(2950, -2360)` | Under the radar dome. |

Big Air ramps:

- R1: Spotters' Mound, `(820, -2525)`, heading east over the fence onto the airfield. Tier B.
- R2: East garage roof, `(1600, -1880)`, heading north over Terminal Loop onto the terminal's wing roof. Tier B.
- R3: Turn 2 of the Speedbowl, `(2895, -1850)`: above 150 km/h the banking throws a car over the wall into the car park. Tier C.

Postcards:

- P1: The whole oval with the city behind it. Stand on the top row of the back stand at `(2700, -1999)`, look south. Tier B.
- P2: Runway lights at dusk. Stand on the "09" at `(1010, -2450)`, look east. Tier B.

## 10. Checks

1. `map.districtAt` returns `runwayflats` for the seven canon seeds.
2. `map.heightAt` varies by less than 0.05 m over `x` 1000 to 2800, `z` -2480 to -2420; a scripted drive from `(1000, -2450)` to `(2800, -2450)` meets no obstacle.
3. A lap of the Speedbowl's racing line measures 1,029 m ± 10; the surface tilts 18° ± 1 at `(2891, -1850)`.
4. Terminal Loop's lane graph has no clockwise edge.
5. The control tower is the tallest mesh in the zone and is under 60 m.
6. Six hangars stand at `x = 2250 + 60i`; nothing is built inside the fence north of `z = -2300`.

## 11. The Speedbowl's geometry

Centre `(2700, -1850)`, long axis east to west. Tier A unless marked.

| Piece | Numbers |
|---|---|
| Outer edge | a stadium shape 400×250: two straights 150 m long from `x = 2625` to `x = 2775`, two half circles of radius 125 centred on `(2625, -1850)` and `(2775, -1850)` |
| Track | 18 m wide. Inner radius 107, racing line radius 116. A lap on the racing line is 1,029 m |
| Banking | 18° in the turns, 6° on the front straight, 9° on the back, blended over 30 m. A turn's outer edge is 5.6 m above its inner |
| Direction | anticlockwise on the map: east along the front (south) straight |
| Turns | 1 and 2 at the east end, 3 and 4 at the west end |
| Start and finish | a chequered line at `x = 2700`, `z` -1743 to -1725 |
| Apron | a flat 6 m strip inside the track |
| Outer wall | 1 m high `#fdf6ea`, a 6 m catch fence above it |
| Pit lane (B) | inside the front straight: pit wall at `z = -1749`, lane 8 m wide from `z = -1750` to `-1758`, `x` 2590 to 2810; ten pit boxes 14×5 from `x = 2630` to `2770`; a garage block 140×10×5 behind them |
| Infield | grass; a scoring pylon 2×2×20 at the centre; hauler park 60×30 at `(2700, -1900)`; victory pad 10×10 at `(2700, -1790)` |
| Crossing | Pit Road crosses the back straight at `x = 2700` through two wall gates 10 m wide |
| Main stand (plain A, full B) | five blocks S1 to S5, each 56×28×16 in 8 steps, centred on `x` = 2580, 2640, 2700, 2760, 2820, front edge `z = -1721`, back `z = -1693`; a roof over S3 with a press box 20×6×4, top at 24 m |
| Back stand (B) | three blocks N1 to N3, each 56×20×10, centred on `x` = 2640, 2700, 2760, from `z = -1979` to `-1999` |
| Turn stands (B) | two blocks 20×56×8 at `(2916, -1850)` and `(2484, -1850)` |
| Light masts | eight, 30 m: at `x` = 2500, 2700, 2900 on `z = -1690` and `z = -2005`, one beyond each turn stand |
| Gates | south gate `(2700, -1685)`, west gate `(2440, -1800)`, Pit Road gate `(2700, -1980)` |
| Seats | `#ff9eb5`, `#8fe3cf`, `#ffc98f`, `#9fd2ff` in bands of four rows |

## 12. The runway and taxiways

| Piece | Numbers |
|---|---|
| Runway 09/27 | centre line `z = -2450`, `x` 1000 to 2800, 60 m wide, asphalt `#3b3946`. "09" painted at the west end, "27" at the east, numerals 18 m tall |
| Runway paint | centre dashes 30 m on, 20 m off; eight threshold stripes 30×1.8 at each end |
| Runway lights | white edge lights every 60 m on both sides; a green bar of 12 lights at each threshold, red seen from behind |
| Approach lights | amber bars on poles at `x` = 940, 880, 820, 760, on `z = -2450`, rising from 2 m to 8 m toward Route 44 |
| Taxiway | parallel, centre line `z = -2340`, `x` 1000 to 2800, 23 m wide, concrete `#c8ccd2`, a yellow centre line, blue edge lights every 30 m |
| Connectors A to E | 23 m wide, from the taxiway to the runway, at `x` = 1000, 1450, 1900, 2350, 2800 |
| Terminal apron | `x` 1300 to 1750, `z` -2328 to -2030, six stands along the pier |
| Hangar apron | `x` 2200 to 2620, `z` -2328 to -2210 |
| Windsock | on a 6 m pole at `(1900, -2390)`; it points with the weather system's wind |
| Fence | chain-link 3 m: north `z = -2570`, west `x = 950`, east `x = 2850`; the south side follows the aprons and Go-Around Road. Panels splinter like any fence |

## New names

- Streets: Final Call Road, Tailwind Avenue, Go-Around Road, Crosswind Road, Standby Street, Lost Luggage Lane, Pit Road.
- Areas: Airfield, Terminal, Long Stay, Layover, Speedbowl grounds.
- Tern Around, Shore Thing: rental lots beside Dent-A-Car.
- Landmarks: Spotters' Mound, Lost Luggage, the radar dome, the blimp mast.
- traveller: a kind of person, tier B.
