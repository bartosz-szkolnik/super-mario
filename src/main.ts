import { CompositionScene } from './composition-scene';
import { EntityFactory, loadEntities } from './entities';
import type { Entity } from './entity';
import { setupKeyboard } from './input';
import { createCollisionLayer } from './layers/collision';
import { createColorLayer } from './layers/color';
import { createDashboardLayer } from './layers/dashboard';
import { createPlayerProgressLayer } from './layers/player-progress';
import { Level } from './level';
import { loadFont } from './loaders/font';
import { createLevelLoader } from './loaders/level';
import { createPlayer, createPlayerEnv } from './player';
import { SceneRunner } from './scene-runner';
import { Timer } from './timer';
import { Player } from './traits';
import type { LevelSpec } from './types';

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

  const mario = createPlayer(entityFactory.mario());
  mario.get(Player).name = 'MARIO';

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name: string) {
    const level = await loadLevel(name);

    level.events.listen(
      Level.EVENT_TRIGGER,
      (spec: LevelSpec['triggers'][0], _trigger: Entity, touches: Set<Entity>) => {
        if (spec.type === 'GOTO') {
          for (const entity of touches) {
            if (entity.has(Player)) {
              runLevel(spec.name);
              return;
            }
          }
        }
      },
    );

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    mario.pos.set(0, 0);
    level.addEntity(mario);

    const playerEnv = createPlayerEnv(mario);
    level.addEntity(playerEnv);

    const waitScreen = new CompositionScene();
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
    entityFactory,
    deltaTime: null,
  };

  const timer = new Timer(1 / 60);
  timer.setUpdateFn(deltaTime => {
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
