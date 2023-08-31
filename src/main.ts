import { TimedScene } from './timed-scene';
import { EntityFactories, loadEntities } from './entities';
import type { Entity } from './entity';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers/collision';
import { createColorLayer } from './layers/color';
import { createDashboardLayer } from './layers/dashboard';
import { createPlayerProgressLayer } from './layers/player-progress';
import { Level } from './level';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import { bootstrap, findPlayers, makePlayer } from './player';
import { SceneRunner } from './scene-runner';
import { Timer } from './timer';
import type { LevelSpec } from './types';
import { Scene } from './scene';
import { createTextLayer } from './layers/text';

export type GameContext = {
  readonly videoContext: CanvasRenderingContext2D;
  readonly audioContext: AudioContext;
  readonly entityFactories: EntityFactories;
  deltaTime: number | null;
  tick: number;
};

async function main(videoContext: CanvasRenderingContext2D) {
  const audioContext = new AudioContext();
  const [entityFactories, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = createLevelLoader(entityFactories);
  const sceneRunner = new SceneRunner();

  const mario = entityFactories.mario();
  makePlayer(mario, 'MARIO');

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name: string) {
    const loadScreen = new Scene();
    loadScreen.addLayer(createColorLayer('#000'));
    loadScreen.addLayer(createTextLayer(font, `Loading ${name}...`));
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);
    bootstrap(mario, level);

    level.events.listen(
      Level.EVENT_TRIGGER,
      (spec: LevelSpec['triggers'][0], _trigger: Entity, touches: Set<Entity>) => {
        if (spec.type === 'GOTO') {
          for (const _entity of findPlayers(touches)) {
            runLevel(spec.name);
            return;
          }
        }
      },
    );

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    const waitScreen = new TimedScene();
    waitScreen.addLayer(createColorLayer('#000'));
    waitScreen.addLayer(dashboardLayer);
    waitScreen.addLayer(playerProgressLayer);
    sceneRunner.addScene(waitScreen);

    level.addLayer(createCollisionLayer(level));
    level.addLayer(dashboardLayer);
    sceneRunner.addScene(level);

    sceneRunner.runNext();
  }

  const gameContext: GameContext = {
    videoContext,
    audioContext,
    entityFactories,
    deltaTime: null,
    tick: 0,
  };

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
    gameContext.tick++;
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  });

  timer.start();
  runLevel('debug-progression');
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
