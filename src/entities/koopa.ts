import { Entity } from '../entity';
import { loadSpriteSheet } from '../loaders';
import type { SpriteSheet } from '../spritesheet';
import { PendulumWalk } from '../traits/pendulum-walk';

export async function loadKoopa() {
  const sprite = await loadSpriteSheet('koopa');
  return createKoopaFactory(sprite);
}

function createKoopaFactory(sprite: SpriteSheet) {
  const walkAnimation = sprite.getAnimation('walk');

  function drawKoopa(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw(walkAnimation(this.lifetime), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();

    koopa.size.set(16, 16);
    koopa.offset.set(0, 8);
    koopa.addTrait(new PendulumWalk());
    koopa.draw = drawKoopa;

    return koopa;
  };
}
