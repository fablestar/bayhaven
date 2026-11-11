# Bible · catalog · Weapons

Fifteen weapons: the seven from `04-systems.md` section 8 with their numbers unchanged, a real arsenal of six more (bat, knife, revolver, rifle, sniper rifle, grenade) and two stupid ones that still get people hurt. Every weapon is lethal, for you and against you. Each has its numbers, a shop, its model in boxes, its sound and what people do when it lands.

Tier: A for the seven from `04-systems.md` (combat ships on day 5). B and C for the eight extras, tagged per row.

## Rules for every weapon

| Rule | Value |
|---|---|
| Tone | A crime game for adults. People who reach zero health stay down. It is drawn low-poly: a hit is a pale flash on the body box and a puff of dust, and a body is six boxes lying still. No wounds, no pools, no close-ups. |
| Player | Health 100, armour 100 (a life vest from Storm Mart, $300). Armour takes damage first. Food restores health; it creeps back to 30 on its own. At zero you are knocked out and wake at Bayhaven General. |
| Health of others | bystander 60 · security guard 100 · rival crew 100 · deputy 120 · tactical deputy 200 · Chad or Brad 250 |
| Down | Anyone at zero drops on the rope body and stays down. An ambulance comes for them. The body is removed when the ambulance leaves, or after 30 s out of view. |
| Head | A free-aimed hit on the head box does double damage. Lock-on aims at the torso. |
| Quick bar | Three slots, never a wheel. Slot 1 hands (fists, noodle, flamingo, bat, knife). Slot 2 sidearm (pistol, revolver, SMG, flare gun). Slot 3 heavy (shotgun, rifle, sniper rifle, grenades, leaf blower, T-shirt cannon). One per slot per lead. |
| Aim | Hold aim to lock the nearest threat inside the weapon's range and in view. Mouse players may free-aim. Mags's spread is × 0.7. Teo reloads 20% faster and his melee damage is × 0.85. |
| From a vehicle | Slot 2 weapons only, fired sideways and forwards. |
| Against vehicles | A round does 0.3 × its damage to vehicle health; shotgun and rifle 0.5 ×; grenades 4 ×. One round bursts a tyre. Pistol and SMG rounds stop in a door; revolver, rifle and sniper rounds go through. At zero the vehicle explodes as `04-systems.md` says, doing 150 at its centre falling to 30 at 6 m. |
| Enemy fire | Enemies shoot in bursts of 3 and hit with 20% of rounds at 20 m, 35% inside 8 m. They take cover behind cars, call out, and run when alone. |
| Heat | In a deputy's or camera's view, or heard within 120 m: firing a pistol, revolver or flare gun +1 · firing an SMG, shotgun, rifle or sniper rifle, or a grenade going off, +2 · hurting a bystander +1 · killing anyone +2 · killing a deputy +3. Melee is silent. |
| Bystanders | Flee from any shot within 60 m. Traffic within 40 m floors it. The brave ones film from behind a car. |
| Losing them | Booked: all weapons and ammo are taken. Knocked out: you keep them. |
| Save | `weapons` maps id to spare ammo, as in the sample save: `{"pistol": 24}`. A weapon with no ammo saves as 0. |
| Events | Each use emits `weapon:fired` with `{weapon, x, z}`. A hit emits `ped:hit` with `{id, target, down, head, dist, speed, weapon}`. Each offence emits `crime` with kind `shots`, `hit-and-run`, `killing` or `deputy-down`. |

### Hit reactions

| Damage in one hit | The target |
|---|---|
| 0 (a push) | does what the weapon's entry says |
| 1 to 10 | flinches for 0.3 s |
| 11 to 39 | staggers back 1 m for 0.6 s; a bystander runs and does not stop |
| 40 or more | is knocked off their feet for 2 s, if still alive |
| any hit that empties health | drops and stays down |

## The table

Damage is per hit or per round. Range in metres. Rate is hits or rounds a second. Ammo is what the weapon holds, then the most spare a lead can carry. Reload in seconds.

| id | Weapon | Slot | Damage | Range | Rate | Ammo | Reload | Price | Shop | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| `fists` | Fists | 1 | 12 | 1.2 | 2.0 | none | none | none | none | A |
| `noodle` | Pool noodle | 1 | 8 | 1.8 | 3.3 | none | none | $0 | Storm Mart, Surf & Vinyl, any beach shop | A |
| `flamingo` | Lawn flamingo | 1 | 25 | 1.6 | 0.8 | 10 hits, then it breaks | none | $25 | Storm Mart, Frond Memories, or any lawn | A |
| `pistol` | Pistol | 2 | 18 | 35 | 3.0 | 12, 96 spare | 1.4 | $600 | Bait & Ballistics | A |
| `smg` | SMG | 2 | 9 | 25 | 12 | 30, 180 spare | 1.8 | $2,200 | Bait & Ballistics | A |
| `shotgun` | Shotgun | 3 | 60 at 5 m, 10 at 20 m | 20 | 1.0 | 6, 36 spare | 0.5 a shell | $1,800 | Bait & Ballistics | A |
| `flare` | Flare gun | 2 | 5 | 60 | 0.5 | 1, 8 spare | 2.0 | $250 | Storm Mart, Bait & Ballistics | A |
| `bat` | Bat | 1 | 30 | 1.5 | 1.2 | none | none | $40 | Second Wind Thrift, Galleria Flamingo | B |
| `knife` | Fillet knife | 1 | 40 | 1.0 | 2.0 | none | none | $30 | Bait & Ballistics, the bait side | B |
| `revolver` | Revolver | 2 | 45 | 40 | 1.2 | 6, 48 spare | 2.4 | $1,200 | Bait & Ballistics | B |
| `rifle` | Rifle | 3 | 30 | 90 | 6 | 30, 150 spare | 2.0 | $2,900 | Bait & Ballistics in the Glades and on Tackle Key | B |
| `sniper` | Sniper rifle | 3 | 150 | 250 | 0.6 | 5, 25 spare | 3.0 | $3,500 | Bait & Ballistics in the Glades | C |
| `grenade` | Grenade | 3 | 200 at the centre, 0 at 8 m | 30 | 0.5 | 1 in hand, 5 spare | none | $300 each | Bait & Ballistics in the Glades, from the fridge marked "live bait" | C |
| `blower` | Leaf blower | 3 | 0 | 8 | held | 20 s of fuel, 3 spare tanks | 2.0 | $180 | Storm Mart | B |
| `tcannon` | T-shirt cannon | 3 | 6 | 45 | 0.7 | 5, 20 spare | 2.5 | $450 | Galleria Flamingo | B |

Spare ammo: pistol $40 for 24 · SMG $60 for 60 · shotgun $50 for 12 · flares $15 each · revolver $45 for 12 · rifle $90 for 60 · sniper $100 for 5 · blower fuel $10 a tank · shirts $30 for 5. The dearest thing on the list is the sniper rifle at $3,500 and the cheapest is the noodle at $0, the range `04-systems.md` sets.

Model notation: `name:L×W×H` in metres, L along the aim. Each weapon is 2 to 7 boxes, 24 to 84 triangles, held in the right hand unless the entry says two hands. Guns are graphite `#3b3946` with one coloured part so the type reads from a moving car.

## The seven from the core

### Fists · `fists` · tier A
- **Looks like:** nothing extra. The arm box swings on a 0.25 s arc.
- **How it works:** a three-hit combo: left, right, then a wind-up. The third hit knocks the target down whatever their health.
- **Sound:** a 40 ms noise burst through a 400 Hz low-pass and a click at 220 Hz. The third hit adds the 60 Hz thump.
- **When hit:** a stagger on one and two; on three they go over backwards and take 2 s to get up, angry. It takes nine punches to put a guard down for good, and he will have shot you by the fifth.

### Pool noodle · `noodle` · tier A
- **Looks like:** `tube:1.5×0.07×0.07` in neon pink `#ff3fa4`, cyan `#29e6ff` or mint `#5dff9b` by seed. It bends 15° on each swing.
- **How it works:** fast and free at any beach shop. It never breaks, and it can take the last point of health like anything else. Beating a man to the floor with foam takes 13 hits and a certain kind of person.
- **Sound:** the noodle recipe in `07-art-and-audio.md`: a sine dropping from 300 to 150 Hz in 90 ms.
- **When hit:** a flinch and a hand to the head. Bystanders do not flee from a noodle; they film it. Deputies hit with one stop for 1 s to look at it, which is sometimes enough.

### Lawn flamingo · `flamingo` · tier A
- **Looks like:** `body:0.35×0.14×0.22` `neck:0.08×0.06×0.35` `head:0.14×0.06×0.08` `legs:0.03×0.03×0.6×2`, all `#ff9eb5` with an ink beak. Held by the legs, two hands.
- **How it works:** slow and heavy. After 10 hits it snaps and you are holding two legs, which count as fists. Pulling one from a Mallard Greens lawn is free and earns a $50 fine by text. These are not the 100 collectible flamingos, which glow.
- **Sound:** a hollow knock: a 180 Hz sine with a 60 ms decay over the noise burst.
- **When hit:** a stagger. The tenth hit showers pink plastic chips (6 pooled debris pieces). The news calls it "a lawn ornament" and so does the coroner.

### Pistol · `pistol` · tier A
- **Looks like:** `slide:0.2×0.035×0.05` `grip:0.05×0.035×0.12` `guard:0.05×0.02×0.03`, graphite with a mango tip.
- **How it works:** 12 rounds, 1.4 s reload, 18 a round. Spread 1.5°. Rounds are instant along a ray through the spatial hash. Six to the body drops a guard, seven a deputy.
- **Sound:** a 30 ms noise burst and a click at 900 Hz, then a brass tinkle 0.2 s later.
- **Looks in flight:** a pale streak 0.4 m long that fades in 80 ms. Where it lands: a dust puff, and a chip out of a wall.
- **When hit:** a flinch, then a stagger from the second round inside 1 s. Anyone unarmed runs.

### SMG · `smg` · tier A
- **Looks like:** `body:0.3×0.045×0.07` `clip:0.04×0.03×0.16` `grip:0.05×0.035×0.1` `stock:0.18×0.03×0.04`, graphite with a cyan clip.
- **How it works:** 30 rounds, sprays. Spread starts at 2° and opens to 7° over the first second of holding the trigger; it closes again in 0.5 s. 9 a round. The best thing to fire from a car window and the worst thing to fire near a crowd.
- **Sound:** the pistol's burst 12 times a second, each click pitched between 700 and 800 Hz so it rattles.
- **When hit:** flinches stack into a stagger after three rounds. Loose props in the cone (café tables, umbrellas, signs) go over, each as `prop:broken`.

### Shotgun · `shotgun` · tier A
- **Looks like:** `barrel:0.6×0.04×0.04` `pump:0.16×0.05×0.05` `body:0.2×0.045×0.07` `stock:0.25×0.04×0.09`, wood `#8a6f55` and graphite. Two hands.
- **How it works:** 6 shells, loaded one at a time at 0.5 s each; firing cuts the reload short. Damage is 60 at 5 m or closer and 10 at 20 m, falling in a straight line between: `60 - (d - 5) × 3.33`. Nothing past 20 m. Eight rays in a 9° cone share the damage.
- **Sound:** an 80 ms noise burst plus a low boom, a sine dropping from 110 to 50 Hz in 0.25 s. The pump is two clicks.
- **When hit:** knocked over at any range, as `04-systems.md` says. Inside 5 m the target slides 2 m and rarely gets up. A vehicle panel hit inside 5 m comes loose.

### Flare gun · `flare` · tier A
- **Looks like:** `barrel:0.16×0.06×0.06` `grip:0.05×0.04×0.11`, safety orange `#ff9a3c`.
- **How it works:** one flare, lobbed on an arc at 30 m/s, burning 8 s where it lands with a red-pink glow sprite 6 m wide. 5 on a direct hit. It sets off any fireworks crate within 2 m (12 crates stand in Storm Mart yards and on the pier), and it lights any vehicle already smoking: health under 40% jumps straight to the fire stage. Everyone within 40 m who can see the flare films it, which feeds followers and viewers.
- **Sound:** a hollow thump (noise through a 300 Hz band-pass), then a whistle rising from 600 to 1,400 Hz in flight.
- **When hit:** a yelp, and 2 s spent slapping at their own shirt. Fired at the Pufferfish it brings the blimp down (`vehicles-other.md`).

## The arsenal

### Bat · `bat` · tier B
- **Looks like:** `barrel:0.55×0.065×0.065` `handle:0.3×0.03×0.03`, bare aluminium `#c8ccd2` with a strip of grip tape. Two hands.
- **How it works:** 30 a swing, a little over one swing a second. Every third hit in a row knocks the target down. Against a vehicle each hit takes 6 health and breaks one light or window. Silent, so it adds no heat unless somebody sees it.
- **Sound:** a ringing ping, a 1,100 Hz sine with a 0.3 s decay, over the 60 Hz thump.
- **When hit:** a stagger and a raised arm. Four hits put a guard down. People who see a bat come out of a car start apologising before you reach them.

### Fillet knife · `knife` · tier B
- **Looks like:** `blade:0.2×0.004×0.025` `handle:0.11×0.02×0.025`, steel with a cork-yellow handle. It is sold next to the hooks.
- **How it works:** 40 a hit, two a second, reach 1.0 m. From behind, on someone who has not seen you, it does triple damage, which drops a guard or a deputy without a sound. It is the only quiet way through the yacht, the clubhouse and the Spire's service floors.
- **Sound:** almost none: a 15 ms tick of high noise.
- **When hit:** a stagger and a hand clamped to the side. From behind: they fold where they stand. The camera never moves in to look.

### Revolver · `revolver` · tier B
- **Looks like:** `barrel:0.18×0.03×0.035` `drum:0.05×0.05×0.05` `grip:0.05×0.035×0.11`, graphite with a wooden grip.
- **How it works:** six rounds at 45 each, slow to fire and slow to load: 2.4 s for all six. Spread 1°, opening to 4° if fired faster than once a second. Rounds go through car doors and through one person into the next.
- **Sound:** a 50 ms burst and a bark at 500 Hz, with a 0.4 s tail through a delay. It is the loudest sidearm; deputies hear it at 160 m, not 120.
- **When hit:** knocked off their feet by every round. Three put a deputy down. A guard who hears one fired at him usually reconsiders the job.

### Rifle · `rifle` · tier B
- **Looks like:** `barrel:0.45×0.03×0.03` `body:0.3×0.05×0.08` `clip:0.05×0.03×0.18` `stock:0.25×0.04×0.08` `sight:0.06×0.02×0.04`, graphite with a sand `#f2ddb0` stock. Two hands.
- **How it works:** 30 rounds at 30 each, six a second, good to 90 m. Spread 1° held still, 3° moving. Rounds go through car doors. This is what turns a traffic stop into Breaking News: firing it is +2 on its own.
- **Sound:** a hard crack, a 20 ms burst through a 1.5 kHz high-pass, with an echo 0.15 s later off the nearest wall.
- **When hit:** a stagger on every round; four drop a deputy. Enemies who see one stay behind their engine block and shout for more people.

### Sniper rifle · `sniper` · tier C
- **Looks like:** `barrel:0.7×0.03×0.03` `body:0.3×0.05×0.07` `scope:0.25×0.04×0.04` `stock:0.3×0.04×0.1` `legs:0.02×0.02×0.2×2`, graphite with a cyan lens. Two hands.
- **How it works:** one round at a time, 150 each, good to 250 m. Aiming opens a scope view at 6 × zoom with no lock-on; the view drifts 0.4° unless you crouch or rest on a wall. One round to the body drops a guard or a deputy, one to the head drops anyone, and it bursts a tyre from across the bay.
- **Sound:** a boom and a long tail: the shotgun's low sine under a crack, then 1.2 s of filtered echo. Everyone within 250 m knows.
- **When hit:** they are simply down. The people around them take 1 s to work out why, then scatter.

### Grenade · `grenade` · tier C
- **Looks like:** `body:0.07×0.07×0.09` `lever:0.02×0.01×0.08`, olive `#6a8f4e` with a mango ring.
- **How it works:** hold to cook, release to throw up to 30 m on an arc; it bounces and goes off 3 s after the pin. 200 at the centre, falling in a straight line to nothing at 8 m. Any vehicle within 4 m takes 4 × the damage, which blows up most things on the road. A grenade that lands in an open Mullet bed, a Conch hatch or a convertible counts as the centre.
- **Sound:** the explosion recipe in `07-art-and-audio.md`: long low-passed noise, a sub drop, a crackle of falling debris. Before it: two metallic bounces.
- **When hit:** thrown clear on the rope body. Car alarms go off for 100 m. Enemies who see one land run from it, which is the best way to move them out of cover.

## The two stupid ones

### Leaf blower · `blower` · tier B
- **Looks like:** `motor:0.3×0.2×0.25` `tube:0.7×0.1×0.1` `nozzle/f0:0.15×0.12×0.08` `handle:0.15×0.03×0.06`, safety yellow `#ffc300` and graphite. Two hands.
- **How it works:** hold to blow a 30° cone 8 m long. The push falls from 14 m/s² at the nozzle to 0 at 8 m. People in it walk backwards and go over after 1 s. It does no damage, so what it pushes them into does: traffic, the sea, the Sinkhole, the edge of a roof. Loose props, hats and umbrellas fly, and a grenade on the ground goes back where it came from.
- **Sound:** the Mallard Greens ambience made close: noise through a band-pass sweeping 300 to 900 Hz over a 110 Hz square. It winds down for 1.5 s.
- **When hit:** hair and shirt flap, the hat leaves, they swear at you and sit down.

### T-shirt cannon · `tcannon` · tier B
- **Looks like:** `barrel:0.7×0.14×0.14` `tank:0.3×0.1×0.1` `grip:0.06×0.04×0.12` `strap:0.5×0.02×0.02`, white `#fdf6ea` with a pink band. On the shoulder.
- **How it works:** lobs a rolled shirt up to 45 m for 6 damage. Where a shirt lands, everyone within 10 m who is not fleeing walks to it and the first to arrive picks it up. That makes it a lure: for guards off a door, and for a crowd into a street you would like blocked. Shirts are florals from the generator in `clothes.md`.
- **Sound:** a deep cough, a sine dropping from 160 to 70 Hz in 0.15 s under a noise puff, then a slide whistle for the flight.
- **When hit:** the shirt wraps the head for 1.5 s. They stagger blind, pull it off, look at it, and put it on.

## Who carries what

| Enemy | Where | Carries | Tier |
|---|---|---|---|
| Mallard Greens security | the suburb, on Birdies | pistol, and no idea how to hold it | A |
| Bellweather security | Sandpiper Isle, the Spire, the yacht | pistol; SMG in The Spire Job | A |
| Deputies | anywhere at heat 3 and up | pistol; shotgun from heat 4 | A |
| Tactical deputies | from the tactical van, heat 4 and up | SMG; rifle once tier B lands | A |
| Okafor & Daughters | Palma Vieja | pistols and bats | B |
| Chad and Brad | story fights | a shotgun each | B |
| The marksman in the Horsefly | heat 5 | sniper rifle; a red dot shows on you for 1.5 s before each round | C |

At heat 1 and 2 deputies keep their pistols holstered unless you fire first or point a gun at them for 2 s.

## Pick-ups

- A dropped weapon lies where it fell for 60 s as a pick-up with a cyan outline, with whatever was left in it.
- Flamingos stand on about one Mallard Greens lawn in four. One free pool noodle leans on every lifeguard hut along `z = 63`.
- A deputy who goes down drops a pistol. A tactical deputy drops an SMG. Taking either in view is heat +1.
- Fireworks crates come back each in-game day at 09:00.

## New names

None. `fists` `noodle` `flamingo` `pistol` `smg` `shotgun` `flare` `bat` `knife` `revolver` `rifle` `sniper` `grenade` `blower` `tcannon` are ids only. No weapon carries a maker's name or a model number.
