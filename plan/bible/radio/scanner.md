# Bible · radio · The scanner and the Sheriff's ticker

Two sets of lines for the heat system. The scanner is what emergency vehicles have in place of a radio: 60 dispatcher calls, one for each of twelve crime kinds at each of five heat levels, from a fender-bender to a deputy shot dead. The ticker is Sheriff Dale Rucker's live commentary on *Bayhaven Blue: Live*: 80 lines keyed by event and heat level, shown on the LIVE overlay from heat 3 and played on every radio station from heat 4. He is a TV host first and a sheriff second, and real violence is ratings to him.

Tier: A for the scanner itself, the 45 calls of the nine kinds marked A, the 30 ticker lines marked A and the theme. B for the other 15 calls, the other 50 ticker lines and the idle chatter.

## The scanner

| Field | Value |
|---|---|
| Where it plays | In place of the radio in every Emergency vehicle in the canon, the Hammerhead and the Horsefly. Q and E do nothing there. The radio pill reads "Scanner". |
| When a call plays | On every `crime` event with `seen` true. The call is picked by the event's `kind` and the heat level at that moment, before any rise. One call at a time; a newer one waits up to 4 seconds, then is dropped. `killing` and `deputy-down` are never dropped: they cut in. |
| Heat 1 and 2 | The show is not live yet. The scanner is the only place the player can hear the dispatcher's attention. |
| Heat 3 and up | Deputies shoot instead of arresting (`04-systems.md` section 7). The calls say so. |
| Length | 160 characters or fewer after filling |
| Dispatcher's blip | 240 Hz square through a 400 Hz to 2.8 kHz band-pass, 55 ms per syllable, 7 syllables a second |
| Radio sound | A 60 ms burst of noise opens every call and a 1 kHz beep of 80 ms closes it. Static at −30 dB runs all the time. |

### The dispatcher

She has no name on air. Deputies call her Dispatch.

1. Unit, place, what happened, in that order. No number codes. A body is "a body" and dead is "dead".
2. She is never surprised and never raises her voice. The worse it gets, the flatter she reads it. She does not swear; the deputies do that for her.
3. From heat 3 she has two bosses, the law and the control room, and passes on the director's notes without comment. By heat 5 she has stopped pretending to be in charge.

### Placeholders

| Slot | Filled with |
|---|---|
| `{unit}` | A whole number from 3 to 58, fixed for the length of one chase |
| `{street}` `{district}` `{landmark}` | As in `news.md`: nearest named road, current district, nearest fixed landmark |
| `{vehicle}` | The player's vehicle by model name. On foot, "suspect on foot" replaces "the {vehicle}". |
| `{heading}` | "northbound", "southbound", "eastbound" or "westbound", from the player's heading |
| `{suspect}` | "a woman in a visor" for Mags, "a man with a phone on his chest" for Teo |
| `{viewers}` | Current viewers, with commas |
| `{score}` `{distance}` `{count}` | From the event, as in `news.md` |

### Crime kinds

The Events table gives `crime` a `kind` but does not list the kinds. These twelve ids are the list. The first nine are the things `04-systems.md` says raise heat.

| Kind | What it is | Tier |
|---|---|---|
| `collision` | Hitting a vehicle in view of a deputy | A |
| `hit-and-run` | Running a person down in view. Over 50 km/h they stay down. | A |
| `carjack` | Taking an occupied vehicle in view | A |
| `cop-ram` | Hitting a Sheriff's vehicle | A |
| `shots` | Firing a weapon, nobody hit | A |
| `killing` | Killing someone in view | A |
| `deputy-down` | Killing a deputy | A |
| `evade` | Not stopping for a pull-over for 20 seconds | A |
| `outlast` | Lasting 90 seconds at one heat level | A |
| `theft` | Taking a parked vehicle in view | B |
| `explosion` | A vehicle blown up in view | B |
| `shoot-out` | Ten seconds or more of fire both ways, with deputies, a crew or guards | B |

### The 60 calls

One table per kind. `Heat` is the heat level at the moment of the crime, before any rise. Heat 0 counts as 1.

#### `collision`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, collision on {street}. {vehicle}, {heading}, didn't stop. Go and have a word. |
| 2 | All units {district}, the {vehicle} has hit a second car. One driver hurt. Box it in. Mind your paint. |
| 3 | We're live. The {vehicle} is trading paint on {street}. Control room says the sparks look great. Carry on. |
| 4 | Collision on {street}, part of the ongoing. Director wants the next one nearer a camera. I'm only passing it on. |
| 5 | The {vehicle} has hit something else. Log it as "something else". Keep the left lane clear for the Sheriff's truck. |

#### `hit-and-run`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, pedestrian struck on {street}. He's up and he's swearing. {vehicle} left {heading}. Take a statement. |
| 2 | Pedestrian down on {street} and not getting up. Ambulance is rolling. Suspect is {suspect} in a {vehicle}. |
| 3 | Live update. Two down on {street}, one not moving. Bystanders are filming instead of helping. Coroner's on standby. |
| 4 | More pedestrians hit in {district}. Ambulances can't get past the camera trucks. I've asked. They said no. |
| 5 | Bodies on {street}. I've stopped counting and started a list. Every ambulance we own is out. Sheriff's on scene. |

#### `carjack`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, a driver on {street} was pulled out of his {vehicle} by a stranger. He's shaken. Stranger went {heading}. |
| 2 | Carjacking, {street}. Suspect is {suspect}, armed. {vehicle}, {heading}. Owner unhurt. Three units. |
| 3 | We're live. Suspect has changed vehicles on camera. Now in a {vehicle}. Graphics need the new colour. |
| 4 | Suspect is in a fresh {vehicle} on {street}. The last driver's on the kerb, breathing. Director says thanks for the costume change. |
| 5 | New vehicle, {vehicle}, {heading}. That's another one. Sheriff says let them pick, it's good television. |

#### `cop-ram`
| Heat | Call |
|---|---|
| 1 | Unit {unit} reports contact. Somebody hit his cruiser on {street}. He's fine. He's offended. Assist. |
| 2 | Second cruiser rammed in {district}. One deputy hurt. The {vehicle} is doing it on purpose. Box and stop. |
| 3 | We're live and we've lost a cruiser on {street}. Unit {unit}, you're on camera. Fix your hat, then return fire. |
| 4 | Cruiser on its roof, {street}. Crew is out, one of them walking. That's four cars today. The budget office is watching too. |
| 5 | Any unit still with a bumper, {district}. Any unit. The Sheriff's truck is coming through and it does not brake. |

#### `shots`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, shots fired on {street}. Nobody hit that we know of. Go and find out. Carefully. |
| 2 | Shots confirmed, {district}. Suspect is {suspect} in a {vehicle}, armed. Vests on, heads down. |
| 3 | Live. Shots on {street}. You are cleared to return fire. Control room asks: not near the sponsor's billboard. |
| 4 | Shots fired, {street}. Tactical vans rolling. Director wants them from the left. Their left. No. Our left. |
| 5 | More gunfire, {district}. I can hear it from here, and I'm in Northgate. Sheriff's bringing the big truck and a speech. |

#### `killing`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, one person shot on {street}. Not breathing. Suspect is {suspect}, last seen {heading}. Go now. |
| 2 | That's a second body in {district}. Coroner's van is rolling. All units, the suspect is armed and not shy about it. |
| 3 | We're live with a fatality on {street}. Control room says the blur is on. Deputies, you are cleared to shoot. |
| 4 | Another dead on {street}. That's the fourth I've logged. The coroner wants a second van and a quiet word with the Sheriff. |
| 5 | {district} is one crime scene from end to end. I'm out of tape and out of coroners. Sheriff says keep rolling. |

#### `deputy-down`
| Heat | Call |
|---|---|
| 1 | Officer down. Officer down on {street}. Unit {unit} is not answering. All units, drop what you're doing. |
| 2 | Deputy down in {district}. Second one today. Suspect is {suspect} in a {vehicle}. Nobody goes in alone. |
| 3 | Deputy down, live on air, {street}. Control room cut to a sponsor. They've cut back. Return fire. |
| 4 | Two deputies down on {street}. Tactical is going in. The Sheriff has their names. He's reading them out between segments. |
| 5 | We've lost another one in {district}. I knew him. All units, the Sheriff is coming, and he's bringing the cameras for it. |

#### `evade`
| Heat | Call |
|---|---|
| 1 | Unit {unit} lit up a {vehicle} on {street} and it didn't stop. It's {heading}. Stay with it. |
| 2 | The {vehicle} is still not stopping. Twenty seconds now. {district}, {heading}. Units, close the avenues. |
| 3 | That's a pursuit, and that's a show. We are live. {vehicle}, {street}, {heading}. Weapons free. Smile, units. |
| 4 | Roadblock two junctions ahead of the {vehicle}, {street}. Spikes are out. Rifles are out. Director says count them in. |
| 5 | Suspect has outrun everything we own in {district}. Sheriff says clear the lane. He's coming himself. |

#### `outlast`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, that {vehicle} you lost on {street} is still out there. That's ninety seconds. Sending two more. |
| 2 | Three units and nobody has stopped a {vehicle} in {district}. I'm waking the helicopter. Stand by for cameras. |
| 3 | Ninety seconds live and still breathing. Control room wants more. I'm sending the big vehicles. Heads up, {district}. |
| 4 | Suspect is still going after ninety seconds of roadblocks and rifles. I've paged the Sheriff. He was already in the truck. |
| 5 | Still at large in {district}. There is nothing bigger to send. This is all of it. Good luck, everybody. |

#### `theft`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, a parked {vehicle} on {street} has stopped being parked. Owner is pointing. Go where he points. |
| 2 | Stolen {vehicle} in {district}, {heading}, not stopping. Suspect is {suspect}. Two more units to assist. |
| 3 | Live. The stolen {vehicle} is on {street}. The owner is watching the show and has rung in to say "that's mine". |
| 4 | Stolen {vehicle} still rolling, {district}. Owner would like it back without the bullet holes. Noted. |
| 5 | For the record, the {vehicle} is still stolen. It's the least of it now. Sheriff's truck is two minutes out. |

#### `explosion`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, a vehicle's on fire on {street}. Fire crew is rolling. Keep people back. It hasn't gone up yet. |
| 2 | That vehicle on {street} just went up. Windows out on both sides. Two hurt. Suspect left {heading} in a {vehicle}. |
| 3 | Live. Explosion on {street}. Control room wants it again from the helicopter. I told them it only does it once. |
| 4 | Second explosion, {district}. Fire crews are split. A cruiser was parked beside this one. Checking on the crew now. |
| 5 | {street} is burning from one end to the other. Fire chief wants the road. Sheriff wants the shot. Guess who won. |

#### `shoot-out`
| Heat | Call |
|---|---|
| 1 | Unit {unit}, gunfire both ways on {street}. Two parties. Neither of them is us. Wait for a second car. |
| 2 | Shoot-out in {district}. {suspect} against three or four armed men. Let them thin each other out, then go in. |
| 3 | We're live from a firefight on {street}. Deputies are pinned behind their cars. Director says it's the best thing he's shot. |
| 4 | Heavy fire on {street}. Tactical is taking rounds. Two down, one of them ours. The control room has gone quiet. That's new. |
| 5 | Everyone in {district} is shooting at everyone. I can't tell you who's winning. The Sheriff says the ratings are. |

### Idle chatter (tier B)

With heat at zero, one of these plays every 40 to 70 seconds so a stolen cruiser is not silent.

1. Unit {unit}, a pelican has taken a deputy's hat on Heron Walk Drive. No, there isn't a form for that.
2. Any unit near Gateway Boulevard: the tube man at Wahoo World has come loose again. He's in the road, waving.
3. Unit {unit}, noise complaint in Palma Vieja. It's the radio. It's always the radio. Drive past slowly and nod.
4. All units, the Sheriff wants hats on straight today. The show is filming a behind-the-scenes.
5. Unit {unit}, a body's come in on the tide under Gullwing Pier. Been in a while. No rush. Bring gloves.
6. Dispatch to all units. It's ten past three. Windows up. (Plays at 15:10 only.)

## The Sheriff's ticker

| Field | Value |
|---|---|
| Where it shows | The ticker of the LIVE overlay at heat 3 and above. From heat 4 the same lines are spoken on every radio station in place of its programme. |
| When a line plays | On the event in its table, if the player is in view of a deputy or a camera, at the current heat level. One line every 4 seconds at most; extra events are dropped, except `heat:changed`, `heat:cleared` and the `crime` lines, which always play. |
| Idle | With no event for 12 seconds, an idle line |
| Length | 120 characters or fewer after filling |
| Blip | Canon: 120 Hz with a little radio crackle. Add 6 syllables a second and a 15% rise on any sentence that ends in a number. |
| The bleep | He swears on air. The network covers it. Every swear word is written `(bleep)` in the text and sounded as a 1 kHz sine for 250 ms in place of that syllable. His real words are never written anywhere. |
| Theme | Loops at −12 dB under his lines on the radio |

```
Bayhaven Blue theme · 126 bpm · D minor · drums and brass only · tier A
kick   x...x...x...x...        snare  ....x.......x...        hat  x.xxx.xxx.xxx.xx
stab   x..x..x.........        (brass: D minor chord twice, then G minor)
```

### How he talks

1. He is hosting, not policing. He welcomes, teases, thanks sponsors and throws to replays.
2. He talks to "folks" at home. The suspect is "our guest", "tonight's star" or "friend".
3. He never wants it to end. A longer chase is a better show, a body is a ratings point, and a dead deputy is a tribute segment. He is only ever hurt when viewers leave.

### Show opens and steps up: `heat:changed`

| Id | Heat | Tier | Line |
|---|---|---|---|
| D01 | 3 | A | Good evening, Bayhaven, and welcome to Bayhaven Blue: Live. I'm Sheriff Dale Rucker. We have a guest. |
| D02 | 3 | A | We are live. Tonight's star is in a {vehicle} on {street}. Deputies, weapons free. Nobody rehearsed this. |
| D03 | 3 | A | Welcome to the only show where the cast doesn't know it's been cast. Safeties off. Roll the sirens. |
| D04 | 4 | A | This just became Breaking News, folks. Every radio in the county is ours now. Hello, radio. |
| D05 | 4 | A | Roadblocks are going up and so are the numbers. Tactical team, find your light, then find the suspect. |
| D06 | 4 | A | Two helicopters now. One for the suspect, one for my good side. |
| D07 | 5 | A | Folks, I'm getting in the truck. Hurricane Dale has made landfall. Where are my (bleep) keys? |
| D08 | 5 | A | Every unit in Marlin County is on your screen right now. Do not adjust your set. Adjust your seat. |
| D09 | 5 | A | I'm coming for you myself, friend. I'm bringing nine cameras and a shotgun. Mostly the cameras. |

### Viewers rising: `heat:live`

| Id | Heat | When | Tier | Line |
|---|---|---|---|---|
| D10 | 3 | viewers pass 5,000 | A | Five thousand of you watching. Tell a neighbour. Knock on the wall. |
| D11 | 3 | viewers pass 15,000 | B | Fifteen thousand. We've beaten the cooking show. (Bleep) you, Chef. |
| D12 | 4 | viewers pass 50,000 | B | Fifty thousand viewers. That is a stadium, folks, and nobody had to park. |
| D13 | 4 | viewers pass 150,000 | B | {viewers} of you. I'd like to thank the suspect, without whom, none of this. |
| D14 | 5 | viewers pass 250,000 | B | A quarter of a million. I'm told that's everyone in the county and some pets. |
| D15 | 5 | viewers pass 500,000 | B | {viewers}. Folks, I have never been so proud of a crime. |

### Stunts in view

| Id | Event | Heat | Tier | Line |
|---|---|---|---|---|
| D16 | `drift:end` | 3 | A | Sideways through the junction. Judges? I'm the judges. Nine out of ten. |
| D17 | `drift:end` | 3 | A | That's a drift worth {score}, folks. We don't score those. We should score those. |
| D18 | `drift:end` | 4 | A | Round the roadblock, sideways, under fire. Deputies, take notes. That is how you hit a mark. |
| D19 | `drift:end` | 4 | B | Look at that smoke. Somebody get me that on a slow replay with a saxophone. |
| D20 | `drift:end` | 5 | B | They drifted past my truck, folks. My own (bleep) truck. I'm not even angry. Run it back. |
| D21 | `drift:end` | 5 | B | {score} points of drift at Hurricane Dale. That's a season finale, and it's a weeknight. |
| D22 | `jump:landed` | 3 | A | And they're airborne. {distance} metres. Cabin crew, prepare for landing. |
| D23 | `jump:landed` | 3 | A | Up, over and down. The suspension has gone but the dream is alive. |
| D24 | `jump:landed` | 4 | A | {distance} metres through the air, over a roadblock I paid for. Worth every (bleep) cent. |
| D25 | `jump:landed` | 4 | B | Helicopter one, tell me you got that. Helicopter two, tell me you got helicopter one getting that. |
| D26 | `jump:landed` | 5 | B | They jumped it. The whole thing. Holy (bleep). Folks, take a sponsor. I need a minute. |
| D27 | `jump:landed` | 5 | B | {distance} metres. If you land that in my county, you had better wave at the camera. |

### Damage in view

| Id | Event | Heat | Tier | Line |
|---|---|---|---|---|
| D28 | `vehicle:crash` | 3 | A | Ooh. That was not in the script. Is the {vehicle} still moving? It's still moving. |
| D29 | `vehicle:crash` | 3 | A | Contact with a cruiser. That deputy has a family, folks. Names on screen. Spell them right this time. |
| D30 | `vehicle:crash` | 4 | A | Straight through the roadblock. I'd be upset if it didn't look so (bleep) good. |
| D31 | `vehicle:crash` | 4 | B | That's bodywork all over {street}. Some of it's ours. Somebody call Park and Sons. |
| D32 | `vehicle:crash` | 5 | B | They hit my truck. On live television. Camera four, did you get my face? Was I brave? |
| D33 | `vehicle:crash` | 5 | B | Another cruiser gone. We came with forty vehicles, folks. I'm not saying how many we have now. |
| D34 | `prop:broken` | 3 | B | There goes a hydrant. A free water feature, courtesy of our guest. |
| D35 | `prop:broken` | 4 | B | The city will bill somebody for that. Not me. I'm talent. |
| D36 | `prop:broken` | 5 | B | {district} is being redecorated live on air. Bold choices. A lot of open plan. |
| D37 | `vehicle:destroyed` | 3 | A | And it's gone up. That is a real fireball, folks, not an effect. We can't afford effects. |
| D38 | `vehicle:destroyed` | 4 | B | Boom. Roll it back. I want to watch the hood leave. Was anybody in that? Tell me after the replay. |
| D39 | `vehicle:destroyed` | 5 | B | That one was ours. Two deputies. We'll do a tribute. Find a slow song and their good photographs. |

### Gunfire and bodies

The `crime` lines play on a `crime` event of that kind with `seen` true.

| Id | Event | Heat | Tier | Line |
|---|---|---|---|---|
| D40 | `weapon:fired` | 3 | B | Shots fired. Deputies, return it. Folks at home, this is the part you tuned in for. |
| D41 | `weapon:fired` | 4 | B | That's automatic fire on {street}. Listen to that. You can't buy sound like that. Well. We did. |
| D42 | `weapon:fired` | 5 | B | Is that a flare gun? Friend, we have lighting. We brought our own (bleep) lighting. |
| D43 | `crime`, kind `killing` | 3 | A | We have a fatality on {street}, folks. The blur is on. Thoughts, prayers, and we'll be right back. |
| D44 | `crime`, kind `killing` | 4 | B | Another body. That's a real one, folks. Legal says I can't call it a highlight. It's a highlight. |
| D45 | `crime`, kind `killing` | 5 | B | I've lost count of the dead and so has the graphic. Somebody fix the (bleep) graphic. |
| D46 | `crime`, kind `deputy-down` | 3 | B | Deputy down. Deputy down. Stay on him, camera two. He'd have wanted the coverage. |
| D47 | `crime`, kind `deputy-down` | 4 | B | We've lost a deputy, folks. A good man. His name will be on screen as soon as somebody tells me it. |
| D48 | `crime`, kind `deputy-down` | 5 | B | That's another of mine gone. Friend, you are (bleep) with my cast now, and I take that personally. |
| D49 | `crime`, kind `shoot-out` | 3 or 4 | B | It's a firefight on {street}. Deputies are pinned. Viewers are up forty percent. I have mixed feelings. I don't. |
| D50 | `crime`, kind `shoot-out` | 5 | B | Everybody is shooting at everybody. I can't follow it. Nobody can. It's (bleep) magnificent. |

### The crowd, the car and the map

| Id | Event | Heat | Tier | Line |
|---|---|---|---|---|
| D51 | `ped:filming` | 3 | B | Look at the phones come out. Folks at the kerb: hold it sideways, please. Sideways. |
| D52 | `ped:filming` | 4 | B | {count} people filming on {street}, under fire. That's my second unit, and I don't pay them a cent. |
| D53 | `ped:filming` | 5 | B | Everybody's filming. The suspect, the deputies, a man bleeding on a balcony. I love this town. |
| D54 | `vehicle:entered` | 3 | B | Wardrobe change. Our guest is now in a {vehicle}. Graphics, update the caption. |
| D55 | `vehicle:entered` | 4 | B | They've swapped to a {vehicle}. Another one. This show goes through cars like I go through deputies. |
| D56 | `vehicle:entered` | 5 | B | A {vehicle}. At Hurricane Dale. Friend, I admire the confidence. |
| D57 | `district:entered` | 3 or 4 | B | The chase has reached {district}. Property values just moved. Down. They moved down. |
| D58 | `district:entered` | 5 | B | {district} now. Folks, we have shot up half the county. I should sell a map. |
| D59 | `weather:changed` to storm | 3 | B | It's 15:15 and here's the rain. Wet roads, folks. This is when it gets good. |
| D60 | `weather:lightning` | 4 | B | Lightning. I'd like to thank the sky for the free production value. |
| D61 | `weather:changed` to hurricane | 5 | B | A hurricane and Hurricane Dale on one night. One of us has to change names, and it isn't me. |

### Viewers leaving: `heat:live`, falling

| Id | Heat | When | Tier | Line |
|---|---|---|---|---|
| D62 | 3 | viewers under half of peak | A | Where did they go? Camera two? Camera anybody? Folks, don't leave. Something's coming. |
| D63 | 3 | viewers under a fifth of peak | A | We're losing viewers. Deputies, do something interesting. Shoot something. A tyre. Anything. |
| D64 | 4 | viewers under half of peak | A | The suspect has gone quiet. Do not change the channel. This is a dramatic pause. |
| D65 | 4 | viewers under a fifth of peak | B | Come back. Come back, folks. I can do a monologue. I have a monologue. |
| D66 | 5 | viewers under half of peak | B | They've parked. Who the (bleep) parks? You're on television, friend. Respect the medium. |
| D67 | 5 | viewers under a fifth of peak | B | Half a million, and now this. Somebody honk at them. Make them angry. |

### Show ends: `heat:cleared` and `player:knockedout`

The heat is the level the show ended from. The lead always wakes at Bayhaven General; the Sheriff never finds out.

| Id | Event | Heat | Tier | Line |
|---|---|---|---|---|
| D68 | `heat:cleared` | 3 | A | And that's the show. Our guest has left the building, alive, which is a first this week. |
| D69 | `heat:cleared` | 3 | A | They got boring and we lost them. There's a lesson there, folks. I don't know who for. |
| D70 | `heat:cleared` | 4 | A | No arrest tonight, but what a ride. Peak audience {viewers}. I'm Dale Rucker. Lock your doors. |
| D71 | `heat:cleared` | 4 | B | We've lost them. I'm calling it a cliffhanger. Same time tomorrow, friend. Bring the gun. |
| D72 | `heat:cleared` | 5 | A | They're gone. Hurricane Dale has blown out. I'm going to sit in the truck for a while. |
| D73 | `heat:cleared` | 5 | B | Peak audience {viewers}, folks, and not one pair of handcuffs. That's not policing. That's art. |
| D74 | `player:knockedout` | 3 | A | Suspect is down. Suspect is down. Medics, go in. Camera one, go in first. |
| D75 | `player:knockedout` | 4 | B | Got them. A clean shot and a clean ending. Roll credits. Somebody ring Bayhaven General. |
| D76 | `player:knockedout` | 5 | B | Down. Finally. Give it up for tonight's star, folks. They're not getting up. Goodnight, Bayhaven. |

### Idle: sponsor reads

| Id | Heat | Tier | Line |
|---|---|---|---|
| D77 | 3 | B | Bayhaven Blue: Live is brought to you by the Bellweather Group. Building tomorrow, on top of today. |
| D78 | 4 | B | This pursuit is sponsored by SPF 1000. The sun can't see you. The helicopter can. |
| D79 | 5 | B | Tonight's shoot-out is presented by Iguana Insurance. Not covered: any of this. |
| D80 | 3, 4 or 5 | A | If you're just joining us: a {vehicle}, {district}, some gunfire and me. You haven't missed the good part. |

## New names

- The twelve crime kind ids: `collision`, `hit-and-run`, `carjack`, `cop-ram`, `shots`, `killing`, `deputy-down`, `evade`, `outlast`, `theft`, `explosion`, `shoot-out`.
- Placeholders `{unit}`, `{heading}` and `{suspect}`.
- "Dispatch": the dispatcher, who has no other name. "Chef" and "the cooking show": an unnamed rival programme on BHTV 6, mentioned only by the Sheriff.
- The Bayhaven Blue theme and the bleep.
- No new places or brands.
