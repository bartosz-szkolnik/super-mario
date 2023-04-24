import { Compositor } from './compositor';
import { createMario } from './entities';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { loadLevel } from './loaders';
import { loadBackgroundSprites } from './sprites';
import { Timer } from './timer';

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

Promise.all([createMario(), loadBackgroundSprites(), loadLevel('1-1')]).then(([mario, backgroundSprites, level]) => {
  const gravity = 30;
  mario.pos.set(64, 180);
  mario.vel.set(200, -600);

  const compositor = new Compositor();

  const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
  compositor.addLayer(backgroundLayer);

  const spriteLayer = createSpriteLayer(mario);
  compositor.addLayer(spriteLayer);

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    compositor.draw(context!);
    mario.update(deltaTime);
    mario.vel.y += gravity;
  });

  timer.start();
});
