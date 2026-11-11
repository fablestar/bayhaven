# Bible · catalog · Properties and businesses

Twenty-six places to own: the 12 in `04-systems.md` section 14 with their prices, garages and incomes unchanged, then 8 more homes and 6 more businesses. Each has a seed, what it gives, three upgrades and, for a business, the one job it offers.

Tier: A for the 12 from `04-systems.md` (day 9 ships them). Where the canon gives the building itself a later tier, the entry says so: until that landmark is built, the door and its marker stand on a plain lot at the same seed. B, C and D for the 14 new ones, tagged per row.

## Rules

| Rule | Value |
|---|---|
| A property is | a save point, a wardrobe and garage slots. Entering one autosaves. |
| Buying | Walk to the "For sale" sign at the door and pay cash, or buy from Reel Estate. Emits `property:bought` with `{id, price}`. The id is stored in the save's `property` list. |
| Shared | Cash and property are shared by both leads. Wardrobes inside are per lead. |
| Garage slot | Holds one road vehicle with its paint and mods, under the save's `garage[id]`. A slot marked large also takes trucks and buses. Boat slips, pads and hangars are counted apart. |
| Delivery | The Garage app brings any stored vehicle to the nearest road for $50 |
| Hiding | Parked inside your own garage with the engine off, viewer drain is doubled, as for any garage in `04-systems.md` |
| Business income | Paid into cash at 09:00 each in-game day, with the brand deal. Emits `cash:changed` with the business id as the reason. |
| Business job | One per business, startable at its door or from the Jobs app, once per in-game day. It pays its set amount and adds 50% to that business's next payout. |
| Upgrades | Three per property, bought in order at the door. Each emits `property:upgraded` with `{id, step}`. Income upgrades add to the base figure; they never replace it. |
| Selling | Not possible. Bayhaven is a buyer's market. |

## All 26

| id | Property | Seed | Price | Garage | Daily income | Tier |
|---|---|---|---|---|---|---|
| `pelican-rest` | Pelican Rest trailer (start) | `(-1250, -220)` | free | 1 | 0 | A |
| `motel-12` | Tideline Motel, room 12 | `(-520, -60)` | $8,000 | 1 | 0 | A |
| `bakery-flat` | Flat over the bakery, Palma Vieja | `(-960, -800)` | $35,000 | 2 | 0 | A |
| `loft` | Paintworks loft | `(1430, -1117)` | $90,000 | 2 | 0 | A |
| `warehouse` | Rustwater warehouse | `(1930, -557)` | $150,000 | 6 | 0 | A |
| `fish-camp` | Fish camp, Mudcat Glades | `(2300, -3350)` | $60,000 | 2 + boat | 0 | A |
| `houseboat` | Houseboat, Pelican Keys | `(-2520, 830)` | $220,000 | 1 + 2 boats | 0 | A |
| `mansion` | Bellweather mansion, Sandpiper Isle (after the story) | `(-1000, 780)` | $2,500,000 | 8 + helipad | 0 | A |
| `arcade` | Business: Coral Arcade | `(585, 415)` | $120,000 | | $1,500 | A |
| `gator-putt` | Business: Gator Putt mini-golf | `(-600, -150)` | $200,000 | | $2,600 | A |
| `car-wash` | Business: car wash | `(520, -1765)` | $300,000 | | $4,200 | A |
| `food-truck` | Business: food truck | `(1000, -1100)` | $45,000 | | $700 | A |
| `sunburn-7` | Motel Sunburn, room 7 | `(200, -1590)` | $12,000 | 1 | 0 | B |
| `alba-suite` | Hotel Alba suite | `(290, -5)` | $400,000 | 3 | 0 | B |
| `sails-condo` | Twin Sails condo | `(430, -760)` | $650,000 | 4 | 0 | B |
| `sinkhole-bungalow` | Sinkhole Park bungalow | `(-680, -2400)` | $28,000 | 2 | 0 | C |
| `phase-four` | Phase Four driveway | `(-2960, -2480)` | $20,000 | 4 | 0 | C |
| `lighthouse` | Lighthouse cottage, Last Key | `(-3085, 1185)` | $310,000 | 1 + boat | 0 | C |
| `hangar-3` | Hangar 3, Hangar Row | `(2430, -2210)` | $480,000 | 4 + 2 aircraft | 0 | C |
| `grove-house` | Grove house, Tangelo | `(-3600, -4800)` | $95,000 | 3 | 0 | D |
| `starlite` | Business: Starlite Drive-In | `(350, -2400)` | $260,000 | | $3,400 | B |
| `wahoo-world` | Business: Wahoo World | `(100, -1750)` | $350,000 | | $4,800 | B |
| `stilt-house` | Business: The Stilt House | `(-2400, 640)` | $320,000 | | $4,000 | B |
| `humidity` | Business: Humidity | `(1450, -950)` | $900,000 | | $11,000 | B |
| `scale-tail` | Business: Scale & Tail | `(700, -3350)` | $180,000 | | $2,300 | C |
| `scoop-round` | Business: the Scoop Dreams round | `(650, -5)` | $85,000 | 1 | $1,200 | C |

## The eight homes from the core

### Pelican Rest trailer · `pelican-rest` · tier A
- **Gives:** the first save point and wardrobe, one space under the awning where Mags's Heron lives, and Gerald on the roof. It can never be lost; the story is about that.
- **Upgrades:** 1. Second awning, $1,500: garage 2. · 2. Tool shed, $4,000: vehicles stored here are repaired free. · 3. Gerald's perch, $9,000: Gerald leaves a gift on the step at 09:00 each day, $20 to $200 or a hat he has taken from a deputy.

### Tideline Motel, room 12 · `motel-12` · tier A (the motel landmark is B)
- **Gives:** save point, wardrobe, the space outside the door, and an ice machine that restores 10 health a visit. Buying it unlocks `slippers`.
- **Upgrades:** 1. Room 14 knocked through, $3,000: 12 saved outfits per lead instead of 6. · 2. Covered space, $6,000: garage 2. · 3. The sign, $10,000: you set the neon to "No vacancy". In your own space, viewer drain is tripled instead of doubled.

### Flat over the bakery · `bakery-flat` · tier A
- **Gives:** save point, wardrobe, a courtyard for two cars behind a gate, and warm bread from Pan Comido downstairs: 25 health once a day.
- **Upgrades:** 1. Courtyard roof, $5,000: garage 3. · 2. Baker's key, $8,000: bread on every visit, health to 100. · 3. A seat at the table, $12,000: jobs given by Rafa and by Abuela Carmen pay 10% more.

### Paintworks loft · `loft` · tier A
- **Gives:** save point, wardrobe, a freight lift that parks two cars indoors, and one brick wall that shows a mural by seed. Pick a new seed at the door for $100.
- **Upgrades:** 1. Second deck, $15,000: garage 4. · 2. Edit desk, $20,000: each photo of a postcard spot earns 50 more followers. · 3. Roof pad, $60,000: a helipad.

### Rustwater warehouse · `warehouse` · tier A
- **Gives:** save point, wardrobe, six large slots behind a roller door wide enough for a Manatee, and a Fiddler that lives here.
- **Upgrades:** 1. Racking, $25,000: garage 10. · 2. Paint booth, $40,000: any factory colour free on a stored vehicle; driving out in new paint unseen counts as changing car. · 3. Dess's favour, $70,000: Garage app deliveries from here are free and arrive by Hogfish within 10 s.

### Fish camp · `fish-camp` · tier A (the fish camp landmark is B)
- **Gives:** save point, wardrobe, two slots on the gravel, one boat slip, and a porch you can fish from with the pier fishing rules.
- **Upgrades:** 1. Second slip, $8,000: two boats. · 2. Smokehouse, $12,000: any fish caught anywhere sells for 25% more, or makes a meal worth 50 health. · 3. Airboat shed, $30,000: a Gatorback of your own, always here.

### Houseboat · `houseboat` · tier A (the marina on Hammock Key is B)
- **Gives:** save point, wardrobe, one space on the dock, two slips, and the best sunset in the game from the roof.
- **Upgrades:** 1. Top deck, $20,000: a hot tub that restores 5 health a second. · 2. Third slip, $35,000. · 3. Outboards, $90,000: the houseboat can be driven at 6 km/h and tied up at any marina, and stays a save point wherever it is.

### Bellweather mansion · `mansion` · tier A
- **Gives:** on sale only after The Spire Job. Save point, wardrobe, an eight-car garage, the helipad, a pool, and Chad and Brad on the gate, if you left them breathing. They are no better at it.
- **Upgrades:** 1. Private dock, $150,000: three slips on the south shore. · 2. Showroom floor, $200,000: garage 16. · 3. The panic room, $400,000: walk in unseen at heat 1 to 3 and the heat clears at once.

## The four businesses from the core

### Coral Arcade · `arcade` · tier A (the pier hall is B)
- **Gives:** $1,500 a day, free plays, and Arcade FM in any vehicle once that station exists.
- **Job, Prize Run:** load 12 plush Geralds at the Rustwater warehouse district `(2090, -700)` and get them to the pier before 11:00. Each one that falls out in a crash costs $50. Pays $300.
- **Upgrades:** 1. New cabinets, $20,000: +$400 a day. · 2. Prize wall, $35,000: +$600 and a fourth machine. · 3. Late licence, $60,000: +$1,000, open all night.

### Gator Putt · `gator-putt` · tier A (the course is C)
- **Gives:** $2,600 a day and free rounds.
- **Job, Break Time:** the alligator on break has wandered up to 200 m away. Find it and walk it home with a roast chicken on a rope. Pays $350.
- **Upgrades:** 1. Night glow, $30,000: +$600. · 2. Hole 19, $45,000: +$900 and a hole on the roof. · 3. The eighteenth alligator, $80,000: +$1,500. The radio ad changes to "Eighteen holes. Eighteen alligators. Nobody is on break."

### The car wash · `car-wash` · tier A
- **Gives:** $4,200 a day and free washes at this branch, the Birdbath in Northgate.
- **Job, Full Detail:** collect a customer's Bonito or Coquina from an address within 1 km, bring it through the wash and return it inside 4 minutes with no new damage. Pays $400.
- **Upgrades:** 1. Wax arch, $40,000: +$800; a freshly waxed car earns 10% more followers for 5 minutes. · 2. Second tunnel, $70,000: +$1,400. · 3. Staff who saw nothing, $120,000: in your own tunnel viewer drain is tripled instead of doubled.

### The food truck · `food-truck` · tier A (the food-truck yard is B)
- **Gives:** $700 a day, a Pompano food truck of your own signed Mags & Cheese, and free food from its hatch.
- **Job, Lunch Rush:** drive the truck to three marked pitches and hold still for 20 s at each while the queue is served, before the grill meter runs cold. Pays $150 plus up to $150 in tips.
- **Upgrades:** 1. Better grill, $8,000: +$250. · 2. Second hatch, $12,000: +$350. · 3. Festival pitch, $25,000: +$700, and the truck works the Speedbowl on Fridays.

## Eight more homes

### Motel Sunburn, room 7 · `sunburn-7` · tier B
- **Seed note:** Northgate, Motel Circle, 330 m from the Sheriff's studio. Walk out after being booked and you are nearly home.
- **Gives:** save point, wardrobe, one space, a pool.
- **Upgrades:** 1. Poolside space, $2,500: garage 2. · 2. Gun locker under the bed, $4,000: weapons left here survive being booked. · 3. Scanner on the nightstand, $9,000: at heat 1 and 2, deputies within 300 m show on the minimap.

### Hotel Alba suite · `alba-suite` · tier B
- **Gives:** save point, wardrobe, three valet slots, room service that restores health to 100, and a valet who brings any stored car to the door free.
- **Upgrades:** 1. Valet's favourite, $30,000: garage 6. · 2. Balcony, $50,000: a photo from it earns 200 followers once a day. · 3. Penthouse, $250,000: a roof helipad.

### Twin Sails condo · `sails-condo` · tier B
- **Gives:** save point, wardrobe, four slots two floors underground, and the skybridge to walk across.
- **Upgrades:** 1. Second bay, $60,000: garage 8. · 2. Concierge, $80,000: Iguana Insurance vehicle cover is free. · 3. Skybridge pad, $300,000: a helipad on the bridge roof, 120 m up.

### Sinkhole Park bungalow · `sinkhole-bungalow` · tier C
- **Gives:** save point, wardrobe, two slots, and a back garden that ends 18 m lower than it starts. Cheap, for that reason.
- **Upgrades:** 1. Carport, $4,000: garage 3. · 2. Patio ramp, $7,000: a Big Air ramp off the patio into the Sinkhole; a landed jump pays $100 once a day. · 3. Winch, $15,000: pulls any vehicle out of the Sinkhole to your drive.

### Phase Four driveway · `phase-four` · tier C
- **Gives:** a driveway, a mailbox and no house. You save by sitting in a parked car and the wardrobe is in the mailbox. Four slots in a row. The association texts a $25 fine each day for "failure to have a house".
- **Upgrades:** 1. Bigger mailbox, $500: 12 saved outfits. · 2. Slab, $10,000: garage 6. · 3. The house, $120,000: a house appears in one of the four approved colours, the fines stop, and security Birdies in Mallard Greens ignore you.

### Lighthouse cottage · `lighthouse` · tier C
- **Gives:** save point, wardrobe, one space at the end of the Longspan, one slip, and the lamp room, the highest floor in the Keys.
- **Upgrades:** 1. Dock, $25,000: three slips. · 2. Lamp key, $40,000: turn the beam from the phone; Garage app deliveries by boat to wherever it points are free. · 3. Mooring, $90,000: holds a Cormorant or a Gnat.

### Hangar 3 · `hangar-3` · tier C
- **Gives:** save point, wardrobe, four large slots, room for two aircraft, and a pass onto the runway, so driving there is no longer a crime.
- **Upgrades:** 1. Tug, $20,000: a Gopher of your own. · 2. Workshop, $60,000: aircraft stored here are repaired free. · 3. Third bay, $150,000: four aircraft, and the door is wide enough for a Tropicbird.

### Grove house · `grove-house` · tier D
- **Seed note:** Citrus Flats, 400 m south of Tangelo's water tower.
- **Gives:** save point, wardrobe, three slots, a Tortoise, and 20 oranges on the porch each morning (5 health each).
- **Upgrades:** 1. Barn, $15,000: garage 6, large. · 2. Juice press, $20,000: Squeeze Play buys the day's oranges for $100. · 3. Dirt strip, $80,000: 250 m of runway and room for one aircraft.

## Six more businesses

### Starlite Drive-In · `starlite` · tier B
- **Gives:** $3,400 a day and free entry.
- **Job, Reel Change:** fetch tonight's film can from the freight shed on Hangar Row `(2400, -2200)` and reach the booth by 19:00 with the vehicle above 90% health. Pays $350.
- **Upgrades:** 1. Second feature, $40,000: +$700 and a new six-minute film, Square Goes Alone. · 2. Snack bar, $55,000: +$900. · 3. Bigger screen, $90,000: +$1,400, and at midnight the screen replays the day's best drift.

### Wahoo World · `wahoo-world` · tier B
- **Gives:** $4,800 a day and 10% off any vehicle on the lot.
- **Job, Trade-In:** a customer wants a named model in a named factory colour. Find one in traffic, or buy and paint one, and deliver it above 80% health. Pays $400.
- **Upgrades:** 1. Second tube man, $30,000: +$600. · 2. Service bay, $80,000: +$1,200 and free repairs here. · 3. Showroom glass, $140,000: +$2,000, and the daily stock grows from 8 to 14.

### The Stilt House · `stilt-house` · tier B
- **Gives:** $4,000 a day, a slip at the bar's ladder, steel drums on arrival.
- **Job, Keg Run:** carry four kegs of Humid Lager by boat from the west marina `(-1150, 110)` in 5 minutes. A jump over a wake loses a keg. Pays $350, less $50 a keg lost.
- **Upgrades:** 1. A band every night, $35,000: +$700. · 2. Longer dock, $60,000: +$1,000 and four slips you may use. · 3. Sunset deck, $110,000: +$1,600 and a new postcard spot.

### Humidity · `humidity` · tier B
- **Gives:** $11,000 a day, no queue, and a parking space at the door that is always empty for you.
- **Job, Door List:** collect a guest from the Hotel Alba forecourt in a Sturgeon, or anything priced $100,000 or more, and deliver them to the rope. The tip falls with every bump, as in a Bay Cab fare. Pays up to $400.
- **Upgrades:** 1. Light rig, $90,000: +$2,000; the roof beams pulse with Bassline FM and show from 1 km. · 2. Foam night, $120,000: +$2,500; on Thursdays foam covers the street outside, grip 0.6. · 3. A second room called Dew Point, $250,000: +$4,500.

### Scale & Tail · `scale-tail` · tier C
- **Gives:** $2,300 a day and a Skink of your own.
- **Job, Feeding Time:** carry six buckets of feed round the boardwalk on the Skink inside 3 minutes. A bucket tips at any lean over 20°. Pays $250.
- **Upgrades:** 1. Gift shop, $25,000: +$500. · 2. Night tours, $40,000: +$800. · 3. Deborah's show, $75,000: +$1,300, with a stand of 40 seats and a crowd that films.

### The Scoop Dreams round · `scoop-round` · tier C
- **Gives:** $1,200 a day and a Conch of your own, kept in the yard by the pier gate.
- **Job, The Round:** drive Heron Walk Drive with the jingle on and serve five queues before the rival van from Local Man event 10 reaches them. Pays $200.
- **Upgrades:** 1. Second flavour, $10,000: +$300. · 2. Louder jingle, $15,000: +$400, and it draws people from 50 m instead of 30. · 3. Second van, $45,000: +$800, with a van that works Mallard Greens by itself.

## What everything adds up to

| | Cash |
|---|---|
| All 26 properties | $7,818,000 |
| All 78 upgrades | $4,530,500 |
| Daily income, base, with all ten businesses | $35,700 |
| Daily income with every income upgrade | $67,400 |

The first figure is what the "own everything" achievement asks for. Nothing here is needed to finish the story.

## New names

- **Pan Comido:** the bakery under the flat in Palma Vieja.
- **Mags & Cheese:** the sign on the food truck you own.
- **Square Goes Alone:** the second film at the Starlite Drive-In.
- Job names: Prize Run, Break Time, Full Detail, Lunch Rush, Reel Change, Trade-In, Keg Run, Door List, Feeding Time, The Round.
