# Bible · voices · Signs

Two hundred strings the city shows on boards, windows, bumpers, plates, doors and planks: 40 billboards with full copy, Lawyer Larry's 40 slogans, Attorney Annie's 10 replies, 30 shop-window signs, 30 bumper stickers, 20 licence-plate slogans, 15 notices from the homeowners' association and 15 hand-painted signs in the Glades. Each has a district and a tier. District files carry the short name signs (shop names, street names); this file carries the copy with jokes in it.

Tier: A for 8 strings (the four *Bayhaven Tomorrow* boards, two Larry slogans, two Glades signs). C for 11 that depend on tier C places or people. B for the other 181, loaded by session B-27.

## How signs load

|Rule|Value|
|---|---|
|File|`src/content/signs.js`, one object per string: `{ id, kind, district, text, tier, after }`|
|Pools|Each district draws from the strings tagged with its name plus the strings tagged `any`. The sign atlas draws the text (`atlas.sign`, `atlas.plate`)|
|Line breaks|` / ` in a string is a line break. The first line of a billboard is the headline, drawn largest|
|Fitting|A billboard uses one `wide` atlas cell per line, stacked on the board. A window sign, sticker or Glades sign is one cell. A plate cell is 128 × 32, so the slogan is drawn only when the camera is within 4 m. A notice is drawn small on a `tile` cell; standing within 3 m shows its full text as a caption for 6 s|
|Styles|From `bible/art/kits.md`: Larry and Annie `lightbox`, the association `plaque`, the Glades `paint`, the rest by district|
|Brackets|Text in round brackets is not printed. It tells the builder how the board looks|
|`after`|A mission id. The string shows only once that mission is completed. A string that says "replaces" hides the string it names from then on|
|Casing|Exactly as written here|
|Seeds|Exact positions are in the district files and, for Larry's 40 boards, in `bible/activities/finds.md`. This file fixes the words and the district|

## 1. Billboards: 40

Boards B01 to B10 are the *Bayhaven Tomorrow* campaign. Four stand from the start. Six replace them as the story goes (session B-13).

|#|Advertiser|District and road|Copy|Shows|Tier|
|---|---|---|---|---|---|
|B01|Bayhaven Tomorrow|Tideline, East Strand, on the site fence|Bayhaven Tomorrow / Luxury living where your neighbourhood used to be. / From the low nine hundreds.|From the start|A|
|B02|Bayhaven Tomorrow|Meridian, Coral Boulevard|Bayhaven Tomorrow / The future has a view. / You're standing in it. Please move.|From the start|A|
|B03|Bayhaven Tomorrow|Meridian, Bayline Expressway|Bayhaven Tomorrow / 400 residences. 0 trailers. / A Bellweather Group community.|From the start|A|
|B04|Bayhaven Tomorrow|Tideline, West End, facing Pelican Rest|Opening where you are standing: / Pelican Pointe Residences. / Current residents: thank you for your patience.|From the start|A|
|B05|Bayhaven Tomorrow|Meridian, replaces B02|Bayhaven Tomorrow / Our bylaws are safe, complete and exactly where we left them. / Tours are paused.|after `open-house`|B|
|B06|The Bellweather Group|Northgate, Gateway Boulevard|Have you seen this binder? / Three rings. Labelled "Bylaws". Sentimental value only. / Reward. Call 555-0190.|after `open-house`|B|
|B07|Bayhaven Tomorrow|Meridian, replaces B03|Launch night at the Spire. / By invitation. Key cards will be checked. Twice.|after `yacht-rock`|B|
|B08|The Bellweather Group|Tideline, the Sandpiper Bridge approach|Mr. Bellweather thanks his guests. / He would like a word with one of them.|after `yacht-rock`|B|
|B09|Bayhaven Tomorrow|Tideline, replaces B01|Bayhaven Tomorrow / Postponed. / (Painted underneath by hand: Bayhaven today.)|after `the-spire-job`|B|
|B10|Pelican Rest|Tideline, replaces B04|Pelican Rest / Here before you. Staying after. / (Painted by hand over the old board.)|after `the-spire-job`|B|
|B11|SPF 1000|Tideline, Heron Walk Drive|SPF 1000 / The sun can't see you. / Not available in stores, pharmacies, or daylight.|Always|B|
|B12|SPF 1000|The Islands, Sandpiper Isle gatehouse|You're not sweating. / You're releasing premium moisture. / SPF 1000. Ask Kiki.|Always|B|
|B13|Glow Camp|Tideline, West End|Glow Camp / Nine days. One tent. A whole new invoice. / Sandpiper Isle.|Always|B|
|B14|The Grind 24/7|Palma Vieja, Bayline Expressway|Sleep is a subscription you can cancel. / The Grind 24/7 with Kiki Halcyon.|Always|B|
|B15|Bayhaven Blue: Live|Northgate, Studio Park|Bayhaven Blue: Live / Weeknights on BHTV 6. Possibly your street. / Drive interesting.|Always|B|
|B16|Bayhaven Blue: Live|Runway Flats, the Route 44 ramp|Heat three? Duck. / From there up, our deputies shoot. / Brought to you by Bayhaven Tomorrow.|Always|B|
|B17|Bayhaven Blue: Live|Tideline, Pier Quarter|Sheriff Dale Rucker / "We don't make stops. We make television." / Season five. BHTV 6.|Always|B|
|B18|Storm Mart|Northgate, Gateway Boulevard|Plywood, water, and one remaining pool noodle. / Storm Mart. We were going to close anyway.|Always|B|
|B19|Storm Mart|Rustwater, Dockside Avenue|Hurricane season sale. / It is always hurricane season. / It is always a sale.|Always|B|
|B20|Big Earl's|Northgate, Route 44|Thirty metres of alligator. Zero metres of museum. / Big Earl's. Exit 44.|Always|B|
|B21|Big Earl's|Mudcat Glades, Route 44 north of Mudcat Road|You passed it. / Big Earl's was 2 km back. He saw you go.|Always|B|
|B22|Gator Putt|Tideline, Motel Row|Gator Putt / Eighteen holes. Seventeen alligators. One is on break.|Always|C|
|B23|Low Altitude Airlines|Runway Flats, Terminal Loop|Low Altitude Airlines / Wave to your house on the way. / Now boarding at Bayhaven International.|Always|B|
|B24|Low Altitude Airlines|Rustwater, Bayline Expressway|Legroom is a state of mind. / Low Altitude Airlines. On time, eventually.|Always|B|
|B25|Iguana Insurance|Northgate, Outlet Road|Iguana Insurance / We cover what falls out of trees. / Everything else, ask.|Always|B|
|B26|Manatee Mattress|Northgate, Gateway Boulevard|Sleep like a manatee. / Slow. Heavy. Unbothered by boats. / Manatee Mattress.|Always|B|
|B27|Wahoo World|Northgate, Motel Circle|Wahoo World used cars / Every car has a story. We don't tell it. / Free tube man with every purchase. He is not free.|Always|B|
|B28|Dent-A-Car|Runway Flats, Rental Row|Dent-A-Car / Already dented, so relax. / Rental Row, Bayhaven International.|Always|B|
|B29|Fizzy Lizard|The Paintworks, Factory Avenue|Fizzy Lizard / It's green. It's cold. Stop asking.|Always|B|
|B30|Lightning Bug|The Paintworks, Container Row|Lightning Bug energy drink / Glow from the inside. / Not part of Glow Camp. They keep asking.|Always|B|
|B31|Humid Lager|Rustwater, Container Road|Humid Lager / As refreshing as the air isn't.|Always|B|
|B32|Bait & Ballistics|Northgate, Gateway Boulevard|Bait & Ballistics / One counter for worms. One for everything else. / We don't ask what's biting you.|Always|B|
|B33|Mayor Bunny Castellano|Meridian, City Hall|Re-elect Mayor Bunny Castellano / "I was mayor and the storm left." / Election day: to be confirmed.|Always|C|
|B34|Mayor Bunny Castellano|Palma Vieja, Founders Avenue|Bunny listens. / Call 555-0101. Leave a message. / Bunny listens to messages on Fridays.|Always|C|
|B35|Bayhaven Public Radio|Meridian, Radio Row|Bayhaven Public Radio / The news, read slowly, by the last journalist in town. / Mornings with Barbara Wetherby.|Always|B|
|B36|Cash 4 Jet Skis|Tideline, West End|Cash 4 Jet Skis / You have a jet ski. We have cash. / This doesn't need a slogan.|Always|C|
|B37|The Speedbowl|Runway Flats, Route 44|Friday is race night at the Speedbowl. / Left turns only. Ear plugs at the gate.|Always|B|
|B38|Castaway Kingdom|Mudcat Glades, Mudcat Road|Captain Coconut's Castaway Kingdom / Opening this summer! / (Faded. The year has peeled off. Vines on one corner.)|Always|C|
|B39|Bayhaven General|Northgate, Hospital Road|Bayhaven General / You'll wake up here. Most do. / Bullets out while you wait.|Always|B|
|B40|Squawk|Meridian, The Exchange|Squawk / Something happened. Somebody filmed it. / It's already on Squawk.|Always|B|

## 2. Lawyer Larry: 40 slogans

One slogan per Larry board, 40 boards in all (the 40 to deface). Each board is billboard yellow with Larry pointing, the slogan, and `Larry 555-0144` along the bottom. His rule: a question, then an offer, a rhyme when he can, and nothing admitted. Slogans L01 to L16 go on his 16 boards on Billboard Row, west to east. L17 to L40 go on his boards in the district named.

|#|Slogan|District|Tier|
|---|---|---|---|
|L01|Hurt? Flirt with a lawsuit.|Northgate|A|
|L02|Hurt? Bored? Standing near something? Call Larry.|Northgate|A|
|L03|Did this billboard distract you? Call Larry.|Northgate|B|
|L04|Your face here. Ask Larry how.|Northgate|B|
|L05|Bumper bent? I'll cover your rent.|Northgate|B|
|L06|Slipped? Tripped? Thought about it? Call Larry.|Northgate|B|
|L07|Is it wet? A cheque you'll get.|Northgate|B|
|L08|Did somebody honk at you? That's emotional. Call Larry.|Northgate|B|
|L09|Does your neck hurt? Would you like it to?|Northgate|B|
|L10|Rear-ended? Larry-defended.|Northgate|B|
|L11|Can forty billboards be wrong? Allegedly not.|Northgate|B|
|L12|Why is my face this big? So you remember it.|Northgate|B|
|L13|Chasing an ambulance? I lease one. Hop in.|Northgate|B|
|L14|Read this many of these? That's a relationship. Call Larry.|Northgate|B|
|L15|Did I pass the bar? I pass it daily. Come say hi.|Northgate|B|
|L16|Scared of court? Me too. We'll settle.|Northgate|B|
|L17|Sunburnt? Somebody sold you that sun. Call Larry.|Tideline|B|
|L18|Did a coconut fall on you? Whose palm was it?|Tideline|B|
|L19|Fell off a jet ski? Somebody owns that water.|Tideline|B|
|L20|Stubbed your toe? Whose kerb was it? Call Larry.|Tideline|B|
|L21|Pothole? The city did that to you personally.|Meridian|B|
|L22|Is justice blind? Good. I have billboards.|Meridian|B|
|L23|Lost a loved one? Found a lawyer. Call Larry.|Meridian|B|
|L24|Wrongfully towed? Rightfully towed? Either way. Call Larry.|Palma Vieja|B|
|L25|Not your fault? It never is. Call Larry.|Palma Vieja|B|
|L26|Wet paint on your suit? Whose paint? Call Larry.|The Paintworks|B|
|L27|Shot? Not fatally? Then you can sign. Call Larry.|The Paintworks|B|
|L28|Something heavy land near you? Near counts. Call Larry.|Rustwater|B|
|L29|Wet floor? I won $40,000 for one. The floor was the sea.|Rustwater|B|
|L30|Hurricane damage? Sue the wind. I have.|Rustwater|B|
|L31|Booked? I'll halve it. I'll halve anything.|Northgate|B|
|L32|Talking to a deputy? Talk to a billboard first.|Northgate|B|
|L33|Shot on live television? Ratings are assets. Call Larry.|Northgate|B|
|L34|Woke up at Bayhaven General? Sign nothing. Call Larry.|Northgate|B|
|L35|Flight delayed? Time is money. Mostly mine. Call Larry.|Runway Flats|B|
|L36|Flight cancelled? So are their profits. Call Larry.|Runway Flats|B|
|L37|Rental blew up? Whose rental? Not yours now. Call Larry.|Runway Flats|B|
|L38|Hit by a golf cart? Fore! For you: a settlement.|Mallard Greens|B|
|L39|Nipped by a gator? Call now, heal later.|Mudcat Glades|B|
|L40|Hurt? Flirt with a lawsuit. Marry a settlement.|The Islands|B|

L38 stands outside the Gatehouse, on the public side, because the association will not have it inside. L40 is the last board on the Longspan.

## 3. Attorney Annie: 10 replies

Teal boards, Annie with her arms folded, `Attorney Annie 555-0155` along the bottom. Each one stands on the next pole after the Larry board it answers, or straight across the road from it. All Northgate unless the Larry board is elsewhere. All tier B.

|#|Answers|Reply|
|---|---|---|
|A01|L01|Don't get mad. Get Annie.|
|A02|L16|Larry settled. I don't.|
|A03|L03|Injured reading this sign? Good eyes. Call Annie.|
|A04|L11|Forty billboards. No verdicts. Ask him.|
|A05|L12|My face is the normal size. So are my prices.|
|A06|L13|He leases an ambulance. I have a law degree.|
|A07|L15|I passed the bar once. That is how it works.|
|A08|L14|Still reading his? Read one of mine.|
|A09|L31|He'll halve it. I'd have got the damn thing dropped.|
|A10|L40|End of the road. He's still not a trial lawyer. Call Annie.|

## 4. Shop-window signs: 30

Hand-lettered cards and neon scripts in the windows of canon shops. One per shop front, drawn under the name sign. All tier B. A chain with shops in several districts is tagged `any`.

|#|Shop|District|Sign|
|---|---|---|---|
|W01|Park & Sons Auto|Tideline|No sons. Don't ask.|
|W02|Park & Sons Auto|any|Bullet holes filled. No questions. Cash.|
|W03|Second Wind Thrift|any|New old stock daily. Changing room: no questions.|
|W04|Second Wind Thrift|any|Somebody loved this shirt. Your turn.|
|W05|Maison Sable|Meridian|By appointment. By invitation. By the way, no.|
|W06|Shell Yeah|Tideline|Catch of the day: whatever's left.|
|W07|Ventanita Rosa|Palma Vieja|Coffee $1. Advice free. Opinions constant.|
|W08|Mango Moon|Tideline|Smoothies bigger than your plans.|
|W09|Key Lime Crimes|Tideline|Pie this good should be illegal. Our lawyer says it isn't.|
|W10|Pressed|The Paintworks|Flat sandwiches. Strong opinions.|
|W11|Hush Hour Diner|Tideline|Open 24 hours. Quiet for two of them.|
|W12|Surf & Vinyl|Tideline|Boards and records. Both warp in the sun. No returns.|
|W13|Coral Arcade|Tideline|One dollar, one credit. The claw is doing its best.|
|W14|Storm Mart|any|Yes, we have plywood. Limit: all of it.|
|W15|Bait & Ballistics|Mudcat Glades|Live bait. Live rounds. Please don't mix them up.|
|W16|Frond Memories|Palma Vieja|Flowers for weddings, apologies and palm emergencies.|
|W17|Mullet Over|Tideline|Walk in with hair. Walk out with a decision.|
|W18|Reel Estate|Tideline|Ask about our waterfront worms.|
|W19|Manatee Mattress|Northgate|Try before you buy. Please wake up by closing.|
|W20|Iguana Insurance|Northgate|Come in! Your cover starts when you leave.|
|W21|Cash 4 Jet Skis|Tideline|We buy jet skis. We don't ask whose.|
|W22|Gator Putt|Tideline|Please do not feed hole 7.|
|W23|Sandbar Market|Tideline|Ice. More ice. Ask about our ice.|
|W24|Bean There|Meridian|Coffee for people who have been everywhere else.|
|W25|Scoop Dreams|Tideline|Two scoops minimum. The heat takes one.|
|W26|Dent-A-Car|Runway Flats|Return it with the same dents. We count.|
|W27|Wahoo World|Northgate|Everything must go. Most of it does.|
|W28|Pelican Fuel|any|Pay inside. The pelican is not staff.|
|W29|Low Tide Bar|Tideline|Happy hour is whenever the tide's out.|
|W30|Humidity|The Paintworks|No guns past the rope. Yes, we check. Yes, you too.|

## 5. Bumper stickers: 30

A sticker is a small rectangle on the rear bumper of a traffic car, readable from the chase camera within 8 m. One car in six has one. "Seen on" narrows the vehicles; "any" means any car or truck. Tier B unless marked.

|#|Sticker|Seen on|District|Tier|
|---|---|---|---|---|
|S01|My other car is also a Tarpon.|Tarpon|any|B|
|S02|I brake for flamingos.|any|Tideline|B|
|S03|Honk if the bus lady passed you.|any|any, after 10,000 followers|B|
|S04|Proud parent of a son who got booked on TV.|Grouper|Northgate|B|
|S05|Bayhaven: come for the beach, stay for the traffic.|any|Tideline|B|
|S06|I survived the 15:15. Wet as hell.|any|any|B|
|S07|Mallard Greens resident. Violation pending.|Gallinule, Grouper|Mallard Greens|B|
|S08|I'd rather be at Big Earl's.|Mullet|Mudcat Glades|B|
|S09|Gator on board.|Mullet, Osprey|Mudcat Glades|B|
|S10|This car climbed Mount Seagull.|Possum|Northgate|C|
|S11|Not a tourist. Just lost.|Snook|Runway Flats|B|
|S12|Powered by Lava Abuela.|Pompano|Palma Vieja|B|
|S13|Don't tailgate. I know Larry.|any|Northgate|B|
|S14|Sand in the seats since day one.|Tern|Tideline|B|
|S15|I pull over for the Manatee.|any|Meridian|B|
|S16|My other car blew up on live TV.|Tarpon|Northgate|B|
|S17|My airboat is faster than your car.|Mullet|Mudcat Glades|B|
|S18|Rustwater: we lifted it.|Hogfish|Rustwater|B|
|S19|Union made. Union parked.|Mullet|Rustwater|B|
|S20|I voted for Bunny. I think. It keeps happening.|any|Meridian|C|
|S21|Honk if you're being shot at.|any|any|B|
|S22|Hurricane party survivor.|any|any|B|
|S23|If you can read this, the storm hasn't started.|any|any|B|
|S24|Follow me to the Starlite.|Heron|Northgate|B|
|S25|Dawn Patrol. We walk at five.|Grouper|Mallard Greens|C|
|S26|Don't follow me. Follow @teo.navarro.live.|any|any, after 10,000 followers|B|
|S27|Pelican Rest stays.|any|Tideline, after `open-house`|B|
|S28|Keep Bayhaven humid.|any|The Paintworks|B|
|S29|My husband is live at heat 3. Again.|Pompano|Northgate|B|
|S30|If you can read this, back the fuck off.|Pompano|The Paintworks|B|

## 6. Licence-plate slogans: 20

The small line under the number on a plate. A plate is drawn by `atlas.plate`. The slogan depends on where the car spawns. All tier B.

|#|Slogan|Issued in|
|---|---|---|
|P01|Marlin County · Sunny, with a chance|any|
|P02|Marlin County · Home of the 15:15|any|
|P03|Marlin County · Hurricane tested|any|
|P04|Marlin County · Flat and proud|any|
|P05|Marlin County · Mind the gators|Mudcat Glades|
|P06|Marlin County · Exit 44|Mudcat Glades|
|P07|Bayhaven · Greetings from|Tideline|
|P08|Bayhaven · Where the road steams|Tideline|
|P09|Marlin County · Pelican country|Tideline|
|P10|Bayhaven · Built between storms|Meridian|
|P11|Bayhaven · Mind the dominoes|Palma Vieja|
|P12|Bayhaven · Wet paint|The Paintworks|
|P13|Marlin County · Working waterfront|Rustwater|
|P14|Marlin County · Shade not included|Northgate|
|P15|Bayhaven · Drive interesting|Northgate, on every Sheriff's vehicle|
|P16|Marlin County · Retired and fast|Mallard Greens|
|P17|Bayhaven · Tomorrow|Mallard Greens and Sandpiper Isle, on Sturgeon limos|
|P18|Marlin County · Left lane closed|Runway Flats|
|P19|Marlin County · Sunsets guaranteed|The Islands|
|P20|Marlin County · We'll rebuild|any, after `the-spire-job`|

## 7. The association's notices: 15

All in Mallard Greens, tier B. These are notices served on people and pinned up round the suburb. They are not the twenty rules on the clubhouse board, which are in `bible/world/mallard-greens.md`; rule numbers here point at that list. Sage paper, black type, the association's crest of a duck with a line through it.

|#|Posted|Notice|
|---|---|---|
|N01|A front door, any house|Notice of violation, rule 1. Your lawn measured 6.6 centimetres at dawn. You have 24 hours. We have a ruler.|
|N02|A front door, any house|Notice of violation, rule 2. Your front door has been judged "biscuit". Biscuit is not cream. Repaint, or appeal in writing and in vain.|
|N03|A small sign on a lawn|This lawn is resting. Do not walk, sit, kneel or admire for longer than is necessary.|
|N04|The windscreen of a car parked on a lane|Rule 3. This vehicle stopped moving at 14:02 and is therefore parked. Fine: $40. Doubles when late. Triples with a remark.|
|N05|The clubhouse board, after `open-house`|Mislaid: one binder. Three rings, labelled "Bylaws". Until it is found, every bylaw remains in force from memory. Signed, G. Bellweather, President.|
|N06|The clubhouse board|This month's permitted fun is cancelled. The committee has reviewed last month's fun and found it excessive.|
|N07|A post at Lake Serenity|The alligator is a water feature. Do not name the water feature. (Underneath, in marker pen: Hi, Bylaw.)|
|N08|The Gatehouse window|Dented vehicles, buses and vehicles carrying a flamingo will be turned away. Bev's decision is final. So is Bev's mood.|
|N09|A front door, any house|A gnome was seen leaving your property at 03:10. Under rule 11 this is no longer our concern. It has, however, been noted.|
|N10|A signpost in Phase Four|Phase Four is not empty. Phase Four is patient. Please keep off the future lawns.|
|N11|A mailbox cluster|Reminder: gunfire is classed as amplified music, as are wind chimes. The wind has been informed. So has the Sheriff.|
|N12|The pool gate|Pool hours: 10:00 to 10:45. Floating requires a permit. Permits are issued at the pool, which is closed.|
|N13|A lawn in Model Mile|A body was found on this lawn on Tuesday. The grass beneath it measured 6.2 centimetres and is compliant. Thank you.|
|N14|The violations desk|Appeals are heard on the second Tuesday, 14:00 to 14:05, during the honking. Ask for Ms. Pfeffer. She will sigh. That is not a ruling.|
|N15|The clubhouse board, after `the-spire-job`|The President is unavailable until further notice. Until then, rules will be enforced by habit. Lawns: carry on.|

## 8. Hand-painted signs in the Glades: 15

All in Mudcat Glades. White house paint on planks, sheet metal and one car door, nailed to posts and cypress trunks. Letters lean. Nothing is misspelt; the people who paint these are sharper than the people who read them, and some of them mean it.

|#|Where|Sign|Tier|
|---|---|---|---|
|G01|Mudcat Road, 300 m either side of Big Earl|Big Earl's. Next left. You can't miss him.|A|
|G02|The track to Captain Nilda's dock|Airboat tours. Ask for Nilda. Don't ask where.|A|
|G03|Mudcat Road, at each channel bridge|Gator crossing. They don't look both ways.|B|
|G04|Outside Bait & Ballistics|Bait. Cold drinks. Opinions.|B|
|G05|A post in the channel north of Nilda's dock|No survey markers past this point. We counted.|B|
|G06|A fork in a dirt track|This road floods. That road floods. Pick one.|B|
|G07|The fish camp on stilts|Fresh catfish. Caught this morning. Still angry.|B|
|G08|A dirt track by a cypress dome|Slow down. The frogs are singing.|B|
|G09|A gate on a private track|No trespassing. Warning shots are for people we like.|B|
|G10|Mudcat Road, facing south toward the city|Not draining. Not selling. Not moving.|B|
|G11|A private dock|Private dock. The heron is security. The shotgun is backup.|B|
|G12|Any boardwalk|Mosquitoes: free. Take several.|B|
|G13|The Castaway Kingdom gate|Closed. The vines got the monorail. The vines can keep it.|C|
|G14|The track to Scale & Tail|Scale & Tail gator farm. Hold on to your hat.|C|
|G15|The dish trailer|Dish repair. I only do the big one.|C|

## Counts

|Set|Strings|
|---|---|
|Billboards|40|
|Lawyer Larry slogans|40|
|Attorney Annie replies|10|
|Shop-window signs|30|
|Bumper stickers|30|
|Licence-plate slogans|20|
|Association notices|15|
|Glades signs|15|
|Total|200|

## New names

- Pelican Pointe Residences: the Bellweather Group's name for what it wants to build on Pelican Rest. It only ever exists on a billboard.
- 555-0190: the Bellweather Group's reward line for the binder. 555-0101: the mayor's message line.
- No other new names. Larry's and Annie's numbers, Billboard Row, Bylaw the alligator and the association's rule numbers come from the canon or from `bible/world/northgate.md`, `bible/world/mallard-greens.md` and `bible/story/characters.md`.
