# Bible · catalog · Shops

Every shop brand in canon section 8, plus the coffee window, the food brands and the car washes from `04-systems.md` section 13. Each entry gives what it sells with prices, a seed for every branch, hours, the clerk, three clerk lines and the one thing that makes it worth the drive. A shop is a door with a marker and a menu; there are no interiors.

Tier: A for the eight kinds of shop in `04-systems.md` section 13 (Second Wind Thrift, Maison Sable in Meridian, Storm Mart, Bait & Ballistics in Northgate, Park & Sons Auto, the car washes, Ventanita Rosa, Shell Yeah). B and C for the rest, tagged per entry. A branch arrives with its district.

## Rules for every shop

| Rule | Value |
|---|---|
| Marker | A cyan door icon on the minimap within 150 m; the brand's own icon on the big map |
| Opening the menu | Walk into the door marker (radius 1.5 m), or stop a vehicle on a drive-through marker. Emits `shop:opened` with `{shop, branch}`. |
| Closed | The sign is unlit, the marker is grey and the door says the hours. Hours are in-game time. |
| Sundays | Anything that closes at all closes at 18:00 |
| Hurricane | Everything is shut except Storm Mart, which is sold out |
| Seen | No shop but Birdbath serves you while a deputy or camera can see you walk in. The clerk says the brand's third line instead. |
| Discount | 10% off everywhere at 100,000 followers |
| Paying | Cash only. A purchase emits `cash:changed` with the shop as the reason. |
| Gunfire | A shot within 30 m shuts every door for 60 s. The clerk ducks. |
| Food | Eaten on the spot: health rises over 2 s. One item may be pocketed and eaten later from the quick bar. |
| Clerks | A box person behind the door glass, with the look given. Lines are 90 characters or fewer, shown as subtitles with blips at 220 Hz unless noted. |

Positions are owned by the district files in `bible/world/`; the seeds here are copies of theirs.

Seeds are `(x, z)`. A seed sits inside a block beside the road named, never on the road itself.

## The eight from the core

### Second Wind Thrift · tier A · 09:00 to 20:00
- **Sells:** every `SW` item in `clothes.md` ($15 to $45), six `floral-N` shirts that change each day, and a used bat for $40.
- **Branches (6):** Tideline `(-840, -76)` · Palma Vieja `(-1130, -720)` · Meridian `(-560, -880)` · The Paintworks `(892, -720)` · Northgate `(60, -1835)` · Rustwater, Dockside Avenue at First Street `(2010, -400)`.
- **Clerk:** a woman in `floral-44`, `readers` and a `bucket-sand`, reading a paperback. She never looks up.
- **Lines:** "Everything's five dollars unless it isn't." · "That was somebody's favourite. He won't be needing it." · "Sirens. Not my business. Change in the back and hurry the hell up."
- **Special:** the way to lose heat on foot. Walk in unseen and change two or more slots: heat drops one level at once.

### Maison Sable · tier A in Meridian, C on Sandpiper Isle · 11:00 to 19:00
- **Sells:** every `MS` item in `clothes.md` ($90 to $4,000).
- **Branches (2):** Meridian `(24, -636)` · Sandpiper Isle `(-850, 520)`.
- **Clerk:** tall, all in white (`linen-white`, `linen-trousers`), `gold-rims`, hands folded.
- **Lines:** "We don't do sizes. We do appointments." · "A brave choice. I mean that warmly." · "Sir. Madam. The pavement is that way."
- **Special:** the door stays locked unless you arrive in a vehicle priced $60,000 or more, or wear any `MS` item.

### Storm Mart · tier A · 06:00 to 22:00
- **Sells:** life vest $300 (armour 100) · flare gun $250 · flare $15 · pool noodle $0 · lawn flamingo $25 · leaf blower $180 and fuel $10 · every `SM` item in `clothes.md`.
- **Branches (8):** Tideline, Rosa Street at Conch Street `(-1050, -150)` · Tideline `(480, -156)` · Palma Vieja `(-1600, -1180)` · Meridian `(650, -478)` · Rustwater `(1850, -400)` · Northgate `(200, -1845)` · Runway Flats `(760, -1960)` · Mudcat Glades, Mudcat Road at Route 44 `(740, -2975)`.
- **Clerk:** a man in a `hi-vis` vest and `hardhat`, holding a clipboard.
- **Lines:** "Plywood's aisle two. Aisle two is empty." · "A vest floats. It also stops a round. One round." · "We were going to close anyway."
- **Special:** the shelf always shows one pool noodle left. From 14:45 until the 15:15 storm ends, ponchos and rain hoods are half price. Each yard holds a fireworks crate and a Fiddler.

### Bait & Ballistics · tier A in Northgate, B elsewhere · 07:00 to 21:00
- **Sells:** at every branch: pistol $600 · revolver $1,200 · SMG $2,200 · shotgun $1,800 · fillet knife $30 · flare gun $250 · all ammo at the prices in `weapons.md` · tub of bait $5 (20 casts at the pier) · every `BB` item in `clothes.md`. In the Glades and on Tackle Key: rifle $2,900. In the Glades only: sniper rifle $3,500, and grenades at $300 from the fridge marked "live bait".
- **Branches (3):** Northgate `(520, -1840)` · Mudcat Glades `(-1000, -3020)` · Tackle Key `(-2290, 495)`.
- **Clerk:** a wide man in a `camo-cap` and `fishing-vest`, with a toothpick.
- **Lines:** "Left side's bait. Right side's ballistics. Both put holes in things." · "Paperwork? Son, this is Marlin County." · "Deputy's outside. I ain't selling you shit."
- **Special:** the only seller of firearms. The further from town the branch, the worse the stock gets. After being booked, your first pistol back is half price ("the loyalty card").

### Park & Sons Auto · tier A · 08:00 to 20:00
- **Sells:** repair, $100 plus 1% of the vehicle's price · paint, $100 for a factory colour, $400 for any hex, $800 for two tones · wraps $1,200 (waves, flames, check, camo, hazard, or a floral from the shirt generator by seed) · engine levels 1, 2, 3 at $2,500, $8,000, $25,000 (top speed +5%, +10%, +15%; 0-100 time -8%, -15%, -22%) · tyres: grip $1,500 (+0.08 grip), drift $1,500 (+0.2 drift), mud $2,000 (halves surface losses), solid $4,000 (spike strips do nothing) · nitro $6,000 (3 s at +40% thrust, 20 s recharge) · horns $100 to $500, eight of them, each two notes or a short tune.
- **Branches (3):** Tideline `(340, -230)` · Northgate `(-120, -2160)` · Rustwater, the port branch `(2020, -470)`.
- **Clerk:** Wendell Park in Tideline, in the outfit "Pit Chief". Elsewhere a young mechanic in a `work-shirt` whose name patch reads "Not a son".
- **Lines:** "What the hell did you do to her?" · "Holes I can fill. I don't ask who made them." · "I'm not opening this door till those lights go away."
- **Special:** the mod garage. Mods are saved on the vehicle as `engine1`, `engine2`, `engine3`, `tyres-grip`, `tyres-drift`, `tyres-mud`, `tyres-solid`, `nitro`, `horn-N`, `wrap-N`. Driving out in new paint while unseen counts as changing car: heat drops one level.

### Birdbath Car Wash · tier A · always open
- **Sells:** a wash, $20. It takes 12 s to roll through, removes dirt and mud, and hands back loose bumpers.
- **Branches (5):** Tideline `(-470, -236)` · Meridian `(650, -1270)` · Palma Vieja `(-1450, -478)` · Northgate `(520, -1765)` · Runway Flats `(1180, -1730)`.
- **Clerk:** none. A sign with a bathing pelican says "Engine off. Windows up. Hands in."
- **Lines (the sign's ticker):** "Now washing: a vehicle of interest." · "Please remain boring." · "Stains are stains. We do not ask."
- **Special:** viewer drain is doubled while you are inside, and the brushes hide the vehicle from every camera. A wash lasts 12 s, so stay in the tunnel by holding the brake: it will keep washing for $20 a pass. The Northgate branch is the car wash you can buy (`properties.md`).

### Ventanita Rosa · tier A · always open
- **Sells:** cafecito $5 (sprint stamina doubled for 2 minutes) · colada to share $8 (the same for both leads) · pastelito $6 (+15 health) · croqueta $5 (+12 health).
- **Branch (1):** Palma Vieja, Avenida Rosa at Calle Tres `(-1020, -640)`.
- **Clerk:** a woman in a `guayabera` with a pink apron, already pouring. There is always a queue of four.
- **Lines:** "¿Lo mismo? The same. I knew it." · "Drink it here. It's rude to run with it. Run after." · "Mi amor, they're shooting at you. Go round the back."
- **Special:** the queue parts for Mags. Teo waits 4 s. The stamina effect does not stack with a second cup; it restarts the 2 minutes.

### Shell Yeah · tier A · 10:00 to 23:00
- **Sells:** fish sandwich $9 (+30) · shrimp basket $14 (+45) · conch fritters $7 (+20) · the Captain's Platter $40 (+100).
- **Branches (7):** Tideline, on the Heron Walk promenade `(118, 47)` · Meridian `(-170, -535)` · Northgate `(-290, -1765)` · Rustwater `(2440, 60)` · and three more stands on the Heron Walk promenade at `(-800, 45)` `(520, 45)` `(900, 45)`.
- **Clerk:** a teenager in a `visor-neon` and a `tee-white`, shouting orders to nobody.
- **Lines:** "Shell yeah! Sorry. They make us say it." · "Fried, or fried?" · "Uh, there's a helicopter looking at you."
- **Special:** gulls. Carry food away and Gerald, or any gull within 20 m, will try for it; lose it and you get half the health.

## The other shops

### Surf & Vinyl · tier B · 10:00 to 21:00
- **Sells:** every `SV` item in `clothes.md` · pool noodle $0 · records $30 each, 12 of them: owning one adds its song to the jukebox at any property.
- **Branches (3):** Tideline, Heron Walk Drive `(-170, -5)` · Palma Vieja, Avenida Rosa on Calle Mural `(-985, -790)` · Flip-Flop Key `(-2010, 310)`, tier C.
- **Clerk:** a sunburnt man in `floral-58` and `teardrops`, waxing a board that never sells.
- **Lines:** "Boards in front, wax in the middle, feelings in the back." · "That one skips. Skipping is the best part." · "Whoa. Heavy vibes outside. Come back mellow."
- **Special:** while Surfside Sid's station is not yet on air, the shop's own speaker plays it through the door.

### Coral Arcade · tier B · 11:00 to 01:00
- **Sells:** plays at $1 each on four machines: the cabinets Heat Lap, Gull Patrol and Tide Pool Panic, and The Grabby Crab, the claw machine (rules in `bible/activities/minigames.md`). Each play pays 2 to 40 tickets, the prize points of that file. Prizes: `lane-shoes` 200 tickets · `arcade-tee` 500 · a plush Gerald for your dashboard 800.
- **Branches (2):** the hall at the end of Gullwing Pier `(585, 415)` · the old shopfront on the day 1 block `(0, 0)`, a lit sign with a note: "Moved to the pier. Follow the wheel."
- **Clerk:** a bored attendant in a `hoodie-live` behind the prize counter.
- **Lines:** "Tickets don't expire. Neither do I, apparently." · "The claw is not rigged. The claw is tired." · "No running. No refunds. No sheriffs."
- **Special:** Arcade FM plays inside. The business can be bought (`properties.md`).

### Frond Memories · tier B · 08:00 to 18:00
- **Sells:** apology bouquet $20 · lawn flamingo $25 · potted palm $60 (stands at a property you own) · funeral wreath $45.
- **Branches (3):** Palma Vieja `(-1120, -880)` · Northgate, Medical Mile across from Bayhaven General `(-600, -1790)` · Mallard Greens, Clubhouse Circle `(-1960, -2080)`, tier C.
- **Clerk:** a small man in an apron with a fern behind his ear.
- **Lines:** "Who are we saying sorry to today?" · "Wreaths are by the door. Busy month. I blame you." · "I arrange flowers. I don't arrange alibis."
- **Special:** hand an apology bouquet to anyone you knocked over within 30 s and that crime is forgotten. It does nothing for anyone you shot. Leave a wreath where someone went down and people nearby stop to film it: 50 followers.

### Mullet Over · tier B · 09:00 to 19:00
- **Sells:** haircuts $30, eight cuts (crop, flat-top, ponytail, bun, curls, waves, mullet, shaved) · colour $60, any of 12 · the pair $80.
- **Branches (3):** Tideline, Seagrape Street at Founders Avenue `(-740, -70)` · Palma Vieja, Los Patios `(-1530, -1200)` · Northgate `(-80, -1760)`.
- **Clerk:** a barber with a tall flat-top and a comb in his `work-shirt` pocket.
- **Lines:** "Business in the front. You know the rest." · "I can fix that. I can't fix who did it." · "Sit down or get out, you're live on my window."
- **Special:** Mags only ever takes a trim and keeps the ponytail. Teo's bleach is free to redo. A new cut and colour together count as one changed slot for the heat rule.

### Reel Estate · tier B · 09:00 to 17:00
- **Sells:** every property in `properties.md` at its listed price, from one menu with a map · tub of bait $5.
- **Branches (2):** Tideline, Seagrape Street in the West End `(-1210, -75)` · Tackle Key `(-2265, 500)`, sign only.
- **Clerk:** a woman in a `blazer-coral` holding a fishing rod like a pointer.
- **Lines:** "Waterfront, water view, or water damage?" · "The last owner left in a hurry. Or a bag. Sign here." · "I can't show a house with the Sheriff in the yard."
- **Special:** buy any property without driving to its door. She will not sell the Bellweather mansion until the story ends.

### Manatee Mattress · tier B · 10:00 to 20:00
- **Sells:** a mattress $200, delivered to one property you own: resting there restores health to 100 at once · a nap on a display bed, free once a day, then $40.
- **Branches (2):** Northgate `(330, -1760)` · Tideline, Conch Street in Motel Row `(-890, -150)`.
- **Clerk:** a slow, kind man in a grey `tee-white` shaped rather like the logo.
- **Lines:** "Lie down. Everyone lies down eventually." · "Firm, soft, or floats?" · "No naps for fugitives. Store policy."
- **Special:** the nap skips to the next 06:00 and saves the game, like a property.

### Iguana Insurance · tier B · 09:00 to 17:00
- **Sells:** vehicle cover $400 an in-game week: an owned vehicle that is destroyed comes back to its garage repaired · falling-iguana cover $5: pays $500 if an iguana lands on your vehicle · hurricane cover: "not available in your area".
- **Branches (2):** Meridian, Sandbar Avenue at Commerce Way `(330, -635)` · Northgate `(-160, -1760)`.
- **Clerk:** a man in a green `blazer-coral` recoloured `#3fb86a`, very still, blinking one eye at a time.
- **Lines:** "We cover everything except what happens." · "Life cover? For you? No. God, no." · "Is that the police? This policy is now void."
- **Special:** the iguana cover pays out during Local Man event 15.

### Cash 4 Jet Skis · tier B · 08:00 to 18:00
- **Sells:** Skimmer $9,000 · Minnow $2,500 · Gatorback $24,000 · Skipjack $38,000 · Swan $900 · Snowbird $850,000 (tier C). Buys any boat you bring for 5% of its price, and any Skimmer for 10%.
- **Branch (1):** Tideline, on the sand off Heron Walk Drive west of the yacht club `(-1450, 2)`.
- **Clerk:** Skip Lindqvist in a `captain` cap and `floral-101`, sunburnt to the collar.
- **Lines:** "Cash! For jet skis! It's the whole pitch." · "She floats. I've seen her float." · "Not with the patrol boat watching, friend."
- **Special:** a bought boat is delivered to the nearest marina, or to your own slip. Skip's Repo Depot jobs start here.

### Galleria Flamingo · tier A as a landmark, B as a shop · 10:00 to 21:00
- **Sells:** one door, three tabs. Clothes: every `GF` item. Sports: bat $40, T-shirt cannon $450 and shirts $30 for 5. Food court: Scoop Dreams, Squeeze Play and Key Lime Crimes at their usual prices.
- **Branch (1):** Northgate `(-200, -2000)`, doors on the north and east faces.
- **Clerk:** an information desk robot made of two boxes and a screen with a smile on it.
- **Lines:** "Welcome to Galleria Flamingo. You are here. So is everyone." · "Your purchase supports this car park." · "Security has been asked to walk towards you slowly."
- **Special:** the 600-space car park always has 40 parked cars to choose from. The Dawn Patrol walks its laps at 06:00.

### Gator Putt · tier C · 10:00 to 23:00
- **Sells:** a round of 18 holes $12 (a timing minigame, par 54) · slush $5 (+10 health).
- **Branch (1):** Tideline, Motel Row `(-600, -150)`.
- **Clerk:** a student in a `gator-hat` handing out putters through a hatch.
- **Lines:** "Eighteen holes. Seventeen alligators. One's on break." · "Don't feed them. Don't putt them." · "Sheriff's on the ninth. I'd play through."
- **Special:** a hole in one on the 18th pays $100. Under par for the round pays $250, once a day. The business can be bought.

### Starlite Drive-In · tier B · 19:00 to 01:00
- **Sells:** a ticket $10 a vehicle ($5 on Tuesdays at 20:00) · popcorn $6 (+15 health) · soda $5 (+8).
- **Branch (1):** Northgate `(350, -2400)`, gate on Billboard Road.
- **Clerk:** a ticket seller in a booth, lit from below, in `drive-in` glasses.
- **Lines:** "Tonight: Triangle Meets Circle. Again." · "Lights off, engine off, hearts open." · "No chases during the feature. Wait for the interval."
- **Special:** the film is Triangle Meets Circle, a six-minute loop of shapes. On Tuesdays at 20:00 a second film, Square Goes Alone, plays over it. Parked facing the screen with the engine off, viewer drain is doubled as in `04-systems.md`, and deputies at heat 1 and 2 will not drive in during the film. Sitting through one loop unlocks the `drive-in` glasses.

### Wahoo World · tier B · 09:00 to 21:00
- **Sells:** eight road vehicles from `vehicles-road.md` at list price, the stock re-rolled each in-game day from those with no brackets and tier at or below the build's. Buys any vehicle you own for 50% of its price.
- **Branch (1):** Northgate, Gateway Boulevard `(100, -1750)`.
- **Clerk:** a salesman in a `flamingo-jacket` beside a pink inflatable tube man that waves when he talks.
- **Lines:** "What do I have to do to put you in this Possum today?" · "One owner. Several drivers. Don't open the boot." · "A test drive? With that many sirens? Bold."
- **Special:** a test drive is free for 2 minutes. Keep the car longer and it is theft: heat +1.

### Dent-A-Car · tier B · always open
- **Sells:** a day's hire of a Snook $50, Guppy $80, Tarpon $120 or Tern $300, plus a $100 deposit.
- **Branches (3):** Runway Flats, Rental Row `(1100, -1750)` · Tideline, Seagrape Street in the Pier Quarter `(735, -75)` · Rustwater, the cruise terminal `(2480, 70)`, tier C.
- **Clerk:** a cheerful agent in a `tee-greetings` with a pen on a chain.
- **Lines:** "It comes with a dent. That one's on us." · "Any new dents are on you. We count." · "Returning it on fire is still returning it."
- **Special:** every car arrives at 90% health, so the deposit is never returned. A hired car is delivered by the Garage app for free.

### Sandbar Market · tier B · 07:00 to 23:00
- **Sells:** fruit $5 (+10) · sandwich $8 (+25) · roast chicken $14 (+50, and it is the bait for gator wrangling) · coconut $5 (+8) · picnic box $40 (+100).
- **Branches (4):** Tideline, Sandbar Avenue at Conch Street `(400, -150)` · Meridian `(400, -557)` · Northgate `(0, -1850)` · Rustwater, Tower Way `(1930, -1040)`.
- **Clerk:** a cashier in a mint apron who scans everything twice.
- **Lines:** "Did you find everything? Nobody ever does." · "Paper, plastic, or just carry it like that?" · "Clean-up on the whole street, apparently."
- **Special:** the trolleys outside are props that can be ridden downhill.

### Pill Bill's · tier B · 08:00 to 22:00
- **Sells:** bandage $15 (+30 health) · first-aid kit $60 (+100, pocketed) · fizzy vitamins $9 (+10) · SPF 1000 $20 (does nothing; Kiki swears by it) · `shower-cap` $15.
- **Branches (5):** Northgate, three in a row 40 m apart `(-600, -1840)` `(-600, -1880)` `(-600, -1800)` · Meridian `(-640, -478)` · Tideline, Conch Street in the Pier Quarter `(880, -150)`.
- **Clerk:** Bill, or a man who looks just like him, in a white coat at every branch.
- **Lines:** "I'm Bill. No, that's the other Bill." · "Take one. If that works, tell the other Bill." · "That's a lot of holes. Aisle three. Good luck."
- **Special:** leaving Bayhaven General, the first bandage that day is free.

### Flounder Works · tier C · 10:00 to 22:00
- **Sells:** the Flounder $38,000 · hop kit for any car $2,500 (the Flounder's hop) · pinstripes $600 · wire wheels $900 · candy paint $1,500 (a second hue at glancing angles) · six horn tunes $400 each.
- **Branch (1):** Palma Vieja, El Bajo `(-1250, -420)`.
- **Clerk:** a painter in a `bandana` and a spattered `tank-white`, holding the thinnest brush in the city.
- **Lines:** "Low is a feeling. Slow is a choice." · "I don't rush lines. Come back Thursday." · "Park it inside. They never look inside."
- **Special:** a hop contest in the yard on Thursdays at 20:00: most hops in 30 s wins $500.

### Scale & Tail · tier C · 09:00 to 18:00
- **Sells:** entry $8 (the feeding show, on the hour) · every `ST` item in `clothes.md` · a bucket of gator feed $10.
- **Branch (1):** Mudcat Glades, off Route 44 `(700, -3350)`.
- **Clerk:** a keeper in a `gator-tee` missing one glove. The glove is in the pond.
- **Lines:** "Keep your hands inside your hands." · "That's Deborah. She's shy. She's also fast." · "Gators don't like sirens. Nobody asked them."
- **Special:** the drop-off for gator wrangling. The business can be bought.

### Pelican Fuel · tier B · always open
- **Sells:** tyre patch and tape $40 (mends burst tyres, +15 vehicle health) · nitro refill $80 · Fizzy Lizard $5 · Lightning Bug $6 · snacks $5 to $12.
- **Branches (8):** Tideline `(-960, -156)` · The Paintworks `(1700, -400)` · Palma Vieja `(-1930, -400)` · Rustwater, a truck stop `(1990, -1260)` · Northgate `(200, -1765)` · Runway Flats `(745, -1830)` · Mudcat Glades `(740, -2975)` · Lime Key `(-2820, 990)`, tier C.
- **Clerk:** a night-shift cashier behind thick glass, speaking through a grille.
- **Lines:** "Pump four. It's always pump four." · "Bathroom key's attached to a hubcap. Bring it back." · "I see nothing. The camera sees everything."
- **Special:** there is no fuel gauge in Bayhaven. Each forecourt has a security camera that counts as a camera for viewers until it is shot out. A round into a pump starts a fire that reaches the fire stage of any vehicle within 6 m.

## Food and drink

Every brand below is a stand, a window or a drive-through with the same door menu. Health is given in brackets.

| Brand | Sells | Where | Hours | Tier |
|---|---|---|---|---|
| Mango Moon | smoothie $8 (+25) | Tideline promenade `(240, 45)` · Wet Paint Alley `(1120, -570)` | 08:00 to 20:00 | B |
| Key Lime Crimes | slice $6 (+20), whole pie $24 (+100) | Gullwing Pier `(600, 250)` · Flip-Flop Key `(-1990, 290)` · Lime Key `(-2840, 1000)` · the Galleria food court `(-200, -1945)` | 10:00 to 22:00 | B |
| Squeeze Play | juice $5 (+15) | Bayfront Park `(-300, -450)` · the Speedbowl `(2700, -1850)` · the Tideline promenade `(-206, 47)` · the Galleria food court `(-200, -1945)` | 07:00 to 19:00 | B |
| Hush Hour Diner | plate $12 (+50), pie $5 (+15) | Meridian, Radio Row `(-570, -880)` · Tideline `(-560, 4)` · Northgate `(60, -2170)` | 22:00 to 06:00 only | B |
| Pressed | pressed sandwich $9 (+40) | the food-truck yard `(985, -1100)` | 11:00 to 15:00, 20:00 to 02:00 | B |
| Lava Abuela | bottle $10: the next thing you eat heals half as much again | the kitchen `(-1700, -480)` · the Mercado `(-1500, -800)` | 09:00 to 18:00 | B |
| Big Earl's | the Earl, a burger shaped like an alligator, $15 (+60) · every `BE` item | Mudcat Glades `(-400, -2960)` | 06:00 to 22:00 | B |
| Bun Voyage | burger $8 (+35), drive-through | Northgate `(-430, -1835)` · Meridian `(252, -1197)` · Route 44 `(740, -1660)` | always | B |
| Wing It | 6 wings $9 (+35), 20 wings $22 (+100) | Northgate `(320, -1835)` · Rustwater, by the union hall `(2570, -560)` | 11:00 to 02:00 | B |
| Bean There | coffee $6 (+10). No stamina effect: it is not Ventanita Rosa and it knows it. | Meridian, near City Hall `(-90, -636)` · the airport terminal `(1500, -2000)` · The Paintworks `(1050, -478)` · Northgate `(-600, -1765)` | 06:00 to 20:00 | B |
| The Layover Diner | plate $11 (+50) | Runway Flats `(900, -2100)` | always | C |
| Scoop Dreams | cone $5 (+15) | Tideline `(566, 8)` · the Galleria food court `(-200, -1945)` · any parked Conch | 11:00 to 21:00 | C |
| Fizzy Lizard | can $5 (+8) | vending machines, about one a block in grid districts. Hit one and a free can drops one time in four. | always | B |
| Lightning Bug | can $6: sprint stamina refills at once | Pelican Fuel, Storm Mart | as the shop | B |
| Humid Lager | glass $6 (+5). Nothing wobbles. | Low Tide Bar, The Stilt House `(-2400, 640)` and every bar door | 16:00 to 03:00 | B |

Pelican Eats is the delivery job in the Jobs app, not a shop.

## New names

- **Birdbath Car Wash:** the brand of the five car washes that `04-systems.md` lists without a name.
- **Heat Lap, Gull Patrol, Tide Pool Panic, The Grabby Crab:** the four machines in Coral Arcade, named in `bible/activities/minigames.md`.
- **Triangle Meets Circle** and **Square Goes Alone:** the two films at the Starlite Drive-In.
- **The Earl:** Big Earl's burger. **The Captain's Platter:** Shell Yeah's largest plate.
- **Deborah:** an alligator at Scale & Tail. **Bill:** the pharmacist at every Pill Bill's.
