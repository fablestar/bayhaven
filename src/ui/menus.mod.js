// Menus are page elements over the game (the HUD is the canvas under them). This file owns the
// pause card and its pages: settings and the controls list. Esc opens and closes it; on touch the
// pause button in touch.mod.js does. Time stops while a menu is open.
// Public object: open(id) · close() · back() · isOpen · current · register({ id, title, build(page, menus) }).
// Owns state.settings and state.ui.paused. Emits menu:opened { id }, menu:closed, settings:changed { key, value }.
import { wordmarkCanvas, WORDMARK_ASPECT } from './wordmark.js';
import { MENU_CSS, CONTROLS } from './menus-data.js';

const STORE = 'bayhaven.settings';
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

let tick = () => {};
export default {
  name: 'menus', order: 74,
  init(ctx) {
    const S = ctx.state, set = S.settings, ev = ctx.events;
    if (set.master === undefined) set.master = 1;
    if (set.sprintToggle === undefined) set.sprintToggle = false;
    if (set.blood === undefined) set.blood = true;
    if (!ctx.params.get('test')) {
      try { const kept = JSON.parse(localStorage.getItem(STORE) || '{}'); for (const k of ['master', 'music', 'sfx', 'reduceMotion', 'sprintToggle', 'blood']) if (k in kept) set[k] = kept[k]; } catch { /* a broken store is ignored */ }
    }
    const style = el('style'); style.textContent = MENU_CSS; document.head.appendChild(style);
    const veil = el('div'); veil.id = 'menu-veil';
    const card = el('div'); card.id = 'menu-card'; card.setAttribute('role', 'dialog');
    veil.appendChild(card); document.body.appendChild(veil);

    const pages = {}, stack = [];
    let wasScale = 1;
    function change(key, value) {
      set[key] = value;
      if (!ctx.params.get('test')) { try { localStorage.setItem(STORE, JSON.stringify({ master: set.master, music: set.music, sfx: set.sfx, reduceMotion: set.reduceMotion, sprintToggle: set.sprintToggle, blood: set.blood })); } catch { /* private mode */ } }
      ev.emit('settings:changed', { key, value });
    }

    // the pieces a page is built from
    const kit = {
      title(page, text) { page.appendChild(el('h2', 'menu-title', text)); },
      row(page, text, fn) {
        const b = el('button', 'menu-row', text); b.type = 'button';
        b.addEventListener('click', fn); page.appendChild(b); return b;
      },
      slider(page, text, key) {
        const row = el('label', 'menu-set'); row.appendChild(el('span', '', text));
        const input = el('input'); input.type = 'range'; input.min = 0; input.max = 100; input.step = 5; input.value = Math.round(set[key] * 100);
        const out = el('b', '', input.value);
        input.addEventListener('input', () => { out.textContent = input.value; change(key, input.value / 100); });
        row.appendChild(input); row.appendChild(out); page.appendChild(row); return input;
      },
      toggle(page, text, key, onText = 'On', offText = 'Off') {
        const b = el('button', 'menu-set'); b.type = 'button'; b.appendChild(el('span', '', text));
        const word = el('b'), sw = el('i', 'menu-switch'); b.appendChild(word); b.appendChild(sw);
        const show = () => { b.classList.toggle('on', !!set[key]); b.setAttribute('aria-pressed', !!set[key]); word.textContent = set[key] ? onText : offText; };
        b.addEventListener('click', () => { change(key, !set[key]); show(); });
        show(); page.appendChild(b); return b;
      },
      choice(page, text, options, get, pick) {
        const row = el('div', 'menu-set'); row.appendChild(el('span', '', text));
        const group = el('div', 'menu-choice');
        const show = () => { for (const b of group.children) b.classList.toggle('on', b.dataset.value === get()); };
        for (const [value, label] of options) {
          const b = el('button', '', label); b.type = 'button'; b.dataset.value = value;
          b.addEventListener('click', () => { pick(value); show(); }); group.appendChild(b);
        }
        show(); row.appendChild(group); page.appendChild(row); return group;
      },
    };

    function show(id) {
      const def = pages[id];
      card.textContent = '';
      if (id === 'pause') {
        const mark = wordmarkCanvas(128); mark.className = 'menu-mark';
        mark.style.height = '64px'; mark.style.width = Math.round(64 * WORDMARK_ASPECT) + 'px';
        mark.setAttribute('role', 'img'); mark.setAttribute('aria-label', 'Bayhaven');
        card.appendChild(mark);
      } else kit.title(card, def.title);
      def.build(card, menus, kit);
      if (id !== 'pause') kit.row(card, 'Back', () => menus.back());
      card.dataset.page = id; card.scrollTop = 0;
      const first = card.querySelector('button, input'); if (first) first.focus({ preventScroll: true });
    }
    const menus = {
      kit,
      get isOpen() { return stack.length > 0; },
      get current() { return stack[stack.length - 1] || null; },
      register(def) { pages[def.id] = def; },
      open(id) {
        if (!pages[id]) return false;
        if (!stack.length) {
          wasScale = ctx.loop.timeScale || 1; ctx.loop.timeScale = 0; S.ui.paused = true;
          document.body.classList.add('menu-open'); veil.classList.add('on');
        }
        stack.push(id); show(id);
        ev.emit('menu:opened', { id });
        return true;
      },
      back() { if (stack.length > 1) { stack.pop(); show(menus.current); } else menus.close(); },
      close() {
        if (!stack.length) return;
        stack.length = 0;
        ctx.loop.timeScale = wasScale; S.ui.paused = false;
        document.body.classList.remove('menu-open'); veil.classList.remove('on');
        card.textContent = '';
        ev.emit('menu:closed');
      },
    };

    menus.register({ id: 'pause', title: 'Paused', build(page) {
      kit.row(page, 'Resume', () => menus.close());
      if (pages.map) kit.row(page, 'Map', () => menus.open('map'));
      kit.row(page, 'Settings', () => menus.open('settings'));
      kit.row(page, 'Controls', () => menus.open('controls'));
      const save = kit.row(page, 'Save', () => { const ok = ctx.save.write('auto'); save.textContent = ok ? 'Saved' : 'Could not save'; });
    } });
    menus.register({ id: 'settings', title: 'Settings', build(page) {
      kit.choice(page, 'Quality', [['auto', 'Auto'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High']], () => set.quality,
        (v) => { ctx.quality.set(v === 'auto' ? (ctx.quality.coarse ? 'low' : 'high') : v); change('quality', v); });
      kit.slider(page, 'Master volume', 'master');
      kit.slider(page, 'Music volume', 'music');
      kit.slider(page, 'Effects volume', 'sfx');
      kit.toggle(page, 'Reduce motion', 'reduceMotion');
      kit.toggle(page, 'Sprint', 'sprintToggle', 'Tap to toggle', 'Hold');
      kit.toggle(page, 'Blood', 'blood');
    } });
    menus.register({ id: 'controls', title: 'Controls', build(page) {
      const touch = window.matchMedia('(pointer: coarse)').matches, list = el('dl', 'menu-keys');
      for (const [what, keys, taps] of CONTROLS) {
        const how = touch ? taps : keys;
        if (!how) continue;
        list.appendChild(el('dt', '', what)); list.appendChild(el('dd', '', how));
      }
      page.appendChild(list);
    } });

    // Esc opens the pause card, steps back a page, and closes it. Arrows move between rows.
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') { e.preventDefault(); if (menus.isOpen) menus.back(); else menus.open('pause'); return; }
      if (!menus.isOpen) return;
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
        const rows = [...card.querySelectorAll('button, input')], i = rows.indexOf(document.activeElement);
        const next = rows[(i + (e.code === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length];
        if (next) next.focus();
        e.preventDefault();
      }
      e.stopPropagation();          // the game's own keys rest while a menu is up
    }, true);
    veil.addEventListener('pointerdown', (e) => { if (e.target === veil) menus.close(); });

    // "Sprint: tap to toggle": a tap on Shift latches the sprint hold until the next tap
    let latched = false;
    const hold = () => { if (latched && set.sprintToggle) ctx.input.down.sprint = true; };
    window.addEventListener('keydown', (e) => {
      if (!set.sprintToggle || e.repeat || menus.isOpen || (e.code !== 'ShiftLeft' && e.code !== 'ShiftRight')) return;
      latched = !latched;
      if (!latched) ctx.input.down.sprint = false;
    });
    window.addEventListener('keyup', hold);
    ev.on('settings:changed', ({ key }) => { if (key === 'sprintToggle') { latched = false; ctx.input.down.sprint = false; } });
    ev.on('vehicle:entered', () => { if (latched) { latched = false; ctx.input.down.sprint = false; } });
    tick = hold;
    menus.sprintLatched = () => latched;
    return menus;
  },
  update() { tick(); },
};
