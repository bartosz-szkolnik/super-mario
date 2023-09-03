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
import { bootstrapPlayer, findPlayers, makePlayer, resetPlayer } from './player';
import { SceneRunner } from './scene-runner';
import { Timer } from './timer';
import type { PipePortalPropsSpec, TriggerSpec } from './types';
import { Scene } from './scene';
import { createTextLayer } from './layers/text';
import { Pipe, connectEntity } from './traits';

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

  function createLoadingScreen(name: string) {
    const scene = new Scene();
    scene.addLayer(createColorLayer('#000'));
    scene.addLayer(createTextLayer(font, `Loading ${name}...`));

    return scene;
  }

  async function setupLevel(name: string) {
    const loadingScreen = createLoadingScreen(name);
    sceneRunner.addScene(loadingScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);
    bootstrapPlayer(mario, level);

    level.events.listen(Level.EVENT_TRIGGER, (spec: TriggerSpec, _trigger: Entity, touches: Set<Entity>) => {
      if (spec.type === 'GOTO') {
        for (const _ of findPlayers(touches)) {
          startWorld(spec.name);
          return;
        }
      }
    });

    level.events.listen(Pipe.EVENT_PIPE_COMPLETE, async (pipe: Entity) => {
      const props = pipe.props as PipePortalPropsSpec;

      if (props.goesTo) {
        const nextLevel = await setupLevel(props.goesTo.name);

        sceneRunner.addScene(nextLevel);
        sceneRunner.runNext();

        if (props.backTo) {
          nextLevel.events.listen(Level.EVENT_COMPLETE, async () => {
            const level = await setupLevel(name);

            if (typeof props.backTo === 'string') {
              const exitPipe = level.entities.get(props.backTo)!;
              connectEntity(exitPipe, mario);
            }

            sceneRunner.addScene(level);
            sceneRunner.runNext();
          });
        } else {
          level.events.emit(Level.EVENT_COMPLETE);
        }
      }
    });

    const dashboardLayer = createDashboardLayer(font, mario);
    level.addLayer(dashboardLayer);
    level.addLayer(createCollisionLayer(level));

    return level;
  }

  async function startWorld(name: string) {
    const level = await setupLevel(name);
    resetPlayer(mario, name);

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, mario);

    const waitScreen = new TimedScene();
    // waitScreen.countDown = 0;

    waitScreen.addLayer(createColorLayer('#000'));
    waitScreen.addLayer(dashboardLayer);
    waitScreen.addLayer(playerProgressLayer);

    sceneRunner.addScene(waitScreen);
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
  startWorld('debug-pipe');
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
