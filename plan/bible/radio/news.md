# Bible · radio · News, weather and traffic

Bayhaven Public Radio reports what the player just did, including the shootings, the deaths and the explosions. This file holds the 80 news templates, each keyed to one event from the Events table in `06-tech-architecture.md`, plus 20 weather reports and 10 traffic reports. All of it is read by Barbara Wetherby in her dry voice, as "Local Man" items: the person is never named, and she never swears.

Tier: A for the 39 templates marked A (the roadmap asks for at least 30 on day 8), weather W01 to W06 and traffic T01 to T03 and T10. B for the rest.

## How an item is made

| Rule | Value |
|---|---|
| Build | When an event fires, pick the first template in this file whose event and `When` match. Fill it. Add it to the queue. If nothing matches, no item is made. |
| Queue | Five items. Highest priority first, then newest. An item expires after 15 in-game minutes. |
| Priority 5 | `mission:completed`, `followers:milestone`, `property:bought`, `crime` of kind `killing` or `deputy-down` |
| Priority 4 | `heat:cleared`, `player:booked`, `player:knockedout`, other `crime` |
| Priority 3 | `vehicle:destroyed`, `ped:hit` over 50 km/h, `jump:landed` of 40 m or more, `drift:end` of 5,000 or more, `heat:changed` |
| Priority 2 | `vehicle:crash`, `prop:broken`, `weapon:fired`, `ped:filming` |
| Priority 1 | Everything else |
| Play | One item per loop on Bayhaven Public Radio, two on the hour. The roadmap's check: after a `drift:end`, the next news line uses a drift template. |
| Repeats | The same template never plays twice running. One event makes one item. |
| Heat | Items from `heat:changed` and `heat:live` wait until `heat:cleared`. At heat 4 the station is off air anyway. |
| Empty queue | Read a weather report. In The Drive Home (16:00 to 19:00), a traffic report. |
| Length | 260 characters or fewer after filling. Every item opens with the chime's last note, not the whole chime. |
| Voice | Deaths are reported plainly and never played for a laugh at the victim. The dry line that follows is always about the Sheriff, an insurer, the association or the city. |
| Mission 20 | The bulletin in Going Viral is written in the story files. It does not use these templates. |

## Placeholders

| Slot | Filled with |
|---|---|
| `{Lead}` `{lead}` | "Local Man" and "a local man" when the player is Teo. "Local Woman" and "a local woman" when the player is Mags. |
| `{He}` `{he}` `{his}` | He, he, his for Teo. She, she, her for Mags. |
| `{district}` | The district's name from `state.world.district` |
| `{street}` | The nearest road with a name in the canon. If none within 60 m: "a side street". |
| `{landmark}` | The nearest fixed landmark within 300 m, with "the" where it needs one. If none: the district. |
| `{vehicle}` | The player's vehicle by model name: "Heron", "Manatee". Templates supply the article. |
| `{score}` | The `drift:end` score, rounded to the nearest 10 |
| `{distance}` | The `jump:landed` distance in whole metres |
| `{speed}` | The `vehicle:crash` speed in whole km/h |
| `{what}` | What was hit, from `vehicle:crash` or `prop:broken`, with its article: "a lamp post", "a bench", "a bin" |
| `{count}` | The `ped:filming` count, or the number of like events in the window the `When` names, as a numeral |
| `{viewers}` | Peak viewers of the stream that just ended, with commas |
| `{followers}` `{handle}` | Teo's follower count with commas, and `@teo.navarro.live` |
| `{cash}` | The dollar amount in the event, with commas |
| `{mission}` | The mission's title |
| `{daypart}` | "this morning" (05:00 to 12:00), "this afternoon" (to 17:00), "this evening" (to 21:00), "tonight" |
| `{minutes}` | Whole in-game minutes until 15:15 |
| `{category}` | Hurricane category 1 to 5, from `state.weather.wind` in five equal bands |

### Fields the templates read that the Events table does not list yet

| Event | Field | Used for |
|---|---|---|
| `ped:hit` | `speed` | Over 50 km/h the person stays down (`04-systems.md` section 4) |
| `vehicle:destroyed` | `owner` (player, sheriff, other), `crewOut` (true or false), `hurt` (people within 6 m) | N25 to N28 |
| `weapon:fired` | `weapon`, `fromVehicle` | N76 and N77 |
| `crime` | `kind` | The twelve kinds are listed in `scanner.md` |

## News templates

### `drift:end`

| Id | When | Tier | Item |
|---|---|---|---|
| N01 | score under 500 | A | {Lead} attempted what witnesses called "a sort of drift" on {street} {daypart}. It scored {score} points. Judges described it as "a turn". |
| N02 | new personal best | A | A new record. {Lead}, in a {vehicle}, has beaten {his} own best drift with {score} points. No governing body exists. We checked. |
| N03 | road is wet | B | In wet conditions on {street}, a {vehicle} travelled further sideways than forwards. The driver scored {score}. The road scored higher. |
| N04 | score 500 to 1,999 | A | A {vehicle} was seen travelling sideways along {street} in {district}. The driver is believed to have meant it. Score: {score}. |
| N05 | score 2,000 to 4,999 | A | Residents of {district} report tyre smoke, a smell of rubber and a drift worth {score} points. One called it "better than the boat parade". |
| N06 | score 5,000 or more | B | A drift of {score} points was recorded near {landmark}. The Sheriff's office called it reckless. The Sheriff's producers called it "a cold open". |

### `vehicle:crash`

| Id | When | Tier | Item |
|---|---|---|---|
| N07 | speed under 15 | B | A very slow collision took place in {district} at {speed} kilometres an hour. Both parties saw it coming. Neither is said to have minded. |
| N08 | hit a Sheriff's cruiser | A | {Lead} drove into a Sheriff's cruiser near {landmark}. The Sheriff's office confirmed the collision and thanked the driver for "a strong start to the episode". |
| N09 | hit a fire hydrant | A | A fire hydrant on {street} has been opened by a {vehicle} at {speed} kilometres an hour. Children are playing in it. The city will forward the water bill. |
| N10 | hit a lamp post | A | A lamp post in {district} is now leaning. It was struck by {lead} in a {vehicle}. The city says the lamp still works and is "sort of pointing at the culprit". |
| N11 | hit a palm | A | A palm tree on {street} dropped six coconuts on a {vehicle} that had just hit it. Witnesses called this fair. |
| N12 | hit a parked vehicle | A | A parked car in {district} was struck at {speed} kilometres an hour by a car that was not parked. Iguana Insurance says it is reading the policy for the word "parked". |
| N13 | hit a moving vehicle | B | Two vehicles tried to use the same part of {street} {daypart}. Neither succeeded. One driver is in Bayhaven General. The other is filming the damage. |
| N14 | hit a building, speed over 80 | B | A {vehicle} entered a building on {street} without using the door. The building is fine. The {vehicle} is described as "shorter". |

### `jump:landed`

| Id | When | Tier | Item |
|---|---|---|---|
| N15 | landed in water | B | A {vehicle} completed a jump of {distance} metres and landed in the bay. The driver swam ashore. The {vehicle} is now a reef. |
| N16 | filmed by 3 or more | A | A {distance}-metre jump on {street} was filmed by {count} bystanders, none of whom, police note, stepped out of the way. |
| N17 | under 15 m | A | A {vehicle} left the ground briefly in {district}. It travelled {distance} metres and came back. Witnesses described the landing as "most of one". |
| N18 | 15 to 39 m | A | {Lead} flew a {vehicle} {distance} metres over {street}. Bayhaven International has asked that all flights be filed in advance. |
| N19 | 40 m or more | B | A {vehicle} was airborne for {distance} metres near {landmark}. Air traffic control tracked it for part of the way. Low Altitude Airlines says it is "looking at the route". |

### `prop:broken`

| Id | When | Tier | Item |
|---|---|---|---|
| N20 | 10 or more props in 60 s | B | {Lead} broke {count} separate objects on {street} in under a minute. The city has asked for an itemised list. So has Lawyer Larry. |
| N21 | a mailbox in Mallard Greens | A | A mailbox in Mallard Greens was flattened by a {vehicle}. The association has fined the mailbox's owner, as it is no longer beige or upright. |
| N22 | café tables | A | A café on {street} lost {count} tables to a passing {vehicle}. The café remains open. It describes its seating as "floor". |
| N23 | a road sign | B | A sign reading "Slow" was knocked flat on {street}. Officials say it will be replaced with a sign reading "Please". |
| N24 | beach umbrellas | B | Beach umbrellas were seen leaving {district} at speed {daypart}, some of them by road. |

### `vehicle:destroyed`

| Id | When | Tier | Item |
|---|---|---|---|
| N25 | 3 or more in 5 minutes | B | {count} vehicles have exploded in {district} in five minutes. Fire crews are on scene. Park and Sons Auto says it is "sorry for everyone's loss, and open until nine". |
| N26 | a Sheriff's cruiser, crew still inside | B | A Sheriff's cruiser exploded near {landmark} {daypart} with two deputies inside. The Sheriff paid tribute to both men during the broadcast, between sponsors. |
| N27 | people hurt by the blast | B | A {vehicle} exploded on {street} {daypart}. Several people nearby were hurt and windows are out across {district}. The hood came down two streets away. |
| N28 | any | A | A {vehicle} burned out and exploded in {district} {daypart}. The driver was seen walking away without looking back, which witnesses agreed was the correct way to do it. |

### `ped:hit`

| Id | When | Tier | Item |
|---|---|---|---|
| N29 | 3 or more over 50 km/h in 60 s | B | {count} people were run down on {street} inside a minute {daypart}. Not all of them got up. The Sheriff's office describes the footage as "available". |
| N30 | over 50 km/h | A | A pedestrian was struck by a {vehicle} on {street} {daypart} and did not get up. An ambulance attended. The driver did not. |
| N31 | filmed by 3 or more | B | A pedestrian in {district} was knocked down by a {vehicle} in front of {count} people, all of whom filmed it and one of whom, eventually, rang for an ambulance. |
| N32 | any | B | A pedestrian in {district} was clipped by a {vehicle}, got up, and described the driver at length. The description is not suitable for broadcast. |

### `ped:filming`

| Id | When | Tier | Item |
|---|---|---|---|
| N33 | player is Mags, count 3 or more | B | Footage shows a woman in a visor taking a {vehicle} through {district} "like she has done it before". She has. For thirty-one years. With children aboard. |
| N34 | count 15 or more | B | A crowd of {count} filmed a {vehicle} in {district}. Traffic stopped. The traffic also filmed. |
| N35 | count 5 or more | A | {count} people stopped to film {lead} on {street} {daypart}. Asked what they had seen, most said they would have to watch it back. |

### `heat:changed`

| Id | When | Tier | Item |
|---|---|---|---|
| N36 | to 1, Warm | A | The Sheriff's office says a deputy is "having a word" with a driver in {district}. The word is believed to be "stop". |
| N37 | to 2, Hot | A | Three cruisers are following a {vehicle} through {district}. The Sheriff's office calls it "pre-production". |
| N38 | to 3, Trending | A | Bayhaven Blue: Live went to air {daypart}. Its subject was {lead} in a {vehicle}, last seen on {street}. Deputies opened fire, as they do once the cameras are on. |
| N39 | to 4, Breaking News | B | Earlier, every radio station in the county, this one included, was replaced by the Sheriff's programme for the pursuit of a {vehicle}. We apologise. It was not our idea. |
| N40 | to 5, Hurricane Dale | B | The Sheriff himself joined a pursuit in {district}, in the truck with the cameras on it. A spokesman called it "a special episode". They are all special episodes. |

### `heat:live`

| Id | When | Tier | Item |
|---|---|---|---|
| N41 | peak viewers 200,000 or more | B | Viewing figures for the pursuit reached {viewers}. For comparison, this station's audience is a number we know by name. |
| N42 | peak viewers 20,000 or more | B | {viewers} people watched a {vehicle} drive around {district} on the Sheriff's programme. That is more than voted in the last election. The Mayor has asked us not to repeat that. |

### `heat:cleared`

| Id | When | Tier | Item |
|---|---|---|---|
| N43 | cleared inside a car wash | B | A {vehicle} sought across {district} was last seen entering a car wash. It did not come out a suspect. It did come out clean. |
| N44 | cleared by a change of outfit or vehicle | B | Deputies looking for {lead} report that {he} was "right there" and then was someone else in a different shirt. Second Wind Thrift declined to comment. |
| N45 | from heat 5 | B | The largest pursuit in county history ended when the suspect went somewhere dull and stayed there. The Sheriff's show truck is still circling. Nobody has told it. |
| N46 | from heat 4 | A | A pursuit through {district} has ended without an arrest. It did not end without gunfire. The Sheriff's office describes the result as "a cliffhanger". |
| N47 | from heat 3 | A | Bayhaven Blue: Live ended early {daypart} when its subject parked and did nothing. Viewers left. The Sheriff has asked suspects to "think of the audience". |
| N48 | from heat 1 or 2 | A | A driver in {district} who was being followed by deputies is no longer being followed by deputies. The Sheriff's office says it "lost interest". |

### `player:booked`

| Id | When | Tier | Item |
|---|---|---|---|
| N49 | third time in one in-game day | B | {Lead} has been booked for the third time today. Deputies have stopped taking a new photograph. |
| N50 | Lawyer Larry has been met | B | {Lead} was booked and released today. Lawyer Larry, acting for the defence, the prosecution and a passing witness, called the outcome "billable". |
| N51 | any | A | {Lead} was booked at the Sheriff's headquarters in Northgate and released within the hour, lighter by {cash} dollars. {He} was seen leaving with a business card. |

### `player:knockedout`

The lead always wakes at Bayhaven General. The news is allowed to be surprised by that.

| Id | When | Tier | Item |
|---|---|---|---|
| N52 | third time in one in-game day | B | Bayhaven General confirms that {lead} has been brought in three times today, twice without a pulse. Staff have started a loyalty card. |
| N53 | heat was 3 or more | B | The Sheriff's programme ended {daypart} when deputies shot its subject on {street}. {He} was pronounced dead at the scene and, later, at Bayhaven General, alive. The episode repeats at eleven. |
| N54 | any | A | {Lead} was left for dead on {street} {daypart} and woke at Bayhaven General. Doctors called it "a lot, all at once". {He} has a wristband and a bill for {cash} dollars. |

### `crime`

These play only when `seen` is true. Kinds are the twelve in `scanner.md`.

| Id | When | Tier | Item |
|---|---|---|---|
| N55 | kind `deputy-down`, second or later in one in-game day | B | A second deputy has been killed today, this one in {district}. The Sheriff has ordered flags to half mast and cameras to full zoom. |
| N56 | kind `deputy-down` | A | A Sheriff's deputy was shot and killed on {street} {daypart}. The Sheriff called him "a fine officer and a natural on camera". The suspect, {lead}, has not been found. |
| N57 | kind `killing`, 3 or more in 5 minutes | B | {count} people have been shot dead in {district} in five minutes. Police describe the suspect as "armed" and "obviously". Residents are advised to stay in. The Sheriff advises them to stay tuned. |
| N58 | kind `killing` | A | A man was shot dead on {street} {daypart}. Police have a suspect, a description and several camera angles. They do not have the suspect. |
| N59 | kind `shoot-out`, with deputies | B | Deputies and {lead} exchanged fire on {street} for some minutes {daypart}. Windows are out the length of the block. Iguana Insurance has stopped answering its telephone. |
| N60 | kind `shoot-out`, with a crew or guards | B | A gun battle between {lead} and several armed men closed {street} {daypart}. Police arrived when it was over, counted the bodies and asked whether anybody had filmed it. |
| N61 | kind `shots`, a flare gun | B | A flare was fired over {district} {daypart}. The coastguard launched a boat. The crate of fireworks it landed in launched everything else. |
| N62 | kind `carjack` | A | A driver on {street} was pulled out of a {vehicle} by a stranger, who then left in it. The driver is unhurt and described the stranger as "in a hurry". |

### `mission:completed`

| Id | When | Tier | Item |
|---|---|---|---|
| N63 | `final-notice` | A | A tow truck on Heron Walk Drive was rammed by a coupe until it dropped a scooter. The tow company calls it theft. The scooter's owner calls it a rescue. The coupe's driver has not called anyone. |
| N64 | `repo-woman` | A | Three cars held by the Bellweather Group were taken back from across the city today by, the company says, "a woman who knew exactly what she was doing". |
| N65 | `open-house` | A | The Mallard Greens association reports that a binder was taken from its clubhouse and that a golf cart left by way of the fourteenth green. Members are asked to check their hedges. |
| N66 | `as-seen-on-tv` | A | An unknown streamer appeared on Bayhaven Blue: Live for a full minute {daypart}, under fire, and seemed pleased about it. His following has since risen from "a few" to {followers}. |
| N67 | `yacht-rock` | A | A guest left Tripp Vandermeer's yacht party by the stern, without using the steps. Mr Vandermeer called it a wonderful party and asked whose it was. |
| N68 | any other mission | B | In other news, something happened in {district} that those involved are calling "{mission}". We don't know what it means either. More when we have it. |

### `mission:failed`

| Id | When | Tier | Item |
|---|---|---|---|
| N69 | any | B | A plan was attempted in {district} {daypart}. Witnesses say it was going well until it was not. Those involved are believed to be trying again from slightly earlier. |

### `followers:milestone`

| Id | When | Tier | Item |
|---|---|---|---|
| N70 | 1,000 | A | A local streamer has reached one thousand followers. He began with 212, most of them described by analysts as "not people". |
| N71 | 10,000 | A | Ten thousand people now follow {handle}. Asked why, a sample said "the driving", "the grandmother" and "I thought this was a cooking account". |
| N72 | 100,000 | B | {handle} has passed one hundred thousand followers. Shops in Bayhaven now offer him ten percent off, which economists call "cheaper than advertising". |
| N73 | 1,000,000 | B | One million followers. The city has marked the occasion with a statue in the plaza. It is of his phone. |

### Other events

| Id | Event | When | Tier | Item |
|---|---|---|---|---|
| N74 | `property:bought` | any | A | A property in {district} has changed hands for {cash} dollars. The buyers, a retired bus driver and a man with a phone on his chest, paid in full and would not say how. |
| N75 | `shop:opened` | Second Wind Thrift, with heat in the last 60 s | B | Deputies searching {district} for a suspect in a floral shirt report that everyone in {district} is wearing a floral shirt. |
| N76 | `weapon:fired` | from a moving vehicle | B | Shots were fired from a moving {vehicle} on {street} {daypart}. Nobody has been found hurt. Several parked cars have been found ventilated. |
| N77 | `weapon:fired` | any firearm | A | Gunfire was reported in {district} {daypart}. Residents are asked to stay indoors. The Sheriff's office says units responded as soon as they had found the cameras. |
| N78 | `vehicle:crash` | anything not matched above | A | A {vehicle} struck {what} on {street} at {speed} kilometres an hour {daypart}. Asked for comment, {what} said nothing. |
| N79 | `vehicle:entered` | a Manatee | A | A city bus left its route in {district} {daypart} and, passengers say, "began cornering". The transit office says the bus has never been driven better and would like it back. |
| N80 | `prop:broken` | anything not matched above | B | Something on {street} that was upright {daypart} is no longer upright. The city has added {what} to its list. It is a long list. |

## Weather reports

One plays at half past each hour in Morning Tide, and whenever the news queue is empty. Pick at random among the rows whose `When` matches. The 15:15 storm is in almost all of them. Hurricanes get a category. "Feels like" numbers have no unit, like the bar of the same name.

| Id | When | Tier | Report |
|---|---|---|---|
| W01 | clear, 05:00 to 11:00 | A | Weather. Clear this morning. Feels like 96. Rain at 15:15. It will stop at about five to four. Then it will steam. |
| W02 | clear, 11:00 to 14:45 | A | Weather. Hot. Feels like 104. The forecast for 15:15 is rain. The forecast for 15:15 has been rain since records began. |
| W03 | clear, 14:45 to 15:14 | A | Weather. The sky over Bayhaven is perfectly clear. You have {minutes} minutes. |
| W04 | afternoon storm, first 5 minutes | A | Weather. It is 15:15. It is raining. This concludes the weather. |
| W05 | afternoon storm, after that | A | Weather. Heavy rain in all districts, as scheduled. Roads are slick. Anyone sheltering under a palm is reminded what palms are full of. |
| W06 | `weather:changed` from storm to clear | A | Weather. The rain has stopped. There is a rainbow over {district}. The roads are steaming. Normal service, in the sense of heat, has resumed. |
| W07 | clear, 17:30 to 20:00 | B | Weather. A fine evening. The sun is setting over the bay, slowly, as if it knows people are watching. Tonight: still warm. |
| W08 | clear, 20:00 to 05:00 | B | Weather. Clear tonight. Feels like 88 at midnight, which our records describe as "a cold snap". Rain tomorrow at 15:15. |
| W09 | humid haze | B | Weather. Haze. Humidity is ninety-four percent. The other six percent is expected by lunchtime. |
| W10 | humid haze, in Rustwater or Meridian | B | Weather. The air today can be seen and, in parts of Rustwater, held. Rain at 15:15 will make it better, then worse. |
| W11 | swamp fog | B | Weather. Fog in Mudcat Glades. Visibility on Mudcat Road is one alligator. Drive accordingly. |
| W12 | tropical storm | B | Weather. A tropical storm is crossing the county. It has a name. Nobody uses it. Winds are strong enough to rearrange patio furniture but not, yet, to share it out. |
| W13 | tropical storm, 15:00 to 16:00 | B | Weather. Listeners ask whether the 15:15 rain is cancelled, as it is already raining. It is not cancelled. It is underneath. |
| W14 | hurricane within 3 in-game hours | B | Weather. A hurricane warning is in force for Marlin County. Storm Mart reports that it is out of plywood, water and patience. One pool noodle remains. |
| W15 | hurricane, `{category}` 1 | B | Weather. The hurricane is Category One. Umbrellas are leaving. Residents are advised to let them. |
| W16 | hurricane, `{category}` 2 | B | Weather. Category Two. Lawn chairs are now crossing district lines. If one arrives at your home, it is yours until the wind changes. |
| W17 | hurricane, `{category}` 3 | B | Weather. Category Three. A trampoline has been reported over Meridian at one hundred metres. Low Altitude Airlines has asked it to identify itself. |
| W18 | hurricane, `{category}` 4 | B | Weather. Category Four. Low streets are flooding. The power is flickering. The sky is green. If you are outside, you are either lost or on television. |
| W19 | hurricane, `{category}` 5 | B | Weather. Category Five. There is no advice for Category Five. Stay in. Stay low. This station will be here afterwards to say who is left. |
| W20 | `weather:changed` from hurricane to clear | B | Weather. The hurricane has passed. The sky is clear. The missing are being counted, and so is the lawn furniture. Rain is forecast for 15:15, because of course it is. |

## Traffic reports

One plays every loop in The Drive Home and on the hour in Morning Tide. The first one in the table whose `When` matches is used.

| Id | When | Tier | Report |
|---|---|---|---|
| T01 | a `vehicle:crash` by the player in the last 5 in-game minutes | A | Traffic. An incident on {street} in {district}. One lane is closed. The other is slow, because everyone in it is looking at the first. |
| T02 | heat cleared in the last 5 in-game minutes | A | Traffic. Roadblocks around {district} are coming down. {street} stays shut while deputies pick up their shell casings. They are paid by the casing. |
| T03 | rain or storm | A | Traffic. Rain. Grip is poor on every road in the city. There is water under the expressway ramps. The Longspan is open, wet and, we are told, lovely. |
| T04 | a `vehicle:destroyed` in the last 5 in-game minutes | B | Traffic. A burning vehicle is blocking {street}. The fire service is attending. So is a man selling cold drinks to the queue. |
| T05 | 07:00 to 09:00 | B | Traffic. The morning rush. Every route into Meridian is busy. Every route out is also busy, with people who have changed their minds. |
| T06 | 17:00 to 19:00 | B | Traffic. The evening rush has begun. Allow an extra twenty minutes or one sunset, whichever is longer. |
| T07 | Monday, 05:00 to 08:00 | B | Traffic. It is bin day. Garbage trucks are on every street. They stop often and do not hurry. Overtaking one will bring you out behind another. |
| T08 | Wednesday, 10:00 to 17:00 | B | Traffic. A cruise ship is in. Heron Walk Drive is full of visitors walking in the road while reading a map of the pavement. |
| T09 | any, when T10 played last | B | Traffic. There is a pelican on the traffic lights at Spire Circle. The lights are working. Drivers are obeying the pelican. |
| T10 | any | A | Traffic. Slow on the Bayline Expressway in both directions. Coral Boulevard is moving. {street} is not recommended, for reasons that are still driving along it. |

## New names

- No new people, places or brands. Every name is from the canon.
- Placeholders `{Lead}`, `{lead}`, `{He}`, `{he}`, `{his}`, `{daypart}`, `{minutes}`, `{category}`, `{handle}`, `{what}` and the rest are set in the table above.
- Payload fields `speed`, `owner`, `crewOut`, `hurt`, `weapon` and `fromVehicle` are asked for above; they are not in the Events table yet.
- The crime kinds used under `crime` are set in `scanner.md`.
