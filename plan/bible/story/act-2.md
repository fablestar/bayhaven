# Bible · story · Chapter 1, act 2: Bayhaven Tomorrow

Full scripts for missions 5 to 10. Mags and Teo lift the association's binder and learn who is behind the notice, borrow the Sheriff's audience, and take three things Bellweather needs: his sunscreen launch, his survey markers and his bulldozer. Missions 5 and 7 are fixed by `05-content.md` and matched step for step. Mission 5 keeps the canon's format example and the seeds in `bible/tech/schemas.md`.

Tier: A (missions 5 and 7) · B (missions 6, 8 and 9) · C (mission 10)

## How to read a script

- Steps use only the fifteen step types. In A missions the numbers are the step numbers in `05-content.md`; a letter (5a, 5b) splits one into engine steps in the same order.
- Field words are from `bible/tech/schemas.md`: `r`, `as`, `cond`, `timer` (seconds), `maxDamage` (percent), `stopBy`, `keep`, `subject`, `flag`. Seeds are `(x, z)`.
- Hints name the action; the UI adds the key. 60 characters or fewer.
- Lines are grouped by step and play in order; a bracket line is a trigger. `[phone]`, `[radio]` and `[loudhailer]` pick the voice filter. `Chat` lines go to the LIVE chat, `Rucker` lines to the ticker. 90 characters or fewer. The game fills `{vehicle}`.
- Finishing a mission offers the next id in story order that exists in the build. The A chain is 1, 3, 5, 7, 11, 18, 20.
- No `switch` step before mission 11: each mission sets the active lead at its start and locks the switch button.
- Armed enemies use the weapons in `04-systems.md` section 8 and shoot to kill. At zero health a lead is Knocked out and the mission restarts from its checkpoint.
- Squawk posts are lower case on purpose.

## Act 2 at a glance

| # | id | Tier | You play | Start seed | Minutes | Pays |
|---|---|---|---|---|---|---|
| 5 | `open-house` | A | Mags | `(-1250, -220)` | 7 | $4,000 |
| 6 | `glow-up` | B | Teo | `(-1108, 110)` | 7 | $5,000 |
| 7 | `as-seen-on-tv` | A | Mags | `(-1246, -224)` | 5 | $2,500 and 5,000 followers |
| 8 | `swamp-thing` | B | Mags | `(1200, -3250)` | 7 | $6,500 |
| 9 | `crane-game` | B | Mags | `(2900, -260)` | 8 | $8,000 |
| 10 | `injury-time` | C | Mags | `(420, -1830)` | 5 | $3,000 |

---

### 05 · Open House            id: open-house · tier A · chapter 1, act 2

```
Giver: Mags · Leads: both (you play Mags; Teo keeps the guide busy, then rides in the cart) · Where: Mallard Greens · Length: 7 min · Pays: $4,000 · Unlocks: as-seen-on-tv (glow-up if present)
Needs: missions, stealth, golf cart, Mallard Greens
Start: Mags's marker at lot 9 (-1250, -220), 09:00 to 17:00.
1.  goto     (-900, -1900) the Gatehouse, in a tidy car: r 8, as vehicle, cond tidy (vehicle health over 60, so no dents show). Bev turns a dented car away: fix it or bring another.     hint: "Dents get you turned away."
2.  say      tour-guide/Mags/Teo on the sales centre patio (-960, -1940). On the last line a postcard wipe moves both leads to the clubhouse terrace (-1985, -2085), as if the tour cart had driven them.
3.  goto     the clubhouse office window on the back veranda (-2000, -2100), r 3, as foot, stealth: 2 armed guards. Guard 1 walks the pool deck from (-1992, -2092) to (-2012, -2092). Guard 2 walks the pickleball path from (-2018, -2104) to (-1996, -2112). Cones are 14 m long and 60 degrees wide, drawn on the ground; 1.5 s inside one is a "spotted".     hint: "Stay out of the cones on the ground."
4.  collect  item: binder, on the desk inside the open window (-2004, -2096). then: alarm.
5a. enter    a Birdie at the cart barn (-2300, -2500). Teo runs over and takes the passenger seat.
5b. heat     reach 2 (the mission sets it as the cart moves off)
6.  goto     the hole in the hedge behind the 14th green (-2450, -2420), r 6, timer 240. Three security Birdies chase at 34 km/h (yours does 38), a guard firing a pistol from each. Sprinklers are on along the 12th fairway: grip 0.6.     hint: "Carts fit between the trees."
7.  heat     clear. Past the hedge is a service track with sawgrass on both sides.     hint: "Out of sight, the viewers leave."
Fail: spotted three times · the cart is destroyed · 4 minutes pass in step 6
Checkpoints: after 2, after 4
Lines:
  [1 goto, at the gate]
  Bev: Name and purpose of visit?
  Mags: Calloway. I'm here to be sold something.
  Bev: Tour's at the sales centre. Don't feed the lake.
  [if the car is dented]
  Bev: Not in that. The association has a dent bylaw. Section 14.
  [2 say]
  Guide: Welcome to Bayhaven Tomorrow. Please don't touch the lawn.
  Mags: It's plastic.
  Guide: It's consistent. Real grass has opinions.
  Teo: Can I film? I have followers. Most of them are real-ish.
  Guide: Tag us! Phase Five replaces an underused trailer community by the beach.
  Mags: Underused.
  Guide: Sixty homes, sixty people. One each! So inefficient.
  Guide: Mr. Bellweather signs every bylaw himself. The binder lives in the office.
  Guide: And this is the clubhouse. The clock is always right. The clock has been warned.
  [3 goto]
  Teo: Go. I'll keep her talking. Ma'am, could you say all that again, to camera?
  Mags: Two guards. Slow walkers. I've outpaced worse on a field trip.
  [4 collect]
  Mags: "Bylaws." Three rings. Heavy for a rulebook.
  Mags: Teo. Pelican Rest is in here. Every lot. With a new owner's name on it.
  Teo [phone]: New owner? What the fuck? WE'RE the owners!
  Mags: Not on page forty. "Deeds held at the Meridian Spire. Penthouse vault."
  Security [radio]: Clubhouse to all carts. The binder is off the shelf. Repeat, off.
  [5a enter]
  Mags: Cart. Passenger side. Hold the binder. Don't read ahead.
  [6 goto]
  Security [loudhailer]: Stop or we fire! You are on the fairway without a tee time!
  Teo: They're shooting! At a golf cart! We do 38! A brisk dog does 38!
  Mags: Fourteenth green. There's a hole in the hedge behind it.
  Mags: The 9 bus stopped outside it for 31 years. Kids used it every Friday.
  [7 heat]
  Teo: Sirens. Real ones. Are we on the Sheriff's show?
  Mags: Two lights. He doesn't go live for two lights. Engine off. Be boring.
  Teo: I've never been boring on purpose.
  Mags: You're a natural.
  [heat cleared]
  Mags: Bellweather. On every page. That smiling bastard. We'd need his key.
  Teo: And people watching. Nobody can bury it if everybody's watching.
Result card: "Open House" · stamp Delivered · caption "Thank you for touring."
```

- **Step map:** 1 to 7 are the steps in `05-content.md`; 5a and 5b are its step 5. There are no interiors, so the "office" is an open window on the veranda.
- **Squawk:** "someone drove a golf cart through the 14th green and i have never felt more alive"
- **Radio:** Barbara Wetherby: "A golf cart left Mallard Greens today by an unapproved exit."
- **Check:** skip all eight engine steps: `mission:completed`, `cash: 4000` (roadmap check D7.5). Real step: at step 7, `t.setHeat(2)`, `t.teleport(-2470, -2460)`; the `heat` step completes by itself within 20 s.
- **Clip:** the Birdie through the sprinklers on the 12th fairway, pistol shots kicking up turf, Teo hugging a binder.

---

### 06 · Glow Up            id: glow-up · tier B · chapter 1, act 2

```
Giver: June · Leads: Teo · Where: Sandpiper Isle · Length: 7 min · Pays: $5,000 · Unlocks: nothing new
Needs: missions, stealth, phone camera, Skimmer, Sandpiper Isle, the Glow Camp lot, cutscenes
Start: June's white Pompano at the Sandpiper Bridge approach (-1108, 110), 10:00 to 13:00. The mission sets the hour to 11:30.
1. cutscene  intro-glow-up (cutscenes.md)
2. say       June's plan, in the van
3. enter     the white Pompano: Glow Camp livery, six jugs of cooking oil in the back
4. goto      the supply tent at Glow Camp (-1340, 585), r 6, over the bridge and past the island gatehouse (-1100, 430). The guard waves the livery through.
5. collect   item: crate, count 6, in the supply tent and the two tents beside it, as foot. Each pickup swaps one jug in. stealth: 2 armed camp guards in white linen, 12 m cones.     hint: "Wait for the cone to turn away."
6. photo     subject: kiki-stage, the stage at (-1360, 610), from the tent row, r 10, while Kiki has the guests apply the product     hint: "Camera. Get Kiki and the crowd in frame."
7. say       Kiki spots the chest phone
8. enter     a blue Skimmer at the camp dock (-1480, 620)
9. goto      the west marina (-1150, 90), r 12, as vehicle. Two security Skimmers chase and fire SMGs; they turn back at the marina mouth.     hint: "Cut across their wake to shake them."
Fail: spotted three times in step 5 · Teo is knocked out · the Skimmer is destroyed
Checkpoints: after 4, after 7
Lines:
  [1 cutscene]
  June: Don't wave. Don't say my name. Get in the van.
  Teo: June! You look great. You look... sponsored.
  June: I work for Kiki Halcyon. I'd like to stop. That's where you come in.
  [2 say]
  June: SPF 1000 launches at noon. Twelve dollars of lotion in a ninety-dollar bottle.
  June: She puts that shit on every guest, live. I want fryer oil in those bottles.
  Teo: You want me to oil a wellness retreat. On camera.
  June: You've got nothing to lose. I've got nine million followers and a contract.
  [4 goto, at the gatehouse]
  Guard: Delivery? Tent three. Don't look at the guests. They're cleansing.
  [5 collect]
  Teo: Six crates, six jugs. Swap, swap, swap. Chat, we are live and we are quiet.
  Teo: Guard coming. He's got a gun. I'm a tent. I'm part of the tent.
  June [phone]: Two more. She's on stage in one minute. Faster, Teo.
  [6 photo]
  Kiki: Abundance is a mindset. Sunscreen is a mindset you can buy. Everyone, apply!
  Kiki: Feel that? That's protection. That's... why is it warm?
  Teo: They're so shiny. June. A man just slid off his mat.
  Kiki: Why do I smell fries? Who is frying? We are on a CLEANSE.
  Kiki: It's a frying ritual, everyone! Very ancient! Keep glowing!
  [7 say]
  Kiki: You. Chest phone. Is that boy LIVE at my retreat?
  Teo: Hi, Kiki! Big fan! Used to be! Running now!
  [9 goto]
  Teo: Two behind me! Shooting! In matching wetsuits! Everything here fucking matches!
  June [phone]: Head for the yacht club. They won't shoot near money. Bad optics.
  Teo: You okay in there?
  June [phone]: I'm holding her phone while she screams. So, a normal day.
  [at the marina]
  Teo: Four thousand people watched that. June. Four THOUSAND.
  June [phone]: Don't get used to it. Five grand, from her content budget.
  June [phone]: Teo. Her partner is the man evicting you. Bellweather.
  June [phone]: They're planning a launch night at his tower. I'll call when I know more.
Result card: "Glow Up" · stamp Delivered · caption "Now with 100% more fries."
```

- **Numbers:** oiled guests slide off the stage, and by the evening news eleven are in Bayhaven General with burns. The dock to the marina is 650 m. Security Skimmers are 5 km/h slower and fire in bursts inside 40 m.
- **Squawk:** "kiki halcyon's whole retreat smells like fries and a man just slid off the stage. best glow camp yet"
- **Radio:** Barbara Wetherby: "Eleven guests at a Sandpiper Isle wellness retreat are in hospital with burns after oiling themselves at noon. The retreat calls it a glow."
- **Check:** skip all nine steps: `mission:completed`, `cash: 5000`. Real step: at step 9, `t.spawn('skimmer', { x: -1300, z: 200, heading: 60 })`, hold gas 12 s; the `goto` completes.
- **Clip:** Kiki on stage mid-sentence as the front row slides off their mats, seen through Teo's phone frame.

---

### 07 · As Seen on TV            id: as-seen-on-tv · tier A · chapter 1, act 2

```
Giver: Teo · Leads: both (you play Mags; Teo rides along and streams) · Where: anywhere, starts in Tideline · Length: 5 min · Pays: $2,500 and 5,000 followers · Unlocks: yacht-rock, the helicopter cam hint (swamp-thing if present)
Needs: missions, heat 1 to 3, the LIVE overlay, viewers
Start: Teo's marker at lot 10 (-1246, -224), any hour.
1.  say      Teo explains the plan. Mags says no. Teo is already live.
2.  heat     reach 3, any way the player likes. A cruiser idles at Rosa Street and Heron Walk Drive (-1012, 37). For this step only, a horn blast within 20 m of a deputy sets heat to 1, and each 15 s of not pulling over adds a level.     hint: "Honk at the cruiser on Rosa Street."
3a. say      the Sheriff opens his show: the LIVE overlay and chat appear for the first time. The player keeps driving.
3b. survive  60 s at heat 3 or more; the clock pauses below 3. From heat 3 the deputies shoot. Bonus followers in view: +250 for a 2 s drift, +500 for a 10 m jump, +100 for a near miss.     hint: "Stunts in view add viewers and followers."
4a. heat     clear     hint: "Car wash, bridge or a new car. Then sit."
4b. say      the count, wherever the car stops
Fail: Mags is knocked out · Mags is booked before heat 3
Checkpoints: after 1, after 3b
Lines:
  [1 say]
  Teo: I have an idea and you're going to hate it.
  Mags: Then I'll save time and hate it now.
  Teo: Bayhaven Blue: Live. Top show in the county. Half a million on a good chase.
  Teo: If we're the chase, my stream rides along. His audience becomes ours.
  Mags: You want the Sheriff to chase us. On purpose. For followers.
  Teo: For the park! Nobody saves a place they've never seen.
  Mags: No.
  Teo: I'm already live.
  Mags: Of course you are.
  [2 heat]
  Teo: Three lights and he goes live. There's a cruiser on Rosa Street. Honk at it.
  Mags: I have never honked at an officer in my life.
  [on the first honk]
  Deputy: Ma'am, did you just honk at me? ... Ma'am. MA'AM.
  [3a say]
  Rucker: Hello, Marlin County! We are LIVE, and we have a runner!
  Rucker: Suspect is in a {vehicle}. Driven by... zoom in. Is that a grandmother?
  Chat: grandma???
  [3b survive]
  Teo: They're shooting! Mags, they are actually fucking shooting at us!
  Mags: Three lights. You ordered three lights.
  Rucker: She's signalling. Folks, the suspect is signalling her turns.
  Teo: Do something! A drift! A jump! They love a jump!
  Mags: I'm doing the limit plus forty. That's my something.
  [at 30 s]
  Rucker: Brought to you by Bayhaven Tomorrow. Quality living. Quality pursuit.
  Teo: Thirty-one thousand viewers! Mags, the number has a COMMA.
  [4a heat]
  Mags: Sixty. Show's over. Now we get dull.
  Mags: Out of sight, engine off. They'll watch a parked car for ten seconds, then go.
  Rucker: Where'd she go? Chopper, where'd she go? Stay with us, folks. Folks?
  Chat: boring
  Chat: bring back grandma
  [4b say]
  Teo: Five thousand new followers. Five thousand people know my name.
  Mags: Do they know the park's name?
  Teo: ...They will. Mags. Bellweather pays for the Sheriff's show.
  Mags: Then the man evicting us owns the cameras. Good. He'll be watching.
Result card: "As Seen on TV" · stamp Delivered · caption "She signalled every turn."
```

- **Step map:** 1 and 2 are the steps in `05-content.md`; 3a and 3b are its step 3; 4a is its step 4; 4b adds closing lines before the card. The card also shows peak viewers from `state.heat.peak`.
- **Squawk:** "@BayhavenBlue lost a grandma who used her indicators the whole chase. explain"
- **Radio:** Barbara Wetherby: "The Sheriff's programme ended early tonight when its suspect parked, switched off and became, in his words, bad television."
- **Check:** skip step 1; `t.setHeat(3)` completes step 2 for real. Skip 3a. 61 s in view of a cruiser completes 3b. Under the expressway at `(-900, -1480)`, level 0, 4a completes at heat 0 (roadmap check D6.5). Followers are up by 5,000 or more.
- **Clip:** the first second of LIVE: the red pill snaps on, the chat fills with "grandma???", and the helicopter spotlight finds the pink coupe.

---

### 08 · Swamp Thing            id: swamp-thing · tier B · chapter 1, act 2

```
Giver: Nilda · Leads: Mags drives, Teo lifts crates · Where: Mudcat Glades · Length: 7 min · Pays: $6,500 · Unlocks: crane-game if present
Needs: missions, Gatorback, Mudcat Glades, swamp fog, cutscenes
Start: Captain Nilda's dock (1200, -3250), 05:00 to 08:00. The mission sets the hour to 05:30 and the weather to swamp fog.
1. cutscene  intro-swamp-thing (cutscenes.md)
2. say       Nilda's job, on the dock
3. enter     the Gatorback at (1204, -3262)     hint: "No brakes. Ease off early and lean."
4. collect   item: marker crate, count 5, each on a stake platform in a channel, any order: (1500, -3350) · (1900, -3200) · (2280, -3340) by the fish camp · (2700, -3100) · (2250, -2880). Pass within 4 m at under 25 km/h and Teo lifts it aboard.
5. say       two wildlife patrol Gatorbacks arrive, white with gold lettering, a warden with a shotgun on each
6. survive   75 s with both patrol boats behind. They are 10 km/h faster in open water and cannot enter the cypress cut from (1750, -3420) to (1400, -3380), which is 5 m wide. They fire inside 40 m. A patrol boat within 8 m for 5 s boards you.     hint: "Narrow water slows them, not you."
7. deliver   the Gatorback and five crates to Nilda's dock (1200, -3250), maxDamage 70
8. say       Nilda sinks the markers
Fail: the Gatorback is destroyed · the patrol boards · Mags is knocked out
Checkpoints: after 3, after 5
Lines:
  [1 cutscene]
  Nilda: You're the bus driver. Word is you can drive anything.
  Mags: Anything with a wheel.
  Nilda: This has a fan. Get on.
  [2 say]
  Nilda: Bellweather's men staked my goddamn channels yesterday. Drainage starts at dawn.
  Nilda: No markers, no drainage. Five crates of them are out there. I want all five.
  Teo: Is this legal?
  Nilda: It's a swamp, kid. Legal is whatever floats.
  [3 enter]
  Mags: Where's the brake?
  Nilda [radio]: No brake. Throttle off and ask politely.
  [4 collect]
  Teo: Crate one! It's all little orange flags. He put flags on a swamp.
  Teo: Alligator. Alligator. Mags. ALLIGATOR.
  Mags: He lives here. We're the traffic.
  [5 say]
  Warden [loudhailer]: Wildlife patrol! Engine off! This is a protected... development!
  Nilda [radio]: New boats. Guess who donated them.
  Teo: It says Bayhaven Tomorrow on the side. In gold.
  [6 survive]
  Mags: Two of them. Faster than us. Armed.
  Nilda [radio]: Faster in open water. Take the cypress cut. They're too wide and too shiny.
  Teo: Shit! Shotguns! Duck! I said duck, not swerve!
  Mags: On an airboat it's the same thing.
  [when a patrol boat jams in the cut]
  Warden [loudhailer]: We are stuck. Repeat, stuck. Do not film this.
  Teo: Filming it.
  [8 say]
  Nilda: Five of five. Now watch. This is the legal part.
  Teo: You're throwing them in the swamp.
  Nilda: I'm returning them to nature. He can survey again in six weeks.
  Nilda: Need anything moved by water, Calloway, call me. I never ask what's in it.
Result card: "Swamp Thing" · stamp Delivered · caption "Returned to nature."
```

- **Numbers:** the crates make a 3.4 km loop. Alligators are slow props that push the boat aside and are never harmed. A patrol boat that enters the cut jams there.
- **Squawk:** "two brand new patrol airboats wedged in the cypress cut like corks. somebody's grandma did that"
- **Radio:** Barbara Wetherby: "Survey work in the Glades is on hold after shots were fired and five crates of markers were, quote, returned to nature."
- **Check:** skip all eight steps: `mission:completed`, `cash: 6500`. Real step: at step 4, `t.spawn('gatorback', { x: 1480, z: -3350, heading: 90 })`, hold gas 2 s; the count reaches 1.
- **Clip:** the Gatorback sliding into the cypress cut through dawn fog, shotgun blasts in the reeds, both patrol boats jamming behind it.

---

### 09 · Crane Game            id: crane-game · tier B · chapter 1, act 2

```
Giver: Dess · Leads: Mags works the crane and drives; Teo spots from the stacks · Where: Rustwater · Length: 8 min · Pays: $8,000 · Unlocks: injury-time if present, else yacht-rock
Needs: missions, the crane control (crane.mod.js), Hogfish, heat 1 and 2, Rustwater, cutscenes
Start: the foot of crane 3 on the quay (2900, -260), 08:00 to 18:00.
1.  cutscene  intro-crane-game (cutscenes.md)
2.  say       Dess's job, on the cab catwalk
3.  enter     the cab of crane 3 (vehicle id gantry). Steer moves the trolley, gas and brake lower and raise the hook, interact grabs.     hint: "Steer moves the trolley. Gas lowers the hook."
4.  collect   item: container BT-44, count 1. It is one of three pink boxes in the stack at (2925, -262); Teo reads the tags. A wrong grab costs 20 s to put back.
5.  deliver   what: the container, to: the Hogfish flatbed at (2868, -262), maxDamage 50, timer 90. The load swings; a drop from over 2 m is 25 damage.     hint: "Stop the trolley early. Let it settle."
6.  enter     the Hogfish
7.  goto      Gate 2 (2612, -620), r 6, as vehicle. Stop on the line.
8.  choice    flag: gate. "Paperwork": Teo talks to the guard; hold still for 20 s while a cruiser idles 30 m away (moving early turns it into Barrier). "Barrier": drive through it; the guard empties a pistol at the cab and heat is set to 2.
9.  heat      clear (passes at once when the flag is paperwork)
10. deliver   the Hogfish and its box to the scrapyard, bay six (2200, -1200), maxDamage 60
Fail: the container breaks · the Hogfish is destroyed · Mags is booked or knocked out
Checkpoints: after 2, after 6
Lines:
  [1 cutscene]
  Dess: Ever driven anything seventy metres up?
  Mags: I've driven second-graders home from a birthday party.
  Dess: Then you'll be fine.
  [2 say]
  Dess: Bellweather's got a box on my dock. Tag BT-44. Pink, because of fucking course.
  Dess: Inside: one bulldozer. Booked for Pelican Rest. Monday.
  Mags: Then Monday's cancelled.
  Dess: I lose boxes for a living. Never one this big, and never one of his. You lift.
  Teo: I'll spot from the stacks. And stream it. Biggest unboxing ever!
  [4 collect]
  Dess [radio]: Slow hands, Calloway. She's got a long reach and a short temper.
  Teo [radio]: Pink one! No, other pink! There are three pinks! Who ships this much pink?
  Mags: Read me the tag, Teo.
  Teo [radio]: B... T... 44! That one! You're right over it!
  [on a wrong grab]
  Dess [radio]: That's somebody's patio furniture. Put it back. Gently.
  [5 deliver]
  Dess [radio]: Now swing it to the flatbed. It'll want to keep swinging. Don't let it.
  [on the pins]
  Dess [radio]: On the pins. I've seen ten-year hands do it uglier.
  [7 goto]
  Dess [radio]: Gate 2. The guard's new. You've got my manifest. Or you've got a truck.
  [8 choice: paperwork]
  Guard: This says "one item, pink, none of your business".
  Teo: Sir! For my stream! What's the heaviest thing you ever waved through?
  Guard: Oh. Uh. A boat, once. Am I on camera? Go ahead, go ahead.
  [8 choice: barrier]
  Mags: Hold on to something that isn't me.
  Guard: That's the barrier! Stop! I'll shoot! ... Okay, I'm shooting!
  [10 deliver]
  Teo: Holy shit. We stole a bulldozer. In a box.
  Mags: We moved a box. What's inside is between Bellweather and Monday.
  Dess [phone]: Bay six. My paperwork says "returned to sender, sender unknown".
  Dess [phone]: The union's with Pelican Rest, Calloway. Need a lift, ring the hall.
Result card: "Crane Game" · stamp Delivered · caption "Returned to sender. Sender unknown."
```

- **Numbers:** the trolley moves at 4 m/s, the hook at 3 m/s; the cab is 62 m up.
- **Squawk:** "a pink container left the port today and nobody at the port can find the paperwork. or the container"
- **Radio:** Barbara Wetherby: "The Bellweather Group reports a bulldozer missing from the port. The port reports no record of a bulldozer."
- **Check:** skip all ten steps once per `gate` flag: `mission:completed`, `cash: 8000`, heat 2 after "Barrier" and 0 after "Paperwork". Real step: an input script completes the lift in step 5.
- **Clip:** the pink container swinging across the sunset and settling onto the flatbed, seen from the cab 62 m up.

---

### 10 · Injury Time            id: injury-time · tier C · chapter 1, act 2

```
Giver: Lawyer Larry · Leads: Mags drives and photographs; Teo is the victim · Where: Northgate · Length: 5 min · Pays: $3,000 · Unlocks: yacht-rock
Needs: missions, follow, phone camera, Possum, Sturgeon, Northgate
Start: Lawyer Larry's office (420, -1830), 09:00 to 17:00.
1. say      Larry's plan, in his car park
2. enter    the Possum at (428, -1822): beige, and the passenger door only stays shut if Teo holds it
3. goto     the Sheriff's HQ gate (200, -2120), r 8. Bellweather's white Sturgeon is pulling out.
4. follow   the Sturgeon west on Outlet Road and south on Galleria Road to the red light at Gateway Boulevard (-200, -1812): 720 m at 40 km/h. keep: 15 to 80 m.     hint: "Stay back. Not too far back."
5. chase    the stopped Sturgeon. stopBy: ram, hits 1, at 3 to 8 km/h. The light stays red for 20 s.     hint: "Roll. Do not drive. Roll."
6. photo    subject: both-cars, the wide shot, from the footprints at (-188, -1806), r 2
7. photo    subject: sturgeon-plate, from (-200, -1822), r 2
8. photo    subject: teo-down, Teo lying beside the Possum's open door, from (-204, -1808), r 2. All three within 45 s of the bump; then the limo leaves.     hint: "Stand in the footprints. Frame. Snap."
9. goto     Larry's office (420, -1830), r 8
Fail: the limo is over 80 m ahead or under 15 m for 3 s in step 4 · a bump over 8 km/h (a real accident: his driver gets out shooting) · the limo leaves before the third photo
Checkpoints: after 3, after 5
Lines:
  [1 say]
  Larry: Hurt? Flirt with a lawsuit! Sorry. Habit. Come in, come in.
  Larry: Bellweather is evicting you. I can't stop that. I represent him.
  Mags: Then why are we here?
  Larry: Because I also represent you. As of now. Two sides, two invoices.
  Larry: I need him answering questions under oath. For that I need an accident.
  Larry: Touch his limo. Under 8 kilometres an hour. Then three photos. Wide, plate, victim.
  Teo: Who's the victim?
  Larry: You have a very suable face.
  [2 enter]
  Teo: The door doesn't close. I'm holding the door.
  [4 follow]
  Mags: White limo. Armed driver. We're following, not chasing.
  [5 chase]
  Mags: Red light. He's stopping. Six. Five. Four kilometres an hour...
  [on the bump]
  Teo: Shit, the door! I let go of the door! I'm... on the road. Ow?
  Driver: Did you just touch us? Hands where I can see them. Both of you.
  [6 photo]
  Mags: Stay down. Wide shot first. Both cars and the light.
  [7 photo]
  Bellweather: Is there a problem? I've a ribbon to cut. Somebody give them a tote bag.
  Mags: That's him. Plate.
  [8 photo]
  Bellweather: Pelican Rest, isn't it? Do sell. Storms are hard on trailers. And on people.
  Teo: Mags. He's still smiling. Why is he still smiling?
  Mags: Hold still. Look hurt.
  Teo: This is my face!
  [9 goto, on arrival]
  Larry: Beautiful. Not a mark on that bumper. That's what makes it emotional.
  Larry: He settles or he sits for questions. Either way I bill both of you.
  Mags: You bill him. We keep the three thousand.
  Larry: You'd have made a terrific lawyer.
  Mags: I'd have made a terrible one. I can only say what I mean.
Result card: "Injury Time" · stamp Delivered · caption "Hurt? Barely."
```

- **Numbers:** Bellweather stays in the limo and talks through a window lowered 10 cm. His driver stands at the bumper with a hand inside his jacket. After this mission Lawyer Larry counts as met, so booking and hospital bills are halved.
- **Squawk:** "a limo and a beater touched bumpers on gateway boulevard at walking speed and a lawyer was there in 40 seconds"
- **Radio:** Barbara Wetherby: "Lawyer Larry has filed suit over a collision that witnesses call a nudge. He is acting for both drivers."
- **Check:** skip all nine steps: `mission:completed`, `cash: 3000`. Real step: at step 5, spawn the Possum 20 m behind the stopped limo, tap gas for 0.4 s and coast; the `chase` completes at 3 to 8 km/h. At full gas the run emits `mission:failed`.
- **Clip:** the slowest crash in the game: the Possum rolls into the limo at 4 km/h and the driver's hand goes into his jacket.

## New names

| Name | What it is | Tier |
|---|---|---|
| Gate 2 | The truck gate of the Gantries terminal in Rustwater, seed `(2612, -620)`, with one barrier and one guard hut. | B |
