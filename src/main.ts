import { Camera } from './camera';
import { loadEntities } from './entities';
import { setupKeyboard } from './input';
import { loadLevel } from './loaders/level';
import { Timer } from './timer';

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

Promise.all([loadEntities(), loadLevel('1-1')]).then(([entity, level]) => {
  const camera = new Camera();

  const mario = entity.mario();

  mario.pos.set(64, 80);
  level.addEntity(mario);

  const goomba = entity.goomba();
  goomba.pos.x = 220;
  level.entities.add(goomba);

  const koopa = entity.koopa();
  koopa.pos.x = 240;
  level.entities.add(koopa);

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
});
