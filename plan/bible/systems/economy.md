# Bible · systems · Economy

Two numbers: cash buys things, followers are a score that also pays. This file is the balance sheet: every way cash comes in and goes out with the numbers from `04-systems.md` section 12 unchanged, the price curves, and an hour-by-hour path through the first ten hours showing when a typical player can afford each property.

Tier: A (cash, followers, shops and brand deals day 6; property and businesses day 9). Rows marked B or C price things that arrive with those tiers.

## Purpose

Keep the next purchase one or two sessions away for the whole game.
Make followers the long-term income, so the game's own signature pays the bills.

## Data

Owner: `src/systems/economy.js`, `shops.js`, `property.js`; prices in `src/content/shops.js`, `properties.js`, `vehicles.js`, `clothes.js`. Cash is shared by both leads. Followers start at 212 and never fall. Hurting people earns neither.

### Cash in

| Source | Amount | Notes | Tier |
|---|---|---|---|
| Story missions | $500 (first) rising to $250,000 (the Spire) | full list below | A to C |
| Side jobs | $40 to $400 each | formulas below | A, B |
| Street races | $500 to $5,000 | four prizes: $500, $1,000, $2,500, $5,000. A repeat win pays 25% | A |
| Brand deals | `followers × $0.02` each in-game day at 09:00, capped at $20,000 | the cap is reached at 1,000,000 followers | A |
| Scrapyard | 5% of a stolen car's value, once per car | read as once per model: the yard keeps a list of what it has had from you | A |
| Lawn flamingos | $250 each | 40 in the day 9 build | A |
| Big Air ramps | $500 each, once | 15 in the day 9 build | A |
| Businesses | $700 to $4,200 a game day at 09:00 | see property | A |

```text
 1 final-notice      $500    A      11 yacht-rock        $12,000   A
 2 content-is-king   $800    B      12 paint-it-pink     $7,000    C
 3 repo-woman        $1,200  A      13 the-binder        $15,000   B
 4 hot-sauce         $1,500  B      14 speedbowl         $10,000   B
 5 open-house        $4,000  A      15 dry-run           $4,000    B
 6 glow-up           $5,000  B      16 hurricane-party   $9,000    C
 7 as-seen-on-tv     $2,500  A      17 evacuation-route  $12,000   C
 8 swamp-thing       $6,500  B      18 the-spire-job     $250,000  A
 9 crane-game        $8,000  B      19 eye-of-the-storm  $60,000   B
10 injury-time       $3,000  C      20 going-viral       $0        A
```

The six A missions pay $270,200. All twenty pay $412,000. Mission 7 also gives 5,000 followers.

Side jobs: Bay Cab fares $40 to $180, Pelican Eats $30 to $120, repo runs $200 to $400, drift corners $250, and from the bonus pool airboat races $800, jet-ski slaloms $600, gator wrangling $350, the cart derby $1,000, pier fishing $5 to $900, valet $60. Rule of thumb: no endless job pays more than $3,000 for an hour of nothing else.

### Cash out

| Thing | Price | Tier |
|---|---|---|
| Food | $5 ice cream (15 health), $12 sandwich (35), $25 plate (70), $40 feast (full) | A |
| Coffee at Ventanita Rosa | $6: sprint stamina doubled for 2 minutes | A |
| Clothes | $15 to $4,000 on the curve below | A |
| Repair | `$100 + $8` for each point of health missing | A |
| Paint, two-tone, wraps | $250, $600, $1,500 to $4,000 | A |
| Engine levels 1, 2, 3 | $2,500, $7,500, $25,000 | A |
| Grip tyres, off-road tyres | $1,800, $1,400 | A |
| Nitro | $4,500, refills free | A |
| Horn sounds | $100 each | A |
| Pool noodle | $0 | A |
| Flare gun, pistol, SMG, shotgun | $150, $450, $1,800, $3,500 | A |
| Ammo | 12 rounds $30, 30 rounds $90, 6 shells $60, a flare $20 | A |
| Life vest | $300 | A |
| Car wash | $25 | A |
| Garage delivery | $50 | A |
| Hospital | 5% of cash, up to $2,500 | A |
| Booking | 10% of cash, up to $5,000 | A |
| Bus, Baylink, ferry | $2, $3, $5 | C |
| Bay Cab as a passenger | `$15 + $20` a kilometre | C |
| A vehicle at Wahoo World | its value, below | C |

Lawyer Larry halves the hospital and booking costs once you have met him. Past 100,000 followers every shop gives 10% off. That does not apply to property, charges or fares.

### Property

| Property | Price | Garage | Daily income | Typical hour bought |
|---|---|---|---|---|
| Pelican Rest trailer | free | 1 | 0 | start |
| Tideline Motel, room 12 | $8,000 | 1 | 0 | 2 |
| Flat over the bakery, Palma Vieja | $35,000 | 2 | 0 | 5 |
| Business: food truck | $45,000 | | $700 | 7 |
| Fish camp, Mudcat Glades | $60,000 | 2 + boat | 0 | 9 |
| Paintworks loft | $90,000 | 2 | 0 | 9 |
| Business: Coral Arcade | $120,000 | | $1,500 | 9 |
| Rustwater warehouse | $150,000 | 6 | 0 | 10 |
| Business: Gator Putt mini-golf | $200,000 | | $2,600 | 13 |
| Houseboat, Pelican Keys | $220,000 | 1 + 2 boats | 0 | 16 |
| Business: car wash | $300,000 | | $4,200 | 20 |
| Bellweather mansion, after the story | $2,500,000 | 8 + helipad | 0 | about 50 |

A business earns its price back in 64 to 80 game days. They are a late-game drip, not a shortcut. Everything together costs $3,728,000.

### Vehicle values

Used for scrap (A) and for buying (C). The curve is `600 × e^(top km/h ÷ 37)` times a class factor, rounded to $500.

```text
pinfish     $2,500    mullet    $18,000   flounder    $38,500   pelican    $68,500
birdie      $5,000    tarpon    $21,000   hogfish     $41,000   sturgeon   $90,500
skimmer     $12,500   heron     $24,500   wahoo       $47,500   sailfin    $102,000
snook       $14,000   gatorback $31,500   bullfrog    $48,000   bonito     $300,500
pompano     $15,500   needlefish $33,500  skipjack    $54,500   cormorant  $390,000
                      grouper   $34,500   manatee     $62,500   dragonfly  $453,000
                      tern      $38,000
```

One of every land model in the day 9 build scraps for about $23,000 in all. The yard refuses Sheriff vehicles, cars from your garage and mission cars.

## Formulas

```js
brand    = Math.min(20000, Math.floor(followers * 0.02));            // each game day at 09:00
business = owned.reduce((sum, b) => sum + b.daily, 0);               // the same moment
booked   = Math.min(5000, Math.floor(cash * 0.10)) * (metLarry ? 0.5 : 1);
knocked  = Math.min(2500, Math.floor(cash * 0.05)) * (metLarry ? 0.5 : 1);
price    = Math.round(list * (followers >= 100000 ? 0.9 : 1));       // shops only
scrap    = sold.has(model) ? 0 : Math.floor(value[model] * 0.05);
repair   = 100 + 8 * (100 - health);
clothes  = nice(15 * Math.pow(1.75, rank));     // rank 0 to 10: 15, 25, 45, 80, 140, 245, 430, 755, 1,320, 2,310, 4,000

cabFare  = clamp((25 + 22 * km) * (1.6 - 0.1 * bumps), 40, 180);     // the tip falls with every bump
delivery = clamp(30 + 90 * warmth * Math.min(1, km / 3), 30, 120);   // warmth falls from 1 to 0.3 over twice the par time
repo     = 200 + 200 * Math.max(0, 1 - damage / 30);                 // damage in health points lost
```

Second Wind Thrift sells ranks 0 to 4, ordinary shops ranks 2 to 6, Maison Sable ranks 6 to 10.

A game day is 25.5 real minutes (`weather-time.md`), so there are 2.35 paydays in an hour of play. The clock cannot be skipped outside debug builds (a transit skip moves it 30 game minutes at most), and nothing is paid while the game is closed.

## Payday states

| State | Enters when | Does | Leaves when |
|---|---|---|---|
| Counting | a payday has just been paid, or a new game | nothing | `clock:hour` reaches 9 |
| Due | 09:00 | works out `brand + business` | at once, unless something is in the way |
| Held | due during a mission, a cutscene, or the Booked or Knocked out screen | keeps the amount | that ends |
| Paid | the amount is added | `cash:changed`, `economy:payday { brand, business }`, one Messages line naming a brand (Lightning Bug, SPF 1000, Fizzy Lizard) | back to Counting |

A purchase is simpler: browse, confirm, then paid or declined. Cash can never go below zero and there is no debt.

## The first ten hours

A typical player: half the time in missions, the story in full order (tiers A to C), saving for property. Cash per hour is the target to tune toward, not a law.

| Hour | Missions | Mission pay | Jobs, races, finds | Brand and business | Earned | Followers at end | Running costs | Buys | Cash at end |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1, 2, 3 | 2,500 | 2,600 | 0 | 5,100 | 1,500 | 600 | | 4,500 |
| 2 | 4, 5 | 5,500 | 3,000 | 100 | 8,600 | 4,000 | 1,400 | motel room | 3,700 |
| 3 | 6, 7 | 7,500 | 5,000 | 400 | 12,900 | 12,000 | 3,400 | | 13,200 |
| 4 | 8, 9 | 14,500 | 5,500 | 900 | 20,900 | 30,000 | 3,100 | | 31,000 |
| 5 | 10, 11 | 15,000 | 5,500 | 2,400 | 22,900 | 70,000 | 3,900 | flat | 15,000 |
| 6 | 12, 13 | 22,000 | 5,000 | 4,700 | 31,700 | 130,000 | 4,700 | | 42,000 |
| 7 | 14, 15 | 14,000 | 6,000 | 8,200 | 28,200 | 220,000 | 5,200 | food truck | 20,000 |
| 8 | 16, 17 | 21,000 | 6,000 | 15,000 | 42,000 | 350,000 | 6,000 | | 56,000 |
| 9 | 18 | 250,000 | 5,000 | 31,000 | 286,000 | 900,000 | 15,000 | fish camp, loft, arcade | 57,000 |
| 10 | 19 | 60,000 | 8,000 | 52,200 | 120,200 | 1,100,000 | 10,000 | warehouse | 17,200 |

Reading it:

- **Hours 1 and 2:** $5,000 to $9,000 an hour. The motel room is the first real purchase, and the first reason to save.
- **Hours 3 to 5:** $13,000 to $23,000. Heat 3 chases begin to pay followers; brand deals are still pocket money.
- **Hours 6 to 8:** $28,000 to $42,000. Heat 4 chases push followers past 100,000 and the 10% discount arrives.
- **Hour 9:** the Spire Job pays more than everything before it, and its heat 5 run across the city is worth about half a million followers.
- **After hour 10:** brand deals sit at the cap ($47,000 an hour), businesses add $5,000 to $21,000, play adds about $20,000. The mansion is the long goal.

Followers by milestone on this path: 1,000 inside hour 1, 10,000 in hour 3, 100,000 in hour 6, 1,000,000 in hour 10. A player who farms heat 5 gets there sooner, and the brand cap is what stops that breaking the sheet.

**The day 9 build with only the six A missions:** missions 1, 3 and 5 fall in hour 1 ($5,700), so the motel room comes at about 1 hour 10 minutes. Missions 7 and 11 add $14,500 in hour 2. The Spire Job lands around hour 3, and its $250,000 buys the warehouse and the loft the same evening. Everything after is followers and businesses.

## Events

Emits: `cash:changed { amount, reason }`, `followers:changed`, `followers:milestone { n }`, `shop:opened`, `property:bought`, and the new `economy:payday`, `economy:charge { kind, amount }`, `economy:declined { price }`.
Listens: `clock:hour`, `mission:completed`, `player:booked`, `player:knockedout`, `ped:filming`, `heat:live`, `drift:end`, `jump:landed`, `photo:taken`.
State: `state.economy = { cash, followers, metLarry, scrapped, lastPayDay }`.

## Edge cases

- A business bought after 09:00 first pays the next day.
- A retry of a failed mission never pays twice. Replaying a finished mission (C) pays 10%.
- Booked or knocked out inside a mission costs nothing.
- With the phone open the clock runs at 30%, so payday comes later, not sooner.
- Every follower gain goes through one function, so Go Live's doubling and the phone's `crowdScale` apply once each.
- An old save that lacks `scrapped` or `metLarry` loads them as empty and false.

## Low and high

No number in this file changes with quality. `crowdScale` in `people.md` exists so that a phone, which draws a third of the crowd, earns followers at the same rate as a laptop.

## Script checks

New test entries: `test.economy.set({ cash, followers, metLarry })`, `test.economy.state()`.

1. With 500,000 followers, `test.setHour(8.9)` then waiting past 09:00 adds exactly $10,000. With 2,000,000 it adds $20,000.
2. Booked with $80,000 costs $5,000; with $10,000 it costs $1,000; with `metLarry` it costs $500.
3. Knocked out with $10,000 costs $500; with $80,000 it costs $2,500.
4. Selling a stolen Tarpon to the scrapyard pays $1,050 once. A second Tarpon pays $0.
5. At 100,000 followers a $1,000 shop item costs $900 and the motel room still costs $8,000.
6. Buying above your cash fires `economy:declined` and leaves cash unchanged and never below zero. An owned food truck pays $700 at 09:00.

## New names

Events `economy:payday`, `economy:charge`, `economy:declined` · state fields `state.economy.metLarry`, `scrapped`, `lastPayDay` · test entries `test.economy.set()`, `test.economy.state()`.
