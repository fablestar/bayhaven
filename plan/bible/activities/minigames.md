# Bible · activities · Minigames

Twelve small games played at fixed places: three table and lawn games, pier fishing, three arcade cabinets and a claw machine, and four sports. Each entry gives rules, controls for keyboard, touch and gamepad, scoring, how the opponent plays, and rewards. Dominoes, shuffleboard and bowling can be played for cash. The machines pay in prizes, never cash.

Tier: B for dominoes, mini-golf, pier fishing, the three cabinets and the claw. C for shuffleboard, pickleball, bowling, open mic and the driving range.

## Rules every game shares

| Rule | Value |
|---|---|
| Files | `src/systems/activities/minigames/<id>.js`; cabinets and the claw in `src/systems/activities/arcade/<id>.js` |
| Start | A 3 m ring with a joystick blip. Interact starts it. Blocked at heat 1 or more and during missions. |
| Scene | Each game draws in its own small scene or 2D canvas over the paused street. The clock keeps running. |
| Leave | Hold Interact for 1 s (F, Y, or the door button on touch) |
| Events | `minigame:started {id}`, `minigame:ended {id, score, won}` |
| Stats | Best score and wins are saved under `stats.minigames.<id>` and shown in the Stats app |
| Test API | `test.minigame.start(id, options)`, `test.minigame.state()`, and the usual `test.input([...])` with the action names below |
| Check for each | A scripted game runs to a result with zero errors and saves a score |

Controls use four action names. Each game says what they do.

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Aim | A D W S or arrows | left stick | drag on the play area |
| Action | Space | A | the large button |
| Second | Shift | X | the small button |
| Third | E | B | the third button |

## 01 · Dominoes
`dominoes` · tier B · the four tables in Domino Park `(-1400, -880)` · 09:00–22:00

**Rules**
- A double-six set, 28 tiles. Two players, 7 tiles each, 14 in the boneyard.
- The highest double leads. Take turns adding a tile to either end of the line where the pips match.
- If you cannot play, draw from the boneyard until you can. If it is empty, knock.
- A hand ends when someone plays their last tile (they score the pips left in the other hand) or both players knock (the lower hand scores the difference).
- First to 100 wins. League games on Tuesday at 18:00 are to 50.

**Stakes:** agree one before the first tile: nothing, $50, $200 or $1,000. The winner takes both. After a league win Hector will play for $5,000. Abuela Carmen plays for $1,000 or not at all, and a player who cannot cover a loss owes her, which is worse.

**Controls:** Aim left and right picks a tile, up and down picks the end. Action plays. Second draws or knocks. Touch: tap a tile, then tap an end.

**Opponents:** each waits 0.8–2 s before a move.

| Opponent | How they play |
|---|---|
| A park regular | The heaviest tile that fits, seven times in ten; otherwise any tile that fits |
| Abuela Carmen | Keeps both ends on the numbers she holds most of |
| Hector | Counts every tile played and every knock, then blocks with the number you lack |

**Rewards:** a win is 100 followers. The first win over each opponent gives the Double Six shirt, the Boneyard cap and the Butcher's Apron. Three league wins put a trophy on the trailer shelf and make coffee at Ventanita Rosa free.

## 02 · Mini-golf at Gator Putt
`minigolf` · tier B (the course lot is canon tier C) · Gator Putt `(-600, -150)` · $6 a round, free if you own it

The sign says eighteen holes. Holes 10 to 18 are roped off behind a card: "Alligator on break."

**Rules:** nine holes, par 24. Six strokes at most on a hole, then pick up and score 7. The ball slows at 1.8 m/s² and leaves a wall with 70% of its speed. Water costs one stroke and the ball goes back where it was. The alligators are fibreglass.

**Controls:** Aim left and right turns the putter in 1° steps. Hold Action and power climbs to 100% in 1.2 s, then falls back. Release to putt. Touch: pull back from the ball and let go.

| Hole | Name | Par | Length | What is in the way |
|---|---|---|---|---|
| 1 | Welcome Mat | 2 | 8 m | A straight with one 10 cm hump |
| 2 | Lazy River | 2 | 10 m | A water channel with a bridge 40 cm wide |
| 3 | Tail Whip | 3 | 12 m | A bend to the right and a tail that sweeps across every 4 s |
| 4 | Sprinkler Season | 2 | 9 m | Two sprinklers that push the ball sideways on a 3 s cycle |
| 5 | Snack Time | 3 | 11 m | A jaw that opens for 1.5 s in every 5 s. Through it is the short way. |
| 6 | The Sinkhole | 3 | 13 m | A funnel with two holes. One feeds the cup. One sends you back to the tee. |
| 7 | Loop the Gator | 3 | 12 m | A loop that needs more than 70% power |
| 8 | Hurricane Alley | 3 | 14 m | A fan across the lane. Its strength changes each stroke; a flag shows it. |
| 9 | On Break | 3 | 15 m | A ramp into the big alligator's mouth. In is a hole in one. A miss rolls down a chute to 1 m from the cup. |

**Opponent:** a card on the hut wall. "Course record: 17. G. Bellweather. Witnessed by G. Bellweather."

**Rewards:** under par: the next round is free. 19 or better: the Gator Putt visor. 16 or better: your name replaces his and 2,000 followers. Each hole in one: 200 followers.

## 03 · Pier fishing
`fishing` · tier B · the rail at the end of Gullwing Pier `(600, 425)` · any hour, not in a hurricane

Catch, weigh, photograph, release. The pier's tally board pays the value below for each catch. Lures are the five levels in `side-jobs.md`.

**Rules**
1. **Cast.** Hold Action to fill the bar, release. Under 33% is a near cast (8 m), over 66% is a far cast (24 m), between is mid (16 m).
2. **Wait** 2–9 s. The float dips halfway up to twice as a tease.
3. **Strike.** When the float goes under, press Action inside the window.
4. **Reel.** Holding Action pulls 2 m/s of line and raises tension 35 a second. Letting go gives the fish 1 m/s and drops tension 50 a second. Line only comes in while tension is inside the green band, which wanders with the fish. Aim towards the fish's run to widen the band by a fifth.
5. Tension over 100 for 0.8 s snaps the line. Under 10 for 2 s and the fish is gone. Line at 0 m lands it.

**Controls:** Action and Aim only. Touch: the large button and two arrows.

| Catch | Share | Pays | Needs | Window | Band |
|---|---|---|---|---|---|
| Boot | 8 | $5 | nothing | 0.6 s | 40 |
| Pigfish | 22 | $8 | nothing | 0.6 s | 40 |
| Grunt | 18 | $12 | nothing | 0.6 s | 40 |
| Croaker | 15 | $16 | 17:30 to 06:00 | 0.6 s | 40 |
| Ladyfish | 11 | $24 | 06:00 to 17:30 | 0.6 s | 40 |
| Sheepshead | 8 | $36 | a near cast | 0.45 s | 28 |
| Sea trout | 6 | $55 | 05:00 to 08:00 | 0.45 s | 28 |
| Mackerel | 4.5 | $80 | a far cast | 0.45 s | 28 |
| Redfish | 3.5 | $120 | rain | 0.45 s | 28 |
| Barracuda | 2 | $190 | a far cast by day | 0.35 s | 18 |
| Kingfish | 1.2 | $320 | a far cast, 05:00 to 08:00 or 17:30 to 20:00 | 0.35 s | 18 |
| Amberjack | 0.6 | $480 | a far cast in the 15:15 storm | 0.35 s | 18 |
| Marlin | 0.2 | $900 | a far cast, 17:30 to 20:00 | 0.3 s | 10 |

Shares add up to 100 with the bread ball. A catch whose need is not met gives its share to the pigfish. Lures multiply the share of every fish worth $80 or more: spoon 1.5, feather jig 2, glow lure 3 at night, lucky lure 4 with no boot. The extra comes off the pigfish, then the grunt, then the croaker.

**Opponent:** none. A board lists the day's biggest catch of each kind, in centimetres. Size is seeded per catch and is for the board only.

**Rewards:** all twelve fish: the lucky lure and the Pier Regular hat. The marlin: 5,000 followers and a headline on Bayhaven Public Radio.

## The cabinets in Coral Arcade

The hall is at `(585, 415)`. Until the pier is built, the three cabinets and the claw stand at a marker under the Coral Arcade sign on the day 1 block `(0, 0)`.

| Rule | Value |
|---|---|
| Credits | $1 each at the change counter. One credit a play. Free if you own the arcade. |
| Screen | A 256 × 224 canvas in a cabinet frame, drawn in chunky pixels |
| Scores | Five high scores per cabinet, saved in stats. The house scores below are there on a new save. |
| Prize points | 1 for each 1,000 points scored. Spent at the counter on plush toys and hats. Never cash. |
| Beat the top score | That cabinet's shirt and 1,000 followers |

### 04 · Heat Lap
`heat-lap` · tier B · a top-down drift game

- One screen, one car seen from above, a closed track of 8 to 12 corners. Three tracks: Sandbar, Car Park, Roundabout.
- 60 s on the clock. Each lap adds 8 s.
- Sliding at more than 20° builds points at `speed × angle`. Crossing the line banks them and adds 500. Touching a wall first loses them.
- **Controls:** Aim steers, Action is the throttle (always on with touch), Second is the handbrake.
- **House scores:** `GER` 12,000 · `MAG` 9,000 · `WEN` 7,500 · `JUN` 6,000 · `TEO` 212.

### 05 · Gull Patrol
`gull-patrol` · tier B

- You stand mid-screen with a tray of 12 chips. Gulls dive from eight directions.
- A shadow shows the direction 0.9 s ahead. By wave 10 it is 0.45 s.
- Aim the umbrella and press Action. It opens for 0.5 s and covers that direction and the two beside it, then needs 0.3 s. A blocked gull flies off: 100 points times your streak, which caps at 8.
- A gull that gets through takes one chip. No chips, game over.
- Every twentieth bird is a pelican. It cannot be blocked and takes three chips.
- **Controls:** Aim (eight ways) and Action. Touch: tap one of eight sectors.
- **House scores:** `GER` 30,000 · `NIL` 18,000 · `MAG` 14,000 · `RAF` 9,000 · `TEO` 212.

### 06 · Tide Pool Panic
`tide-pool-panic` · tier B

- A 16 × 12 grid of sand. You are a hermit crab. The sea is the bottom edge.
- The tide comes in and out on an 8 s cycle and covers up to 9 rows. Each wave is 6% faster.
- Shells appear on wet sand as the water leaves: small 100, large 300, and a pearl worth 1,000 on the lowest row for 2 s.
- If the water reaches you off a rock (there are four), you are washed to the top row and lose one of three lives.
- A gull's shadow marks a square. It lands there 1.2 s later. Being there costs a life.
- You move 4 squares a second, or 2 while carrying a large shell.
- **Controls:** Aim steps one square. Action picks up or puts down.
- **House scores:** `GER` 25,000 · `DES` 16,000 · `MAG` 11,000 · `JUN` 8,000 · `TEO` 212.

## 07 · The Grabby Crab
`claw` · tier B · the claw machine in Coral Arcade. From tier C there are two more: Galleria Flamingo's entrance `(-200, -1965)` and Ten Pin Tide's lobby.

**Rules:** one credit a try. You have 20 s to move the claw over a 60 × 60 cm bin, then it drops, closes, lifts and carries to the chute. A prize is held if the claw's centre is inside the prize's grab radius. It then survives one slip roll of `15% + 10% for each prize touching it`. The roll is seeded by the try number, so the machine is fair and the same for everyone. Twelve prizes sit at seeded spots and stay until won. The bin refills at 06:00.

**Controls:** Aim moves the claw. Action drops it early.

| Prize | Grab radius | What it does |
|---|---|---|
| Plush Gerald | 6 cm | Sits on the trailer shelf |
| Plush Big Earl | 5 cm | Shelf |
| Plush manatee | 6 cm | Shelf |
| Plush iguana | 4 cm | Shelf. Falls off when it is cold. |
| Flamingo key ring | 3 cm | Hangs from the mirror of Mags's Heron |
| Tiny lifeguard hut | 4 cm | Shelf |
| Storm in a jar | 3 cm | A globe that rains at 15:15 |
| SPF 1000 sample | 3 cm | Does nothing |

**Rewards:** all eight: the Claw Hand glove and 1,000 followers. The Galleria machine also holds one mixtape (`finds.md`).

## 08 · Shuffleboard
`shuffleboard` · tier C · the court at Pelican Rest `(-1262, -232)` · 08:00–20:00

**Rules:** the court is 12 × 1.8 m. Each player slides four discs in turn from the near end at the scoring triangle at the far end: 10 at the tip, two 8s, two 7s, and a strip at the back marked "10 off" that takes 10 away. A disc counts only if it touches no line. Discs may knock each other. Six frames. The higher total wins. A disc slows at 1.1 m/s².

**Controls:** Aim left and right slides your start spot and turns the cue. Hold Action for power (100% in 1 s, then it falls back). Touch: pull back from the disc and let go.

**Opponents:** three neighbours, from lots 4, 9 and 12. Each aims at the best free zone with an error of ±6° and ±12% power (lot 4), ±4° and ±8% (lot 9), ±2° and ±4% (lot 12). If you have a disc on the 10, they aim to push it into the "10 off" strip.

**Rewards:** a win is 50 followers. Lot 12 will play for $20 a frame. Beating all three gives a cue for the trailer wall and the Lot 12 visor.

## 09 · Pickleball
`pickleball` · tier C · the courts at Clubhouse Circle `(-1960, -2130)` · 07:00–19:00

**Rules:** singles on a 13.4 × 6.1 m court. A point is scored on every rally. First to 11, two clear. Serve underarm, past the far kitchen line. The ball must bounce once on each side before anyone volleys. No volley while standing in the kitchen, the 2.1 m strip each side of the net. The ball falls at 9.8 m/s² and keeps 65% of its height on a bounce.

**Controls:** Aim moves you. Action is a drive, Second is a soft dink into the kitchen, Third is a lob. Swing early to send it across the court, late to send it down the line.

**Opponents:** the club ladder, five rungs. Reaction time falls from 0.35 s to 0.15 s and aim error from 1.2 m to 0.3 m as you climb.

| Rung | Opponent | Habit |
|---|---|---|
| 1 | The Treasurer | Lobs everything |
| 2 | The Landscaping Committee | Two people on one side. They argue over every ball in the middle. |
| 3 | The Vice-Chair | Dinks until you come to the net, then lobs |
| 4 | The Parliamentarian | Calls a fault on your first serve of each game. Serve again. |
| 5 | The President's Proxy | Plays for Bellweather, who is listed as champion four times |

**Rewards:** each rung, the first time: 200 followers. The top rung: the Club Champion visor and your name on the clubhouse board.

## 10 · Bowling at Ten Pin Tide
`bowling` · tier C · Ten Pin Tide `(300, -1880)`, on Gateway Boulevard · $8 a game · 10:00–02:00

**Rules:** ten-pin, ten frames. A strike scores 10 plus your next two balls. A spare scores 10 plus your next ball. The most is 300. The lane is 18.3 × 1.05 m. The pins are ten circles that scatter on impact.

**Controls:** Aim left and right sets your spot on the approach (half a metre each way). Aim up and down turns the arrow up to 8°. Hold Action for power. While the ball rolls, Aim left and right adds hook, up to 0.6 m of curve. Touch: swipe up to bowl, then swipe sideways to hook.

**Opponent:** on Monday at 19:00 a league team, the Gutter Gulls, bowls the next lane. Three bowlers with a strike chance of 20%, 35% and 50% and a spare chance of 40%, 55% and 70%. Beat their middle score to win the night. They will put $100 a head on it.

**Thunder mode:** during the 15:15 storm and after 22:00 the house lights go out, the lanes glow, and every strike sets off a thunderclap and a flash. No flash under "reduce motion".

**Rewards:** 150 or more: the Ten Pin Tide shirt. 200 or more: a horn that sounds like a strike. Three strikes in a row: 500 followers. 300: a gold ball on the trailer shelf and a radio headline.

## 11 · Open mic at Wet Paint
`open-mic` · tier C · Wet Paint, in Wet Paint Alley `(1100, -600)` · Thursday, 20:00–23:00

**Rules:** a rhythm game in four lanes. Notes fall for 60–90 s in time with one of the radio's own songs: the kick drum feeds lane 1, the snare lane 2, every other hi-hat lane 3 and the lead line lane 4. Teo beatboxes. Mags reads the Route 9 timetable over the beat.

| Hit | Window | Points |
|---|---|---|
| Perfect | within 50 ms | 100 |
| Good | within 110 ms | 50 |
| Miss | later | 0, and the streak resets |

Every 10 hits in a row add 1 to the multiplier, up to 4. The crowd meter starts at 50, gains 1 for a Perfect and loses 4 for a miss. At 0 the host rings a bell and the set is over. At 100 the phones come out and `ped:filming` fires.

**Controls:** lanes are D F J K on a keyboard, d-pad left, d-pad up, X and B on a gamepad, and four pads on touch. A four-beat tap test in Settings stores a timing offset of up to 150 ms.

**Opponent:** five other acts post scores of 40,000, 55,000, 70,000, 85,000 and 100,000. Three songs set the pace: 2.0, 3.2 and 4.5 notes a second.

**Rewards:** followers equal to the score divided by 50, doubled during Go Live. Topping the board: $200 from the tip jar, the Wet Paint wristband, and your name on the chalkboard.

## 12 · The driving range
`driving-range` · tier C · the tee line beside the clubhouse `(-2080, -2180)`, facing west · $10 for 20 balls · 07:00–19:00

**Rules:** three presses make a swing. The first starts the bar. The second sets power, up to 110%; over 100% doubles any error. The third, as the bar comes back through the mark, sets accuracy: early hooks, late slices, up to 15° either way. Full power carries 90 m with the wedge, 140 m with the 7 iron and 210 m with the driver. A flag shows the wind, 0 to 8 m/s, set once for each bucket.

**Controls:** Action is all three presses. Second changes club. Aim left and right turns your stance.

| Target | Distance | Points |
|---|---|---|
| Nets | 50, 100, 150 and 200 m | 10, 25, 50, 100 |
| A cardboard Bellweather on a rail, holding a "Bayhaven Tomorrow" sign | 175 m, moving | 250, and it folds in half |
| Over the back fence | 250 m | 150, and a car alarm |

**Opponent:** the member of the day, a score to beat that is seeded by the date and runs from 600 to 1,400.

**Rewards:** 1,000 points from one bucket: the range shirt. Folding Bellweather five times in one bucket: 2,000 followers. Beating the member of the day: 300 followers. No cash.

## New names

| Name | What it is |
|---|---|
| Ten Pin Tide | The bowling alley on Gateway Boulevard, Northgate |
| The Gutter Gulls | Its Monday league team |
| Heat Lap, Gull Patrol, Tide Pool Panic | The three cabinets in Coral Arcade |
| The Grabby Crab | The claw machine |
| Welcome Mat, Lazy River, Tail Whip, Sprinkler Season, Snack Time, The Sinkhole, Loop the Gator, Hurricane Alley, On Break | Holes 1 to 9 at Gator Putt |
| The Treasurer, The Landscaping Committee, The Vice-Chair, The Parliamentarian, The President's Proxy | The pickleball ladder at Mallard Greens. Titles, not names. |
| Double Six shirt, Boneyard cap, Butcher's Apron, Pier Regular hat, Claw Hand glove, Lot 12 visor, Club Champion visor | Clothes won here |
| Sandbar, Car Park, Roundabout | The three tracks in Heat Lap |
