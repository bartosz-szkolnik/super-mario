import { createAnimation } from './animation';
import { Entity } from './entity';
import { loadSpriteSheet } from './loaders';
import { Go, Jump } from './traits';
import type { SpriteSet } from './types';

type MarioFrame = Exclude<SpriteSet['frames'], undefined>[0]['name'];

const RUNNING_FRAMES = ['run-1', 'run-2', 'run-3'] satisfies MarioFrame[];
const FRAME_LENGTH = 6;

export async function createMario() {
  const sprite = await loadSpriteSheet('mario');

  const mario = new Entity();
  mario.size.set(14, 16);

  mario.addTrait(new Go());
  mario.addTrait(new Jump());

  mario.turbo = function setTurboState(turboOn: boolean) {
    mario.get(Go).isRunning = turboOn;
  };

  const runAnimation = createAnimation(RUNNING_FRAMES, FRAME_LENGTH);
  function routeFrame(mario: Entity): MarioFrame {
    if (mario.get(Jump).falling) {
      return 'jump';
    }

    const { distance, dir } = mario.get(Go);
    if (distance > 0) {
      if ((mario.vel.x > 0 && dir < 0) || (mario.vel.x < 0 && dir > 0)) {
        return 'break';
      }

      return runAnimation(distance);
    }

    return 'idle';
  }

  mario.draw = function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, this.get(Go).heading < 0);
  };

  return mario;
}
