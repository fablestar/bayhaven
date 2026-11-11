// The lifeguard huts: day 1's hut, eleven times along the beach, each in its own colours.
import { lifeguardHut } from '../gen/kit.js';

export default {
  id: 'lifeguard-hut',
  build(o, lot) { lifeguardHut(o, (lot.x0 + lot.x1) / 2, 63, lot.wall, lot.roof); },
};
