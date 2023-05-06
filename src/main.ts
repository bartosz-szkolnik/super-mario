import { Camera } from './camera';
import { loadEntities } from './entities';
import { setupKeyboard } from './input';
import { createLevelLoader } from './loaders/level';
import { Timer } from './timer';

async function main(context: CanvasRenderingContext2D) {
  const entityFactory = await loadEntities();
  const loadLevel = createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();

  mario.pos.set(64, 80);
  level.addEntity(mario);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    level.update(deltaTime);

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.draw(context!, camera);
  });

  timer.start();
}

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

main(context);
