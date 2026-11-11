# Bible · art · Characters

Everyone in Bayhaven is a six-box toy person 1.8 m tall with a head one fifth of that. This file gives the exact boxes and pivots, the atlas for faces and clothes, hair, hats and bags as box lists, twenty crowd looks, Mags and Teo part by part, and the maths for every pose. Nobody has knees or elbows: the look is a wooden toy. People can be hurt and killed here, so the file also covers the death fall and the pose of someone who stays down, both kept quick and plain.

Tier: A unless a row carries another tag.

## 1. The body

The person faces +z. x is their left. Heights are above the soles at scale 1.0. A positive turn round x swings a limb backwards; a negative one swings it forwards and up. A positive turn round x on the torso leans it forwards.

|Part|Box, w×h×d in m|Pivot (x, y, z)|Box centre from pivot|Spans y|
|---|---|---|---|---|
|Head|0.38×0.36×0.36|neck (0, 1.44, 0)|(0, +0.18, 0)|1.44 to 1.80|
|Torso|0.40×0.64×0.24|hips (0, 0.80, 0)|(0, +0.32, 0)|0.80 to 1.44|
|Arm, left and right|0.12×0.60×0.12|shoulder (±0.26, 1.40, 0)|(0, -0.30, 0)|0.80 to 1.40|
|Leg, left and right|0.18×0.80×0.20|hip (±0.10, 0.80, 0)|(0, -0.40, 0)|0 to 0.80|

- These pivots match the crowd code in `tech/algorithms.md`, with the torso centre at 1.12 and the head centre 0.50 above it so the figure stands exactly 1.80.
- Height varies by a whole-body scale of 0.92 to 1.08. The collision circle stays 0.35 m.
- Drawing: six instanced meshes, one per part, plus one `extras` mesh of unit boxes for hair, hats, bags and things in hand. Seven draw calls for the whole crowd. Blob shadows are an eighth.
- Triangles: 12 a box, 72 a body. Extras: up to 5 boxes a person on `high` (132 triangles in all), up to 3 on `low`.
- Blob shadow: a 0.9 m quad of the glow texture in black, opacity 0.45 - 0.2 × night.
- Past 60 m limbs hang straight and matrices update every third frame. On `low`, extras past 60 m are not drawn.

## 2. The people atlas

One 256×256 canvas, nearest-neighbour filtered so edges stay crisp.

|Region|Pixels|Cells|
|---|---|---|
|Faces|x 0 to 127, y 0 to 63|4×2 cells of 32 px: six expressions and two spares|
|Shirts|x 128 to 255, y 0 to 127|4×4 cells of 32 px|
|Limbs|x 0 to 127, y 64 to 95|8 cells of 16×32 px|

The alpha channel says how a texel is tinted. Alpha 1 takes the instance colour (cloth, or skin on the head). Alpha 0.5 takes the instance's skin colour. Alpha 0 is drawn as painted. Each part instance carries a colour, a skin colour and a cell number. The head's front face maps a face cell; its other faces map a blank texel.

### Faces

Coordinates are pixels in a 32×32 cell, origin top left, y down. Ink is `#2a1a2e`. Lines are 2 px with round caps unless noted. Dots are filled circles.

|Cell|Expression|Eyes|Brows|Mouth|
|---|---|---|---|---|
|0|neutral|dots r 2 at (10, 13) and (22, 13)|none|line (12, 22) to (20, 22)|
|1|happy|upper half-circles r 2.5 centred (10, 14) and (22, 14)|none|lower arc r 5 centred (16, 19), from 20° to 160°; cheek dots r 1.5 at (6, 19) and (26, 19) in `#ff8fd0` at 50%|
|2|shocked|white rings r 3 with a 1.5 px edge at (10, 12) and (22, 12), pupil dots r 1|(7, 6) to (13, 7) and (19, 7) to (25, 6)|filled oval centred (16, 23), 6 wide, 8 tall|
|3|angry|dots r 2 at (10, 14) and (22, 14)|(6, 8) to (14, 11) and (26, 8) to (18, 11), 2.5 px|upper arc r 5 centred (16, 27), from 200° to 340°|
|4|filming-squint|left: line (7, 13) to (13, 13); right: dot r 2.5 at (22, 13)|right only: (19, 8) to (25, 9)|line (14, 22) to (19, 21)|
|5|dizzy|spirals of 1.5 turns growing to r 3.5 at (10, 13) and (22, 13), 1.5 px|none|zigzag (11, 23), (14, 21), (18, 24), (21, 22)|
|6|blink (spare)|lines (8, 13) to (12, 13) and (20, 13) to (24, 13)|none|as neutral|
|7|talk (spare)|as neutral|none|filled oval centred (16, 22), 5 wide, 4 tall|

Blink: cell 6 for 0.12 s every 3 to 6 s. Talk: cell 7 swaps in for 60 ms on each speech blip.

### Shirts and limbs

|Shirt cell|Pattern|Limb cell|Pattern|
|---|---|---|---|
|0|plain|0|long sleeve: all cloth|
|1|four 8 px stripes|1|short sleeve: top 40% cloth, rest skin|
|2|8 px check|2|bare arm: all skin|
|3|hi-vis: two pale 4 px bands|3|glove: as cell 1, lowest 20% painted `#3b3946`|
|4|uniform: pocket square, button line|4|trousers: all cloth|
|5|tank: 8 px skin at each side|5|shorts: top 45% cloth, rest skin|
|6|polo: collar wedge|6|boardies: as cell 5 with a 3 px white side stripe|
|7|suit: white wedge and a tie bar|7|socks and slides: skin, then a white band over the lowest 25%, the last 3 px ink|
|8 to 11|floral, seeds 1 to 4: nine five-dot flowers, painted white and one accent| | |
|12|`floral-12`: Mags's shirt| | |
|13|`floral-3`: Teo's open shirt, a 12 px white tank strip down the middle| | |
|14|life vest: two pale panels and a buckle line| | |
|15|mascot: one big belly oval| | |

## 3. Hair, hats and bags

Positions are the box centre from the head's centre (hair, hats) or the torso's centre (bags). Sizes are w×h×d in metres. A person's hair, hat and bag together use at most 5 boxes; under a hat with two boxes, hair keeps only its first box.

|#|Hair|Boxes|
|---|---|---|
|1|`crop`|0.40×0.08×0.38 at (0, 0.20, -0.01)|
|2|`flat-top`|0.38×0.14×0.36 at (0, 0.24, 0)|
|3|`side-part`|crop, plus a fringe 0.20×0.08×0.04 at (-0.08, 0.14, 0.19)|
|4|`bob`|0.42×0.12×0.40 at (0, 0.20, -0.02), plus 0.42×0.30×0.12 at (0, 0.02, -0.16)|
|5|`long`|crop, plus a back panel 0.38×0.52×0.08 at (0, -0.10, -0.20)|
|6|`ponytail`|crop, plus a tail 0.12×0.24×0.12 at (0, 0.04, -0.26), turned 0.5 back|
|7|`bun`|crop, plus 0.16×0.16×0.16 at (0, 0.30, -0.08)|
|8|`big-curls`|0.50×0.34×0.46 at (0, 0.22, -0.03)|
|9|`crest`|0.08×0.18×0.38 at (0, 0.27, -0.02)|
|10|`fringe-curls`|0.44×0.16×0.40 at (0, 0.22, -0.02), plus 0.34×0.08×0.06 at (0, 0.15, 0.19)|
|11|`ring`|a back band 0.40×0.10×0.14 at (0, 0.06, -0.14)|
|12|`pigtails`|crop, plus 0.10×0.20×0.10 at (±0.24, 0.02, -0.04)|

Hair colours: black `#1e1a1a`, dark brown `#3a2a1e`, brown `#6a4630`, auburn `#9a4a2c`, blond `#e2c27a`, bleached `#f4e7a1`, silver `#cfd3d6`, pink `#ff6fb8`. Skin tones, eight: `#f3cfb3` `#eac4a6` `#d9a57e` `#c68a5e` `#a8693f` `#8d5b3e` `#6b4630` `#4f3226`.

|#|Hat|Boxes|
|---|---|---|
|1|`visor`|band 0.40×0.05×0.38 at (0, 0.13, 0); brim 0.34×0.02×0.18 at (0, 0.12, 0.27)|
|2|`cap`|dome 0.40×0.12×0.38 at (0, 0.22, 0); brim 0.32×0.02×0.16 at (0, 0.17, 0.26)|
|3|`cap-back`|the cap with its brim at z -0.26|
|4|`sunhat`|brim 0.70×0.02×0.66 at (0, 0.17, 0); crown 0.36×0.12×0.32 at (0, 0.24, 0)|
|5|`bucket`|crown 0.40×0.14×0.38 at (0, 0.23, 0); brim 0.54×0.04×0.50 at (0, 0.15, 0)|
|6|`hard-hat`|dome 0.42×0.14×0.42 at (0, 0.23, 0); lip 0.36×0.03×0.10 at (0, 0.17, 0.24)|
|7|`headphones`|band 0.44×0.04×0.06 at (0, 0.20, 0); cups 0.06×0.14×0.12 at (±0.22, 0.02, 0)|
|8|`helmet`|0.44×0.20×0.44 at (0, 0.20, -0.01)|
|9|`wide-brim`|brim 0.62×0.02×0.62 at (0, 0.18, 0); crown 0.34×0.14×0.34 at (0, 0.26, 0)|
|10|`beanie`|0.40×0.16×0.38 at (0, 0.22, 0); bobble 0.08×0.08×0.08 at (0, 0.34, 0)|

|#|Bag|Boxes|
|---|---|---|
|1|`backpack`|0.34×0.40×0.14 at (0, 0.04, -0.19)|
|2|`tote`|0.06×0.30×0.28 at (0.24, -0.24, 0.02)|
|3|`cross-body`|bag 0.30×0.22×0.10 at (0.10, -0.16, -0.18); strap 0.04×0.62×0.02 on the chest, turned 0.6|
|4|`suitcase`|0.40×0.60×0.24 on the ground 0.5 m behind; handle 0.04×0.50×0.04 up to the hand|
|5|`beach-bag`|bag 0.30×0.26×0.12 at (0.24, -0.20, 0); towel roll 0.34×0.10×0.10 on top|
|6|`delivery-box`|0.40×0.40×0.34 at (0, 0.06, -0.29), mango `#ffa02e`|

In hand: phone 0.08×0.16×0.02 · pool noodle 0.08×0.08×1.4 · lawn flamingo, 3 boxes · camera 0.14×0.10×0.10.

## 4. Twenty looks and two more

Courage is the chance to film instead of flee when something loud happens within 40 m. Walk is metres a second.

|#|id|Tier|Shirt cell and colours|Legs|Hair, hat, bag|Walk|Courage|
|---|---|---|---|---|---|---|---|
|1|`tourist`|A|floral 8 to 11 on `#ff9eb5` `#8fe3cf` `#ffc98f`|shorts `#fff1c9`|any; `sunhat` or `cap`; `beach-bag` or camera|1.3|0.9|
|2|`jogger`|A|tank `#ff3fa4` `#29e6ff` `#5dff9b`|shorts `#2b2838`|`ponytail`, `crop`; `headphones`|3.4|0.5|
|3|`retiree`|A|polo `#f5ecd7` `#b7c9a8` `#f0d0c8`|trousers `#c9cdd4`|`ring`, `bob`; `visor`; `tote`|1.1|0.7|
|4|`skater`|A|stripes `#c9a8ff` `#ff8f7a`|shorts `#6f6a78`|`long`, `crest`; `helmet` or `cap-back`; `backpack`|4.0|0.8|
|5|`office`|A|suit `#b8cfe0` `#e0e0e6` `#2e4a6b`|trousers `#2e4a6b`|`side-part`, `bun`; none; `cross-body`|1.7|0.4|
|6|`docker`|A|hi-vis `#ffc300` over `#b5532f`|trousers `#2e4a6b`|`crop`; `hard-hat`|1.5|0.6|
|7|`clubber`|A|plain `#b46bff` `#5dff9b` `#150f3d`|trousers `#1b1924`|`big-curls`, `crest`, pink hair; `headphones`|1.5|1.0|
|8|`beachgoer`|A|tank or bare torso (skin colour)|boardies in any neon|any; `sunhat`; `beach-bag`|1.2|0.8|
|9|`deputy`|A|uniform teal `#1f8a8a`|trousers `#fdf6ea`|`crop`; `wide-brim` white with a pink `#ff4fa8` band|1.6|none: they chase|
|10|`guard`|A|suit `#150f3d`|trousers `#150f3d`|`flat-top`; none; an earpiece dot|1.6|none: they block|
|11|`courier`|B|plain `#ffa02e`|shorts `#2b2838`|any; `helmet`; `delivery-box`|2.2|0.5|
|12|`vendor`|B|check `#ffb347` `#2ec4b6`|trousers `#fff1c9`|`ring`, `bun`; `sunhat`|1.0|0.9|
|13|`shopper`|B|polo `#e8dcc4` `#f4bdbd` `#c4d7e2`|trousers `#6f6a78`|any; none; two `tote`s|1.2|0.6|
|14|`golfer`|B|polo `#f0d0c8` `#b7c9a8`|check trousers `#f5ecd7`|`ring`, `side-part`; `visor`|1.3|0.3|
|15|`traveller`|B|plain, any pastel|trousers `#6f6a78`|any; `cap`; `suitcase`|1.6|0.5|
|16|`artist`|B|stripes `#150f3d` on `#f7f3ea`|trousers `#a8553a`|`fringe-curls`, `long`; `beanie`; `tote`|1.3|1.0|
|17|`fisher`|B|life vest `#ffa02e` over `#3d6b4a`|trousers `#8a7f66`|`crop`; `bucket`|1.2|0.7|
|18|`yacht-guest`|C|polo `#ffffff` `#1f2f5a`|shorts `#ffffff`|`side-part`, `long`; `sunhat`|1.2|0.2|
|19|`glow-guest`|C|plain `#ffffff`|trousers `#ffffff`|`bun`, `long`; none|0.9|0.1|
|20|`mascot`|C|mascot cell in `#ffa02e` or `#ff5a5a`|trousers of the same colour|`helmet` scaled 1.3 in the same colour|1.4|1.0|
|21|`paramedic`|A|uniform `#fdf6ea` with a mint `#5dff9b` band|trousers `#2e4a6b`|`crop`, `bun`; none; a kit bag as `tote`|2.0|none: they work|
|22|`crew`|A|plain or stripes in one crew colour: `#b46bff`, `#ffa02e` or `#3fb86a`|trousers `#1b1924`|`crop`, `crest`; `cap-back` or `beanie` in the crew colour|1.6|none: they shoot back|

## 5. Mags and Teo

The leads are their own meshes, not crowd instances. Colours match `story/characters.md`.

|Piece|Mags Calloway, scale 0.94|Teo Navarro, scale 1.0|
|---|---|---|
|Skin|`#d9a57e`|`#c68a5e`|
|Hair|silver `#cfd3d6`: `crop` plus a tail 0.12×0.24×0.12 that swings|dark roots `#3a2a1e` as `crop`; a bleached `#f4e7a1` block 0.34×0.16×0.30 at (0, 0.30, 0.02), `shift` 0.04 forwards|
|Hat|`visor`: band `#fdf6ea`, brim teal `#2ec4b6`|none|
|Top|shirt cell 12 in coral `#ff8f7a`, flowers `#fff1c9`; short sleeves|shirt cell 13 in cyan `#29e6ff`, flowers `#ff4fa8`, tank `#fdf6ea`; short sleeves. Two shirt tails 0.19×0.30×0.02 hinged at the back of the hips|
|Hands|glove cell: driving gloves `#3b3946`|bare|
|Bottom|cargo shorts `#8a7f66`; a pocket box 0.05×0.16×0.14 on each thigh at (±0.215, 0.56, 0)|board shorts `#b46bff`, boardies cell|
|Feet|boat shoes `#6b4a32`: 0.18×0.07×0.26, 0.03 ahead of the leg|socks-and-slides cell; slides `#150f3d`: 0.18×0.06×0.27|
|Kit|none|a harness painted on the torso in ink: two straps on the chest, a cross on the back. Phone 0.09×0.17×0.02 on a 0.05 stalk at chest height, screen `#29e6ff`, `#ff3fa4` when live. A battery box 0.12×0.16×0.05 on the back with a 0.03 pink light|
|Boxes, triangles|14, 168|19, 228|
|Walk|swing × 0.8, bob × 0.5, lean × 0.5: small and upright|swing × 1.15, bob × 1.5: bouncy. Shirt tails lift by 0.12 × speed, up to 0.9, and lag turns by 0.15 s|

**From behind at 20 m** a person is about 30 px tall on a phone, so every tell is 0.12 m or more, and each lead has three:

|Lead|Shape|Colour|Motion|
|---|---|---|---|
|Mags|the shortest adult on screen; a tail box off the back of the head under a white band; hips 0.53 wide from the pockets|silver over coral over khaki; dark hands|a level head, short stride|
|Teo|a pale block 0.16 high on top of the head; two tails flaring to 0.6 wide at a run|pale yellow over cyan with an ink cross, over violet; white ankles|bounces; the pink light on his back shows at night with a 0.5 m glow sprite|

Gerald (tier A, cutscenes): 0.9 m tall, six boxes. Body 0.34×0.36×0.50 `#f7f3ea`; head 0.20×0.20×0.22; bill wedge 0.10×0.12×0.42 in `#ffa02e` with a pouch `#ffc98f`; two wings 0.06×0.30×0.95 in `#6f6a78`, opening to a 2.2 m span; one leg 0.06×0.22×0.06 in `#3b3946`.

## 6. The maths of moving

`v` is speed in m/s, `t` seconds, `s` steering from -1 to 1. Angles are radians.

- Phase: `φ += v × dt × k`, `k = 3.4 / (1 + 0.16 × max(0, v - 2))`. That is 3.4 a metre at a walk and about four steps a second at a sprint.
- `swing = min(1.0, 0.28 + 0.11 × v)`, `sw = sin(φ) × swing`.
- `bob = |sin(2φ)| × (0.02 + 0.006 × v)`, added to the hips' height.
- `lean = 0.02 + 0.035 × v`.

|State|Root and torso|Arms|Legs|Head and face|
|---|---|---|---|---|
|Walk 1.6, jog 3.4, sprint 6.2 (Teo 6.8, Mags 5.0)|bob; lean; twist round y 0.12 × sin(φ) × min(1, v / 3); roll into turns by -0.08 × yaw rate, within ±0.25|left `+sw`, right `-sw`; out from the body by 0.06 + 0.02 × v, at most 0.2; at a sprint add -0.5 to both|left `-1.2 × sw`, right `+1.2 × sw`|turns half the twist the other way|
|Idle|breath: torso height × (1 + 0.012 × sin(1.57 t)); sway 0.02 × sin(0.63 t)|out 0.06|still|looks to a new angle within ±0.5 every 4 to 9 s, over 0.4 s; blinks|
|Sit (seat 0.45 m)|hips at 0.42; lean -0.08|-0.5|both -1.45: straight out, like a doll|idle|
|Driving|the sit; roll -0.10 × sideways g, within ±0.15; a crash throws the lean to 0.5, back on a spring (120, 14)|left -1.25 + 0.25 s, right -1.25 - 0.25 s|-1.45|turns 0.3 × s; look back: head 2.5, torso 0.5|
|Scooter|lean 0.18; rolls with the bike, up to 0.61|-1.1|-1.2|counter-rolls half|
|Sport bike|lean 0.75|-1.35|-0.55|as scooter|
|Cruiser, quad, jet ski|lean -0.12|-1.2|-1.3|as scooter|
|Jump (1.1 m high)|crouch 0.08 s: hips -0.10. In the air: lean 0.15. Landing: hips -0.14 in 0.06 s, back in 0.18 s|rising: both -2.4. Falling: out by ±0.9|rising: -0.9 and -0.5. Falling: ±0.2 at 6 Hz|shocked past 0.4 s in the air|
|Fall (over 0.6 s in the air)|lean -0.2|-2.6 ± 0.5 at 14 Hz, opposite each other|±0.4 at 11 Hz|shocked|
|Tumble|the ten-point rope in `tech/algorithms.md`. Torso runs hips to neck, head neck to head, each arm from its shoulder to its hand, each leg from its hip towards its foot|by the rope|by the rope|after a light hit (under 50 km/h): dizzy, birds circle, lies 3 s, then gets up. After a hard one the rope settles straight into the down pose|
|Get up, 1.2 s|hips rise 0.30 to 0.80; lean 1.2, then 0.3 at 0.9 s, then 0|-1.2 pushing, then 0|-0.9, then 0|angry for 1.5 s; right arm -2.2 ± 0.3 at 12 Hz for 1 s|
|Death fall, 0.5 s|shot from the front: the root turns back to -1.57 in 0.45 s, easing in, as the hips drop from 0.80 to 0.12; one bounce of 0.06 at 0.5 s. Shot from behind: the same, forwards to +1.57. A shotgun adds a 1.5 m slide away from the blast|fling out by ±1.2 and to -0.6; falling forwards they reach -2.2|one kicks to -0.4, the other stays|shocked for the fall, then the down face|
|Down (stays down)|lying where the fall or the rope ended, on the back or the front: root at -1.57 or +1.57, hips at 0.12. No breath, no blink|uneven: out by 0.7 and 1.1|0.15 and -0.25|turned 0.5 to one side; eyes shut (cell 6), neutral mouth. Colours ease 30% towards grey over 2 s|
|Flinch|torso twists 0.3 away from the shot for 0.15 s|as they were|as they were|shocked for 0.4 s|
|Fire a weapon|recoil: the aiming arm kicks back 0.12 for 60 ms (0.20 for the shotgun)|see Aim|braced|filming-squint|
|Cover (crews, guards, deputies)|hips drop to 0.50 behind any box; lean 0.3|aim over the top, or both at -0.4 while waiting|a lunge: one at -0.9, one at +0.9|angry; pops up to fire two or three shots|
|Hands up (a bystander at gunpoint)|still; lean -0.05|both -2.9|still|shocked|
|Filming|stops; turns to the target at up to 2.5 a second|right: -1.9 less the pitch to the target, in by 0.15, shaking 0.02 at 3 Hz; phone box in hand. Past 10,000 followers the left waves: -2.6 ± 0.4 at 8 Hz|still|tracks ±0.6 past the body; filming-squint; a pink dot blinks on the phone|
|Sunbathing|on the back: root turned -1.57, hips at 0.12; breath; rolls over every 20 to 40 s in 0.8 s|out by ±1.3, or -2.9 behind the head, by seed|one at -0.35|happy|
|Dancing|beat phase `β = 2π × bpm / 60 × t`; bpm from the nearest radio, 104 for the flash mob, else 110. Four moves, 8 beats each, in order: step-touch (root x 0.18 × sin(β / 2), bob 0.05 × abs(sin β)); arms up (hips roll 0.12 × sin β); twist (torso round y 0.5 × sin β); jump (hips up 0.25 × max(0, sin β)²)|step-touch: -0.6 - 0.5 × sin β, taking turns. Arms up: -2.8, out 0.3 + 0.3 × sin β. Twist: out 0.5. Jump: -2.6|twist: ±0.2 × sin β|happy|
|Wading, to 1.2 m deep, 1.2 m/s|walk at swing × 0.7|out 0.5|walk|neutral|
|Swimming, 2.0 m/s|prone: root turned 1.25, hips 0.25 under the surface|full circles, 0.9 a second, right half a turn behind left|±0.25 at 3 Hz|turns ±0.5 each stroke|
|Treading water|upright; bob 0.05 at 0.6 Hz|out 0.9 ± 0.3 at 1.2 Hz|±0.3 at 1.2 Hz|neutral|
|Get in or out, 0.8 s|slides from the door to the seat, easing|reach -1.0|step: one at -0.8|neutral|
|Bail out above 30 km/h|one full roll round x in 0.5 s, then get up|tucked -1.0|tucked -0.9|shocked|
|Climb, ledges to 2.2 m (Teo 3.0)|hips rise over 0.6 s|-3.0, then 0|-0.8, then 0|neutral|
|Punch or swing|torso round y 0.5|-0.4 to -1.6 in 0.08 s, back in 0.2 s; arms take turns over a three-hit combo|braced: ±0.2|angry|
|Aim|turns with the camera|right: -1.57 less the pitch. Long weapons: left -1.3, in 0.4|braced|filming-squint|
|Carry|lean -0.05|both -0.9|walk|neutral|
|Flee|sprint|both -2.6: hands in the air|sprint|shocked|
|Talk|still|a gesture: -0.6 - 0.3 on each blip|still|nods 0.06 a blip; cell 7 on blips|

Rules that cover every row:

- A change of state blends every angle over 0.15 s. Coming out of a tumble takes 0.6 s.
- Limbs never pass through the torso: arm angles outwards are never below 0.04, and leg swing is clamped to ±1.3 except in the sit.
- A held thing follows the right hand: its box sits 0.04 below the arm box's lower end.
- Faces by event: a crash, a shot or a siren within 40 m gives shocked for 1.5 s; a horn at close range gives angry for 1 s; Mags's Bus Driver Voice freezes people for 5 s in their current pose with shocked faces and both arms at -0.3; being filmed by five people or more makes Teo happy.
- Crowd dancers within 30 m share one beat phase, so a flash mob of 150 moves as one.
- With "reduce motion" on, nothing here changes: these are world animations, not camera effects. The Blood setting changes no pose either; it only swaps one particle (`vfx.md`).
- Down bodies are never shown in close-up: the camera does not cut to them, and photo mode's free camera stays 2 m away. At most 6 are kept on `low` and 12 on `high`; the oldest is removed first.
- The ambulance crew are two people in the `paramedic` look. They walk to the body, stand over it for 4 s, carry it on a stretcher box 1.9×0.1×0.6 to the open rear doors, and drive off.

## New names

- Atlas: "the people atlas" and its cell numbers. Limb and shirt cell names.
- Hair ids, hat ids, bag ids and the look ids in the tables above, with `paramedic` and `crew` added for the lethal game.
- Pose names: death fall, down, flinch, cover, hands up.
- No new people, places or brands.
