import { Entity } from '../entity';
import { loadSpriteSheet } from '../loaders';
import type { SpriteSheet } from '../spritesheet';
import { PendulumWalk } from '../traits/pendulum-walk';

export async function loadGoomba() {
  const sprite = await loadSpriteSheet('goomba');
  return createGoombaFactory(sprite);
}

function createGoombaFactory(sprite: SpriteSheet) {
  const walkAnimation = sprite.getAnimation('walk');

  function drawGoomba(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw(walkAnimation(this.lifetime), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();

    goomba.size.set(16, 16);
    goomba.addTrait(new PendulumWalk());
    goomba.draw = drawGoomba;

    return goomba;
  };
}
