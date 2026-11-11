// The lane graph and sidewalks, from the map's roads (see nav.js). Public object: the nav contract.
import { createNav } from './nav.js';

export default { name: 'nav', order: 13, needs: ['map'], init: (ctx) => createNav(ctx.modules.map) };
