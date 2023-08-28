import { Entity } from '../entity';
import { loadSpriteSheet } from '../loaders/sprite';
import type { SpriteSheet } from '../spritesheet';
import { Trait } from '../trait';
import { Killable, PendulumMove, Stomper, Physics, Solid } from '../traits';

export async function loadGoomba() {
  const sprite = await loadSpriteSheet('goomba');
  return createGoombaFactory(sprite);
}

class Behavior extends Trait {
  collides(us: Entity, them: Entity) {
    if (us.get(Killable).dead) {
      return;
    }

    if (them.has(Stomper)) {
      if (them.vel.y > us.vel.y) {
        us.get(Killable).kill();
        us.get(PendulumMove).speed = 0;
      } else {
        them.get(Killable).kill();
      }
    }
  }
}

function createGoombaFactory(sprite: SpriteSheet) {
  const walkAnimation = sprite.getAnimation('walk');

  function routeAnim(goomba: Entity) {
    if (goomba.get(Killable).dead) {
      return 'flat';
    }

    return walkAnimation(goomba.lifetime);
  }

  function drawGoomba(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();

    goomba.size.set(16, 16);

    goomba.addTrait(new Physics());
    goomba.addTrait(new Solid());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new Behavior());
    goomba.addTrait(new Killable());

    goomba.draw = drawGoomba;

    return goomba;
  };
}
