# Bible · voices · The phone's browser

The browser is a phone app with twelve small sites, one for each of twelve canon brands and institutions. Each site is a home page and three linked pages of plain text. Nothing here is needed to finish the game. One page changes after mission 18.

Tier: B. Session B-27 builds the app and all twelve sites. The browser is not one of the eight apps in `04-systems.md` section 10, so it is never in the day 9 Mid build.

## How the browser works

|Rule|Value|
|---|---|
|Files|`src/ui/phone/browser.js` (the app, added with `phone.registerApp`), `src/content/web/<site>.js` (one file per site)|
|Site shape|`{ address, title, colours: [paper, accent], pages: { home: { text, links }, <page>: { text, when } } }`|
|Opening screen|A list of the twelve addresses as bookmarks, in the order below, each with its title|
|Address bar|Shows `name.bay` or `name.bay/page`. It cannot be typed in|
|A page|The site's title in the accent colour, then the text in ink `#150f3d` on the paper colour. Each quoted paragraph below is one paragraph on screen. Text is never under 14 px|
|Links|The home page ends with three buttons: the three pages listed under it, in that order, labelled with their bold names. Every linked page has one button: Back|
|`when`|Either `before:<mission id>` or `after:<mission id>`, checked with `missions.done(id)`. Only one page uses it|
|Casing|Exactly as written. Single quotation marks inside a page are part of the text|
|Voices|Each site talks the way its owner does in `bible/story/characters.md`. Do not reword the copy|
|Words|Home pages are 120 to 200 words. Linked pages are 40 to 80|

## 1 · bellweather.bay · The Bellweather Group · tier B

Colours: paper `#fdf6ea`, accent `#2e4a6b`.

**Home** · `bellweather.bay`

> The Bellweather Group. Building tomorrow on top of today.

> Welcome, neighbour. For thirty years the Bellweather Group has looked at Bayhaven and seen what it could become if it were somewhere else. We build towers where there were views, views where there were neighbours, and communities where there used to be people.

> Our founder, Gordon Bellweather, began with one vacant lot and a dream. The lot was not vacant. Today the Group owns the Meridian Spire, Mallard Greens and a growing share of whatever you are looking at.

> Our flagship, Bayhaven Tomorrow, brings 400 luxury residences to the Tideline shore. Friends living on the site have been given 30 days and our warmest regards.

> Is your home in our plans? Not in this phase.

> The Bellweather Group. If you lived here, you'd be moved by now.

**Residences** · `bellweather.bay/residences` · `when: before:the-spire-job`

> Bayhaven Tomorrow, from the low nine hundreds. Phase One is rising in East Strand: three towers, each with a view of the bay, the Spire, and the neighbour's view. Next comes Pelican Pointe, on the site of a trailer park whose removal is pending. Pre-sales are open, neighbour. Bring a cheque. Questions are not in this phase.

**Residences** · `bellweather.bay/residences` · `when: after:the-spire-job`. This is the page that changes.

> This page is resting. Bayhaven Tomorrow is paused while the Bellweather Group helps Marlin County with some paperwork that turned up on a bus. Deposits are under review. So is everything else. Pelican Rest remains exactly where it is. Mr. Bellweather is taking no questions, no calls and, since the storm, no lifts.

**Our promise** · `bellweather.bay/promise`

> Our promise, neighbour. We listen to the community. We have listened. We are building anyway. Every Bellweather project replaces what it removes with something taller. For each palm we move, we plant one, usually nearby. Concerns may be raised at any homeowners' association meeting, where Mr. Bellweather is also the president.

**Careers** · `bellweather.bay/careers`

> Join a team that smiles with every tooth. Now hiring: security (twins preferred), tour guides who can say 'the lawn is resting' without blinking, and one notary who signs quickly. Benefits include a parking space, though not in this phase. Apply at the Spire's service entrance. The front is for buyers.

## 2 · glowcamp.bay · Glow Camp · tier B

Colours: paper `#ffffff`, accent `#5dff9b`.

**Home** · `glowcamp.bay`

> Glow Camp. You are one retreat away from the you who books the next retreat.

> Rise and grind, Glow Getters. I'm Kiki Halcyon: wellness guide, abundance coach, voice of The Grind 24/7 and the reason nine million people feel slightly behind.

> Glow Camp is nine days in white tents on Sandpiper Isle, free of food, phones, clocks and mirrors. We rise at four to thank the sun. Then we hide from it under SPF 1000, the only sunscreen strong enough to make daylight a rumour.

> Every guest leaves lighter. The purse especially. Bring a white outfit and an open card.

> I am in week six of my own nine-day cleanse and I can hear colours.

> Glow Camp. Sleep is a subscription you can cancel. Refunds are outside our alignment.

**Your day** · `glowcamp.bay/day`

> Your day at Glow Camp. 04:00 gratitude. 05:00 standing. 07:00 a talk on abundance; bring your card. 09:00 juice, described. 12:00 hiding from the sun. 15:15 indoor silence, compulsory, while the sky does its detox. 18:00 sharing circle; sharing is filmed. 21:00 sleep, optional. Repeat until glowing or day nine, whichever is billed first.

**SPF 1000** · `glowcamp.bay/spf1000`

> SPF 1000. The sun can't see you. Neither can your problems. One coat blocks sunlight, moonlight and most compliments. Not available in stores, pharmacies, or daylight. Ingredients: confidence, a proprietary shimmer, and other. Keep away from open flame and frying pans. If your bottle smells of cooking oil, congratulations: you are part of a frying ritual.

**Glow stories** · `glowcamp.bay/stories`

> Glow stories. 'I arrived stressed. I left with a tote bag.' A guest. 'Nine days without my phone taught me how much I love my phone.' Another guest. 'Is this the ferry?' A man who was passing. 'I work here and I am completely fine.' June A., staff. Results vary. Invoices are consistent.

## 3 · bayhavenblue.bay · Marlin County Sheriff's Office · tier B

Colours: paper `#fdf6ea`, accent `#ff4fa8`.

**Home** · `bayhavenblue.bay`

> Marlin County Sheriff's Office. Home of Bayhaven Blue: Live.

> Keeping Marlin County safe and on the air, weeknights on BHTV 6.

> A word from the host. 'Welcome back, folks. Sheriff Dale Rucker here, live, as always. Law enforcement has changed. It used to be about paperwork. Now it's about reach. Last season this office featured 212 guests across forty-one episodes, and Sheriff Dale Rucker thinks you know which number the county remembers.'

> How it works. At heat 3 we go live. The helicopter goes up, the chat comes on, the deputies start shooting, and you become tonight's guest. Stay visible. Stay interesting. Hide somewhere dull and the viewers leave, and frankly so do we. Sheriff Dale Rucker asks one thing of a guest: be seen.

> Bayhaven Blue: Live is brought to you by Bayhaven Tomorrow. Live where it happened.

**Report a crime** · `bayhavenblue.bay/report`

> Report a crime. First, ask yourself: was it filmed? Is it still going on? Would it look good from a helicopter? If yes, call the tip line, 555-0110, and stay in frame. If no, there is a form. The form is at headquarters in Northgate, on a desk, in a room that is locked for a taping.

**The heat scale** · `bayhavenblue.bay/heat`

> The heat scale. One, Warm: a deputy asks nicely. Two, Hot: three deputies ask less nicely. Three, Trending: we are live, and so is the ammunition. Four, Breaking News: roadblocks, vans, and every radio station. Five, Hurricane Dale: the Sheriff attends in person, in the truck. Levels one and two are not broadcast. Nobody tunes in for a traffic stop.

**Be in the audience** · `bayhavenblue.bay/audience`

> Be in the audience. Seats are free at the studio in Studio Park, Northgate. Doors at six. Applause signs are compulsory. Please do not wave at guests being booked; they are working. Deputy Wade Purdy is unavailable for photographs and has asked us, in writing, to stop offering.

## 4 · lawyerlarry.bay · Lawyer Larry · tier B

Colours: paper `#ffc300`, accent `#ff5a5a`.

**Home** · `lawyerlarry.bay`

> Lawyer Larry. Hurt? Flirt with a lawsuit.

> Seen my face? It is on forty billboards and it is on this page, larger. I'm Larry. I'm a lawyer. Legally, that is all I have to tell you.

> Have you been hit, shot, bumped, honked at, rained on, startled by a pelican or made to wait? Allegedly? You may be owed money. I may be owed a third of it. Shall we find out together, on the phone, right now? 555-0144.

> I represent drivers, pedestrians, both drivers, the pedestrian's cousin and, on one occasion, the car. Have I ever lost in court? I have never been in court. Both of those are true.

> Is it raining? Allegedly. Did the rain touch you? Then we should talk.

> This page is an advertisement. Your neck does hurt.

**What I do** · `lawyerlarry.bay/services`

> What I do. Fender-benders, gentle and otherwise. Slips, trips and thinking about falling. Bail: once we have met, being booked or patched up at Bayhaven General costs you half. How? Allegedly, I know a man. Papers served, papers received, paper in general. If it happened near you, it happened to you. 555-0144.

**Results** · `lawyerlarry.bay/results`

> Results. $40,000 for a wet floor; the floor was the sea. $12,000 for a coconut. $90,000 for a client shot on live television, who asked for a copy. One client received a boat. It was not his boat before, and nobody is sure whose it was. Past results do not predict future results. I do, and they look great.

**About Annie** · `lawyerlarry.bay/annie`

> About Annie. People ask about Attorney Annie and her twelve billboards. Annie is a fine lawyer who 'goes to court' and 'reads the file'. If that is what you want, I cannot stop you. Legally, I have tried. Her number is not on this page. Mine is. Twice. 555-0144.

## 5 · stormmart.bay · Storm Mart · tier B

Colours: paper `#fff1c9`, accent `#ffa02e`.

**Home** · `stormmart.bay`

> Storm Mart. Something is always coming.

> Welcome to the online home of the only shop in Bayhaven built for exactly one kind of weather. Eight branches across the city, all slightly damp.

> In stock today: plywood, bottled water, life vests, flares, flashlights and one remaining pool noodle. The noodle is at our Northgate branch. Please stop calling about the noodle.

> Out of stock: batteries, the good plywood, patience.

> Ask our staff anything. They have seen every kind of weather and have opinions about most of it.

> We open at seven. We close when the wind tells us to. During a hurricane warning everything is two for one, because by then you can't get here.

> Today's forecast: clear until 15:15. Then not.

> Storm Mart. We were going to close anyway.

**Storm checklist** · `stormmart.bay/checklist`

> Storm checklist. One: water. Two: plywood. Three: a life vest, which we are told also stops a bullet. Once. Four: flares, for signalling, or for starting something. Five: bring the lawn furniture in, or it will leave without you. Six: a pool noodle. It does nothing. You will feel better holding it.

**This week's deals** · `stormmart.bay/deals`

> This week's deals. Monday: ice. Tuesday: bigger ice. Wednesday: ponchos for cruise passengers, at cruise prices. Thursday: plywood offcuts, sold as 'rustic'. Friday to Sunday: whatever floated back. A certain local streamer gets ten percent off once he passes 100,000 followers. We don't know why. Head office insisted.

**Returns** · `stormmart.bay/returns`

> Returns. Items may be returned within 30 days, dry. Plywood with nail holes counts as used. Flares that have been fired count as used. Water you have already swallowed counts as gone. A life vest may be returned if you can show you never needed it. The pool noodle cannot be returned. It has been through enough.

## 6 · bigearls.bay · Big Earl's · tier B

Colours: paper `#f2ddb0`, accent `#3d6b4a`.

**Home** · `bigearls.bay`

> Big Earl's. Thirty metres of alligator. Zero metres of museum. Exit 44.

> Welcome to the best and only reason to stop on Mudcat Road. Big Earl is a 30-metre concrete alligator, built in one summer by people who should have been doing something else. You can drive in one end and out the other. He doesn't mind.

> Inside Earl: a gift shop, a cold-drinks counter, a mirror that makes you look taller, and the echo. Outside Earl: more Earl.

> Owner Gus Thibodeaux is here most days and will tell you Earl's history for free. It changes. That is part of it.

> Real alligators also visit. They are not staff. If one is in your pool, ask Gus about wrangling.

> Big Earl's. You can't miss him. People have tried.

**Visit** · `bigearls.bay/visit`

> Visit. Take Route 44 north to Exit 44, then follow the hand-painted signs. If you reach open water, you have gone too far. If you reach the airport, you were never coming here. Open sunrise to sunset. Driving through is free. Walking through is also free, but Earl looks bigger. Park wherever Earl isn't.

**Gift shop** · `bigearls.bay/shop`

> Gift shop. Earl hats. Earl mugs. A snow globe with Earl in it and no snow, for accuracy. Postcards that say 'Greetings from inside an alligator'. Lava Abuela hot sauce, because Gus lost a bet. Pink lawn flamingos, which Mallard Greens has banned, which is why we stock them. Cash only.

**Earl facts** · `bigearls.bay/facts`

> Earl facts. Length: 30 metres. Teeth: 64, all concrete, one replaced. Weight: nobody has lifted him. Earl has sat through nine hurricanes and one attempt to turn him into a museum. Earl is older than the expressway. Earl has never blinked. A developer once offered to buy the land. Gus showed him the way out, through the tail.

## 7 · bayhaventide.bay · The Bayhaven Tide · tier B

Colours: paper `#f7f3ea`, accent `#150f3d`. A newspaper front page: four short stories, each with a bold first sentence.

**Home** · `bayhaventide.bay`

> The Bayhaven Tide. The news, in and out, twice a day.

> Local man 'driving like that' again. A man described only as 'driving like that' was seen in several districts yesterday. The Sheriff's office says it is 'aware and filming'.

> Developer promises tomorrow. The Bellweather Group says Bayhaven Tomorrow will bring 400 homes to Tideline. Asked about the homes already there, a spokesman smiled with every tooth.

> Storm arrives on time. The 15:15 storm arrived at 15:15. The Tide has now reported this on 11,000 afternoons in a row. Readers are asked to stop writing in about it.

> Pelican returns hat. A pelican known as Gerald has given back a deputy's hat, mostly. The deputy declined to comment. So did the pelican.

> Photographs by Zoom Ziegler, from above.

**Weather** · `bayhaventide.bay/weather`

> Weather. Today: hot. Tonight: warm. Tomorrow: hot. Storm at 15:15 for forty minutes, then a rainbow and steaming roads. Humidity: yes. Hurricane outlook: one is always forming somewhere and thinking about us. Madame Calypso of Northgate predicts rain, and that you will meet a tall stranger. She is only ever right about the rain.

**Classifieds** · `bayhaventide.bay/classifieds`

> Classifieds. For sale: jet ski, lightly shot. Sought: forty cars, last seen on Bellweather property, no questions. Lost: binder, three rings, sentimental. Found: hat, deputy's, slightly pelican. Free to a good home: lawn flamingo, must leave Mallard Greens tonight. Services: Lawyer Larry, 555-0144. His ad appears in every section. He pays for that.

**Corrections** · `bayhaventide.bay/corrections`

> Corrections. Yesterday the Tide said the mayoral election is this year. It is not. The posters are 'ongoing'. We called the Sheriff's show 'a police matter'. It is an entertainment matter. We gave Big Earl's length as 29 metres. He is 30. The Tide regrets the errors, and Gus has been in touch.

## 8 · lowaltitude.bay · Low Altitude Airlines · tier B

Colours: paper `#9fd2ff`, accent `#ff8f7a`.

**Home** · `lowaltitude.bay`

> Low Altitude Airlines. Wave to your house on the way.

> Welcome aboard the only airline that flies out of Bayhaven International and stays where you can keep an eye on it.

> We fly low because the view is better, the fuel is cheaper and our pilots like to read the road signs. Every seat is a window seat if you lean. Every flight follows Route 44 until it runs out, then uses judgment.

> Fares start at $49. Bags are extra. Seats are extra. The safety card is included, though we do ask for it back.

> Nervous flyer? At our height you can always see somewhere to land, and we have used most of them.

> Our punctuality is the best in Marlin County among airlines with our name.

> Low Altitude Airlines. On time, eventually.

**Destinations** · `lowaltitude.bay/destinations`

> Destinations. From Bayhaven International we serve Tangelo (seasonal), Lake Minnow (water landing, bring a towel), Cape Calamity (launch days only, at a distance) and Bayhaven International (scenic loop, twelve minutes, our most punctual route). New this season: wherever the wind is going. Flights to Driftwood begin when the drawbridge comes down.

**Baggage** · `lowaltitude.bay/baggage`

> Baggage. One small bag flies free if it fits under your own seat and you hold it. Wheeled bags are $30. Bags with a broken wheel are $30 and our sympathy. Surfboards, golf clubs and lawn flamingos travel as special items. Pelicans fly themselves. Lost bags come back by Gopher tug, eventually, to somebody.

**Our fleet** · `lowaltitude.bay/fleet`

> Our fleet. One Tropicbird jet, for the brochure. Four Cormorant seaplanes, for the routes. One Sandhill crop duster, for training and, twice, for a wedding. A Pufferfish blimp carries our name over the Speedbowl on Fridays. It takes no passengers. People keep asking. It is a blimp. It goes where it likes.

## 9 · mallardgreens.bay · Mallard Greens Homeowners' Association · tier B

Colours: paper `#f5ecd7`, accent `#b7c9a8`. The rules match `bible/world/mallard-greens.md` section 12.

**Home** · `mallardgreens.bay`

> Mallard Greens. A community of standards.

> Welcome to the official page of the Mallard Greens Homeowners' Association: eighteen holes, four approved colours, twenty rules and one lake.

> Mallard Greens is a gated community. The gate is kept by Bev. Bev has a list. If you are reading this and you are not a resident, Bev already knows. Visitors are welcome by appointment, in a tidy car.

> Life here is simple because the rules are not. Our bylaws fill a three-ring binder kept in the clubhouse office, where they are perfectly safe.

> President Gordon Bellweather was returned to office last year without opposition, discussion or a vote.

> Next: Phase Four, where the streets, driveways and mailboxes are ready and waiting. Houses to follow.

> Mallard Greens. The clubhouse clock is always right. Are you?

**Rules in brief** · `mallardgreens.bay/rules`

> Rules in brief. Lawns: 6.0 to 6.5 centimetres, measured at dawn. Houses: cream, sage, dove or blush. Streets: no parking; a car that stops is parked. Golf carts have right of way over everything. Buses are prohibited, including buses that are only visiting. Flamingo-shaped items require a hearing. The full twenty rules are on the clubhouse board.

**Report a neighbour** · `mallardgreens.bay/report`

> Report a neighbour. Has a lawn grown? Has a door changed colour? Did a bin linger past Monday? Tell us. Reports are anonymous, although we do tell them it was you. Violations officer Dolores Pfeffer reads every report personally and with a sigh. Please allow 24 hours for the ruler.

**Amenities** · `mallardgreens.bay/amenities`

> Amenities. The clubhouse, with a clock that is always right. A pool, for looking at. Pickleball courts, booked until next year. Eighteen holes of golf through the middle of everything. Lake Serenity, with a fountain and one very large alligator. He was here first. He has been sent several letters.

## 10 · iguanainsurance.bay · Iguana Insurance · tier B

Colours: paper `#f7f3ea`, accent `#3fb86a`.

**Home** · `iguanainsurance.bay`

> Iguana Insurance. Cool-headed cover for a warm climate.

> Life in Bayhaven is unpredictable. Cars leave the road. Boats leave the water. Lawn furniture leaves altogether. At Iguana Insurance we believe you deserve a policy that is there for you, right up until something happens.

> Our plans protect your home, car, boat and golf cart against fire, theft and loss, except where caused by weather, water, wind, other people, yourself, or events.

> Why an iguana? Like our namesake we stay very still, we soak up the sun, and on a cold morning we let go and fall out of the tree.

> A quote takes ten minutes. An answer on a claim takes ten to twelve. Our adjusters are local, friendly and trained to look up.

> Iguana Insurance. We cover what falls out of trees.

**Plans** · `iguanainsurance.bay/plans`

> Plans. Basic: covers your car while it is parked, in a garage, with the engine out. Plus: adds driving, on Tuesdays. Premium: adds any hurricane whose name begins with Q. Platinum: everything in Premium, and a fridge magnet. All plans include roadside sympathy, 24 hours a day.

**Make a claim** · `iguanainsurance.bay/claim`

> Make a claim. Step one: stay calm. Step two: was it filmed? Footage from Bayhaven Blue: Live is accepted as evidence, usually against you. Step three: call 555-0122 between 10:00 and 10:20. Step four: an adjuster visits, looks at the damage, looks at the sky and says 'weather'. Step five: see Exclusions.

**Exclusions** · `iguanainsurance.bay/exclusions`

> Exclusions. We do not cover damage caused by rain, wind, sun, the 15:15 storm, hurricanes, hydrants, coconuts, alligators, pelicans, gunfire, explosions, buses driven by retired bus drivers, chases, being chased, being near a chase, or watching one on television. We do cover anything that falls out of a tree, provided it is an iguana.

## 11 · castawaykingdom.bay · Captain Coconut's Castaway Kingdom · tier B

Colours: paper `#ffc98f`, accent `#3d6b4a`. The cheerful text is old. The county's notes were added later and are drawn in grey italics.

**Home** · `castawaykingdom.bay`

> Captain Coconut's Castaway Kingdom. Opening this summer!

> Ahoy, castaways! Captain Coconut here with big news. The first and only theme park in the Glades opens its gates this summer, and you are invited!

> Ride the Coconut Cannon! Drift round the Lazy Lagoon! Take the monorail all the way from the car park to the other car park! Meet me, Captain Coconut, at the gate every day at noon. I am a man in a coconut. The suit is very warm.

> Tickets go on sale soon. Check back often. We update this page every week!

> Last updated: a summer, some time ago.

> Notice from Marlin County: this page stays online by court order while the park's ownership is settled. The gate on Mudcat Road is shut. The vines are not a ride.

**Rides** · `castawaykingdom.bay/rides`

> Rides. The Coconut Cannon: you are the coconut. The Lazy Lagoon: a gentle boat ride, now a real lagoon. The Shipwreck: it was meant to look like that. The monorail: twelve minutes end to end or, since the vines, indefinitely. Height limits apply. So does the tide table.

**Park map** · `castawaykingdom.bay/map`

> Park map. Main Gate, on Mudcat Road. Castaway Plaza. Coconut Cove. The Lagoon. The Other Lagoon, which was not planned. Monorail stations: Gate, Cove, and one in the North Glades that the track never reached. You are here. Nobody else is. A heron lives in the ticket booth and does not sell tickets.

**Jobs** · `castawaykingdom.bay/jobs`

> Jobs. Now hiring for our grand opening! Ride operators! Coconut vendors! A second Captain Coconut for the Captain's days off! Apply in person at the Main Gate. Note from Marlin County: nobody is hiring. Please do not apply at the gate. The man in the coconut suit left years ago. If you see him, he is not ours.

## 12 · cityofbayhaven.bay · City of Bayhaven · tier B

Colours: paper `#fdf6ea`, accent `#ff4fa8`.

**Home** · `cityofbayhaven.bay`

> City of Bayhaven. The official page of Mayor Bunny Castellano's city.

> Welcome to Bayhaven: ten districts, one bay, and a sunset the city takes full credit for.

> A word from the mayor. 'Bunny Castellano! Have we met? I have been your mayor for as long as anyone can check. I was here before the potholes and I will be here after them. People ask when the election is. I say every day is an election if you campaign hard enough.'

> City services are at City Hall, on the plaza with the fountain. Please take a number. The numbers are decorative.

> City news: the fountain is working. The palms on Coral Boulevard have been counted and it is most of them. The block that appeared overnight on the east side has always been there.

> Bayhaven. Sunny, with a mayor.

**Services** · `cityofbayhaven.bay/services`

> Services. Potholes: report one and it is added to the map as a landmark. Permits: needed for building, filming and standing still on Heron Walk. Parking fines may be paid in person or ignored at your own pace. Hurricanes: the city's official position is against. Shootings: see BHTV 6, weeknights.

**Visit Bayhaven** · `cityofbayhaven.bay/visit`

> Visit Bayhaven. See the Meridian Spire, 260 metres of somebody else's money. Ride the ferris wheel on Gullwing Pier. Eat at a window in Palma Vieja. Drive the Longspan at sunset. Drive through Big Earl. Bring sunscreen, a poncho for 15:15 and a phone. You will want to film. Everyone here does.

**Vote Bunny** · `cityofbayhaven.bay/vote`

> Vote Bunny. Experienced. Visible. Already on the posters. Bunny's promises: more shade, fewer cones, and a second fountain if the first one behaves. Bunny's record: the sunset has happened every day of Bunny's term, and the last storm left while Bunny was mayor. Election day: to be confirmed. Bunny: confirmed.

## New names

- The twelve addresses: `bellweather.bay`, `glowcamp.bay`, `bayhavenblue.bay`, `lawyerlarry.bay`, `stormmart.bay`, `bigearls.bay`, `bayhaventide.bay`, `lowaltitude.bay`, `mallardgreens.bay`, `iguanainsurance.bay`, `castawaykingdom.bay`, `cityofbayhaven.bay`.
- Pelican Pointe: Bellweather's name for what he wants to build on Pelican Rest (also in `signs.md`).
- Coconut Cannon, Lazy Lagoon, The Shipwreck, Castaway Plaza, Coconut Cove: rides and places inside Castaway Kingdom. None can be visited; only the gate exists, at tier C.
- 555-0110: the Sheriff's tip line. 555-0122: Iguana Insurance claims.
