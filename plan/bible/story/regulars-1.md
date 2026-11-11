# Bible · story · Regulars, part 1

Six of the twelve Regulars and their 23 jobs: Lawyer Larry, Dee Pfeffer, Priya Raman, Old Man Fitch, Coach Brenda Oyelaran and Zoom Ziegler. Every job is a mission data file built from the fifteen step types. The story needs none of them.

Tier: B for Lawyer Larry and Zoom Ziegler, C for the other four, as the canon lists them.

## Rules for every job

- The giver is the Regular in the section heading. Ids are `reg-<chain>-<n>`. A job opens one game day after the one before it.
- `Lead:` marks a line said by whichever lead is playing.
- "Seen" means one second inside a view cone, as in Open House.
- A job that names a weekday or an hour sets the clock there when it starts.
- Weapons are lethal, as `04-systems.md` says. Crews, guards and deputies shoot back. A dead bystander is the player's doing and raises heat.
- The result card shows the job title, the stamp Delivered and the caption on the `Card:` line.
- A job with no checkpoint restarts from step 1. Being knocked out fails any job. Jobs run 4 to 7 minutes.

## Lawyer Larry · Billable Hours · 4 jobs · tier B

- **Who:** see `characters.md`.
- **Where and when:** his office `(420, -1830)`, weekdays 09:00 to 17:00.
- **First meeting:** walk in, or get Booked: he is on the HQ steps `(200, -2150)` with a card.
- **Needs:** missions, traffic, camera, climbing, combat, the taxi comfort meter.
- **Chain reward:** outfit: the billboard yellow suit. While it is worn, one Booked a day is free. Billboard 41 at `(420, -2440)` shows Larry, Annie and, small, Mags.

### L1 · Soft Tissue · `reg-billable-1` · tier B

```
Leads: both · Pays: $600
1. goto   (420, -1830) Larry's office
2. enter  the client's Tarpon at (400, -1810). The client rides along.
3. chase  the Iguana Insurance Pompano east on Gateway Boulevard from (-400, -1800): get ahead and brake so it taps you under 15 km/h
4. photo  the client holding his neck by the two bumpers
5. goto   (420, -1830)
Fail: a hit over 15 km/h · the Tarpon under 70% · the van reaches (600, -1800)
Lines:
  Larry: Did a van hit you? Not yet? Let's fix that.
  Lead: You want me to get hit.
  Larry: Tapped. Tapped is a legal term.
  Client: Do I hold my neck now or after?
  Larry: After. We're professionals.
  Client: Ow. Was that good?
  Larry: That was four thousand dollars good.
  Larry: Wave to the driver. Slowly. You're injured.
Card: "Tapped is a legal term."
```

### L2 · Hand Delivered · `reg-billable-2` · tier B

```
Leads: Teo · Pays: $900
1. collect 3 envelopes at (420, -1830)
2. chase  the hot-dog mascot on foot from Bun Voyage (320, -1835). Touch him to serve.
3. chase  a bail jumper on a Cicada round the Galleria car park (-200, -2000). He shoots over his shoulder. Block the bike.
4. chase  Annie's process server from Wahoo World (100, -1750). Inside 10 m he turns and chases you.
5. goto   (420, -1830)
Fail: a target gets 150 m away · the server touches Teo first · 5 minutes pass
Lines:
  Larry: Three envelopes. Three people who run. You look like you run.
  Teo: I deliver noodles. Same thing, but they want those.
  Mascot: I'm a hot dog! You can't serve a hot dog!
  Teo: Served. Sorry about the mustard. It was right there.
  Jumper: I'm not him! I'm his cousin! Stay back or I shoot!
  Server: Teo Navarro? Something for you, from Attorney Annie.
  Teo: Something for you, from Lawyer Larry. Also, a guy shot at me.
  Larry: Shots fired counts as receipt. You served a server. Billboard.
Card: "Three served. None pleased."
```

### L3 · Face Value · `reg-billable-3` · tier B

```
Leads: Teo · Pays: $1,500
1. goto    (-300, -2440) after dark
2. collect 3 Annie paste-overs: climb and peel the boards at (-300, -2440), (-60, -2440), (180, -2440)
3. photo   Larry's face, restored, on the third board
4. survive 60 s: Annie's sign crew arrives in a Mullet: 3 men, crowbars and one shotgun
5. goto    (420, -1830) with the rolled posters
Fail: 3 minutes pass in step 2
Lines:
  Larry: She pasted her face over my face. On my road.
  Teo: It's called Billboard Road. Is it yours?
  Larry: Forty of the forty signs say so.
  Teo: Peeling Annie now. This glue is fresh.
  Larry: How do I look under there?
  Teo: Thirty-nine. Like it says.
  Crew: That's Annie's paste! Get him off the board! Legs first!
  Teo: It's Larry's face! I just work here! Oh shit, that's a shotgun!
Card: "Three faces saved."
```

### L4 · Day in Court · `reg-billable-4` · tier B

```
Leads: Mags · Pays: $3,000 · Ends the chain
1. enter   Larry's Sturgeon at (420, -1830). Larry sits in the back.
2. goto    Exchange Avenue at Union Avenue (692, -1317). His composure meter starts; bumps lower it.
3. deliver Larry to the courthouse steps, Uptown (-250, -1240), in 2:30. Annie's Tern rams, and her clerk shoots at the tyres.     hint: "The horn works on lawyers."
4. say     Larry and Annie settle on the steps
5. photo   the handshake
Fail: composure reaches zero · the limo under 40% · time up
Lines:
  Larry: A courtroom. I've only seen them on my billboards.
  Mags: Seatbelt.
  Larry: Is that Annie? She's shooting at us. That's contempt of traffic.
  Larry: My composure! I had it a second ago!
  Annie: Larry. Your tie is on backwards.
  Larry: Annie. Settle? Out here, like adults who fear judges?
  Annie: Fifty-fifty. And billboard forty-one is both of us.
  Larry: I never went inside. I never will.
Card: "Settled on the steps."
```

## Dolores "Dee" Pfeffer · Violations · 4 jobs · tier C

- **Who:** 59, the association's violations officer, who hates the association. Height 0.92; skin `#f0c9a8`; steel perm `#a9adb3`; cream polo `#f5ecd7`; sage culottes `#b7c9a8`; a blush sash. Prop: a ruler. Blip 250 Hz.
- **Where and when:** her beacon Birdie outside the clubhouse `(-2000, -2100)`, 09:00 to 16:00. Monday 07:00 to 11:00 she inspects Grackle Lane `(-1500, -2000)`.
- **First meeting:** after Open House, park in Mallard Greens for 20 s. She measures the car, then whispers an offer.
- **Needs:** missions, stealth, Cricket mower, heat, Pompano, Bus Driver Voice, camera, Birdie.
- **Chain reward:** vehicle: Dee's inspection Birdie (orange beacon, 45 km/h). Mallard Greens security ignores it until heat 2.

### D1 · Six Centimetres · `reg-violations-1` · tier C

```
Leads: both · Pays: $700
1. goto    Dee's cart (-2000, -2100)
2. enter   the Cricket at (-1960, -2080)
3. collect 3 board lawns, 3 passes each: Muscovy Court (-1700, -2250), Coot Circle (-2200, -2300), Ibis Bend (-2350, -1800)
4. goto    (-2000, -2100), unseen by the leaf-blower man on Fairway Drive
Fail: seen twice · the mower is destroyed · 4 minutes pass
Lines:
  Dee: Rule 11. Lawns are six centimetres. Half either way.
  Lead: And you want them shorter.
  Dee: I want the board's lawns shorter. I can't fine a legal lawn.
  Dee: Nine thousand slips. Never one to a board member.
  Lead: This mower does eight kilometres an hour.
  Dee: Then mow with purpose.
  Dee: Five point four. That's a beautiful violation.
  Dee: Pink slip for the treasurer. I'm framing the carbon.
Card: "Five point four."
```

### D2 · Approved Colours · `reg-violations-2` · tier C

```
Leads: both · Pays: $1,200
1. goto    the south gate (-2000, -1520) at night
2. enter   the painter's Pompano. Dee has filled its sprayer with mango.
3. deliver the van to 3 garage doors, parked 5 s at each: (-1800, -1700), (-2300, -2050), (-2600, -2250)
4. heat    rises to 2 at the first door: armed security carts, and they shoot. Clear it.
5. goto    the hole in the hedge (-2450, -2420)
Fail: the van is destroyed · heat reaches 3 · Booked
Lines:
  Dee: Four approved colours. Cream, sage, dove, blush.
  Lead: What's in the van?
  Dee: Mango. Rule 4 calls it "a colour of concern".
  Lead: The door's orange. It looks better.
  Dee: It looks like ninety dollars a day. Per door.
  Guard: Stop! That is an unapproved van! Aim for the mango!
  Dee: Don't stop. I'll write you up for stopping.
  Dee: Three doors. I'm going to sleep so well.
Card: "A colour of concern."
```

### D3 · Quorum · `reg-violations-3` · tier C

```
Leads: Mags · Pays: $2,000
1. goto    Clubhouse Circle (-2000, -2100) at 17:30
2. say     Dee counts the board on her fingers
3. survive 180 s: keep 3 board Birdies from the clubhouse. They start at (-1700, -2250), (-2350, -1800), (-2600, -2250). Block, nudge or use the horn.
4. photo   the clubhouse clock at 19:00
Fail: 2 carts arrive · a board member dies (Dee wants them late, not dead) · heat reaches 2
Lines:
  Dee: Tonight the board votes to fine laundry lines.
  Dee: Five members make a quorum. Five are coming.
  Mags: Unless three are late.
  Dee: The clock is always right. Rule 1 says so.
  Member: Madam, you are blocking a golf cart!
  Mags: Sit down. Hands inside the vehicle.
  Dee: Seven o'clock. Two present. No quorum. No vote.
  Dee: Eleven years I've waited to say it. Meeting adjourned.
Card: "Two present."
```

### D4 · Pink Slips · `reg-violations-4` · tier C

```
Leads: both · Pays: $3,500 · Ends the chain
1. collect the slip box on Dee's porch, Grackle Lane (-1500, -2000), Sunday 10:00
2. enter   Dee's Birdie. Dee rides along.
3. goto    the clubhouse (-2000, -2100) across the tournament. A golf ball on the cart stuns it for 2 s.
4. collect 4 clubhouse doors: staple the slips to each
5. heat    rises to 2: Chad and Brad, shooting from a cart. goto the Gatehouse (-900, -1900).
6. deliver Dee to the Tideline Motel (-520, -60)
Fail: the cart is destroyed · Dee falls out twice · Booked · Checkpoints: after 2, after 4
Lines:
  Dee: Four hundred slips I never filed. All against the board.
  Lead: You kept them?
  Dee: In date order. I'm resigning in writing. A lot of writing.
  Dee: Fore! That means duck. Rule 30.
  Lead: You're stapling a door.
  Dee: I'm filing. It's a filing system now.
  Brad: Ms Pfeffer! Step away from the bylaws! Chad, shoot the stapler!
  Dee: I'm moving to a motel. One towel, no rules, and fuck the lawn.
Card: "Filed, all 400."
```

## Priya Raman · Lunch Rush · 3 jobs · tier C

- **Who:** 34, cook and owner of the Pressed truck, a mint Pompano. Height 0.98; skin `#a56a43`; black bun under a mango bandana `#ffa02e`; mint apron `#5dff9b` over white; red clogs `#ff5a5a`. Prop: sandwich tongs. Blip 270 Hz.
- **Where and when:** the food-truck yard `(1000, -1100)`, 11:00 to 15:00 and 18:00 to 23:00. Thursday 19:00 Wet Paint `(1100, -600)`. Friday 22:00 outside Humidity `(1450, -950)`.
- **First meeting:** buy a sandwich at Pressed. Wrap Battle, a rival truck that sells the Undertow's pills under the wraps, takes her spot while you eat.
- **Needs:** missions, Pompano, the bottle meter from Hot Sauce, Pinfish, the Pelican Eats heat timer, carrying, camera, combat.
- **Chain reward:** shop discount: Pressed feeds both leads free. The food-truck business costs $36,000, not $45,000.

### P1 · Prime Spot · `reg-lunch-1` · tier C

```
Leads: both · Pays: $500
1. goto    the yard (1000, -1100), Friday 22:00
2. enter   the Pressed truck
3. deliver the truck to Humidity (1450, -950) before Wrap Battle's truck, which rams, stock above 75%
4. say     Priya opens the hatch
Fail: Wrap Battle parks first · stock under 75% · the truck is destroyed
Lines:
  Priya: Humidity empties at two. Whoever's parked outside feeds them.
  Priya: Wrap Battle took my spot. Salad in a blanket, Undertow pills under the counter.
  Lead: You want me to race a sandwich truck.
  Priya: Arrive first, with the bread still flat. That's the brand.
  Priya: Bump! Those were my nice pickles.
  Rival: Too slow, Pressed! The future is rolled!
  Priya: The future is toasted on both sides. Park it.
  Priya: First in line. You eat free tonight.
Card: "Bread still flat."
```

### P2 · Lunch Rush · `reg-lunch-2` · tier C

```
Leads: Teo · Pays: $900
1. goto    the yard (1000, -1100) at 12:00
2. enter   the Pinfish with the hot box (it holds 2)
3. deliver 8 sandwiches in 4:00, each within 45 s of pickup: (1300, -800), (1100, -600), (1180, -1180), (1500, -500) and 4 pins generated within 400 m
4. survive 30 s on the ride back to (1000, -1100): two Wrap Battle riders, one bat, one pistol
Fail: 2 arrive cold · 4 minutes pass · knocked out
Lines:
  Priya: Eight orders. Hot is the product. Cold is a refund.
  Teo: I ride for Pelican Eats. I'm basically a professional.
  Priya: Pelican Eats gave you two stars.
  Teo: One of those was from the pelican.
  Customer: Still hot. I'm filming my sandwich. Is that weird?
  Teo: It's the least weird thing I'll see today.
  Rival: Nice scooter! Shame about your knees!
  Priya: Eight for eight. You're not hired, but you're fed.
Card: "Eight for eight."
```

### P3 · Health Inspection · `reg-lunch-3` · tier C

```
Leads: both · Pays: $2,000 · Ends the chain
1. collect the iguana in Pressed's bread drawer (1000, -1100). Sprint for 5 s and it wriggles free.
2. deliver the iguana to the hatch of Wrap Battle's truck, Container Row (1500, -500), in 2:30, before the inspector reaches Pressed
3. photo   the inspector finding the iguana, and the pills behind it
4. defeat  3 Wrap Battle cooks: a cleaver, a bat and the sawn-off under the counter
5. goto    (1000, -1100)
Fail: the iguana is within 30 m of Pressed at 2:30 · knocked out
Lines:
  Priya: There's an iguana in my bread drawer. I don't stock iguana.
  Priya: And an inspector's coming. Guess who called him.
  Lead: Where do you want it?
  Priya: Return to sender. Gently. He's had a day.
  Inspector: Pressed is spotless. Now, this wrap truck.
  Cook: That's not our iguana! Get the gun from under the wraps!
  Priya: A sawn-off in a food truck. That's a hygiene issue.
  Priya: Free sandwiches. For life. Yours or the truck's.
Card: "Return to sender."
```

## Old Man Fitch · Buried · 4 jobs · tier C

- **Who:** 81, a metal-detectorist with a hand-drawn map. Lives at Pelican Rest with Mrs Fitch. Height 0.93, bent forward; skin `#e8b993`; white beard `#f7f3ea`; floppy sand hat `#fff1c9` hung with lures; pale blue shirt `#9fd2ff`; sandals with socks. Prop: a metal detector. Blip 110 Hz.
- **Where and when:** walking the sand along `z = 70`, yacht club to Jetty, 06:00 to 11:00 and 16:30 to 19:00. At 15:15, under the hut at `(-300, 63)`.
- **First meeting:** walk within 6 m of him. His detector goes off at your keys.
- **Needs:** missions, on foot, crowds, Minnow, the 15:15 storm, wading, camera, Gerald.
- **Chain reward:** outfit: Beachcomber (lure hat, headphones). While it is worn, flamingos and gnomes within 40 m beep.

### F1 · You're Beeping · `reg-buried-1` · tier C

```
Leads: both · Pays: $300
1. goto    Fitch on the sand near (-900, 70)
2. follow  Fitch east to (-520, 68), within 8 m. He walks 1.2 m/s and stops at each beep.
3. collect 3 digs where he points: (-800, 72), (-680, 70), (-560, 68). Hold the button 3 s.
4. deliver the third find, car keys, to the tourist outside the Tideline Motel (-520, -60)
Fail: 30 m from Fitch for 10 s
Lines:
  Fitch: You're beeping. Keys, belt or fillings?
  Lead: Keys.
  Fitch: Shame. Fillings pay better. Dig where I point.
  Fitch: Bottle cap. Forty years of them. I could roof a house.
  Fitch: Fork. Somebody had a nice picnic and a bad afternoon.
  Lead: Car keys.
  Fitch: They belong to the fella crying by the motel. Go on.
  Fitch: I've got a map, you know. Come back when you're serious.
Card: "Keys, belt or fillings."
```

### F2 · False Alarm · `reg-buried-2` · tier C

```
Leads: both · Pays: $600
1. goto    the lifeguard hut (300, 63), Wednesday 11:00
2. collect 4 digs among the sunbathers in 3:00: (240, 72), (290, 76), (330, 70), (370, 74)
3. survive 30 s: the lifeguard's quad chases you off the sand. A touch restarts the step.
4. deliver the find, a cool box, to Fitch at (300, 63)
Fail: 4 sunbathers knocked over · time up in step 2
Lines:
  Fitch: The X is under a towel. There's a lady on the towel.
  Lead: You could ask her to move.
  Fitch: I asked years ago. She said no. Might be a different lady.
  Sunbather: Excuse me! This is a relaxing area!
  Lead: Sorry. Treasure. Sorry.
  Lifeguard: No digging between the flags! There are flags!
  Fitch: Twelve cans of Fizzy Lizard. Still fizzy. That's not it.
  Fitch: Three X's on the map. My wife says there's only one.
Card: "Still fizzy."
```

### F3 · Low Tide · `reg-buried-3` · tier C

```
Leads: both · Pays: $1,200
1. goto    the Jetty (1550, 100) at 16:00
2. enter   the Minnow at (1540, 112)
3. goto    the sandbar (1480, 125). It stays above water for 2:30.
4. collect the chest: 5 digs in a ring. The detector beeps faster near each.
5. deliver the chest to Fitch at the Jetty before the bar floods
Fail: the bar floods with the chest on it · the dinghy sinks
Lines:
  Fitch: After the storm the bar comes up. A few minutes. Then it's gone.
  Fitch: I can't row any more. You can. That's the partnership.
  Lead: It's a real chest.
  Fitch: Don't open it out there! Tide's turning!
  Lead: It's heavy.
  Fitch: Heavy is good. Heavy is the right amount.
  Fitch: Souvenir cups. Castaway Kingdom. Two hundred of them.
  Fitch: I buried these myself. One X left. My wife's X.
Card: "Two hundred cups."
```

### F4 · Under the Pier · `reg-buried-4` · tier C

```
Leads: both · Pays: $2,500 · Ends the chain
1. goto    the pier steps (600, 80) after 21:00
2. collect the ring box: wade between the pilings to (600, 300), outside the torch cones of 2 Undertow smugglers landing crates. They shoot at splashing.
3. chase   Gerald, who takes the box, along the deck to the ferris wheel (600, 400)
4. photo   Gerald. The flash makes him drop it.
5. deliver the ring to Mrs Fitch at Pelican Rest (-1250, -220)
Fail: Gerald flies off the pier end twice · knocked out
Lines:
  Fitch: Forty years ago I dropped my wedding ring off this pier.
  Fitch: She said third piling. I said I'd check the beach first.
  Fitch: Mind the men with the crates. They shoot at splashing.
  Lead: Got the box. And now a pelican has it.
  Fitch: That's Gerald. Take his picture. He hates the flash.
  Mrs Fitch: Third piling?
  Fitch: Third piling.
  Mrs Fitch: Put it on, you old fool, before the bird comes back.
Card: "Third piling."
```

## Coach Brenda Oyelaran · Dawn Patrol · 4 jobs · tier C

- **Who:** 67, leads the Dawn Patrol: twelve retirees who walk at dawn and are also a crew. Height 1.05; skin `#6f4a33`; short white hair `#f7f3ea`; neon pink tracksuit `#ff3fa4` with a cyan stripe `#29e6ff`; white walking shoes. Prop: a whistle on a lanyard. Blip 205 Hz.
- **Where and when:** the south gate `(-2000, -1520)` at 05:30, walking to Clubhouse Circle by 06:30. Monday, Wednesday, Friday 07:00 to 09:00, laps of the Galleria forecourt `(-200, -1980)`.
- **First meeting:** stand in the patrol's way. She blows the whistle.
- **Needs:** missions, Birdie, street races, stealth, camera, heat.
- **Chain reward:** vehicle: the Dawn Patrol Birdie (pink, 55 km/h, whistle horn), with the tracksuit outfit.

### B1 · Warm-Up · `reg-dawn-1` · tier C

```
Leads: both · Pays: $500
1. goto   the south gate (-2000, -1520) at 05:40
2. enter  a patrol Birdie
3. goto   8 checkpoints in order: 3 laps of Clubhouse Circle from (-2000, -2100), against 4 patrol carts
4. say    Brenda reads the stopwatch
Fail: you finish below second · the cart is destroyed
Lines:
  Brenda: Dawn Patrol walks at five thirty. We race at five forty.
  Lead: You're a walking club.
  Brenda: We're a crew that walks. Get in the cart.
  Brenda: Three laps. Number four corners dirty. Watch her.
  Walker: On your left! I've always wanted to say that!
  Brenda: Knees up! I know you're driving. Knees up, damn it!
  Brenda: Second place, in a cart you'd never met. Acceptable.
  Brenda: Galleria, tomorrow, seven. Wear something that breathes.
Card: "Knees up."
```

### B2 · Mall Walkers · `reg-dawn-2` · tier C

```
Leads: both · Pays: $800
1. goto   the forecourt (-200, -1980) at 07:00
2. follow the patrol's lap for 400 m, within 4 m of a walker. The guard on his Coot ignores the pack.
3. photo  the trophy case (-180, -1990)
4. photo  the sprinkler box (-240, -2010)
5. photo  the guard's key ring
Fail: outside the pack for 5 s in the guard's cone · you sprint
Lines:
  Brenda: The Lawn of the Year cup. One lawn has won it nine years.
  Brenda: The winner also judges. We measured. Ours were better.
  Lead: So we're stealing a lawn trophy.
  Brenda: Collecting. Stay in the pack. Nobody sees a walker.
  Brenda: Elbows in. If you jog, we're made.
  Guard: Morning, ladies. Morning, new one.
  Brenda: Case, sprinklers, keys. Smile like you're counting steps.
  Brenda: Good. Tomorrow we water the forecourt.
Card: "Nobody sees a walker."
```

### B3 · Sprinkler Day · `reg-dawn-3` · tier C

```
Leads: both · Pays: $2,500
1. goto    the forecourt (-200, -1980) at 07:00. The patrol rings the guard in a stretching circle.
2. collect the sprinkler valve (-240, -2010)
3. collect the cup from the case (-180, -1990) while the spray is on
4. enter   the Birdie at (-160, -2020)
5. heat    rises to 2: mall security on kick scooters, with pistols. Clear it in the car park.
6. deliver the cup to the south gate (-2000, -1520)
Fail: Booked · the cup falls out (3 hard hits) · the cart is destroyed · Checkpoints: after 3, after 5
Lines:
  Brenda: Stretching circle, go. He can't interrupt a hamstring.
  Guard: Ladies, I need to get through. It's a fire lane.
  Brenda: Hold for thirty. Breathe. Sprinklers, now.
  Lead: Everything's wet. Including me.
  Brenda: Glass is open. Lift with your legs. It's a big cup.
  Guard: Somebody's walking off with the cup! Shoot the cart!
  Brenda: Driving off. Get it right.
  Brenda: Nine years. It's lighter than I thought. Most things are.
Card: "Lift with your legs."
```

### B4 · Victory Lap · `reg-dawn-4` · tier C

```
Leads: both · Pays: $4,000 · Ends the chain
1. enter   the Birdie with the cup bolted on, at the Gatehouse (-900, -1900), Sunday 09:00
2. goto    Clubhouse Circle (-2000, -2100) along Fairway Drive, ahead of Chad and Brad's two carts. They shoot.
3. deliver the cup to Phase Four (-3000, -2500) across the back nine, cart above 40%. Sand halves your speed.
4. photo   the patrol with the cup
Fail: both security carts finish first · the cup falls off (4 hard hits)
Lines:
  Brenda: Tournament day. All eyes on the eighteenth. We lap the course.
  Lead: With armed security behind us.
  Brenda: Chad and Brad. Two pistols, one licence.
  Chad: That's association property! Brad: And a very nice cup!
  Brenda: Sand trap! Go round! Heads down, they can't aim and steer!
  Brenda: Phase Four. No houses, no witnesses, forty mailboxes.
  Brenda: Picture. Everybody in. Cup in the middle.
  Brenda: You're Dawn Patrol now. Five thirty. I'm joking. I'm not.
Card: "Five thirty. Every day."
```

## "Zoom" Ziegler · Exclusive · 4 jobs · tier B

- **Who:** 38, drone photographer for *The Bayhaven Tide*. Height 1.0; skin `#f1c7a3`; messy ginger hair `#d9622b`; khaki pocket vest `#b5a27a` over an ink shirt `#150f3d`; flight goggles pushed up. Prop: a drone controller round the neck. Blip 235 Hz.
- **Where and when:** the Tide's door on Radio Row `(-560, -760)`, 08:00 to 12:00. The City Hall fountain `(-200, -560)` to 14:00. Bayfront Park `(-300, -450)` at golden hour.
- **First meeting:** clear heat 3 in Meridian. A drone was following; its owner texts.
- **Needs:** missions, camera, jumps, heat, the 15:15 storm.
- **Chain reward:** vehicle: Zoom's old camera drone, which is Teo's scout drone (`03-characters-and-story.md`).

### Z1 · Deadline · `reg-exclusive-1` · tier B

```
Leads: both · Pays: $700
1. goto   the Tide's door (-560, -760)
2. photo  Mayor Bunny Castellano cutting a ribbon at the City Hall fountain (-200, -560)
3. photo  the Twin Sails skybridge from directly below (430, -760)
4. photo  a Bay Cab driver arguing with a parking meter on Commerce Way (100, -677)
5. goto   (-560, -760) inside 4:00 in all
Fail: the deadline passes
Lines:
  Zoom: Three pictures by deadline. The drone's grounded. A gull.
  Zoom: Mayor, towers, human interest. In order of boring.
  Bunny: For the Tide? Get my good side. They're both my good side.
  Lead: She cut four ribbons while I focused.
  Zoom: Now the skybridge. Straight up. Readers love a neck ache.
  Lead: A cab driver's yelling at a meter.
  Zoom: That's the front page. Shoot it.
  Zoom: Under the wire. You've got an eye. Two, even.
Card: "In order of boring."
```

### Z2 · High Angle · `reg-exclusive-2` · tier B

```
Leads: both · Pays: $1,200
1. goto    the parking garage (300, -700), 17:30
2. goto    the next roof (310, -760): take the top-deck ramp at 70 km/h or more
3. collect Zoom's drone from the air-conditioning unit
4. photo   the Spire (52, -900) from this roof before 20:00
5. goto    (-560, -760)
Fail: the vehicle is destroyed · 20:00 arrives. A missed jump restarts step 2.
Lines:
  Zoom: My drone's on a roof. Not my roof. A gull moved it.
  Lead: How do I get up there?
  Zoom: There's a ramp. Not officially. Seventy should do it.
  Lead: Should?
  Zoom: Seventy has done it. Once. In a different car.
  Lead: Got it. It's been chewed.
  Zoom: While you're up there: the Spire. Don't waste my light.
  Zoom: That's a cover. Your name goes on it. Small.
Card: "Seventy should do it."
```

### Z3 · Staged · `reg-exclusive-3` · tier B

```
Leads: both · Pays: $2,500
1. goto   the Sheriff's HQ gate (200, -2150) at 19:00
2. follow the show truck to Commerce Way at Sandbar Avenue (372, -677), 30 to 80 m behind
3. photo  the crew parking tonight's "stolen" Wahoo
4. photo  the roadblock cones going out
5. photo  the clapperboard
6. heat   jumps to 3 at the third flash: the staged chase is real now, and live. Clear it.
Fail: closer than 30 m for 5 s · the truck gets 150 m ahead · Checkpoints: after 2, after 5
Lines:
  Zoom: Tip from inside. The show sets its chases up in advance.
  Zoom: Follow the truck. Not close. It has eleven cameras.
  Lead: They're parking a car in the road. Nicely.
  Zoom: That's tonight's stolen car. Get the plates.
  Lead: There's a man with a clapperboard.
  Zoom: At a crime scene! Shoot the clapperboard!
  Deputy: Hey! No pictures! This is a spontaneous pursuit!
  Zoom: They're shooting. Run. Boringly. They hate boring.
Card: "A spontaneous pursuit."
```

### Z4 · Exclusive · `reg-exclusive-4` · tier B

```
Leads: Teo · Pays: $4,000 · Ends the chain
1. goto    the footprints in Bayfront Park (-300, -450) at 14:50
2. survive 25 s, until 15:15. Mayor Bunny walks into the frame: move 10 m and she follows in 8 s.
3. photo   lightning on the Spire: 3 strikes in 90 s, a 0.5 s window each. One clean frame will do.
4. goto    (-560, -760)
Fail: no strike caught. A frame with the Mayor in it restarts step 2.
Lines:
  Zoom: Every day at 3:15 the storm hits the Spire first.
  Zoom: Nobody has the strike. Stand in the footprints. Don't blink.
  Bunny: Is this a photo? I love photos. Where do you want me?
  Teo: Not in it. Respectfully. Mayor. Please.
  Zoom: Fourteen. Wait for it.
  Teo: Got it! Holy shit, the whole bolt!
  Zoom: Front page for a week. Here. My old drone.
  Zoom: It pulls left. So do I.
Card: "The whole bolt."
```

## New names

| Name | What it is | Tier |
|---|---|---|
| Wrap Battle | The rival food truck in The Paintworks. A food pun. | C |
| Mrs Fitch | Old Man Fitch's wife, at Pelican Rest. | C |
| Lawn of the Year | The association's cup, shown at Galleria Flamingo. | C |
| The courthouse, Uptown | Seed `(-250, -1240)` for the courts the canon puts in Uptown. | B |
| *The Bayhaven Tide* street door | Seed `(-560, -760)` on Radio Row for the canon newspaper. | B |
