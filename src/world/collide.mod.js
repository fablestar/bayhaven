// Collision (see collide.js): the spatial hash every static box lives in. Moving bodies are
// put back into their own grid at the start of each step.
import { createCollide } from './collide.js';

let collide;
export default {
  name: 'collide', order: 10,
  init() { collide = createCollide(); return collide; },
  update() { collide.bodies.refresh(); },
};
