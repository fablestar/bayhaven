# Bible · story · Chapter 1, act 4: Landfall

Full scripts for missions 17 to 20. The storm hits on launch night. Mags drives into town against the evacuation, Teo climbs the outside of the Spire for the forged deeds while Mags holds the dock with a bus, the Sheriff's own cameras show the proof to the county, and the morning after a clip of Mags parking goes viral. Missions 18 and 20 are fixed by `05-content.md`, matched step for step, and read correctly when only the A missions exist.

Tier: A (missions 18 and 20) · B (mission 19) · C (mission 17)

## How to read a script

- Steps use only the fifteen step types. In A missions the numbers are the step numbers in `05-content.md`; a letter (3a, 3b) splits one into engine steps in the same order.
- Field words are from `bible/tech/schemas.md`: `r`, `as`, `timer` (seconds), `maxDamage` (percent), `to`, `flag`, `onEnd`. Seeds are `(x, z)`; `y` is height above the ground.
- Hints name the action; the UI adds the key. 60 characters or fewer.
- Lines are grouped by step and play in order; a bracket line is a trigger. `[phone]`, `[radio]` and `[loudhailer]` pick the voice filter. `Chat` lines go to the LIVE chat, `Rucker` lines to the ticker. 90 characters or fewer.
- `(optional: needs <id>)` lines play only when that mission is in the build and finished. Every other line in missions 18 and 20 leans only on missions 1, 3, 5, 7 and 11.
- Finishing a mission offers the next id in story order that exists in the build. The A chain is 1, 3, 5, 7, 11, 18, 20.
- Armed enemies use the weapons in `04-systems.md` section 8 and shoot to kill. At zero health a lead is Knocked out and the mission restarts from its checkpoint.
- Squawk posts are lower case on purpose.

## Act 4 at a glance

| # | id | Tier | You play | Start seed | Minutes | Pays |
|---|---|---|---|---|---|---|
| 17 | `evacuation-route` | C | Mags | `(-400, -2980)` | 6 | $12,000 |
| 18 | `the-spire-job` | A | Mags and Teo, switching | `(-1256, -226)`, then `(332, -236)` | 12 | $250,000 |
| 19 | `eye-of-the-storm` | B | Mags | `(0, 37)` | 9 | $60,000 |
| 20 | `going-viral` | A | Mags | `(0, 37)` | 3, plus credits | $0 and 2,000,000 followers |

## How the last night fits together

| Question | Answer |
|---|---|
| Where does the bus come from? | The Park & Sons service bay `(332, -236)`, with plywood, a snorkel and a bull bar. Mission 17 brings it there; otherwise the landfall cutscene shows it ready. |
| Which way home in mission 18? | `flags.route` from mission 15, or `exchange` when it is missing: east on Tower Way, south down Exchange Avenue at `x = 692` to `(692, 37)`, west past Pier Road `(600, 37)`. Every route passes the pier. |
| Where does mission 18 stop? | At the pier gate `(600, 37)`. The objective says Pelican Rest, but the broadcast fails at the pier, heat clears, and the ending parks the bus at the plaza `(0, 37)`. Mission 20 drives the last 1.5 km. |
| How does the proof get out? | In the ending Teo sends photos of every deed to Barbara Wetherby. The A chain needs no more. With mission 19 the originals reach her too. |
| And with mission 19 in the build? | Ending shots 1 to 5 (night), mission 19, ending shots 6 to 8 (morning), mission 20. |
| What is the $250,000? | A bag in the vault marked "Fines": forty years of the association's lawn fines. |

---

### 17 · Evacuation Route            id: evacuation-route · tier C · chapter 1, act 4

```
Giver: Mags · Leads: Mags (Teo is on the phone) · Where: Mudcat Glades, Route 44, Meridian, Tideline · Length: 6 min · Pays: $12,000 · Unlocks: the-spire-job
Needs: missions, Manatee, traffic running against the player, heat 1, Bus Driver Voice, tropical storm weather, Route 44
Start: Big Earl's (-400, -2980), where Mags has just dropped the neighbours. The mission sets 16:00 and tropical storm.
1. say      at Big Earl's with Gus, then Teo on the phone
2. enter    the empty Manatee at (-392, -2990)
3. goto     the Route 44 junction on Mudcat Road (700, -3000), r 12, as vehicle
4. goto     the expressway interchange (700, -1500), r 12, timer 150. All four lanes of Route 44 run north: traffic density 2.0, every car coming at the bus. 1.5 km. A head-on over 60 km/h wrecks the car and costs the bus 15.     hint: "Use the shoulder. Sound the horn."
5. heat     reach 1 (the mission sets it: a deputy at the interchange barrier lights up and levels a shotgun)
6. heat     clear. Bus Driver Voice makes his cruiser pull over.     hint: "Horn is the Bus Driver Voice. Then hide."
7. deliver  the Manatee to the Park & Sons service bay (332, -236), maxDamage 70. Coral Boulevard is flooded 0.3 m deep south of Commerce Way; Sandbar Avenue is clear.     hint: "Deep water is slow water."
8. say      Wendell and the storm kit
Fail: the clock runs out in step 4 (the barriers close) · the bus is destroyed or over 70% damage · Mags is booked or knocked out
Checkpoints: after 3, after 6
Lines:
  [1 say]
  Gus: Sixty neighbours inside one concrete alligator. He's rated for worse.
  Mags: Keep them in the belly. Not the tail. The tail leaks.
  Gus: How do you know the tail leaks?
  Mags: Field trip. Nineteen years ago. It rained.
  Gus: They passed a hat for you. Twelve thousand. Don't ask where the park keeps its cash.
  Teo [phone]: Mags! The scaffold's still up. The cradle's still there. Where are you?
  Mags: Exit 44. Everyone's inside Earl. I'm coming back.
  Teo [phone]: Back? The whole city's leaving! Every lane is outbound! Both sides!
  Mags: Then nobody will be in my way going in.
  Teo [phone]: EVERYBODY will be in your fucking way going in!
  [3 goto]
  Barbara [radio]: All lanes of Route 44 now run north. Heading south? You're the news.
  [4 goto]
  Mags: Four lanes of headlights. All of them mine to miss.
  Driver: WRONG FUCKING WAY, LADY!
  Mags: It's my way. I'm just early.
  Teo [phone]: The ramp closes in two minutes! Deputies are dragging barriers across!
  Mags: Shoulder. Median. Shoulder. Excuse me. Thank you. Excuse me.
  Teo [phone]: Are you saying excuse me to the cars?
  Mags: Manners are free, Teo.
  [5 heat]
  Deputy [loudhailer]: Bus! Stop or I shoot! The evacuation is THAT way!
  [6 heat]
  Teo [phone]: Use the voice! The bus driver one!
  [on Bus Driver Voice]
  Mags: Pull over and let the bus through. Thank you.
  Deputy: Yes, ma'am. Sorry, ma'am. ... Wait.
  Mags: Under the deck. Lights off. Count to twelve.
  [7 deliver]
  Mags: Coral Boulevard's a river. Sandbar's only a stream. I'll take the stream.
  Teo [phone]: I'm at Wendell's! The door's open! He says hurry! He said it nicer than that!
  [8 say]
  Wendell: Plywood on the glass. Snorkel on the intake. Bull bar off a Grouper. One hour.
  Wendell: Good thing we won the hauler back. I can't weld a bus by hand. (optional: needs speedbowl)
  Mags: Will she hold?
  Wendell: She'll be the ugliest thing that ever beat a hurricane.
  Teo: Key card, rope, snacks. I'm ready. Are we ready?
  Mags: Seatbelt.
  Teo: I'm not even on the bus yet.
  Mags: Practise.
Result card: "Evacuation Route" · stamp Delivered · caption "Wrong way. Right bus."
```

- **Numbers:** 1.1 km to the junction, 1.5 km to the interchange, 1.6 km to Park & Sons. Oncoming cars flash and swerve but never stop; the shoulder is dirt (grip 0.7).
- **Squawk:** "there is a city bus going SOUTH on route 44. everyone else is going north. the driver is saying excuse me"
- **Radio:** Barbara Wetherby: "Evacuation traffic on Route 44 was held up for four minutes today by one bus going the other way. Its driver is described as polite."
- **Check:** skip all eight steps: `mission:completed`, `cash: 12000`. Real step: at step 6, `t.setHeat(1)`, press `ability` within 30 m of the cruiser; it pulls over. Teleport under the deck; the `heat` step completes by itself.
- **Clip:** the Manatee alone on the wrong side of Route 44 in the rain, headlights parting round it, one wreck burning on the shoulder.

---

### 18 · The Spire Job            id: the-spire-job · tier A · chapter 1, act 4

```
Giver: both · Leads: both, with switching · Where: Meridian, then Tideline · Length: 12 min · Pays: $250,000 · Unlocks: going-viral (eye-of-the-storm first if present)
Needs: missions, cutscenes, switch, hurricane weather, the spire-climb landmark, heat 4 and 5, the Sheriff's show truck, Manatee
Start: the marker at Mags's carport (-1256, -226). On start a postcard wipe puts both leads and the storm-proofed Manatee in the Park & Sons service bay (332, -236) at 21:00. Wendell has put a shotgun and 12 shells under the driver's seat.
Weather: locked to hurricane from step 1 to step 9: sideways rain, no people, no traffic, low streets flooded 0.3 m (grip 0.5), flying lawn furniture, a green sky.
1.  cutscene  landfall (cutscenes.md)
2.  deliver   as Mags: the Manatee to the Spire's service dock on Tower Way (60, -985), r 6, maxDamage 60. 1.2 km: north up Sandbar Avenue, west on Tower Way. Debris crosses the road every 4 to 7 s.     hint: "Keep to the crown of the road."
3a. switch    to: teo
3b. goto      level 1, the podium roof (70, -960) y 18, up the outside scaffolding from the dock (66, -978): six ladders and plank runs     hint: "Climb between gusts."
3c. goto      level 2, the window-cleaning cradle at its dock on the east face (92, -905) y 18. Stand in it and hold interact: it rises to y 228 in 25 s, swinging 3 m. A gust every 6 s shoves Teo 1.2 m; if he falls out he is Knocked out and the mission restarts from its checkpoint.     hint: "After each gust, step back to the middle."
3d. goto      level 3, the roof garden (52, -905) y 228, then across it to the side door of the penthouse pavilion (40, -915), r 2. The launch party is here: 30 guests holding the tent down, Bellweather, Kiki, Tripp. Chad and Brad patrol with rifles and 12 m cones; a "spotted" is a burst at Teo.     hint: "Stay behind the palms. Mind the cones."
4a. collect   item: deeds, level 4, in the vault at the back of the pavilion (36, -925) y 228. The key card opens it. Teo also takes a bag marked "Fines". then: alarm.
4b. heat      reach 4 (the mission sets it): Sheriff SUVs and tactical vans, and they shoot
5a. switch    to: mags
5b. survive   90 s at the dock. Cruisers and Sheriff SUVs try to park across the exit lane, a box 20 by 12 m at (60, -997). The "Dock held" bar drains while two or more are parked in the box and refills when it is clear. Shove them out with the bus. Deputies fire on it the whole time. Bus Driver Voice works once here, at heat 4, and clears the box for 5 s.     hint: "Push them out of the box. Horn works once."
6a. switch    to: teo
6b. goto      the cradle (92, -905) y 228, r 2, with Chad and Brad behind, firing. A round cuts the brake: it drops to y 18 in 14 s, swings out over Tower Way and tips Teo onto the roof of the bus.     hint: "Run for the cradle. Do not stop."
7.  goto      as Mags (lead: mags; the lead changes as Teo lands, with no swoop), with Teo aboard, at heat 5 (the mission sets and locks it): the pier gate on Heron Walk Drive (600, 37), r 14, by the route in flags.route, or exchange when the flag is missing. The objective reads "Get home to Pelican Rest". Every unit shoots. The Sheriff's show truck stays 30 to 60 m behind, filming, and cannot be lost. Roadblocks stand at two junctions on the route.     hint: "Roadblocks move for nine tonnes of bus."
8.  heat      clear. As the bus passes Pier Road the lights of the wheel on the pier blow out in a chain, the show truck's dish goes dark, viewers fall to zero in 6 s and the lock is lifted.
9.  cutscene  ending (cutscenes.md). Leads into going-viral.
Fail: the Manatee is destroyed · the "Dock held" bar empties · spotted three times in 3d · Teo or Mags is knocked out
Checkpoints: after 2, after 3c, after 4a, after 5b, after 6b
Lines:
  [1 cutscene]
  Barbara [radio]: The storm has made landfall. It has no name. The Sheriff has offered his.
  Kiki: Manifest calm, everyone. The wind is only applause.
  Wendell: She'll wade. Don't ask her to float.
  Teo: Key card. Rope. Snacks.
  Mags: Seatbelt.
  [2 deliver]
  Teo: Something just flew past! Was that a lawn chair?
  Mags: Four lawn chairs. And the table.
  Teo: No cars. No people. It's just us and the furniture.
  Mags: Best traffic I've had in years.
  Mags: Same streets as the dry run. Wetter. (optional: needs dry-run)
  [3b goto]
  Mags: Service dock. This is you. Up the outside, through the garden, card in the door.
  Teo: And if it goes wrong?
  Mags: Then come down faster than you went up. I'll be here.
  [3c goto]
  Teo: Scaffold's shaking. Cradle's swinging. I'm shitting myself. Good talk, Teo.
  [3d goto]
  Teo: Mags. They have a string quartet. In a hurricane. They're tied to the stage.
  Kiki: The storm is a cleanse! Let it take what you don't need! NOT the fucking gazebo!
  Bellweather: By morning, friends, that beach is ours. To Bayhaven Tomorrow!
  Bellweather: And somebody find out who painted my billboards. (optional: needs paint-it-pink)
  [4a collect]
  Teo: Deeds. Hundreds. Lot 9: "Calloway" crossed out. Now it says "Bellweather Group".
  Mags [radio]: Take them all. Every lot.
  Teo: There's a bag in here marked "Fines".
  Mags [radio]: Forty years of lawn fines. That's ours too. Bring it.
  [4b heat]
  Chad: The vault's open! Brad! Shoot him! No, HIM! The one with the box!
  Rucker: We interrupt the storm for something better. Four lights at the Spire!
  [5b survive]
  Mags: Ninety seconds, Teo. I hold the door. You get to the cradle.
  Mags: Nine tonnes of bus. One and a half of cruiser. Do the sum, deputy.
  Rucker: It's the grandmother with the indicators! In a BUS! Deputies, light it up!
  [on Bus Driver Voice]
  Mags: Sit down and shut the fuck up. ... Thank you.
  [6b goto]
  Teo: They shot the brake! Mags! The fucking brake is GONE!
  Mags [radio]: Good. Faster. I'm under you.
  Teo: Under me WHERE?
  Mags [radio]: The bus, Teo. Aim for the bus.
  [7 goto]
  Teo: I'm on the roof of the bus and they're still shooting! Open the hatch!
  Mags: Hatch is open. Sit down. Behind the yellow line.
  Rucker: Five lights! All units! This is Hurricane Dale, and I don't mean the weather!
  Teo: Four hundred thousand viewers. Mags. Four hundred THOUSAND.
  Mags: To the pier. His signal runs off that wheel. When the wheel goes dark, so does he.
  [8 heat]
  Teo: The wheel! The lights on the wheel are going out! One, two... all of them!
  Rucker: Folks, we seem to be... are we still... hello?
  Mags: And that's the show.
  [9 cutscene]
  Rucker: Are we still on? Somebody tell me we're still on.
  Teo: Every lot in Pelican Rest. Forged. Every fucking one.
  Mags: Send it to the radio lady.
  Teo: Sending. One bar. Come on, one bar... sent!
  Mags: Now we wait.
Result card: "The Spire Job" · stamp Delivered · caption "$250,000 in lawn fines, returned to sender."
```

- **Step map to `05-content.md`:** each number is its step of the same number; letters split steps 3 to 6. Its four service floors are the dock, the podium roof, the cradle ride and the roof garden.
- **There are no interiors.** The pavilion is an open glass box on the roof; the vault is a steel wall of drawers at its back.
- **Roadblocks in step 7:** on `exchange`, at Commerce Way `(692, -677)` and Flamingo Avenue `(692, -357)`; on the other routes, at the second and the second-last gate. Each is three cruisers nose to tail, with deputies firing from behind them. The bus pushes through over 40 km/h for 10 damage.
- **Flood:** Tower Way is dry. Exchange Avenue floods south of Flamingo Avenue. All of Heron Walk Drive is under water.
- **Squawk:** "a BUS just left the spire with a guy on the roof and every cruiser in the county behind it. in a HURRICANE"
- **Radio:** Barbara Wetherby: "The Sheriff's programme went off air at the pier last night with a record audience and a city bus in frame. It has not come back."
- **Check:** skip all fifteen engine steps: `mission:completed`, `cash: 250000`, four `player:switched` events, `going-viral` available (roadmap check D9.3). Real step: at step 8, with heat locked at 5, drive the Manatee west through `(600, 37)`; `heat:cleared` fires within 10 s. Run step 7 with `flags.route` unset and with `paintworks`.
- **Clip:** the cradle dropping down the lit tower in sideways rain, tracer fire following it, tipping Teo onto the roof of the bus.

---

### 19 · Eye of the Storm            id: eye-of-the-storm · tier B · chapter 1, act 4

```
Giver: both · Leads: both (you play Mags; Teo holds the deeds up) · Where: Tideline, the bay, the Pelican Keys · Length: 9 min · Pays: $60,000 · Unlocks: going-viral
Needs: missions, cutscenes, Skimmer, Mullet, heat 5, the show truck, the Keys and the Longspan, a calm night after hurricane weather
Start: on the bus at the plaza (0, 37), straight after the night shots of the ending cutscene. Weather: clear and still, floods and debris left in place, a wall of cloud all round the horizon. If the build has no such state, a plain clear night. A hidden clock of 7 min is the eye closing.
1.  cutscene  intro-eye-of-the-storm (cutscenes.md)
2.  say       Barbara on the phone
3.  goto      the lifeguard hut on the beach by the plaza (0, 63), r 4, as foot
4.  enter     the red rescue Skimmer chained beside the hut at (4, 70). Teo rides behind with the deed box.
5.  goto      the slipway on Flip-Flop Key (-2000, 300), r 10. 2 km of heavy swell: the Skimmer loses 30% of its speed climbing each wave.     hint: "Ease off at the crest. Gas in the trough."
6.  enter     a Mullet with the keys in it at (-2008, 306). Teo stands in the bed.
7.  heat      reach 5 (the mission sets and locks it). The Sheriff's show truck pulls out at Tackle Key (-2280, 520) on generator power, one camera working, a deputy with a rifle in its roof hatch.
8.  survive   60 s "On air". The clock runs only while the Mullet is within 25 m of the show truck and in front of its camera, on the Longspan between Flip-Flop Key and Lime Key (-2830, 980). Viewers climb from 200,000 to 600,000. The deputy fires until they pass 400,000; then Rucker stops him.     hint: "Stay in his headlights. Let him film."
9.  goto      the lighthouse on Last Key (-3100, 1200), r 8
10. deliver   what: the deed box, to: Barbara at the lighthouse door (-3104, 1206), r 3, as foot
11. heat      clear (the mission lifts the lock as the storm wall returns and the show truck's mast folds)
Fail: 7 min pass before step 10 · the Skimmer or the pickup is destroyed · the show truck is out of range for 30 s in step 8
Checkpoints: after 4, after 7
Lines:
  [1 cutscene]
  Teo: It stopped. Mags, it stopped. I can see stars.
  Mags: It's the eye. We're in the middle. The other half is coming.
  [2 say]
  Barbara [phone]: Ms. Calloway. Your photographs arrived. I need the paper.
  Barbara [phone]: Photos are a story. Originals are proof. My building is dark.
  Barbara [phone]: I'm at the backup transmitter. The Last Key lighthouse. You have minutes.
  Teo: The Keys? Marsh Road is under water!
  Mags: Then we don't use a road.
  [4 enter]
  Mags: Rescue jet ski. Still chained to the hut. Lifeguard's on break.
  Teo: Two of us? On that? To the Keys?
  Mags: Hold the box. And me.
  [5 goto]
  Teo: The sky is a wall. All the way round. We're in a bowl, Mags.
  [6 enter]
  Mags: Stand in the bed. Hold the deeds up. Not yet. When I say.
  [7 heat]
  Rucker: We are BACK, Marlin County! One camera, and look who's on my bridge!
  Teo: He drove the show truck out here? In a fucking hurricane?
  Mags: Of course he did. He needs an ending.
  [8 survive]
  Mags: Now. Lot numbers to the lens.
  Teo: Hey, Sheriff! Read this! Lot 9! Lot 10! All of Pelican Rest! Forged by your sponsor!
  Rucker: Hold your fire! He's holding paper! Zoom in. Is that Gordy's signature?
  Producer: Sheriff, we should cut the feed.
  Rucker: What are the numbers?
  Producer: Six hundred thousand. Our best ever.
  Rucker: ...Stay on it.
  Chat: READ THE DEEDS
  Teo: He's not cutting away! He can't! It's too good!
  Mags: A man who lives on ratings can't look away from a good one.
  [10 deliver]
  Barbara: You're soaked. Give them here. ... These are the originals. Every one.
  Barbara: This is Barbara Wetherby at the Last Key light. I am holding what you just saw.
  [11 heat]
  Teo: The wall's coming back. Mags, the eye is closing.
  Rucker: Folks, we'll be right back after... no. We won't. Goodnight.
  Mags: Then we sit in a lighthouse and listen to the radio. I've had worse nights.
  Larry [phone]: Larry here! The show owes you a cut. Sixty grand. I acted for both sides.
Result card: "Eye of the Storm" · stamp Delivered · caption "As seen by the whole county."
```

- **Pair to mission 13:** there the binder stays off the Sheriff's cameras; here the deeds stay on them.
- **Numbers:** the show truck matches the Mullet up to 90 km/h; its rifleman does 6 damage a hit to the pickup until he is told to stop. Flip-Flop Key to Lime Key is 1.1 km, so the 60 s is one pass at about 65 km/h. Lime Key to the lighthouse is 350 m.
- **After the card:** ending shots 6 to 8 play and both leads are placed back on the bus at the plaza.
- **Squawk:** "@BayhavenBlue just showed forged deeds to 600,000 people by accident and kept filming. best episode ever"
- **Radio:** Barbara Wetherby: "This is Barbara Wetherby at the Last Key light. The originals are on my desk. The Sheriff's own cameras showed them first, to his surprise."
- **Check:** skip all eleven steps: `mission:completed`, `cash: 60000`. Real step: at step 8, hold the Mullet 15 m ahead of the show truck at 60 km/h for 62 s; the `survive` completes with viewers over 500,000. Running the hidden clock out emits `mission:failed`.
- **Clip:** the Longspan under stars, lightning all round the horizon, Teo in the pickup bed holding a deed up to the show truck's lens.

---

### 20 · Going Viral            id: going-viral · tier A · chapter 1, act 4

```
Giver: (ending) · Leads: Mags drives, Teo rides along · Where: Tideline, then the Longspan · Length: 3 min, plus credits · Pays: $0 and 2,000,000 followers · Unlocks: free roam after the story, the Bellweather mansion for sale
Needs: missions, radio news lines, credits, Manatee
Start: straight after the ending cutscene. 07:30, clear sky, wet roads, heat locked at 0. Mags in the driver's seat of the Manatee at the plaza kerb (0, 37), Teo across the back seat, Gerald on the mirror.
1a. say      waking up on the bus
1b. goto     as Mags: the gate of Pelican Rest (-1250, -197), r 10, in the Manatee, west along Heron Walk Drive. 1.5 km. The radio is locked to Bayhaven Public Radio and reads the news of the night, one line every 8 s.     hint: "No hurry. Take the beach road home."
2.  say      Teo checks his phone. The clip.
3a. deliver  the Manatee into the bay between two cones on the park lane (-1244, -212), r 2. The bay is 14 m long and 3.2 m wide. Any stop inside it counts, straight or crooked, and so does flattening a cone.     hint: "Mirror. Signal. Park."
3b. say      the chat reacts; last lines
4.  timer    150 s, onEnd: complete. The credits. The hour jumps to 18:40 and the bus is placed at the start of the Longspan (-1900, 180), heading for Last Key. The player can steer, brake and stop. Credit lines scroll on the right; the only HUD is the day badge.
Fail: none. The bus cannot be destroyed in this mission.
Checkpoints: after 1b
Lines:
  [1a say]
  Mags: Morning.
  Teo: Is it over? Is there still a town?
  Mags: Most of one. Gerald's on the mirror. That's how you know.
  Teo: My phone's on 3 percent and it will not stop buzzing.
  Mags: Let it buzz. I'm driving us home.
  [1b goto]
  Barbara [radio]: Good morning, Bayhaven. Barbara Wetherby. You may want to sit down.
  Barbara [radio]: Papers seen by this station show every deed in Pelican Rest was forged.
  Barbara [radio]: The forger's name is on all of them. It is also on a tower.
  Barbara [radio]: The originals reached me by jet ski, in the eye. (optional: needs eye-of-the-storm)
  Barbara [radio]: Mr. Bellweather was found at dawn in a gazebo, two streets from his roof.
  Barbara [radio]: Launch night is postponed. The word used was "indefinitely".
  Barbara [radio]: Kiki Halcyon has posted a 40-minute apology. It sells a candle.
  Barbara [radio]: Eleven cruisers are in the bay. Three deputies are in Bayhaven General.
  Barbara [radio]: The Sheriff's programme went dark at the pier. He calls it a cliffhanger.
  Barbara [radio]: He later aired the proof himself, by accident. (optional: needs eye-of-the-storm)
  Barbara [radio]: Pelican Rest's notice to vacate is withdrawn. Its residents are staying.
  Barbara [radio]: In other news, a pelican is sitting on a bus. More as we get it.
  [as the park comes into view]
  Teo: She said our name. On the radio. She said Pelican Rest.
  Mags: I heard.
  Teo: You're smiling.
  Mags: I'm squinting. Sun's low.
  [2 say]
  Teo: Okay. Okay okay okay. Mags. Something went viral.
  Mags: The tower? The cradle? The bus?
  Teo: None of it. The signal was down. It's a clip from last week. It's you.
  Teo: Parking the bus outside the park. Fourteen seconds. No cuts.
  Mags: That's not a stunt. That's parking.
  Teo: Two million people watched you park. They call it the calmest thing online.
  Teo: I filmed a heist in a hurricane and I'm famous for your fucking parking!
  Mags: You held the camera steady. That's the hard part.
  [3a deliver]
  Teo: Somebody's put cones out. Mags. They want you to do it again.
  Teo: I'm live. Everybody's here. All two million. Do the thing.
  Mags: It's only parking.
  Chat: SHE'S DOING IT
  [3b say, after a clean park]
  Chat: flawless. frame it
  [3b say, after a crooked park or a flattened cone]
  Chat: she hit the cone on purpose. icon
  [3b say, always]
  Teo: Two million followers. The first 212 were here before it was cool.
  Mags: One of them was me.
  Teo: The best one.
  Teo: What do we do now?
  Mags: Feed the bird. Fix the fence. Tomorrow, something else.
  [4 timer, 10 s in]
  Teo: Hey, Mags? Seatbelt.
  Mags: ...That's my line.
Result card: "Going Viral" · stamp Delivered · caption "Greetings from Pelican Rest. We're staying."
```

- **Step map to `05-content.md`:** 1a and 1b are its step 1 · 2 its step 2 · 3a and 3b its step 3 · 4 its step 4. The result card shows when the credits end; free roam then begins at Pelican Rest at 09:00.
- **Followers:** add 2,000,000 at step 2. That passes 1,000,000, so the statue of Teo's phone is in the plaza in free roam.
- **The viral clip** is an old one of Mags parking a bus outside the park. It never plays on screen. The player's park in step 3a is the sequel.
- **The world after:** the notice is gone from the noticeboard at `(-1255, -215)`. Bayhaven Tomorrow billboards read "Postponed". The Bellweather mansion goes on sale.
- **Squawk:** "14 seconds of a grandma parallel parking a bus. i have watched it 40 times. i feel calm. i feel safe"
- **Radio:** Barbara Wetherby: "A fourteen-second video of a bus being parked has been watched two million times. Its driver says it was only parking."
- **Check:** skip all six engine steps: `mission:completed`, followers up by 2,000,000, credits play and end, free roam works (roadmap check D9.3). Real step: at 3a, drive the Manatee 20 m into the bay and brake; the `deliver` completes for any stop inside it.
- **Clip:** fourteen seconds: the bus backing between two cones in one move, the chat going wild, Gerald on the mirror.

## New names

None. "Dock held" and "On air" are bar labels on the HUD.
