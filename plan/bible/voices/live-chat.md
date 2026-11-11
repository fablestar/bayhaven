# Bible · voices · LIVE chat

The chat is the column of viewer comments on the LIVE overlay, shown at heat 3 and above and in the last scene of the story. This file gives 250 lines in 18 groups, each with the event and condition that fires it, and 30 usernames to put in front of them. Every line is 40 characters or fewer and is typed the way a live chat types, swearing included. The chat watches people get shot and cars blow up, and says so.

Tier: A for 66 lines (40 for session D5-S1, 20 for D5-S2, 6 for the parking scene in Going Viral), B for 125, C for 59. The tier is on every row.

## How the chat runs

|Rule|Value|
|---|---|
|File|`src/content/chat.js`, one object per row in the shape from `bible/tech/schemas.md`: `{ on, if, text, tier }`. The When column is `on` plus `if` in plain words. `src/ui/live.mod.js` reads it and shows a row with `live.say(user, text)`|
|Shown|While `state.heat.level` is 3 or more, and in step 3 of `going-viral`. Box, sizes and timings are in `bible/art/ui-kit.md`: five rows on desktop, three on a phone, newest at the bottom, each living 6 s|
|A row on screen|`username: line`. The username is pink, cyan or mango by name, the line is white. If the pair is wider than the box, put the line on the row under its username and count two rows|
|Event lines|When a trigger fires, show one matching row within 0.3 s, then one to three more matching rows over the next 2 s, each from a different username|
|Filler|If nothing has fired for 4 s and a cop or camera can see the player, show a row from the group for the current heat level (groups 2, 3 and 4). If nobody can see the player, use group 9|
|Pace of filler|0.5 lines a second at 1,000 viewers, rising in a straight line to 4 a second at 200,000 viewers and above|
|Scripted lines|A mission script in `bible/story/` may carry its own `Chat:` lines. Those show first, in order. The rows here fill the rest|
|Repeats|A row is not reused until 30 other rows have been shown|
|Pronouns|Rows containing `he`, `him` or `his` are skipped when the active lead is Mags. Rows containing `she` or `her` are skipped when it is Teo. Groups 17 and 18 are exempt: a mission row already knows who it is about|
|Placeholders|`{vehicle}` `{street}` `{district}` `{score}` `{metres}` `{viewers}`, filled as in `squawk.md`. If the filled line is over 40 characters, skip the row|
|Casing|Keep every row exactly as written. Capitals are shouting and are on purpose|
|Sound|One soft ping per line, at most four pings a second. Music ducks 3 dB under it|

## Signals this file needs

|Group|Signal|Where it comes from|
|---|---|---|
|8 Near misses|`vehicle:nearmiss`, payload `what` (ped, car or police) and `gap` in metres|Not in the Events table in `06-tech-architecture.md` yet. The vehicles lane must add it to its contract: fire when the player's vehicle passes within 1 m of a person or vehicle at over 60 km/h and no `vehicle:crash` or `ped:hit` follows within 0.5 s. Until it exists, leave group 8 out|
|9 Hiding|Nobody can see the player for 3 s|`state.heat.seen` is false. `bible/systems/heat.md` also emits `heat:seen` when it flips|
|3 and 10|A roadblock is set; a level is dropped by a swap|`heat:roadblock` and `heat:dropped` from `bible/systems/heat.md`|
|11 Mags is seen|Mags is the active lead and can be seen|`state.player.id` is `mags` and `state.heat.seen` is true|
|14 Helicopter cam|The player has switched to the helicopter's view|`chopper.active` in `bible/tech/contracts.md` turns true|
|2, 3, 4, 7, 11, 13, 16|Deputies firing, a driver still inside a wreck, an ambulance arriving, the player shot|No event in the starting table. The police, vehicles and people lanes know each of these; they must expose it in their contracts. Until then, fire these rows from `weapon:fired`, `vehicle:destroyed`, `ped:hit` and `player:knockedout` alone|

Everything else is an event from the starting table.

## The 30 usernames

Pick one at random for each line, never one of the last three used. The colour is fixed per name: name `n` takes pink, cyan or mango by `n mod 3`. The longest is 16 characters.

|#|Username|Who it sounds like|
|---|---|---|
|1|pier_pressure|Watches every night, thinks every chase ends at the pier|
|2|gull_friend|Only here for the birds in the background|
|3|sandbar_sam|Calm, has seen better chases, says so|
|4|humidity94|Clubber watching from a queue|
|5|porch_lou|Retiree, watches from the porch, misses nothing|
|6|tarponfan|Rates the cars, ignores the crime|
|7|coupon_queen|Asks what everything cost|
|8|nightshift_fan|Listens to Tideline 98 while watching|
|9|early_bird_430|Types before the thing has happened|
|10|route44rob|Trucker, respects a clean line|
|11|mangomoonie|Works a smoothie counter, types one-handed|
|12|boat_shoes_bo|Yacht club member, appalled and thrilled|
|13|flamingo_dad|Lawn-proud, takes prop damage personally|
|14|spf_zero|Sunburnt tourist in a hotel room|
|15|keylimekim|Types in capitals when it matters|
|16|swampmom|From the Glades, unimpressed by city driving|
|17|dockside_del|Crane crew on a break. The same Del who posts on Squawk|
|18|pickleball_pat|Watching at the clubhouse, against the rules|
|19|xX_pelican_Xx|Types like a teenager. Is forty|
|20|bingo_bettina|Has a favourite deputy|
|21|turnsignal_tim|Only comments on indicators|
|22|lawnchair_legend|Watching the same chase out of the front window|
|23|tiki_torch|Bartender, has the show on above the bar|
|24|hushhourhero|Diner regular, types slowly, lands late|
|25|grouper_trooper|Off-duty deputy pretending not to be|
|26|palm_reader|Predicts every turn, wrong half the time|
|27|wet_sock|Caught in the 15:15, watching from a bus shelter|
|28|snowbird_stan|Here for the winter, thinks this is normal|
|29|cul_de_zach|Lives in Mallard Greens, hopes it comes his way|
|30|abuela_online|Somebody's grandmother. Mags's biggest fan|

## The 250 lines

### 1 · Going live

Fires on the first `heat:live` of a stream (heat has just reached 3 from below).

|#|When|Line|Tier|
|---|---|---|---|
|001|`heat:live`, first of the stream|we're live|A|
|002|`heat:live`, first of the stream|oh shit it's starting|A|
|003|`heat:live`, first of the stream|who is it tonight|A|
|004|`heat:live`, first of the stream|first|A|
|005|`heat:live`, first of the stream|turn it up, dale's on|A|
|006|`heat:live`, first of the stream|live from {district}|B|
|007|`heat:live`, first of the stream|here we gooo|B|
|008|`heat:live`, hour 17 to 21|skipped dinner for this|B|
|009|`heat:live`, first of the stream|mom come look|B|
|010|`heat:live`, first of the stream|is that my street|B|
|011|`heat:live`, in a vehicle|not a {vehicle} again|B|
|012|`heat:live`, second stream in one day|chat we're so back|C|
|013|`heat:live`, first of the stream|popcorn's on|C|
|014|`heat:live`, followers 10,000 or more|is this the beach guy again|C|

### 2 · Heat 3, Trending

Fires on `heat:changed` to 3. Also the filler pool while heat is 3. From this level deputies shoot.

|#|When|Line|Tier|
|---|---|---|---|
|015|`heat:changed` to 3|three sirens!!|A|
|016|`heat:changed` to 3|we're trending|A|
|017|`heat:changed` to 3|helicopter's up|A|
|018|heat 3, filler|this is better than the news|A|
|019|heat 3, within 400 m of Gullwing Pier|HE'S GOING FOR THE PIER|A|
|020|heat 3, hour 20 to 5|spotlight's on|B|
|021|heat 3, in a vehicle|five cruisers for one {vehicle}|B|
|022|`heat:changed` to 3|heat 3. they can shoot now|B|
|023|heat 3, a deputy fires|deputies got their guns out|B|
|024|heat 3, filler|trending in {district}|C|

### 3 · Heat 4, Breaking News

Fires on `heat:changed` to 4. Also the filler pool while heat is 4.

|#|When|Line|Tier|
|---|---|---|---|
|025|`heat:changed` to 4|BREAKING NEWS|A|
|026|`heat:changed` to 4|they got the vans out|A|
|027|`heat:roadblock`, within 200 m|roadblock ahead!!|A|
|028|heat 4, spike strip within 100 m|spike strips. oh shit|A|
|029|`heat:changed` to 4|my radio just switched to this|A|
|030|heat 4, filler|every station is this now|A|
|031|heat 4, filler|four sirens. FOUR|A|
|032|heat 4, second helicopter up|two helicopters??|B|
|033|heat 4, shots from both sides within 5 s|it's a shoot-out now|B|
|034|heat 4, filler|this IS the news now|C|

### 4 · Heat 5, Hurricane Dale

Fires on `heat:changed` to 5. Also the filler pool while heat is 5.

|#|When|Line|Tier|
|---|---|---|---|
|035|`heat:changed` to 5|HURRICANE DALE|A|
|036|`heat:changed` to 5|the sheriff's truck!!!|A|
|037|heat 5, show truck within 150 m|dale's driving it himself|A|
|038|`heat:changed` to 5|every unit in the county|A|
|039|`heat:changed` to 5|all five sirens|A|
|040|heat 5, filler|that truck has its own cameras|A|
|041|heat 5, filler|whole county's on one road|A|
|042|heat 5, viewers 200,000 or more|200k of us watching|B|
|043|heat 5, the show truck's crew fires|dale brought the big guns. literally|B|
|044|heat 5, show truck within 60 m|i can see dale's hat|C|

### 5 · Drifts

Fires on `drift:end` while live.

|#|When|Line|Tier|
|---|---|---|---|
|045|`drift:end`, score over 1,000|that drift tho|A|
|046|`drift:end`, score over 1,000|sideways king|A|
|047|`drift:end`, score over 5,000|{score}!!!|A|
|048|`drift:end`, score over 2,000|clip that|A|
|049|`drift:end`, score over 1,000|do it again|A|
|050|`drift:end`, score over 1,000|smooth as hell|B|
|051|`drift:end`, score over 5,000|tyres are gone|B|
|052|`drift:end`, score over 8,000|sliding the whole damn block|B|
|053|`drift:end`, score over 2,000|smoke show|B|
|054|`drift:end`, score over 8,000|that was art|B|
|055|`drift:end`, score over 5,000|10/10 slide|B|
|056|`drift:end`, score over 2,000|sideways down {street}|B|
|057|`drift:end`, score over 5,000|never even braked|C|
|058|`drift:end`, score over 2,000|my tyres could never|C|
|059|`drift:end`, score over 8,000|teach me|C|
|060|`drift:end`, score under 300|that wasn't a drift lol|C|

### 6 · Jumps

Fires on `jump:landed` while live.

|#|When|Line|Tier|
|---|---|---|---|
|061|`jump:landed`, metres over 15|AIRBORNE|A|
|062|`jump:landed`, metres over 15|air bayhaven|A|
|063|`jump:landed`, metres over 20|{metres} metres!!|A|
|064|`jump:landed`, no crash within 1 s|stuck the landing|A|
|065|`jump:landed`, metres over 30|replay replay replay|B|
|066|`jump:landed`, metres over 20|that {vehicle} has wings|B|
|067|`jump:landed`, metres over 30|low altitude airlines|B|
|068|`jump:landed`, a police vehicle under the arc|cleared the cruiser??|B|
|069|`jump:landed`, from a Big Air ramp|who put a ramp there|B|
|070|`jump:landed`, metres over 30|holy shit the hang time|B|
|071|`jump:landed`, crash within 1 s|landed it??|C|
|072|`jump:landed`, metres over 40|my stomach|C|
|073|`jump:landed`, third jump of the stream|frequent flyer|C|
|074|`jump:landed`, metres over 40|gravity called. no answer|C|

### 7 · Crashes

Fires on `vehicle:crash`, `prop:broken`, `vehicle:destroyed` and `ped:hit` while live. Explosions are real, not every driver gets out, and a person hit at over 50 km/h stays down until an ambulance comes.

|#|When|Line|Tier|
|---|---|---|---|
|075|`vehicle:crash`, speed over 40 km/h|ouch|A|
|076|`vehicle:crash`, speed over 60 km/h|there goes the bumper|A|
|077|`vehicle:crash`, vehicle health under 60|hood's gone|A|
|078|`prop:broken`, hydrant|free water park|A|
|079|`vehicle:crash`, into a parked car|call larry|A|
|080|`vehicle:destroyed`|IT BLEW UP|B|
|081|`vehicle:destroyed`, a traffic or police vehicle|did the driver get out??|B|
|082|`vehicle:destroyed`, its driver still inside|he did not get out|B|
|083|`vehicle:crash`, speed over 80 km/h|insurance left the chat|B|
|084|`vehicle:crash`, a door has fallen off|door fell off lol|B|
|085|`ped:hit`, over 50 km/h|that guy is not getting up|B|
|086|`vehicle:crash`, vehicle health under 40|smoke means bad right|B|
|087|`vehicle:crash`, vehicle health under 20|GET OUT it's on fire|C|
|088|`ped:hit`, over 50 km/h, 3 s later|there's a body in the road|C|
|089|an ambulance arrives within 60 m|ambulance is here. keep going|C|
|090|`vehicle:crash`, in a taken vehicle|there goes the deposit|C|

### 8 · Near misses

Fires on `vehicle:nearmiss` while live (see "Signals this file needs").

|#|When|Line|Tier|
|---|---|---|---|
|091|`vehicle:nearmiss`|SO close|B|
|092|`vehicle:nearmiss`, a person|missed by a sandal|B|
|093|`vehicle:nearmiss`, a vehicle|threaded it|B|
|094|`vehicle:nearmiss`, gap under 0.5 m|inches|B|
|095|`vehicle:nearmiss`, a vehicle|how the hell did that fit|B|
|096|`vehicle:nearmiss`|i closed my eyes|B|
|097|`vehicle:nearmiss`, a tourist|that tourist saw his whole life|C|
|098|`vehicle:nearmiss`, a jogger|jogger didn't even look up|C|
|099|`vehicle:nearmiss`, a vehicle|paint swap. no crash|C|
|100|`vehicle:nearmiss`, a vehicle|that mirror's gone though|C|
|101|`vehicle:nearmiss`, a person|waved sorry lol|C|
|102|`vehicle:nearmiss`, gap under 0.5 m|that gap did not exist|C|

### 9 · Hiding

Fires when `state.heat.seen` has been false for 3 s. Also the filler pool while unseen. These lines are the tell that viewers are draining.

|#|When|Line|Tier|
|---|---|---|---|
|103|unseen 3 s|where'd he go|A|
|104|unseen 3 s|can't see shit|A|
|105|unseen 6 s|boring|A|
|106|unseen 6 s, viewers under half of peak|viewers dropping|A|
|107|unseen 6 s|do something!!|B|
|108|unseen, in a car wash|is that a car wash|B|
|109|unseen, under the expressway|under the bridge i bet|B|
|110|unseen, parked with the engine off|this is just a parking lot now|B|
|111|unseen 10 s|i'm leaving|B|
|112|unseen 6 s|chopper lost the car|B|
|113|unseen, parked with the engine off|engine's off. smart|C|
|114|unseen 10 s|zzz|C|
|115|unseen 10 s|wake me when something moves|C|
|116|unseen 15 s|boring on purpose. respect|C|

### 10 · Changing cars

Fires on `vehicle:entered` while live, when the vehicle is not the one the stream started with.

|#|When|Line|Tier|
|---|---|---|---|
|117|`vehicle:entered`, a different vehicle|new car who dis|A|
|118|`vehicle:entered`, a different vehicle|swapped!!|A|
|119|`vehicle:entered`, a different vehicle|now it's a {vehicle}|B|
|120|`vehicle:entered`, unseen|cops didn't see the swap|B|
|121|`heat:dropped`, by a change of car|lost a siren for that|B|
|122|`vehicle:entered`, slower than the last one|downgrade|B|
|123|`vehicle:entered`, faster than the last one|upgrade|B|
|124|`vehicle:entered`, Birdie, Pinfish or Manatee|a {vehicle}. bold|C|
|125|`heat:dropped`, by a change of outfit|new shirt too??|C|
|126|`vehicle:entered`, third swap of the stream|different car same chaos|C|

### 11 · Mags is seen

Fires the first time Mags is seen on a stream, then on any `drift:end`, `jump:landed` or `ped:filming` while she is the active lead.

|#|When|Line|Tier|
|---|---|---|---|
|127|Mags seen, first time this stream|grandma???|A|
|128|Mags seen, first time this stream|is that a grandma|A|
|129|Mags seen|she's wearing a visor|A|
|130|`drift:end`, lead Mags|GRANDMA DRIFT|A|
|131|Mags seen|driving gloves. she means it|B|
|132|Mags seen, in a vehicle|she signalled. in a chase|B|
|133|`jump:landed`, lead Mags|nana has no brakes|B|
|134|Mags seen, followers 10,000 or more|mags!! mags!! mags!!|B|
|135|Mags seen, followers 10,000 or more|she's 61 and faster than dale|B|
|136|`drift:end`, lead Mags|my grandma could never|B|
|137|Mags seen, deputies firing|do NOT shoot the grandma|C|
|138|`drift:end`, lead Mags, score over 5,000|who taught her that|C|
|139|Mags seen, followers 10,000 or more|31 years no accidents btw|C|
|140|`weapon:fired`, lead Mags, shotgun|grandma's got a shotgun|C|

### 12 · The bus

Fires while live when the player's vehicle is a Manatee or Manatee S.

|#|When|Line|Tier|
|---|---|---|---|
|141|`vehicle:entered`, Manatee|NOT THE BUS|A|
|142|in a Manatee, filler|the bus is winning|A|
|143|`vehicle:crash` into a police vehicle, in a Manatee|cruisers bouncing off it|A|
|144|in a Manatee, filler|next stop: away|B|
|145|in a Manatee, filler|nobody's getting off|B|
|146|in a Manatee, filler|exact change only|B|
|147|in a Manatee, lead Mags|that's the 9 bus|B|
|148|in a Manatee, filler|the bus gives zero shits|C|
|149|`vehicle:crash`, in a Manatee|9,000 kilos of no|C|
|150|in a Manatee, on an avenue|every lane is the bus lane|C|

### 13 · Boats

Fires while live when the player's vehicle is a boat.

|#|When|Line|Tier|
|---|---|---|---|
|151|`vehicle:entered`, any boat|on a boat now|B|
|152|in a boat, no Hammerhead within 300 m|cruisers can't swim|B|
|153|`vehicle:entered`, Skimmer|jet ski!!!|B|
|154|in a boat, filler|send the patrol boat|B|
|155|in a boat, within 100 m of a marina|that's a no-wake zone|B|
|156|in a boat, speed over 60 km/h|splash zone|C|
|157|in a Gatorback, on land|airboat on the grass lol|C|
|158|in a boat, filler|the pelicans are judging|C|
|159|in a boat, deputies firing|shooting at a boat. good luck|C|
|160|in a boat, unseen 3 s|sea you later|C|

### 14 · Helicopter cam

Fires when `chopper.active` turns true, and as filler while the view is on.

|#|When|Line|Tier|
|---|---|---|---|
|161|chopper cam switched on|chopper cam!!|A|
|162|chopper cam switched on|look how small|A|
|163|chopper cam, filler|best seat in the house|A|
|164|chopper cam, filler|i can see my house|B|
|165|chopper cam, in Meridian|hi Spire|B|
|166|chopper cam, hour 20 to 5|spotlight's right on it|B|
|167|chopper cam, filler|nice flying, pilot|B|
|168|chopper cam, shots within 5 s|you can see the muzzle flashes|C|
|169|chopper cam, filler|this angle is cinema|C|
|170|chopper cam, filler|zoom in zoom in|C|

### 15 · Getting away

Fires on `heat:cleared` from level 3 or more. The overlay stays up 4 s so these can be read.

|#|When|Line|Tier|
|---|---|---|---|
|171|`heat:cleared` from 3 or more|they LOST him??|A|
|172|`heat:cleared` from 3 or more|no way|A|
|173|`heat:cleared` from 3 or more|gone. show's over|A|
|174|`heat:cleared` from 4 or more|dale's gonna be pissed|B|
|175|`heat:cleared` from 3 or more|no arrest again lol|B|
|176|`heat:cleared` from 3 or more|same time tomorrow|B|
|177|`heat:cleared`, peak viewers over 50,000|great episode|B|
|178|`heat:cleared`, peak viewers over 100,000|best one this week|B|
|179|`heat:cleared` from 3 or more|gg|B|
|180|`heat:cleared`, stream under 60 s|got boring. we left|B|
|181|`heat:cleared`, in a vehicle|sheriff 0, {vehicle} 1|C|
|182|`heat:cleared` from 5|roll credits|C|
|183|`heat:cleared`, peak viewers over 100,000|ratings were good at least|C|
|184|`heat:cleared`, shots were fired|all that shooting for nothing|C|

### 16 · Being caught

Fires on `player:knockedout` at heat 3 or more. Nobody is booked while live: deputies shoot, the player goes down, and wakes at Bayhaven General.

|#|When|Line|Tier|
|---|---|---|---|
|185|`player:knockedout`, live|they got him|A|
|186|`player:knockedout`, live|down!!|A|
|187|`player:knockedout`, live, by gunfire|they shot him. on tv|A|
|188|`player:knockedout`, live|nooo|B|
|189|`player:knockedout`, live|ambulance!! get the ambulance|B|
|190|`player:knockedout`, live|call larry!!|B|
|191|`player:knockedout`, live|is he dead?? he's not moving|B|
|192|`player:knockedout`, stream over 3 minutes|what a run though|B|
|193|`player:knockedout`, heat 5|dale's doing the pose|C|
|194|`player:knockedout`, live|wristband time|C|
|195|`player:knockedout`, live|that hospital bill tho|C|
|196|`player:knockedout`, live, by gunfire|shot on live tv. what a town|C|

### 17 · The six A missions

Fires on `mission:step` in the named mission, only if the overlay is already up. Final Notice, Repo Woman, Open House and Yacht Rock do not force heat 3, so their lines are a reward for players who get there on their own.

|#|When|Line|Tier|
|---|---|---|---|
|197|`final-notice`, step 3|that tow truck has a scooter|B|
|198|`final-notice`, step 3|tow truck ran a red!!|B|
|199|`final-notice`, step 4|she's ramming a tow truck|B|
|200|`final-notice`, step 4|give the kid his damn scooter|B|
|201|`final-notice`, step 5|the scooter's loose!!|B|
|202|`final-notice`, step 5|all this for a scooter?|B|
|203|`repo-woman`, step 2|that's the Hotel Alba car|B|
|204|`repo-woman`, step 2|it's a repo job lol|B|
|205|`repo-woman`, step 3|don't scratch it!!|B|
|206|`repo-woman`, step 4|the owner's in a grouper|B|
|207|`repo-woman`, step 4|grouper's ramming!!|B|
|208|`repo-woman`, step 4, within 100 m of the garage|wendell gets his cars|B|
|209|`open-house`, step 5|golf cart getaway??|B|
|210|`open-house`, step 5|what's in the binder|B|
|211|`open-house`, step 6|security carts lol|B|
|212|`open-house`, step 6|on the fairway now|B|
|213|`open-house`, step 6|fore!!|B|
|214|`open-house`, step 7|THROUGH THE HEDGE|B|
|215|`as-seen-on-tv`, step 3|he WANTS to be on tv|B|
|216|`as-seen-on-tv`, step 3|60 seconds let's go|B|
|217|`as-seen-on-tv`, step 3|his stream's on our stream|B|
|218|`as-seen-on-tv`, step 3, after 20 s|do a stunt for the chat|B|
|219|`as-seen-on-tv`, step 3, followers under 1,000|212 followers lol|B|
|220|`as-seen-on-tv`, step 4|ok i followed him|B|
|221|`yacht-rock`, step 7|jumped off a yacht!!|B|
|222|`yacht-rock`, step 7|into the speedboat!!|B|
|223|`yacht-rock`, step 7|jet skis behind them|B|
|224|`yacht-rock`, step 7, near Sandpiper Bridge|under the bridge go go|B|
|225|`yacht-rock`, step 7|whose party was that|B|
|226|`yacht-rock`, step 7|floral shirt overboard|B|
|227|`the-spire-job`, step 5|A BUS. IN A HURRICANE.|B|
|228|`the-spire-job`, step 5|she's holding the dock alone|B|
|229|`the-spire-job`, step 6|someone's on the Spire!!|B|
|230|`the-spire-job`, step 6|the cradle is swinging!!|B|
|231|`the-spire-job`, step 7|bullets AND lawn chairs flying|B|
|232|`the-spire-job`, step 7, within 600 m of the pier|GO GO GO PAST THE PIER|B|

### 18 · The finale

Fires in `going-viral`, step 3, when Mags parks the bus between two cones. There is no heat. The overlay comes up because Teo goes live while she parks, and the chat loves it however she does it. Show rows 233 to 236 in order, one a second, then pick from the rest.

|#|When|Line|Tier|
|---|---|---|---|
|233|`going-viral`, step 3, bus within 20 m of the cones|she's parking it|A|
|234|`going-viral`, step 3, bus reversing|between the cones!!|A|
|235|`going-viral`, step 3, bus reversing|mirror check. legend|A|
|236|`going-viral`, step 3, bus stopped|14 seconds of perfect|A|
|237|bus stopped, no cone touched|didn't touch a single damn cone|A|
|238|bus stopped, a cone touched|cones had it coming|A|
|239|bus stopped, more than 10 degrees off|crooked is a style|B|
|240|`going-viral`, step 3, bus reversing|PARK. THE. BUS.|B|
|241|bus stopped|watched this 40 times|B|
|242|bus stopped|why is this so calming|B|
|243|bus stopped|grandma. i'm not asking now|B|
|244|bus stopped|31 years no accidents|B|
|245|bus stopped|the handbrake click. chills|B|
|246|bus stopped|teo finally did it|C|
|247|bus stopped|all of us watching a bus park|C|
|248|credits start|bayhaven forever|C|
|249|credits start|goodnight everybody|C|
|250|credits start|best ending. no notes|C|

## Counts

|Group|Rows|Lines|
|---|---|---|
|1 Going live|001 to 014|14|
|2 to 4 Heat 3, 4 and 5 rising|015 to 044|30|
|5 Drifts|045 to 060|16|
|6 Jumps|061 to 074|14|
|7 Crashes|075 to 090|16|
|8 Near misses|091 to 102|12|
|9 Hiding|103 to 116|14|
|10 Changing cars|117 to 126|10|
|11 Mags is seen|127 to 140|14|
|12 The bus|141 to 150|10|
|13 Boats|151 to 160|10|
|14 Helicopter cam|161 to 170|10|
|15 Getting away|171 to 184|14|
|16 Being caught|185 to 196|12|
|17 The six A missions, six lines each|197 to 232|36|
|18 The finale|233 to 250|18|

Session D5-S1 takes the A rows in groups 1, 2, 5, 6, 7, 9, 10, 11, 15 and 16 (40 lines). Session D5-S2 takes the A rows in groups 3, 4, 12 and 14 (20 lines). The Going Viral session takes the six A rows in group 18. Rows 018, 019 and 127 are the samples from `04-systems.md`, word for word.

## New names

- The 30 usernames in the table above. They are chat names only and belong to nobody in the cast, except `dockside_del`, who is the Del behind `@dockside.del` on Squawk.
- `vehicle:nearmiss`: an event name proposed above. It is not canon until the vehicles lane writes it into its contract file.
