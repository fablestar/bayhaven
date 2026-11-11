# Bible · voices · Screens

What plays on the screens in the world: 12 episodes of *Bayhaven Blue: Live* for shop-window televisions, 10 films made of shapes for the Starlite Drive-In, 10 television ads as caption cards, and attract-mode text for 3 cabinets and the claw machine in Coral Arcade. Everything is text or flat shapes drawn on a canvas, so a screen costs one small texture.

Tier: B for the televisions, the 12 episodes, the 10 ads, films F01 and F02 and all four machines (sessions B-27 and B-20). C for films F03 to F10.

## How screens run

|Screen|Canvas|Loop|
|---|---|---|
|Shop-window television|160 × 90, redrawn twice a second, only within 30 m of the player|BHTV 6 ident (2 s), listing card (6 s), cold open card (5 s), one ad (10 s), then the next ad, then repeat|
|The Starlite screen|300 × 140, matching the 30 × 14 m screen at 10 units a metre, redrawn every frame within 250 m|Title card (4 s), six shots of 6 s each, "The end" (2 s), then the next film|
|Arcade cabinet|256 × 224 in chunky pixels, as in `bible/activities/minigames.md`|Four attract screens in order, then repeat|

|Rule|Value|
|---|---|
|Files|`src/content/screens/episodes.js`, `films.js`, `ads.js`, `attract.js`. One object per item|
|Where televisions are|Any shop front the district kit gives a window set. Always: a pile of three old sets in each Second Wind Thrift window, one over the counter at Hush Hour Diner, one beside the doors of the Sheriff's HQ|
|Which episode|One a day, in order, cycling through the episodes that have joined. E01 to E10 are in from the start. E11 and E12 join when their mission is done|
|While heat is 3 or more|Every television drops the rerun and shows one card: `Live · {viewers} watching · {district}`, pink on ink, updated each second|
|Sound|A cold open is spoken as the Sheriff's blips (120 Hz, radio crackle) only within 10 m. Films and ads are silent. When a film ends, parked cars at the Starlite honk|
|Colours|Ink `#150f3d`, white `#fdf6ea`, and the neon set from `07-art-and-audio.md`: pink, cyan, violet, orange, mint, red|
|Casing|Exactly as written|

## 1. Bayhaven Blue: Live, season five: 12 episodes · tier B

The listing card shows `Tonight on BHTV 6`, the episode number, the title and the blurb. The cold open card shows the Sheriff's line in quotation marks over a teal band. He is always on air, names a sponsor or a segment when he can, and calls the people he chases guests, including the ones his deputies shoot. Cold opens are 90 characters or fewer.

|#|Title|Cold open|Blurb|Joins|
|---|---|---|---|---|
|E01|Pilot, Again|Welcome back to Bayhaven Blue: Live. Season five. Same Sheriff, bigger truck.|Season five opens the way season one did: a golf cart, a pursuit at walking pace, and 48 minutes nobody could turn off. The Sheriff finds the helicopter shot and never lets go of it. Brought to you by Bayhaven Tomorrow.|From the start|
|E02|The Slow Chase|Tonight's guest is doing 20 in a 60. Folks, we have time to get to know him.|A ride-on mower leads six cruisers down Gateway Boulevard, cutting as it goes. Deputies jog alongside with a microphone. The guest stops for coffee twice and is featured both times. Segment: Meet the Guest.|From the start|
|E03|Sweeps Week|It's sweeps week, Bayhaven. Deputies are weapons free and so, folks, is Dale.|Ratings month. The Sheriff drops the shooting rule to heat three "for pace". A parking dispute on Gateway Boulevard becomes a nine-minute shoot-out with two helicopters. Four cruisers burn. Nobody is featured. Viewers double.|From the start|
|E04|Gator in the Galleria|Tonight's guest is three metres long and has no pockets. Roll it.|An alligator rides the escalator at Galleria Flamingo. Deputies build a roadblock out of shopping trolleys. Gus Thibodeaux turns up with a chicken on a rope and walks off with the episode.|From the start|
|E05|Car Wash|The guest went into a Birdbath Car Wash, folks. We lost him, and forty thousand of you.|A fine heat 4 pursuit ends when the guest drives into a car wash and comes out clean, calm and impossible to recognise. The Sheriff interviews the foam. Segment: Where Did He Go.|From the start|
|E06|Roadblock Party|That's a roadblock, folks. We built it during the ad break.|Six avenues closed, one spike strip laid, and nobody comes. The deputies wait. Somebody fetches a grill. By the second ad break it is a street party, and the guest goes by one street over.|From the start|
|E07|Nothing to See Here|Tonight nothing happens, and Sheriff Dale Rucker films every minute of it.|A quiet night. A deputy eats at Bun Voyage. A traffic light changes. The Sheriff reads viewer mail aloud. It is the third most watched episode of the season and nobody has explained why.|From the start|
|E08|The Deputy Who Blinked|Deputy Purdy asked not to be on camera. So here, live, is Deputy Purdy.|Deputy Wade Purdy tries to do ordinary police work with a camera crew behind him. He writes one ticket, finds one lost bicycle and looks into the lens exactly once. The chat names him Deputy Sigh.|From the start|
|E09|A Word From Our Sponsor|This pursuit is brought to you by Bayhaven Tomorrow. Live where it happened.|The guest cuts through a Bayhaven Tomorrow building site and the Sheriff stops the chase to read out the brochure. Mr. Bellweather phones in. The pursuit resumes after a short tour of the show home.|From the start|
|E10|Clip Show|Budget's tight, folks, so tonight: the very best of last Tuesday.|Highlights. The mower. The alligator. The foam. The shoot-out, from all six angles. New footage: the Sheriff watching the old footage and laughing at his own lines. Segment: Dale's Top Ten, of which there are six.|From the start|
|E11|Keep the Grandma|Is the grandma still trending? Keep the grandma.|A retired bus driver in driving gloves takes a city bus through three roadblocks and indicates at every turn. The viewers take her side. So, off air, does the Sheriff, who asks if she is free on Thursdays.|after `as-seen-on-tv`|
|E12|Season Finale: Landfall|There's a hurricane coming and a bus on Dale's street. Roll cameras.|The whole county watches the show truck chase a bus through the storm, firing as it goes, until the picture breaks up at Gullwing Pier. BHTV 6 lists the last eleven minutes as "weather". The episode has no ending. Neither does the season.|after `the-spire-job`|

## 2. The Starlite: 10 films made of shapes

Units are screen units: `x` 0 to 300 left to right, `y` 0 to 140 bottom to top. The ground line, where a shot has one, is a white box 300 × 1 at `y = 20`. A circle is a flat disc given by its radius. A square or box is given by width × height. A triangle is a three-sided disc. A half-disc is the top half of a circle. An arc is the top half of a ring 2 units thick. Shapes move in straight lines at steady speed unless the shot says hop (a half-sine, 0.4 s) or roll (the disc carries a dot so the spin shows). Background is ink. Cuts are hard. Tuesday at 20:00 is two for one: F01 then F02.

### F01 · Triangle Meets Circle · tier B

1. Ground line. A pink circle, radius 8, rolls in from the left edge to `x = 100` and stops.
2. A cyan triangle, radius 10, slides in from the right edge to `x = 200`. Both hold still for 2 s.
3. The circle rolls to `x = 180`. The triangle hops twice, 6 units high.
4. Rain: 20 white boxes 1 × 6 fall. The triangle slides over the circle and stops 4 above it, as a roof.
5. Rain stops. An orange circle, radius 40, rises behind them until half shows above the ground line.
6. Circle and triangle leave to the right side by side at the same speed. The sun stays.

### F02 · Square Goes Alone · tier B

1. Ground line. Five violet squares 14 × 14 stand in a row from `x = 40` to `x = 140`. An orange triangle, radius 3, appears at `x = 290`.
2. The triangle grows to radius 10 as it slides to `x = 220`. The five squares shuffle 4 units left.
3. Close: the triangle at `x = 190` faces the largest square at `x = 130`. A white circle, radius 4, rolls between them and off.
4. The triangle tips 30 degrees forward. The square leans back 15 degrees.
5. The triangle spins once. All five squares jump 30 units up and land in a new order.
6. The triangle settles point up on top of the last square, as a roof. An orange sun circle sets behind the row.

### F03 · The Long Rectangle · tier C

1. A mint box 60 × 14 with two ink circles, radius 4, as wheels drives right along the ground line. Violet boxes of mixed heights scroll left behind it.
2. It stops at a white box 1 × 20 (a pole). Four small pink squares 5 × 5 hop into it one at a time and vanish.
3. The background dims. Two orange circles, radius 2, light up on the front of the box.
4. The ground line and the box tilt 10 degrees uphill. The box slows to half speed. The wheels' dots spin twice as fast.
5. The line levels. An orange circle, radius 30, rises ahead. The box stops. The four squares hop out and stand in a row.
6. The box reverses between two orange boxes 3 × 5 and stops exactly centred. Hold for 2 s.

### F04 · The Square Job · tier C

1. Ten violet boxes 20 × 10 stacked into a tower at `x = 150`. The top one is orange.
2. A cyan square 6 × 6 climbs the left side of the tower, one box every half second.
3. Two red circles, radius 4, roll back and forth across the top. The square waits one box below until both face away.
4. The square swaps places with the orange box. Every violet box blinks red three times.
5. The square and the orange box fall the height of the tower and land on a mint box 60 × 14, which drives off to the right.
6. The red circles roll off the top after them, bounce twice and shrink to nothing.

### F05 · Something in Lake Serenity · tier C

1. A mint box fills the bottom third. On it, a cyan box 120 × 30 (the lake) and four white squares 8 × 8 (houses). A white circle, radius 3, with an orange box beak crosses the lake.
2. Two mint circles, radius 3, rise out of the cyan behind it. The white circle stops.
3. A mint box 70 × 8 rises under the two circles, with eight small boxes along its top.
4. A pink square 4 × 4 slides to the shore carrying a white box 1 × 12 (a ruler) and holds it up against the long box.
5. Two mint boxes 30 × 3 at the front open 30 degrees, close on the ruler and take it. The pink square slides away fast.
6. The long box sinks until only the two circles show. The white circle sits between them. Hold.

### F06 · The Big Slide · tier C

1. Seen from above. Grey boxes 40 wide form a road with one right-hand corner. A pink box 14 × 8 enters from the bottom.
2. The pink box turns 40 degrees past its direction of travel and slides round the corner. White circles, radius 2, trail behind and fade.
3. Six orange boxes 3 × 3 line the next corner. The pink box slides past with its nose 2 units from each.
4. Two white boxes 14 × 8 with cyan stripes follow, turn late, touch each other and spin on the spot.
5. The pink box slides one full circle round a cyan circle, radius 20. White boxes pop up above it as a score.
6. It straightens and stops between two orange boxes. Ten small circles at the edge of the road bounce.

### F07 · Showdown at Dot Gulch · tier C

1. An orange box fills the top two thirds, a white box the bottom third. A pink circle at `x = 40`, a cyan circle at `x = 260`, both radius 8. A small white circle drifts between them.
2. Close on the pink circle: it swells by a tenth. Close on the cyan circle: it swells by a little more.
3. Wide. A white circle, radius 14, with one ink box as a hand sits at the top. The hand ticks round to a quarter past three.
4. Four violet boxes slide across the top. White boxes 1 × 6 fall.
5. Both circles roll to the middle and squeeze under one red box 30 × 4 on two legs.
6. The rain stops. Each circle fires one small white box. Both miss. The clock at the top falls off the screen. They roll out together.

### F08 · The 15:15 · tier C

1. A white box (sand) below, a cyan box (sea) above it, an orange circle top left. Twelve circles in mixed neon colours sit on small boxes.
2. A clock circle top right ticks from 15:14 to 15:15. One violet box slides over the orange circle.
3. Sixty white boxes 1 × 6 fall at a slant. Eleven circles roll off to the right. The small boxes stay.
4. One mint circle stays. A red half-disc on a white box 1 × 10 opens above it.
5. The rain stops at once. The violet box slides off. Small white circles rise from a grey box at the top (the road, steaming).
6. Eleven circles roll back to their boxes. Three arcs appear. The mint circle has not moved.

### F09 · Box Step · tier C

1. A violet box as a floor. Two orange boxes 150 × 140 cover the screen and slide apart to the sides.
2. Sixteen white squares 8 × 8 in a four by four grid step right, up, left and down, one step each half second.
3. Every second square turns pink and steps the opposite way, so the grid weaves.
4. A cyan circle, radius 4, rolls in and passes through the gaps without touching a square.
5. The squares stack into a pyramid of five, four, three, two and one. The last one hops up late.
6. The circle lands on the top square. Two pale boxes cross above it as spotlights. The orange boxes close.

### F10 · Scrubbed · tier C

1. A white box 12 × 60 with an orange triangle on top stands on a grey box. A clock circle beside it shows 10.
2. Close on the clock: 5, 4, 3. Twenty small squares along the bottom bounce.
3. One small violet box slides into the top corner. The clock stops at 2.
4. The squares stop bouncing. One at a time they slide off to the left.
5. The background dims. A white circle, radius 3, with an orange box beak lands on the triangle and stays.
6. An orange circle rises. The clock resets to 10. The squares slide back in.

## 3. BHTV 6: 10 ads · tier B

Each ad is four caption cards, 2.5 s each, white text on the colour given, with one flat shape that fills a third of the card. A card is 60 characters or fewer.

|#|Advertiser|Colour and shape|Card 1|Card 2|Card 3|Card 4|
|---|---|---|---|---|---|---|
|T01|SPF 1000|White, a pale orange circle|Is the sun looking at you?|SPF 1000.|The sun can't see you.|Not available in stores, pharmacies, or daylight.|
|T02|Lawyer Larry|Yellow, a red box|Hurt?|Shot?|Watching television? That's sitting. Sitting hurts.|Call Larry. 555-0144.|
|T03|Bayhaven Tomorrow|Cyan, a tall white box|Imagine waking up to this view.|Now imagine it is yours.|Now imagine who lives there today. Stop imagining.|Bayhaven Tomorrow. From the low nine hundreds.|
|T04|Storm Mart|Orange, a violet box sliding in|Something is coming.|We don't know what. Something.|Plywood. Water. One pool noodle.|Storm Mart. We were going to close anyway.|
|T05|Manatee Mattress|Violet, a long grey box|Tired?|Slow down.|Slower.|Manatee Mattress. Sleep like a sea cow.|
|T06|Wahoo World|Red, an orange box with two circles|This car has been somewhere.|We don't ask where.|Neither should you.|Wahoo World. Free tube man. He is not free.|
|T07|Fizzy Lizard|Mint, small white circles rising|It's green.|It's cold.|It's fizzy.|Fizzy Lizard. Stop asking.|
|T08|Bait & Ballistics|Mint, a white circle and a small ink box|Bait.|Ballistics.|One shop for whatever is biting you.|Bait & Ballistics. Aim to please.|
|T09|Bun Voyage|Orange, two half-discs with a box between|You're hungry.|You're in a car.|We have a window.|Bun Voyage. Drive through. Bun appetit.|
|T10|Bayhaven Blue: Live|Ink, a pink circle and the word Live|Tonight on BHTV 6.|Somebody does something.|Sheriff Dale Rucker films it.|Bayhaven Blue: Live. Possibly your street.|

## 4. Coral Arcade: attract mode for 3 cabinets and the claw

The hall has twelve lit cabinets. Three can be played and one is the claw machine; their rules, tracks, prizes and house scores are fixed by `bible/activities/minigames.md` and are only repeated here. The other eight lit cabinets repeat these three. A line is 28 characters or fewer, so it fits the 256-pixel screen in an 8-pixel font. Screens last 4, 6, 5 and 8 seconds. Screen 4 runs over the game playing itself.

### Heat Lap · tier B

|Screen|Lines|
|---|---|
|1 Title|Heat Lap / Slide wide. Bank it. / 1 credit / Press start|
|2 How to play|Steer. Throttle. Handbrake. / Slide past 20 degrees / to build points. / Cross the line to bank them. / Touch a wall, lose them.|
|3 Scores|Today's best / 1 GER 12,000 / 2 MAG 9,000 / 3 WEN 7,500 / 4 JUN 6,000 / 5 TEO 212|
|4 Demo|Demo / 60 seconds on the clock / A lap adds 8 / Sandbar. Car Park. / Roundabout.|

### Gull Patrol · tier B

|Screen|Lines|
|---|---|
|1 Title|Gull Patrol / Guard your chips. / 1 credit / Press start|
|2 How to play|They dive from 8 sides. / Watch for the shadow. / Aim the umbrella. Open it. / Blocked gulls add a streak. / No chips, game over.|
|3 Scores|Today's best / 1 GER 30,000 / 2 NIL 18,000 / 3 MAG 14,000 / 4 RAF 9,000 / 5 TEO 212|
|4 Demo|Demo / Every 20th bird / is a pelican. / You cannot stop a pelican.|

### Tide Pool Panic · tier B

|Screen|Lines|
|---|---|
|1 Title|Tide Pool Panic / Small crab. Big tide. / 1 credit / Press start|
|2 How to play|Grab shells on wet sand. / Small 100. Large 300. / The pearl is 1,000. / Stand on a rock / when the tide comes in. / Mind the gull's shadow.|
|3 Scores|Today's best / 1 GER 25,000 / 2 DES 16,000 / 3 MAG 11,000 / 4 JUN 8,000 / 5 TEO 212|
|4 Demo|Demo / Three lives. / The sea has more.|

### The Grabby Crab · tier B

The claw machine has no screen. A strip of lights above the glass scrolls one line at a time, 3 s each.

|Screen|Lines|
|---|---|
|Strip|The Grabby Crab / 1 credit, 1 try, 20 seconds / Move. Drop. Hope. / The claw is doing its best. / Now inside: plush Gerald / Bin refills at 06:00 / Prizes are not food, Gerald.|

## Counts

|Set|Items|
|---|---|
|Episodes of *Bayhaven Blue: Live*, each with a cold open|12|
|Starlite films, six shots each|10|
|Television ads, four cards each|10|
|Arcade cabinets with attract text, plus the claw strip|3 + 1|

## New names

- Episode titles E01 to E12, and the show's segments: Meet the Guest, Where Did He Go, Dale's Top Ten.
- Film titles F03 to F10: The Long Rectangle, The Square Job, Something in Lake Serenity, The Big Slide, Showdown at Dot Gulch, The 15:15, Box Step, Scrubbed. F01 is Triangle Meets Circle, as `bible/catalog/shops.md` names it, and F02 is Square Goes Alone.
- Heat Lap, Gull Patrol, Tide Pool Panic and The Grabby Crab are the only cabinet names, and come from `bible/activities/minigames.md`. The Starlite's first film is named in `bible/catalog/shops.md`.
