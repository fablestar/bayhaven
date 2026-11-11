# Bible · radio · Tideline 98

Tideline 98 is the night-drive station: synth-pop with gated pads, arpeggios and a snare that rings out. Nightshift Nina has been on air for eleven years because the day host never turned up. Below: identity, voice, sound recipe, six songs, 20 lines, six idents and two segments.

Tier: A for the station, songs 1 to 3, host lines 1 to 6 and idents 1 and 2. B for songs 4 to 6, host lines 7 to 20, idents 3 to 6 and both segments.

## Identity

| Field | Value |
|---|---|
| Id | `tideline98` (the id in the save example) |
| Frequency | 98.3 FM, dial position 7 of 12 |
| Slogan | "Driving nowhere on purpose." |
| Who listens | Night-shift workers, valets, Bay Cab drivers, couples parked on Heron Walk Drive, anyone who can't sleep |
| Starts in | Heron, Tarpon, Bay Cab taxis, Tern, Skipjack. Mags's first station in a new game. |
| Also starts in, until their own stations ship | Coquina, Spoonbill, Sandshark, Manatee S |
| Shops that play it | Tideline: The Strand and Motel Row (hotel bars, the Tideline Motel lobby, Shell Yeah stands). Meridian: Bayfront hotels. |
| Ships | Day 4. The day 4 drop's stage lights pulse to this station's kick. |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and vehicles from the garage open on that.

## The host: Nightshift Nina

Nina took the overnight slot eleven years ago. Nobody came to relieve her, so she kept going. Her booth has one window, and the pier wheel is in it.

1. Low and unhurried. She never raises her voice and never uses an exclamation mark. She swears rarely and quietly.
2. It is always night for her. By day she says "somewhere it's 2 a.m." She gives the time often.
3. Every song goes out to someone unnamed and oddly specific: a valet, a cab driver, a couple in a parked car.

Speech blip: sine, 205 Hz, 70 ms per syllable, 6 syllables a second, the last syllable falls 8%.

## Sound recipe

| Part | Value |
|---|---|
| Tempo | 96 to 118 bpm |
| Scales | Major and Dorian |
| From the `07` list | kick, snare, hats, saw bass, lead, pad, pluck, bell |
| New: long-tail snare | The snare's noise through a 1.8 kHz band-pass, 40 ms body, then a 280 ms tail at −12 dB that stops at once (a gate, not a fade) |
| New: gated pad | The pad's volume switched by a 16-step gate pattern, 5 ms attack and release so it clicks softly |
| New: glass arp | The pluck with a 2.5 kHz resonant low-pass (Q 6) and a quiet copy one octave up, delayed by a dotted 8th at 30% |
| New: tom | Sine falling from 180 to 90 Hz in 160 ms, three pitches (180, 150, 120 Hz start) |
| Drum feel | Machine-straight, no swing. Kick on every beat or on 1 and the "and" of 2. Snare on 2 and 4, always with the long tail. |

Mix notes: kick is the reference at 0 dB, snare −2, bass −4, lead −6, arp −10, pad −9. The pad ducks 4 dB on every kick and recovers in 120 ms. Arp notes alternate left and right at 30%. A high shelf of −2 dB above 9 kHz keeps the station warm. Leads use a 6 Hz vibrato of 12 cents after 200 ms.

## Reading the songbook

Canon Song format. Drum lines are 16 steps, one bar of 16ths: `x` hit, `X` accent (+3 dB), `o` open hat, `.` rest. Bass is one entry per step, counted from the current chord's root: `1` root, `3` the chord's own third, `5` fifth, `8` octave, other numbers on the major scale, `b` lowers a semitone; `-` holds a note. Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave, `7,` is an octave down. Patterns loop under the whole chord loop.

## Songbook

```
"Low Sun, High Tide" · Motel Ice Machine · 104 bpm · A minor (Dorian) · chords Am7 D9 Fmaj7 E7 · 4 bars each · tier A
kick   x...x...x...x...        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1..1..5..1..b7..5
lead   5 . 6 5 3 . 1 . | 3 . 5 . 6 . . .      pad: whole-bar chords, gated on 8ths
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · break 4 · chorus 8 · out 4
```

```
"Valet Parking for Ghosts" · Sodium Sweetheart · 112 bpm · C major · chords Fmaj7 G6 Em7 Am7 · 2 bars each · tier A
kick   x...x...x...x...        snare  ....x.......x...        hat  ..o...o...o...o.
bass   1.1.1.1.1.1.1.8.
lead   3 . 5 . 8 . 7 5 | 6 . 5 . 3 2 3 .      arp: glass arp on 16ths, chord tones 1 5 8 5
form   intro 8 · verse 8 · chorus 8 · verse 8 · chorus 16 · out 4
```

```
"Second Shift at the Car Wash" · Pastel Alibi · 98 bpm · D minor (Dorian) · chords Dm9 G13 Cmaj7 Am7 · 2 bars each · tier A
kick   x.....x.x.......        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
tom    ............x.xx        (last bar of every 8 only)
bass   1.....1.5.....8.
lead   5 - - 4 3 . 1 . | 2 - - 3 5 . . .      pad: half-bar chords, gate x.xxx.xxx.xxx.xx
form   intro 4 · verse 8 · chorus 8 · break 4 · verse 8 · chorus 8 · out 8
```

```
"Ceiling Fan Slow Dance" · Glovebox Flamingo · 96 bpm · E major · chords Emaj7 C#m7 Amaj7 B · 4 bars each · tier B
kick   x.........x.....        snare  ....x.......x...        hat  x.x.x.x.x.x.x.xx
bass   1...1...5...3...
lead   3 - . 5 - . 8 . | 7 - . 5 - . 3 .      pad: whole-bar chords, low-pass sweeps 600 Hz to 3 kHz over 8 bars; bell doubles the lead in the chorus
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · out 8
```

```
"Turn Signal On Since Flamingo Avenue" · Dehumidifier Romance · 118 bpm · G major · chords Em7 Cmaj7 G D · 2 bars each · tier B
kick   x...x...x...x...        snare  ....x.......x...        hat  x.xxx.xxx.xxx.xx
bass   1.11.11.1.11.11.
lead   8 . 7 . 5 . 3 5 | 6 . 5 . 3 . 2 .      arp: glass arp on 16ths, chord tones 1 3 5 8; pad gated on 16ths in the chorus only
form   intro 4 · verse 8 · chorus 8 · verse 8 · chorus 8 · break 8 · chorus 16 · out 4
```

```
"Your Pool Light Is Still On" · Vacancy Sign Choir · 108 bpm · B minor (Dorian) · chords Bm7 E9 Gmaj7 F#m7 · 4 bars each · tier B
kick   x..x......x.....        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
clap   ....x.......x...        (chorus only, on top of the snare)
bass   1..1..5...5.1...
lead   5 . . 6 5 . 3 . | 4 . . 3 1 . 7, .     pad: whole-bar chords, gated on 8ths
form   intro 8 · verse 8 · chorus 8 · verse 8 · chorus 8 · out 8
```

## Host lines

Loop: song, song, host line, ad, ident. Every fourth loop the host line is a segment script. A line is 180 characters or fewer. Each line starts with when it may play: `any`, `night` (20:00 to 05:00), `day` (06:00 to 18:00), `dawn` (05:00 to 07:00), `storm` (the 15:15 rain), `rain`, `hurricane`, a weekday, `in` a district, `after-song`, `after-ad`, `cut` (just before the Sheriff's show takes the station at heat 4) and `back` (first line after heat clears). Lines 1 to 6 are tier A, the rest B.

1. night · It's 2 a.m., the roads are empty, and so is my fridge. This one's for everybody driving nowhere on purpose.
2. any · You're on Tideline 98. I'm Nina. The day host is running late. It has been eleven years.
3. day · It's {hour} in Bayhaven, which means somewhere it's 2 a.m. Keep the windows down for them.
4. storm · Three-fifteen. There's the rain. If you parked under a palm, that was a choice, and I respect it.
5. after-song · That one goes out to the valet asleep in a Sailfin outside Hotel Alba. Sleep well. Check the handbrake.
6. cut · The Sheriff wants my frequency again. He never asks. Somebody's about to get shot on television. Back after.
7. back · And we're back. I counted the sirens going out and the ambulances coming home. Here's something slow.
8. night · Three shots east of the pier just now. Then nothing. That's either very good news or very bad. Here's a slow one.
9. any · This one's for whoever left a getaway car running on Urchin Street. It's been an hour. I don't think they're coming.
10. rain · Wipers on. Volume up. The road is all reflections now, and every one is prettier than the real thing.
11. any · No traffic report tonight. If you're listening to me, you are the traffic.
12. Friday · Friday. Humidity is full, the Speedbowl is loud, and I'm up here with a fan that only turns left.
13. in Tideline · If you're on Heron Walk Drive right now, slow down. Not for safety. It just looks better slow.
14. dawn · The sky's going pink. That's my cue to pretend it isn't.
15. any · Somebody called to ask for something upbeat. I said hell no and played it at half speed. You're welcome.
16. hurricane · They've told everyone to leave. I asked who would play the songs. Nobody had an answer. So. A song.
17. Sunday · Sunday. Everything shuts early except me.
18. night · To the couple at the end of Pier Road with the engine off: the radio will flatten your battery. Worth it.
19. any · The station fridge has one lime in it. I've named it. I'm not saying what.
20. after-ad · That was an ad. I don't write that shit. I only have to share a building with it.

## Idents

Spoken over two bars of the next song's pad. Idents 1 and 2 are tier A, the rest B.

1. Tideline 98. Driving nowhere on purpose.
2. Ninety-eight point three. It's later than you think.
3. Tideline 98. The night shift never ended.
4. You found us. Don't tell the day people. Tideline 98.
5. Tideline 98. Synths, headlights, no destination.
6. This is Tideline 98. Somewhere, it's 2 a.m.

## Segments

### Left in the Back Seat (tier B)
Nina reads out what Bay Cab drivers handed in tonight. Three items, the last one odd. Plays at night only.

1. "Left in the Back Seat. Cab forty-one hands in one flip-flop, a bowling trophy and a wedding cake, uneaten. If two of those are yours, call the depot. If all three are, call somebody who loves you."
2. "Left in the Back Seat. Cab nine found a pistol, still warm, a wedding ring and half a key lime pie. The driver is keeping the pie. The rest is with the Sheriff, who will put it on television."
3. "Left in the Back Seat. Cab seventeen reports a pool noodle, a golf shoe and a parrot that says 'turn left'. The driver says the parrot was right every time. He'd like to keep it."

### The Scenic Route (tier B)
A route nobody needs, along real roads, with the next song as its soundtrack. If the player sets a waypoint to the place named within 60 seconds, the next ident says "Good choice."

1. "The Scenic Route. Tonight: Heron Walk Drive east to Pier Road, out to the end of the pier, and back. It goes nowhere. That's the point. Windows down."
2. "The Scenic Route. Coral Boulevard north until the Spire fills the windscreen, once round Spire Circle, twice if nobody's behind you, then home, slower."
3. "The Scenic Route. Marsh Road to the Longspan, all five keys, out to the lighthouse on Last Key. Then you have to turn round. Everybody does. Take your time about it."

## New names

- Artists and their song titles, songbook only ("Low Sun, High Tide" is the canon's example): Motel Ice Machine, Sodium Sweetheart, Pastel Alibi, Glovebox Flamingo, Dehumidifier Romance, Vacancy Sign Choir.
- Segments: Left in the Back Seat, The Scenic Route.
- Instruments: long-tail snare, gated pad, glass arp, tom.
- Station id `tideline98`, frequency 98.3 FM and the dial order are set here and in the other station files.
