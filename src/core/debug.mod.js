// The debug overlay (?debug): one small canvas, top centre, showing test.stats() live, a graph
// of the last 120 frame times and how long each module's update takes. Keys 1 to 9 switch the
// nine most costly modules off and on, to see what each one costs. Never on in clips.

const W = 420, H = 150, N = 120;
let on = false, g = null, text = '', frames = null, at = 0, slow = [];

export default {
  name: 'debug', order: 95,
  init(ctx) {
    on = ctx.params.has('debug') && !ctx.params.has('clip');
    if (!on) return { on: false, text: () => '' };
    const c = document.createElement('canvas');
    c.id = 'debug'; c.width = W; c.height = H;
    c.style.cssText = 'position:fixed;top:0;left:50%;transform:translateX(-50%);pointer-events:none;z-index:9;opacity:.85';
    document.body.appendChild(c);
    g = c.getContext('2d');
    frames = new Float32Array(N);
    ctx.registry.profile = true;
    window.addEventListener('keydown', (e) => {
      const n = /^Digit[1-9]$/.test(e.code) ? +e.code.slice(5) - 1 : -1;
      if (n >= 0 && slow[n]) ctx.registry.toggle(slow[n].name);
    });
    return { on: true, text: () => text };
  },
  render(alpha, ctx) {
    if (!on) return;
    frames[at] = ctx.loop.frameMs ? Math.min(100, ctx.loop.dt * 1000) : 0; at = (at + 1) % N;
    if (ctx.loop.frame % 6) return;                       // redraw ten times a second at 60 fps
    const s = ctx.test.stats();
    slow = ctx.registry.list().filter((m) => m.name !== 'debug').sort((a, b) => b.ms - a.ms).slice(0, 9);
    const lines = [
      `calls ${s.calls}  tris ${s.tris}  fps ${s.fps.toFixed(0)}  ${s.quality} x${s.pixelRatio}`,
      `sim ${s.simMs.toFixed(2)} ms (p95 ${s.simP95.toFixed(2)}, max ${s.simMax.toFixed(1)})  chunk ${s.chunkMs.toFixed(2)} ms`,
      `chunks ${s.chunks}  cars ${s.cars}  people ${s.peds}  police ${s.cops}  heap ${s.heapMB.toFixed(0)} MB`,
    ];
    text = lines.join(' | ');
    g.clearRect(0, 0, W, H);
    g.fillStyle = 'rgba(21,15,61,.8)'; g.fillRect(0, 0, W, H);
    g.font = '11px monospace'; g.textBaseline = 'top'; g.fillStyle = '#fff';
    lines.forEach((l, i) => g.fillText(l, 6, 4 + i * 13));
    // frame times: the line is 16.7 ms, the top of the strip is 50 ms
    const gy = 78, gh = 30;
    g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(6, gy - gh * 16.7 / 50, N * 2, 1);
    for (let i = 0; i < N; i++) {
      const ms = frames[(at + i) % N], h = Math.min(gh, gh * ms / 50);
      g.fillStyle = ms > 34 ? '#ff5a5a' : ms > 18 ? '#ffc23e' : '#5dff9b';
      g.fillRect(6 + i * 2, gy - h, 2, h);
    }
    // per-module update time, the nine slowest, numbered for the 1 to 9 keys
    slow.forEach((m, i) => {
      const x = 6 + (i % 3) * 138, y = 84 + Math.floor(i / 3) * 21;
      g.fillStyle = m.off ? '#ff5a5a' : '#fff';
      g.fillText(`${i + 1} ${m.name} ${m.off ? 'off' : m.ms.toFixed(2)}`, x, y);
      g.fillStyle = '#29e6ff'; g.fillRect(x, y + 13, Math.min(130, m.ms * 130), 3);
    });
  },
};
