// When he is on foot and the car he left is still rolling (a bail-out), the car needs the walls
// near it, not the walls near him. modules.world keeps only the boxes round state.player, so this
// asks it for the ones round the car, after the world's own update and before the vehicles'.
export default {
  name: 'loosecar', order: 12, needs: ['world'],
  update(dt, ctx) {
    const m = ctx.modules, car = m.vehicles && m.vehicles.player;
    if (!car || ctx.state.player.mode !== 'foot' || !m.world.refresh) return;
    if (Math.hypot(car.vf, car.vl) > 0.3) m.world.refresh(car.x, car.z);
  },
};
