import { createMario } from './entities';
import { setupKeyboard } from './input';
// import { createCollisionLayer } from './layers';
import { loadLevel } from './loaders';
import { Timer } from './timer';

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

Promise.all([createMario(), loadLevel('1-1')]).then(([mario, level]) => {
  mario.pos.set(64, 80);
  level.addEntity(mario);

  // const layer = createCollisionLayer(level);
  // level.addLayer(layer);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  // ['mousedown', 'mousemove'].forEach(eventName => {
  //   canvas.addEventListener(eventName, event => {
  //     const e = event as MouseEvent;
  //     if (e.buttons === 1) {
  //       mario.vel.set(0, 0);
  //       mario.pos.set(e.offsetX, e.offsetY);
  //     }
  //   });
  // });

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    level.update(deltaTime);
    level.draw(context!);
  });

  timer.start();
});
