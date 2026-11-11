# Bible · radio · Bayhaven Public Radio

Bayhaven Public Radio is the talk station: it reads the news, and the news is what the player just did. Barbara Wetherby hosts every show on the schedule because she is the only journalist left. Below: identity, voice, the daily schedule, 30 lines, four call-in sketches and the pledge drive; news, weather and traffic templates are in `news.md`.

Tier: A for the station, host lines 1 to 6, idents 1 and 2 and the hourly chime. B for the schedule, host lines 7 to 30, idents 3 to 6, the sketches and the pledge drive. The Sunday special is C.

## Identity

| Field | Value |
|---|---|
| Id | `bpr` |
| Frequency | 88.5 FM, dial position 2 of 12 |
| Slogan | "Somebody has to." |
| Who listens | Retirees, bus drivers, waiting rooms, Mags |
| Starts in | Manatee, Guppy, Permit, Clam, Gopher, Bay Ferry, and the Mayfly once it can be flown |
| Shops that play it | Meridian's Radio Row. Northgate's Medical Mile (the hospital waiting room, Pill Bill's). Every Storm Mart, for the weather. Every Second Wind Thrift, until Postcard 66 ships. |
| Building | `(-420, -840)`, Radio Row. Mission 13 ends at its door. |
| Ships | Day 8 |

Start rule, the same on every station: a vehicle taken from traffic or the kerb is already tuned to its own station. The first Q or E press sets the lead's remembered station.

## The host: Barbara Wetherby

The newsroom is one desk, one telephone and Barbara. Every show has a different name and the same voice.

1. The calm of a tide table. The stranger the item, the flatter she reads it. She never laughs and never uses an exclamation mark.
2. Everything is attributed: "witnesses say", "described only as", "a man believed to be". Local Man is never named.
3. Her dry asides go upward: the Sheriff, the developer, the association, the Mayor. Never at a caller, a victim or Local Man. She never swears, whatever she is reading; callers do.

Speech blip: sine plus triangle, 220 Hz, 75 ms per syllable, 5.5 syllables a second, the pitch never moves, a 30 ms gap at every comma.

## Sound

| Part | Recipe |
|---|---|
| Chime | Four bell notes, G4, E4, C4, G3, 400 ms apart, the last ringing 1.5 s. On the hour and before each show. |
| Phone | Callers' blips run through a 300 Hz to 3 kHz band-pass with 4% noise. Pitches: Marjorie 280 Hz, Dennis 150, the Mayor 310, Larry 200. |
| Loop | News item, host line, ad, ident. The news item is the newest unread template from `news.md`; with nothing new in 10 in-game minutes, a weather or traffic report. On the hour: chime, the time, two news items. |
| Ads | Read by Barbara, each opened with "Support for this station comes from" |

## The daily schedule

In-game hours. The show decides which host lines may play.

| Hours | Show | What it is |
|---|---|---|
| 05:00 to 06:00 | The Tide Tables | High and low water for the pier, the port and the Keys. Twelve numbers and a sigh. |
| 06:00 to 10:00 | Morning Tide | Her flagship. Weather on the half hour. |
| 10:00 to 12:00 | You're On the Air | Call-in. One sketch an hour, in rotation. |
| 12:00 to 13:00 | The Lunch Counter | Food news. Mostly a review of what is in the station fridge. |
| 13:00 to 15:00 | Marlin County Live | The council meeting. Mayor Bunny Castellano campaigns from the chair and Barbara summarises. |
| 15:00 to 16:00 | Storm Watch | Fifteen minutes of waiting for the 15:15 storm, forty of describing rain |
| 16:00 to 19:00 | The Drive Home | A traffic report every loop |
| 19:00 to 21:00 | Birds of the Bay | Bird calls named by ear. Most are probably Gerald. |
| 21:00 to 00:00 | Bylaws at Bedtime | Barbara reads the Mallard Greens rulebook aloud as a sleep aid |
| 00:00 to 05:00 | Morning Tide, repeated | The same show again |
| Sunday 16:00 to 17:00 | The Boat Parade, Described (tier C) | Replaces The Drive Home for the first hour. Every boat is "white". |

## Host lines

A line is 180 characters or fewer. Each line starts with when it may play: a show, a weekday or a key. `dawn` is 05:00 to 07:00, `storm` the 15:15 rain, `cut` just before the Sheriff's show takes the station at heat 4, `back` the first line after heat clears. Lines 1 to 6 are tier A, the rest B.

1. any · In local news, a man described only as 'driving like that' was seen near {district} this afternoon. Police are asking viewers to stay tuned.
2. Morning Tide · Good morning. This is Morning Tide. I'm Barbara Wetherby. The news is next, and it is mostly one person.
3. any · You're listening to Bayhaven Public Radio, the station that asks for nothing except, twice a year, everything.
4. storm · It is three-fifteen. It is raining. In other news, water remains wet.
5. cut · We are obliged to hand this frequency to the Sheriff's television programme. I'm told it's for public safety. I'm told many things.
6. back · We're back. The Sheriff's programme has ended. Its ratings were excellent. Nobody was arrested. Several people were shot. These facts are related.
7. any · The county coroner has asked the Sheriff's office to stop tagging him in its clips.
8. The Tide Tables · High water at the pier, six-oh-four. Low water, twelve-nineteen. The sea, as ever, declined to comment.
9. any · The Sheriff's office has released a statement. It is a link to the show.
10. any · In business news, the Bellweather Group reports record profits, and reports them again, slower, in case we missed it.
11. Marlin County Live · We go live to the council chamber, where Mayor Castellano has the floor, the microphone and a banner with her name on it.
12. Birds of the Bay · That call was a laughing gull. That one was a car alarm. That one, I believe, was Gerald.
13. Bylaws at Bedtime · Section nine, paragraph four. Mailboxes shall be beige. Paragraph five. Beige shall be defined by the board.
14. The Drive Home · If you are stuck on the Bayline Expressway, you are not in traffic. You are an audience.
15. any · A correction. Yesterday we said the storm would arrive at 15:15. It arrived at 15:15. We regret the accuracy.
16. Morning Tide, repeated · This is a repeat of this morning's programme. The weather was correct at the time.
17. any · The Sheriff's office disputes our report that three people were shot on last night's programme. It says four, and has sent the footage.
18. hurricane · A hurricane warning is in force. Residents are advised to leave. This station stays on air. Someone has to say what happened.
19. any · Bayhaven Tomorrow says its towers will bring "a new dawn". The old dawn was unavailable for comment.
20. Wednesday · A cruise ship is in port until five. Four thousand visitors would like directions to the beach they are standing on.
21. Monday · It is bin day, and inspection day in Mallard Greens. The association reminds residents that a lawn is a privilege.
22. The Lunch Counter · Today on The Lunch Counter: a sandwich from the station fridge. It's labelled "Barbara". I didn't label it.
23. dawn · The time is {hour}. If you're awake, my condolences. If you're awake for work, my respect.
24. Friday · Race night at the Speedbowl begins at seven. Organisers remind fans that the racing takes place on the track.
25. You're On the Air · The lines are open. Please turn your radio down before you speak. No. Down. The other way.
26. any · Our thoughts are with the families of those shot dead today. The Sheriff's, he tells us, are with the sponsors.
27. any · Kiki Halcyon has announced a nine-day cleanse. It is in its second month.
28. Sunday · Everything shuts early today. This station does not. There's nobody else here to lock up.
29. any · The homeowners' association has voted to ban another bird. Our reporter asked which one. She was asked to leave the lake.
30. any · And finally. There is no "and finally". Something else has just happened near {district}.

## Idents

Each follows the chime. Idents 1 and 2 are tier A, the rest B.

1. Bayhaven Public Radio. Somebody has to.
2. Eighty-eight point five. Bayhaven Public Radio. The news, mostly about one person.
3. This is Bayhaven Public Radio. Listener supported. Listener, singular.
4. Bayhaven Public Radio. Accurate to within fifteen minutes past three.
5. You're listening to Bayhaven Public Radio. Thank you. Both of you.
6. Bayhaven Public Radio. One desk. One telephone. One Barbara.

## Call-in sketches (tier B)

Played in You're On the Air. One line per ticker row, 90 characters or fewer.

### The Mailbox
```
Barbara: You're on the air.
Marjorie: Yes, hello. I'd like to report a mailbox on Coot Circle. It is not beige.
Barbara: What colour is it?
Marjorie: Sand.
Barbara: And the rule says beige.
Marjorie: The rule says beige. I have the rule laminated.
Barbara: Whose mailbox is it, Marjorie?
Marjorie: Number fourteen.
Barbara: And where do you live?
Marjorie: ...Number fourteen.
Barbara: You're reporting your own mailbox.
Marjorie: Somebody has to. If I don't, the board will, and the board charges.
Barbara: Thank you for your call.
Marjorie: It was beige in the bloody shop.
```

### Is It Going to Rain
Plays only between 15:00 and 15:14.
```
Barbara: You're on the air.
Dennis: Hi Barbara, long-time listener. Quick one. Is it going to rain today?
Barbara: What time is it where you are, Dennis?
Dennis: Fourteen minutes past three.
Barbara: Then yes. In one minute.
Dennis: Only I've got washing out.
Barbara: You have fifty seconds.
Dennis: Is it every day, then?
Barbara: Every day, Dennis. At 15:15. For as long as records have been kept.
Dennis: Nobody told me.
Barbara: How long have you lived here?
Dennis: Thirty-one years.
Barbara: Dennis, go and get your washing.
Dennis: Oh, shit. It's started.
Barbara: Thank you for your call.
```

### A Concerned Citizen
```
Barbara: You're on the air.
Caller: Hello. I'm just an ordinary concerned citizen. Call me... Bonnie.
Barbara: Go ahead, Bonnie.
Caller: I think Mayor Castellano is doing a wonderful job. Everyone says so.
Barbara: Who says so?
Caller: People. Citizens. At the shops.
Barbara: Bonnie, I can hear a campaign bus reversing.
Caller: That's my dishwasher.
Barbara: It's playing your campaign song.
Caller: It's a very loyal dishwasher.
Barbara: Mayor, yesterday you called as "Bernie", and on Tuesday as "a fisherman".
Caller: And all three of them are voting for me.
Barbara: Thank you for your call, Mayor.
```

### Line Four Is Larry
```
Barbara: You're on the air.
Larry: Barbara! Larry here. Just Larry. A private citizen today.
Barbara: Hello, Larry.
Larry: Your last caller mentioned a mailbox. Has that mailbox ever killed anyone?
Barbara: No.
Larry: Could it?
Barbara: It's a mailbox, Larry.
Larry: Damn. Emotional distress, then. Beige is a very upsetting colour.
Barbara: This is not an advertisement.
Larry: Of course not. An advertisement would mention 555-0144.
Barbara: Larry.
Larry: Which I haven't. 555-0144.
Barbara: We've lost the line. I unplugged it.
```

## The pledge drive (tier B)

Once each in-game day, at a random hour from 10:00 to 19:00, the next host line is a pledge line. They play in order and loop. `{pledge}` is `61 + 5 × days played`, in dollars. The goal never moves.

1. It's pledge week on Bayhaven Public Radio. Our goal is forty thousand dollars. So far we have raised {pledge}. Thank you, Dennis.
2. For a pledge of fifty dollars you'll receive the station tote bag. There is one tote bag. I'm using it. I'll empty it.
3. The Bellweather Group has offered to pay for everything if we become "Bayhaven Tomorrow Radio". We declined. We remain at {pledge} dollars.
4. The Sheriff's show raised more than our yearly budget during one shoot-out. Our number is 555-0188. I'll answer. It's only me.
5. Pledge week continues. It has continued for five weeks.
6. We've had a pledge. Five dollars, with a note: "for the bird programme". Gerald thanks you. We are now at {pledge}.

## New names

- Shows: the eleven in the schedule.
- Callers: Marjorie of 14 Coot Circle, Dennis. "Bonnie" and "Bernie" are the Mayor.
- Phone number 555-0188 (the newsroom). Station id `bpr`, frequency 88.5 FM.
