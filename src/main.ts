import { Compositor } from './compositor';
import { createMario } from './entities';
import { KeyboardState } from './keyboard-state';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { loadLevel } from './loaders';
import { loadBackgroundSprites } from './sprites';
import { Timer } from './timer';
import { Jump } from './traits';

const SPACE_KEY = 'Space';

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

Promise.all([createMario(), loadBackgroundSprites(), loadLevel('1-1')]).then(([mario, backgroundSprites, level]) => {
  const gravity = 2000;
  mario.pos.set(64, 180);

  const compositor = new Compositor();

  const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
  compositor.addLayer(backgroundLayer);

  const input = new KeyboardState();
  input.addMapping(SPACE_KEY, keyState => {
    if (keyState) {
      mario.get(Jump).start();
    } else {
      mario.get(Jump).cancel();
    }
  });
  input.listenTo(window);

  const spriteLayer = createSpriteLayer(mario);
  compositor.addLayer(spriteLayer);

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    mario.update(deltaTime);
    compositor.draw(context!);
    mario.vel.y += gravity * deltaTime;
  });

  timer.start();
});
