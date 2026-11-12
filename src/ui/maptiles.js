// What the minimap and the map screen share: the tile cache, the world painter and the blip icons.
// A tile is one chunk (160 m) on a 64 px canvas, drawn the first time it is needed from the land
// mask (map.surfaceAt, map.depthAt), the lots and the road pieces, then reused; at most 400 are
// kept (plan/bible/tech/algorithms.md section 10). Colours are the map screen's from
// plan/bible/art/ui-kit.md section 3. Reads the map through its contract only.

export const COL = { water: '#0e5fa8', shallows: '#35c8c8', sand: '#f2ddb0', land: '#dccb9c', block: '#d6cdc4', building: '#b7b0b8',
  road: '#3b3946', park: '#3fb86a', ink: '#150f3d', pink: '#ff4fa8', cyan: '#29e6ff', mango: '#ffa02e', mint: '#5dff9b', violet: '#b46bff' };
const rgb = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
const RGB = { water: rgb(COL.water), shallows: rgb(COL.shallows), sand: rgb(COL.sand), dirt: rgb(COL.land), sidewalk: rgb(COL.block), road: rgb(COL.road) };
const PX = 64, MAX = 400;

export function createTiles(map) {
  const cache = new Map(), flat = new Map();
  const parks = [];
  for (const zn of map.zones) for (const id in zn.landmarks) if (/park/.test(id)) { const l = zn.landmarks[id]; parks.push({ x0: l.x - l.w / 2, x1: l.x + l.w / 2, z0: l.z - l.d / 2, z1: l.z + l.d / 2 }); }
  const stats = { built: 0, ms: 0, evicted: 0 };

  function kindAt(x, z) {
    const s = map.surfaceAt(x, z);
    return s === 'water' ? (map.depthAt(x, z) < 1.2 ? 'shallows' : 'water') : s;
  }
  // a chunk with no district in it is one colour, or two either side of the shore: no canvas needed
  function flatColour(cx, cz, r) {
    const k = cx + cz * 64;
    if (flat.has(k)) return flat.get(k);
    let v = null;
    if (!map.roadsInChunk(cx, cz).length && !map.lotsInChunk(cx, cz).length) {
      const a = kindAt(r.x0 + 1, r.z0 + 1);
      v = [[r.x1 - 1, r.z0 + 1], [r.x0 + 1, r.z1 - 1], [r.x1 - 1, r.z1 - 1], [(r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2]].every(([x, z]) => kindAt(x, z) === a) ? COL[a === 'dirt' ? 'land' : a] : null;
    }
    flat.set(k, v);
    return v;
  }
  function build(cx, cz, r) {
    const t0 = performance.now(), c = document.createElement('canvas'); c.width = c.height = PX;
    const g = c.getContext('2d'), img = g.createImageData(PX, PX), d = img.data, step = map.chunk / PX;
    for (let j = 0, o = 0; j < PX; j++) for (let i = 0; i < PX; i++, o += 4) {
      const col = RGB[kindAt(r.x0 + (i + 0.5) * step, r.z0 + (j + 0.5) * step)] || RGB.dirt;
      d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    g.setTransform(1 / step, 0, 0, 1 / step, -r.x0 / step, -r.z0 / step);
    g.fillStyle = COL.park;
    for (const p of parks) if (p.x0 < r.x1 && p.x1 > r.x0 && p.z0 < r.z1 && p.z1 > r.z0) g.fillRect(p.x0, p.z0, p.x1 - p.x0, p.z1 - p.z0);
    g.fillStyle = COL.building;
    for (const l of map.lotsInChunk(cx, cz)) { const b = l.body; if (b && !l.reserved) g.fillRect(b.x0, b.z0, b.x1 - b.x0, b.z1 - b.z0); }
    stats.built++; stats.ms = performance.now() - t0;
    return c;
  }
  function tile(cx, cz, r) {
    const k = cx + cz * 64, hit = cache.get(k);
    if (hit) { cache.delete(k); cache.set(k, hit); return hit; }       // newest last, so the oldest is dropped first
    const c = build(cx, cz, r);
    cache.set(k, c);
    if (cache.size > MAX) { cache.delete(cache.keys().next().value); stats.evicted++; }
    return c;
  }

  const tiles = {
    stats, get count() { return cache.size; },
    // Paint the world round (x, z), `rx` and `rz` metres each way. `g` already maps metres to pixels and
    // `scale` says how many pixels a metre is. New tiles stop being made after `budget` ms; the
    // return value is how many are still owed, so the caller can paint again next frame.
    paint(g, x, z, rx, rz, scale, explored, budget = 4) {
      const a = map.chunkOf(x - rx, z - rz), b = map.chunkOf(x + rx, z + rz), t0 = performance.now();
      let owed = 0;
      g.imageSmoothingEnabled = true;
      for (let cz = a.cz; cz <= b.cz; cz++) for (let cx = a.cx; cx <= b.cx; cx++) {
        const r = map.chunkRect(cx, cz), inW = map.inWorld(cx, cz), f = inW ? flatColour(cx, cz, r) : COL.water;
        if (f) { g.fillStyle = f; g.fillRect(r.x0 - 0.3, r.z0 - 0.3, 160.6, 160.6); continue; }
        const k = cx + cz * 64;
        if (!cache.has(k) && performance.now() - t0 > budget) { owed++; g.fillStyle = COL.land; g.fillRect(r.x0 - 0.3, r.z0 - 0.3, 160.6, 160.6); continue; }
        g.drawImage(tile(cx, cz, r), r.x0 - 0.3, r.z0 - 0.3, 160.6, 160.6);
      }
      // close up, a 64 px tile is soft: the roads are drawn again as lines (the expressway edged in mango)
      if (scale > 0.6) {
        g.lineCap = 'butt';
        for (const edge of [true, false]) {
          for (let cz = a.cz; cz <= b.cz; cz++) for (let cx = a.cx; cx <= b.cx; cx++) for (const p of map.roadsInChunk(cx, cz)) {
            if (edge && p.kind !== 'expressway') continue;
            g.strokeStyle = edge ? COL.mango : COL.road; g.lineWidth = p.width + (edge ? 6 : 0);
            g.beginPath(); g.moveTo(p.ax, p.az); g.lineTo(p.bx, p.bz); g.stroke();
          }
        }
      }
      // a district nobody has been to yet is there, faintly
      g.fillStyle = 'rgba(21, 15, 61, .6)';
      for (const zn of map.zones) if (!explored.has(zn.id)) { const q = zn.bounds; g.fillRect(q.x0, q.z0, q.x1 - q.x0, q.z1 - q.z0); }
      return owed;
    },
  };
  return tiles;
}

// Blip icons: canvas paths on a 24-unit grid (plan/bible/art/ui-kit.md section 5), so every kind
// has its own outline as well as its own colour. 'F' fills, 'S' strokes.
const P = (d) => new Path2D(d);
const ICONS = {
  player: [['F', 'M12 2 L21 21 L12 16 L3 21 Z']],
  waypoint: [['F', 'M12 23 C5 14 4 11 4 8.5 A8 8 0 0 1 20 8.5 C20 11 19 14 12 23 Z M12 5.5 A3 3 0 1 0 12 11.5 A3 3 0 1 0 12 5.5 Z']],
  mission: [['F', 'M3 4 H21 V20 H3 Z M14 6 V11 H19 V6 Z M6 13 V15 H18 V13 Z M6 16.5 V18 H14 V16.5 Z M6 7 V10 H11 V7 Z']],
  drop: [['F', 'M3 3 H21 V8 H3 Z'], ['S', 'M4 8 V21 H20 V8 M10 12.5 L12.5 11 V18']],
  house: [['F', 'M12 2 L23 12 H19 V22 H14 V15 H10 V22 H5 V12 H1 Z']],
  wrench: [['S', 'M5 20 L14 11'], ['F', 'M17 2 A6 6 0 1 0 22 7 L18 9 L15 6 Z']],
  clothes: [['S', 'M12 8 L22 18 H2 Z M12 8 V6 A2.5 2.5 0 1 0 9.5 3.5']],
  umbrella: [['F', 'M2 12 A10 10 0 0 1 22 12 Z'], ['S', 'M12 12 V20 A2.5 2.5 0 0 1 7 20']],
  carwash: [['S', 'M3 21 V17 A9 7 0 0 1 21 17 V21 M6 4 V8 M12 2 V7 M18 4 V8']],
  food: [['F', 'M5 7 H19 L17 22 H7 Z'], ['S', 'M4 5 H20 M13 5 L15 1']],
  marina: [['S', 'M2 17 A10 6 0 0 0 22 17 Z M11 17 V2'], ['F', 'M12.5 3 L20 14 H12.5 Z']],
  taxi: [['F', 'M2 12 H22 V19 H2 Z M9 5 H15 V9 H9 Z'], ['S', 'M5 12 L7 9 H17 L19 12']],
  landmark: [['F', 'M12 1 L22 12 L12 23 L2 12 Z M12 8 L8 12 L12 16 L16 12 Z']],
  dot: [['F', 'M12 5 A7 7 0 1 0 12 19 A7 7 0 1 0 12 5 Z']],
};
const paths = {};
export const iconIds = Object.keys(ICONS);
// which icon and colour a place of each kind gets
export const PLACE = { garage: ['wrench', COL.cyan], property: ['house', COL.mint], 'shop:clothes': ['clothes', COL.violet], 'shop:thrift': ['clothes', COL.violet],
  'shop:storm': ['umbrella', COL.cyan], carwash: ['carwash', '#ffffff'], food: ['food', COL.mango], marina: ['marina', '#ffffff'], taxi: ['taxi', '#ffe14d'],
  mission: ['mission', COL.mango], scrap: ['wrench', COL.mango] };

// draw icon `id`, `size` px across and centred on (x, y), in `colour` on an ink outline
export function drawIcon(g, id, x, y, size, colour, rot = 0) {
  const parts = paths[id] || (paths[id] = (ICONS[id] || ICONS.dot).map(([how, d]) => [how, P(d)]));
  const k = size / 24;
  g.save();
  g.translate(x, y); if (rot) g.rotate(rot);
  g.scale(k, k); g.translate(-12, -12);
  g.lineJoin = g.lineCap = 'round';
  g.strokeStyle = COL.ink; g.lineWidth = 3 / Math.max(k, 0.5) + 2;
  for (const [how, p] of parts) { if (how === 'S') g.lineWidth += 2; g.stroke(p); if (how === 'S') g.lineWidth -= 2; }
  g.fillStyle = g.strokeStyle = colour; g.lineWidth = 2.4;
  for (const [how, p] of parts) { if (how === 'F') g.fill(p, 'evenodd'); else g.stroke(p); }
  g.restore();
}

// for the checks: read a canvas back through a scratch canvas made for reading
let scratch = null;
export function readBack(canvas, x = 0, y = 0, w = canvas.width, h = canvas.height) {
  if (!scratch) scratch = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  scratch.canvas.width = w; scratch.canvas.height = h;
  scratch.clearRect(0, 0, w, h); scratch.drawImage(canvas, -x, -y);
  return scratch.getImageData(0, 0, w, h).data;
}
// how many clearly different colours a canvas shows (12 bits a colour, a dozen samples or more each)
export function countColours(canvas, stride) {
  if (!canvas || !canvas.width) return 0;
  const d = readBack(canvas), seen = new Map();
  for (let i = 0; i < d.length; i += 4 * stride) if (d[i + 3] > 250) { const k = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | d[i + 2] >> 4; seen.set(k, (seen.get(k) || 0) + 1); }
  let n = 0; for (const v of seen.values()) if (v >= 12) n++;
  return n;
}
