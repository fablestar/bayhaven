# Bible · voices · Street barks

Barks are the one-line subtitles people in the street say when the player does something to them or near them. This file gives 300 lines for ten kinds of people in ten situations, 60 lines for deputies and 40 for shop clerks. Every line is 60 characters or fewer, in normal sentence casing, with a speech blip. People swear when a real person would, and they say what they see: gunfire, explosions and bodies included.

Tier: A for the "car taken" row of the eight day 3 kinds (session D3-S3 needs a driver's complaint) and for 12 deputy lines. C for the vendor, a tier C kind in `bible/systems/people.md`. B for everything else, built by session B-27.

## How barks run

|Rule|Value|
|---|---|
|Files|`src/content/barks.js` (data), run by `src/systems/barks.mod.js`, which watches people through the `peds` public object and events. Deputy lines sit in the same file under `deputy`, clerk lines under `clerk`, by shop and moment|
|On screen|One bark at a time, as a subtitle with a label: `Tourist: This wasn't on the itinerary!` Shown for 2.5 s|
|Range|The speaker is within 12 m of the player. Rain and show-truck barks reach 30 m|
|Cooldowns|4 s between any two barks. 20 s before the same person speaks again. A line is not reused until the other two in its cell have been used|
|Silence|No barks during a `say` or `cutscene` step, while the phone is open, or in a hurricane (nobody is outside). A person who is down says nothing|
|If two fire at once|Car taken, then getting up, then recognising Teo, show truck, nearly hit, bumped, filming, fleeing, horn, rain|
|Placeholders|`{street}` `{district}` `{vehicle}` `{handle}` as in `squawk.md`. `{peak}` is `state.heat.peak` with thousands separators|
|Blip pitch|Tourist 230 Hz, jogger 250, retiree 170, skater 240, office worker 210, dock worker 150, clubber 270, beachgoer 220, vendor 200, security guard 140, deputy 130 with radio crackle, clerk 220|

## The ten situations

|Code|Situation|Fires when|Speaker|
|---|---|---|---|
|S1|Bumped on foot|The player on foot runs into a person at over 2 m/s|That person|
|S2|Nearly hit by a car|A person jumps clear of the player's vehicle|That person|
|S3|Knocked over, getting up|A person gets up after a light hit (under 50 km/h). After a hard hit or a shot they stay down and say nothing|That person|
|S4|Filming you|A person's state changes to film you. One speaker per `ped:filming` event. Line 1: a stunt, crash or chase. Line 2: gunfire, a shoot-out or someone shot in view. Line 3: a body in the road or an ambulance arriving|The nearest person filming|
|S5|Fleeing|A person's state changes to flee. One speaker every 5 s. Line 1: a car or a chase. Line 2: gunfire nearby. Line 3: an explosion|The nearest person fleeing|
|S6|Recognising Teo|Teo is the active lead, within 10 m, followers 10,000 or more, heat 0. Once per person|That person, who also waves or points|
|S7|Rain starting|`weather:changed` to afternoon storm or tropical storm|The two nearest people, 1.5 s apart|
|S8|Their car is taken|`vehicle:entered` on a vehicle that had a driver. The driver speaks once out of the car, then walks off|The driver|
|S9|Hearing the horn|The player's horn within 15 m. Line 3 is only for Mags's Bus Driver Voice (`player:ability`, 30 m), said by a person it has frozen|The nearest person|
|S10|Seeing the show truck|Heat 5 and the Sheriff's show truck within 60 m of the speaker. One speaker every 8 s. Line 3 is for when deputies are firing: a shoot-out on the Sheriff's show|The nearest person not fleeing|

Tier by row: S8 is A for the first eight kinds. Every other row is B (C for the vendor). S6 needs the fame reactions from session B-13.

The reaction table in `bible/systems/people.md` says which kinds shout by default (its code S). This file has a line for every kind in every situation, so any cell of that table can be switched to a bark without new writing. Ids there: `tourist` `jogger` `retiree` `skater` `office` `docker` `clubber` `beachgoer` `vendor`, and `guard` from `bible/world/mallard-greens.md`.

## The 300 lines

### Tourist

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|Oh! Sorry! Is that how you say hello here?|Careful, I'm carrying four souvenirs.|The guidebook said the locals were friendly.|
|S2|Shit! That was closer than the brochure showed!|Is that a ride? Where do I queue?|I felt the wind off that one, you maniac!|
|S3|Ow. Ow. Does travel insurance cover this town?|I'm up. My hat is in another postcode.|Best holiday yet. I think that was a rib.|
|S4|This is going straight to the family chat.|Those are real guns! Why am I still filming?|Is he dead? Oh God, he's dead. Zoom in.|
|S5|This wasn't on the itinerary!|Gunshots! The hotel said this was the nice part!|It blew up! The car just blew the hell up!|
|S6|You're the floral shirt guy! From the phone!|Can I get a photo? My kids follow you.|It's him! Do the thing! Whatever the thing is!|
|S7|The forecast said sunny all week!|Is it 3:15 already?|Warm rain. Even the rain is on holiday.|
|S8|That's a rental! I didn't take the damn cover!|Hey! My deposit!|At least leave the beach towels!|
|S9|Is that for me? I'm walking, I'm walking!|Lovely horn. Very local.|Standing still! Is this a local rule?|
|S10|The truck from the show! Am I on TV?|Hi, Sheriff! We watch you at home!|They're shooting! On TV! Get down, get down!|

### Jogger

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|Watch it, I'm on pace!|You just cost me four seconds, asshole.|On your left. I said on your left.|
|S2|That's my heart rate up, thanks.|The path is for feet, dickhead!|New personal best for jumping sideways.|
|S3|Pausing my run. Pausing my whole damn day.|Nothing's broken. I checked twice. Ow.|Does lying down count as a rest interval?|
|S4|Filming at a jog. That's core work.|Shots fired and I'm filming. What's wrong with me?|Body on my route. I am not stopping my watch.|
|S5|Sprint interval! Unplanned!|Gunfire! Zone five! Zone five!|Explosion! I trained for this! I did not!|
|S6|You're that streamer. You ran past me once.|Hey, Teo! Race you to the pier!|I follow you. Some mornings, literally.|
|S7|Rain's free hydration.|Not stopping. The watch is still going.|3:15 already? I'm behind.|
|S8|Take it. I was running home anyway.|Hey! My good shoes are in there!|That's my car, you prick! I only jog near it!|
|S9|I heard you! I'm doing five-minute kilometres!|Honk again and I'll speed up. Maybe.|Stopped. Fully stopped. Watch paused.|
|S10|If I'm on TV, get my good stride.|The Sheriff's truck. Running the other way.|Deputies shooting. Time to set a record.|

### Retiree

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|Excuse you. I have been bumped by better.|Mind the bag. My bingo winnings are in it.|I have right of way. I've had it since 1974.|
|S2|I've seen better driving on the bumper cars.|Thirty in a thirty zone, you jackass!|Missed me. Most people do.|
|S3|I'm up. Don't fuss. Somebody get that plate.|I've fallen harder at pickleball.|Where's my visor? And where's that little shit?|
|S4|Recording. The association will want this.|Gunfire on a weekday. Straight in the newsletter.|Somebody cover that poor man. I'll keep filming.|
|S5|I'm leaving, but I'm not hurrying.|Shooting! In my day they waited until dark!|That was a car a second ago. I'm going indoors.|
|S6|You're Mags's boy! From the phone!|My whole walking club watches you.|Tell Mags her show beats Dale's.|
|S7|3:15. I set my watch by it.|I said it would rain. I say it every day.|Bring the cushions in!|
|S8|That car has had one careful owner! Me!|The radio's on public radio. Leave it there.|I'm calling Larry, you thieving little bastard!|
|S9|Honk all you like, I'm mid-crossing.|I know a bus horn when I hear one.|Alright, driver, alright. Nobody's moving.|
|S10|Dale's truck! Is my hair alright?|I never miss an episode. Wave, everyone.|Live rounds. He always does that in sweeps week.|

### Skater

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|Whoa. Sidewalk's for everyone.|You just knocked me off a clean line.|No stress. Board's fine.|
|S2|That was a gap, and I was the gap.|Close one. Seven out of ten.|Watch it, asshole! Only I carve here!|
|S3|I've slammed harder on flat ground.|Ow. Shit. Okay. Still got all my teeth.|Board went one way, I went the other. Classic.|
|S4|Filming. Do something worth the clip.|Dude has a gun. This is going in the edit.|That guy's not getting up. Still rolling, though.|
|S5|Nope. Pushing out of here.|Shots! Session's over! Session is so over!|Car just exploded. Too hot. Even for August.|
|S6|Teo! You still owe this town a kickflip!|The stream guy! Film my line!|Saw your chase clip. Solid eight.|
|S7|Wet ground. Session's cooked.|Rain check. Literally.|3:15 storm. Every single day.|
|S8|That's my mum's car! She's going to kill me!|Take the car, leave the board!|Fine. I roll faster than traffic anyway.|
|S9|Loud. Respect.|Moving, moving. Mellow out.|Whoa. My legs just stopped on their own.|
|S10|The show truck. Somebody's having a big day.|Do a trick for the Sheriff. You, not me.|Deputies are shooting. I called in sick for this.|

### Office worker

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|I'm on a call. I'm always on a call.|That was my lunch you just redistributed.|Per my last step, I was walking here.|
|S2|I don't have time to be run over today.|Great. That's going in the incident log.|I have a two o'clock, you maniac!|
|S3|I'll circle back once my legs work.|Setting my status to "hit by a car".|Is this a sick day? It feels like a sick day.|
|S4|Recording this for the group thread.|Shots fired. Finally, a reason to skip the meeting.|There's a body outside the office. Is Monday off?|
|S5|Out of office! Out of office!|Gunfire! This is above my pay grade!|The car exploded! I'm taking my break now!|
|S6|You're the guy my whole floor watches at lunch.|Teo Navarro. My intern never stops quoting you.|Can you shout out the fourth floor?|
|S7|3:15. At least the meeting's indoors.|And my umbrella is at my desk.|There goes the suit.|
|S8|That's a lease, you bastard!|My laptop's in there! Actually, keep it.|I only just found that parking space!|
|S9|Yes, yes, I'm crossing. Send a memo.|Loud and clear. Unlike my manager.|Understood. Holding all movement.|
|S10|If I'm on the show, I was in a meeting.|The Sheriff's truck. My boss sponsors that.|They're shooting on camera. Legal will love this.|

### Dock worker

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|Easy. I've got steel caps on.|Watch where you're swinging yourself.|You'd never pass the yard safety walk.|
|S2|Slower than a forklift and half as careful!|That's a near miss. There's a form for that.|It's hi-vis, you blind bastard! That's the point!|
|S3|Had worse from a swinging hook.|Hard hat worked. The rest of me hurts like hell.|I'm logging that as overtime.|
|S4|Dess has to see this.|Shots on the quay. That's going on the union board.|Man down by the gate. Filming for the safety rep.|
|S5|Not my shift, not my problem!|Gunfire! Clear the damn quay!|Fuel fire! Union rules say run like hell!|
|S6|You're the kid from the stream. Dess knows you.|Hey, phone boy! Mind the cranes!|My daughter follows you. Be sensible.|
|S7|Rain on steel. Watch your step.|3:15. Cranes stop, coffee starts.|Wet containers. Slow afternoon.|
|S8|That's the crew truck, you thieving prick!|My lunch is in the back of that thing!|The steward's going to hear about this!|
|S9|Not louder than a ship. Nice try.|Moving. Trucks have right of way here.|Now that's a horn with seniority. Stopping.|
|S10|Cameras on the quay. Everybody look busy.|Dale's truck. Check its papers at the gate.|Deputies shooting on my dock. I'm not signing shit.|

### Clubber

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|Careful, this outfit took three hours!|Hey, there's a queue. Is this the queue?|You bumped my wristband arm!|
|S2|I did not dress up to be run over, asshole!|Nice lights on that car, though.|Wrong dance floor, driver!|
|S3|Glitter everywhere. Some of it's mine. Ow.|I'm okay! The floor at Humidity hits harder.|Did the bass drop, or did I?|
|S4|This is better than the DJ.|Is that gunfire or the bassline? Filming both.|There's a dead guy outside Humidity. Posting it.|
|S5|Not in these shoes!|Shots! Real ones! Back inside, back inside!|Something blew up! Night's over! Night is over!|
|S6|Teo! Come to Humidity, they'd let you in!|The live guy! We watched you in the queue!|Selfie! Quick, before the doorman looks!|
|S7|My hair had plans tonight.|It's fine. It's wetter inside the club.|Run for the awning!|
|S8|That's our ride home, you dick!|My jacket's in there! It's borrowed!|Fine. We're staying till close anyway.|
|S9|Was that the drop?|Okay, moving! So loud!|I can't move. Is this part of the song?|
|S10|Are we on the show? Is my eyeliner okay?|The Sheriff's truck outside Humidity. Wow.|They're shooting people on TV. Outside. Right there.|

### Beachgoer

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|You kicked sand on my sandwich.|Mind the towel. The towel is a border.|Easy! I'd just got the sunscreen even.|
|S2|Roads are for cars, asshole! Beach is the soft bit!|You nearly parked on my cooler!|That umbrella was holding my spot!|
|S3|Sand in places sand shouldn't know about.|I was lying down anyway. Not like this. Ow.|Shit. That'll bruise right through the tan.|
|S4|Best thing on this beach since the boat parade.|Gunfire on the sand. The tan can wait. Filming.|That's a body by the lifeguard hut. Holy shit.|
|S5|Grab the cooler! Leave the chairs!|They're shooting! Into the water! Go, go!|A car just blew up! Screw the towels!|
|S6|Teo! Is my towel on your stream right now?|The phone guy! Film the sunset, we like those!|You had {peak} watching. I was one of them!|
|S7|3:15. Fold the chairs.|It's warm rain. I'm staying.|Save the towels!|
|S8|My flip-flops are in that car, you bastard!|Take it. It's full of sand anyway.|Hey! I was parked legally for once!|
|S9|We can hear you from the waterline!|You scared a gull off my fries. Thanks, actually.|Nobody move. The horn has spoken.|
|S10|The Sheriff's truck. Hide the cooler.|Am I on TV in my swimsuit? Great.|Deputies shooting on a beach day. Very Bayhaven.|

### Vendor · tier C

Stands at a cart or drives a Pompano with the back open. Found in Palma Vieja, on Heron Walk and at the food-truck yard.

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|You bump it, you bought it.|Careful! Ice pops don't refreeze.|That's two dollars for the bump.|
|S2|Mind the cart, asshole! That's my whole shop!|You owe me for the scare. Cash.|Drive-through costs extra!|
|S3|Cart's fine. I'm not. Prices just went up.|Ow. Dammit. That's my serving arm.|Still open! Still open.|
|S4|Film the cart too. Free advertising.|Shoot-out special: two for one, if you live.|Bodies are bad for trade. Ambulance crews tip, though.|
|S5|Closing early! No refunds!|Gunfire! Save the cart! Screw the stock!|It blew up! Back in five minutes! Maybe never!|
|S6|Teo! Hold my hot sauce up to the camera!|Famous people eat free. Once.|Say the cart's name and the next one's on me.|
|S7|Umbrellas! Five dollars! Six in a minute!|3:15 special: everything's wet.|Ponchos! Get your rain ponchos!|
|S8|My stock's in the back of that, you thief!|You're stealing a van full of mangoes!|Bring it back and I won't charge delivery!|
|S9|Horns scare the customers!|I heard you. The whole market heard you.|Frozen. Like my ice pops. Good horn.|
|S10|Sheriff's truck! Deputies eat free! Nearly free!|Cameras? Hold up the menu.|Bullets flying and I'm out of cold drinks. Shit.|

### Security guard

Stands at gates, hotel doors and car parks: the `guard` kind that `bible/world/mallard-greens.md` adds. This is the bystander guard, with a clipboard and no powers. Guards who fight in missions take their lines from the story files.

|Code|Line 1|Line 2|Line 3|
|---|---|---|---|
|S1|That's a bump. I'm noting the bump.|This is a no-bumping area.|I'll need you to step back one step.|
|S2|Vehicle! Slow your vehicle!|That's a violation. I'm almost sure.|I've got your plate, asshole. Most of it.|
|S3|Guard down. Guard back up. Carry on.|Nobody saw that. Delete that.|I'll write this up when my ribs stop.|
|S4|Recording for the incident report.|Shots fired. I'm unarmed. I'm filming. I'm leaving.|Body on the property. That's three forms.|
|S5|Going for backup! Far away backup!|Gunfire! Not for eleven dollars an hour!|Explosion! Securing the perimeter! From over there!|
|S6|You're on my watch list. And my feed.|Mr. Navarro. No filming. Fine, one selfie.|I follow you. Professionally.|
|S7|Rain's not on the schedule. Reporting it.|The guard hut has a roof. I'll be in it.|3:15. Post moves under the awning.|
|S8|That's the patrol cart! That's my whole job!|Stop! That vehicle is on my clipboard!|Now I have to walk the damn route.|
|S9|Unauthorised horn use!|Understood! Moving! Sorry!|That horn outranks me. Standing by.|
|S10|The Sheriff's here. Stand like you're busy.|Real cameras. Bigger than my cameras.|Real guns. Bigger than my flashlight.|

## Deputies: 60 lines

Deputies work for a television show and know it. From heat 3 they shoot. Label: `Deputy:`. Lines D11, D27 and D56 are only for Mags.

|#|Group|When|Line|Tier|
|---|---|---|---|---|
|D01|Pull over|Heat 1, cruiser within 30 m behind|Pull over! Driver's side to the camera, please!|A|
|D02|Pull over|Heat 1, cruiser within 30 m behind|This is the Marlin County Sheriff. Kerb. Now. Please.|A|
|D03|Pull over|Heat 1, cruiser within 30 m behind|Stop the vehicle! You're not in trouble yet!|A|
|D04|Pull over|Heat 1, hour 17 to 20|Pull over. We've got good light right now.|B|
|D05|Pull over|Heat 1, player slowing|Pull it over! Nice and slow, for the edit!|B|
|D06|Pull over|Heat 1|Pull over and nobody gets shot on television.|B|
|D07|Pull over|Heat 1, player stopped|Engine off, hands up, smile if you like.|B|
|D08|Pull over|Heat 1, after running a red light|You ran that light back there. We have it on tape.|B|
|D09|Pull over|Heat 1|Kerb it, asshole! I've got a quota of one!|B|
|D10|Pull over|Heat 1, 10 s without stopping|Pull over! The Sheriff hates a slow episode!|B|
|D11|Pull over|Heat 1, Mags in a Manatee|Ma'am, the bus too. Especially the bus.|B|
|D12|Pull over|Heat 1, player stopped|Stop right there! Left a bit. Perfect.|B|
|D13|Pull over|Heat 1, player stopped|Step out of the vehicle and find your mark.|B|
|D14|Pull over|Heat 1, 15 s without stopping|Pull over! I'm asking nicely! This is fucking nicely!|B|
|D15|Pull over|Heat 1, deputy at the door|Licence, registration, and sign this release form.|B|
|D16|Pursuit|`heat:changed` to 2|Suspect's running! Dispatch, we have a show!|A|
|D17|Pursuit|Heat 2 or more|In pursuit on {street}! Tell the chopper!|A|
|D18|Pursuit|Heat 2, two cruisers within 20 m|Box it in! Gently, it's a new cruiser!|A|
|D19|Pursuit|Heat 2 or more, in Tideline|Heading for the beach! It's always the beach!|B|
|D20|Pursuit|Heat 3 or more|Stay on that {vehicle}! Viewers are climbing!|B|
|D21|Pursuit|`district:entered` at heat 2 or more|All units, a {vehicle}, heading into {district}!|B|
|D22|Pursuit|Heat 2 or more, cruiser alongside|Ram it! No, wait for the camera! Okay, ram it!|B|
|D23|Pursuit|Heat 4, roadblock ahead|Roadblock at the next avenue! Look sharp!|B|
|D24|Pursuit|Heat 4, spike strip placed|Spike strip's down! Mind your own tyres!|B|
|D25|Pursuit|`heat:changed` to 3|Heat three! Weapons free! Sheriff's orders!|B|
|D26|Pursuit|`weapon:fired` by the player, heat 2 or more|Shots fired! Shots fired! Is the camera on it?|B|
|D27|Pursuit|Heat 2 or more, Mags seen|That's a grandmother! Do not underestimate her!|B|
|D28|Pursuit|A deputy goes down within 40 m|Deputy down! Get an ambulance! And keep rolling!|B|
|D29|Pursuit|`vehicle:crash` into a police vehicle|That was my cruiser! That's coming out of my pay!|B|
|D30|Pursuit|Heat 5|Sheriff says shoot in frame or don't shoot!|B|
|D31|Lost sight|Unseen 3 s|Lost visual. Anyone got visual?|A|
|D32|Lost sight|Unseen 6 s|Dispatch, the suspect has gone boring.|A|
|D33|Lost sight|Unseen 6 s, heat 3 or more|Viewers are dropping! Find that {vehicle}!|A|
|D34|Lost sight|Unseen, player in a car wash|It was right here. There's only a car wash.|B|
|D35|Lost sight|Unseen 6 s|Check under the bridge. They love a bridge.|B|
|D36|Lost sight|Unseen, player parked with the engine off|Was it this car? No. This one's parked nicely.|B|
|D37|Lost sight|Unseen, after a vehicle swap|Could have changed cars. Or shirts. Or both.|B|
|D38|Lost sight|Unseen, after an outfit change|Somebody in a different hat. Can't be them.|B|
|D39|Lost sight|Unseen, heat 3 or more, hour 17 to 20|Chopper's got nothing. Chopper's got a nice sunset.|B|
|D40|Lost sight|Unseen 10 s|Sheriff's going to ask who lost them. Shit. Me.|B|
|D41|Lost sight|Unseen, player in a garage|Garage door's shut. Could be anyone's garage.|B|
|D42|Lost sight|Unseen 10 s|Circle the block. Slowly. For suspense.|B|
|D43|Lost sight|`heat:cleared`|No sign. Calling it. Good hustle, everyone.|B|
|D44|Lost sight|`heat:cleared`, shots were fired|Suspect's gone. Somebody pick up all this brass.|B|
|D45|Lost sight|`heat:cleared` from 3 or more|Dispatch, we've lost the suspect and the audience.|B|
|D46|Booked|`player:booked`|You're booked. Look at the camera. Other camera.|A|
|D47|Booked|`player:booked`, cash taken|That's ten percent of your cash. County rules.|A|
|D48|Booked|`player:booked`|You have the right to a lawyer. It'll be Larry.|A|
|D49|Booked|`player:booked`|Hands where the viewers can see them.|B|
|D50|Booked|`player:booked`|Mind your head. We'll cut that bit if you bump it.|B|
|D51|Booked|`player:booked` at heat 2|Booked at heat two. Lucky. At three we shoot.|B|
|D52|Booked|`player:booked`|Sign here, here, and the release form here.|B|
|D53|Booked|`player:booked`, on the mugshot board|Hold the board up. Chin down. Lovely.|B|
|D54|Booked|`player:booked`, weapons taken|Weapons stay with us. You get a receipt.|B|
|D55|Booked|`player:booked`|You'll be out by lunch. Everyone is.|B|
|D56|Booked|`player:booked`, lead Mags|Ma'am, I'm so sorry about this. Big fan of the bus.|B|
|D57|Booked|`player:booked`|Into the car. Mind the camera cable.|B|
|D58|Booked|`player:booked`, pursuit under 30 s|Next time, run longer. Dale needs the minutes.|B|
|D59|Booked|`player:booked`|Your booking number is the day number. Tidy.|B|
|D60|Booked|`player:booked`, after meeting Larry|Larry's in the lobby. He is always in the lobby.|B|

The booking screen shows two Booked lines in a row, 2.5 s each, before Lawyer Larry's card.

## Shop clerks: 40 lines

Shops are menus over a blurred street, so the clerk is a label and a line at the top of the menu. Label: the shop's name. `bible/catalog/shops.md` gives each shop three lines of its own (a greeting, a sale, and a refusal while a deputy or camera is watching). These 40 are extra lines for five moments: **greet** (`shop:opened`, alternating with the catalog's greeting), **buy** (a purchase is made), **short** (`economy:declined`, the player cannot afford the item), **heat** (`shop:opened` with heat 1 or more; a shop only opens if nobody saw the player walk in) and **famous** (`shop:opened` with 100,000 followers or more and Teo as the active lead). All tier B.

|#|Shop|Moment|Line|
|---|---|---|---|
|C01|Second Wind Thrift|greet|Welcome to Second Wind. Everything's had a life already.|
|C02|Second Wind Thrift|buy|Good pick. Nobody will know you in that.|
|C03|Second Wind Thrift|short|Short at a thrift shop? Come back, hon.|
|C04|Second Wind Thrift|heat|Changing room's at the back. I didn't see shit.|
|C05|Second Wind Thrift|famous|{handle}! That shirt was on your stream last week.|
|C06|Maison Sable|greet|Welcome to Maison Sable. Please look with your eyes.|
|C07|Maison Sable|buy|Exquisite. It is also non-refundable.|
|C08|Maison Sable|short|The thrift shop is two blocks down. No rush.|
|C09|Maison Sable|heat|Sirens are not on our guest list. Be quick.|
|C10|Maison Sable|famous|{handle}. We'd discount it, but we don't do that.|
|C11|Shell Yeah|greet|Shell yeah! What'll it be?|
|C12|Shell Yeah|buy|Order up! Eat it before the gulls notice.|
|C13|Shell Yeah|short|No cash, no conch. Sorry, friend.|
|C14|Shell Yeah|heat|Eat fast. You look like someone's shooting at you.|
|C15|Shell Yeah|famous|{handle}! Ten percent off. Say our name on camera!|
|C16|Ventanita Rosa|greet|Next! Small or very small?|
|C17|Ventanita Rosa|buy|Drink it fast. Then run somewhere.|
|C18|Ventanita Rosa|short|It's one dollar. Come back with one dollar.|
|C19|Ventanita Rosa|heat|One for the road. A fast road, by the look of you.|
|C20|Ventanita Rosa|famous|{handle}! The queue let you skip. Just this once.|
|C21|Park & Sons Auto|greet|Park and Sons. There are no sons. What broke?|
|C22|Park & Sons Auto|buy|Done. Try not to bring it back on a hook.|
|C23|Park & Sons Auto|short|Parts cost what parts cost. Come back flush.|
|C24|Park & Sons Auto|heat|Door's shut. Lights are off. You were never here.|
|C25|Park & Sons Auto|famous|{handle}. Mags says you still can't park.|
|C26|Bait & Ballistics|greet|Bait's on the left. The lethal stuff's on the right.|
|C27|Bait & Ballistics|buy|Good choice. Catches fish or attention.|
|C28|Bait & Ballistics|short|Can't stretch to it? Worms are fifty cents.|
|C29|Bait & Ballistics|heat|I don't hear sirens. I sell too many loud things.|
|C30|Bait & Ballistics|famous|{handle}! Don't film the right-hand wall.|
|C31|Storm Mart|greet|Welcome to Storm Mart. Something's always coming.|
|C32|Storm Mart|buy|That'll float. Probably. Keep the receipt dry.|
|C33|Storm Mart|short|No cash? The weather doesn't take credit either.|
|C34|Storm Mart|heat|Life vests, aisle two. They stop a bullet. Once.|
|C35|Storm Mart|famous|{handle}! Ten percent off. The noodle's on us.|
|C36|Birdbath Car Wash|greet|Welcome to Birdbath. Windows up. Every time, people.|
|C37|Birdbath Car Wash|buy|In you go. Nobody can see you through the foam.|
|C38|Birdbath Car Wash|short|No free baths. The hose out back is a dollar.|
|C39|Birdbath Car Wash|heat|Popular with people in a hurry. Blood is extra.|
|C40|Birdbath Car Wash|famous|{handle}! Wheels are free if you film the sign.|

The Park & Sons lines are Wendell's at the Tideline garage and the young mechanic's at the other two. Birdbath has no clerk: its lines run on the sign's ticker.

## Counts

|Set|Lines|
|---|---|
|Ten kinds × ten situations × three lines|300|
|Deputies: pull over, pursuit, lost sight, booked, 15 each|60|
|Shop clerks: eight shops × five moments|40|

## New names

- None for kinds: the vendor is `vendor` in `bible/systems/people.md` and the security guard is `guard` in `bible/world/mallard-greens.md`.
- `{peak}`: the slot for the highest viewer count so far.
- No new proper nouns. Every person and place named in a line is in the canon.
