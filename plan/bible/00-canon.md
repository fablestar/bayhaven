# Bible · 00 · Canon

The bible is the deep end of the plan: the full-size vision of Bayhaven, written out. Files `01` to `08` say what the game is. The bible says what is in it, down to the street.

This file is the **canon**: every proper noun, every fixed coordinate, every roster and every format the other bible files share. If another bible file disagrees with this one, this one wins.

## 1. How to use the bible

- **Sessions read one or two bible files, never the whole thing.** Each session prompt names them.
- **Nothing here overrides the roadmap.** The bible is the whole vision; `08-roadmap.md` says what ships when. Every item in the bible carries a tier tag so nobody mistakes the vision for a promise.
- **Hard rules still apply to every line:** nothing another game owns (names, characters, story, map, logos, music, fonts, art) while the genre's conventions are free and expected, no real people, brands or places, nothing that sounds like digital money, no slurs and nothing explicit, normal sentence casing. It is a crime game for adults, in the register of its genre: lethal weapons, deaths, crews and police who shoot back, a criminal underworld with real stakes, swearing, dark jokes. It is drawn low-poly, so nothing is graphic in close-up.

### Tiers

| Tag | Means |
|---|---|
| **A** | In the day 9 build at the Mid level (the 32 roadmap sessions) |
| **B** | Bonus pool: can land before day 9 if there is compute for parallel sessions |
| **C** | After release, first month |
| **D** | The full vision: later seasons |

### Seed positions

Every coordinate in the bible is a **seed position**, written `(x, z)` in metres. The game snaps a seed to the nearest valid spot (a lot big enough, a sidewalk, a curb, open water) within 25 m, and the placement check fails the build if it can't. So a writer may be a few metres off; a seed must never be in the wrong block. A landmark seed that falls on a street line is the building's front door: the lot sits behind it, and the street may bend or end there.

**Who owns a position:** district files in `bible/world/` own every shop, stop and landmark seed in their district; `bible/world/county.md` owns every county seed; `bible/activities/finds.md` owns the real lists of flamingos, ramps, postcards and other finds. Other files copy those seeds and never invent their own.

Axes: `x` grows east, `z` grows south towards the sea, 1 unit is 1 metre, the day 1 block is at `(0, 0)`.

### Formats every bible file uses

**Mission**

```
### 05 · Open House            id: open-house · tier A · chapter 1, act 2
Giver: Mags · Leads: both · Where: Mallard Greens · Length: 7 min · Pays: $4,000 · Unlocks: as-seen-on-tv
Needs: missions, stealth, golf cart, Mallard Greens
1. goto  (-900, -1900) the Gatehouse, in a tidy car        hint: "Dents get you turned away."
2. say   tour-guide/Mags/Teo  (lines below)
...
Fail: spotted three times · the cart is destroyed · 4 minutes pass in step 6
Checkpoints: after 2, after 4
Lines:
  Guide: Welcome to Bayhaven Tomorrow. Please don't touch the lawn.
  Mags: It's plastic.
Result card: "Open House" · stamp Delivered · caption "Thank you for touring."
```

Step types are the fifteen in `05-content.md` (`say cutscene goto enter follow chase deliver collect photo heat survive timer defeat switch choice`). A line of dialogue is 90 characters or fewer.

**Song** (radio)

```
"Low Sun, High Tide" · 104 bpm · A minor (Dorian) · chords Am7 D9 Fmaj7 E7 · 4 bars each
kick   x...x...x...x...        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1..1..5..1..b7..5       (scale degrees, one per 16th, . is a rest)
lead   5 . 6 5 3 . 1 . | 3 . 5 . 6 . . .      pad: whole-bar chords, gated on 8ths
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · break 4 · chorus 8 · out 4
```

Bass scale degrees count from the current chord's root; lead degrees count from the key.

**Event** (Local Man, calendar, ambient): `id · tier · where · when (hours, weekday, weather) · trigger radius · what happens in 3 to 6 beats · how it ends · payout · radio headline · Squawk post`.

**Sign or line lists:** one per line, in the casing the player sees.

**New names:** a writer who invents a name that is not in this file lists it under a last heading, `## New names`, with one line on what it is. New names follow the pattern in section 8.

## 2. The game in canon terms

| Term | Meaning |
|---|---|
| **Bayhaven** | The city and the game |
| **Heat** | Police attention, 1 to 5, shown as five siren lights. Levels: Warm, Hot, Trending, Breaking News, Hurricane Dale |
| **Viewers** | The live audience of the Sheriff's show while heat is 3 or more. Drains when nobody can see you. Zero viewers clears heat. |
| **Followers** | Teo's follower count. A second score that also pays brand deals. Starts at 212. |
| **Booked** | Arrested at heat 1 or 2 |
| **Knocked out** | The player's health reaches zero. You wake at Bayhaven General. |
| **LIVE overlay** | The red pill, viewer count, chat and ticker on the HUD at heat 3+ |
| **Squawk** | The in-game social app |
| **Regulars** | Side characters with their own short chains of jobs |
| **Local Man** | Random street events, each ending in a news headline |
| **Drop** | The thing that exists only in one day's build |
| **Postcard** | The result card after a mission, and also the photo-spot collectible |
| **Bus Driver Voice / Go Live** | Mags's and Teo's abilities |
| **Day badge** | `Bayhaven · Day N build`, always on screen |

## 3. The region

The **city** is the 6.4 × 4.8 km rectangle in `02-world.md` (`x` −3,200 to 3,200, `z` −3,520 to 1,280). It is tiers A to C.

Around it is **Marlin County**, the full-vision ring. With it the world is 12.8 × 9.6 km (`x` −6,400 to 6,400, `z` −6,400 to 3,200), 4,800 chunks. The streamer and the zone files already work at any size; the ring is tier D and is built zone by zone after release.

| Zone | Bounds `[x0, x1] × [z0, z1]` | What it is | Tier |
|---|---|---|---|
| **Driftwood** | `[-6400, -3200] × [-3520, 1280]` | A sleepy beach town down the coast: a boardwalk, shuffleboard courts, early-bird diners, a drawbridge that is always up | D |
| **Citrus Flats** | `[-6400, -800] × [-6400, -3520]` | Orange groves, cattle, fruit stands, and Tangelo (population 1,204), a one-street town with a water tower shaped like an orange | D |
| **Lake Minnow** | `[-800, 2400] × [-6400, -4400]` | A wide shallow lake: fish camps, a bass tournament, a floating tiki bar, Mermaid Cove (a roadside mermaid show in a spring) | D |
| **North Glades** | `[-800, 6400] × [-4400, -3520]` and `[2400, 6400] × [-6400, -4400]` | More swamp, deeper: Camp Mudhen (the county work farm), a lost airstrip, the old Castaway Kingdom monorail line | D |
| **Cape Calamity** | `[3200, 6400] × [-3520, -400]` | A barrier island with a rocket launch site run by a company called Upward. Launches on Saturdays. Scrubbed most Saturdays. | D |
| **The Reef** | `[-6400, 6400] × [1280, 3200]` | Open water: sandbars, three shipwrecks, a lighthouse on a rock, and The Rig, an old platform turned nightclub | D |
| **East Bay** | `[3200, 6400] × [-400, 1280]` | Shipping lanes, anchored freighters, the ferry route to Cape Calamity | D |

## 4. Roads with names

The grid districts share one grid. Streets are every 80 m. Every fourth one is an avenue (22 m wide, traffic lights).

### North–south (constant `x`)

| `x` | Name | Kind | Runs |
|---|---|---|---|
| −1972 | Mangrove Avenue | avenue | Palma Vieja's west edge, down to the marsh road |
| −1652 | Avenida Campana | avenue | Palma Vieja |
| −1332 | Avenida Mercado | avenue | Palma Vieja, past Domino Park |
| −1012 | Avenida Rosa | avenue | Palma Vieja, the mural wall; continues south into Tideline as Rosa Street |
| −692 | Founders Avenue | avenue | The Palma Vieja / Meridian line |
| −372 | Egret Avenue | avenue | Meridian and Tideline |
| −52 | Plaza Street | street | West side of the day 1 block |
| 52 | **Coral Boulevard** | boulevard, 30 m, palm median (14 m beside the day 1 block) | From Heron Walk Drive north to Spire Circle |
| 372 | Sandbar Avenue | avenue | Meridian and Tideline |
| 692 | Exchange Avenue | avenue | Meridian; north of the expressway it becomes **Route 44** (at `x = 700`) |
| 1012 | Factory Avenue | avenue | The Paintworks |
| 1332 | Pigment Avenue | avenue | The Paintworks |
| 1652 | Gantry Avenue | avenue | The Paintworks / Rustwater line |
| 1972 | Dockside Avenue | avenue | Rustwater |
| 2292 | Container Road | avenue | Rustwater |
| 2612 | Drydock Road | avenue | Rustwater |
| 2932 | Breakwater Road | avenue | Rustwater, along the quay |

### East–west (constant `z`)

| `z` | Name | Kind | Notes |
|---|---|---|---|
| 37 | **Heron Walk Drive** | boulevard | The beachfront, `x` −1,600 to 1,600. 14 m wide beside the day 1 block. Bus route 9 runs its length. |
| −37 | Seagrape Street | street | North side of the day 1 block |
| −117 | Conch Street | street | |
| −197 | Driftwood Street | street | |
| −277 | Urchin Street | street | |
| −357 | **Flamingo Avenue** | avenue | Tideline's north edge |
| −437 to −1397 | First Street to Thirteenth Street | streets | The `n`th is at `z = −357 − 80n`. West of Founders Avenue the same streets are signed Calle Uno to Calle Trece. |
| −677 | Commerce Way | avenue | Takes the place of Fourth Street |
| −997 | Tower Way | avenue | Takes the place of Eighth Street; runs behind the Spire |
| −1317 | Union Avenue | avenue | Takes the place of Twelfth Street |
| −1480 | **Bayline Expressway** | raised, 26 m | `x` −3,000 to 3,000. Ramps at `x` = −2400, −900, 700, 2200 |

**Spire Circle** is the roundabout at `(52, -837)` where Coral Boulevard ends. The Spire's plaza fills the two blocks north of it, up to Tower Way.

### Other named roads

| Name | Where | Notes |
|---|---|---|
| Route 44 | `x = 700`, from the expressway north through Northgate and the Glades to Lake Minnow | 4 lanes to `z = -2700`, 2 lanes after. Exit numbers are jokes; Big Earl's is "Exit 44". |
| Gateway Boulevard | `z = -1800`, Northgate, `x` −800 to 600 | 6 lanes, the strip |
| Outlet Road | `z = -2120`, Northgate | |
| Billboard Road | `z = -2440`, Northgate | Forty lawyer billboards in a row. Cut by the Sinkhole: the broken east end is Big Air ramp 31. |
| Hospital Road | `x = -520`, Northgate | |
| Galleria Road | `x = -200`, Northgate | |
| Fairway Drive | The spine of Mallard Greens, a long S from the Gatehouse `(-900, -1900)` to Clubhouse Circle `(-2000, -2100)` to Phase Four `(-3000, -2500)` | Suburb lanes off it are named after birds the association has banned from the lake |
| Terminal Loop | Runway Flats, around `(1500, -2000)` | One way |
| Runway Road | `z = -2600`, Runway Flats | The service road beside the runway |
| Mudcat Road | `z ≈ -3000`, Mudcat Glades, `x` −3,100 to 3,100 | 2 lanes, dirt shoulders, crosses Route 44 at `(700, -3000)` |
| Marsh Road | From `(-1972, -357)` south-west through Heron Marsh to the Longspan at `(-1900, 180)` | 2 lanes, boardwalk bridges |
| The Longspan | From `(-1900, 180)` across the five Pelican Keys to `(-3100, 1200)` | 1.6 km causeway |
| Sandpiper Bridge | `x = -1100`, from `(−1100, 130)` to `(−1100, 430)` | 300 m, a gatehouse on the island end |
| Isle Drive | The loop road on Sandpiper Isle | |
| Pier Road | `x = 600`, from Heron Walk Drive onto Gullwing Pier | Drivable to the end |

Minor streets get names from their district's theme (section 5). The day 1 block's four streets are Plaza Street, the unnamed street at `x = 52` that is now Coral Boulevard, Seagrape Street and Heron Walk Drive.

## 5. Districts, neighbourhoods and fixed landmarks

Bounds are in `02-world.md`. Each district is split into neighbourhoods so that "where am I" has a finer answer than ten names. Landmark seeds below are fixed; district files add more.

### Tideline · street theme: shells and shore birds
| Neighbourhood | `x` range | What it is |
|---|---|---|
| West End | −1600 to −900 | Old motels, bait shops, Pelican Rest, the yacht club |
| Motel Row | −900 to −300 | Neon motels, mini-golf, souvenir shops |
| The Strand | −300 to 400 | The day 1 block, the plaza, the grand hotels |
| Pier Quarter | 400 to 1000 | Gullwing Pier, arcades, ice cream, crowds |
| East Strand | 1000 to 1600 | Half-built *Bayhaven Tomorrow* condos, cranes, the jetty |

Landmarks: the day 1 block and plaza `(0, 0)` A · Heron Walk promenade `z` 44–50 A · Hotel Alba `(290, -5)` B · Gullwing Pier from `(600, 80)` to `(600, 430)`, ferris wheel at `(600, 400)` B · Coral Arcade hall `(585, 415)` B (its original shopfront is the sign on the day 1 block) · Pelican Rest trailer park `(-1250, -220)` A (story start) · Yacht Club Bayhaven and west marina `(-1150, 90)` A · Park & Sons Auto `(340, -230)` A · Tideline Motel `(-520, -60)` B · Gator Putt mini-golf `(-600, -150)` B · the Jetty surf break `(1550, 100)` C · lifeguard huts every 300 m along `z = 63` A.

### Meridian · street theme: numbered streets; minor north–south streets are trees (Banyan, Cypress, Gumbo-Limbo, Mahogany, Poinciana, Sea Almond)
| Neighbourhood | Bounds | What it is |
|---|---|---|
| Bayfront | `z` −320 to −600 | Hotels, the park, City Hall |
| The Exchange | `x` −300 to 800, `z` −600 to −1100 | The tallest towers, the Spire |
| Radio Row | `x` −800 to −300, `z` −600 to −1100 | Older mid-rises, the public radio building, newsrooms, bars |
| Uptown | `z` −1100 to −1440 | Courts, the library, the bus terminal, the arena |

Landmarks: the Meridian Spire `(52, -900)`, 260 m A · Spire Circle `(52, -837)` A · City Hall and fountain `(-200, -560)` A · Bayfront Park `(-300, -450)` B · the Twin Sails `(430, -760)` B · Bayhaven Public Radio building `(-420, -840)` B · Central Bus Terminal `(-100, -1280)` C · The Shell arena `(500, -1300)` C · Baylink monorail loop, in running order: City Hall `(-180, -517)`, Bayfront `(212, -517)`, Exchange `(452, -760)`, The Shell `(452, -1290)`, Spire `(90, -997)`, Radio Row `(-452, -840)`, C. Bus routes are 1, 4, 7, 9, 15 and 44 (`bible/systems/transit.md`); route 9 runs the beachfront.

### Palma Vieja · street theme: Calle Uno to Calle Trece; minor north–south streets are fruits and flowers in Spanish (Calle Guayaba, Calle Mamey, Calle Jazmín, Calle Azucena, Calle Níspero)
| Neighbourhood | Where | What it is |
|---|---|---|
| La Plaza | centre | Domino Park, the church, the market |
| Calle Mural | along Avenida Rosa | The mural wall, cafés, record shops |
| Los Patios | north | Courtyard houses, corner shops, laundry lines |
| El Bajo | south | Workshops, the lowrider garage, Rafa's sauce kitchen |

Landmarks: Domino Park `(-1400, -880)` A · the bell tower `(-1340, -960)` A · the Mercado `(-1500, -800)` B · the mural wall, Avenida Rosa from `z = -700` to `z = -900` A · Ventanita Rosa `(-1020, -640)` A · Lava Abuela kitchen `(-1700, -480)` B · Flounder Works lowrider garage `(-1250, -420)` C.

### The Paintworks · street theme: pigments (Cobalt, Ochre, Vermilion, Umber, Viridian, Cadmium)
| Neighbourhood | Where | What it is |
|---|---|---|
| Factory Yard | centre | The paint factory and its chimneys |
| Wet Paint Alley | west | A pedestrian lane of murals, galleries |
| Container Row | south-east | Bars and shops in stacked containers |
| The Lofts | north | Converted warehouses, studios, the food-truck yard |

Landmarks: the paint factory, three painted chimneys, `(1300, -800)` A · Wet Paint Alley `(1100, -600)` B · Humidity nightclub `(1450, -950)` B · food-truck yard `(1000, -1100)` B · Container Row `(1500, -500)` C · June's loft `(1180, -1180)` C.

### Rustwater · street theme: ship parts (Bollard, Capstan, Keel, Hawser, Bilge, Windlass)
| Neighbourhood | Where | What it is |
|---|---|---|
| The Gantries | east quay | Cranes and the container yard |
| Cruise Basin | south | The cruise terminal, the ferry |
| Tank Farm | centre | Fuel tanks painted like beach balls |
| Scrap Mile | north-west | Scrapyards, the crusher, used tyres |
| Drydock | north-east | The shipyard |

Landmarks: four gantry cranes `(2900, -300)` and the container ship berth `(3050, -300)` A · cruise terminal `(2500, 100)` A · Bay Ferry terminal `(2300, 150)` C · beach-ball tanks `(2400, -700)` B · scrapyard and crusher `(2200, -1200)` B · dry dock `(2950, -1100)` C · the union hall, Dess's office, `(2650, -500)` B.

### Northgate · street theme: things you buy (Outlet, Coupon, Layaway, Clearance, Rebate, Warranty)
| Neighbourhood | Where | What it is |
|---|---|---|
| The Strip | along Gateway Boulevard | Strip malls, drive-throughs, pole signs |
| Medical Mile | west | The hospital, clinics, a row of pharmacies |
| Studio Park | centre | The Sheriff's HQ and TV studio |
| Motel Circle | east | Motels with pools, the used-car lots |
| Sinkhole Park | north-west | A neighbourhood built round a sinkhole that ate a strip mall |

Landmarks: Bayhaven General Hospital `(-500, -1700)` A · Sheriff's HQ and studio `(200, -2150)` A · Galleria Flamingo `(-200, -2000)` A · Starlite Drive-In `(350, -2400)` B · Wahoo World used cars `(100, -1750)` B · the Sinkhole `(-600, -2450)`, 90 m across and 18 m deep, C · Mount Seagull, the landfill hill, 35 m, `(-100, -2620)` C · Lawyer Larry's office `(420, -1830)` B.

### Mallard Greens · street theme: banned birds (Grackle Lane, Muscovy Court, Coot Circle, Cormorant Way, Vulture Loop, Ibis Bend)
| Neighbourhood | Where | What it is |
|---|---|---|
| The Gatehouse | east | The gate, the guard hut, the sales centre |
| Clubhouse Circle | centre | Clubhouse, pool, pickleball |
| The Fairways | through the middle | 18 holes |
| Lake Serenity | west | The lake and the alligator |
| Model Mile | north-east, a north–south strip west of the Gatehouse | Show homes |
| Phase Four | far west | Streets, driveways and mailboxes, no houses yet |

Landmarks: the Gatehouse `(-900, -1900)` A · the clubhouse `(-2000, -2100)` A · the model home `(-1100, -2300)` A · the hole in the hedge behind the 14th green `(-2450, -2420)` A · Lake Serenity `(-2700, -1900)` B · Phase Four `(-3000, -2500)` C · the south gate `(-2000, -1520)` B.

### Runway Flats · street theme: flying (Taxiway, Holding Pattern Road, Layover Lane, Carry-On Court, Red-Eye Road)
| Neighbourhood | Where (first match wins) | What it is |
|---|---|---|
| Airfield | `z` < −2300 | The runway, taxiways, the smugglers' hangar |
| Speedbowl grounds | `x` ≥ 2440 and `z` > −2140 | The oval and its car parks |
| Hangar Row | `x` ≥ 2140 and `z` ≤ −2140 | Hangars and charter offices |
| Terminal | `x` 1250 to 1800 | Terminal Loop, the tower |
| Long Stay | `x` > 1800 | Car parks and cheap motels |
| Rental Row and Layover | `x` < 1250 (Rental Row north of `z = -1960`) | Rental lots, the Layover Diner |

Landmarks: terminal `(1500, -2000)` A · control tower `(1650, -2100)` A · runway from `(1000, -2450)` to `(2800, -2450)` A · Hangar Row `(2400, -2200)` B · Rental Row `(1100, -1750)` B · the Speedbowl `(2700, -1850)`, oval 400 × 250 m, A · the Layover Diner, with a plane on a pole, `(900, -2100)` C.

### Mudcat Glades · no street names; tracks are named by hand-painted signs
| Neighbourhood | Where (first match wins) | What it is |
|---|---|---|
| The Levee | `z` > −2790 | The bank that keeps the swamp out of the suburbs, the canal at its foot |
| West Glades | `x` < −1400 | Pines on the hammocks, the old theme park, the dish trailer |
| Earl's Mile | `x` < 300 | Roadside stands, the bait shop, Big Earl |
| The Crossing | `x` < 1600 | Route 44 meets Mudcat Road; the gator farm, Nilda's dock |
| East Glades | the rest | The deepest water, the fish camp |

Landmarks: Big Earl `(-400, -2980)` A · Captain Nilda's dock `(1200, -3250)` A · the fish camp on stilts `(2300, -3350)` B · Castaway Kingdom gate `(-2000, -3200)` C · the dish trailer `(-2900, -3050)` C · Scale & Tail gator farm `(700, -3350)` C · the Glades Bait & Ballistics `(-1000, -3020)` B.

### The Islands
**Sandpiper Isle:** the island gatehouse `(-1100, 430)` A · the Bellweather mansion and helipad `(-1000, 780)` A · Glow Camp `(-1350, 600)` B · Maison Sable `(-850, 520)` C · private docks along the south shore B.

**Pelican Keys**, west along the Longspan: Flip-Flop Key `(-2000, 300)` · Tackle Key `(-2280, 520)` · Hammock Key `(-2550, 750)`, with the houseboat marina · Lime Key `(-2830, 980)` · Last Key `(-3100, 1200)`, with the lighthouse. All A as land and road, B and C for what stands on them. The Stilt House bar stands in the water at `(-2400, 640)` B.

### Heron Marsh
Mangroves, a kayak trail, the Mangrove Tunnel (a road section roofed by trees) at `(-2400, -700)` B, the bird-watching tower `(-2700, -1000)` C.

## 6. People

### Leads
Mags Calloway, 61 · Teo Navarro, 24. Full details in `03-characters-and-story.md`.

### Main cast
Gordon "Gordy" Bellweather (developer, villain) · Kiki Halcyon (influencer, second villain) · Sheriff Dale Rucker (host of *Bayhaven Blue: Live*) · Wendell Park (mechanic) · Rafa Montalvo (fixer, Domino Park) · Captain Nilda Ferro (airboat) · Odessa "Dess" Whitlock (crane operator, union steward) · June Abara (Teo's old streaming partner) · Tripp Vandermeer (yacht heir) · Lawyer Larry · Barbara Wetherby (radio journalist) · Gerald (a pelican).

### Regulars (side chains)
| Regular | Who | Where | Chain | Jobs | Tier |
|---|---|---|---|---|---|
| Lawyer Larry | Billboard lawyer | Northgate | **Billable Hours**: staged fender-benders, serving papers, a billboard war with Attorney Annie | 4 | B |
| Dolores "Dee" Pfeffer | The association's violations officer, who hates the association | Mallard Greens | **Violations**: sabotage by the rulebook | 4 | C |
| Priya Raman | Runs the Pressed sandwich truck | The Paintworks | **Lunch Rush**: the food-truck wars | 3 | C |
| Old Man Fitch | Beach metal-detectorist with a map | Tideline | **Buried**: digs, false alarms, one real find | 4 | C |
| Coach Brenda Oyelaran | Leads the Dawn Patrol, a dawn walking club that is also a crew | Mallard Greens, the Galleria | **Dawn Patrol**: cart races, a mall-walking heist | 4 | C |
| "Zoom" Ziegler | Drone photographer for *The Bayhaven Tide* | Meridian | **Exclusive**: photo jobs | 4 | B |
| Madame Calypso | Strip-mall psychic who is only ever right about weather | Northgate | **Forecast**: storm chasing | 3 | C |
| Deputy Wade Purdy | The one deputy who hates the show | Northgate, anywhere | **Off Camera**: tips, sabotaging the Sheriff's cameras | 4 | C |
| Gus Thibodeaux | Owner of Big Earl's | Mudcat Glades | **Wrangler**: alligators where they shouldn't be | 4 | B |
| Dr. Imani Okoro | Marine biologist | The Keys | **Tide Pool**: turtle crossings, a manatee escort, reef clean-up by boat | 4 | C |
| Skip Lindqvist | Boat broker, Cash 4 Jet Skis | West End | **Repo Depot**: repossessing boats | 4 | C |
| Abuela Carmen Montalvo | Rafa's mother and the real boss | Palma Vieja | **House Rules**: dominoes, deliveries, discipline | 4 | C |

### Radio hosts
Nightshift Nina · El Capitán Memo · DJ Subtropic · Hoot Gibbons · Barbara Wetherby · Kiki Halcyon · Surfside Sid · Lil Nuisance · Mirrorball Mona · Auntie Dub · Player Two. (Low Tide Lounge has no host.)

### Others who are named
Attorney Annie (Larry's rival) · Mayor Bunny Castellano (always campaigning) · Chad and Brad (Bellweather's security chiefs, twins) · Bev (the gate guard at Mallard Greens) · Marco (the tow-truck driver in mission 1) · Okafor & Daughters (rival sauce crew) · Hector (Mercado butcher and domino champion).

### The underworld
**The Undertow** is the crew that brings drugs in by container and boat, cuts them in the old paint factory and sells them across the city. Rafa keeps them out of Palma Vieja. Every file that means the city's drug trade means the Undertow.

## 7. Vehicles

Names are fish, birds and other creatures of the coast. Never a real make or model. Numbers for the first 25 are in `04-systems.md`; the catalogue file carries all of them.

| Class | Vehicles (id = lower-case name) | Tier |
|---|---|---|
| Small cars | Snook (compact), Anchovy (microcar), Guppy (hatchback), Snapper (hot hatch), Possum (beater sedan), Permit (driving-school car with dual controls) | Snook A, others B–C |
| Cars | Heron (coupe), Tarpon (sedan), Flounder (lowrider), Gallinule (luxury sedan), Egret (silent electric sedan), Tern (convertible), Coquina (luxury convertible), Ibis (long classic), Spoonbill (pink finned classic) | Heron, Tarpon, Flounder A; Tern B; others C |
| Fast | Wahoo (muscle), Sailfin (sports), Cobia (sports coupe), Bonito (supercar), Swordtail (supercar), Gar (hot rod) | Wahoo, Sailfin A; Bonito B; others C |
| Trucks and vans | Mullet (pickup), Osprey (heavy pickup), Grouper (SUV), Pompano (van), Hermit (camper van), Conch (ice-cream van), Hogfish (box truck), Remora (tow truck), Whelk (cement mixer), Pelican (garbage truck), Clam (armoured cash truck), Sturgeon (limo) | Mullet, Grouper, Pompano, Hogfish, Remora A (mission 1's tow truck); Pelican, Sturgeon B; others C |
| Buses | Manatee (city bus), Manatee S (school bus, Mags's old one) | A, B |
| Two wheels | Pinfish (scooter), Needlefish (sport bike), Bowfin (cruiser), Cicada (dirt bike), Plover (bicycle), Sandflea (BMX), Sanderling (rental kick scooter, left all over the sidewalks) | Pinfish, Needlefish A; others C |
| Small and odd | Birdie (golf cart), Coot (mobility scooter), Cricket (ride-on mower), Fiddler (forklift), Gopher (airport tug), Skink (quad bike), Tortoise (tractor) | Birdie A; Fiddler B; others C |
| Off-road | Bullfrog (swamp buggy), Sandshark (dune buggy), Sawfish (monster truck) | B, C, C |
| Emergency | Sheriff Tarpon, Sheriff Grouper, Sheriff tactical van, Sheriff's show truck (a Hogfish with cameras), ambulance (Pompano), fire truck (Hogfish), news van (Pompano) | A |
| Boats | Skipjack (speedboat), Skimmer (jet ski), Gatorback (airboat), Minnow (dinghy), Swan (pedal boat), Shrimper (trawler), Snowbird (yacht), King Tide (Tripp Vandermeer's superyacht, not drivable), Hammerhead (Sheriff's patrol boat), Bay Ferry | First three A; King Tide A as a set piece (mission 11); Minnow, Hammerhead B; others C–D |
| Aircraft | Dragonfly (helicopter), Mayfly (news helicopter, AI only until C), Horsefly (Sheriff's helicopter), Gnat (gyrocopter), Cormorant (seaplane), Sandhill (crop duster), Tropicbird (private jet), Pufferfish (blimp) | Mayfly A as AI (at heat 4 a second Mayfly in Sheriff colours stands in for the Horsefly); others C–D |

## 8. Names that exist

A new name must be a plain word or a pun about beaches, weather, birds, fish, food, heat or retirement. It must not sound like a real company, a real place, a real person, anything from another game, or anything to do with digital money.

**Bars, clubs, hotels:** Club Luma · The Pink Heron · Low Tide Bar · Hotel Alba · Tideline Motel · Humidity · Dew Point · Feels Like 104 · The Sweaty Flamingo · Wet Paint · The Stilt House · Yacht Club Bayhaven · The Rig · The Breakwater Hotel · Motel Sunburn · The Vacancy

**Food and drink:** Mango Moon · Shell Yeah · Ventanita Rosa · Key Lime Crimes · Squeeze Play · Hush Hour Diner · Pressed · Lava Abuela · Pelican Eats · Big Earl's · Bun Voyage (burgers) · Wing It (wings) · Bean There (coffee) · The Layover Diner · Fizzy Lizard (soda) · Lightning Bug (energy drink) · Humid Lager · Scoop Dreams (ice cream)

**Shops:** Surf & Vinyl · Coral Arcade · Second Wind Thrift · Maison Sable · Storm Mart · Bait & Ballistics · Park & Sons Auto · Frond Memories · Mullet Over · Reel Estate · Manatee Mattress · Iguana Insurance · Cash 4 Jet Skis · Galleria Flamingo · Gator Putt · Starlite Drive-In · Wahoo World · Dent-A-Car (rentals) · Sandbar Market (groceries) · Pill Bill's (pharmacy) · Flounder Works · Scale & Tail · Pelican Fuel (petrol stations)

**Institutions and media:** Bayhaven General · Bayhaven Public Radio · Bayhaven Blue: Live · BHTV 6 · *The Bayhaven Tide* (newspaper) · Bay Cab · Bay Ferry · Baylink · Bayhaven International · Low Altitude Airlines · the Speedbowl · First Bayhaven Savings (bank) · Clam Secure (cash trucks) · Bayhaven Tomorrow · the Bellweather Group · Glow Camp · SPF 1000 · Lawyer Larry · Attorney Annie · Squawk · Upward (rockets) · Captain Coconut's Castaway Kingdom · the Dawn Patrol · Marlin County Sheriff

**Handles:** `@teo.navarro.live` · `@BayhavenBlue` · `@kiki.halcyon` · `@june.abara` · `@lawyerlarry` · `@gerald.the.pelican` (someone else runs it)

Phone numbers are always 555-01xx.

## 9. Radio

Twelve stations and a scanner. Sound recipes for the first seven are in `07-art-and-audio.md`.

| Station | Sound | Host | Tier |
|---|---|---|---|
| Tideline 98 | Synth-pop, night-drive | Nightshift Nina | A |
| Radio Palma | Dembow, salsa-flavoured | El Capitán Memo | A |
| Bassline FM | Club, bass, trap | DJ Subtropic | A |
| Swamp Country 94 | Twang, shuffle, banjo | Hoot Gibbons | A |
| Low Tide Lounge | Lo-fi, slow jazz chords | none | A |
| Bayhaven Public Radio | Talk, news about you | Barbara Wetherby | A |
| The Grind 24/7 | Motivation talk over drums | Kiki Halcyon | A |
| Postcard 66 | Surf twang, doo-wop progressions | Surfside Sid | C |
| The Crash | Fast, loud, three chords | Lil Nuisance | C |
| Glitterball 107 | Disco and house | Mirrorball Mona | C |
| Reef Roots | Dub and offbeat skank | Auntie Dub | C |
| Arcade FM | Chiptune; plays in arcades and in the Anchovy | Player Two | C |
| The scanner | Police calls; in emergency vehicles only | dispatch | A |

## 10. Story

### Chapter 1 · Notice to Vacate (tiers A to C)
The twenty missions in `03-characters-and-story.md`. Ids: `final-notice` `content-is-king` `repo-woman` `hot-sauce` `open-house` `glow-up` `as-seen-on-tv` `swamp-thing` `crane-game` `injury-time` `yacht-rock` `paint-it-pink` `the-binder` `speedbowl` `dry-run` `hurricane-party` `evacuation-route` `the-spire-job` `eye-of-the-storm` `going-viral`.

### Chapter 2 · Hurricane Season (tier D)
The storm is over and the bill arrives. Bellweather is gone, but the people who lent him the money are not: the **Seawall Group**, a polite set of investors led by **Constance Vane**, who now own half the damaged city and are buying the rest cheap. Sheriff Rucker, his show cancelled, runs for mayor against Bunny Castellano. Teo has two million followers and no idea what to do with them. Mags gets her old route back, as a cover. Twenty missions about rebuilding the town before someone else buys it: insurance adjusters, a relief concert, a mayoral debate on live TV, a rocket launch used as a distraction at Cape Calamity.

### Chapter 3 · Bayhaven Tomorrow (tier D)
Two years on. Pelican Rest owns itself. The trailer park has become the thing it fought: Mags is, to her horror, president of a homeowners' association. A real threat comes from the water: the Reef is being dredged for **Above It All**, a floating city for the very rich. Twenty missions that end on The Rig in a storm, with every Regular in the game turning up to help.

### Side chains
Twelve Regulars, 46 jobs (section 6).

## 11. Things to find, at full size

| Type | Full count | In the day 9 Mid build |
|---|---|---|
| Lawn flamingos | 100 in the city, 10 per district (tier D adds 70 in the county) | 40 |
| Big Air ramps | 50 | 15 |
| Postcards (photo spots) | 40 | 10 |
| Gnomes | 10 | 0 |
| Mixtapes (a cassette that adds one song to one station) | 24, two per station | 0 |
| Gerald sightings (the pelican turns up in 20 odd places; photograph him) | 20 | 0 |
| Lawyer Larry billboards to deface | 40 | 0 |

## 12. The week

The game has a seven-day week. The clock shows the weekday. Some things only happen on their day.

| Day | What happens |
|---|---|
| Monday | Bin day: Pelican garbage trucks on every street at dawn. The association inspects lawns. |
| Tuesday | Two-for-one at the Starlite Drive-In at 20:00. Domino league in Domino Park at 18:00. |
| Wednesday | Cruise ship in port: Tideline is full of tourists from 10:00 to 17:00. |
| Thursday | Open-mic night at Wet Paint. Street race meet at the Tank Farm at 23:00. |
| Friday | Race night at the Speedbowl at 19:00. Humidity is full. |
| Saturday | Farmers' market in Domino Park at 08:00. Launch day at Cape Calamity at 14:00 (usually scrubbed). Yacht party at the club at 21:00. |
| Sunday | Golf tournament in Mallard Greens. Boat parade off Tideline at 16:00. Everything shuts early. |

Every day: the storm at 15:15.

## 13. The bible's files

| Folder | What is in it |
|---|---|
| `bible/world/` | One file per district and one for the county: neighbourhoods, building recipes, landmarks piece by piece, streets, street life, signs |
| `bible/story/` | Full scripts for chapter 1, cutscene shot lists, character bibles, the Regulars' chains, outlines for chapters 2 and 3, phone messages |
| `bible/radio/` | One file per station: host, songbook, lines. Ads, news templates, scanner calls |
| `bible/voices/` | Squawk templates, LIVE chat lines, street barks, signs and billboards, in-game web pages, what is on screens |
| `bible/catalog/` | Every vehicle, weapon, piece of clothing, shop, property, business, achievement and stat |
| `bible/activities/` | Side jobs, minigames, race routes, Big Air ramps, things to find, Local Man events, the calendar, daily challenges |
| `bible/systems/` | Deep specs: state machines, formulas and tuning tables for each system |
| `bible/art/` | Building kits, character and vehicle modelling sheets, the UI kit, effects, sound recipes, synth patches, light by the hour |
| `bible/tech/` | Contracts between folders, data shapes, algorithms, the performance playbook, the test harness |

Every file starts with a one-paragraph summary and a tier line, uses tables for anything countable, and gives numbers instead of adjectives.

## 14. Names added by the volumes

Names the bible volumes invented, checked at integration against real companies, places and people, other games and digital money. They follow the pattern in section 8. Ids, events, instruments and effect names live in their own files and are not listed here. Five clashes were renamed: the Paintworks food truck is Rain Bowl, the bowling alley is Ten Pin Tide, Gator Putt's hole 5 is Snack Time, Above It All's drone is Chirp, and Constance's ledger is the ebb book.

### World

- Driftwood roads and places: Coast Road, the Long Way, Lazy Inlet, Bingo Boulevard, Matinee Street, Decaf Drive, Nap Street, the Shuffle Inn, Early Bird Row (The Early Bird, The Earlier Bird, The Earliest Bird) (`world/county.md`)
- Golden Tide Village, Sunset Shallows, Seventh Inning Estates: Driftwood villages (`world/county.md`)
- Citrus Flats places: Grove Road, Peel Road, Only Street, The Rind, The Last Orange (`world/county.md`)
- Lake Minnow places: Minnow Landing, Shore Road, The Barge Inn, the Big Bobber, The Big Mouth Open (`world/county.md`)
- Near Island, Far Island, Other Island: Lake Minnow islands (`world/county.md`)
- North Glades places: Mudhen Road, Car Park Z, the Mudhen 500, the Deep Loop (`world/county.md`)
- Cape Calamity places: Calamity Sound, Countdown Causeway, Scrub Road, the Scrub Club (`world/county.md`)
- the Optimist: Upward's rocket (`world/county.md`)
- The Reef places: West Cut, Middle Cut, East Cut, Tern Rock Light, the party bar (`world/county.md`)
- Second Mortgage, Lazy Mackerel, Unsinkable II: wrecks on The Reef (`world/county.md`)
- Patient Whale, Slow Thursday, Long Weekend, Humble Barnacle, Late Lunch, No Rush: East Bay freighters (`world/county.md`)
- Close Enough: East Bay barge (`world/county.md`)
- Windward Way, Zephyr Court, Leeward Lane, Doldrums Drive, Trade Wind Lane: isle lanes (`world/islands.md`)
- Tunnel Road, the Tower boardwalk: marsh roads (`world/islands.md`)
- the Step-Off, the Hump, the Fishing Gap, the Long Reach: Longspan spans (`world/islands.md`)
- the flamingo lawn, The Right One, the houseboat marina, the Tide Pool lab, the Last Jump: island landmarks (`world/islands.md`)
- 13 bird-named lanes: Starling Approach, Goose Crossing, Pigeon Place, Gull Close, Crow Court, Magpie Mews, Moorhen Court, Anhinga Lane, Limpkin Loop, Dodo Drive, Loon Lane, Buzzard Bend, Gander Road (`world/mallard-greens.md`)
- The Easement: track outside the north hedge (`world/mallard-greens.md`)
- The Mallard, The Drake, The Teal, The Canvasback: house models (`world/mallard-greens.md`)
- Bylaw: the alligator in Lake Serenity (`world/mallard-greens.md`)
- Greens Patrol: Bellweather's armed security, run by Chad and Brad (`world/mallard-greens.md`)
- The Nineteenth: clubhouse terrace bar (`world/mallard-greens.md`)
- 9 tree streets: Buttonwood, Sapodilla, Satinleaf, Jacaranda, Tamarind, Allspice, Pigeon Plum, Ironwood, Kapok (`world/meridian.md`)
- Spire Plaza: the paved blocks round the Spire (`world/meridian.md`)
- The Thermometer: street name for the First Bayhaven Savings tower (`world/meridian.md`)
- The Groundbreaking: golden shovel sculpture on Spire Circle (`world/meridian.md`)
- The Bayhaven Tide building: newspaper office in Radio Row (`world/meridian.md`)
- Level Nine: nine-level parking tower in Bayfront (`world/meridian.md`)
- Marlin County Courthouse: the courts, in Uptown (`world/meridian.md`)
- The Exchange Hall: hall with a weather board (`world/meridian.md`)
- Birdbath Car Wash: car wash chain (`world/meridian.md`)
- The Undertow: crew that brings drugs into the city, tier B (`world/meridian.md`)
- Baylink station names: the canon's six, placed (`world/meridian.md`)
- The Levee, West Glades, Earl's Mile, The Crossing, East Glades: areas (`world/mudcat-glades.md`)
- Back Way, Shortcut, Not a road, Patrol, Surveyors only: tracks named by their signs (`world/mudcat-glades.md`)
- The Long Slough, Nilda's Cut, Gator Alley, Catfish Bend, Kingdom Lagoon, Stilt Creek, Borrow Canal: channels (`world/mudcat-glades.md`)
- Pump Station 4, the patrol station, Rattle Bridge, The Cathedral, Swamp Country 94's tower: landmarks (`world/mudcat-glades.md`)
- Little Earl: live alligator in the pen at Big Earl's (`world/mudcat-glades.md`)
- Swamp Honey, Boiled & Salted: roadside stands (`world/mudcat-glades.md`)
- the smugglers' landing: dock at the end of "Not a road" (`world/mudcat-glades.md`)
- 9 shopping streets: Voucher Avenue, Doorbuster Drive, Refund Street, Markdown Street, Bulk Street, Receipt Road, Layaway Lane, Checkout Lane, Closeout Circle (`world/northgate.md`)
- Gull, Gull & Gull; Limpet Legal; Jellyfish Injury Law: three billboard law firms (`world/northgate.md`)
- Tan Line Inn, The Wet Towel: motels (`world/northgate.md`)
- Second Tide Motors: used-car lot (`world/northgate.md`)
- the 15 bus: Northgate loop bus (`world/northgate.md`)
- Billboard Row: row of billboards (`world/northgate.md`)
- Triangle Meets Circle: the Starlite's one film, a six-minute loop of shapes (`world/northgate.md`)
- Madder, Indigo, Carmine Streets: pigment streets (`world/paintworks.md`)
- The Spray Can: water tower painted as a spray can (`world/paintworks.md`)
- The Big Brush: giant paintbrush at the alley's north gate (`world/paintworks.md`)
- The Paint Chart: wall of 48 colour squares on Pigment Avenue (`world/paintworks.md`)
- Blank Canvas: gallery, the only unpainted building (`world/paintworks.md`)
- Palette Park: small park with six bouncing blobs (`world/paintworks.md`)
- The Undertow: drug crew, tier B (also `guard` kind from Mallard Greens) (`world/paintworks.md`)
- The club run: row of clubs on Seventh Street (`world/paintworks.md`)
- Heat Lightning: rooftop club (`world/paintworks.md`)
- Heat Index, Sea Can: container bars (`world/paintworks.md`)
- Fry Tide, Rain Bowl, Brine Time: food trucks (`world/paintworks.md`)
- Mildew Projects, Squall Space, Sunstroke Studio: galleries on the alley (`world/paintworks.md`)
- 6 fruit and flower streets: Calle Caimito, Calle Guanábana, Calle Clavel, Calle Gardenia, Calle Orquídea, Calle Papaya (`world/palma-vieja.md`)
- Arco del Dominó: arch over Avenida Mercado with a domino keystone (`world/palma-vieja.md`)
- Teatro Marea: closed theatre on Avenida Rosa (`world/palma-vieja.md`)
- Radio Palma studio: building for the canon's station (`world/palma-vieja.md`)
- El Tanque: water tank painted as a coffee cup (`world/palma-vieja.md`)
- El Gallo: corner store with a rooster on its roof (`world/palma-vieja.md`)
- Pan Comido: bakery under the flat property (`world/palma-vieja.md`)
- Birdbath Car Wash: car wash chain (`world/palma-vieja.md`)
- The Undertow: drug crew, keeps out of Palma Vieja, tier B (`world/palma-vieja.md`)
- Barbería El Remolino: barber (`world/palma-vieja.md`)
- 7 streets: Final Call Road, Tailwind Avenue, Go-Around Road, Crosswind Road, Standby Street, Lost Luggage Lane, Pit Road (`world/runway-flats.md`)
- Airfield, Terminal, Long Stay, Layover, Speedbowl grounds: areas (`world/runway-flats.md`)
- Tern Around, Shore Thing: rental lots beside Dent-A-Car (`world/runway-flats.md`)
- Spotters' Mound, Lost Luggage, the radar dome, the blimp mast: landmarks (`world/runway-flats.md`)
- 7 ship-part streets: Cleat, Davit, Rudder, Scupper, Transom Streets, Gunwale Road, Fairlead Road (`world/rustwater.md`)
- The Undertow: drug crew, tier B (`world/rustwater.md`)
- Port Bayhaven: port name on its gate (`world/rustwater.md`)
- Slack Tide, Early Supper: container ship, cruise ship (`world/rustwater.md`)
- The port railway: one track and rail yard on z = -277 (`world/rustwater.md`)
- Breakwater light: small harbour light on a rock mole (`world/rustwater.md`)
- Tyre Hill: mound of used tyres in Scrap Mile (`world/rustwater.md`)
- Harbour tower: port control tower (`world/rustwater.md`)
- The Bilge Pump: dockers' café by the union hall (`world/rustwater.md`)
- Local 315: the union's number (`world/rustwater.md`)
- 30 shell and shore-bird streets and 5 avenues: Limpet Street to Barnacle Street; Curlew, Willet, Turnstone, Avocet, Godwit Avenues (`world/tideline.md`)
- Bayhaven Grand, Diner: 24h · two signs on the day 1 block (`world/tideline.md`)
- Bayhaven Tomorrow, Phase One: three condo frames in East Strand (`world/tideline.md`)
- The Tide Clock: clock tower at the pier showing the tide (`world/tideline.md`)
- The Big Lounger: giant sun lounger statue on Motel Row (`world/tideline.md`)
- Birdbath Car Wash: car wash chain (`world/tideline.md`)
- The Undertow: drug crew, tier B (`world/tideline.md`)
- Route 9: beachfront bus line, Heron Walk Drive end to end (`world/tideline.md`)

### Story

- Heat Advisory: hot sauce by Okafor & Daughters, rival of Lava Abuela (`story/act-1.md`)
- Gate 2: truck gate of the Gantries terminal, seed (2612, -620) (`story/act-2.md`)
- Preston Lark, Faye Dunlin, Hollis Grebe, Ingrid Shoal, Royce Bittern, Pip Sorrel, Dwight Teal: new cast (`story/chapter-2.md`)
- Sandy the Sandbag: Seawall's mascot (`story/chapter-2.md`)
- The ebb book: Constance's name for the loan ledger (`story/chapter-2.md`)
- The Big Dry-Off: the relief concert (`story/chapter-2.md`)
- Storm-Blessed Water: Kiki's new product (`story/chapter-2.md`)
- Route 9: Mags's bus route (`story/chapter-2.md`)
- Magnus Wrasse, Anselm Hake, Wren Okafor, Vernon Stilt, Hattie Loon, Leopold Brack: new cast (`story/chapter-3.md`)
- Chirp: Above It All's speaker drone (`story/chapter-3.md`)
- The Lamprey: the dredger, not drivable (`story/chapter-3.md`)
- The High Ground: Wrasse's yacht, not drivable (`story/chapter-3.md`)
- The Long Bar: sandbar on The Reef (`story/chapter-3.md`)
- Pelican Rest Homeowners' Association: association Mags chairs (`story/chapter-3.md`)
- Bayhaven Blue: Marine Unit: Dale Rucker's new show (`story/chapter-3.md`)
- Hurricane Bunny: the storm, named by the Mayor (`story/chapter-3.md`)
- Glow Getters: Kiki's followers (`story/characters.md`)
- Deborah: alligator in the Glades, named by Nilda (`story/characters.md`)
- The 9 bus: Mags's fun route on Heron Walk Drive (`story/characters.md`)
- The Double Press: sandwich at Pressed named after the player (`story/messages.md`)
- Room 9, Tideline Motel: where Dee Pfeffer moves (`story/messages.md`)
- Wrap Battle: rival food truck in The Paintworks, tier C (`story/regulars-1.md`)
- Mrs Fitch: Old Man Fitch's wife, tier C (`story/regulars-1.md`)
- Lawn of the Year: the association's cup, tier C (`story/regulars-1.md`)
- The courthouse, Uptown: seed (-250, -1240), tier B (`story/regulars-1.md`)
- The Bayhaven Tide street door: seed (-560, -760) on Radio Row, tier B (`story/regulars-1.md`)
- Madame Calypso's: shop on Gateway Boulevard, tier C (`story/regulars-2.md`)
- Pickles: alligator who likes motel pools, tier B (`story/regulars-2.md`)
- The Amenity: association's name for the Lake Serenity alligator, tier B (`story/regulars-2.md`)
- Tide Pool Lab: Dr. Okoro's shack on Tackle Key, tier C (`story/regulars-2.md`)
- Fashionably Late: littering Snowbird, tier C (`story/regulars-2.md`)
- Freedom: repossessed Skimmer, tier C (`story/regulars-2.md`)
- Nana's Inferno: factory hot sauce, tier C (`story/regulars-2.md`)

### Radio

- Menu items: the Long Haul; Mango Overboard; Key Lime Alibi; the Done That; the Got the Shirt; Mild, Humid, Feels Like 104 (`radio/ads.md`)
- The Lagoon of Laughs: ride at the closed Castaway Kingdom (`radio/ads.md`)
- announcer, captain: voices (`radio/ads.md`)
- Square Wave Pelican, Out of Order Sign, Low Battery Lullaby, Quarter on the Glass, Cabinet Number Nine: artists and songs (`radio/arcade-fm.md`)
- Player One: the absent first player (`radio/arcade-fm.md`)
- High Score Table, Cheat of the Day: segments (`radio/arcade-fm.md`)
- Kid Condensation, Low Pressure Lisa, Wet Bulb Collective, Heat Index Finger, The Dew Point Twins, Big Barometer: artists and songs (`radio/bassline-fm.md`)
- The Five-Night Forecast, Door Report: segments (`radio/bassline-fm.md`)
- the eleven shows: schedule (`radio/bayhaven-public-radio.md`)
- Marjorie of 14 Coot Circle, Dennis: callers (`radio/bayhaven-public-radio.md`)
- 555-0188: newsroom number (`radio/bayhaven-public-radio.md`)
- Chandelier Emergency, Velvet Rope Burn, The Fog Machine Family, Polyester Weather, The Dry Ice Queens, Coat Check Number Nine: artists and songs (`radio/glitterball-107.md`)
- Mona's Mirror, Mona's List: segments (`radio/glitterball-107.md`)
- Decaf Heron, Slow Manatee, Half-Asleep Lifeguard, Tidepool Tapes: artists and songs (`radio/low-tide-lounge.md`)
- The Four Lifeguard Chairs, The Sunburnt Ankles, The Velvet Flip-Flops, The Tide Charts, The Saltwater Taffy Four, The Drive-In Speakers: artists (`radio/postcard-66.md`)
- The Mailbag, Sid's Price Check: segments (`radio/postcard-66.md`)
- Los Ventiladores de Techo, Orquesta Paraguas Roto, La Nevera Rota, Conjunto Doble Nueve, Los Hidráulicos de El Bajo, Grupo Pastelito: artists (`radio/radio-palma.md`)
- El Parte del Dominó, La Queja del Día: segments (`radio/radio-palma.md`)
- Hammock Key Hi-Fi, The Causeway Echo Unit, The Brackish Brothers and Sisters, Low Flame Orchestra, The Idle Speed Players: artists (`radio/reef-roots.md`)
- Tide Table, What's in the Pot: segments (`radio/reef-roots.md`)
- Dispatch: the dispatcher (`radio/scanner.md`)
- Chef, the cooking show: unnamed rival programme mentioned by the Sheriff (`radio/scanner.md`)
- The Bait Fridge Boys, Mudflap Hymnal, Uncle Dewey's Screen Door, The Sawgrass Sweethearts, Two-Stroke Tabernacle: artists and songs (`radio/swamp-country-94.md`)
- Gravy: Hoot's dog, never seen (`radio/swamp-country-94.md`)
- Porch Sale, Gator Watch: segments (`radio/swamp-country-94.md`)
- 555-0161: number (`radio/swamp-country-94.md`)
- Violation Notice, Leaf Blower at Dawn, Wet Socks, Free Parking Lie, The Beige Mailboxes: artists and songs (`radio/the-crash.md`)
- Mum: Lil Nuisance's mother, never seen (`radio/the-crash.md`)
- The Violation Box, Mum's Corner: segments (`radio/the-crash.md`)
- Motel Ice Machine, Sodium Sweetheart, Pastel Alibi, Glovebox Flamingo, Dehumidifier Romance, Vacancy Sign Choir: artists and songs (`radio/tideline-98.md`)
- Left in the Back Seat, The Scenic Route: segments (`radio/tideline-98.md`)

### Voices

- The Long Rectangle, The Square Job, Something in Lake Serenity, The Big Slide, Showdown at Dot Gulch, The 15:15, Box Step, Scrubbed: films F03 to F10 (`voices/screens.md`)
- Square Goes Alone: film F02 (`voices/screens.md`)
- Pelican Pointe Residences: Bellweather's planned build on Pelican Rest, billboard only (`voices/signs.md`)
- 555-0190: Bellweather reward line (`voices/signs.md`)
- 555-0101: mayor's message line (`voices/signs.md`)
- @thebayhaventide, @mallardgreens.hoa, @bayhaventomorrow, @stormmart, @mayorbunny: institution handles (`voices/squawk.md`)
- @motelrow.mo: Mo, night clerk at the Tideline Motel (`voices/squawk.md`)
- @visiting.vic: Vic, a tourist (`voices/squawk.md`)
- @lorraine.on.grackle: Lorraine, a retiree on Grackle Lane (`voices/squawk.md`)
- @dockside.del: Del, Rustwater crane crew (`voices/squawk.md`)
- Form 9-B: form the association requires and does not have (`voices/squawk.md`)
- 12 .bay addresses: bellweather, glowcamp, bayhavenblue, lawyerlarry, stormmart, bigearls, bayhaventide, lowaltitude, mallardgreens, iguanainsurance, castawaykingdom, cityofbayhaven (`voices/web.md`)
- Pelican Pointe: Bellweather's name for the Pelican Rest build (`voices/web.md`)
- Coconut Cannon, Lazy Lagoon, The Shipwreck, Castaway Plaza, Coconut Cove: rides and places at Castaway Kingdom (`voices/web.md`)
- 555-0110: Sheriff's tip line (`voices/web.md`)
- 555-0122: Iguana Insurance claims (`voices/web.md`)

### Catalogue

- Pan Comido: bakery under the flat (`catalog/properties.md`)
- Mags & Cheese: sign on the owned food truck (`catalog/properties.md`)
- Square Goes Alone: second film at the Starlite (`catalog/properties.md`)
- Prize Run, Break Time, Full Detail, Lunch Rush, Reel Change, Trade-In, Keg Run, Door List, Feeding Time, The Round: business job names (`catalog/properties.md`)
- Birdbath Car Wash: brand of five car washes (`catalog/shops.md`)
- Heat Lap, Gull Patrol, Tide Pool Panic, The Grabby Crab: four Coral Arcade machines (`catalog/shops.md`)
- Triangle Meets Circle, Square Goes Alone: two Starlite films (`catalog/shops.md`)
- The Earl: Big Earl's burger (`catalog/shops.md`)
- The Captain's Platter: Shell Yeah's largest plate (`catalog/shops.md`)
- Deborah: alligator at Scale & Tail (`catalog/shops.md`)
- Bill: pharmacist at every Pill Bill's (`catalog/shops.md`)

### Activities

- Tow bed, Plywood, Steps, Mound, Hauler, Kicker: six ramp kits K1 to K6 (`activities/big-air.md`)
- Big Air wrap: car wrap for ramps 1 to 15 (`activities/big-air.md`)
- Frequent Flyer jacket: clothing for landing all 50 (`activities/big-air.md`)
- The Mallard Open: Sunday golf tournament (`activities/calendar.md`)
- The Daily Three: daily challenge (`activities/calendar.md`)
- Snowbird migration, Cold snap, Founders Day, Bayhaven Boat Show, Turtle weeks, Mango Fest, Hurricane season, Election week: eight seasons (`activities/calendar.md`)
- shirts, hats, sash, visor, ribbon: prizes from the calendar (`activities/calendar.md`)
- Promenade Pink, Spire Stripe, Mural, Hi-Vis Hibiscus, Wet Paint, Clearance, Approved Colour No. 3, Layover, Sawgrass, Causeway: ten district shirts (`activities/finds.md`)
- The Deck: cassette player for the radio on foot (`activities/finds.md`)
- 24 mixtape titles: songs in station styles (`activities/finds.md`)
- Ten Pin Tide: bowling alley on Gateway Boulevard (`activities/minigames.md`)
- The Gutter Gulls: its Monday league team (`activities/minigames.md`)
- Heat Lap, Gull Patrol, Tide Pool Panic: Coral Arcade cabinets (`activities/minigames.md`)
- The Grabby Crab: claw machine (`activities/minigames.md`)
- Welcome Mat, Lazy River, Tail Whip, Sprinkler Season, Snack Time, The Sinkhole, Loop the Gator, Hurricane Alley, On Break: Gator Putt holes 1 to 9 (`activities/minigames.md`)
- The Treasurer, The Landscaping Committee, The Vice-Chair, The Parliamentarian, The President's Proxy: pickleball ladder titles (`activities/minigames.md`)
- Double Six shirt, Boneyard cap, Butcher's Apron, Pier Regular hat, Claw Hand glove, Lot 12 visor, Club Champion visor: clothes won (`activities/minigames.md`)
- Sandbar, Car Park, Roundabout: three Heat Lap tracks (`activities/minigames.md`)
- Beachfront Dash, Spire Run, Bell Tower Rally, Tank Farm Trophy, Expressway Express, Strip Mall Shuffle, Chimney Sweep, Longspan Sunset: street races SR1 to SR8 (`activities/races.md`)
- Pier Pressure, Bridge to Bridge, Port Authority, Round the Isle: boat races BR1 to BR4 (`activities/races.md`)
- Dock Loop, Fish Camp Flyer, Earl's Run, Castaway Run: airboat races AB1 to AB4 (`activities/races.md`)
- The Ninth Fairway Derby, Sea Cow Classic, Early Bird Special, The Whole Coast: specials SP1 to SP4 (`activities/races.md`)
- Getaway driver, Riding shotgun, Night freight, Clam digging, The shopping list, Collections, Skip tracing, Neighbourhood watch: eight criminal jobs (`activities/side-jobs-crime.md`)
- Boss: scrapyard yard boss (`activities/side-jobs-crime.md`)
- Slow Tide Driving School: school on Gateway Boulevard owning the Permit cars (`activities/side-jobs.md`)
- Route 9, Bin day, Storm run, Lifeguard patrol, Scoop round, Baggage dash, Lawn order, Dual controls: eight new jobs (`activities/side-jobs.md`)
- Plaza Corner, Rosa Street Bend, Bell Tower Turn, Pigment Hook, Tank Farm Loop, Gateway Sweep, Runway Hold, Flip-Flop Kink: drift corners (`activities/side-jobs.md`)

### Systems

- Coral (1), Crosstown (4), Keys Hopper (7), Beachline (9), Northgate loop (15), Glades Express (44): bus routes (`systems/transit.md`)
- Pier Hopper, Keys Run: ferry routes (`systems/transit.md`)
- Route Duty: job (`systems/transit.md`)

### Art

- Half off: sticker on Lawyer Larry's card (`art/ui-kit.md`)
- the buoy: the mission marker (`art/vfx.md`)
