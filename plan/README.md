# Bayhaven: the plan

You are building **Bayhaven**, an original open-world crime comedy for the browser. This folder is the whole plan. It is read-only: sessions follow it, they don't edit it.

## Read this much, every session

1. This page.
2. The prompt you were given. It names the sections you need.
3. Only those sections, and only the `docs/contracts/*.md` files your prompt names.

Do not read the whole plan or the whole source tree. Open files as you need them.

## The files

| File | What is in it |
|---|---|
| `01-vision.md` | The pitch, the six pillars, what a ten-second clip should make someone feel, what is not in this game |
| `02-world.md` | The city: ten districts, the map, sizes in metres, roads, water, how it streams in chunks |
| `03-characters-and-story.md` | Mags and Teo, the cast, the 20-mission story, tone |
| `04-systems.md` | Every system with its numbers and its file: driving, vehicles, traffic, people, heat, combat, phone, radio, money, shops, weather, map, saving, controls |
| `05-content.md` | Mission step lists, side jobs, things to find, Local Man events, radio and Squawk samples, approved names, the daily drops |
| `06-tech-architecture.md` | The module layout, lanes, events, state, budgets, the test API, the standing gates |
| `07-art-and-audio.md` | Palette, light, buildings, people, the HUD, the wordmark, sound and music |
| `08-roadmap.md` | Day 2 to day 9: goals, checks and the clip for each day |
| `BANNED.txt` | Strings the game must never contain |
| `bible/` | The deep specs. `bible/00-canon.md` holds every name, road and landmark position. The rest is one file per district, mission act, radio station, system and so on. **Read only the bible files your prompt names.** Each item in the bible has a tier (A, B, C, D): build only what your prompt asks for. |

## The ten things that never change

1. **Original, not unfamiliar.** Nothing another game owns: no characters, story, map, place names, logos, music, fonts or art from any other game, even renamed. The genre's conventions belong to nobody and are expected: a heat meter, stolen cars, chases, radio stations with DJs and fake ads, parody brands, heists, a sunny crime city, a crew of crooks. A stranger should know the genre in two seconds and find nothing copied.
2. **No real people, brands or places. Nothing about digital money.** New names come from the approved list in `05-content.md` and must pass `tools/lint-names.mjs`.
3. **Code first.** Everything has a version made in code. Made assets come only from the art department, through `public/assets/manifest.json`; you never download or generate anything yourself. No new packages unless the prompt says so.
4. **It runs on a phone.** Budgets are in `06-tech-architecture.md`.
5. **Stay in your lane.** Edit only the folders your prompt gives you.
6. **Plug in, don't wire in.** New features are new files the registry finds (`*.mod.js`, content files). Never edit a central list.
7. **Talk through events and state.** Don't import another lane's internals.
8. **Prove it.** Checks in `tools/checks/<session-id>.mjs`, numbers in `changelog/<session-id>.md`.
9. **A crime game for adults.** Guns, deaths, swearing and dark jokes are in, drawn low-poly and never lingered on. No slurs, nothing explicit, and the jokes are about people with power, never about who someone is.
10. **Never fake it.** If it isn't done, say so in your note.

## The city in five lines

- **Bayhaven** sits on a warm, flat bay. `x` is east, `z` is south towards the sea, 1 unit is 1 metre.
- The day 1 block is at the origin, on the beachfront, and stays there.
- The full map is 6.4 km × 4.8 km in 160 m chunks, streamed in three rings of detail.
- Ten districts: Tideline, Meridian, Palma Vieja, The Paintworks, Rustwater, Northgate, Mallard Greens, Runway Flats, Mudcat Glades, The Islands.
- The sun sets over the water. Golden hour is the home key.

## The game in five lines

- You are **Mags** (61, a retired getaway driver who spent 31 years as a school bus driver, drives anything) and **Teo** (24, a small-time crook who streams to 212 followers, climbs anything).
- A developer is flattening their trailer park. They fight back, badly, then well.
- **Everyone is filming.** Police heat is five siren lights and a live viewer count. You lose the heat by being boring until the viewers leave.
- The HUD looks like a stream overlay. Result screens are postcards.
- It ends with a heist in a hurricane and a bus being parked.
