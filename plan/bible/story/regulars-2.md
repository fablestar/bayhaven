# Bible · story · Regulars, part 2

The other six Regulars and their 23 jobs: Madame Calypso, Deputy Wade Purdy, Gus Thibodeaux, Dr. Imani Okoro, Skip Lindqvist and Abuela Carmen Montalvo. Every job is a mission data file built from the fifteen step types. The story needs none of them.

Tier: B for Gus Thibodeaux, C for the other five.

## Rules for every job

- The giver is the Regular in the section heading. Ids are `reg-<chain>-<n>`. A job opens one game day after the one before it.
- `Lead:` marks a line said by whichever lead is playing.
- "Seen" means one second inside a view cone, as in Open House.
- A job that names a weekday or an hour sets the clock there when it starts.
- No animal can be hurt: a vehicle bounces off an alligator. People can. Weapons are lethal and guards and deputies shoot back.
- The result card shows the job title, the stamp Delivered and the caption on the `Card:` line.
- A job with no checkpoint restarts from step 1. Being knocked out fails any job.

## Madame Calypso · Forecast · 3 jobs · tier C

- **Who:** 55, a strip-mall psychic, only ever right about weather. Height 0.96; skin `#c68a5e`; violet headscarf `#b46bff`; cyan shawl `#7fd6e8`. Prop: a snow globe with a palm tree in it. Blip 185 Hz, vibrato.
- **Where and when:** her shop on Gateway Boulevard `(-320, -1790)`, 10:00 to 22:00.
- **First meeting:** walk in.
- **Needs:** missions, camera, weather, passengers.
- **Chain reward:** shop: Madame Calypso's opens. A $100 reading shows tomorrow's weather and marks the next Local Man event. Also the storm poncho outfit.

### C1 · Fifty Seconds · `reg-forecast-1` · tier C

```
Leads: both · Pays: $800
1. collect 3 copper flamingos at Madame Calypso's (-120, -1760) at 11:45
2. deliver one each, before 15:15 (3:30 of play), to Wahoo World's tube man (100, -1750), the Starlite screen (350, -2400) and Mount Seagull's top (-100, -2620)
3. photo   a strike on any flamingo, from over 10 m. Closer, it hits you.
4. goto    (-320, -1790)
Fail: 15:15 arrives with a flamingo unplaced
Lines:
  Calypso: I see a tall stranger. No. I see rain. I always see rain.
  Calypso: Lightning will hit three places today. I drew them. In crayon.
  Lead: Are you ever wrong?
  Calypso: About love, money and horses, always. About weather, never.
  Calypso: Plant the flamingos. Copper side up. Fifty seconds.
  Lead: It hit the flamingo. Right when you said.
  Calypso: The spirits are very punctual about precipitation.
  Calypso: That's proof. Getting believed is the part I can't predict.
Card: "Copper side up."
```

### C2 · Stray Cell · `reg-forecast-2` · tier C

```
Leads: both · Pays: $1,500
1. enter   any roofed vehicle at (-320, -1790). Calypso and her roof vane ride along.
2. goto    Route 44 at the expressway (700, -1500)
3. follow  the storm cell north to Mudcat Road (700, -3000): log 90 s inside its 150 m circle of rain. Lightning lands in it: 40 damage a hit.
4. deliver Calypso and the vane to Big Earl (-400, -2980), vehicle above 50%
Fail: the vane falls off (2 hard hits) · under 90 s logged at Mudcat Road
Lines:
  Calypso: There's a storm that isn't the 3:15. A stray. On Route 44.
  Calypso: I need ninety seconds inside it. It killed a golfer last year.
  Lead: You want me to drive into it and stay.
  Calypso: Most people drive out. That's why nobody knows anything.
  Calypso: Left lane! It's drifting left! I felt it in my knee!
  Lead: Something hit the roof.
  Calypso: Iguana. They fall when it's cold. Not a sign.
  Calypso: The vane spun eleven times. That means wind, mostly.
Card: "In my knee."
```

### C3 · Cone of Uncertainty · `reg-forecast-3` · tier C

```
Leads: both · Pays: $3,000 · Ends the chain
1. say     at (-320, -1790), 11:41. A tropical storm lands at 16:11 (4:30 of play).
2. enter   any vehicle. Gusts push light ones.
3. deliver Calypso to the Bayhaven Public Radio building (-420, -840) before the storm
4. goto    Bayfront Park (-300, -450)
5. photo   the first lightning over the bay, on her minute
Fail: the storm arrives first · the vehicle is destroyed
Lines:
  Calypso: A real one's coming. Today. Eleven minutes past four.
  Calypso: BHTV 6 says sunny. They have a map. I have a knee.
  Lead: Who'll put you on air?
  Calypso: Barbara Wetherby reads the tide table. She respects a number.
  Barbara: You have ninety seconds, Madame. Use them on the weather.
  Calypso: Bayhaven. Bring in the lawn chairs. That's the whole prophecy.
  Lead: 4:11. There it is.
  Calypso: I also said the Mayor would be a horse. Let's not dwell.
Card: "Lawn chairs in."
```

## Deputy Wade Purdy · Off Camera · 4 jobs · tier C

- **Who:** 33, the one deputy who hates the show. Height 1.07; skin `#d9a57e`; brown buzz cut `#5a4030`; no hat (Gerald has it); teal uniform shirt `#1f8a8a`. Prop: a paper notebook. Blip 160 Hz.
- **Where and when:** behind Bun Voyage `(320, -1835)` in cruiser 12, 22:00 to 04:00.
- **First meeting:** return his hat (Local Man), or get Booked twice: he slides you a note.
- **Needs:** missions, climbing, stealth, heat, a car wash, combat.
- **Chain reward:** outfit: deputy uniform. At heat 0 cruisers ignore you until they see a crime. From heat 3, roadblocks show on the minimap.

### W1 · Lens Cap · `reg-offcamera-1` · tier C

```
Leads: Teo · Pays: $600
1. goto    behind Bun Voyage (320, -1835) at 23:00
2. say     Wade hands over a roll of tape
3. collect 4 pole cameras, a 2.5 m climb each, taped over inside 3:00: (-600, -1800), (-300, -1800), (0, -1800), (300, -1800)
4. goto    (-40, -1840)
Fail: seen by either patrolling cruiser twice · 3 minutes pass
Lines:
  Wade: I joined to help people. Now I hold a boom mic at traffic stops.
  Wade: Four show cameras on Gateway. If I'm seen, I'm the next episode.
  Teo: You want me, a streamer, to cover cameras.
  Wade: I know. I hear it too.
  Teo: One's taped. It had a little red light. It looked sad.
  Wade: Don't. Don't make them people.
  Teo: All four. Gateway Boulevard is officially off the air.
  Wade: Quietest shift in five years. I wrote a report. With a pen.
Card: "Off the air."
```

### W2 · Rinse Cycle · `reg-offcamera-2` · tier C

```
Leads: Mags · Pays: $1,800
1. goto    the HQ rear lot (220, -2180) at 06:00
2. enter   the show truck
3. heat    rises to 3 and deputies shoot. deliver the truck to the Birdbath Car Wash on Outlet Road (-60, -2120).
4. survive 20 s inside the wash. The brushes fold all eleven cameras back.
5. deliver the truck back to (220, -2180), above 60%
Fail: the truck under 60% · heat reaches 5
Lines:
  Wade: The truck has eleven cameras and no wipers for them.
  Wade: Birdbath Car Wash, Outlet Road. Deluxe cycle. The brushes do the rest.
  Mags: You want me to steal the Sheriff's truck and wash it.
  Wade: Borrow. And return. Cleaner. It's almost a favour.
  Dispatch: All units, the show truck is being washed? Say again?
  Mags: I'm paying for the wax. I'm not an animal.
  Wade: Every lens points at the ceiling. He'll film sky for a week.
  Wade: Sky's nice, though. Viewers might like sky.
Card: "Deluxe cycle."
```

### W3 · Ride Along · `reg-offcamera-3` · tier C

```
Leads: both · Pays: $2,000
1. enter   Wade's cruiser at (-40, -1840). The show truck follows 60 s behind.
2. goto    call 1, the Galleria car park (-200, -2040): park across a runaway train of trolleys
3. goto    call 2, Outlet Road (300, -2120): a lost tour bus
4. follow  in reverse: lead the bus to the Starlite gate (350, -2380) at under 40 km/h
5. goto    call 3, Motel Sunburn (200, -1590): a man locked out. Sound the horn.
Fail: the show truck reaches an open call · the cruiser is destroyed
Lines:
  Wade: One shift. Real calls. No cameras, if we're fast.
  Dispatch: Unit 12, shopping trolleys, loose, forty, Galleria car park.
  Wade: Park across them. Police work. Nobody clapped. Perfect.
  Dispatch: Unit 12, tour bus, lost. They believe you are the guide.
  Wade: Then guide. The Starlite's showing shapes. They'll love it.
  Wade: Truck's forty seconds out. Last call. A man's locked out.
  Man: It was open the whole time. I'm so sorry.
  Wade: Three calls. Zero episodes. Best night of my career.
Card: "Zero episodes."
```

### W4 · Off Air · `reg-offcamera-4` · tier C

```
Leads: Teo · Pays: $5,000 · Ends the chain
1. goto    the dish tower (180, -2160) at 20:55
2. goto    the dish platform: 3 climbs, 2 deputies with view cones
3. collect 3 turns of the crank, 4 s each, to aim the dish at the Starlite screen
4. survive 45 s on the platform. 2 deputies climb up with batons and pistols. The drop is 20 m.
5. enter   Wade's cruiser at the foot of the tower
6. heat    is 3 but the feed is down: no LIVE overlay, viewers drain at double rate. Clear it.
Fail: seen 3 times before the first turn · Booked · Checkpoints: after 3, after 5
Lines:
  Wade: Nine o'clock. The show goes out live from that dish.
  Teo: Where do I point it?
  Wade: The drive-in's showing the shapes film. Aim there.
  Teo: One turn. Two. Fuck, it's heavy! Who built this?
  Wade: The county. In a hurry.
  Sheriff: Folks, is that a triangle? Why am I a triangle?
  Teo: They're shooting and nobody's watching. It feels wrong. I love it.
  Wade: Shapes are up nine percent. He's keeping the shapes.
Card: "Triangle."
```

## Gus Thibodeaux · Wrangler · 4 jobs · tier B

- **Who:** 60, owner of Big Earl's. Height 1.04, torso 30% wider; skin `#e0a57a`; white moustache `#f7f3ea`; straw hat `#f2ddb0`; green overalls `#3d6b4a`. Prop: a rubber chicken on a rope. Blip 115 Hz.
- **Where and when:** the porch in Big Earl's jaw `(-400, -2980)`, 08:00 to 20:00.
- **First meeting:** drive through Big Earl. Gus flags you down at the tail.
- **Needs:** missions, Mullet, Hogfish, heat, camera, the gator wrangling alligator.
- **Chain reward:** vehicle: a Bullfrog swamp buggy in Big Earl green.
- **Luring:** walk the chicken at 1.2 to 2.0 m/s and the alligator follows. Faster, he loses interest. Slower, he gets the chicken, then your leg: 40 damage.

### G1 · Pool Party · `reg-wrangler-1` · tier B

```
Leads: both · Pays: $500
1. enter   Gus's Mullet at Big Earl (-400, -2980)
2. goto    the pool at Motel Sunburn (200, -1590)
3. deliver the alligator, lured on foot, 25 m to the truck bed
4. deliver the Mullet to Big Earl's pond (-400, -2980). He slides out on hard corners.
Fail: he leaves the bed twice · he gets the chicken 3 times · the truck is destroyed
Lines:
  Gus: Motel called. Gator in the pool. Guests say he's hogging the noodle.
  Gus: Take the truck and the chicken. Rubber. He knows. He doesn't care.
  Lead: How fast do I walk?
  Gus: Like you're leaving a party you liked.
  Guest: Is he yours? He's been in the deep end since breakfast.
  Lead: He's in the truck. He's watching me in the mirror.
  Gus: That's Pickles. He likes the radio on. Swamp Country, low.
  Gus: Easy on the corners. Welcome to wrangling.
Card: "He knows."
```

### G2 · Hole in One · `reg-wrangler-2` · tier B

```
Leads: both · Pays: $900
1. goto    the Gatehouse (-900, -1900)
2. goto    the 7th green (-1900, -2350)
3. deliver the alligator, lured, to the hole in the hedge (-2450, -2420) in 3:00. He stops 5 s at each of 4 sprinklers.
4. say     Gus is waiting with the truck
Fail: 3 minutes pass · a golf cart snags the rope twice
Lines:
  Gus: Mallard Greens. Seventh green. He's lying on the hole.
  Bev: Is that a dent? Oh, it's you, Gus. It's all dent. Go on.
  Golfer: I'm two under. This is the round of my life.
  Lead: He's stopped at a sprinkler.
  Gus: They love a sprinkler. You can't rush joy.
  Golfer: Can I play through the alligator?
  Lead: I'd wait.
  Gus: Through the hedge. Best gate they've got.
Card: "Joy, unrushed."
```

### G3 · Carry-On · `reg-wrangler-3` · tier B

```
Leads: both · Pays: $1,500
1. enter   the Mullet at Big Earl (-400, -2980)
2. goto    the runway (1900, -2450) by the service gate on Runway Road (1900, -2600)
3. deliver the alligator, lured, to the truck at (1900, -2590) in 2:30, while a Low Altitude Airlines flight circles
4. heat    rises to 1 (airport security). Clear it.
5. deliver the Mullet to the pond (-430, -3010)
Fail: the plane has to go around twice · Booked
Lines:
  Gus: Airport. There's one sunning himself on the big number.
  Gus: Plane's circling. Low Altitude Airlines. Lower every lap.
  Tower: Vehicle on the runway, identify yourself.
  Lead: Alligator removal.
  Tower: Oh, thank goodness. Carry on.
  Lead: He's stopped to look at the plane.
  Gus: He thinks it's a bird. Don't correct him.
  Gus: Clear. Did they clap? They never clap for the gator.
Card: "Not a bird."
```

### G4 · The Amenity · `reg-wrangler-4` · tier B

```
Leads: both · Pays: $4,000 · Ends the chain
1. say     at Big Earl (-400, -2980)
2. chase   the contractor's Hogfish west on Mudcat Road from (-400, -3000), an armed association Grouper behind it. Stop the truck before the Castaway Kingdom turn (-2000, -3000).
3. enter   the Hogfish. The big alligator is in the back.
4. deliver the Hogfish to Lake Serenity (-2700, -1900) by the Gatehouse (-900, -1900), above 30%. Security carts ram and shoot.
5. photo   the alligator back on his sandbank
Fail: the Hogfish reaches the turn · the truck under 30% · heat reaches 4
Lines:
  Gus: Lake Serenity's gator is gone. Four metres. He's on their brochure.
  Gus: The association calls him "the amenity". They trucked him out at night.
  Lead: Why move him?
  Gus: Can't drain a lake with him in it. Mind the escort. They shoot.
  Driver: I just drive! I didn't ask what was in it! It hissed!
  Lead: The truck leans when he breathes.
  Gus: Take him home. They can't cite him. He was there first.
  Gus: Bullfrog keys are in the big jaw. You've earned a buggy.
Card: "There first."
```

## Dr. Imani Okoro · Tide Pool · 4 jobs · tier C

- **Who:** 36, marine biologist. Height 1.01; skin `#5c3d2b`; long braids `#1e1a1a` tied back, one cyan bead; cyan rash guard `#29e6ff`; navy board shorts `#2e4a6b`. Prop: a red-lens torch. Blip 230 Hz.
- **Where and when:** the Tide Pool Lab on Tackle Key `(-2280, 520)`, 07:00 to 17:00. Nights 21:00 to 03:00, the Longspan at Flip-Flop Key `(-2000, 300)`.
- **First meeting:** drive the Longspan at night. She steps out with a stop paddle.
- **Needs:** missions, boats, stealth, camera, heat.
- **Chain reward:** property: the houseboat at Hammock Key costs $176,000, not $220,000. With it, the Tide Pool rash guard.

### I1 · Turtle Crossing · `reg-tidepool-1` · tier C

```
Leads: both · Pays: $600
1. goto    the Longspan at Flip-Flop Key (-2000, 300) after 21:00
2. deliver any vehicle across the eastbound lane at (-1990, 300) to stop traffic
3. collect 9 hatchlings on the road, on foot, inside 90 s. Six cars queue; one tries the verge.
4. deliver the bucket to the waterline (-2010, 345)
Fail: 3 hatchlings reach the far kerb · a car passes the cordon
Lines:
  Imani: Stop. Engine off. Lights off. This is a turtle crossing.
  Lead: There's no sign.
  Imani: I am the sign. Nine hatchlings think that street light is the sea.
  Imani: Block the lane. Scoop from behind, never from the front.
  Driver: Lady, I've got a boat to catch!
  Imani: The boat is forty. These are two hours old. Wait.
  Lead: Nine. One's biting the bucket.
  Imani: Good. Angry ones make it. Come by the lab.
Card: "I am the sign."
```

### I2 · Slow Zone · `reg-tidepool-2` · tier C

```
Leads: both · Pays: $1,200
1. enter   the lab's Minnow at the west marina (-1150, 110), Saturday 20:30
2. follow  a manatee and her calf west along the shore to (-1580, 100), within 20 m, under 10 km/h
3. survive 3 fast boats in turn (two Skimmers, then Tripp's Snowbird): block them or sound the horn inside 30 m
4. photo   the pair going into the mangroves
Fail: a boat passes within 15 m of them above 10 km/h, twice · you hold over 15 km/h for 5 s
Lines:
  Imani: A manatee and her calf are in the marina. On yacht party night.
  Imani: We walk them to the mangroves. At the speed of a manatee.
  Lead: How fast is that?
  Imani: You'll want to get out and push. Don't.
  Lead: Jet ski, coming in fast.
  Imani: Get between them. Horn. Glare. I find glaring works.
  Tripp: Ahoy? Is this a slow zone? Is it Saturday?
  Imani: Into the roots. She looked back. I'm calling that thanks.
Card: "Manatee speed."
```

### I3 · Ghost Net · `reg-tidepool-3` · tier C

```
Leads: both · Pays: $2,000
1. enter   a Skipjack at Hammock Key marina (-2550, 760)
2. goto    the patch reef (-2620, 900)
3. collect 12 pieces of floating junk in 4:00: a trolley, a lawn flamingo, a Bayhaven Tomorrow sign, 9 deck chairs
4. chase   the Snowbird dropping the chairs, west towards Lime Key (-2830, 980). Get alongside. Its mate has a flare gun.
5. photo   its name board
Fail: 4 minutes pass in step 3 · the yacht reaches Last Key (-3100, 1200)
Lines:
  Imani: Reef clean-up. I've counted the fish. Now I count the furniture.
  Lead: There's a shopping trolley out here.
  Imani: There's always a trolley. It's four kilometres to a shop.
  Lead: And deck chairs. Still dry on top.
  Imani: Fresh ones. Somebody's dropping them.
  Lead: That yacht is. Off the back.
  Imani: Get the name. Just the name. I write a very good letter.
  Imani: "Fashionably Late." Of course it is.
Card: "A very good letter."
```

### I4 · Hatch Night · `reg-tidepool-4` · tier C

```
Leads: Teo · Pays: $4,500 · Ends the chain
1. enter   the Skimmer at Tackle Key (-2280, 530) after dark
2. goto    Glow Camp's beach (-1350, 640), from the water
3. collect 5 floodlight switches among the tents, outside 2 guides' cones: (-1380, 600), (-1350, 580), (-1320, 600), (-1340, 620), (-1400, 630). A guide relights one every 30 s.
4. photo   the hatchlings turning towards the moon
5. heat    rises to 2: island security shoots from the dock. Leave by Skimmer and clear it past Sandpiper Bridge (-1100, 280).
Fail: seen 3 times
Lines:
  Imani: Glow Camp has "moon bathing" tonight. Five floodlights on a nesting beach.
  Imani: Sixty hatchlings are about to walk into a fucking wellness retreat.
  Teo: I've crashed this place before. Different lights.
  Imani: Off, not broken. I want a clean report.
  Guide: Who turned off the moon?
  Teo: Four down. The guests think it's part of the programme.
  Teo: They're turning round. All of them. Best thing I've ever filmed.
  Imani: Don't post where. Post that it happened.
Card: "Moon off."
```

## Skip Lindqvist · Repo Depot · 4 jobs · tier C

- **Who:** 45, boat broker, owner of Cash 4 Jet Skis. Height 1.02; skin `#d98a5a`; blond mullet `#f1d27a`; orange mirrored glasses `#ffa02e`; coral shirt `#ff8f7a` printed with jet skis. Prop: a float with thirty boat keys. Blip 220 Hz.
- **Where and when:** his lot in West End `(-1450, 60)`, 09:00 to 18:00.
- **First meeting:** after Repo Woman, moor any boat at the west marina. He offers forty dollars.
- **Needs:** missions, boats, heat, the bump bar from Yacht Rock.
- **Chain reward:** shop discount: boats at Cash 4 Jet Skis are 20% off, and a free Skimmer waits at every marina.

### S1 · Past Due · `reg-repodepot-1` · tier C

```
Leads: both · Pays: $500
1. goto    Cash 4 Jet Skis (-1450, 60)
2. goto    the public dock at the Jetty (1550, 100)
3. enter   the Skimmer
4. deliver it to Skip's slip (-1450, 85), above 70%. The owner chases on a second Skimmer, firing a flare gun.
Fail: the Skimmer under 70% · you leave it for 10 s
Lines:
  Skip: Cash 4 Jet Skis. I sell them. Then I get them back.
  Skip: Wendell says you repo wheels. Hulls are the same. Wetter.
  Skip: Fourteen payments behind. The man named it "Freedom".
  Lead: The owner's on another jet ski.
  Skip: Blue? That one's mine too. Bring both if he falls off.
  Owner: That's my Freedom! I'll shoot you off it!
  Lead: It's the bank's Freedom.
  Skip: Not a scratch. What'll it take to get you weekly?
Card: "The bank's Freedom."
```

### S2 · Liquid Assets · `reg-repodepot-2` · tier C

```
Leads: both · Pays: $1,200
1. enter   Skip's Minnow at the west marina (-1150, 110) after dark
2. goto    the private dock on the Isle's south shore (-1100, 885), under 10 km/h for the last 100 m, or a dog barks (text)
3. enter   the Skipjack
4. heat    rises to 2: armed island Skimmers. deliver the Skipjack to (-1450, 85), above 60%, heat clear.
Fail: the Skipjack under 60% · Booked · the dog barks twice
Lines:
  Skip: Speedboat. South shore. Owner's three boats behind on one boat.
  Skip: Go in slow. There's a dog. Small, with a big opinion.
  Lead: It's barking.
  Skip: At you? Or generally? Generally is fine.
  Lead: I'm in. There's a drink on the dash. With an umbrella.
  Skip: Leave the drink. We're repo, not thieves.
  Security: That is a member's boat! Stop, or we fire! We're firing!
  Skip: It's a lender's boat! Tell them to read page nine!
Card: "Repo, not thieves."
```

### S3 · Dry Storage · `reg-repodepot-3` · tier C

```
Leads: Mags · Pays: $2,200
1. goto    the expressway ramp at (-900, -1480)
2. chase   a Mullet towing a Skipjack on a trailer, westbound
3. survive 3 rams on the hitch. The trailer comes loose and rolls on alone.
4. deliver the loose trailer to the foot of the ramp at (-2400, -1480) by nudging it. It may touch traffic 3 times.
Fail: the boat leaves the trailer · the truck passes (-3000, -1480) · heat reaches 3
Lines:
  Skip: Customer put the boat on a trailer and left town.
  Skip: He's on the expressway. Knock the hitch. Three good ones.
  Mags: And then?
  Skip: Then there's a loose boat doing ninety. One thing at a time.
  Mags: It's off. It's overtaking him.
  Skip: Steer it. With your car. Like a trolley with a mortgage.
  Driver: My boat's passing me! Why is my boat passing me?
  Skip: Down the ramp and into my arms. Stop it before my arms.
Card: "Three good ones."
```

### S4 · The Big One · `reg-repodepot-4` · tier C

```
Leads: both · Pays: $6,000 · Ends the chain
1. goto    the Yacht Club (-1150, 90), Saturday 21:00
2. goto    the bridge of Tripp's Snowbird through the party, without bumping 3 crew
3. enter   the Snowbird
4. deliver it, party and all, to Skip's mooring (-1500, 115). The party meter falls above 25 km/h and on any hit.
5. heat    rises to 2: club Skimmers, shooting wide of the guests. Clear it.
6. say     Skip ties her off
Fail: the party meter empties · the yacht under 50% · Booked · Checkpoint: after 3
Lines:
  Skip: Tripp Vandermeer's yacht. Nine months behind. He frames my letters.
  Skip: Don't stop the party. Just move it four hundred metres.
  Lead: Sixty people are on it.
  Skip: Smoothly. If a drink spills, they'll look up.
  Tripp: Are we moving? I love that. Who's driving? Is it the man?
  Lead: I'm the man.
  Skip: Tripp, you keep the party. I'm keeping the boat.
  Tripp: Best landlord ever. Is he a landlord?
Card: "Party moved."
```

## Abuela Carmen Montalvo · House Rules · 4 jobs · tier C

- **Who:** 74, Rafa's mother and the real boss. Height 0.9; skin `#b9774f`; white bun `#f7f3ea`; rose housecoat `#ff6f91`; turquoise slippers `#2ec4b6`. Prop: a wooden spoon. Blip 175 Hz; other voices duck 6 dB under hers.
- **Where and when:** the Lava Abuela kitchen `(-1700, -480)`, 05:00 to 11:00. Tuesday 18:00, table one, Domino Park `(-1400, -880)`. From 15:00 to 16:00 no door in Los Patios opens.
- **First meeting:** finish Hot Sauce. She has counted the bottles and sends for you.
- **Needs:** missions, choice steps, Plover, Flounder, stealth, camera.
- **Chain reward:** property: the flat over the bakery costs $17,500, not $35,000. Ventanita Rosa coffee is free.

### A1 · Tile Talk · `reg-houserules-1` · tier C

```
Leads: both · Pays: $400
1. goto    table one (-1400, -880), Tuesday 18:00, to play Hector
2. choice  tile 1: double six / six-four / blank-one. Right: double six.
3. choice  tile 2: five-five / five-two / six-one. Right: five-five.
4. choice  tile 3: play three-two / pass. Right: pass.
5. deliver the prize, a ham, to the Mercado (-1500, -800) on foot
Fail: fewer than 2 of 3 right restarts from step 2
Lines:
  Carmen: I counted the bottles. Sit.
  Carmen: Hector is champion. Hector, this one plays for me tonight.
  Hector: Then I'll go easy. On the furniture.
  Carmen: A house starts with its biggest stone.
  Carmen: A door open at both ends, you close with twins.
  Carmen: Patience is also a tile.
  Hector: Three tiles. Who taught you?
  Carmen: Nobody taught. I hinted. Take his ham back to his shop.
Card: "Patience."
```

### A2 · House Batch · `reg-houserules-2` · tier C

```
Leads: both · Pays: $900
1. collect 6 jars at the kitchen (-1700, -480), 10:00
2. enter   the Plover with the basket
3. deliver the jars to 6 doors before 15:00 (5:00 of play): (-1500, -1300), (-1620, -1260), (-1380, -1340), (-1700, -1380), (-1240, -1300), (-1560, -1400). You sit and eat 8 s at each. A hard bump breaks a jar.
4. goto    (-1700, -480)
Fail: 2 jars broken · 15:00 arrives
Lines:
  Carmen: Six jars of the house batch. Not for sale. For the ladies.
  Carmen: You go by bicycle. A van is for strangers.
  Lead: Why before three?
  Carmen: At three my programme starts. At three the street is closed.
  Neighbour: From Carmen? Come in. Sit. You're thin. Eat this.
  Lead: I have five more doors.
  Neighbour: Then eat faster.
  Carmen: Six doors, six plates. That was the test.
Card: "Then eat faster."
```

### A3 · Discipline · `reg-houserules-3` · tier C

```
Leads: Mags · Pays: $1,800
1. say     at the kitchen (-1700, -480), 21:00
2. chase   3 of Rafa's drivers in hopping Flounders from Flounder Works (-1250, -420). Block each, or use the horn.
3. enter   the Pompano at (-1260, -440). The three get in the back.
4. deliver them to the kitchen
5. say     the lecture. Nobody can skip it.
Fail: a Flounder gets 200 m away · you knock a person over
Lines:
  Carmen: Rafa's boys were due at the dock at six. It is nine. They hop cars.
  Carmen: Bring them. By the ear, if that's all you can reach.
  Mags: I have a voice for this.
  Driver: It's the bus lady! Go, go, she'll make us sit!
  Mags: Park it. Single file. Hands where I can see them.
  Carmen: Nilda's boat waited with forty cases. Rafa, you too. Stand with them.
  Rafa: Mamá, I'm forty-seven.
  Carmen: And late. All of you. Wash your hands.
Card: "Wash your hands."
```

### A4 · House Rules · `reg-houserules-4` · tier C

```
Leads: both · Pays: $3,500 · Ends the chain
1. collect 3 trays of the house batch at the kitchen (-1700, -480), Saturday 06:00
2. goto    the Nana's Inferno stand at the market (-1400, -900), outside 2 brand reps' cones
3. collect 3 sample trays on the stand: swap each, 3 s
4. photo   the mascot, a smiling pepper, trying a sample
5. survive 45 s: 4 company security chase you through the market, pistols out. Carmen's friends close each aisle behind you.
6. goto    table one (-1400, -880)
Fail: seen during a swap twice · Checkpoint: after 4
Lines:
  Carmen: A company has a sauce. "Nana's Inferno." There is no nana. I checked.
  Carmen: Free samples. In my park, on my Saturday.
  Lead: So we swap their samples for yours.
  Carmen: For the house batch. It is not unkind. It is honest.
  Mascot: Mmm! That's... oh. Oh no. That's real.
  Rep: Who switched the trays? Security! Shoot the one with the tray!
  Carmen: Ladies. The aisle.
  Carmen: Rule one. Nobody sells in this park before they lose to me.
Card: "There is no nana."
```

## New names

- **Madame Calypso's:** her shop on Gateway Boulevard, seed `(-320, -1790)`. Tier C.
- **Pickles:** an alligator who likes motel pools. Tier B.
- **The Amenity:** the association's name for the Lake Serenity alligator. Tier B.
- **Tide Pool Lab:** Dr. Okoro's shack on Tackle Key, seed `(-2280, 520)`. Tier C.
- **Fashionably Late:** a littering Snowbird. Tier C.
- **Freedom:** a repossessed Skimmer. Tier C.
- **Nana's Inferno:** a factory hot sauce. A heat pun. Tier C.
- **Seeds:** Motel Sunburn `(200, -1590)`, tier B. Cash 4 Jet Skis `(-1450, 60)`, tier C.
