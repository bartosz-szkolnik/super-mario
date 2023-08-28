import { EntityFactory, loadEntities } from './entities';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers/collision';
import { createDashboardLayer } from './layers/dashboard';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import { createPlayer, createPlayerEnv } from './player';
import { SceneRunner } from './scene-runner';
import { Timer } from './timer';
import { Player } from './traits';

export type GameContext = {
  readonly videoContext: CanvasRenderingContext2D;
  readonly audioContext: AudioContext;
  readonly entityFactory: EntityFactory;
  deltaTime: number | null;
};

async function main(videoContext: CanvasRenderingContext2D) {
  const audioContext = new AudioContext();
  const [entityFactory, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const level = await loadLevel('1-2');

  const mario = createPlayer(entityFactory.mario());
  mario.get(Player).name = 'MARIO';
  level.addEntity(mario);

  const playerEnv = createPlayerEnv(mario);
  level.addEntity(playerEnv);

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);
  sceneRunner.addScene(level);

  const gameContext: GameContext = {
    videoContext,
    audioContext,
    entityFactory,
    deltaTime: null,
  };

  level.addLayer(createCollisionLayer(level));
  level.addLayer(createDashboardLayer(font, level));

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  });

  timer.start();
  sceneRunner.runNext();
}

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

window.addEventListener('click', () => main(context), { once: true });
