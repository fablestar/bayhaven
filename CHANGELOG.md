# Changelog

Built from the notes in `changelog/` by `tools/changelog.mjs`. Newest day first.

## Day 2: Drift (day 2 headline)

### D2-S1 · Drift (day 2 headline)

**Shipped**

1. **Handling with weight.** The driving is now a fixed 60-steps-a-second body with forward speed, sideways speed and spin (`src/handling.js`, the step from `plan/bible/systems/driving.md`). Handbrake on Space, pad A and a touch button: rear grip drops to 1.2 /s and the car pivots. Slides hold on the throttle and come back with countersteer. Touch gets the 30% countersteer assist and the slower 5 /s steering.
   - **Top speed: the Heron now reaches 137.0 km/h** (136.975 measured after 60 s of gas on the flat; 136.6 after 40 s; listed 137). Day 1's extra drag is gone and the pull is solved at load so 0 to 100 km/h takes 7.48 s (listed 7.5).
   - Page title is "Bayhaven | Day 2". The controls hint uses commas.
   - Phone fix: the hint wraps inside the screen. At 390x844 it sits from x 12 to 378, at 844x390 from 207 to 637, and document scrollWidth is 390 at 390 wide.
2. **Drift feedback.** Tyre smoke, skid marks that fade (20 s, 8 s on phones), and a drift score that counts while the slip angle is over 0.35 rad above 40 km/h, with the hold multiplier. A wall hit banks half.
3. **Hits.** Sparks and camera shake on wall hits, sparks when scraping a wall. 32 lamp posts, 32 barrier sections and 26 neon cones are separate objects that get knocked over. A lamp that goes down takes its light with it. R stands everything back up.
4. **Speedometer with gear** and a rev bar; four-gear engine sound, tyre squeal, impact thumps, lamp clang, cone clatter, a horn on H.
5. **Cameras.** Look-back (hold B, pad B, a touch button), close chase (C, right stick click, a touch button). In a slide the chase camera swings to show the car's side. **Gamepad** for everything: stick or d-pad steers, triggers for gas and brake, A handbrake, left stick click horn, B look-back, right stick click camera, Y skips time, Back resets, Start mutes.
6. **The drop: Drift Night.** A cone gate, a nine-cone slalom, a donut ring and an arc round the plaza corner on the beachfront street, a neon sign at the spawn, a score board on the promenade (best, last, tonight, cones down) and a score line on the HUD. Built only when the build day is 2 (`?day=3` shows none of it).
7. **The clip.** `?clip=day-2`: sunset, down the beachfront, brake, handbrake round the plaza corner through the cones, away up the side street. 12.0 game seconds, played through the real input and physics, so it is the same every time.

Also: the Heron comes in pink or teal, picked at random each load (the clip is always pink).

**Not shipped**

- **Parked cars that react when hit** (the other "if you finish early" item). They are still solid boxes.
- **No taxi in the clip.** The roadmap's clip line has a taxi swerving; traffic is session D2-S4.
- The hood camera, the air and landing rules and the other surfaces (grass, dirt, wet road) from the driving bible. They were not in this session's list. Sand (0.6 grip) and the sea are in.
- The scores are not saved between loads.
- No art requests were made.

## Day 1: A block, a car, a sunset: the block comes alive (2026-11-11)

### D1-S1 · A block, a car, a sunset: the block comes alive (2026-11-11)

**Shipped**

today's roadmap line (one neon coastal block, a drivable car with a chase camera, a sky that goes
from day to sunset) was already standing after the warm-up. today it was checked again end to end
and then polished.

new today:
- asphalt, paving and sand have a fine speckled grain, so the ground rushes past and you can feel speed
- gulls circle over the beach, flapping and gliding; they go home at night
- sound: surf that swells like waves and gets louder near the sea, wind noise that rises with speed.
  M now mutes everything, and the game goes quiet when the tab is hidden
- the promenade lamps moved to the far side with long arms, so a post no longer blocks the camera
- the far sea no longer shimmers in a grid pattern (ripples fade out with distance)

numbers: 19 to 24 draw calls, about 56k triangles. gulls cost one draw call, the grain one small texture.

tested: build passes; headless-browser screenshots at day, sunset and night on desktop and phone
sizes; touch buttons under phone emulation; no console errors. not tested: the new sounds were never
heard by ear (the test browser has no speakers), only checked to run without errors. still no real phone test.

known rough edges: same as the warm-up (simple collisions, no traffic or people). driving feel is tomorrow.

## Day 0: Warm-up, before day 1: a block, a car, a sunset (2026-11-10)

### D0-S1 · Warm-up, before day 1: a block, a car, a sunset (2026-11-10)

**Shipped**

the game has a name and a place: **Bayhaven**, a pastel coastal city that lights up at night.

what's in the build:
- one playable city block by the sea: pastel low-poly buildings with shopfronts, neon trim and
  invented shop signs, a small plaza, a rooftop sign with the city's name, palms, street lamps,
  parked cars, zebra crossings
- a palm promenade, a beach with umbrellas and a lifeguard hut, and an ocean you can drive into (a bit)
- more blocks and skyline towers sketched in around it; striped "more city soon" barriers mark
  where today's map ends
- a drivable car with a chase camera: gas, brake, reverse, steering, a little slide, brake lights,
  headlights at night. it bumps into walls instead of driving through them. the camera stays out of buildings
- a sky that runs from afternoon to golden hour, sunset, dusk and night (then round again): sun,
  clouds, stars, sea colours, fog and city lights all follow one clock
- engine hum made from oscillators; touch buttons on phones; the game lowers its resolution if a phone can't keep up

controls: WASD / arrows drive · T (or tap the clock) skips time · R resets the car · M mutes

numbers: about 22 draw calls and 56k triangles on screen. everything is generated in code, no asset files.

tested: headless-browser screenshots at day, sunset, dusk and night, desktop and phone sizes; touch
buttons under phone emulation; wall and shoreline collisions. not yet tested on a real phone, and
driving feel was only checked by numbers, not by hand. that is tomorrow's line anyway.

known rough edges: collisions are simple (you slide along walls), no traffic or people yet, lamp
posts near the camera can block the view, sand and road have no texture.
