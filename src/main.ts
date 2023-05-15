import { Camera } from './camera';
import { loadEntities } from './entities';
import { PlayerController } from './entities/player-controller';
import { Entity } from './entity';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers/collision';
import { createDashboardLayer } from './layers/dashboard';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import { Timer } from './timer';

function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.checkpoint.set(64, 64);

  playerController.setPlayer(playerEntity);
  playerEnv.addTrait(playerController);

  return playerEnv;
}

async function main(context: CanvasRenderingContext2D) {
  const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);
  const loadLevel = createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();

  const playerEnv = createPlayerEnv(mario);
  level.addEntity(playerEnv);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  level.addLayer(createCollisionLayer(level));
  level.addLayer(createDashboardLayer(font, playerEnv));

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    level.update(deltaTime);
    camera.pos.x = Math.max(0, mario.pos.x - 100);
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
