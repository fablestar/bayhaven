# Bible · activities · Local Man

Sixty short things that happen near the player, each under 90 seconds, each ending in a headline on Bayhaven Public Radio and a post on Squawk. Some are silly and some get people killed. Events 1 to 20 are the list in `05-content.md`; the rest are new.

Tier: B for events 1 to 5. C for events 6 to 50. D for events 51 to 60, which happen in county zones.

## How the runner works

| Rule | Value |
|---|---|
| Files | The runner is `src/systems/randomevents.mod.js`. Each event is one file, `src/content/events/<id>.js`. |
| One at a time | Never during a mission, job, race or minigame, and never at heat 2 or more |
| Pick | 3 to 6 minutes after the last one, pick an event within 600 m whose hours and weather match. Spawn it out of sight. |
| Trigger | It starts when the player comes inside its radius, and is removed if they do not within 120 s |
| Rest | A played event rests for 3 in-game days |
| Length | Every event ends by itself within 90 s. "Pays" is for the good ending. |
| After | The headline is read at the next news slot and shown as a `ui:toast`. The Squawk post lands 5 to 20 s later. |
| Events | `localman:started {id}`, `localman:ended {id, result}`, then `radio:line` |
| Test API | `test.event.fire(id)`, `test.event.state()`, `test.event.end(result)` |
| Deaths | People in an event can die, by its doing or yours. Killing in view is a crime. If anyone died, the headline gains "One dead.", or the number. |
| Animals | Animals move away, bounce or walk off. None is hurt. |

Each entry has five lines. Line 1: number and name, then where (with its seed), when (hours, weekday, weather) and the trigger radius if it is not the usual 80 m. Line 2: the beats, separated by semicolons. Line 3: how it ends, then what it pays. Line 4: the radio headline. Line 5: the Squawk post, always lowercase. The tier is the section's. The id is `lm-` plus the name in lower case, with hyphens for spaces and no punctuation: `lm-return-policy`, `lm-live-at-315`. Weekday is any unless named. County seeds are stand-ins; the county file's own seed wins.

## Events 1 to 5 · tier B · from the core list

**01 Return policy**. Galleria Flamingo `(-200, -2000)`. 10:00–20:00, dry. 120 m.  
Shoppers run from the doors; a man at the pet shop counter holds an alligator and a receipt; it walks off; your horn herds it to the fountain.  
It settles in the fountain. Pays $300.  
"Local man tries to return alligator. Store offers credit only."  
"the galleria fountain has a gator now. upgrade"

**02 Just married**. Coral Boulevard at Commerce Way `(64, -690)`. 16:30–18:30, dry.  
A white Sturgeon steams at the kerb; the couple wave you down; drive them to Gullwing Pier `(600, 80)` before sunset; the bride's ex follows in a Wahoo and rams.  
At the pier by `clock:sunset`. Pays $400, less $50 a crash.  
"Wedding saved by stranger. Stranger's car briefly a limousine."  
"a bride just got out of a pickup at the pier. nailed it"

**03 Trolley train**. Galleria car park `(-260, -1960)`. Any hour, wind.  
Forty linked trolleys roll towards Gateway Boulevard; an attendant runs behind; park across their path, or nudge the lead trolley into a corral.  
Stopped, or they reach the road and cause a six-car pile-up. Pays $200.  
"Forty trolleys leave Galleria together. Police say they knew each other."  
"holy shit the trolleys are organising"

**04 Blown out**. The beach by the plaza `(0, 90)`. 10:00–17:00, wind. 150 m.  
A man in an inflatable flamingo drifts south at 1 m/s; reach him by boat; stop within 4 m and he grabs the tow ring; tow him inside `z = 85`.  
Ashore. Past `z = 500` he is gone and the float comes back alone. Pays $350.  
"Man in inflatable flamingo rescued. Flamingo treated for shock."  
"guy on a pool float way past the buoys. looks at peace"

**05 Mascot war**. Gateway Boulevard `(-360, -1815)`. 11:00–15:00, dry.  
A hot dog sprints past, chased by a taco with a tyre iron; pick a side at the prompt; block the taco with your car, or give it a lift.  
The hot dog escapes, or takes a beating. Pays $150 either way.  
"Hot dog and taco settle dispute. Witnesses now hungry."  
"team taco. i said what i said"

## Events 6 to 20 · tier C · from the core list

**06 Sandwich thief**. The food-truck yard `(1000, -1100)`. 12:00–14:00, dry.  
A drone lifts a sandwich off the Pressed counter and flies off at 12 m/s; stay within 30 m for 60 s until its battery dies; catch the sandwich.  
Caught, or it lands in the bay. Pays $120 and a sandwich.  
"Drone steals sandwich. Sandwich described as 'worth it'."  
"a drone just robbed pressed. the future is hungry"

**07 Pool parking**. Tideline Motel's pool `(-520, -60)`. 07:00–11:00.  
A Skimmer floats in the pool; its owner will not say how; hitch it to your vehicle; tow it 130 m to the waterline.  
Skimmer in the sea. Pays $180.  
"Jet ski found in motel pool. Owner blames 'a shortcut'."  
"motel pool has a jet ski in it. five stars"

**08 One more photo**. Heron Walk promenade `(150, 47)`. 09:00–18:00, dry. 30 m.  
A tourist hands you his phone, so take his photo; 40 m on he asks again; the third time he wants you in it.  
Three photos. Pays $45 and 300 followers.  
"Tourist photographed at every palm on Heron Walk. There are 212."  
"same man asked me for a photo three times. i know his angles"

**09 Deck racers**. Bayline Expressway `(-372, -1470)`. 06:00–08:00. 150 m.  
Six Birdies race two abreast at 38 km/h in the fast lane; get in front and lead them down the next ramp before a Hogfish catches them.  
All six off the deck. Pays $100 and a Dawn Patrol visor.  
"Golf carts race on expressway. Winner averaged 38."  
"stuck behind a golf cart grand prix on the bayline"

**10 Slow chase**. Conch Street `(-600, -105)`. 13:00–17:00, dry.  
Two Conch vans crawl nose to tail at 12 km/h, jingles clashing, one driver shooting at the other's speaker; both want the same corner; park on it first.  
Both stop and serve you. Pays $80 and full health.  
"Ice-cream vans in low-speed gunfight. Both melted before arrest."  
"two ice cream vans beefing at walking pace"

**11 Hat trick**. Sheriff's HQ car park `(200, -2110)`. 08:00–18:00.  
A pelican on a lamp post holds a deputy's hat; run and it flies to the next of three perches; walk up; hold out any food and it swaps.  
Hat returned. Pays $200.  
"Pelican takes deputy's hat. Deputy takes it personally."  
"@BayhavenBlue one of your guys is negotiating with a bird"

**12 By the book**. Fairway Drive `(-1900, -2090)`. 08:00–18:00. Starts when you park for 10 s.  
A homeowner measures your car with a ruler; move within 20 s or a $5 fine arrives by text, then two more; drive off and he follows on a Coot.  
You leave the street. Costs up to $15.  
"Resident measures stranger's car. Car found to be 'a car'."  
"got a parking fine by TEXT from a man with a RULER. the fuck"

**13 Flash mob**. Heron Walk `(0, 47)`. At `clock:sunset`, dry.  
Forty people stop walking and dance in step; walk into the middle; press four prompts on the beat.  
The song stops after 40 s. Pays 800 followers for four clean prompts.  
"Forty strangers dance on Heron Walk. One was not told."  
"flash mob absorbed a random guy and he went with it"

**14 Fully covered**. The plaza `(10, 10)`. Any hour, hurricane.  
A man at a folding table sells "hurricane insurance" in the wind; a policy is $20; the paper blows away at once; find him again after the storm.  
He pays out $40, amazed anyone came back.  
"Man sells hurricane insurance during hurricane. Trade brisk."  
"bought hurricane insurance from a table. the table is gone now"

**15 Raining iguanas**. Coral Boulevard `(64, -200)`. 06:00–08:00, cold snap. 120 m.  
Stiff iguanas drop from the palms; cars bounce off them and they are fine; carry five to a sunny patch; each walks off when warm.  
Five thawed. Pays $100.  
"Iguanas fall from trees in cold. Iguanas decline to comment."  
"it is raining lizards. they are ok, just cold"

**16 Runaway boat**. The expressway ramp at `(-900, -1450)`. 09:00–19:00. 120 m.  
A boat on a trailer comes loose and overtakes the Mullet towing it; get ahead; brake gently so it settles on your bumper; ease it to the kerb.  
Stopped, or it reaches the junction and takes three cars with it. Pays $250.  
"Boat overtakes own truck on ramp. Boat cited for speeding."  
"a boat just passed me on the off-ramp. no car. just the fucking boat"

**17 Action**. Tower Way `(212, -985)`. 09:00–17:00, dry.  
A film crew has coned off the road for a chase; drive the marked 300 m in 30 s with two drifts; the cruisers are props, the charges under the parked cars are not.  
The director shouts "Keep it." Pays $300 and 1,000 followers.  
"Unknown driver improves film. Stunt team asking questions."  
"someone drove through a film set and did it better"

**18 Going live**. Flamingo Avenue `(-132, -345)`. 10:00–20:00, dry.  
An influencer streams from the middle of the road and will not move; the horn does nothing; stand behind her for 5 s, or use Bus Driver Voice; run her down and 40,000 people watch.  
She moves after 60 s anyway. Pays 500 followers if you were in shot.  
"Influencer blocks avenue for content. Content described as 'traffic'."  
"who is the guy behind her. he is stealing the stream"

**19 Tour guide**. Spire Circle `(64, -850)`. 10:00–16:00.  
A Manatee of lost retirees decides you are the guide and follows you; visit three landmarks within 600 m; they photograph each.  
Three stops. Pays $90.  
"Tour bus follows stranger for an hour. Rated five stars."  
"our tour guide today was a random person. best tour yet"

**20 Hood ornament**. Tideline, at your parked car; stand-in seed `(0, 0)`. 06:00–20:00. Starts when you walk back to it.  
Gerald is on the bonnet; the horn does not move him; drive under 10 km/h and he stays; people film.  
He leaves at the first water, or after 45 s. Pays 600 followers.  
"Pelican rides car along beachfront. Car reported 'honoured'."  
"@gerald.the.pelican has a chauffeur now"

## Events 21 to 50 · tier C

**21 Sprinkler war**. A lane in Mallard Greens `(-1500, -2010)`. 06:00–09:00.  
Two neighbours aim sprinklers at each other, quoting bylaws; one goes indoors for a shotgun; turn the shared valve before he is back, 30 s.  
Water off, or one neighbour fewer. Pays $60 from each.  
"Neighbours water each other for an hour. Lawns unaffected."  
"sprinkler duel on grackle lane. bring a towel"

**22 Loose orange**. Gateway Boulevard `(-600, -1815)`. 16:00–17:00, after the storm. 120 m.  
The 6 m inflatable orange from the roof of Squeeze Play rolls down six lanes and flattens a Snook; get behind it and push it into a car wash bay.  
Wedged. Pays $220.  
"Giant orange loose on Gateway Boulevard. Juice bar denies knowing it."  
"being chased by an orange on gateway. send help"

**23 Motorcade of one**. City Hall `(-200, -600)`. 09:00–17:00.  
Mayor Bunny Castellano's campaign bus has died; she gets in your car; drive 500 m to a ribbon at under 30 km/h so she can wave; a man with a grudge and a pistol is waiting there.  
Ribbon cut, mayor alive. Pays $150 and a campaign hat.  
"Mayor arrives at ribbon in stranger's car. Calls it 'grassroots'."  
"the mayor just waved at me from a pickup. is she ok"

**24 Twelve leads**. A Meridian pavement `(120, -505)`. 07:00–10:00. 30 m.  
A walker with twelve small dogs is wound round a lamp post; take the leads; walk three circles anticlockwise; the wrong way tightens it.  
Untangled. Pays $70.  
"Dog walker freed from lamp post. Dogs 'saw nothing'."  
"a man is tied to a pole by twelve tiny dogs. they look proud"

**25 Sold**. West End, near Pelican Rest `(-1200, -150)`. 08:00–18:00.  
A Bayhaven Tomorrow salesman hammers SOLD signs onto a bench, a palm and the beach; pull up five in 60 s; his two security men object with batons.  
Five signs in a bin. Pays $100.  
"Developer sells beach. Beach unaware."  
"there is a SOLD sign on the ocean"

**26 Eyewitness**. Where you last crashed at over 60 km/h; stand-in seed `(0, 0)`. Any hour. Starts 30 s after the crash.  
A BHTV 6 van pulls up; the reporter wants a witness; choose one of three statements; she repeats it to camera.  
The van leaves. Pays 400 followers. Your statement is the headline.  
"Witness says driver 'came out of nowhere, then went back'."  
"this witness on bhtv 6 is clearly the driver lmao"

**27 Locked out**. Gateway Boulevard by Wahoo World `(100, -1815)`. Any hour.  
A deputy stands by his cruiser, keys inside, siren on; fetch the spare from the HQ desk `(200, -2150)` in 90 s, or nudge the boot at under 10 km/h.  
Siren off. Pays $150.  
"Deputy locked out of cruiser. Siren enjoyed by all."  
"the gateway siren has been going since lunch. it has a rhythm"

**28 Kite on a roof**. Pier Quarter `(700, -20)`. 12:00–17:00, wind.  
A kite-surfer hangs by his lines from a hotel sign, two floors up; as Teo, climb to him; unhook the left line, then the right; the wrong order drops him two floors and he does not get up.  
He drops into the awning. Pays $160.  
"Kite-surfer lands on hotel. Hotel adds resort charge."  
"guy kitesurfed onto a roof. not even the beach side"

**29 Nap time**. The west marina's fuel dock `(-1150, 110)`. 09:00–16:00.  
A manatee sleeps across the fuel lane; three boats queue and honk; wave each one round at idle speed; a wake wakes it and it swims off.  
Three boats past. Pays $120 from Dr. Okoro.  
"Manatee closes marina for nap. Marina agrees it needed one."  
"marina closed due to manatee. no further questions"

**30 Violation drone**. Mallard Greens `(-1400, -2200)`. 08:00–18:00.  
The association's inspection drone is stuck in an oak, reading violations aloud; bump the trunk at under 15 km/h and it drops.  
Drone down. Pays $90.  
"Inspection drone cites tree for unapproved height."  
"the hoa drone is yelling at an oak. i am on the oak's side"

**31 Under sail**. Factory Avenue `(1024, -900)`. 15:15–16:00, storm.  
Wind fills a food truck's awning; the truck sails sideways down the avenue at 9 km/h, the cook still serving; park something heavy in its path.  
Stopped. Pays $140 and lunch.  
"Food truck travels four blocks under sail. Orders kept coming."  
"ordered a sandwich and the truck LEFT. sideways. what the hell"

**32 Standing near something**. Outside Lawyer Larry's office `(420, -1815)`. 09:00–17:00.  
Larry is filming an advert in the road and needs a victim; lie on the chalk outline for 5 s; the Tarpon in the shot has no stunt driver, so roll clear on "cut".  
One clean shot. Pays $100, or $300 if it clips you: Larry sues.  
"Lawyer films advert in traffic. Sues traffic."  
"i am in a lawyer larry ad now. i play 'hurt'"

**33 Follow the umbrella**. The plaza `(0, 20)`. Wednesday, 10:00–16:00.  
A guide's umbrella blows away; her twelve cruise passengers follow the next thing held up, your pool noodle; walk them 400 m to the shuttle at `(372, 50)`.  
Twelve aboard. Pays $130.  
"Cruise passengers follow pool noodle to safety."  
"a man with a pool noodle is leading a tour. he looks surprised"

**34 Foam party**. Any car wash; stand-in seed `(212, -290)`. 10:00–20:00.  
The foam cannon is stuck on; foam fills the street a metre deep; an Anchovy is lost in it, beeping; find it by sound and push it out.  
Anchovy clear. Pays $110.  
"Car wash fills street with foam. Street 'never cleaner'."  
"there is a tiny car somewhere in this foam. we can hear it"

**35 Sofa lane**. Sandbar Avenue `(384, -505)`. 09:00–19:00.  
A sofa has slid off a Mullet into the middle lane, its owner still on it; the cushions are full of cash and two men in a Grouper want it; push it to the kerb, then deal with them.  
Sofa on the pavement, Grouper gone or burning. Pays $80, or $2,000 if you take the cushions and run.  
"Man rides sofa across avenue. Says commute 'never better'."  
"free sofa on sandbar ave. comes with a guy"

**36 Tube man walks**. Wahoo World `(100, -1765)`. Any hour, wind.  
The inflatable tube man tears loose and flails down Gateway Boulevard; pin its base under a wheel; the salesman runs up with rope.  
Tied down. Pays $130 and 5% off at Wahoo World.  
"Inflatable man leaves used-car lot. Reasons unclear."  
"the wahoo world tube guy quit. good for him"

**37 Live at 3:15**. The beach by the plaza `(0, 60)`. 15:10–15:55, storm.  
A BHTV 6 reporter does the weather in the rain; her umbrella goes; hold a pool noodle over her for 20 s, or drive through the puddle beside her.  
The report ends. Pays $100 dry, or 700 followers wet.  
"Reporter confirms rain by standing in it."  
"bhtv 6 weather lady got soaked live. 3:15. right on time"

**38 Open door**. Exchange Avenue `(704, -745)`. 09:00–16:00.  
A Clam cash truck drives with its back door open, notes fluttering out, and a Grouper of armed men closing behind; honk three times and the guards see both problems; or pick up notes at $20 each and take heat 1.  
Door shut after a firefight. Pays a $250 reward if you honked.  
"Cash truck leaves trail across downtown. Public 'very helpful'."  
"it is raining twenties on exchange ave and somebody is shooting"

**39 One more bucket**. The beach `(-300, 70)`. 10:00–16:00, dry. 50 m.  
An old man's sandcastle needs three buckets of wet sand before the judges come; carry them from the waterline in 45 s.  
The judges arrive. Pays a ribbon and 300 followers.  
"Sandcastle wins beach prize. Builder thanks 'that stranger'."  
"a grown adult just sprinted with sand for a stranger's castle"

**40 Noodle control**. Commerce Way at Sandbar Avenue `(384, -690)`. Any hour, storm or tropical storm.  
The lights are out; a retired crossing guard directs one road with two pool noodles; take the other for 30 s: press left or right as each arrow lights.  
Power back. Pays $120, less $20 a wrong call.  
"Junction run by volunteers with pool noodles. Record flow."  
"traffic at commerce and sandbar is directed by noodle. it works??"

**41 Say cheese**. Coral Boulevard `(64, -505)`. 10:00–18:00.  
The Sheriff's speed camera flashes at everything, pelicans included; people queue to pose; pass it at 40 km/h, give or take 2, for a perfect portrait.  
One framed print. Pays 400 followers.  
"Speed camera takes 900 portraits. Sheriff sells prints."  
"got my photo taken by the speed cam. my best angle"

**42 Passenger**. Egret Avenue at Flamingo Avenue `(-384, -345)`. 08:00–18:00. 40 m.  
A Tern waits at a red light with an iguana on the passenger seat; the driver has not noticed; honk once; the iguana steps out and walks away.  
The light turns green. Pays $50 for the warning.  
"Iguana rides in convertible to Flamingo Avenue. Gets out."  
"iguana got out of a convertible at the lights like it had a meeting"

**43 Wrong address**. Urchin Street, West End `(-1100, -290)`. 09:00–17:00, wind.  
A Bellweather Group drone drops eviction notices on the wrong street, and three men follow to enforce them; collect five notices in 60 s, or see the men off a neighbour's porch.  
Five collected, or three men down. Pays $100.  
"Eviction notices delivered to wrong street, a dog and the Sheriff."  
"bellweather just evicted a mailbox"

**44 Trust walk**. Gateway Boulevard `(-100, -1815)`. 07:00–09:00.  
Thirty of Kiki Halcyon's followers cross six lanes with eyes shut, "trusting abundance"; stop the traffic for 20 s with Bus Driver Voice or a parked car, or four of them are hit.  
All across. Pays 600 followers, none of them Kiki.  
"Wellness walk crosses boulevard, eyes shut. Drivers kept theirs open."  
"glow camp people crossing gateway BLIND. a bus lady saved them"

**45 One minute early**. Anywhere outdoors; stand-in seed `(0, 0)`. 15:14, one day in seven. No radius.  
The storm starts at 15:14; people stop and stare at their watches; photograph the first lightning within 20 s.  
The photo, or 15:15. Pays 500 followers.  
"Storm arrives one minute early. City demands inquiry."  
"3:14. THREE FOURTEEN. what the hell is happening"

**46 Dead air**. Outside the Sheriff's HQ `(200, -2100)`. 10:00–22:00, heat 0.  
A cameraman from *Bayhaven Blue: Live* has nothing to film and would like a shooting; give him a drift, a jump or a doughnut within 30 m in 15 s; no heat is given.  
He gets his shot. Pays $200.  
"Slow news day at Bayhaven Blue. Show airs man parking."  
"@BayhavenBlue paid a guy to do donuts. journalism"

**47 Stuck**. Heron Walk promenade `(450, 47)`. 13:00–15:00, humid haze. 50 m.  
A tourist's flip-flops have melted to the promenade; carry a bucket of seawater 30 m and pour.  
Unstuck. Pays $60.  
"Tourist fused to promenade for an hour. Feels like 104."  
"a man is stuck to the boardwalk. the boardwalk won"

**48 Band on the ramp**. The expressway ramp at `(700, -1440)`. 08:00–10:00.  
The Sheriff's own marching band has taken a wrong turn and marches up the on-ramp, playing; get in front with lights flashing; lead them at 6 km/h back down.  
Band at the kerb, still playing, or a Hogfish finds them first. Pays $130.  
"Marching band joins expressway. Kept time, held lane."  
"got overtaken by a tuba on the route 44 ramp"

**49 Room service**. Under the Baylink line `(-80, -690)`. 12:00–14:00.  
A monorail car has stopped between stations; passengers lower a basket on a rope with a note, "snacks"; put three food items in it within 90 s.  
The train moves. Pays $90, lowered in the basket.  
"Stalled monorail fed by passers-by. Passengers ask for a menu."  
"baylink stopped again but someone sent up empanadas"

**50 Leaf war**. Mallard Greens `(-2500, -2100)`. 08:00–17:00, dry.  
Two gardeners blow one pile of leaves back and forth across a property line; drive through it; the leaves settle evenly on both lawns.  
Both blowers off. Pays $40 from each.  
"Leaf blowers fall silent in Mallard Greens. Residents report birdsong."  
"the leaf blower stopped. i can hear my thoughts. i hate them"

## Events 51 to 60 · tier D · in the county

**51 Tide's in**. The party bar sandbar on the Reef `(300, 1700)`. 16:00–18:00. 150 m.  
A wedding on a sandbar is losing its dance floor to the tide; ferry twelve guests to the yacht, four at a time, in 90 s; anyone left swims for it.  
All aboard. Pays $300.  
"Sandbar wedding ends early. Sandbar also ends."  
"they got married on a sandbar and the sea objected"

**52 Duck spill**. The anchorage in East Bay `(5200, -250)`. 09:00–17:00. 200 m.  
An anchored freighter has spilled 5,000 rubber ducks; its crew hold a net between two dinghies; herd the yellow slick into it with your wake.  
Four in five netted, or 90 s. Pays $240.  
"Five thousand rubber ducks loose in East Bay. All found but one."  
"east bay is yellow. repeat. east bay is yellow"

**53 Bridge is up**. The drawbridge in Driftwood `(-4560, 40)`. Any hour. 150 m.  
Forty cars queue at the drawbridge that is always up; carry six cups of lemonade down the queue in 60 s; the driver at the front has had enough and guns it at the open span.  
Six sold. Pays $90. The car does not make it.  
"Driftwood bridge enters ninth year raised. Queue 'optimistic'."  
"bridge still up. the lemonade guy has bought a boat"

**54 Early bird**. Early Bird Row in Driftwood `(-4820, 40)`. 15:45–16:15.  
Sixty retirees wait for the 16:00 special; the door sticks; hold it open as they pour in; stand in the way and each bump costs a tip.  
All seated. Pays up to $120.  
"Diner opens one minute late. Sixty affected."  
"never stand between driftwood and the 4pm special"

**55 Price war**. The Last Orange fruit stand in Citrus Flats `(-1500, -4270)`. 08:00–17:00.  
Two fruit stands face each other, each a cent cheaper than the other; buy from one and the other owner reaches under the counter; buy from both within 20 s.  
Both paid. Pays a crate of oranges: full health, three times.  
"Fruit stand price war reaches zero. Oranges now free, with guilt."  
"bought an orange and started a feud. tangelo is intense"

**56 Cattle crossing**. Grove Road in Citrus Flats `(-4600, -5000)`. 06:00–09:00.  
Forty cows stand on the road; the horn moves them, slowly, the wrong way; idle behind them for 200 m to a gate.  
Through the gate. Pays $100.  
"Cattle hold road for two hours. Demands unknown."  
"traffic in citrus flats is cows. just cows"

**57 Understudy**. Mermaid Cove, Lake Minnow `(-150, -4850)`. 11:00–15:00.  
The mermaid show is one mermaid short; as Teo, put on the tail; swim through three hoops in 40 s, then wave.  
Curtain. Pays $150 and 1,000 followers.  
"Mermaid show adds merman. Reviews mixed, tail praised."  
"the new mermaid at the cove has a chest phone mount. respect"

**58 Last orders**. The Barge Inn, Lake Minnow `(900, -5100)`. 12:00–18:00, wind. 150 m.  
The floating tiki bar has slipped its anchor and drifts through the bass tournament, still serving; push it 150 m back to its buoy, under 10 km/h.  
Moored. Pays $200.  
"Floating bar drifts through fishing contest. Places third."  
"the bar is LEAVING. worst day of my life"

**59 Last train**. The old monorail line, North Glades, at the stalled train `(1600, -3800)`. Any hour, swamp fog.  
One car of the Castaway Kingdom monorail still creeps round its loop; a lost tourist is aboard and cannot get off; match its 8 km/h and he steps onto your roof.  
Tourist down. Pays $140.  
"Man rides abandoned monorail all day. Calls it 'fine, actually'."  
"the castaway kingdom train is still going?? who pays for that"

**60 Scrubbed**. The viewing car park by the countdown clock, Cape Calamity `(4700, -1500)`. Saturday, 14:00–14:30. 120 m.  
The launch is scrubbed again; two hundred cars leave by one exit; an Upward engineer at the back holds the pad keys; drive him to the gate in 60 s.  
At the gate. Pays $180 and a mission patch.  
"Launch scrubbed for cloud shaped like the word no."  
"scrubbed again. that rocket has been there longer than my lease"

## New names

| Name | What it is |
|---|---|
| The sixty event names above | Titles for the Stats app, never shown in the world |
