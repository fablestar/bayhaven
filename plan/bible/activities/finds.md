# Bible · activities · Things to find

The 234 things to find in the city: 100 lawn flamingos, 40 postcards, 10 gnomes, 24 mixtapes, 20 Gerald sightings and 40 Lawyer Larry billboards. Every one has a seed and a line a player could follow. Big Air ramps are in `big-air.md`.

Tier: A for flamingos 1 to 40 and postcards 1 to 10. B for flamingos 41 to 100, postcards 11 to 30, the gnomes, mixtapes 1 to 14, Gerald and the billboards. C for postcards 31 to 40 and mixtapes 15 to 24.

## How finds work

| Kind | How it is taken | Save key |
|---|---|---|
| Flamingo | Run it over or walk into it. Pink plastic, 1 m tall, glows faintly at night. | `found.flamingos` |
| Postcard | Stand in the painted footprints, open the Camera, face within 15° of the heading, shoot | `found.postcards` |
| Gnome | Walk into it. Three need a trick, given in their row. | `found.gnomes` |
| Mixtape | Walk into the cassette. It spins and hums the song's first bar. | `found.mixtapes` |
| Gerald | Photograph him from within 25 m during his hours. He leaves 5 s later. | `found.gerald` |
| Billboard | Drive through one of its two wooden legs at 40 km/h or more, or hold Interact at its ladder for 4 s to paint it | `found.billboards` |

- Data is `src/content/collectibles.js`; the runner is `src/systems/finds.mod.js`. Ids are the numbers below.
- Each find emits `collect:found {kind, id, district}`. A finished set is worked out from those events and the saved list. Postcards and Gerald also need `photo:taken`. A billboard leg emits `prop:broken`.
- Teo's Go Live shows finds within 150 m on the minimap.
- Placement check (D7.6): every seed snaps within 25 m to land, outside every building box and 3 m or more from a road centre line. Hints that name a roof or a ledge mean the find sits on it.
- Test API: `test.finds.list(kind)`, `test.finds.collect(kind, id)`.
- Until weekdays exist, a row that names a weekday runs every day.

## Lawn flamingos

$250 each. All ten in a district unlock that district's shirt. All 100 unlock the golden lawn flamingo, a weapon that never breaks.

### Tideline · 1 to 10 · tier A · shirt: Promenade Pink

| # | Seed | Hint |
|---|---|---|
| 1 | `(330, -212)` | Outside Park & Sons, by the tyre stack |
| 2 | `(-1262, -208)` | Behind Mags's trailer, where Gerald eats |
| 3 | `(12, -8)` | In the plaza, under the rooftop sign |
| 4 | `(-1158, 82)` | On the Yacht Club's fuel dock |
| 5 | `(4, 63)` | On the roof of a lifeguard hut |
| 6 | `(-700, -100)` | On a motel sign's neon arrow |
| 7 | `(-450, 47)` | On Heron Walk, between two palms |
| 8 | `(700, 76)` | At the waterline, where the foam stops |
| 9 | `(1420, -140)` | Ground floor of a half-built condo |
| 10 | `(-1480, -130)` | In a bait shop's ice chest |

### Meridian · 11 to 20 · tier A · shirt: Spire Stripe

| # | Seed | Hint |
|---|---|---|
| 11 | `(40, -868)` | In the big planter at the Spire's foot |
| 12 | `(-200, -548)` | In City Hall's fountain |
| 13 | `(60, -845)` | On the island of Spire Circle |
| 14 | `(92, -477)` | In a hotel's revolving door |
| 15 | `(-520, -765)` | On a newsroom's third-floor ledge |
| 16 | `(300, -900)` | Beside a plaza sculpture, looking like one |
| 17 | `(-250, -1200)` | Top of the courthouse steps |
| 18 | `(-640, -1438)` | In the shade of the expressway |
| 19 | `(680, -730)` | In a bank's doorway on Exchange Avenue |
| 20 | `(-740, -380)` | Where Meridian meets Palma Vieja |

### Palma Vieja · 21 to 30 · tier A · shirt: Mural

| # | Seed | Hint |
|---|---|---|
| 21 | `(-1392, -872)` | Under Rafa's table in Domino Park |
| 22 | `(-1340, -952)` | Top landing of the bell tower |
| 23 | `(-1024, -800)` | Among the painted flamingos on the mural wall |
| 24 | `(-1028, -648)` | First in the queue at Ventanita Rosa |
| 25 | `(-1580, -1250)` | Pegged to a laundry line |
| 26 | `(-1900, -700)` | Where the street lights stop |
| 27 | `(-1420, -380)` | Among the dishes on a workshop roof |
| 28 | `(-1140, -925)` | In the string lights over Calle Siete |
| 29 | `(-860, -1300)` | In a corner shop's fruit crate |
| 30 | `(-1760, -950)` | On a tiled roof facing the bell tower |

### Rustwater · 31 to 40 · tier A · shirt: Hi-Vis Hibiscus

| # | Seed | Hint |
|---|---|---|
| 31 | `(2890, -318)` | Between the legs of the first crane |
| 32 | `(3040, -290)` | On a bollard at the ship's bow |
| 33 | `(2508, 92)` | End of the cruise terminal's gangway |
| 34 | `(2700, -250)` | In an open yellow container |
| 35 | `(2100, -640)` | On the buffer where the rails end |
| 36 | `(2300, -900)` | On the warehouse with a faded 7 |
| 37 | `(2190, -1450)` | Under the east ramp, in the dry |
| 38 | `(3100, 60)` | South-east corner of the quay |
| 39 | `(2000, -100)` | In the hi-vis bin by the port gate |
| 40 | `(2840, -1350)` | On four blue containers |

### The Paintworks · 41 to 50 · tier B · shirt: Wet Paint

| # | Seed | Hint |
|---|---|---|
| 41 | `(1296, -812)` | On the middle chimney's ladder |
| 42 | `(1104, -612)` | Painted to match an alley wall |
| 43 | `(1450, -962)` | In Humidity's rooftop light rig |
| 44 | `(1004, -1108)` | In the queue for Pressed |
| 45 | `(1700, -400)` | The part of a mural that sticks out |
| 46 | `(900, -900)` | In a gallery window, priced at $40,000 |
| 47 | `(1600, -1200)` | Fourth landing of a fire escape |
| 48 | `(1200, -380)` | In a skip of dried paint tins |
| 49 | `(1750, -1020)` | Under a rooftop water tank |
| 50 | `(840, -500)` | On the line where the paint stops |

### Northgate · 51 to 60 · tier B · shirt: Clearance

| # | Seed | Hint |
|---|---|---|
| 51 | `(-492, -1712)` | In the hospital's GET WELL flower bed |
| 52 | `(212, -2162)` | In front of the Sheriff's camera truck |
| 53 | `(-190, -1990)` | Beside the giant flamingo on the Galleria roof |
| 54 | `(358, -2412)` | Front row at the Starlite, watching |
| 55 | `(108, -1742)` | Tied to Wahoo World's tube man |
| 56 | `(428, -1838)` | In Lawyer Larry's waiting room window |
| 57 | `(-350, -1840)` | Top tier of a strip-mall pole sign |
| 58 | `(-700, -2200)` | Third pharmacy in a row of four |
| 59 | `(480, -2050)` | Floating in a motel pool |
| 60 | `(-60, -2140)` | On a drive-through menu board |

### Mallard Greens · 61 to 70 · tier B · shirt: Approved Colour No. 3

| # | Seed | Hint |
|---|---|---|
| 61 | `(-908, -1892)` | On the roof of Bev's hut |
| 62 | `(-2010, -2090)` | Under the clubhouse clock |
| 63 | `(-1100, -2310)` | On the model home's lawn. It matches. |
| 64 | `(-2450, -2412)` | In the hole in the hedge |
| 65 | `(-2700, -1880)` | On Lake Serenity's fountain |
| 66 | `(-2000, -1530)` | In the keypad box at the south gate |
| 67 | `(-1500, -2000)` | Eleven legal flamingos. This is the twelfth. |
| 68 | `(-2300, -2300)` | In a bunker on the 12th |
| 69 | `(-3000, -2490)` | At a mailbox with no house |
| 70 | `(-1250, -2420)` | In a show home's half-open garage |

### Runway Flats · 71 to 80 · tier B · shirt: Layover

| # | Seed | Hint |
|---|---|---|
| 71 | `(1500, -1990)` | Going round on the baggage belt |
| 72 | `(1650, -2112)` | At the foot of the control tower |
| 73 | `(1900, -2475)` | Under the runway windsock |
| 74 | `(2700, -1850)` | Dead centre of the Speedbowl's infield |
| 75 | `(2560, -1712)` | Top row of the Speedbowl's stand |
| 76 | `(2400, -2190)` | Under a wing on Hangar Row |
| 77 | `(1108, -1742)` | In a key drop box on Rental Row |
| 78 | `(715, -2500)` | Behind a Route 44 exit sign |
| 79 | `(1300, -1660)` | Long-stay car park, row Q |
| 80 | `(3000, -2615)` | Where Runway Road meets the fence |

### Mudcat Glades · 81 to 90 · tier B · shirt: Sawgrass

| # | Seed | Hint |
|---|---|---|
| 81 | `(-400, -2972)` | Inside Big Earl, between two teeth |
| 82 | `(1208, -3258)` | On a spare fan cage at Nilda's dock |
| 83 | `(2300, -3342)` | Under the fish camp's stilts |
| 84 | `(-1000, -3032)` | In the worm fridge at Bait & Ballistics |
| 85 | `(716, -3016)` | On the crossroads sign at Route 44 |
| 86 | `(-2100, -3100)` | On a cypress dome's tallest knee |
| 87 | `(-2600, -2985)` | A mailbox with no house for a mile |
| 88 | `(2900, -3200)` | End of a boardwalk to nowhere |
| 89 | `(300, -3400)` | On a mudbank, among three real birds |
| 90 | `(-3100, -3450)` | The north-west corner of the map |

### The Islands · 91 to 100 · tier B · shirt: Causeway

| # | Seed | Hint |
|---|---|---|
| 91 | `(-1112, 442)` | Behind the island gatehouse barrier |
| 92 | `(-990, 790)` | Dead centre of Bellweather's helipad |
| 93 | `(-1350, 612)` | In Glow Camp's meditation circle |
| 94 | `(-1200, 890)` | End of a private dock |
| 95 | `(-760, 650)` | Beside a hedge cut into a flamingo |
| 96 | `(-2000, 312)` | On a pile of lost flip-flops |
| 97 | `(-2280, 532)` | In a rod holder on Tackle Key |
| 98 | `(-2400, 640)` | On the roof of the Stilt House |
| 99 | `(-2830, 992)` | Under Lime Key's only lime tree |
| 100 | `(-3100, 1210)` | Top of the lighthouse on Last Key |

## Postcards

500 followers each, doubled within an hour of the best hour. "Face" is the heading in degrees: 0 north, 90 east, 180 south. All 40 unlock the Sun-faded camera filter.

| # | Seed | Face | In the frame | Best hour | Tier |
|---|---|---|---|---|---|
| 1 | `(0, 60)` | 0 | The day 1 block, its rooftop sign, the Spire behind | 18:40 | A |
| 2 | `(64, -345)` | 0 | Coral Boulevard's palms running up to the Spire | 07:00 | A |
| 3 | `(-1240, -232)` | 180 | Pelican Rest's trailers with the sea behind | 06:30 | A |
| 4 | `(-1150, 62)` | 200 | Masts in the west marina and Sandpiper Bridge | 19:00 | A |
| 5 | `(-200, -530)` | 0 | City Hall and its fountain | 12:00 | A |
| 6 | `(40, -862)` | 0 | The Spire from its foot, camera tilted right back | 13:00 | A |
| 7 | `(-1400, -850)` | 30 | Domino tables with the bell tower over them | 18:00 | A |
| 8 | `(-990, -800)` | 270 | The mural wall, end to end | 10:00 | A |
| 9 | `(2800, -300)` | 90 | Four gantry cranes over the container ship | 06:30 | A |
| 10 | `(1300, -745)` | 0 | The paint factory's three chimneys | 16:30 | A |
| 11 | `(-188, -1940)` | 0 | The giant flamingo on Galleria Flamingo | 17:30 | B |
| 12 | `(606, 70)` | 180 | Gullwing Pier and its ferris wheel against the sunset | 18:40 | B |
| 13 | `(300, 48)` | 0 | Hotel Alba with every neon tube lit | 20:00 | B |
| 14 | `(430, -700)` | 0 | The Twin Sails and their skybridge | 08:00 | B |
| 15 | `(-300, -400)` | 0 | Bayfront Park's trees with the towers behind | 09:00 | B |
| 16 | `(-1340, -960)` | 120 | Tiled roofs, then towers, from the top of the bell tower | 17:30 | B |
| 17 | `(1100, -570)` | 0 | The length of Wet Paint Alley | 11:00 | B |
| 18 | `(1450, -905)` | 0 | Humidity's roof lights cutting the night | 23:00 | B |
| 19 | `(2330, -700)` | 90 | The beach-ball tanks, with a rainbow after the storm | 16:00 | B |
| 20 | `(2200, -1170)` | 0 | The crusher in the middle of a car | 14:00 | B |
| 21 | `(200, -2100)` | 0 | The Sheriff's HQ, its dish and its sign | 21:00 | B |
| 22 | `(350, -2350)` | 0 | The Starlite's screen over rows of car roofs | 20:00 | B |
| 23 | `(100, -1778)` | 0 | Wahoo World's tube man in mid wave | 12:00 | B |
| 24 | `(-2640, -1900)` | 270 | Lake Serenity's fountain and two eyes on the water | 07:00 | B |
| 25 | `(-860, -1900)` | 270 | The Gatehouse and the Bayhaven Tomorrow arch | 10:00 | B |
| 26 | `(-2000, -2060)` | 0 | The clubhouse and the clock that is always right | 12:00 | B |
| 27 | `(1500, -1950)` | 0 | The terminal's glass, the tower, a jet lifting off | 08:00 | B |
| 28 | `(2700, -1710)` | 0 | The whole Speedbowl from the top of the stand | 19:00 | B |
| 29 | `(-400, -2940)` | 0 | All 30 m of Big Earl | 17:30 | B |
| 30 | `(1200, -3225)` | 0 | Nilda's dock in the dawn fog | 06:00 | B |
| 31 | `(-600, -2395)` | 0 | The Sinkhole and what is left of the strip mall | 12:00 | C |
| 32 | `(-100, -2620)` | 180 | The whole city down to the sea, from Mount Seagull | 18:40 | C |
| 33 | `(-2000, -3170)` | 0 | The gate of Castaway Kingdom under its vines | 07:00 | C |
| 34 | `(-2290, 510)` | 230 | The Longspan running out towards the sunset | 19:00 | C |
| 35 | `(-2396, 612)` | 180 | The Stilt House on its legs in the water | 17:00 | C |
| 36 | `(-3085, 1185)` | 230 | The lighthouse on Last Key | 18:40 | C |
| 37 | `(-1000, 700)` | 180 | Bellweather's gates, mansion and helicopter | 16:00 | C |
| 38 | `(-2400, -690)` | 270 | The Mangrove Tunnel, green all the way through | 11:00 | C |
| 39 | `(40, -1470)` | 180 | The back of the Spire and the bay, from the expressway | 18:40 | C |
| 40 | `(1548, 96)` | 270 | Three kilometres of beach, from the Jetty | 18:40 | C |

## Gnomes

Tier B. Stolen from Mallard Greens lawns by persons unknown. All ten unlock the golden golf cart, a gold Birdie parked at Pelican Rest.

| # | Seed | Where |
|---|---|---|
| 1 | `(2905, -296)` | On the trolley of the third gantry crane |
| 2 | `(-2712, -1908)` | In the mouth of Lake Serenity's alligator. Honk and he puts it down. |
| 3 | `(70, -900)` | In the Spire's window-cleaning cradle |
| 4 | `(-205, -2005)` | Riding the giant flamingo on the Galleria roof |
| 5 | `(-392, -2986)` | In Big Earl's left nostril |
| 6 | `(-1340, -962)` | Inside the bell of the bell tower. Hit the bell. |
| 7 | `(600, 400)` | In the top car of the ferris wheel. Wait for it to come round. |
| 8 | `(205, -2155)` | In the Sheriff's satellite dish |
| 9 | `(-1005, 785)` | In Bellweather's trophy cabinet. He kept one. |
| 10 | `(3060, -300)` | On the bow of the container ship |

## Mixtapes

Each cassette adds one song to one station for good. Tapes 1 to 14 are tier B. Tapes 15 to 24 are tier C, with their stations. All 24 unlock the Deck, a cassette player that plays the radio on foot.

| # | Station | Seed | Where | Song it adds |
|---|---|---|---|---|
| 1 | Tideline 98 | `(6, -14)` | Roof of the day 1 block | "Neon Low Tide" |
| 2 | Tideline 98 | `(-300, 63)` | A lifeguard hut's radio shelf | "Last Light on Heron Walk" |
| 3 | Radio Palma | `(-1405, -885)` | Domino Park, in the tile box | "Dominó a Medianoche" |
| 4 | Radio Palma | `(-1024, -640)` | Ventanita Rosa, by the sugar | "Dos Cafecitos" |
| 5 | Bassline FM | `(1455, -945)` | Humidity's stage door | "Speaker Sweat" |
| 6 | Bassline FM | `(2410, -690)` | Where the Tank Farm meet parks | "Hundred Percent Humidity" |
| 7 | Swamp Country 94 | `(-410, -2990)` | Big Earl's gift counter | "A Song About a Third Truck" |
| 8 | Swamp Country 94 | `(1195, -3245)` | A tackle box on Nilda's dock | "Gator on the Porch Swing" |
| 9 | Low Tide Lounge | `(-305, -455)` | A bench in Bayfront Park | "Tuesday, Mostly" |
| 10 | Low Tide Lounge | `(-1235, -215)` | Pelican Rest's laundry room, only while it rains | "Rain at 3:15" |
| 11 | Bayhaven Public Radio | `(-420, -845)` | The station's lobby | "Pledge Drive Waltz" |
| 12 | Bayhaven Public Radio | `(-195, -565)` | City Hall's press room door | "Theme from the Tide Tables" |
| 13 | The Grind 24/7 | `(-1345, 605)` | Glow Camp's gift tent | "Sleep Is Cancelled" |
| 14 | The Grind 24/7 | `(45, -915)` | The Spire's lobby | "Day Forty of Nine" |
| 15 | Postcard 66 | `(-520, -65)` | Tideline Motel's reception bell | "Shoo-Bop Sunburn" |
| 16 | Postcard 66 | `(305, -1885)` | Lane two at Ten Pin Tide | "Greetings from Lane Two" |
| 17 | The Crash | `(2205, -1205)` | A crushed dashboard at the scrapyard | "Three Chords, No Brakes" |
| 18 | The Crash | `(345, -235)` | The tow yard at Park & Sons | "My Scooter Got Towed" |
| 19 | Glitterball 107 | `(-1150, 95)` | The Yacht Club's party deck | "Mirrorball Monsoon" |
| 20 | Glitterball 107 | `(355, -2405)` | The Starlite's projection booth | "Do the Frizz" |
| 21 | Reef Roots | `(-2400, 640)` | Behind the bar at the Stilt House | "Slow Boat Skank" |
| 22 | Reef Roots | `(-2555, 755)` | A houseboat deck on Hammock Key | "Offbeat Pelican" |
| 23 | Arcade FM | `(585, 415)` | Behind the Heat Lap cabinet | "Nine Seconds to Continue" |
| 24 | Arcade FM | `(-200, -1965)` | Inside the Grabby Crab at the Galleria. Win it. | "High Score Heartbreak" |

## Gerald sightings

Tier B. Gerald is at each place only during its hours. 1,000 followers each, because `@gerald.the.pelican` reposts you. All 20 unlock the pelican hat.

| # | Place | Seed | When | What he is doing |
|---|---|---|---|---|
| 1 | Pelican Rest | `(-1246, -214)` | 06:00–08:00 | On his post, beak open, waiting for Mags |
| 2 | Yacht Club | `(-1160, 84)` | 09:00–10:00 | Sitting on a "No pelicans" sign |
| 3 | The plaza | `(4, -12)` | 12:00–13:00 | On the rooftop sign, on the letter B |
| 4 | Lifeguard hut | `(600, 63)` | 14:00–15:00 | In the lifeguard's chair, on duty |
| 5 | Gullwing Pier | `(594, 426)` | 17:00–18:00 | Watching the anglers and judging |
| 6 | Hotel Alba | `(286, 6)` | 19:00–20:00 | In the valet line, as if waiting for a car |
| 7 | City Hall | `(-196, -546)` | 10:00–11:00 | Bathing in the fountain |
| 8 | Spire Circle | `(58, -843)` | 08:00–09:00 | On the island, directing traffic |
| 9 | Ventanita Rosa | `(-1026, -646)` | 07:00–08:00 | In the queue. He orders nothing. |
| 10 | Domino Park | `(-1396, -876)` | Tuesday, 18:00–21:00 | Holding the double six in his beak |
| 11 | The paint factory | `(1300, -806)` | 11:00–12:00 | One wing pink |
| 12 | The gantry cranes | `(2896, -306)` | 13:00–14:00 | Riding a container up |
| 13 | The cruise terminal | `(2504, 96)` | Wednesday, 10:00–11:00 | Greeting passengers at the gangway |
| 14 | Bayhaven General | `(-496, -1706)` | 16:00–17:00 | By the door, holding a queue ticket |
| 15 | Sheriff's HQ | `(204, -2146)` | 20:00–21:00 | On the dish. The picture breaks up. |
| 16 | Galleria Flamingo | `(-194, -1994)` | 15:00–16:00 | Beside the giant flamingo, on one leg |
| 17 | The Gatehouse | `(-896, -1896)` | Monday, 09:00–10:00 | Being refused entry by Bev |
| 18 | The Speedbowl | `(2700, -1730)` | Friday, 19:00–20:00 | On the starter's stand |
| 19 | Big Earl | `(-400, -2976)` | 12:00–13:00 | On Big Earl's head, unimpressed |
| 20 | Last Key | `(-3096, 1204)` | 18:00–19:30 | At the lighthouse rail, watching the sun go down |

## Lawyer Larry billboards

Tier B. Each board is 12 × 4 m on two wooden legs with a ladder, and shows Larry's face. Knock out a leg and the board tilts until his smile is a slope. Paint it and a doodle appears: board `n` gets doodle `(n − 1) mod 8` from this list: moustache, eye patch, clown nose, a pelican on his head, crossed eyes, a blacked-out tooth, flamingo neck, halo. If a deputy sees either, it is a `crime` and heat 1.

$100 a board, left in an envelope by Attorney Annie. All 40 make Attorney Annie your lawyer: she cuts the booking and hospital costs in `04-systems.md` to a quarter, where Larry only halves them.

**Boards 1 to 24 are on Billboard Road.** The canon's forty boards stand in a row at `z = -2456`, every 35 m from `x = -780` to `x = 585`. Three fell into the Sinkhole and five more west of Hospital Road are blank. Of the 32 from `x = -500` eastwards, every fourth is Attorney Annie's. Larry's 24, in order, are at `x =` -500, -465, -430, -360, -325, -290, -220, -185, -150, -80, -45, -10, 60, 95, 130, 200, 235, 270, 340, 375, 410, 480, 515, 550.

| # | Seed | Where |
|---|---|---|
| 25 | `(420, -1830)` | On the roof of his own office |
| 26 | `(-700, -1786)` | Gateway Boulevard, facing the hospital |
| 27 | `(715, -1700)` | Route 44, northbound |
| 28 | `(715, -2300)` | Route 44, by the joke exit signs |
| 29 | `(716, -2985)` | The crossroads at Mudcat Road |
| 30 | `(-300, -2985)` | Mudcat Road, beside Big Earl's sign |
| 31 | `(-1652, -1500)` | Beside the expressway, above Avenida Campana |
| 32 | `(40, -1500)` | Beside the expressway, facing downtown |
| 33 | `(1332, -1500)` | Beside the expressway, above Pigment Avenue |
| 34 | `(2200, -1460)` | At the east ramp |
| 35 | `(-360, -2134)` | Outlet Road |
| 36 | `(-534, -1960)` | Hospital Road |
| 37 | `(-700, -20)` | On a motel roof in Motel Row |
| 38 | `(70, -372)` | Coral Boulevard at Flamingo Avenue |
| 39 | `(1026, -900)` | Factory Avenue. The muralists got there first; add yours. |
| 40 | `(1986, -800)` | Dockside Avenue |

## New names

| Name | What it is |
|---|---|
| Promenade Pink, Spire Stripe, Mural, Hi-Vis Hibiscus, Wet Paint, Clearance, Approved Colour No. 3, Layover, Sawgrass, Causeway | The ten district shirts |
| Sun-faded | The camera filter for all 40 postcards |
| The Deck | A cassette player that plays the radio on foot |
| The 24 titles in the mixtape table | Songs, each in its station's style; the station's file writes the patterns |
