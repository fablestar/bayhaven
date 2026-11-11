# Bible · radio · The Grind 24/7

The Grind 24/7 is Kiki Halcyon talking over hard drums at 140 bpm. There are no songs: one drum bed in four parts, 40 lines of motivation that would hurt anyone who followed it, and six sponsored segments. The station is an advert for Kiki, and Kiki is an advert for the Bellweather Group.

Tier: A for the station, the drum bed, lines 1 to 6 and idents 1 and 2. B for lines 7 to 40, idents 3 to 6 and the sponsored segments.

## Identity

| Field | Value |
|---|---|
| Id | `grind` |
| Frequency | 105.5 FM, dial position 10 of 12 |
| Slogan | "No days off. No hours off." |
| Who listens | Gym car parks, Glow Camp, people who bought the course, and Teo, until he meets her |
| Starts in | Grouper, Snook, Sanderling, Tropicbird |
| Shops that play it | Northgate's Strip (the gyms, Galleria Flamingo). Glow Camp on Sandpiper Isle. Office lobbies in Meridian's Exchange. |
| Ships | Day 8 |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station, and garage vehicles open on that.

## The host: Kiki Halcyon

Wellness and "abundance" influencer, nine million followers, seller of SPF 1000 and Glow Camp, public face of Bayhaven Tomorrow. She records the show from a treadmill she is not on.

1. Every line is advice that would harm you if you took it, handed over like a gift.
2. Her numbers never add up: day forty of a nine-day cleanse, up at five since four.
3. One line in three sells something. "Abundance" is her word for money. She swears about once an hour, serenely, and treats other people's deaths as content.

Speech blip: canon, 340 Hz with vibrato (7 Hz, 25 cents either way), 50 ms per syllable, 9 syllables a second. The last syllable of every line rises 20%, so everything sounds like a question she already knows the answer to.

## The drum bed

Drums only, 140 bpm, no bass and no notes. Drum lines are 16 steps, one bar of 16ths: `x` hit, `o` open hat, `.` rest.

```
The Grind bed · 140 bpm · drums only · tier A
main     kick x..x..x.x..x..x.     snare ....x.......x...     hat x.x.x.x.x.x.x.x.     clap ....x.......x...
push     kick x.x.x.x.x.x.x.x.     snare ....x..x....x.xx     hat xxxxxxxxxxxxxxxx
drop     kick x...x...x...x...     snare ....x.......x...     hat ..o...o...o...o.     tom  ............x.xx
breath   kick x...............     snare ................     hat x...x...x...x...
form     main 8 · breath 2 · push 4 · breath 2 · drop 8 · breath 2, then again
```

| Part | Recipe |
|---|---|
| Kick | The `07` kick with a 55 Hz body, a 3 kHz click at the front and soft clipping (tanh, drive 3) |
| Snare | Noise through a 2 kHz band-pass plus a 200 Hz sine, 90 ms, no tail |
| Clap | Three 8 ms noise bursts 10 ms apart, then a 60 ms tail |
| Hats | Noise above 8 kHz, 25 ms closed, 180 ms open |
| Tom | Sine falling from 160 to 80 Hz in 140 ms |
| New: whoosh | Noise through a band-pass sweeping from 500 Hz to 6 kHz over the 2 bars of a breath, at −14 dB. Plays before a sponsored segment only. |
| New: till bell | The bell voice at 2.6 kHz, 300 ms. Rings once whenever a line or segment says a price. |

Kiki speaks only in a `breath`. One line fits its 3.4 seconds. The loop is: main, line, push, line, drop, then an ad from the pool or a sponsored segment, then an ident. Mix notes: her voice is the loudest thing on the station; the drums duck 9 dB under her blips, not the usual 6. Kick at 0 dB, snare −1, clap −4, hats −8. A hard limiter is allowed to flatten the drop by 3 dB.

## Lines

A line is 180 characters or fewer. Each line starts with when it may play. `dawn` is 05:00 to 07:00, `hot` clear weather from 11:00 to 15:00, `night` 20:00 to 05:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears. Lines 1 to 6 are tier A, the rest B.

1. any · Sleep is a subscription you can cancel. Day forty of my nine-day cleanse.
2. any · You're listening to The Grind, twenty-four seven. That's twenty-four hours, seven of them before breakfast.
3. dawn · It's 5 a.m. Winners have been up since 4. I've been up since 5 a.m. yesterday. Do the maths. Don't. Maths is doubt.
4. storm · It's raining. The sky is doing its cardio. What's your excuse?
5. cut · The Sheriff is going live on my frequency. I love that for him. Cross-promotion is self-care.
6. back · And we're back. Somebody out there just lost their audience. Let that be a lesson. Never be boring.
7. any · Rest is just quitting with a pillow.
8. any · I don't have a morning routine. I have a morning empire.
9. any · Hydrate. Not with water. With intention. Water is available at Glow Camp for eleven dollars.
10. any · Your comfort zone is a trailer park. Mine is a tower. Come up. From the low nine hundreds.
11. any · People ask, Kiki, how do you do it all? I don't. I post it all. Different skill.
12. any · Breathe in abundance. Breathe out refunds. We don't fucking do refunds. Blessings.
13. hot · The sun is your enemy and also my business partner. SPF 1000. The sun can't see you.
14. any · If you're tired, you're not tired. You're under-branded.
15. any · I woke at four, journaled at three and manifested at two. Time is a mindset.
16. Monday · Monday is a gift. Unwrap it at speed. Regift it to someone slower.
17. any · Grief is just engagement you haven't monetised yet. Post through it.
18. any · I don't see obstacles. My assistant sees them and moves them before I arrive.
19. any · Gratitude list. One: me. Two: my following. Three: see one.
20. night · It's late. Losers are asleep. Winners are also asleep, but on purpose. It's called recovery and it's sponsored.
21. any · You have the same twenty-four hours as me. I also have staff.
22. any · Stop saying "I can't afford it". Say "I haven't met my lender yet".
23. any · Community is everything. That's why mine has a gate.
24. any · Someone said my cleanse isn't science. Correct. It's above science. It's content.
25. Sunday · Sunday is for reflection. Find a mirror. Stay there.
26. any · Listening in traffic? You're not in traffic. You're in a moving seminar.
27. any · Nine million people follow me. Not one has asked where we're going. That's trust.
28. any · Don't chase your dreams. Have them chased for you, live, by a helicopter. Ratings are a love language.
29. any · I gave up negativity, gluten and reading the comments. Two of those stuck.
30. hurricane · A hurricane is just the sky being ambitious. Lean in. Not literally. Legal made me say that.
31. any · My skincare has eleven steps. Step one is being me. The other ten are available at Glow Camp.
32. Saturday · No days off. Today I'm relaxing on a yacht, which is work, because I'm filming it.
33. any · Fear is a liar. So is the label on SPF 1000. Kidding. Legal made me say "kidding".
34. any · Someone was shot outside my retreat. I held space. Then I held a press conference. Then I held a sale.
35. any · Some people look at a beach and see a beach. I see a pre-construction opportunity with water features.
36. any · Day forty-one of my nine-day cleanse. I can hear colours. The colour is beige. It says buy now.
37. any · You can sleep when you're dead. I looked into it. There's a waiting list, and I'm on the board.
38. any · Boundaries matter. Mine are gated, landscaped and patrolled by twins with shotguns.
39. after-ad · That wasn't an ad. That was an invitation with a price.
40. any · Remember: you are enough. Terms apply. See the website for what counts as enough.

## Idents

Spoken over the last bar of a `drop`. Idents 1 and 2 are tier A, the rest B.

1. The Grind, twenty-four seven. No days off. No hours off.
2. One-oh-five point five. The Grind. You're already behind.
3. The Grind. Wake up. You're awake? Wake up more.
4. This is The Grind. Abundance, on a loop.
5. The Grind, with Kiki Halcyon. Nine million followers can't be wrong. They can be billed.
6. The Grind 24/7. Rest is for the unsponsored.

## Sponsored segments (tier B)

One plays in place of the pool ad every third loop, after a whoosh. Kiki reads them herself. They are longer than a line and scroll on the ticker.

### SPF 1000
"This hour of The Grind is powered by SPF 1000. One thousand. Not a typo, a promise. I haven't seen the sun since I started using it, and my skin has never been more indoors. SPF 1000. The sun can't see you."

### Glow Camp
"Feeling stuck? Come to Glow Camp on Sandpiper Isle. Seven days of silence, sunrise and invoices. You'll sleep in a white tent, eat one almond with intention, and leave lighter, mostly in the bank account. Glow Camp. Arrive as you. Leave as me."

### Bayhaven Tomorrow
"Today's mindset moment is brought to you by Bayhaven Tomorrow. Luxury living where your neighbourhood used to be. I've toured the model home. It has a room just for affirmations and a view of where the trailers were. From the low nine hundreds."

### Lightning Bug
"The Grind is fuelled by Lightning Bug energy drink. I don't drink it. I don't need it. But my assistant had six and built a deck in an hour. Then she saw God. Then she invoiced him. Lightning Bug. It glows. Don't ask why."

### Squeeze Play
"My cleanse partner is Squeeze Play. Day forty of nine. Today's juice is celery, air and a rumour of lime. Nineteen dollars. If you can taste it, they made it wrong. Squeeze Play. You'll feel empty. That's the product."

### Manatee Mattress
"I always say sleep is quitting. Manatee Mattress has paid me to say something else. So: sleep is quitting, comfortably. Nine layers of foam and one of regret. I own four. I've never used them. Manatee Mattress."

## New names

- Sounds: whoosh, till bell.
- Station id `grind` and frequency 105.5 FM.
- No new people, places or brands. Every sponsor is from the canon.
