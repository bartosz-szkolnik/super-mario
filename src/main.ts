import { Camera } from './camera';
import { EntityFactory, loadEntities } from './entities';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers/collision';
import { createDashboardLayer } from './layers/dashboard';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import { createPlayer, createPlayerEnv } from './player';
import { Timer } from './timer';

export type GameContext = {
  readonly audioContext: AudioContext;
  readonly entityFactory: EntityFactory;
  deltaTime: number | null;
};

async function main(context: CanvasRenderingContext2D) {
  const audioContext = new AudioContext();
  const [entityFactory, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = createPlayer(entityFactory.mario());

  const playerEnv = createPlayerEnv(mario);
  level.addEntity(playerEnv);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const gameContext: GameContext = {
    audioContext,
    entityFactory,
    deltaTime: null,
  };

  level.addLayer(createCollisionLayer(level));
  level.addLayer(createDashboardLayer(font, playerEnv));

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    gameContext.deltaTime = deltaTime;
    level.update(gameContext);
    camera.pos.x = Math.max(0, mario.pos.x - 100);
    level.draw(context!, camera);
  });

  timer.start();
  level.musicController.player?.playTrack('main');
}

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

function start() {
  window.removeEventListener('click', start);
  main(context!);
}

window.addEventListener('click', start);
