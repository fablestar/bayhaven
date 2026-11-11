// The pause card's look and the controls list. Sizes from plan/bible/art/ui-kit.md section 3:
// card 520 wide (340 on a phone), ink at 85%, radius 24, rows 56 (48), a cyan bar on the focused row.
// No text is under 14 px.

// [what, keyboard and mouse, touch]: only what works in today's build
export const CONTROLS = [
  ['Steer, walk', 'WASD or arrows', 'The arrow buttons in a car, the left stick on foot'],
  ['Gas, brake', 'W, S', 'Gas and Brake'],
  ['Handbrake', 'Space', 'Handbrake'],
  ['Get in, get out', 'F', 'Get in, Get out'],
  ['Sprint', 'Shift', 'Sprint'],
  ['Jump', 'Space', 'Jump'],
  ['Horn', 'H', 'Horn'],
  ['Look around', 'Drag with the mouse', 'Drag on the right side'],
  ['Look back', 'Hold B', 'Look back'],
  ['Camera', 'C', 'Camera'],
  ['Skip time', 'T', ''],
  ['Mute', 'M', ''],
  ['Back to the start', 'R', ''],
  ['Pause', 'Esc', 'The pause button'],
];

export const MENU_CSS = `
#menu-veil { position: fixed; inset: 0; z-index: 40; display: none; align-items: center; justify-content: center;
  background: rgba(21, 15, 61, .35); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  padding: max(12px, var(--st, 0px)) max(12px, var(--sr, 0px)) max(12px, var(--sb, 0px)) max(12px, var(--sl, 0px)); box-sizing: border-box; }
#menu-veil.on { display: flex; }
#menu-card { width: 520px; max-width: 100%; max-height: 100%; overflow-y: auto; box-sizing: border-box; padding: 20px 0 16px;
  background: rgba(21, 15, 61, .85); border-radius: 24px; color: #fff; touch-action: pan-y; -webkit-user-select: none; user-select: none;
  font-family: "Trebuchet MS", "Segoe UI", system-ui, sans-serif; }
.menu-mark { display: block; margin: 0 auto 10px; max-width: 86%; }
.menu-title { margin: 0 28px 8px; font-size: 26px; font-style: italic; font-weight: 800; color: #ff4fa8; text-shadow: 2px 2px 0 rgba(41, 230, 255, .6); }
.menu-row, .menu-set { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 56px; box-sizing: border-box; margin: 0; padding: 0 28px;
  border: 0; border-left: 6px solid transparent; background: none; color: #fff; text-align: left; font-family: inherit; cursor: pointer;
  transition: transform .12s, color .12s; }
.menu-row { font-size: 22px; font-style: italic; font-weight: 800; }
.menu-set { font-size: 17px; }
.menu-set > span { flex: 1; }
.menu-set > b { font-weight: 700; font-size: 15px; opacity: .85; min-width: 30px; text-align: right; }
.menu-row:focus-visible, .menu-row:hover, .menu-set:focus-visible, .menu-set:focus-within { outline: none; border-left-color: #29e6ff; color: #29e6ff; transform: translateX(8px); }
.menu-set input[type=range] { -webkit-appearance: none; appearance: none; width: 42%; height: 22px; background: none; margin: 0; }
.menu-set input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: rgba(255, 255, 255, .3); }
.menu-set input[type=range]::-moz-range-track { height: 6px; border-radius: 3px; background: rgba(255, 255, 255, .3); }
.menu-set input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: #29e6ff; border: 0; }
.menu-set input[type=range]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #29e6ff; border: 0; }
.menu-set input[type=range]:focus-visible { outline: 2px solid #29e6ff; outline-offset: 4px; border-radius: 6px; }
.menu-switch { flex: none; width: 44px; height: 24px; border-radius: 12px; background: rgba(255, 255, 255, .3); position: relative; transition: background .12s; }
.menu-switch::after { content: ""; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform .12s; }
.menu-set.on .menu-switch { background: #29e6ff; }
.menu-set.on .menu-switch::after { transform: translateX(20px); background: #150f3d; }
.menu-choice { display: flex; flex: none; }
.menu-choice button { min-height: 36px; padding: 0 12px; border: 0; background: rgba(255, 255, 255, .16); color: #fff; font: inherit; font-size: 15px; cursor: pointer; }
.menu-choice button:first-child { border-radius: 18px 0 0 18px; }
.menu-choice button:last-child { border-radius: 0 18px 18px 0; }
.menu-choice button.on { background: #29e6ff; color: #150f3d; font-weight: 700; }
.menu-choice button:focus-visible { outline: 2px solid #fff; outline-offset: -2px; }
.menu-keys { display: grid; grid-template-columns: auto 1fr; gap: 6px 18px; margin: 4px 34px 10px; font-size: 15px; line-height: 1.35; }
.menu-keys dt { opacity: .75; }
.menu-keys dd { margin: 0; font-weight: 700; }
@media (max-width: 600px), (max-height: 500px) {
  #menu-card { width: 340px; padding: 12px 0 10px; }
  .menu-row, .menu-set { min-height: 48px; padding: 0 20px; }
  .menu-row { font-size: 16px; }
  .menu-set { font-size: 15px; }
  .menu-set > b { font-size: 14px; }
  .menu-title { font-size: 20px; margin: 0 22px 4px; }
  .menu-choice button { min-height: 40px; padding: 0 9px; font-size: 14px; }
  .menu-keys { font-size: 14px; margin: 4px 26px 8px; }
  .menu-mark { height: 48px !important; width: auto !important; }
}
@media (prefers-reduced-motion: reduce) { .menu-row, .menu-set { transition: none; } }
`;
