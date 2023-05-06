import { Entity } from '../entity';
import { loadSpriteSheet } from '../loaders';
import type { SpriteSheet } from '../spritesheet';
import { Go, Jump, Killable, Stomper } from '../traits';
import type { SpriteSpec } from '../types';

type MarioFrame = Exclude<SpriteSpec['frames'], undefined>[0]['name'];

export async function loadMario() {
  const sprite = await loadSpriteSheet('mario');
  return createMarioFactory(sprite);
}

function createMarioFactory(sprite: SpriteSheet) {
  const runAnimation = sprite.getAnimation('run');

  function routeFrame(mario: Entity): MarioFrame {
    if (mario.get(Jump).falling) {
      return 'jump';
    }

    const { distance, dir } = mario.get(Go);
    if (distance > 0) {
      if ((mario.vel.x > 0 && dir < 0) || (mario.vel.x < 0 && dir > 0)) {
        return 'break';
      }

      return runAnimation(distance) as MarioFrame;
    }

    return 'idle';
  }

  function setTurboState(this: Entity, turboOn: boolean) {
    this.get(Go).isRunning = turboOn;
  }

  function drawMario(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, this.get(Go).heading < 0);
  }

  return function createMario() {
    const mario = new Entity();
    mario.size.set(14, 16);

    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Killable());
    mario.addTrait(new Stomper());

    mario.get(Killable).removeAfter = 0;

    mario.turbo = setTurboState;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}
