# Bible · radio · Low Tide Lounge

Low Tide Lounge is the quiet station: slow seventh chords on a soft piano, lazy drums, record crackle and waves. It has no host. A whisper says the station's name now and then, and that is all the talk there is. Below: identity, the whisper, sound recipe, six songs, twelve whispered idents, four timed whispers and three tide breaks.

Tier: A for the station, songs 1 to 3, idents 1 to 6 and the four timed whispers. B for songs 4 to 6, idents 7 to 12 and the tide breaks.

## Identity

| Field | Value |
|---|---|
| Id | `lowtide` |
| Frequency | 90.7 FM, dial position 3 of 12 |
| Slogan | "Nothing is happening." (whispered) |
| Who listens | Hotel lobbies, golfers, anyone stuck in traffic, anyone who has just lost the Sheriff and needs a minute |
| Starts in | Gallinule, Egret, Birdie, Plover, Swan, Pufferfish |
| Also starts in, until their own stations ship | Ibis, Coot, Sturgeon, Snowbird, Hermit, Minnow, Cormorant |
| Shops that play it | Mallard Greens (the clubhouse, the model home). Sandpiper Isle and every Maison Sable. The Hotel Alba lobby. Every Bean There. |
| Ships | Day 8 |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and garage vehicles open on that.

## The voice: nobody

There is no host and no name on the door. The whisper is the station talking to itself.

1. Seven words or fewer. Most whispers are three.
2. It never tells you to do anything louder than "stay".
3. It never mentions the news, the Sheriff's show by name, the gunfire, or anything else that is happening. Nothing happens here.

Whisper sound: no pitched blip. Each syllable is white noise through a 1.8 kHz band-pass (Q 2), 60 ms long, 5 syllables a second, at −14 dB. The music ducks 2 dB under a whisper, not the usual 6. The ticker shows whisper text at 70% opacity.

The roadmap's check asks every station for six host lines. Here the twelve idents and four timed whispers are the host lines.

## Sound recipe

| Part | Value |
|---|---|
| Tempo | 70 to 84 bpm |
| Scales | Major and Dorian. Every chord is a seventh, ninth or thirteenth. |
| From the `07` list | kick, snare, hats, 808 bass (short), bell, piano-like |
| Soft piano | The piano-like voice with its FM index at 1.2 falling to 0 in 300 ms, 8 ms attack, 900 ms decay, 1.6 kHz low-pass. Chords are rolled low to high over 60 ms. |
| New: tine piano | Sine with a modulator at 14 times its frequency, index 0.6 falling in 80 ms, 1.2 s decay, tremolo 4 Hz at 15% |
| New: muted horn | Saw through a 1.2 kHz band-pass (Q 4), 50 ms attack, with breath: noise at −30 dB through the same filter |
| New: rim | 1 kHz square click, 10 ms |
| Vinyl noise | Pink noise at −32 dB, 2 to 5 clicks a second (1 ms each, random level), and one soft 50 Hz thump every 1.8 seconds, the turn of a record |
| Waves | Brown noise through a low-pass that opens from 300 Hz to 1.2 kHz over 5 seconds and closes over 4, at −24 dB. One wave every 9 to 12 seconds. Always on, under songs and between them. |
| Tape wobble | Everything except drums drifts in pitch by 9 cents either way at 0.4 Hz |
| Drum feel | `swing 58%`. The snare lands 18 ms late. The kick is soft: −4 dB through a 120 Hz low-pass. Hat volume varies by 30% from a seeded random number. |

Mix notes: the music bus runs through a 5 kHz low-pass and a 60 Hz high-pass, so nothing is bright and nothing booms. The kick ducks the piano by 3 dB. Bass notes are 250 ms long. The station plays 4 dB quieter than the others; switching to it should feel like closing a door.

## Reading the songbook

Canon Song format. Drum lines are 16 steps, one bar of 16ths: `x` hit, `.` rest. `swing 58%` puts every second step 58% of the way through its pair. Bass is one entry per step, counted from the current chord's root: `1` root, `3` the chord's own third, `5` fifth, `8` octave; `-` holds a note. Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave, `7,` is an octave down. The form uses A and B for its two sections. Patterns loop under the whole chord loop.

## Songbook

```
"Room 12, Checkout Is Whenever" · Decaf Heron · 72 bpm · F major · chords Fmaj7 Dm9 Gm7 C9 · 2 bars each · swing 58% · tier A
kick   x......x..x.....        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1.....1...5.....
lead   5 . . 3 . . 2 . | 3 . . 1 . . . .      keys: soft piano, whole-bar chords; lead on the bell at −12 dB
form   intro 4 · A 8 · B 8 · A 8 · B 8 · out 4
```

```
"Sand in the Keys" · Slow Manatee · 78 bpm · Eb major · chords Ebmaj7 Cm7 Abmaj7 Bb9 · 2 bars each · swing 58% · tier A
kick   x.....x...x.....        snare  ....x.......x...        hat  x.xxx.x.x.xxx.x.
rim    .......x........
bass   1...1.....5...3.
lead   3 . 5 . . 8 . 7 | 5 . . 3 . . . .      keys: soft piano, half-bar chords; lead on the tine piano, an octave up
form   intro 4 · A 8 · B 8 · A 8 · out 8
```

```
"The Lifeguard Is Reading" · Half-Asleep Lifeguard · 70 bpm · A minor (Dorian) · chords Am9 D9 Gmaj7 Em7 · 4 bars each · swing 58% · tier A
kick   x.........x..x..        snare  ....x.......x...        hat  ..x...x...x...x.
bass   1.......5.....8.
lead   1 . . 3 . 4 5 . | . . 4 . 3 . 1 .      keys: tine piano, whole-bar chords; lead on the muted horn
form   intro 8 · A 8 · B 8 · A 8 · B 8 · out 8
```

```
"Ice Melting in a Paper Cup" · Tidepool Tapes · 84 bpm · D major · chords Dmaj9 Bm7 Gmaj7 A13 · 2 bars each · swing 58% · tier B
kick   x..x......x.....        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1..1......5..3..
lead   5 . 6 . 5 3 . . | 2 . 3 . 1 . . .      lead on the tine piano; fx: one ice clink (the bell at 3 kHz, 40 ms) every 8 to 14 seconds
form   intro 4 · A 8 · B 8 · A 8 · B 8 · out 4
```

```
"Ferry at Half Speed" · Decaf Heron · 76 bpm · G major · chords Gmaj7 Em9 Cmaj7 D9 · 4 bars each · swing 58% · tier B
kick   x.......x..x....        snare  ....x.......x...        hat  x.x.x.xxx.x.x.x.
bass   1-------5---1---
lead   3 . . 2 . . 1 . | 7, . . 1 . . 2 .     lead on the muted horn; fx: a far ferry horn (saw at 110 Hz, 400 Hz low-pass, 1.5 s, −20 dB) at the start of each A
form   intro 8 · A 16 · B 8 · A 16 · out 8
```

```
"Nobody on the Pier but Gerald" · Slow Manatee · 74 bpm · C major · chords Cmaj9 Am7 Fmaj7 G13 · 2 bars each · swing 58% · tier B
kick   x......x..x.....        snare  ....x.......x...        hat  ..x...x...x...xx
bass   1.....3...5.....
lead   8 . 7 . 5 . . 3 | 5 . 6 . 5 . . .      keys: soft piano, half-bar chords; fx: one gull (a sine falling from 2.2 to 1.6 kHz, 180 ms) every 20 to 30 seconds
form   intro 4 · A 8 · B 8 · A 8 · B 8 · out 8
```

## Whispered idents

Loop: song, song, song, tide break, ident. One ident per loop, picked at random without repeating until all have played.

1. Low Tide Lounge.
2. Shh. Low Tide Lounge.
3. Nothing is happening. Low Tide Lounge.
4. Low Tide. Stay.
5. The tide went out. So did everyone.
6. Low Tide Lounge. No news.
7. Whatever you did. Shh. Low Tide.
8. Low Tide Lounge. Still here.
9. Ninety point seven. Quietly.
10. No host. Just waves.
11. Low Tide Lounge. Park anywhere.
12. Breathe out. Low Tide Lounge.

## Timed whispers

These replace the next ident when their moment comes.

| When | Whisper |
|---|---|
| `cut`, just before the Sheriff's show takes the station at heat 4 | Somebody is borrowing the quiet. |
| `back`, the first whisper after heat clears | The quiet is back. |
| `storm`, the 15:15 rain | Three-fifteen. Listen. |
| `hurricane` | Louder than usual tonight. |

## Ads

The station runs ads from the shared pool, one every second loop, but only ads of 20 words or fewer. They are whispered like everything else. A whispered ad for a lawyer is the joke.

## Tide breaks (tier B)

Twenty to thirty seconds with no music, between the third song and the ident.

| Break | Recipe |
|---|---|
| Tide in | Waves rise by 8 dB and come every 5 seconds for 20 seconds, then settle |
| Tide out | Waves drop to −36 dB for 25 seconds. Vinyl noise and one gull only. |
| Ice in a glass | Six ice clinks at random over 20 seconds, a 30 Hz hum at −30 dB like a hotel fridge, waves as normal |

## New names

- Artists and their song titles, songbook only: Decaf Heron, Slow Manatee, Half-Asleep Lifeguard, Tidepool Tapes.
- Instruments and sounds: tine piano, muted horn, rim, tape wobble, tide breaks (Tide in, Tide out, Ice in a glass).
- Station id `lowtide` and frequency 90.7 FM.
