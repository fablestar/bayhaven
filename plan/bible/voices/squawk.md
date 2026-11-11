# Bible · voices · Squawk

Squawk is the feed in the phone that reacts to what the player just did. This file gives the 15 accounts that post and 200 templates, each keyed to one event from the Events table in `06-tech-architecture.md` plus a condition on the payload or on `state`. Every event in that table is covered at least four times. The feed is built only from events and state, so nothing here needs another lane's internals. People post the way a real city would: they swear, and they post the shootings, the explosions and the bodies too.

Tier: A for 40 templates (the day 6 feed), B for the next 80 (session B-13 grows the feed to 120), C for the last 80.

## How the feed picks a post

|Rule|Value|
|---|---|
|File|`src/content/squawk.js`, one object per row in the shape from `bible/tech/schemas.md`: `{ on, if, who, text, tier }`. The Trigger column is `on` plus `if` in plain words|
|Choice|When an event fires, collect the rows whose `if` passes, drop the row used last time for that event, pick one at random|
|Pace|At most one new post every 20 s. Events marked "quiet" below post at most once every 10 minutes|
|Quiet events|`game:pause` `game:resume` `quality:changed` `save:loaded` `chunk:loaded` `chunk:unloaded` `ui:toast` `ui:prompt` `radio:song` `radio:line` `cash:changed` `followers:changed`|
|Handle rule|A row containing `{handle}` needs 1,000 followers or more. Unless it is a `followers:milestone` row, it also needs Teo as the active lead, because the posts say "he"|
|Pronouns|A row that calls the player he, him, a man, a guy or a boy is skipped while Mags is the active lead. Mission rows and milestone rows are exempt: each already knows who it is about. Rows marked `lead Mags` or `lead Teo` fire only for that lead|
|Darker rows|Row 093 waits for the ambulance and row 113 for a killing someone saw. If the build has no signal for those yet, fire 093 ten seconds after a hard `ped:hit` and 113 on a `crime` whose kind is a killing|
|Missing value|If a slot cannot be filled (no landmark within 300 m, no street name), skip the row|
|Casing|People type lowercase. Institutions (`@BayhavenBlue`, `@thebayhaventide`, `@mallardgreens.hoa`, `@bayhaventomorrow`, `@lawyerlarry`, `@mayorbunny`, `@stormmart`) use normal casing. Keep each row exactly as written|
|Scripted posts|A mission script in `bible/story/` may carry its own Squawk post. That post goes out first. The rows here follow as normal|
|Feed length|Newest first, 30 posts kept, each with the account, the text and the in-game time|

## Placeholders

|Slot|Filled from|
|---|---|
|`{landmark}`|Nearest canon landmark within 300 m of the player|
|`{street}`|Nearest named road from canon section 4|
|`{district}`|`state.world.district`, as its display name|
|`{vehicle}`|Display name of the vehicle in the event, or of `state.player.vehicle`|
|`{score}`|`drift:end` payload, rounded to the nearest 10|
|`{count}`|The event's own count: people filming, followers gained|
|`{handle}`|`@teo.navarro.live`|
|`{viewers}`|`state.heat.viewers`, with thousands separators|
|`{metres}`|`jump:landed` payload, whole metres|
|`{station}` `{song}`|`radio:station` and `radio:song` payloads|

## The 15 accounts

|Handle|Who|How they post|Tier|
|---|---|---|---|
|`@teo.navarro.live`|Teo Navarro|Starts with "okay" or "chat", narrates what he is doing, counts everything in followers|A|
|`@BayhavenBlue`|The Sheriff's show, typed by a producer|Announcer voice. The person being chased is "our guest". Ratings first. Ends on "Stay tuned."|A|
|`@thebayhaventide`|*The Bayhaven Tide* newspaper|Deadpan headlines with one quoted phrase, "Local man"|A|
|`@mallardgreens.hoa`|The homeowners' association|Formal notices, never signed, counts violations|A|
|`@bayhaventomorrow`|The Bellweather Group's campaign account|Cheerful, exclamation marks, admits nothing|A|
|`@lawyerlarry`|Lawyer Larry|Every post is an advert. Phone number 555-0144|A|
|`@stormmart`|Storm Mart head office|Turns weather into stock updates|B|
|`@motelrow.mo`|Mo, night clerk at the Tideline Motel|Lowercase, tired, sees it all from the lobby, never gets involved|A|
|`@visiting.vic`|Vic, a tourist whose holiday never seems to end|Lowercase, delighted, asks questions nobody answers|A|
|`@kiki.halcyon`|Kiki Halcyon|Calm lowercase to her "glow getters". Every post is an affirmation or a product|B|
|`@june.abara`|June Abara|Like a producer: counts, cues, timings. Sharp about Kiki, kind about Teo|B|
|`@gerald.the.pelican`|Gerald. Someone else runs it. Nobody knows who|Short flat sentences about fish, water and his post|B|
|`@lorraine.on.grackle`|Lorraine, retired, Grackle Lane, Mallard Greens|Lowercase with full stops, reports everything, fond of Mags|A|
|`@dockside.del`|Del, crane crew at Rustwater|Lowercase, practical, weights and right of way|B|
|`@mayorbunny`|Mayor Bunny Castellano|Always campaigning, takes credit for sunsets|C|

## The 200 templates

Conditions use payload fields from `bible/tech/contracts.md` and `state` paths. `mission` means the `id` in the mission payload. `to` and `from` are heat levels or setting values in the payload.

|#|Trigger|Account|Post|Tier|
|---|---|---|---|---|
|001|`game:ready`; hour 5 to 10|@mayorbunny|Good morning, Bayhaven! Another perfect day. Vote Bunny.|C|
|002|`game:ready`; hour 10 to 17|@visiting.vic|day 3 of my holiday. still have not found where they keep the shade|C|
|003|`game:ready`; hour 17 to 24|@motelrow.mo|night shift starting. {district}, be normal for one fucking night|C|
|004|`game:ready`; hour 0 to 5|@lorraine.on.grackle|up at 4 again. the damn leaf blower two doors down is also up.|C|
|005|`game:pause`|@visiting.vic|everyone on {street} just went slow motion. is this a local custom|C|
|006|`game:pause`|@lorraine.on.grackle|the whole street slowed right down just now. finally, a sensible pace.|C|
|007|`game:pause`|@gerald.the.pelican|time is slow. fish is slow. good.|C|
|008|`game:pause`|@motelrow.mo|lobby clock just took a full minute to tick once. not fixing it|C|
|009|`game:resume`|@visiting.vic|and now everyone's moving again. this city needs a manual|C|
|010|`game:resume`|@thebayhaventide|Normal speed has resumed on {street}. No cause was given.|C|
|011|`game:resume`|@gerald.the.pelican|fast again. disappointing.|C|
|012|`game:resume`|@dockside.del|crane froze mid-lift for a second there. it does that when it's thinking|C|
|013|`quality:changed`; to low|@lorraine.on.grackle|haze is so thick today the Spire is a rumour.|C|
|014|`quality:changed`; to high|@visiting.vic|air's so clear today i can count the windows on the Spire. lost count at 4,000|C|
|015|`quality:changed`; to medium|@thebayhaventide|Visibility today: fine. County officials decline to promise more.|C|
|016|`quality:changed`|@stormmart|Can't see the horizon? We sell binoculars. Can see it? We sell sunglasses.|C|
|017|`save:loaded`|@motelrow.mo|guest in 12 swears today already happened. charged them for both|C|
|018|`save:loaded`|@lorraine.on.grackle|strong sense i have seen this exact morning before. same car. same bad parking.|C|
|019|`save:loaded`|@gerald.the.pelican|back on the post. the post remembers.|C|
|020|`save:loaded`|@visiting.vic|woke up exactly where i left myself. this never happens at home|C|
|021|`clock:hour`; Monday, hour 6|@mallardgreens.hoa|Reminder: lawn inspections begin at 07:00. Your grass knows what it did.|C|
|022|`clock:hour`; Tuesday, hour 17|@thebayhaventide|Domino league tonight, Domino Park, 6 p.m. Hector is unbeaten since the last hurricane.|C|
|023|`clock:hour`; Wednesday, hour 10|@visiting.vic|cruise ship day! 3,000 of us on heron walk and one (1) bathroom|C|
|024|`clock:hour`; Thursday, hour 22|@dockside.del|tank farm, 11 tonight. bring something loud. you didn't hear it from me|C|
|025|`clock:hour`; Friday, hour 18|@thebayhaventide|Race night at the Speedbowl, 7 p.m. Ear plugs advised within four blocks.|C|
|026|`clock:hour`; Saturday, hour 8|@visiting.vic|farmers' market in domino park. the mangoes are the size of my head. bought four|C|
|027|`clock:hour`; Sunday, hour 16|@lorraine.on.grackle|boat parade at 4. same boats as last sunday. they've turned them around.|C|
|028|`clock:sunset`|@visiting.vic|the sunset here is showing off. 200 photos. keeping all of them|B|
|029|`clock:sunset`|@motelrow.mo|sun's down, neon's on, somebody on {street} is about to make a bad decision|B|
|030|`clock:sunset`|@kiki.halcyon|golden hour is free, glow getters. i'm working on the free part. #glowcamp|B|
|031|`clock:sunset`|@gerald.the.pelican|sun went in the water again. nobody stops it.|B|
|032|`weather:changed`; kind afternoon storm|@motelrow.mo|3:15. right on time.|A|
|033|`weather:changed`; kind clear, after a storm|@visiting.vic|rainbow over {landmark}. the road is steaming. is the road supposed to steam|A|
|034|`weather:changed`; kind humid haze|@dockside.del|it's not the heat. it's the humidity. it's also the fucking heat|B|
|035|`weather:changed`; kind tropical storm|@stormmart|Tropical storm inbound. Plywood is two for one. The noodle is not.|B|
|036|`weather:changed`; kind hurricane|@thebayhaventide|Hurricane warning for all of Marlin County. Lawn furniture is now airborne.|A|
|037|`weather:changed`; kind swamp fog|@visiting.vic|fog on mudcat road so thick i drove through Big Earl twice|B|
|038|`weather:lightning`|@visiting.vic|lightning hit the Spire again. does that charge the building. asking as a tourist|B|
|039|`weather:lightning`|@lorraine.on.grackle|one second between the flash and the bang. bringing the cushions in.|B|
|040|`weather:lightning`|@stormmart|That one was close. Flashlights are in aisle 3. Aisle 3 is the one with power.|C|
|041|`weather:lightning`|@BayhavenBlue|Lightning is not tonight's guest. Stay tuned.|C|
|042|`chunk:loaded`; first visit, landmark in chunk|@bayhaventomorrow|Bayhaven grows every day! So can your mortgage.|C|
|043|`chunk:loaded`; first visit|@visiting.vic|turned a corner and there's a whole new street. was {street} here yesterday|C|
|044|`chunk:loaded`; first visit|@lorraine.on.grackle|they have put up another block near {landmark} overnight. nobody asked me.|C|
|045|`chunk:loaded`; first visit|@thebayhaventide|City confirms {street} "has always been there". Residents unsure.|C|
|046|`chunk:unloaded`|@visiting.vic|looked back at {district} and it was just haze. did i dream it|C|
|047|`chunk:unloaded`|@gerald.the.pelican|if you fly far enough the city stops. i checked.|C|
|048|`chunk:unloaded`|@motelrow.mo|nobody ever comes back from {district} with photos. just saying|C|
|049|`chunk:unloaded`|@lorraine.on.grackle|fog rolled over {district} the minute i left. typical.|C|
|050|`district:entered`; Mallard Greens|@mallardgreens.hoa|A non-resident vehicle has entered Mallard Greens. We see you. Bev sees you.|B|
|051|`district:entered`; Rustwater, in a vehicle|@dockside.del|if you're in rustwater in a {vehicle}: the trucks have right of way. the trucks always have right of way|B|
|052|`district:entered`; Mudcat Glades|@gerald.the.pelican|swamp. bigger birds. i do not go.|C|
|053|`district:entered`; followers 10,000 or more|@lorraine.on.grackle|that {handle} boy is in {district} now. hide your flamingos.|B|
|054|`vehicle:entered`; taken from a driver|@visiting.vic|someone just borrowed my rental {vehicle} on {street}. they waved. i waved back??|A|
|055|`vehicle:entered`; lead Mags, vehicle Manatee|@lorraine.on.grackle|somebody's grandmother just got into a city bus on {street}. on the driver's side.|B|
|056|`vehicle:entered`; vehicle Birdie, Mallard Greens|@mallardgreens.hoa|Golf carts are for residents. This is not a suggestion.|B|
|057|`vehicle:entered`; any boat|@visiting.vic|someone just took a {vehicle} off the dock like it was a shopping trolley|B|
|058|`vehicle:exited`; on a road, speed 0|@thebayhaventide|A {vehicle} has been left in the middle of {street}. Door open. Radio on.|B|
|059|`vehicle:exited`; vehicle in water|@gerald.the.pelican|a car is in my water. remove it.|B|
|060|`vehicle:exited`; followers 10,000 or more|@motelrow.mo|{handle} just parked a {vehicle} outside. on the kerb. on ALL of the kerb|C|
|061|`vehicle:exited`; vehicle on fire|@visiting.vic|somebody bailed out of a burning {vehicle} on {street} and ran like hell. ten seconds later: boom|B|
|062|`vehicle:crash`; speed over 80 km/h|@motelrow.mo|heard that one from the lobby. {street}. holy shit. the {vehicle} is a different shape now|A|
|063|`vehicle:crash`; what is a police vehicle|@BayhavenBlue|A guest has made contact with one of our vehicles. We have it from four angles.|A|
|064|`vehicle:crash`; what is a parked car|@lawyerlarry|Was your parked car hit on {street}? You may be owed money. I may be owed a third.|B|
|065|`vehicle:crash`; Mallard Greens|@mallardgreens.hoa|A hedge on Fairway Drive has been struck. The hedge fund will cover it.|C|
|066|`vehicle:destroyed`|@visiting.vic|a {vehicle} just blew up on {street}. the hood is still in the air. i need a drink|A|
|067|`vehicle:destroyed`|@thebayhaventide|{vehicle} explodes on {street}. Fire crews attend. The Sheriff's camera crew got there first.|B|
|068|`vehicle:destroyed`|@lawyerlarry|Did your car explode? Did you watch a car explode? That's distress. 555-0144.|B|
|069|`vehicle:destroyed`; Rustwater|@dockside.del|scrapyard pays by the kilo. that {vehicle} is all kilo now|C|
|070|`drift:start`|@motelrow.mo|tyres on {street}. here we go|A|
|071|`drift:start`|@lorraine.on.grackle|someone is going sideways on {street}. on purpose.|B|
|072|`drift:start`; hour 22 to 5|@visiting.vic|is the squealing a bird. please tell me it's a bird|C|
|073|`drift:start`; followers 1,000 or more|@june.abara|{handle} sliding through {district}. wide shot, hold three seconds, cut. he knows|B|
|074|`drift:end`; score over 5,000|@motelrow.mo|whoever is drifting past {landmark} rn: marry me|A|
|075|`drift:end`; score over 2,000|@visiting.vic|someone is doing donuts outside {landmark} and honestly? needed|A|
|076|`drift:end`; score under 500|@lorraine.on.grackle|that was not a drift. that was a wobble. {score} points. i counted.|B|
|077|`drift:end`; score over 10,000, lead Teo|@teo.navarro.live|chat. {score} POINT DRIFT. clip is up. please. i have a phone bill|A|
|078|`jump:landed`; metres over 40|@visiting.vic|a {vehicle} just flew over {street}. flew. with a wingspan|A|
|079|`jump:landed`; metres over 20, lead Teo|@teo.navarro.live|okay {metres} metres of air. landed it. mostly. clip's up|A|
|080|`jump:landed`; landed in water|@gerald.the.pelican|a car tried to dive. no technique.|B|
|081|`jump:landed`; from a Big Air ramp|@thebayhaventide|Ramp on {street} "not ours", says city. Third this week.|B|
|082|`prop:broken`; hydrant|@motelrow.mo|free water park on {street}. thank you, mystery driver|A|
|083|`prop:broken`; palm|@visiting.vic|it is raining coconuts on {street}. the brochure did not mention coconuts|B|
|084|`prop:broken`; lawn flamingo|@mallardgreens.hoa|A lawn flamingo has been struck. Flamingos remain prohibited. We are conflicted.|B|
|085|`prop:broken`; café table|@motelrow.mo|someone drove through the café tables on {street}. my coffee left on the hood|B|
|086|`player:spawned`; at Bayhaven General|@thebayhaventide|Bayhaven General discharges local man again. Three bullet holes this time. Staff have named a bed after him.|B|
|087|`player:spawned`; at Pelican Rest|@gerald.the.pelican|the tall one and the small one are home.|B|
|088|`player:spawned`; at the Sheriff's HQ|@lawyerlarry|Another client walks free. Ish. Call Larry. 555-0144.|B|
|089|`player:spawned`|@motelrow.mo|saw the same two people start their day in three different places this week|C|
|090|`ped:hit`|@lawyerlarry|Hurt? Flirt with a lawsuit. Bumped on {street}? That's a flirt.|A|
|091|`ped:hit`; under 50 km/h|@visiting.vic|got clipped by a {vehicle} on {street}. nothing broken. driver didn't even slow down. asshole|A|
|092|`ped:hit`; over 50 km/h|@motelrow.mo|there's a body in the road on {street} and traffic is going round it. welcome to bayhaven|B|
|093|`ped:hit`; over 50 km/h, when the ambulance arrives|@thebayhaventide|Ambulance reaches {street} in six minutes. Sheriff's camera crew: two.|C|
|094|`ped:filming`; lead Mags|@visiting.vic|is that a grandma|A|
|095|`ped:filming`; count 5 or more, lead Teo|@teo.navarro.live|chat there are {count} people filming me right now. tag me. TAG ME|A|
|096|`ped:filming`; count 10 or more|@june.abara|{count} phones out on {street}. it used to be one phone and two of us|B|
|097|`ped:filming`; Mallard Greens|@mallardgreens.hoa|Filming in Mallard Greens requires Form 9-B. Form 9-B does not exist.|C|
|098|`player:knockedout`|@thebayhaventide|Local man left for dead on {street} is alive at Bayhaven General and arguing with the bill.|A|
|099|`player:knockedout`|@kiki.halcyon|being knocked down is the ground offering feedback. rise. hydrate. buy the course.|B|
|100|`player:knockedout`; lead Mags|@lorraine.on.grackle|the bus lady got shot and walked out of General an hour later. what is that woman made of.|C|
|101|`player:knockedout`|@lawyerlarry|Woke up in hospital? Sign nothing. Sign with me. 555-0144.|B|
|102|`player:switched`; to Mags|@gerald.the.pelican|she is back. fish soon.|B|
|103|`player:switched`; to Teo|@june.abara|he's back on camera. three, two. kidding. go|B|
|104|`player:switched`|@visiting.vic|felt like the whole city just looked somewhere else for a second. anyone?|C|
|105|`player:switched`|@motelrow.mo|lady doing tai chi on the beach at dawn. kid asleep on a pool float. related, somehow|C|
|106|`weapon:fired`; pool noodle|@visiting.vic|someone is fighting security with a pool noodle outside {landmark}. the noodle is winning|B|
|107|`weapon:fired`; flare gun|@thebayhaventide|Flare over {district} "not a distress signal", says man in distress.|B|
|108|`weapon:fired`; pistol, SMG or shotgun|@BayhavenBlue|Shots fired in {district}. Units rolling. Cameras rolling first.|B|
|109|`weapon:fired`; pistol, SMG or shotgun, Mallard Greens|@mallardgreens.hoa|Gunfire has been heard inside the gates. Gunfire is classed as amplified music. See rule 9.|C|
|110|`crime`; kind cartheft, seen|@BayhavenBlue|Vehicle taken on {street}. Our next guest is described as "in a hurry". Stay tuned.|A|
|111|`crime`; kind cartheft, not seen|@motelrow.mo|watched someone take a {vehicle} on {street}. no cops around. i saw nothing. posting nothing|B|
|112|`crime`; hit a police vehicle|@lawyerlarry|Hit a cruiser? Legally, it hit you. Call Larry.|C|
|113|`crime`; a killing, seen|@thebayhaventide|Shooting on {street}. One dead. Witnesses filmed it from six angles. Nobody called it in.|B|
|114|`heat:changed`; to 3|@BayhavenBlue|WE ARE LIVE. Tonight's guest is in a {vehicle} on {street}. Deputies are weapons free. Tell a friend.|A|
|115|`heat:changed`; to 4|@thebayhaventide|Breaking: every radio station in Bayhaven is now the same chase.|A|
|116|`heat:changed`; to 5|@BayhavenBlue|Hurricane Dale has made landfall. The Sheriff is in the truck. Repeat: in the truck.|A|
|117|`heat:changed`; to 2|@motelrow.mo|three cruisers just passed the motel. three means somebody's having a shit day|B|
|118|`heat:live`; viewers over 20,000, lead Teo|@teo.navarro.live|chat. {viewers} PEOPLE WATCHING. that is the most people who have ever looked at me|A|
|119|`heat:live`; viewers over 100,000|@kiki.halcyon|a car chase is out-rating my sunrise stream. that's not in my alignment, glow getters|B|
|120|`heat:live`; viewers over 1,000, shots fired|@visiting.vic|the shoot-out on the bar tv is also happening outside the bar. nobody in here has looked up|A|
|121|`heat:live`; viewers over 200,000|@mayorbunny|{viewers} people are watching Bayhaven right now! Tourism is tourism. Vote Bunny.|C|
|122|`heat:cleared`; from 3 or more|@motelrow.mo|they LOST him?? @BayhavenBlue explain|A|
|123|`heat:cleared`; from 3 or more|@BayhavenBlue|Our guest is no longer visible. That's the show. Ratings were strong.|A|
|124|`heat:cleared`; from 5|@thebayhaventide|Sheriff's show ends with 300 rounds fired and nobody caught. Renewed anyway.|B|
|125|`heat:cleared`; from 1 or 2|@lorraine.on.grackle|sirens stopped. either they caught somebody or somebody got boring.|B|
|126|`player:booked`|@BayhavenBlue|Tonight's guest was booked at heat 2. Not our best episode. We'll trim it.|A|
|127|`player:booked`|@lawyerlarry|My client was merely near a car at speed. Out by lunch.|A|
|128|`player:booked`; followers 1,000 or more|@june.abara|{handle} got booked. the mugshot is well lit. i taught him that|B|
|129|`player:booked`; second time in one day|@thebayhaventide|Driver booked, released, booked again. Sheriff's HQ considers a revolving door.|C|
|130|`mission:offered`; mission `repo-woman`|@thebayhaventide|Park & Sons Auto says a developer owes it for 40 cars. Developer: "Which cars?"|B|
|131|`mission:offered`; mission `open-house`|@bayhaventomorrow|Tour our model home this week! Tidy cars only. Dents are turned away at the gate.|B|
|132|`mission:offered`; mission `as-seen-on-tv`|@teo.navarro.live|okay new plan. big plan. mags said no. going live anyway|B|
|133|`mission:offered`; mission `yacht-rock`|@june.abara|yacht club party saturday. tripp says everyone's invited. tripp doesn't know who's invited|B|
|134|`mission:started`; mission `final-notice`|@teo.navarro.live|chat THEY TOWED MY SCOOTER. my whole career is on that scooter|A|
|135|`mission:started`; mission `open-house`|@mallardgreens.hoa|Welcome, tour guests. Please do not touch the lawn. It is resting.|B|
|136|`mission:started`; mission `the-spire-job`|@stormmart|Landfall tonight. We are closed. If you are reading this in our car park, go home.|B|
|137|`mission:started`; mission `going-viral`|@thebayhaventide|Morning after: roads wet, sky clear, the Spire dark. Details on Bayhaven Public Radio.|B|
|138|`mission:step`; mission `repo-woman`, step 4|@visiting.vic|a wahoo being chased by a grouper down {street}. is everything here named after fish|B|
|139|`mission:step`; mission `as-seen-on-tv`, step 3|@june.abara|he's riding the sheriff's stream. 60 seconds, clean, big finish. it's working|B|
|140|`mission:step`; mission `yacht-rock`, step 7|@visiting.vic|man in a floral shirt just jumped off a yacht into a moving speedboat. best free show yet|B|
|141|`mission:step`; mission `the-spire-job`, step 7|@thebayhaventide|Window-cleaning cradle seen coming down the Spire in a hurricane. Occupant waved.|B|
|142|`mission:failed`; mission `final-notice`|@teo.navarro.live|okay scooter update: still gone. morale update: also gone. going again|B|
|143|`mission:failed`; mission `open-house`|@mallardgreens.hoa|An intruder was seen in the clubhouse. The binder is safe. The binder is always safe.|B|
|144|`mission:failed`; mission `yacht-rock`|@june.abara|three guards just walked someone off tripp's yacht. tripp asked if he was the dj|B|
|145|`mission:failed`|@kiki.halcyon|glow getters: a setback is a setup. for my nine-step payment plan|B|
|146|`mission:completed`; mission `final-notice`|@motelrow.mo|a coupe just rammed a tow truck till a scooter fell off. the driver was 60 if she was a day|A|
|147|`mission:completed`; mission `repo-woman`|@thebayhaventide|Three cars vanish from Bellweather properties. Mechanic has "no sons and no comment".|A|
|148|`mission:completed`; mission `open-house`|@mallardgreens.hoa|A golf cart has left the property through the hedge at the 14th green. The hedge will be billed.|A|
|149|`mission:completed`; mission `as-seen-on-tv`|@teo.navarro.live|chat. 5,000 NEW FOLLOWERS. thank you sheriff. thank you helicopter. sorry mags|A|
|150|`mission:completed`; mission `yacht-rock`|@bayhaventomorrow|Mr. Bellweather enjoyed a lovely evening on the bay and is missing nothing. Why do you ask?|A|
|151|`mission:completed`; mission `the-spire-job`|@BayhavenBlue|We have lost the picture. We have lost the bus. Please stand by.|A|
|152|`mission:completed`; mission `going-viral`|@teo.navarro.live|okay so the clip that finally went viral is 14 seconds of mags parking a bus. i'm fine. it's fine|A|
|153|`cash:changed`; the 09:00 brand payment|@teo.navarro.live|okay brand deal landed. it's a soda. i'd like to thank Fizzy Lizard and nobody else|B|
|154|`cash:changed`; gain over $10,000, lead Mags|@lorraine.on.grackle|the bus lady paid for her groceries off a roll of twenties. good for her.|B|
|155|`cash:changed`; hospital bill|@thebayhaventide|Bayhaven General's billing desk is "the one department ahead of schedule".|C|
|156|`cash:changed`; booking charge|@lawyerlarry|They took 10% of your cash? I'd have got it down to five. Meet me first.|B|
|157|`followers:changed`; gain over 500 at once|@teo.navarro.live|chat. +{count} followers in one go. are you all real. please be real|B|
|158|`followers:changed`; total under 1,000|@june.abara|my old streaming partner has 212 followers. i'm one of them. don't tell him|B|
|159|`followers:changed`; gained while live|@BayhavenBlue|Reminder: followers gained during our broadcast are, in spirit, ours.|C|
|160|`followers:changed`; total over 5,000|@visiting.vic|followed the floral shirt guy. no idea what he does. things just happen near him|B|
|161|`followers:milestone`; 1,000|@teo.navarro.live|chat. 1,000 FOLLOWERS. four figures. there's a comma now. mags look|A|
|162|`followers:milestone`; 10,000|@lorraine.on.grackle|ok who is {handle} and why is he on my feed every day|A|
|163|`followers:milestone`; 100,000|@stormmart|{handle} now gets 10% off at Storm Mart. Everyone else gets weather.|B|
|164|`followers:milestone`; 1,000,000|@thebayhaventide|City unveils a statue of a phone in the plaza. Mayor claims to have always supported {handle}.|A|
|165|`shop:opened`; Second Wind Thrift, heat 1 or more|@motelrow.mo|someone ran into second wind thrift in one shirt and walked out in another. cruisers drove right past|B|
|166|`shop:opened`; Storm Mart|@stormmart|Welcome in. Yes, we have plywood. No, not the good plywood.|B|
|167|`shop:opened`; Ventanita Rosa|@visiting.vic|coffee at ventanita rosa is the size of a thimble and i can now see through time|B|
|168|`shop:opened`; Bait & Ballistics|@thebayhaventide|Bait & Ballistics reports strong sales of both. Declines to say which is which.|B|
|169|`property:bought`; Tideline Motel, room 12|@motelrow.mo|someone BOUGHT room 12. you can do that? nobody told me you can do that|B|
|170|`property:bought`; Coral Arcade|@visiting.vic|coral arcade has a new owner. the claw machine is still a liar|C|
|171|`property:bought`; Bellweather mansion|@thebayhaventide|Bellweather mansion sold. Buyers described as "two people and a pelican".|C|
|172|`property:bought`|@bayhaventomorrow|Congratulations on your purchase! We would have built something taller there.|C|
|173|`radio:station`; Bayhaven Public Radio|@lorraine.on.grackle|barbara wetherby's on. everyone hush.|C|
|174|`radio:station`; The Grind 24/7|@kiki.halcyon|you tuned in. the universe noticed. so did my sponsors.|C|
|175|`radio:station`; Swamp Country 94|@dockside.del|swamp country's on in the cab. next song's about a truck. so was the last one|C|
|176|`radio:station`; the scanner|@BayhavenBlue|Someone is listening to our scanner from inside one of our vehicles. It is not one of us.|C|
|177|`radio:song`|@motelrow.mo|"{song}" on {station} again. third time tonight. not complaining|C|
|178|`radio:song`; Tideline 98, hour 0 to 4|@visiting.vic|heron walk drive at 2am with {station} on. i'm never going home|C|
|179|`radio:song`; Bassline FM|@lorraine.on.grackle|car next to me has {station} on so loud my windows are keeping time.|C|
|180|`radio:song`; Radio Palma, Palma Vieja|@visiting.vic|every doorway on calle mural has the same station on. the street is the speaker|C|
|181|`radio:line`; a news line on Bayhaven Public Radio|@thebayhaventide|As heard on Bayhaven Public Radio: a man "driving like that" remains at large.|C|
|182|`radio:line`; a host line on The Grind 24/7|@june.abara|her nine-day cleanse is in its sixth week. i work there. i keep the count|C|
|183|`radio:line`; a Lawyer Larry ad|@lawyerlarry|Heard my ad? That's a verbal agreement. Call Larry. 555-0144.|C|
|184|`radio:line`; a host line on Swamp Country 94|@dockside.del|hoot gibbons just dedicated a song to "whoever's on the expressway in a {vehicle}"|C|
|185|`ui:toast`|@visiting.vic|my phone buzzes every time something happens within 40 metres of me. in this town that's constant|C|
|186|`ui:toast`|@lorraine.on.grackle|phone lit up again. it does that whenever that boy does something.|C|
|187|`ui:toast`|@gerald.the.pelican|a small sign appeared and went away. i did not read it.|C|
|188|`ui:toast`|@motelrow.mo|got a notification that just said "nice". from who. about what|C|
|189|`ui:prompt`; beside a vehicle|@visiting.vic|stood next to a {vehicle} and felt a strong urge to get in. not mine. didn't. proud of me|C|
|190|`ui:prompt`|@gerald.the.pelican|something wants me to press a button. i have no thumbs.|C|
|191|`ui:prompt`; at a shop door|@lorraine.on.grackle|every door in this town looks like it's asking me a question.|C|
|192|`ui:prompt`|@kiki.halcyon|when the universe prompts you, say yes. terms apply.|C|
|193|`waypoint:set`; in Mallard Greens|@mallardgreens.hoa|Someone has asked for directions to Mallard Greens. Directions are for residents.|C|
|194|`waypoint:set`; at Big Earl|@visiting.vic|set my map to big earl. the route is one road and the destination is 30 metres of alligator|B|
|195|`waypoint:set`; at Bayhaven General|@thebayhaventide|Tip: Bayhaven General is on Hospital Road. Most people arrive without directions.|C|
|196|`waypoint:set`; lead Teo|@teo.navarro.live|okay following the little arrows on the road. the arrows have never been wrong. so far|C|
|197|`photo:taken`; Gerald in frame|@gerald.the.pelican|someone took my picture. left side. my good side.|B|
|198|`photo:taken`; at a postcard spot|@visiting.vic|stood in the painted footprints at {landmark} and took the photo everyone takes. love it|B|
|199|`photo:taken`; heat 3 or more|@BayhavenBlue|Our guest has stopped to take a photo. We'll allow it. Good light.|B|
|200|`photo:taken`; lead Teo|@teo.navarro.live|okay new photo up. postcard frame. greetings from bayhaven. greetings!!|B|

## Coverage

|Group|Rows|
|---|---|
|Weather, all six states|032 to 037, plus lightning 038 to 041|
|Weekdays, all seven|021 to 027|
|Follower milestones, all four|161 to 164|
|Final Notice|134, 142, 146|
|Repo Woman|130, 138, 147|
|Open House|131, 135, 143, 148|
|As Seen on TV|132, 139, 149|
|Yacht Rock|133, 140, 144, 150|
|The Spire Job|136, 141, 151|
|Going Viral|137, 152|
|Gunfire nearby|108, 109|
|Someone shot|113|
|An explosion|061, 066, 067|
|A body in the road, then the ambulance|092, 093|
|A shoot-out on the Sheriff's show|114, 120, 124|

Rows 074, 082, 094, 122, 032 and 162 are the samples from `05-content.md`, kept word for word. Row 075 is the sample from `03-characters-and-story.md` with the hotel swapped for `{landmark}`.

## New names

- `@thebayhaventide`, `@mallardgreens.hoa`, `@bayhaventomorrow`, `@stormmart`, `@mayorbunny`: Squawk handles for canon institutions and people.
- `@motelrow.mo`: Mo, the night clerk at the Tideline Motel. Never seen, only posts.
- `@visiting.vic`: Vic, a tourist. Never seen, only posts.
- `@lorraine.on.grackle`: Lorraine, a retiree on Grackle Lane. Never seen, only posts.
- `@dockside.del`: Del, on a crane crew at Rustwater. Never seen, only posts.
- Form 9-B: a form the association requires and does not have.
