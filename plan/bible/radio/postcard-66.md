# Bible · radio · Postcard 66

Postcard 66 is the oldies station on the AM dial: surf instrumentals with a twang guitar, and slow harmony songs built on the I, vi, IV, V progression. Surfside Sid has hosted since the station opened and treats every link as a postcard. Below: identity, voice, sound recipe, six songs, 20 lines, six idents and two segments.

Tier: C for everything in this file.

## Identity

| Field | Value |
|---|---|
| Id | `postcard66` |
| Frequency | 660 AM, dial position 12 of 12 (the dial wraps round to it) |
| Slogan | "Wish you were here." |
| Who listens | Retirees, the Dawn Patrol, souvenir shops, Wendell Park, anyone in a car with fins |
| Starts in | Ibis, Spoonbill, Gar, Sandshark, Coot, Manatee S |
| Before it ships | Ibis and Coot use Low Tide Lounge, Gar uses Swamp Country 94, the other three use Tideline 98 |
| Shops that play it | Tideline's West End and Motel Row (souvenir shops, Gator Putt). The Starlite Drive-In. Surf & Vinyl. Park & Sons Auto. Every Second Wind Thrift. |
| AM fade | Under the Bayline Expressway and in the Mangrove Tunnel the station drops 12 dB and its static rises to 15%. It comes back over one second. |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station.

## The host: Surfside Sid

Sid played the first record the station ever aired and never went home.

1. Every link opens "Greetings from" somewhere and most end "wish you were here".
2. He never swears and never says an unkind word. When something is bad, a shooting included, he says "well, how about that".
3. His idea of the present is decades old. Prices are in cents. He never names a year.

Speech blip: triangle, 175 Hz, tremolo 5 Hz at 20%, 90 ms per syllable, 4.5 syllables a second, through the AM filter.

## Sound recipe

| Part | Value |
|---|---|
| Tempo | Surf 150 to 176 bpm. Harmony ballads 72 to 80. One stroll at 112. |
| Scales | Major for ballads and the stroll, minor for surf |
| From the `07` list | kick, snare, hats, guitar-like pluck, piano-like |
| New: twang guitar | The guitar-like pluck through a 250 Hz high-pass, tremolo 6 Hz at 40%, then a spring: three echoes at 37, 61 and 89 ms, each −9 dB, high-passed at 1 kHz |
| New: tremolo pick | In surf songs a held lead note is re-plucked on every 16th until the next entry |
| New: ooh choir | Three saws on the chord's root, third and fifth through an 800 Hz band-pass (Q 3), 120 ms attack, 5 Hz vibrato of 15 cents |
| New: bom bass | Sine at bass pitch that scoops up from 3 semitones below in 30 ms, 200 ms long. Used for ballads. Surf uses the saw bass. |
| New: tambourine | Noise above 6 kHz, 50 ms, three quick jingles |
| New: honk | Square plus saw through a 900 Hz band-pass, volume shaken at 30 Hz |
| Surf beat | Straight. Kick on beats 1 and 3. Snare on 2, the "and" of 2, and 4. Hats on 8ths. |
| Ballad feel | `step 8th`, `swing 67%`: 16 steps are two bars. Hats and a piano chord on every step, snare on beats 2 and 4, soft kick. |

Mix notes: the station is mono. Everything runs through the AM filter: a 200 Hz to 4.5 kHz band-pass, gentle saturation (tanh, drive 1.5) and static, which is white noise at 3%. In ballads the ooh choir holds whole-bar chords at −8 dB.

## Reading the songbook

Canon Song format. Drum lines are 16 steps: `x` hit, `.` rest. A step is a 16th note and 16 steps are one bar, unless the first line says `step 8th`; then 16 steps are two bars. `swing 67%` puts every second step two thirds of the way through its pair. Bass is one entry per step, counted from the current chord's root: `1` root, `3` the chord's own third, `5` fifth, `8` octave. Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave, `-` holds a note.

## Songbook

```
"Having a Lovely Time, Come and Get Me" · The Four Lifeguard Chairs · 76 bpm · C major · chords C Am F G · 1 bar each · step 8th · swing 67% · tier C
kick   x...x...x...x...        snare  ..x...x...x...x.        hat  xxxxxxxxxxxxxxxx
bass   1..15...1..15...
lead   3 - - 5 - 3 2 - | 1 - - 3 - 2 1 -      lead: twang guitar, no tremolo pick
form   intro 2 · verse 8 · verse 8 · bridge 8 · verse 8 · out 4
```

```
"Shark in the Kiddie Pool" · The Sunburnt Ankles · 168 bpm · E minor · chords Em D C B7 · 2 bars each · tier C
kick   x.......x.......        snare  ....x.x.....x...        hat  x.x.x.x.x.x.x.x.
tom    ........xxxxxxxx        (last bar before each B)
bass   1.1.1.1.1.1.1.1.
lead   1 - 2 1 3 - 2 1 | 5 - 4 3 2 - 1 -      lead: twang guitar with tremolo pick
form   intro 4 · A 8 · A 8 · B 8 · A 8 · drums 4 · A 8 · out 4
```

```
"Pier Wheel Sweetheart" · The Velvet Flip-Flops · 72 bpm · G major · chords G Em C D · 1 bar each · step 8th · swing 67% · tier C
kick   x.......x.......        snare  ..x...x...x...x.        hat  xxxxxxxxxxxxxxxx
tamb   ..x...x...x...x.
bass   1.....5.1.....5.
lead   5 - 6 5 3 - - . | 4 - 5 4 2 - - .      lead: twang guitar; ooh choir answers a third above
form   intro 2 · verse 8 · verse 8 · bridge 8 · verse 8 · out 4
```

```
"Gullwing Shimmy" · The Tide Charts · 160 bpm · A minor · chords Am G F E · 2 bars each · tier C
kick   x.....x.x.......        snare  ....x.x.....x...        hat  x.x.x.x.x.x.x.x.
bass   1.5.1.5.1.5.1.5.
lead   8 - 7 8 5 - 3 - | 4 - 3 4 1 - - .      lead: twang guitar, tremolo pick; 7 is a semitone higher over E
form   intro 4 · A 8 · A 8 · B 8 · A 8 · out 4
```

```
"Malt Shop on Motel Row" · The Saltwater Taffy Four · 112 bpm · F major · chords F Dm Bb C · 2 bars each · tier C
kick   x.......x.......        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
clap   ....x.......x...
bass   1...3...5...3...
lead   1 . 3 5 6 . 5 . | 3 . 5 3 1 . . .      lead: twang guitar; the honk takes the break
form   intro 4 · verse 8 · verse 8 · honk break 8 · verse 8 · out 4
```

```
"Last Car Out of the Starlite" · The Drive-In Speakers · 80 bpm · D major · chords D Bm G A · 1 bar each · step 8th · swing 67% · tier C
kick   x...x...x...x...        snare  ..x...x...x...x.        hat  xxxxxxxxxxxxxxxx
bass   1...5..11...5..1
lead   8 - 7 - 5 - 6 - | 5 - 3 - 2 - 1 -      lead: ooh choir, one voice, an octave up
form   intro 2 · verse 8 · verse 8 · bridge 8 · verse 8 · out 6
```

## Host lines

Loop: song, song, host line, ad, ident. Every fourth loop the host line is a segment script. A line is 180 characters or fewer. Each line starts with when it may play. `night` is 20:00 to 05:00, `dawn` 05:00 to 07:00, `hot` clear weather from 11:00 to 15:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears.

1. any · Greetings from Postcard 66. Surfside Sid at the microphone, same as ever. Weather's fine. Wish you were here.
2. after-song · Greetings from the end of that record. Wasn't that swell? They don't make them like that any more. I checked.
3. storm · Greetings from three-fifteen. Here's the rain, regular as the mail. Roll up the top. Wish you were here.
4. any · A soda at the pier is a nickel. I'm told it's gone up. Well, how about that.
5. cut · Greetings from an interruption. The Sheriff has a television show now. Well, how about that. Back soon.
6. back · Greetings from after the excitement. I'm told a few folks won't be going home. Well. How about that. Here's a slow one.
7. in Tideline · Greetings from Heron Walk Drive. If you're cruising it now, wave to a lifeguard. Any of them. They like it.
8. Tuesday · Greetings from Tuesday. Two for one at the Starlite at eight. Bring a blanket and somebody to share it.
9. Sunday · Greetings from Sunday. Boat parade off the beach at four. Every boat gets a wave. That's the rule.
10. night · Greetings from the late show. The neon's on along Motel Row. Vacancy, vacancy, no vacancy, vacancy.
11. any · A fellow wrote in to say this station is old-fashioned. Thank you, friend. We work at it.
12. any · They're putting up a glass tower by the beach. It's very tall. Well. How about that.
13. any · Greetings from Motel Row, where a car has been on fire since lunch. Folks are toasting marshmallows. Well, how about that.
14. any · This next one was number one the week this station opened. Feels like last week. I'm told it wasn't.
15. dawn · Greetings from sunup. The Dawn Patrol just went past the window. Morning, Brenda. She can't hear me. She's walking.
16. hurricane · Greetings from a hurricane. We've had them before. We put the records in the bathtub and carry on.
17. Wednesday · Greetings from Wednesday. The cruise ship is in. Welcome, visitors. The beach is the sandy part.
18. any · We're on the AM dial, friends. If the music goes fuzzy under a bridge, that's the bridge.
19. after-ad · That was a word from a sponsor. I don't know what a jet ski is, but cash for four of them sounds fair.
20. any · Somebody asked when I'm retiring. I said after this record. I've been saying it for a while.

## Idents

Spoken over one strum of the twang guitar.

1. Postcard 66. Wish you were here.
2. Six-sixty on your AM dial. Postcard 66. Greetings from Bayhaven.
3. Postcard 66. The hits of a summer that never quite ended.
4. This is Postcard 66. Twang, harmony and a little static.
5. Postcard 66. Surfside Sid, same as ever.
6. Greetings from Postcard 66. Weather's fine.

## Segments

### The Mailbag
Sid reads a listener's postcard. After `photo:taken` at a Postcard spot, the next Mailbag opens "A new card just in" and uses the script for that place if there is one.

1. "The Mailbag. A card from the end of Gullwing Pier. 'Dear Sid, the wheel is stuck again and I'm at the top. The view is lovely. Send lunch.' Lunch is on its way, friend. Wish you were here."
2. "The Mailbag. A card from Rental Row. 'Dear Sid, our hire car came with a gentleman tied up in the boot. He was very polite about it. Do we tip?' You do, friend. Wish you were here."
3. "The Mailbag. A card from Mallard Greens. It says 'Help, they have measured my lawn', and there's a ruler drawn on it. Well. How about that. Wish you were here."

### Sid's Price Check
Sid gives a price as he remembers it. A note from the office corrects him.

1. "Sid's Price Check. A gallon at Pelican Fuel: twenty-nine cents. I have a note here. It says 'no'. It doesn't say what. It just says 'no'."
2. "Sid's Price Check. A room at the Tideline Motel, with pool: six dollars a night. The note says room 12 is eight thousand now. That must be for the whole motel."
3. "Sid's Price Check. A ticket to the Starlite Drive-In: fifty cents a car, however many are in it. The note says that one's still about right. Well, how about that."

## New names

- Artists and their song titles, songbook only: The Four Lifeguard Chairs, The Sunburnt Ankles, The Velvet Flip-Flops, The Tide Charts, The Saltwater Taffy Four, The Drive-In Speakers.
- Segments: The Mailbag, Sid's Price Check.
- Instruments and effects: the six in the recipe, the AM filter and AM fade.
- Station id `postcard66` and frequency 660 AM.
