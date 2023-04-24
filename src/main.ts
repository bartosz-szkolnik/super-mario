import { Compositor } from './compositor';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { loadLevel } from './loaders';
import { loadBackgroundSprites, loadMarioSprites } from './sprites';

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

Promise.all([loadMarioSprites(), loadBackgroundSprites(), loadLevel('1-1')]).then(
  ([marioSprite, backgroundSprites, level]) => {
    const compositor = new Compositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    compositor.addLayer(backgroundLayer);

    const pos = {
      x: 64,
      y: 64,
    };

    const spriteLayer = createSpriteLayer(marioSprite, pos);
    compositor.addLayer(spriteLayer);

    function update() {
      compositor.draw(context!);
      pos.x += 2;
      pos.y += 2;

      // requestAnimationFrame(update);
    }

    update();
  },
);
