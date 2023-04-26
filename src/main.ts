import { Camera } from './camera';
import { setupMouseControl } from './debug';
import { createMario } from './entities';
import { setupKeyboard } from './input';
import { createCameraLayer, createCollisionLayer } from './layers';
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
  const camera = new Camera();

  mario.pos.set(64, 80);
  level.addEntity(mario);

  level.addLayer(createCollisionLayer(level));
  level.addLayer(createCameraLayer(camera));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  setupMouseControl(canvas, mario, camera);

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    level.update(deltaTime);
    level.draw(context!, camera);
  });

  timer.start();
});
