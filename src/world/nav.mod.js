// STAND-IN: the day 1 streets as a lane graph (see nav.js). Public object: the nav contract,
// with laneNear, lane, next, lanesInChunk and route working and the walking calls empty.
import { createNav } from './nav.js';

export default { name: 'nav', order: 13, init: () => createNav() };
