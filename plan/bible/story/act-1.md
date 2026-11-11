# Bible · story · Chapter 1, act 1: Notice to Vacate

Full scripts for missions 1 to 4. Pelican Rest gets 30 days, a tow truck takes Teo's scooter, Mags pulls the cover off her coupe, and the two of them start taking work from Wendell and Rafa. Missions 1 and 3 are fixed by `05-content.md` and are matched step for step here. Missions 2 and 4 are new data files that use existing step types only.

Tier: A (missions 1 and 3) · B (missions 2 and 4)

## How to read a script

- **Steps** use only the fifteen step types. In A missions the step numbers are the numbers in `05-content.md`. A letter (2a, 2b) splits one of those steps into engine steps, in the same order.
- **Field words** are the ones in `bible/tech/schemas.md`: `r` (marker radius in metres), `as` (foot or vehicle), `cond`, `timer` (seconds), `maxDamage` (percent), `stopBy`, `keep`, `subject`, `flag`.
- **Seeds** are `(x, z)` in metres. `y 3` after a seed is height above the ground.
- **Hints** name the action. The UI adds the key or button for the device and removes the hint when the player does the thing. 60 characters or fewer.
- **Lines** are grouped by the step they play on and play in order. A bracket line gives a trigger. `[phone]`, `[radio]` and `[loudhailer]` after a speaker pick the voice filter. `Chat` lines go to the LIVE chat or to Teo's stream chat, not to subtitles. 90 characters or fewer.
- `(optional: needs <id>)` marks a line that plays only when that mission is in the build and finished.
- **Unlock rule:** finishing a mission offers the next id in story order that exists in the build. The A chain is 1, 3, 5, 7, 11, 18, 20. Offer messages are in `messages.md`.
- **Leads:** no script uses a `switch` step before mission 11. Each mission sets the active lead at its start and locks the switch button until the result card.
- **Danger:** enemies listed as armed use the weapons in `04-systems.md` section 8 and shoot to kill. Crashes, fire and bullets are real for everyone on the street. A lead at zero health is Knocked out, wakes at Bayhaven General, and the mission restarts from its checkpoint. Violence is shown briefly and from a distance.
- Squawk posts are lower case on purpose. Everything else a player reads uses normal casing.

## Act 1 at a glance

| # | id | Tier | You play | Start seed | Minutes | Pays |
|---|---|---|---|---|---|---|
| 1 | `final-notice` | A | Mags | `(-1250, -220)` | 4 | $500 |
| 2 | `content-is-king` | B | Teo | `(-1246, -224)` | 6 | $800 |
| 3 | `repo-woman` | A | Mags | `(284, 46)` | 6 | $1,200 |
| 4 | `hot-sauce` | B | Mags | `(-1400, -880)` | 6 | $1,500 |

## Places this act uses

| Place | Seed | District | Tier |
|---|---|---|---|
| Pelican Rest noticeboard (Gerald sits on it) | `(-1255, -215)` | Tideline, West End | A |
| Lot 9, Mags's trailer and lawn chair | `(-1250, -220)` | Tideline, West End | A |
| Mags's carport (the Heron) | `(-1256, -226)` | Tideline, West End | A |
| Lot 10, Teo's trailer | `(-1246, -224)` | Tideline, West End | A |
| Scooter stand | `(-1240, -230)` | Tideline, West End | A |
| Park gate on Driftwood Street | `(-1250, -197)` | Tideline, West End | A |
| Wendell's bench across from Hotel Alba | `(284, 46)` | Tideline, The Strand | A |
| Hotel Alba drop-off | `(300, 24)` | Tideline, The Strand | A (the hotel is B: until it lands, any hotel lot at that seed) |
| Park & Sons forecourt · service bay · loaner spot | `(340, -222)` · `(332, -236)` · `(352, -222)` | Tideline, The Strand | A |
| Repo alley between Flamingo Avenue and Calle Uno | `(-892, -397)` | Palma Vieja, Calle Mural | A |
| Spire drop-off · Chad's Grouper | `(70, -850)` · `(84, -862)` | Meridian, The Exchange | A |
| Tideline Motel car park ramp · walkway roof | `(-560, -62)` · `(-520, -56)` | Tideline, Motel Row | B |
| Lava Abuela kitchen door | `(-1694, -474)` | Palma Vieja, El Bajo | B |
| Mercado loading bay | `(-1500, -800)` | Palma Vieja, La Plaza | B |

---

### 01 · Final Notice            id: final-notice · tier A · chapter 1, act 1

```
Giver: (opening) · Leads: Mags drives, Teo rides along · Where: Tideline, West End to The Strand · Length: 4 min · Pays: $500 · Unlocks: repo-woman, free roam (content-is-king if present)
Needs: missions, driving, traffic, Tideline, cutscenes (a stub is enough on day 6)
Start: new game, 17:30, clear. Mags in the lawn chair at lot 9 (-1250, -220).
1. cutscene  opening (shot list in cutscenes.md). If skipped, the objective reads "Marco is towing Teo's scooter. Get in the Heron."
2. enter     the Heron, pink, under the carport (-1256, -226). Teo takes the passenger seat.     hint: "Hold gas to go. Steer early, she is heavy."
3. chase     Marco's tow truck (a Remora; until that model exists, a Mullet with a hook and a flashing light). It leaves the gate (-1250, -197), turns east onto Heron Walk Drive at (-1252, 37) and holds 70 km/h. It runs the red lights at Rosa Street (-1012, 37) and Egret Avenue (-372, 37). stopBy: the Heron is within 12 m of its tail.     hint: "Handbrake for the sharp turn."
4. survive   3 rams on the truck's tail at a closing speed of 15 km/h or more. Bar on screen: "Hook 0/3". The truck drops to 55 km/h and weaves. On the third ram the Pinfish breaks loose and slides to the kerb by the plaza, about (0, 40). Traffic is live and crashes are real: a head-on at speed can wreck the Heron.
5. say       Teo gets out, lifts the scooter and rides west at 45 km/h. The lines play while Mags is free to follow. The step ends on the last line.
6. goto      the Park & Sons forecourt (340, -222), r 8, as vehicle     hint: "The pink dot on the minimap is where to go."
Fail: the Heron is destroyed · the truck gets 250 m ahead in step 3 · the truck reaches Pier Road (600, 37) in step 4 still carrying the scooter
Checkpoints: after 2, after 4
Lines:
  [1 cutscene]
  Marco: Thirty days. Says so right there. I just staple.
  Teo: Hey! That's my fucking scooter! I'm mid-upload!
  Marco: Lot charges, kid. Take it up with the new owner.
  Teo: They took my scooter. My whole career is on that scooter.
  Mags: Your career is a phone on a stick.
  Teo: Are you going to help?
  Mags: Seatbelt.
  [2 enter]
  Teo: You have a car? You've had a car this whole time?
  Mags: I have a coupe. A car is what other people have.
  [3 chase]
  Teo: There! Heading for the beach road! He's not even hurrying!
  Mags: He will be.
  [at the first red light]
  Teo: Holy shit, he ran the light! Can he do that?
  Mags: He just did. So can we. Once.
  Teo: Since when do you drive like this?
  Mags: Since before you were an idea. Hold the dash.
  Teo: I'm filming this. Is it okay if I film this?
  Mags: You were going to anyway.
  [4 survive]
  Mags: I'm going to tap his bumper. Three times. Count for me.
  [ram 1]
  Teo: Tap? That was a ram! That's one!
  Marco [loudhailer]: Lady! I just drive the truck!
  [ram 2]
  Teo: Two! The hook's swinging! My baby's swinging!
  Marco [loudhailer]: Stop fucking hitting me! It's a lease!
  [ram 3]
  Teo: Three! She's loose! She's sliding! She's... fine. She's fine!
  Mags: Three. As agreed.
  [5 say]
  Teo: Not a scratch. Okay, one scratch. It adds character.
  Teo: Mags. That was the best fucking thing I have ever filmed.
  Mags: How many people watched?
  Teo: Live? Four. One of them was you.
  Mags: I was driving.
  Teo: Then three. Three is a start!
  Teo: I had $500 saved for the tow charge. Take it. Fuel money.
  Mags: I'll take it. You'd only spend it on phone storage.
  Teo: What do we do about the notice?
  Mags: Thirty days is a long time. I've been given bus routes on less.
  Mags: Go home. I'm taking her to Wendell. That bumper is older than you.
  [6 goto]
  Teo [phone]: Mags! Somebody clipped it! We're on Squawk! Eleven likes!
  Mags [phone]: Is eleven good?
  Teo [phone]: It's eleven more than yesterday!
  [on arrival]
  Mags: Closed. "Back in 5." He wrote that sign in the spring.
  Mags: Good thing I never gave back the key.
Result card: "Final Notice" · stamp Delivered · caption "One scooter, slightly used."
```

- **Step map to `05-content.md`:** 1 to 6 are its steps 1 to 6. Its step 7 is the result card.
- **Sign text:** the notice reads "Notice to vacate. 30 days. The Bellweather Group." The garage door sign reads "Back in 5."
- **Squawk:** "a grandma in a pink coupe just rammed a tow truck on heron walk. three times. on purpose"
- **Radio:** Barbara Wetherby: "A tow truck lost a scooter on Heron Walk Drive this evening. The scooter is said to be fine. She's fine."
- **Check:** `test.mission.start('final-notice')`, then `test.mission.skipStep()` six times. Expect `mission:completed` with `cash: 500` and the result card on screen. One real step: at step 6, `t.spawn('heron', { x: 300, z: -222, heading: 90 })`, hold gas for 3 s with `t.input`, and the next `mission:step` event must arrive within 10 s without a skip.
- **Clip:** the third ram in front of the plaza at golden hour. The scooter swings off the hook, slides past the Bayhaven sign, and Teo's arms go up in the passenger seat.

---

### 02 · Content Is King            id: content-is-king · tier B · chapter 1, act 1

```
Giver: Teo · Leads: Teo · Where: Tideline, West End and Motel Row · Length: 6 min · Pays: $800 · Unlocks: nothing new (repo-woman is already open)
Needs: missions, on foot, climbing, phone camera, Pinfish, jumps, the Tideline Motel lot
Start: Teo's marker at lot 10 (-1246, -224), any hour from 07:00 to 19:00. Teaches walking, the camera and big jumps.
1. say       the plan, at lot 10. Mags is under the Heron and answers from there.
2. collect   5 phone tripods Teo has left along Heron Walk, in order: a bench (-1238, 46) · the top of the seawall steps (-1215, 52) · the lifeguard hut roof (-1200, 63) y 2.6 · an umbrella stand roof (-1120, 58) y 2.2 · the bait shop awning (-1010, 30) y 2.8     hint: "Sprint at the wall, then jump to climb."
3. photo     subject: gerald, on the swim buoy at (-1000, 96), from the awning, r 4     hint: "Open the phone, pick Camera, frame the bird."
4. say       Teo counts his viewers
5. enter     Teo's Pinfish at (-1004, 34)
6. goto      the plywood ramp in the Tideline Motel car park (-560, -62), r 6, as vehicle     hint: "Lean into turns. Brake before the corner."
7. goto      the motel walkway roof (-520, -56) y 3, r 5. It can only be reached off the ramp at 55 km/h or more: a 14 m jump over the pool.     hint: "Hit the ramp at 55 or faster."
8. say       the numbers come in
Fail: Teo is knocked out · the Pinfish is destroyed · 90 seconds pass in step 2 without a pickup
Checkpoints: after 2, after 5
Lines:
  [1 say]
  Teo: Thirty days. You know what beats a developer? Attention. A lot of it.
  Mags: A lawyer beats a developer.
  Teo: Lawyers cost money. Views are free. Three stunts, one video, viral by lunch.
  Mags: You have 212 followers.
  Teo: 212 today! Watch the stream. You'll see.
  Mags: I'm under a car.
  Teo: Watch it under the car!
  [2 collect]
  Teo: Okay, chat! Stunt one. I call it The Collector. Five tripods, zero stairs.
  Chat: first
  Chat: nice shirt bro. cheap sunglasses on my page
  Teo: Thank you, real human viewer!
  [on the hut roof]
  Teo: Lifeguard's on break. Lifeguard is always on break.
  Chat (Mags): Get off the roof.
  Teo: Mags is in chat! Everybody say hi to Mags!
  Chat (Mags): Hello.
  [3 photo]
  Teo: Stunt two. Wildlife photography. That's Gerald. He's a local celebrity.
  Teo: Hold still, big guy. Chin up. Find your light.
  Chat (Mags): His left side is better.
  Teo: She's right. She's always right. Left side, Gerald!
  [4 say]
  Teo: Numbers check. Three viewers. Peak three. That's a full car!
  Teo: We need a closer. Something with air under it.
  [5 enter]
  Teo: I built a ramp. Out of the notice boards. They left about forty.
  Chat (Mags): That's evidence.
  Teo: It's recycled evidence.
  [7 goto]
  Teo: Stunt three! One pool, one ramp, one guy who delivers noodles for a living!
  Teo: Fifty-five. I need fifty-five. Come on, come on, come on...
  [in the air]
  Teo: I'M OVER THE POOL. CHAT. I'M OVER THE FUCKING POOL.
  [8 say]
  Teo: Holy shit. Did everybody see that? I landed on a roof!
  Chat: nice jump. cheap sunglasses on my page
  Teo: Followers... 219. Seven! Seven new people!
  Mags [phone]: Pelican Eats rang the park office. Their bag is in your video.
  Teo: A brand deal? How much?
  Mags [phone]: Eight hundred. I said nine. They said eight hundred.
  Teo: I'm a professional. Mags, I'm a PROFESSIONAL.
  Mags [phone]: You're on a motel roof. Take the stairs down.
Result card: "Content Is King" · stamp Delivered · caption "Seven new followers. One is a bot."
```

- **Numbers:** tripods are pickups with a 1.2 m radius. Only Teo can make the three climbs (ledges up to 3.0 m). The ramp is a prop the mission spawns: 6 m long, 1.6 m high, facing east. A miss into the pool costs only the run: step 7 restarts at the ramp. A miss onto the concrete deck at that speed is a knock-out.
- **Followers:** set the counter to 219 on the result card if it is below that.
- **Squawk:** "guy just jumped a scooter over the tideline motel pool and landed on the roof. motel says checkout is still 11"
- **Radio:** Barbara Wetherby: "A man on a scooter cleared the Tideline Motel pool this afternoon. Guests scored the splash at zero."
- **Check:** start, skip all eight steps, expect `mission:completed` with `cash: 800`. One real step: at step 7, `t.spawn('pinfish', { x: -600, z: -62, heading: 90 })`, hold gas 4 s, expect `jump:landed` with `metres >= 12` and the `goto` to complete. The placement check must find every tripod seed on land.
- **Clip:** the pool jump from the side camera in slow motion, the delivery bag flapping, the landing on the walkway roof.

---

### 03 · Repo Woman            id: repo-woman · tier A · chapter 1, act 1

```
Giver: Wendell · Leads: Mags · Where: Tideline, Palma Vieja, Meridian · Length: 6 min · Pays: $1,200 · Unlocks: open-house, repo side jobs (hot-sauce if present)
Needs: missions, phone, vehicle damage, Palma Vieja, Meridian
Start: Wendell on the bench across from Hotel Alba (284, 46), about 300 m by road from the Park & Sons forecourt where mission 1 ends.
Rules: each clock starts when Mags enters the repo car and covers that deliver only. After each delivery a Park & Sons loaner (a white Snook) waits at (352, -222).
1.  say      Wendell hands over three addresses
2a. goto     car 1: a silver Tarpon with a Bellweather Group door decal in the Hotel Alba drop-off (300, 24), r 4, as foot
2b. enter    the Tarpon     hint: "Walk to the door. One button gets you in."
2c. deliver  the Tarpon to the service bay (332, -236), maxDamage 30, timer 150     hint: "Dents cost money. Brake early."
3a. goto     car 2: a Mullet in the alley at (-892, -397), r 4. Text on arrival: "A dog is barking. It knows."     hint: "The loaner is on the forecourt."
3b. enter    the Mullet
3c. deliver  the Mullet to the service bay, maxDamage 30, timer 180
4a. goto     car 3: an orange Wahoo in the Spire drop-off (70, -850), r 4
4b. enter    the Wahoo. Chad runs out of the lobby, fires a pistol at the Wahoo and takes a black Grouper from (84, -862).
4c. deliver  the Wahoo to the service bay with Chad ramming and shooting from his window, maxDamage 60, no timer. Chad stops at the forecourt, where Wendell stands with a clipboard and a shotgun.     hint: "He rams wide. Turn in tight."
Fail: a repo car is destroyed or over its damage limit · a clock runs out · Mags is knocked out
Checkpoints: after 2c, after 3c
Lines:
  [1 say]
  Wendell: Margaret Calloway. Ramming tow trucks. At your age.
  Mags: At my age I've had the practice. Your door says "back in 5".
  Wendell: I've been busy. That son of a bitch Bellweather owes me for forty cars.
  Wendell: Fleet service. Eight months. Not a dollar. So the cars are coming back.
  Mags: You're taking them back.
  Wendell: You're taking them back. I've got a knee. Three today. Bring them in clean.
  Wendell: First one's right there. Silver Tarpon. The valet thinks it's his.
  [2c deliver]
  Mags: Company car. Smells like a pine tree held a meeting in it.
  Wendell [phone]: Under 30 percent, Mags. I can't sell a dent.
  Mags: I drove 31 years without one.
  Wendell [phone]: You drove a bus. Things got out of your way.
  [car 1 delivered]
  Wendell [phone]: Clean. Thirty-nine to go. Loaner's out front. Don't race it.
  [3a goto]
  Wendell [phone]: Number two. Pickup. Alley in Palma Vieja. There's a dog.
  Mags: Is the dog a problem?
  Wendell [phone]: The dog's a talker.
  [3b enter]
  Mags: Good boy. Loud boy. I'm only borrowing it back.
  [3c deliver]
  Teo [phone]: Mags! Are you stealing cars? Without me? Without a CAMERA?
  Mags: Repossessing. There's paperwork.
  Teo [phone]: That's worse! Paperwork doesn't trend!
  Mags: The bed's full of yard signs. "Bayhaven Tomorrow." They're falling out.
  Wendell [phone]: Let them fall. Spread the man's name around.
  [car 2 delivered]
  Wendell [phone]: Two. You always did bring them home straight.
  [4a goto]
  Wendell [phone]: Last one. Orange Wahoo, front of the Spire. His security chief's.
  Mags: A Wahoo. Does it still slide when you look at it?
  Wendell [phone]: Don't look at it.
  [4b enter]
  Chad: HEY! That's my car! Brad! Somebody's in my car! ... Brad's not here. HEY!
  [4c deliver]
  Mags: He's got a Grouper. Two tonnes of opinion.
  Chad [loudhailer]: Pull over or I shoot! That car belongs to Bayhaven Tomorrow!
  Mags: It belongs to whoever paid the mechanic. So far, nobody.
  Mags: He shoots like he parks. Wide.
  Wendell [phone]: Don't fight him. Just get here. I've got the lien on a clipboard.
  [on arrival]
  Wendell: Afternoon, son. Lien. Invoice. Shotgun. Pick one to argue with.
  Chad: Mr. Bellweather's going to hear about this.
  Wendell: I'm counting on it. Tell him thirty-seven to go.
  Wendell: Twelve hundred, Mags. Same split as the old days.
  Mags: In the old days you kept it all.
  Wendell: And you never noticed. There's more work if you want it.
  Mags: Who is Bellweather?
  Wendell: The name on your notice. Go and see what he's building. Mallard Greens.
Result card: "Repo Woman" · stamp Delivered · caption "Three cars home. Thirty-seven to go."
```

- **Step map to `05-content.md`:** 1 is its step 1 · 2a to 2c its step 2 · 3a to 3c its step 3 · 4a to 4c its step 4 · its step 5 is the result card.
- **Numbers:** the garage is 330 m from car 1, 1.4 km from car 2 and 950 m from car 3. Chad's Grouper holds 10 km/h over the player's speed up to 150 km/h, rams from the side, fires a pistol inside 30 m (3 damage to the car a hit; one hit in five reaches Mags for 18), and never enters the service bay. The Mullet drops one yard sign per bump as a light prop (cap 12).
- **Squawk:** "orange wahoo vs black suv all the way down coral boulevard. the grandma is winning"
- **Radio:** Barbara Wetherby: "Three Bellweather Group cars were repossessed today. Shots were fired down Coral Boulevard. A mechanic called it an invoice."
- **Check:** start, skip all ten engine steps, expect `mission:completed` with `cash: 1200` (roadmap check D6.5). One real step: at 2c, `t.spawn('tarpon', { x: 332, z: -200, heading: 180 })`, hold gas 2 s, expect the `deliver` to complete with vehicle health over 70.
- **Clip:** Chad's Grouper shoving the orange Wahoo sideways through Spire Circle, Mags holding the slide, the Spire filling the top of the frame.

---

### 04 · Hot Sauce            id: hot-sauce · tier B · chapter 1, act 1

```
Giver: Rafa · Leads: Mags drives, Teo counts bottles · Where: Palma Vieja · Length: 6 min · Pays: $1,500 · Unlocks: nothing new (open-house is already open)
Needs: missions, Pompano, vehicle damage, Palma Vieja, cutscenes
Start: Rafa's table in Domino Park (-1400, -880), 09:00 to 20:00.
Rule: the bottle meter is the van's damage drawn as bottles. 120 bottles at 0% damage; one breaks per 0.83% of damage. The crate for the coffee window rides on the seat and is not on the meter.
1. cutscene  intro-hot-sauce (cutscenes.md)
2. say       Rafa's job
3. goto      the Lava Abuela kitchen (-1700, -480), r 8
4. enter     the red Pompano at the kitchen door (-1694, -474)     hint: "The bottle meter is the van's health."
5. deliver   the van to Ventanita Rosa (-1020, -640), maxDamage 16 (100 bottles or more). No enemies. Two speed bumps on Calle Dos.     hint: "Slow for bumps. Kerbs break bottles."
6. say       Okafor & Daughters arrive from Avenida Rosa in a green Mullet and a green Pompano, a daughter with a pistol at each passenger window
7. deliver   the van to the Mercado loading bay (-1500, -800), maxDamage 33 (80 bottles or more). Both green vehicles ram from the sides and shoot until the bay; each bullet that hits the van breaks one bottle.     hint: "Let them miss. Brake, then go."
8. say       Hector signs for the crates
Fail: fewer than 80 bottles · the van is destroyed · Mags is knocked out
Checkpoints: after 4, after 6
Lines:
  [1 cutscene]
  Rafa: Sit. You're the one who rammed the tow truck.
  Rafa: I have a van of my mother's hot sauce. It needs to reach the Mercado.
  Mags: That's a delivery.
  Rafa: That's a delivery with enemies. The kid carries my small packages. Today he rides.
  [2 say]
  Rafa: Lava Abuela. 120 bottles. My mother counted them. She will count them again.
  Teo: Who has hot sauce enemies?
  Rafa: Okafor and Daughters. They make one called Heat Advisory. It's fine. It's FINE.
  Rafa: That shelf moves more than sauce, and they want it. Eighty bottles keeps it.
  Rafa: Seventy-nine gets me a talk with my mother.
  Mags: First stop?
  Rafa: Ventanita Rosa. One crate for the window. Then the Mercado. Gently, Mags.
  [4 enter]
  Teo: It smells amazing in here. My eyes are closing on their own.
  Mags: Don't touch your face.
  Teo: I touched my face.
  [5 deliver]
  Teo: 120. 120. 120. Speed bump! 118.
  Mags: I saw it.
  Teo: You saw it at speed!
  [at the window]
  Teo: One crate for the window. The coffee lady says thanks. She gave me a tiny cup.
  [6 say]
  Teo: Green pickup. Green van. They match. Why do they match?
  Okafor [loudhailer]: Good morning! That's our shelf you're driving to!
  Daughter [loudhailer]: Dad, don't say good morning! We're shooting at them!
  Okafor [loudhailer]: You can shoot and have manners, sweetheart.
  [7 deliver]
  Teo: They're shooting the sauce! 96! 91! Who the fuck shoots sauce?
  Mags: They're in a pickup. I'm in a van full of glass. Physics has a favourite.
  Daughter [loudhailer]: Try the mild! We call it mild for a reason!
  Teo: Mags, the murals are going by really fast.
  Mags: Then they're doing their job. Hold the crates.
  Okafor [loudhailer]: Nothing personal! We love your mother's work!
  Teo: 84! 83! Mags! 83!
  Mags: I can count, Teo. I counted children for 31 years.
  [8 say]
  Hector: Eighty and change. All upright. Rafa said a grandmother was driving. I said good.
  Teo: We made it! I'm crying! Is it joy or is it the sauce?
  Mags: It's the sauce.
  Rafa [phone]: The shelf is mine. My mother says the driver may have a bottle. One.
  Rafa [phone]: Mags. Whoever sent your notice is buying Calle Mural too. Come back.
Result card: "Hot Sauce" · stamp Delivered · caption "Handle with care. They did not."
```

- **Numbers:** the kitchen to the window is 850 m, the window to the Mercado 650 m. The green Mullet rams every 6 to 9 s, the green Pompano every 10 to 14 s. Each takes two side-swipes from the red van before it spins out for 8 s; a third wrecks it, and the crew shoots on from the kerb. Neither follows into the loading bay, where Hector's porters are armed too.
- **Squawk:** "two green trucks chasing a red van past the mural wall and the whole street smells like lunch"
- **Radio:** Barbara Wetherby: "A sauce delivery in Palma Vieja became a running gunfight this morning. This station can confirm it was spicy."
- **Check:** start, skip all eight steps, expect `mission:completed` with `cash: 1500`. One real step: at step 7, set the van's health to 60 and drive it into the bay; the mission must fail with `mission:failed`. Then retry from the checkpoint at health 90 and expect the `deliver` to complete. Every marker must be reachable by road.
- **Clip:** the red van threading between the two green trucks along the mural wall, the bottle meter ticking down in the corner.

## New names

| Name | What it is | Tier |
|---|---|---|
| Heat Advisory | The hot sauce made by Okafor & Daughters, the rival of Lava Abuela. A weather pun. Seen on their green Mullet and Pompano. | B |
