# Bible · story · Chapter 1, act 3: Storm Warning

Full scripts for missions 11 to 16. A hurricane is coming and so is launch night at the Spire. Teo lifts Bellweather's key card on Tripp's yacht, the binder reaches the radio, Mags races for the first time in 35 years, and the two of them rehearse the getaway. Mission 11 is fixed by `05-content.md` and matched step for step.

Tier: A (mission 11) · B (missions 13, 14 and 15) · C (missions 12 and 16)

## How to read a script

- Steps use only the fifteen step types. In mission 11 the numbers are the step numbers in `05-content.md`; a letter (5a, 5b) splits one into engine steps in the same order.
- Field words are from `bible/tech/schemas.md`: `r`, `as`, `timer` (seconds), `maxDamage` (percent), `subject`, `flag`, `to`. Seeds are `(x, z)`; `y` is height above the ground or the water.
- Hints name the action; the UI adds the key. 60 characters or fewer.
- Lines are grouped by step and play in order; a bracket line is a trigger. `[phone]`, `[radio]` and `[loudhailer]` pick the voice filter. `Chat` lines go to the LIVE chat, `Rucker` lines to the ticker. 90 characters or fewer.
- Finishing a mission offers the next id in story order that exists in the build. The A chain is 1, 3, 5, 7, 11, 18, 20.
- Armed enemies use the weapons in `04-systems.md` section 8 and shoot to kill. At zero health a lead is Knocked out and the mission restarts from its checkpoint.
- Squawk posts are lower case on purpose.

## Act 3 at a glance

| # | id | Tier | You play | Start seed | Minutes | Pays |
|---|---|---|---|---|---|---|
| 11 | `yacht-rock` | A | Teo, then Mags | `(-1150, 70)` | 8 | $12,000 |
| 12 | `paint-it-pink` | C | Teo | `(1180, -1180)` | 7 | $7,000 |
| 13 | `the-binder` | B | Mags | `(-1250, -220)` | 7 | $15,000 |
| 14 | `speedbowl` | B | Mags | `(2700, -1850)` | 8 | $10,000 |
| 15 | `dry-run` | B | Teo, then Mags | `(60, -700)` | 6 | $4,000 |
| 16 | `hurricane-party` | C | Mags | `(-1400, -880)` | 8 | $9,000 |


---

### 11 · Yacht Rock            id: yacht-rock · tier A · chapter 1, act 3

```
Giver: June · Leads: both, with switching · Where: Yacht Club Bayhaven, Tideline · Length: 8 min · Pays: $12,000 · Unlocks: the-spire-job when only A missions exist, otherwise the next in story order
Needs: missions, cutscenes, switch, stealth, phone camera, Skipjack, Skimmer, the King Tide landmark
Start: June's marker at the yacht club gate (-1150, 70). The mission sets Saturday, 21:00, clear. The King Tide lies along the outer dock, bow (-1235, 128), stern (-1175, 128), decks at y 2.5, 5 and 9.
1.  cutscene  switch-intro (cutscenes.md): Teo at the gangway (-1205, 118), Mags at the fuel dock (-1290, 100)
2.  goto      as Teo: the top deck (-1215, 126) y 9, r 3, as foot, through the party without bumping three armed guards (Chad, Brad and one more). A bump adds 34% to the "Who is this guy" bar; it drains 5% a second.     hint: "Walk. Go round people, not through."
3.  photo     subject: bellweather-kiki, together at the top-deck rail, r 8, for June     hint: "Camera. Both of them in one frame."
4.  collect   item: key card, from Bellweather's white jacket on a deck chair (-1222, 127) y 9
5a. switch    to: mags
5b. enter     the Skipjack at the fuel dock (-1290, 100)
5c. goto      under the stern (-1172, 132), r 6, as vehicle, timer 40. The way is out past the bow and back in: 150 m.     hint: "Boats turn late. Start the turn early."
6a. switch    to: teo
6b. goto      the Skipjack's deck, by a jump from the stern rail (-1174, 128) y 5, r 3. Chad and Brad are 6 s behind, shooting.     hint: "Run at the rail and jump."
7.  survive   as Mags (lead: mags; the lead changes as Teo lands, with no swoop): 75 s of boat chase with two security Skimmers, Chad and Brad, firing SMGs. Pass under the Sandpiper Bridge at (-1100, 280) and stay east of it. At 75 s both Skimmers run dry.
Fail: the bar fills (the guards draw) · the clock runs out in 5c · Teo is knocked out · the Skipjack is destroyed
Checkpoints: after 4, after 6b
Lines:
  [1 cutscene]
  June: Lanyard. You're "talent". Don't dance, don't pitch, don't talk to Tripp.
  Teo: Who's Tripp?
  June: It's his yacht. He won't know that either.
  June: Bellweather's key card is in his jacket. White jacket. It opens his vault.
  Teo: And Mags?
  Mags: Fuel dock. I told security I'd top up their jet skis. Helpful old lady.
  Mags: When you have the card, go to the stern and jump. I'll be under it.
  Teo: Jump off a yacht. In the dark. Onto a boat. Fuck.
  Mags: Feet first.
  [2 goto]
  Teo: June and I used to stream together. She got famous. I got a scooter.
  Mags [radio]: And now she works for Kiki Halcyon and wants out. Keep walking.
  Tripp: Heyyy, it's the DJ! Love your work. Whose party is this?
  Teo: Yours, I think.
  Tripp: No way. Am I having a good time?
  [on a bump]
  Brad: Who's this guy? ... Who is this guy?
  Teo: Talent! I'm talent. See the lanyard? It says talent.
  [3 photo]
  Kiki: You. Talent. Tio? Theo? Hold my ring light.
  Teo: It's Teo. Nine million followers and she didn't look at me once.
  Kiki: Gordy, smile like you mean it. Launch night is content. Everything is content.
  Bellweather: After launch night there's no trailer park. Just a view. Smiling is easy.
  June [phone]: That's the photo. That's my way out. Now the card.
  [4 collect]
  Teo: White jacket. On a chair. Nobody near it. Guards trust furniture.
  [5c goto]
  Mags: Forty seconds. Out past the bow and back in. Like the school car park at three.
  [6b goto]
  Chad: Shit, the jacket! YOU. Lanyard! Brad, shoot the lanyard guy!
  Teo: They're shooting! Mags, tell me you're fucking there!
  Mags [radio]: I'm here. Jump.
  Teo: I can't see you!
  Mags [radio]: Good. Neither can they. Jump.
  [7 survive]
  Teo: They're gaining! And shooting! At a boat full of fuel cans!
  Mags: They are. On a quarter tank each. I filled them myself.
  [at 75 s]
  Brad: Chad? I'm slowing down. Are you slowing down?
  Chad: I'm not slowing down, I'm... yeah. I'm slowing down.
  [after the chase]
  Mags: Launch night. He'll be on his roof with the whole town. And a storm coming in.
  Mags: Nobody watches the service door in a storm.
Result card: "Yacht Rock" · stamp Delivered · caption "One jacket lighter."
```

- **Step map:** 1 to 4 and 7 are the steps in `05-content.md`; 5a to 5c are its step 5; 6a and 6b its step 6 ("Jump").
- **Numbers:** 40 slow-walking guests on three decks. The Skimmers hold 5 km/h over the Skipjack's speed and fire in bursts inside 40 m.
- **Squawk:** "someone just jumped off the king tide into a speedboat driven by a grandma. the party did not notice"
- **Radio:** Barbara Wetherby: "Gunfire off Sandpiper Isle last night ended when two security jet skis ran out of fuel. A pedal boat towed them home."
- **Check:** skip all ten engine steps: `mission:completed`, `cash: 12000`, three `player:switched` events (roadmap check D7.5). Real step: at 5c, an input script drives from the fuel dock; the `goto` completes inside 40 s.
- **Clip:** Teo's leap off the stern into the dark, muzzle flashes at the rail above, the Skipjack sliding under him.

---

### 12 · Paint It Pink            id: paint-it-pink · tier C · chapter 1, act 3

```
Giver: June · Leads: Teo · Where: The Paintworks · Length: 7 min · Pays: $7,000 · Unlocks: the-binder if present
Needs: missions, climbing, stealth, drones (simple flying chasers), pool noodle, phone camera, The Paintworks
Start: June's loft (1180, -1180). The mission sets the hour to 22:00. Night hours last 45 s, so 05:00 is 5 min 15 s away.
1. say      June's plan, on the loft's fire stairs
2. collect  item: paste kit, count 1, on the loft roof (1186, -1172) y 9: a bucket, a brush, five rolls and June's pool noodle     hint: "Climb the fire stairs, then the ladder."
3. collect  item: billboard, count 3, any of the five: over the food-truck yard (1010, -1090) y 8 · the end of Wet Paint Alley (1120, -640) y 7 · Humidity's roof (1440, -930) y 12 · Container Row (1520, -520) y 10 · the middle chimney of the paint factory (1300, -800) y 22. Hold interact for 4 s on the catwalk to paste. One drone follows.     hint: "Stay out of the drone's light."
4. say      Chad on a drone's speaker; two more drones launch
5. collect  item: billboard, count 2, the two that are left. Three drones follow.     hint: "Two noodle hits drop a drone."
6. photo    subject: chimney-billboard, the pink billboard on the chimney with the Spire behind it, from the roof at (1330, -700) y 9, r 6
7. goto     the food-truck yard (1000, -1100), r 8, as foot, with no drone light on Teo for the last 5 s
8. say      June posts it
Fail: 5 s in a drone's light is a "spotted", which brings 10 s of rifle fire from the security truck below; three is a fail · Teo is knocked out · 05:00 arrives
Checkpoints: after 2, after 4
Lines:
  [1 say]
  June: Five billboards. All his. By morning they say something else.
  Teo: What do they say?
  June: "Pelican Rest stays." In pink. I designed it at work. On her laptop.
  Teo: You're good at this.
  June: I was always good at this. You were the one who talked.
  June: His drones find you. His men shoot what the drones find. Don't be found.
  [3 collect]
  Teo: Paste, rolls, brush. Chat, tonight is arts and crafts. At height.
  Teo: One up! It's the pinkest thing in the Paintworks. And that's a contest.
  Mags [phone]: I can see it from the expressway. It's crooked.
  Teo: It's art!
  Mags [phone]: It's crooked art. Left corner.
  [4 say]
  Chad [loudhailer]: Attention, vandal. Private advertising. You're on camera. And in range.
  Teo: I'm always on camera! That's my whole thing!
  Chad [loudhailer]: Brad, launch the other two. No. The OTHER other two.
  [5 collect]
  Teo: Three drones. One pool noodle. I like my odds.
  [on a drone down]
  Teo: Got one! It went in a paint vat. It's a pink drone now.
  June [phone]: Save the chimney for last. It faces the Spire. He'll see it from his desk.
  Teo: That's a long fucking way up, June.
  June [phone]: You climbed my fire stairs for two years to borrow a charger.
  [6 photo]
  Teo: Last one's up. Pink billboard, his tower right behind it. Hold that... got it.
  [8 say]
  June: Posted. From an account that isn't mine. Forty thousand views already.
  Teo: Forty thou... June, that's more than I've had in my whole life.
  June: I know. I checked. Come on. I'm buying you a sandwich.
  Teo: Like old times?
  June: In old times you never paid. So, yes.
Result card: "Paint It Pink" · stamp Delivered · caption "Pelican Rest stays."
```

- **Numbers:** a drone flies at 9 m/s, 6 m up, with a 5 m circle of light. It has 16 health (two noodle hits) and returns after 30 s. Awnings block the light. The security truck is a Mullet with two riflemen who cannot climb.
- **Squawk:** "woke up and every bayhaven tomorrow billboard in the paintworks is pink and says pelican rest stays. no notes"
- **Radio:** Barbara Wetherby: "Five billboards for Bayhaven Tomorrow were redecorated overnight. The Bellweather Group calls the new message off brand."
- **Check:** skip all eight steps: `mission:completed`, `cash: 7000`. Real step: at step 3, teleport Teo to three catwalks and hold interact for 4 s each; the count reaches 3.
- **Clip:** Teo on the chimney catwalk swatting a drone into a paint vat with a pool noodle, rifle fire sparking off the rail, the pink billboard unrolling.

---

### 13 · The Binder            id: the-binder · tier B · chapter 1, act 3

```
Giver: Barbara · Leads: Mags drives, Teo holds the binder · Where: Meridian and the Bayline Expressway · Length: 7 min · Pays: $15,000 · Unlocks: speedbowl if present
Needs: missions, heat 3, the LIVE overlay, the expressway deck, news vans, the radio building
Start: a phone call at lot 9 (-1250, -220), any hour.
1. say      Barbara rings
2. enter    the Heron at the carport (-1256, -226), with the binder aboard
3. goto     Sixth Street outside Bayhaven Public Radio (-420, -830), r 10. Three BHTV 6 news vans (Pompanos) and a cruiser are parked there.
4. heat     reach 3 (the mission sets it as the vans pull out)
5. goto     the top of the expressway ramp (-900, -1480), r 10, level 1
6. survive  90 s on the deck at heat 3 or more; leaving the deck pauses the clock. Cruisers behind shoot at the tyres. The vans try to drive alongside. A van level with the Heron for 5 s fills a third of the "Binder on camera" bar.     hint: "Brake hard and they overshoot."
7. heat     clear     hint: "Leave at Exchange Avenue. Park under the deck."
8. deliver  what: the binder, to: the station's back door (-430, -870), r 4, with heat at 0
9. say      Barbara reads the first page
Fail: the bar fills (the Sheriff reads the binder on air first) · the Heron is destroyed · Mags is knocked out
Checkpoints: after 2, after 6
Lines:
  [1 say]
  Barbara [phone]: Ms. Calloway. Barbara Wetherby, public radio. I hear you have a binder.
  Mags: Who told you?
  Barbara [phone]: A source of mine. And half the town. I'd like to read it on air.
  Barbara [phone]: Bring it to the station. Not the front. There are cameras on my doorstep.
  Teo: The Sheriff's cameras?
  Barbara [phone]: He'd love to show it first. With his own captions.
  [2 enter]
  Mags: Binder on your lap. Cover down. If a lens sees a page, he reads it before she does.
  [4 heat]
  Rucker: Marlin County, we are LIVE outside public radio, and... there she is! Roll!
  Mags: They were waiting. So we take them for a drive.
  [6 survive]
  Mags: Ninety seconds up here. They film through the window. So they don't get the window.
  Rucker: Camera two, get alongside! I want to see what's in grandma's lap!
  Rucker: Deputies, shoot the tyres! Not the binder! I need that binder legible!
  Teo: Van on the right! He's got a lens the size of a bin!
  Mags: Brake.
  Teo: Brake?! They're shooting and you want to BRAKE?!
  Mags: He can't film what's behind him.
  Rucker: She's ducking my cameras. That's... doggone it, that's good television.
  Chat: SHOW THE BINDER
  Teo: Chat wants to see it! I've never had something people wanted!
  Mags: Keep it that way for forty more seconds.
  [7 heat]
  Mags: Off at Exchange. Under the deck. Lights out.
  [9 say]
  Barbara: Back door. Quickly. ... Oh, this is tidy. Forged, but tidy.
  Barbara: A list of forged deeds is a story, Ms. Calloway. The deeds are proof.
  Mags: The deeds are in his tower.
  Barbara: Then I'll read the list tonight. And keep a slot open for the rest.
Result card: "The Binder" · stamp Delivered · caption "Three rings. One broadcast."
```

- **Numbers:** the deck is 3.1 km from the ramp at `x = -900` to the one at `x = 2200`. Vans hold 125 km/h and take 2 s to match a speed change. The bar never drains.
- **Squawk:** "grandma brake-checked three news vans on the expressway and @BayhavenBlue still didn't get the shot"
- **Radio:** Barbara Wetherby: "Tonight on this station: pages from a homeowners' association binder. The Sheriff's office says it saw them first. It did not."
- **Check:** skip all nine steps: `mission:completed`, `cash: 15000`. Real step: at step 6, `t.setHeat(3)` and `t.drive('route:deck-30')` three times; the clock runs only while `player.level === 1`.
- **Clip:** the Heron braking hard on the expressway as a news van sails past, its camera pointing at empty road.

---

### 14 · Speedbowl            id: speedbowl · tier B · chapter 1, act 3

```
Giver: Wendell · Leads: Mags · Where: the Speedbowl, Runway Flats · Length: 8 min · Pays: $10,000 · Unlocks: dry-run if present
Needs: missions, races, the Speedbowl, Wahoo, Hogfish, cutscenes
Start: the infield garage (2700, -1850). The mission sets Friday, 19:00, clear.
1. cutscene  intro-speedbowl (cutscenes.md)
2. say       Wendell, in the garage
3. enter     the number 9 car at (2694, -1846): a stock Wahoo in faded pink with a white 9
4. goto      grid slot 8 on the front straight (2660, -1728), r 3, as vehicle
5. collect   item: lap, count 5. A lap counts at the start line (2700, -1728) after the back-straight gate (2700, -1972). Seven rivals. The number 1 car, in Bayhaven Tomorrow colours, leads at 150 km/h.     hint: "High line into the turn. Low line out."
6. say       halfway, on the pit radio (the race does not pause)
7. collect   item: lap, count 5. The number 1 car blocks the low line on the last two laps and swerves at any car alongside; the wall at 150 km/h destroys a car.     hint: "He blocks low. Go round the outside."
8. say       the hauler's keys
9. enter     the Park & Sons hauler at the paddock gate (2480, -1850): a Hogfish in the same faded pink
Fail: the number 1 car finishes lap 10 first · the number 9 car is destroyed · Mags is three laps down
Checkpoints: after 4, after 6
Lines:
  [1 cutscene]
  Wendell: Kept her under a tarp. Thirty-five years. Turned her over every Sunday.
  Mags: You kept the 9.
  Wendell: Somebody had to. You were busy driving the other 9.
  [2 say]
  Wendell: The track's held our hauler since we quit. Thirty-five years of storage charges.
  Wendell: Promoter says win tonight's feature and the charges go away. Ten laps. Seven cars.
  Mags: I haven't raced since I was 26.
  Wendell: You haven't crashed since, either. That's all racing is. Fast not-crashing.
  Teo [phone]: I'm in the stands! I bought a foam finger! It's huge! It's for you!
  [4 goto]
  Announcer: In the number 9... is this right? Mags Calloway? THE Mags Calloway?
  Mags: Seat's still set for me.
  Wendell [radio]: I never let anyone move it.
  [5 collect]
  Wendell [radio]: Green flag. Stay high in one and two. She's loose on cold tyres.
  Announcer: Big one in turn three! Car 14's on fire! ... He's out. He's out, folks.
  Mags: He lifts early.
  Wendell [radio]: He's got a sponsor to keep clean. You've got a bumper.
  [6 say]
  Announcer: Halfway! Calloway's third, and she's driving like the bus is late!
  [7 collect]
  Wendell [radio]: Two to go. He'll block low. He put a kid in the wall that way last year.
  Mags: Then I'll go where a bus goes. Wide, and all at once.
  [on the pass]
  Announcer: Outside! She's gone round the outside! Nobody goes outside here!
  [on the win]
  Announcer: Calloway wins! Thirty-five years between victories! Somebody check a calendar!
  [8 say]
  Wendell: Hauler's ours again. Lift, welder, winch. All still in it.
  Mags: Good. I've got a bus that needs to go wading.
  Wendell: ...I'm not going to ask.
  Mags: You're going to help.
  Wendell: I'm going to help.
Result card: "Speedbowl" · stamp Delivered · caption "Number 9. Still on time."
```

- **Numbers:** a lap is about 1,085 m; ten take about 4 min 20 s. Rivals run 138 to 150 km/h, and a wrecked car burns where it stops. The hauler's lift, welder and winch storm-proof the bus before mission 18.
- **Squawk:** "a 61 year old just won the friday feature at the speedbowl round the outside. i need to sit down"
- **Radio:** Barbara Wetherby: "Mags Calloway won at the Speedbowl last night, 35 years after her last start. She declined the trophy and asked for the truck."
- **Check:** skip all nine steps: `mission:completed`, `cash: 10000`. Real step: at step 5, an input script completes one lap; the count reaches 1.
- **Clip:** the last corner of lap 10: the faded pink number 9 goes round the outside of the polished number 1 car, grandstand phones up.

---

### 15 · Dry Run            id: dry-run · tier B · chapter 1, act 3

```
Giver: Mags · Leads: both, with switching · Where: Meridian to Gullwing Pier · Length: 6 min · Pays: $4,000 · Unlocks: hurricane-party if present, else the-spire-job
Needs: missions, phone camera, switch, choice, Manatee, mission flags kept in the save
Start: Mags's Heron, parked on Coral Boulevard (60, -700), 09:00 to 17:00.
1. say      the plan, on the walk up to Spire Circle (52, -837)
2. photo    as Teo. subject: spire-dock, the service dock on Tower Way (60, -985), from (120, -1010), r 6. Two armed guards at the dock challenge inside 30 m and shoot inside 15 m.     hint: "Three photos: door, cradle, roof."
3. photo    subject: spire-cradle, the window-cleaning cradle on the east face, from (150, -900), r 6
4. photo    subject: spire-roof, the roof garden, from Spire Circle (52, -837), r 8, zoomed in
5. switch   to: mags
6. choice   flag: route, one of three (table below)
7. enter    the Manatee at the service dock (60, -985)
8. deliver  the Manatee to the pier gate at Pier Road (600, 37), r 10, by the chosen route, timer: its par, maxDamage 40. Route gates are 25 m wide; a missed gate adds 10 s.     hint: "Brake before the turn. A bus turns late."
9. say      the time
Fail: the clock runs out · the bus is destroyed · heat reaches 2 · Teo is knocked out
Checkpoints: after 4, after 7
Lines:
  [1 say]
  Mags: Launch night. He's on the roof, the town's on the roof, the storm's on its way.
  Mags: You go up the outside. I hold the door at the bottom. Today we only look.
  Teo: Recon! I fucking love recon. I've never done recon.
  [2 photo]
  Teo: Service dock. Roller door. One camera. Two guards. Guns. Actual guns.
  Mags: On the night they'll be upstairs holding a tent. Is the door bus height?
  Teo: ...Why would it need to be bus height?
  Mags: Photo, Teo.
  [3 photo]
  Teo: Scaffolding up the podium. Then that cradle. Window cleaners ride it.
  Mags: Does it go to the top?
  Teo: All the way. It's swinging a bit. It's not even windy yet.
  [4 photo]
  Teo: Roof garden. That's the party. The glass box behind the palms is his vault.
  [6 choice]
  Mags: My part. This door to the pier. The Sheriff's signal runs off the wheel out there.
  Teo: How do you know that?
  Mags: Thirty-one years on that road. I know what goes dark first in a storm.
  Mags: Three ways down. Pick one, and we drive it till it's boring.
  [choice: exchange]
  Mags: Exchange Avenue. Shortest. Narrow. I like narrow.
  [choice: paintworks]
  Mags: Round by the Paintworks. Long, but wide. Nobody boards up a warehouse.
  [choice: commerce]
  Mags: Commerce Way. Four turns. A bus hates turns. So does a cruiser.
  [7 enter]
  Teo: This is a city bus. Mags. Did you borrow a city bus?
  Mags: I have a key. They never asked for it back.
  [8 deliver]
  Mags: Sit behind the yellow line.
  [9 say]
  Teo: Under par! Is that good?
  Mags: It's dry. On the night, add water, wind and the Sheriff. Same road. No surprises.
  Teo: There are always surprises.
  Mags: Then that's the plan for the surprises.
Result card: "Dry Run" · stamp Delivered · caption "Same road. Add water."
```

| `route` value | Button text | Gates, from the dock `(60, -985)` to the pier gate `(600, 37)` | Length | Par |
|---|---|---|---|---|
| `exchange` (the default) | Exchange | `(692, -997)` · `(692, 37)` · `(600, 37)` | 1.8 km | 130 s |
| `paintworks` | Paintworks | `(1012, -997)` · `(1012, 37)` · `(600, 37)` | 2.4 km | 165 s |
| `commerce` | Commerce | `(372, -997)` · `(372, -677)` · `(692, -677)` · `(692, 37)` · `(600, 37)` | 1.8 km | 135 s |

- **Why the pier:** every route meets Heron Walk Drive east of Pier Road, so the bus always passes the pier, where mission 18 clears its heat. Mission 18 reads `flags.route` and uses `exchange` when it is missing.
- **Squawk:** "why is a city bus doing laps from the spire to the pier with nobody on it. third time today"
- **Radio:** Barbara Wetherby: "A city bus was seen today on a route that is on no timetable. Transit says the driver seemed to know what she was doing."
- **Check:** skip all nine steps once per route value: `mission:completed`, `cash: 4000`, `missions.flag('route')` equal to the pick. Real step: at step 8 with `exchange`, a route-follower drive reaches the pier gate inside 130 s.
- **Clip:** the empty Manatee leaning through the turn onto Heron Walk Drive, the pier's wheel turning behind it.

---

### 16 · Hurricane Party            id: hurricane-party · tier C · chapter 1, act 3

```
Giver: Rafa · Leads: Mags · Where: Palma Vieja and Northgate · Length: 8 min · Pays: $9,000 · Unlocks: evacuation-route if present, else the-spire-job
Needs: missions, stealth, heat 1 and 2, Hogfish, tropical storm weather, Northgate, the expressway
Start: Rafa's table in Domino Park (-1400, -880). The mission sets the weather to tropical storm: wet roads, grip 0.8, wind that pushes light vehicles.
1. say      Rafa's job, under a tarp in the rain
2. goto     the loading dock of Galleria Flamingo (-200, -2000), r 8
3. collect  item: cable, count 3: the power cables from the generator truck into the showroom wall at (-236, -2036), (-232, -2030) and (-226, -2034), as foot. stealth: 1 armed guard, 14 m cone, who looks up from his screen every 8 s.     hint: "Move when he looks at his screen."
4. enter    the generator truck at (-230, -2040): a yellow Hogfish
5. heat     reach 2 (the mission sets it as the truck leaves the dock; the guard fires at the truck)
6. heat     clear     hint: "Under the expressway. Engine off."
7. deliver  the truck to the Mercado (-1500, -800), maxDamage 50. 2.6 km by the ramp at x = -900.     hint: "She leans in the wind. Slow before turns."
8. say      the lights come on
Fail: spotted three times · the truck is destroyed or over 50% damage · Mags is booked or knocked out
Checkpoints: after 2, after 4
Lines:
  [1 say]
  Rafa: Storm's two days out. The Mercado is the shelter for the whole street. No power.
  Rafa: The city owns one generator truck. Guess where the city parked it.
  Mags: Not at the hospital.
  Rafa: At the Galleria. A councilman got a condo. The showroom got the truck.
  Teo [phone]: A showroom needs emergency power?
  Rafa: The model condo has a fountain. So. Borrow me the truck.
  [3 collect]
  Mags: Three cables. One guard. He's watching a screen.
  Teo [phone]: What's on the screen?
  Mags: Me, in a minute.
  Mags: One. The fountain's stopped.
  Mags: Two. There go the chandeliers.
  Guard: Hello? Is somebody... the tiny waterfall's off. Why is the tiny waterfall off?
  Mags: Three.
  [4 enter]
  Mags: A Hogfish with a power station on its back. Six tonnes before breakfast.
  [5 heat]
  Guard [radio]: Control, she's taking the generator! Shots fired! By me! She waved!
  Teo [phone]: Two lights. The scanner is calling it "theft of public spirit".
  [6 heat]
  Mags: This truck hums. Hard to be dull in a truck that hums.
  Teo [phone]: Under the expressway at the west ramp. Engine off. I'll say when they yawn.
  [7 deliver]
  Mags: Wind's picking up. She leans.
  [8 say]
  Rafa: Back it in. There. Hector, the cable!
  Hector: Lights! Freezers! The radio! ... The radio's playing my least favourite song.
  Rafa: The whole street is lit, Mags. My mother says you may have two bottles.
  Mags: Tell her I'll collect after the storm.
  Rafa: You're staying in town for it?
  Mags: I have an appointment. Top floor.
Result card: "Hurricane Party" · stamp Delivered · caption "Borrowed in the public interest."
```

- **Numbers:** each cable takes 2 s of interact. With the third out the showroom stays dark for the rest of the game. At the Mercado, every street light in La Plaza comes on.
- **Squawk:** "the bayhaven tomorrow showroom at the galleria just went dark and palma vieja just lit up. coincidence"
- **Radio:** Barbara Wetherby: "The city's emergency generator has turned up in Palma Vieja, powering a market. Officials say it is, technically, an emergency."
- **Check:** skip all eight steps: `mission:completed`, `cash: 9000`. Real step: at step 6, `t.setHeat(2)`, teleport the Hogfish under the deck at `(-900, -1480)`, level 0; the `heat` step completes by itself within 20 s.
- **Clip:** the yellow generator truck backing into the Mercado in the rain as Palma Vieja's lights come on block by block.

## New names

None. The three route labels come from canon roads and a canon district.
