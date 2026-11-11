# changelog

## day 1 (2026-11-11): the block comes alive

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

## warm-up, before day 1 (2026-11-10): a block, a car, a sunset

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
