import { createAnimation } from './animation';
import { Entity } from './entity';
import { loadSpriteSheet } from './loaders';
import { Go, Jump } from './traits';
import type { SpriteSet } from './types';

type MarioFrame = Exclude<SpriteSet['frames'], undefined>[0]['name'];

export async function createMario() {
  const sprite = await loadSpriteSheet('mario');

  const mario = new Entity();
  mario.size.set(14, 16);

  mario.addTrait(new Go());
  mario.addTrait(new Jump());

  const frames = ['run-1', 'run-2', 'run-3'] satisfies MarioFrame[];
  const runAnimation = createAnimation(frames, 10);
  function routeFrame(mario: Entity): MarioFrame {
    if (mario.get(Go).dir !== 0) {
      return runAnimation(mario.get(Go).distance);
    }

    return 'idle';
  }

  mario.draw = function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, this.get(Go).heading < 0);
  };

  return mario;
}
