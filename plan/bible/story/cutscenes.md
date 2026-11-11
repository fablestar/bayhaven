# Bible · story · Cutscenes

Shot lists for the ten cutscenes of chapter 1: the opening, the switch introduction before mission 11, landfall before mission 18, the ending, and six short mission intros. Each is a puppet show of 45 seconds or less: camera keyframes, characters walking to marks, subtitles with a portrait and a speech blip. One tap skips any of them, and nothing a player needs is only in a cutscene.

Tier: A (opening, switch-intro, landfall, ending) · B (the six mission intros)

## The ten

| id | Plays | Seconds | Shots | Lines | Tier |
|---|---|---|---|---|---|
| `opening` | New game, as step 1 of `final-notice` | 38 | 8 | 7 | A |
| `switch-intro` | Step 1 of `yacht-rock` | 43 | 9 | 9 | A |
| `landfall` | Step 1 of `the-spire-job` | 38 | 7 | 5 | A |
| `ending` | Step 9 of `the-spire-job` | 42 | 8 | 5 | A |
| `intro-hot-sauce` | Step 1 of `hot-sauce` | 14 | 3 | 4 | B |
| `intro-glow-up` | Step 1 of `glow-up` | 13 | 3 | 3 | B |
| `intro-swamp-thing` | Step 1 of `swamp-thing` | 12.5 | 3 | 3 | B |
| `intro-crane-game` | Step 1 of `crane-game` | 14 | 3 | 3 | B |
| `intro-speedbowl` | Step 1 of `speedbowl` | 15 | 3 | 3 | B |
| `intro-eye-of-the-storm` | Step 1 of `eye-of-the-storm` | 15 | 3 | 2 | B |

Each is one file, `src/content/cutscenes/<id>.js`, in the shape given in `bible/tech/schemas.md`. Every line below is also listed in the mission's script in `act-1.md` to `act-4.md` under `[1 cutscene]` or `[9 cutscene]`, word for word.

## Rules for every cutscene

| Rule | Value |
|---|---|
| Camera notation | `[x, y, z]` in metres, the order the schema uses: `y` is height above the ground. Marks for people and vehicles are seeds `(x, z)`. |
| Field of view | Vertical, in degrees. 28 to 35 for faces, 40 to 50 for places, 55 to 60 for the sky. |
| Moves | `hold` (no movement) · `push` and `pull` (along the view line) · `pan` (turn on the spot) · `crane` (up or down) · `track` (sideways with a walker) · `handheld` (a hold with 2 cm of slow noise) · `swoop` (the switch move: up, across, down). All moves ease in and out over 0.4 s. |
| Subtitles | One line at a time, bottom centre, with the speaker's portrait on the left and one blip per syllable. A line stays for `0.5 + 0.06 × characters` seconds, 1.6 s at least. The shot lengths below already allow for this. |
| Walking | Puppets walk to marks at 1.6 m/s and turn to face whoever is speaking. No lip movement; the face texture changes between neutral, talk, smile, frown and shock. |
| HUD | Hidden, except subtitles, a small "Skip" prompt and the day badge. No black bars. |
| Skip | Any confirm key, tap or button after the first 0.5 s. The cutscene ends within 1 s (roadmap check D7.3): actors and vehicles jump to their end marks, the hour and weather are set as listed, and the camera cuts to the gameplay camera. |
| If skipped | The mission's next objective line carries the facts. Each cutscene lists that line. |
| Loading | Before the first shot, call `chunks.ensure` at every camera position in the list with a radius of 1 chunk. |
| Reduce motion | `handheld` becomes `hold`; `swoop` becomes a 0.4 s cross-fade; lightning flashes are off. |
| Cast limit | At most 12 puppets and 4 vehicles in a shot on phones; crowds beyond that are instanced people from the street system. |
| Violence | Shown wide and brief: a muzzle flash, a puppet falling, a car on fire. Never a close-up of anyone hit. |
| Sound | The radio is ducked by 12 dB. World sound stays on. No music is written for cutscenes. |

**Looks and voices:** every puppet's build, colours and blip pitch are in `characters.md` (Mags 180 Hz, Teo 260 Hz, the Sheriff 120 Hz with crackle, Kiki 340 Hz with vibrato, as in `07-art-and-audio.md`). A `[radio]` or `[phone]` line uses the speaker's own pitch through the radio filter. Gerald never speaks.

**Check for each cutscene:** `cutscene.play(id)` resolves in its listed seconds plus or minus 1; a skip press at 2 s resolves it within 1 s; afterwards `test.player()` answers and the listed end state holds.

---

## 1. `opening` · tier A · 38 s

Plays on a new game at 17:30, clear, golden hour. The notice goes up, Gerald watches, the tow truck leaves with Teo's scooter, and Mags uncovers the coupe.

| Mark | Seed |
|---|---|
| Noticeboard, Gerald on top of it at `y` 3 | `(-1255, -215)` |
| Mags's lawn chair, lot 9 | `(-1250, -220)` |
| The Heron under its cover, in the carport | `(-1256, -226)` |
| Teo's door, lot 10 | `(-1246, -224)` |
| The Pinfish on its stand | `(-1240, -230)` |
| Marco's tow truck, engine running | `(-1236, -232)`, leaves by the gate `(-1250, -197)` |

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 5 | from `[-1255, 30, -290]` to `[-1255, 6, -235]`, look `[-1255, 3, -215]`, FOV 50, crane down | Gerald on the noticeboard. Marco at the board. Mags in her chair. The truck idling. | The park at golden hour: twelve trailers, washing lines, the bay and a low sun behind. A luggage tag swings in: "Pelican Rest". | (none) |
| 2 | 5 | from `[-1253, 1.7, -212]`, look `[-1255, 1.6, -215]`, FOV 30, hold | Marco with a stapler. Gerald's head leans into the top of the frame. | Two staples. The notice fills the frame: "Notice to vacate. 30 days. The Bellweather Group." Gerald reads it upside down. | Marco: Thirty days. Says so right there. I just staple. |
| 3 | 4 | from `[-1270, 6, -200]` to `[-1262, 4, -208]`, look `[-1250, 2, -220]`, FOV 40, push | Mags in the lawn chair, a wrench in her hand, the covered coupe behind her. | She reads the notice from across the lot and does not get up. She puts the wrench down. | (none) |
| 4 | 5 | from `[-1243, 0.6, -233]`, look `[-1238, 1, -231]`, FOV 40, hold | The Pinfish on the truck's hook. Teo at his door. | The hook lifts the scooter. Teo runs out in one slide, phone on his chest, and trips on the step. | Teo: Hey! That's my fucking scooter! I'm mid-upload! |
| 5 | 4 | from `[-1239, 1.7, -228]`, look `[-1236, 1.8, -232]`, FOV 35, hold, then pan right 40 degrees with the truck | Marco in the cab window. Teo beside the door. | Marco shrugs. The truck pulls out towards the gate with the scooter swinging. | Marco: Lot charges, kid. Take it up with the new owner. |
| 6 | 7 | from `[-1247, 1.6, -217]`, look `[-1250, 1.3, -220]`, FOV 35, hold | Teo runs to `(-1249, -221)`. Over his shoulder: Mags. | Teo points after the truck. Mags stands up. | Teo: They took my scooter. My whole career is on that scooter.<br>Mags: Your career is a phone on a stick. |
| 7 | 3 | from `[-1253, 1.5, -223]` to `[-1257, 1.5, -225]`, look at Mags, FOV 35, track | Mags walks to the carport. Teo follows. | She takes a corner of the cover. | Teo: Are you going to help? |
| 8 | 5 | from `[-1260, 0.8, -231]`, look `[-1256, 1, -226]`, FOV 28, hold | Mags and Teo at the coupe. Gerald on the board, small, behind them. | The cover comes off in one pull: the pink Heron, sun on the chrome. Gerald takes off across the top of the frame. Cut to the chase camera behind the car. | Mags: Seatbelt. |

- **End state:** Mags stands at the driver's door, Teo at the passenger door, the truck 60 m away and moving. Step 2 of the mission begins.
- **If skipped:** the objective reads "Marco is towing Teo's scooter. Get in the Heron."
- **Gerald** is in the first shot here and in the last shot of `ending`.

---

## 2. `switch-intro` · tier A · 43 s

Plays as step 1 of `yacht-rock`. The mission has set Saturday, 21:00, clear. It introduces June to players on the A chain and shows the switch move once before the player has to use it.

| Mark | Seed |
|---|---|
| Foot of the gangway: Teo and June | `(-1205, 118)` |
| The King Tide, bow to stern | `(-1235, 128)` to `(-1175, 128)`, top deck at `y` 9 |
| Tripp, on the top deck | `(-1215, 126)` |
| Fuel dock: Mags, and two security Skimmers | `(-1290, 100)` and `(-1286, 104)` |

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 3.5 | from `[-1150, 14, 60]` to `[-1190, 6, 100]`, look `[-1205, 5, 126]`, FOV 45, crane down | The King Tide at the outer dock: three decks of lights, 40 guests, three guards with sidearms at the rails. | Music from the current station drifts over the water. | (none) |
| 2 | 7 | from `[-1202, 1.7, 115]`, look `[-1205, 1.5, 118]`, FOV 35, hold | June and Teo at the foot of the gangway. | June hangs a lanyard round his neck and straightens it. | June: Lanyard. You're "talent". Don't dance, don't pitch, don't talk to Tripp.<br>Teo: Who's Tripp? |
| 3 | 4 | from `[-1207, 3, 121]`, look `[-1215, 9, 126]`, FOV 30, hold | Tripp at the top-deck rail. | He waves at nobody, then at a seagull. | June: It's his yacht. He won't know that either. |
| 4 | 7 | from `[-1203.5, 1.6, 116.5]`, look at June, FOV 28, hold | June close. Teo's shoulder in the frame. | She looks over her own shoulder before she speaks. | June: Bellweather's key card is in his jacket. White jacket. It opens his vault.<br>Teo: And Mags? |
| 5 | 2.5 | swoop: up from Teo to `[-1205, 120, 118]` in 0.8 s, across to `[-1290, 120, 100]` in 0.9 s, down to `[-1292, 2.2, 104]` in 0.8 s, FOV 50 | Nobody: the marina from above. | This is the switch move, played once as a shot. The portrait button pulses on the HUD for its 2.5 s. | (none) |
| 6 | 6 | from `[-1292, 2.2, 104]`, look `[-1290, 1.4, 100]`, FOV 35, hold | Mags at the fuel pump in a borrowed marina vest, nozzle in hand. Two Skimmers moored beside her. | She gives the second Skimmer a very short squirt and hangs the nozzle up. | Mags: Fuel dock. I told security I'd top up their jet skis. Helpful old lady. |
| 7 | 5 | from `[-1288, 1.6, 101]`, pan from Mags to the yacht's stern at `[-1175, 5, 128]`, FOV 30 | Mags. The lit stern, far across the dock. | She points at the stern with her chin. | Mags: When you have the card, go to the stern and jump. I'll be under it. |
| 8 | 2.5 | swoop back: up, across and down to `[-1203, 1.7, 116]`, FOV 50 | Nobody. | The same move in reverse. | (none) |
| 9 | 5.5 | from `[-1203, 1.7, 116]`, look at Teo, FOV 35, hold | Teo alone at the gangway. June has gone aboard. | He looks at the black water, then up the gangway. Control returns as he takes the first step. | Teo: Jump off a yacht. In the dark. Onto a boat. Fuck.<br>Mags: Feet first. |

- **End state:** the player is Teo at `(-1205, 118)`. Mags waits at the fuel dock. The switch button stays locked until step 5a.
- **If skipped:** the objective reads "Reach the top deck. Bellweather's key card is in his white jacket." Step 5a's own prompt, "Switch to Mags", teaches the button again.
- **Shot 9's last line** is Mags on Teo's earpiece: use her blip with the radio filter.

---

## 3. `landfall` · tier A · 38 s

Plays as step 1 of `the-spire-job`, at 21:00. The weather locks to hurricane on the first frame and stays locked until the ending.

| Mark | Seed |
|---|---|
| The wheel on Gullwing Pier | `(600, 400)` |
| Heron Walk Drive at the plaza | `(0, 37)` |
| The Spire, roof garden at `y` 228 | `(52, -900)` |
| Park & Sons service bay: the Manatee, Wendell | `(332, -236)` |

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 5 | from `[600, 80, 700]` to `[600, 40, 520]`, look `[600, 20, 400]`, FOV 55, push | Nobody. The pier from out in the bay. | A wall of cloud rolls over the pier. The wheel turns by itself. The pier lights flicker. The sky goes green. | Barbara [radio]: The storm has made landfall. It has no name. The Sheriff has offered his. |
| 2 | 5 | from `[-40, 3, 44]`, look `[60, 2, 40]`, FOV 40, hold | Nobody. Heron Walk at the plaza. | Palms bent flat. A lifeguard hut slides across the road. Six lawn flamingos fly past in formation. | (none) |
| 3 | 4 | from `[52, 6, -760]` to `[52, 120, -820]`, look `[52, 240, -900]`, FOV 45, crane up | The Spire, top floors lit, searchlights in the rain. | A banner, "Bayhaven Tomorrow: Launch Night", tears loose and wraps round a searchlight. | (none) |
| 4 | 6 | from `[46, 229.6, -898]`, look `[52, 229.5, -905]`, FOV 35, handheld | The roof garden. Bellweather with a glass, smiling with every tooth. Kiki filming herself. Guests holding the tent ropes. Tripp asleep in a deck chair. Chad and Brad at the lift with rifles. | A gazebo lifts one leg and puts it down again. | Kiki: Manifest calm, everyone. The wind is only applause. |
| 5 | 6 | from `[344, 1.6, -214]`, look `[332, 2, -236]`, FOV 40, hold | Park & Sons. The roller door rises on the Manatee: plywood on the windows, a snorkel, a bull bar. Wendell beside it. | Headlights on. Wendell slides a shotgun under the driver's seat and slaps the side panel twice. | Wendell: She'll wade. Don't ask her to float. |
| 6 | 7 | from `[331, 2.4, -232]` inside the bus, look at the driver's seat, FOV 50, hold | Mags at the wheel, pulling her gloves tight. Teo fixing his chest mount. | Teo holds up the key card, a coil of rope and a bag of crisps, one at a time. | Teo: Key card. Rope. Snacks.<br>Mags: Seatbelt. |
| 7 | 5 | from `[352, 1.2, -200]`, look at the bay door, FOV 35, hold | The bus. | It rolls out into 0.3 m of water behind a bow wave. A lawn chair bounces off the plywood. Cut to the chase camera. | (none) |

- **End state:** the player is Mags in the Manatee outside Park & Sons, facing Sandbar Avenue. Hurricane weather, no traffic, no people.
- **If skipped:** the objective reads "The storm is here. Drive the bus to the Spire's service dock."
- **A-chain note:** Wendell, Kiki and Bellweather have all been met by mission 11. No line here needs a B or C mission.

---

## 4. `ending` · tier A · 42 s

Plays as step 9 of `the-spire-job`, the moment heat clears at the pier. Shots 1 to 5 are the night. Shots 6 to 8 are the morning and lead into `going-viral`. If `eye-of-the-storm` is in the build, play shots 1 to 5 here (29 s) and shots 6 to 8 (13 s) after that mission's result card.

| Mark | Seed |
|---|---|
| The wheel on the pier | `(600, 400)` |
| The show truck, slewed across the road | `(622, 37)` |
| The Manatee's last stop, at the plaza kerb | `(0, 37)` |

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 5 | from `[640, 30, 120]`, look `[600, 25, 400]`, FOV 45, hold | Nobody. The wheel from the beach. | The lights of the wheel blow out one car at a time, clockwise. Sparks. The pier goes dark. | (none) |
| 2 | 6 | from `[610, 1.6, 40]`, look `[622, 1.8, 37]`, FOV 35, handheld | Sheriff Rucker steps out of the show truck in a rain cape and looks into his own camera. | On the HUD the LIVE pill breaks into static and reads "Signal lost". He taps the lens. | Rucker: Are we still on? Somebody tell me we're still on. |
| 3 | 4 | from `[300, 12, 20]`, pan with the bus from `[380, 2, 37]` to `[200, 2, 37]`, FOV 40 | The Manatee, lights off, its plywood full of bullet holes, coasting west through the flood. | No sirens. Only rain. | (none) |
| 4 | 9 | from `[2, 2.2, 36]` inside the bus, look down the aisle, FOV 50, hold | Teo on the floor with the deed box open, phone torch on. Mags driving. | He photographs page after page. The phone shows one bar, then a tick. | Teo: Every lot in Pelican Rest. Forged. Every fucking one.<br>Mags: Send it to the radio lady.<br>Teo: Sending. One bar. Come on, one bar... sent! |
| 5 | 5 | from `[20, 8, 60]` to `[10, 5, 50]`, look `[0, 3, 37]`, FOV 40, push | The bus stops at the plaza kerb under the dark Bayhaven rooftop sign. | Engine off. Rain on the roof. Fade to white. | Mags: Now we wait. |
| 6 | 5 | from `[0, 40, 140]`, look `[0, 10, 0]`, FOV 50, hold | The plaza from over the beach. The bus is small at the kerb. | Dawn. Clear sky, wet roads steaming, a rainbow over Meridian. The rooftop sign flickers on, then off for the day. | (none) |
| 7 | 4 | from `[3, 2.2, 36]` inside the bus, look at the back seat, FOV 45, hold | Teo asleep across the back seat, the phone buzzing on his chest. Mags awake at the wheel with a flask of coffee. | She looks back at him and turns the radio on, quietly. | (none) |
| 8 | 4 | from `[-3, 2.6, 34]`, look `[-1.4, 2.4, 36]`, FOV 28, hold | Gerald lands on the bus's mirror. | He looks into the camera. One blink. Cut to the chase camera for `going-viral`. | (none) |

- **End state:** 07:30, clear, wet roads, heat 0, weather unlocked. Both leads on the Manatee at `(0, 37)`. The result card for `the-spire-job` shows after shot 8, or after shot 5 when `eye-of-the-storm` follows.
- **If skipped:** the first line of `going-viral` step 1a plays ("Morning.") and its radio lines carry everything: the deeds were forged, the proof reached the radio, the notice is withdrawn.
- **What the A chain needs from this cutscene** is only that the proof was sent. Mission 20's news says so again in its second line.

---

## 5. `intro-hot-sauce` · tier B · 14 s

Step 1 of `hot-sauce`. Domino Park `(-1400, -880)`, any hour from 09:00 to 20:00. First meeting with Rafa.

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 4 | from `[-1390, 3, -870]` to `[-1397, 1.8, -877]`, look `[-1400, 1, -880]`, FOV 40, push | Rafa and three old men at the domino table under the banyan. Mags and Teo arriving. | Rafa slams a double six. The tiles jump. He does not look up. | Rafa: Sit. You're the one who rammed the tow truck. |
| 2 | 6.5 | from `[-1402, 1.4, -877]`, look across the table, FOV 35, hold | Rafa and Mags across the table. Teo standing, filming the dominoes. A bottle of Lava Abuela in the middle. | Rafa turns the bottle so the label faces her. | Rafa: I have a van of my mother's hot sauce. It needs to reach the Mercado.<br>Mags: That's a delivery. |
| 3 | 3.5 | from `[-1399.2, 1.3, -879.4]`, look at Rafa, FOV 28, hold | Rafa, close. | He slides a van key across the tiles with one finger. There is a pistol under his newspaper. | Rafa: That's a delivery with enemies. |

- **End state:** both leads beside the table; step 2's lines start at once.
- **If skipped:** the objective reads "Rafa needs a van of Lava Abuela driven to the Mercado."

---

## 6. `intro-glow-up` · tier B · 13 s

Step 1 of `glow-up`. The Sandpiper Bridge approach `(-1108, 110)` at 11:30, clear. First meeting with June for players who have the B missions.

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 4 | from `[-1120, 0.8, 100]`, look `[-1108, 1.5, 110]`, FOV 35, hold | A white Pompano in Glow Camp livery, idling. The bridge and the island gatehouse beyond. | The side door slides open on June in white linen and sunglasses. | June: Don't wave. Don't say my name. Get in the van. |
| 2 | 4 | from `[-1107, 1.5, 111]` inside the van, look at the door, FOV 50, hold | Teo climbing in over six jugs of cooking oil. | He beams at her. She does not beam back. | Teo: June! You look great. You look... sponsored. |
| 3 | 5 | from `[-1107.6, 1.4, 110.2]`, look at June, FOV 28, hold | June, close. | She takes her sunglasses off and hands him a white staff shirt. | June: I work for Kiki Halcyon. I'd like to stop. That's where you come in. |

- **End state:** Teo in the back of the van, door open; step 2's lines start at once.
- **If skipped:** the objective reads "June wants the SPF 1000 at Glow Camp swapped for cooking oil."

---

## 7. `intro-swamp-thing` · tier B · 12.5 s

Step 1 of `swamp-thing`. Captain Nilda's dock `(1200, -3250)` at 05:30 in swamp fog. First meeting with Nilda.

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 3.5 | from `[1240, 0.5, -3290]` to `[1215, 0.8, -3262]`, look `[1200, 2, -3250]`, FOV 45, push low over the water | The dock in fog. The Gatorback's fan cage as a dark circle. | Fireflies. A heron lifts off a post. | (none) |
| 2 | 6 | from `[1196, 1.6, -3246]`, look `[1202, 1.5, -3252]`, FOV 35, hold | Nilda coiling rope, not looking up, a shotgun against the post. Mags and Teo at the end of the dock. | She throws the coil into the boat. | Nilda: You're the bus driver. Word is you can drive anything.<br>Mags: Anything with a wheel. |
| 3 | 3 | from `[1206, 0.9, -3264]`, look up at the fan cage, FOV 30, hold | Nilda's boot on the hull. The fan above her. | She kicks the hull. The fan turns a quarter. | Nilda: This has a fan. Get on. |

- **End state:** both leads on the dock beside the Gatorback.
- **If skipped:** the objective reads "Nilda needs five crates of survey markers out of the Glades."

---

## 8. `intro-crane-game` · tier B · 14 s

Step 1 of `crane-game`. The foot of crane 3 `(2900, -260)`, any hour from 08:00 to 18:00. First meeting with Dess.

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 5 | from `[2896, 2, -262]` to `[2896, 62, -262]`, look `[2925, 20, -262]`, FOV 50, crane up | The quay and the stacks in six colours. | The camera rides up the crane's leg, 60 m in 5 s. A ship's horn. The bay opens out. | (none) |
| 2 | 3.5 | from `[2903, 63.6, -257]`, look `[2900, 63.5, -260]`, FOV 35, hold | Dess in hi-vis at the cab rail with a flask. Mags steps off the ladder, not out of breath. Teo behind her on his hands and knees. | Dess looks Mags up and down. | Dess: Ever driven anything seventy metres up? |
| 3 | 5.5 | from `[2901, 64, -261]` over Mags's shoulder, look `[2925, 0, -262]`, FOV 40, hold | Mags and Dess at the rail. The stacks far below. | Mags looks down. One pink box among the others. | Mags: I've driven second-graders home from a birthday party.<br>Dess: Then you'll be fine. |

- **End state:** Mags and Teo on the cab catwalk at `y` 62; step 2's lines start at once.
- **If skipped:** the objective reads "Dess needs one pink container, tag BT-44, lifted onto a truck."

---

## 9. `intro-speedbowl` · tier B · 15 s

Step 1 of `speedbowl`. The infield garage `(2700, -1850)`, Friday 19:00, clear.

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 4 | from `[2690, 1, -1842]`, look `[2694, 1, -1846]`, FOV 35, hold | A dark garage. A shape under a tarp. | The roller door rises. A strip of evening light climbs the tarp. The crowd is a murmur outside. | (none) |
| 2 | 5.5 | from `[2698, 1.4, -1842]`, look at the car, FOV 35, hold | Wendell at the tarp. Mags in the doorway. | He pulls the tarp: the number 9, a stock Wahoo in faded pink with a white 9 on the door. Dust in the light. | Wendell: Kept her under a tarp. Thirty-five years. Turned her over every Sunday. |
| 3 | 5.5 | from `[2695, 1.5, -1845]`, look at the roof of the car, FOV 28, hold | Mags's gloved hand on the roof. Her reflection in the side glass. | She does not smile. Her reflection nearly does. | Mags: You kept the 9.<br>Wendell: Somebody had to. You were busy driving the other 9. |

- **End state:** Mags beside the car, Wendell at the bench.
- **If skipped:** the objective reads "Win tonight's ten-lap feature in the number 9 car."
- **"The other 9"** is the 9 bus, Mags's old route.

---

## 10. `intro-eye-of-the-storm` · tier B · 15 s

Step 1 of `eye-of-the-storm`. The bus at the plaza `(0, 37)`, the middle of the night. Hurricane weather for the first second, then still.

| # | s | Camera: from, to, FOV, move | Who is where | Action | Line |
|---|---|---|---|---|---|
| 1 | 4 | from `[0, 2.2, 36]` inside the bus, look up through the windscreen, FOV 60, hold | Mags asleep at the wheel. Teo awake. | Sideways rain on the glass. In one second it stops. The clouds open into a ring and there are stars. | (none) |
| 2 | 3.5 | from `[0, 60, 110]`, look `[0, 0, 20]`, FOV 55, hold | The bus, small, at the plaza kerb. | The dark city. Flooded streets like mirrors. A wall of cloud lit by lightning all round the horizon. No wind at all. | (none) |
| 3 | 7.5 | from `[2, 2.2, 35]` inside the bus, look at both leads, FOV 45, hold | Teo shaking Mags by the shoulder. | Her phone lights up on the dash: "B. Wetherby". | Teo: It stopped. Mags, it stopped. I can see stars.<br>Mags: It's the eye. We're in the middle. The other half is coming. |

- **End state:** both leads on the bus; step 2's phone call starts at once.
- **If skipped:** the objective reads "The eye is overhead. Take the deeds to Barbara at the Last Key lighthouse."

## New names

None. Every person, place and vehicle in this file is in the canon. The cutscene ids follow the mission ids.
