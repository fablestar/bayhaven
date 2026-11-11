# Bible · radio · The Crash

The Crash plays fast, loud songs with three chords that are over in about ninety seconds. Lil Nuisance, nineteen, shouts and swears between them about mailbox rules, lawn rulers and tow trucks, then says sorry to his mum. Below: identity, voice, sound recipe, six songs, 20 lines, six idents and two segments.

Tier: C for everything in this file.

## Identity

| Field | Value |
|---|---|
| Id | `crash` |
| Frequency | 103.3 FM, dial position 9 of 12 |
| Slogan | "Three chords and a complaint." |
| Who listens | Skaters, scrapyard crews, anyone who has had a letter from the association |
| Starts in | Wahoo, Needlefish, Cicada, Sandflea, Skink, Sawfish, Whelk |
| Before it ships | Wahoo, Needlefish and Sandflea use Bassline FM. The other four use Swamp Country 94. |
| Shops that play it | Rustwater's Scrap Mile and Drydock. Wet Paint on Thursdays, open-mic night. |
| Studio | A shipping container behind the scrapyard. His mum drops him off and collects him at nine. |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and garage vehicles open on that.

## The host: Lil Nuisance

He started the station with a borrowed transmitter and one guitar lead. He is angry all the time, about very small things, and he is right about most of them.

1. He shouts, and he swears. A sentence is six words or fewer, so it fits in one breath, and ends with an exclamation mark.
2. He is furious at exact, petty injustices done by people with power: mailbox colours, lawn rulers, towing, condo billboards. Never at ordinary people.
3. When his mum speaks, or he has just sworn, he is polite at once, in a full stop. "Sorry, Mum." follows the worst of it.

Speech blip: square wave, 420 Hz, 40 ms per syllable, 10 syllables a second, hard-clipped, 3 dB louder than other hosts. For any sentence that ends in a full stop it becomes a 300 Hz sine at −6 dB. His mum's blip is a 230 Hz sine, 80 ms per syllable.

## Sound recipe

| Part | Value |
|---|---|
| Tempo | 172 to 200 bpm |
| Scales | Major. Three chords only: I, IV and V. |
| From the `07` list | kick, snare, hats, saw bass |
| New: buzz guitar | Two saws 12 cents apart plus a square an octave down, through hard drive (tanh, drive 8) and a 3.2 kHz low-pass. Plays root, fifth and octave of each chord on every 8th. Two copies, hard left and hard right, the right one 11 ms late. |
| New: palm mute | The buzz guitar with 60 ms notes through a 900 Hz low-pass. Used in verses. |
| New: crash cymbal | Noise above 5 kHz, 1.2 s decay, on the first beat of every section |
| New: gang shout | Squares at 300, 330 and 360 Hz through a 1.5 kHz band-pass, 120 ms |
| New: squeal | Sine sliding from 1.8 to 2.4 kHz over 1.5 s at −10 dB, after the last chord of a song |
| Count-in | Four stick clicks (2 kHz, 10 ms) on the beat before every song. It is the `count 1` bar in each form. |
| Two-step beat | Kick on every beat, snare on every offbeat 8th |
| Stomp beat | Kick on 1 and 3 with pushes, snare on 2 and 4 |

Mix notes: everything is loud and nothing has reverb. Guitars 0 dB, drums −2, bass −3, lead −4. The bass doubles the guitar's root. The master runs into a soft clipper (tanh, drive 1.8). There are no fade-outs: a song stops on its last chord and squeals.

## Reading the songbook

Canon Song format. Drum lines are 16 steps, one bar of 16ths: `x` hit, `.` rest. Bass is one entry per step, counted from the current chord's root: `1` root, `3` the chord's own third, `5` fifth. Lead is one entry per 8th note, two bars, in steps of the song's scale from its key note; `8` is the octave. The lead is the buzz guitar in octaves unless a line says otherwise. Patterns loop under the whole chord loop.

## Songbook

```
"Mailbox Must Be Beige" · Violation Notice · 184 bpm · E major · chords E A B A · 1 bar each · tier C
kick   x...x...x...x...        snare  ..x...x...x...x.        hat  x.x.x.x.x.x.x.x.
shout  ............x.x.        (chorus only: "Beige! Beige!")
bass   1.1.1.1.1.1.1.1.
lead   5 . 5 5 6 . 5 . | 3 . 3 3 2 . 1 .      guitar: palm mute in verses, open in choruses
form   count 1 · intro 4 · verse 16 · chorus 8 · verse 16 · chorus 8 · break 4 · chorus 8 · out 2
```

```
"Four Millimetres Too Tall" · Leaf Blower at Dawn · 196 bpm · A major · chords A D A E · 1 bar each · tier C
kick   x.....x.x.....x.        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1.1.1.1.1.1.1.1.
lead   1 . 1 . 3 . 1 . | 5 . 4 . 3 . 1 .      fx: a leaf blower under the intro (saw at 95 Hz plus noise through a 600 Hz band-pass)
form   count 1 · intro 4 · verse 16 · chorus 8 · verse 16 · chorus 16 · out 2
```

```
"Condo Where the Skate Spot Was" · Wet Socks · 176 bpm · D major · chords D G A G · 1 bar each · tier C
kick   x.x...x.x.x...x.        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1.1.1.1.1.1.5.5.
lead   3 . 3 2 1 . . . | 3 . 3 2 5 . . .      guitar: palm mute in verses; the break is bass and drums only
form   count 1 · intro 4 · verse 16 · chorus 8 · verse 16 · chorus 8 · break 8 · chorus 8 · out 2
```

```
"Tow Zone (I Was Gone One Minute)" · Free Parking Lie · 200 bpm · G major · chords G C D C · 1 bar each · tier C
kick   x...x...x...x...        snare  ..x...x...x...x.        hat  x.x.x.x.x.x.x.x.
shout  x...............        (first bar of each chorus: "Tow!")
bass   1.1.1.1.1.1.3.5.
lead   8 . 8 . 7 . 5 . | 6 . 6 . 5 . 3 .      guitar: open all the way through
form   count 1 · intro 2 · verse 16 · chorus 8 · verse 16 · chorus 8 · chorus 8 · out 1
```

```
"Sunscreen in My Eyes" · The Beige Mailboxes · 172 bpm · C major · chords C F G F · 1 bar each · tier C
kick   x...x...x...x...        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
tom    x.xxx.xxx.xxx.xx        (verses only, in place of the hats)
bass   1.111.111.111.11
lead   5 . . 5 6 . 5 . | 3 . . 3 4 . 3 .      guitar: palm mute follows the tom rhythm in verses
form   count 1 · intro 4 · verse 16 · chorus 8 · verse 16 · chorus 8 · chorus 8 · out 2
```

```
"Mum's Picking Me Up at Nine" · Violation Notice · 188 bpm · A major · chords A E D E · 1 bar each · tier C
kick   x.....x.x.....x.        snare  ....x.......x...        hat  x.x.x.x.x.x.x.x.
bass   1.1.5.5.1.1.5.5.
lead   1 . 2 3 . 3 2 1 | 5 . 5 . 3 . 2 .      fx: a car horn (two squares, 400 and 500 Hz, 300 ms) ends the song; no squeal
form   count 1 · intro 4 · verse 16 · chorus 8 · verse 16 · chorus 7, then the horn and silence
```

## Host lines

Loop: song, song, host line, ad, ident. Every fourth loop the host line is a segment script. A line is 180 characters or fewer. Each line starts with when it may play. `night` is 20:00 to 05:00, `dawn` 05:00 to 07:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears.

1. any · This is The Crash! I'm Lil Nuisance! It's loud as shit! Sorry, Mum.
2. after-song · That song was ninety seconds! That's long for us! Next one's shorter!
3. storm · Three-fifteen! It's pissing down! Nobody asked me! Nobody ever asks me!
4. any · My mailbox is orange! Come and get me, you beige bastards! Sorry, Mum.
5. cut · The Sheriff's taking the station! He didn't ask! Rude! Back soon!
6. back · We're back! Somebody outran a helicopter! And the bullets! Respect! Wear a seatbelt, though.
7. any · They measure the grass! With a ruler! A grown man! Get a fucking hobby! Sorry, Mum.
8. any · Sorry, Mum. Yes, Mum. I'll turn it down. I won't! I will. Sorry, Mum.
9. any · Three chords! That's all you need! A fourth is showing off!
10. in Mallard Greens · You're in Mallard Greens! Four approved colours! Count them! It's sad!
11. Monday · Lawn inspection day! Grow it long! Four millimetres of freedom!
12. any · A billboard says "luxury living"! It's on my skate spot! Fuck that billboard! Sorry, Mum.
13. Thursday · Open mic at Wet Paint tonight! I'm on at eight! Mum's driving! Thanks, Mum.
14. night · It's late! I should be home! Mum knows where I am! She's outside.
15. rain · It's raining! My amp's getting wet! This is how legends end! Kidding, Mum.
16. hurricane · Hurricane! Finally, weather that gets it! Stay indoors, though. Seriously.
17. any · They towed my bike! It was a bicycle! It was chained to a tree! Bastards!
18. after-ad · That was an ad! I didn't want it either! It pays for the electricity.
19. any · The Sheriff shoots people on telly! For ratings! And I'm the nuisance! Me!
20. dawn · It's morning! The leaf blower started! It never stopped, actually! It's been years!

## Idents

Shouted over the count-in of the next song.

1. The Crash! One-oh-three point three! Loud!
2. The Crash! Three chords and a complaint!
3. This is The Crash! Sorry, Mum.
4. The Crash! Ninety seconds or less!
5. You're on The Crash! Turn it up! Not you, Mum.
6. The Crash! Still angry! Home by nine.

## Segments

### The Violation Box
He reads out one real notice from the Mallard Greens association at full volume, then answers it.

1. "The Violation Box! 'Notice to nine, Grackle Lane. Your garden hose is visible from the street.' Visible! It's a hose! It lives outside! Where should it go! Up your arse! Sorry, Mum."
2. "The Violation Box! 'Your welcome mat says Welcome in an unapproved font.' There's an approved font! For welcoming! I bet it's called Compliance! I made that up! It still feels true!"
3. "The Violation Box! 'Wind chimes may chime between ten and four only.' Tell the wind! Go on! Send the wind a letter! It will be here at three-fifteen!"

### Mum's Corner
His mum gives one calm, sensible tip. He shouts that she is right. Script 3 teaches how heat is lost.

1. "Mum: Hello, everyone. Check your tyres before a long drive. Nuisance: You heard her! Check your bloody tyres! Mum: Language, sweetheart. Nuisance: Don't call me sweetheart on air! Mum: Then don't swear on it."
2. "Mum: It's very hot today, so drink water and wear a hat. Nuisance: Hats! Water! Do it! Mum: And call your mother. Nuisance: I'm standing right here! Mum: I meant them."
3. "Mum: If the Sheriff is behind you, park somewhere quiet until his viewers get bored. Nuisance: That's not very punk! Mum: It works, though. Nuisance: It does work! Do what Mum says!"

## New names

- Artists and their song titles, songbook only: Violation Notice, Leaf Blower at Dawn, Wet Socks, Free Parking Lie, The Beige Mailboxes.
- Mum: Lil Nuisance's mother. Never named, never seen.
- Segments: The Violation Box, Mum's Corner.
- Instruments and effects: buzz guitar, palm mute, crash cymbal, gang shout, squeal, count-in.
- Station id `crash` and frequency 103.3 FM.
