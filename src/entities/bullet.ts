import { Entity } from '../entity';
import { Level } from '../level';
import { loadSpriteSheet } from '../loaders/sprite';
import { GameContext } from '../main';
import type { SpriteSheet } from '../spritesheet';
import { Trait } from '../trait';
import { Gravity, Killable, Stomper, Velocity } from '../traits';

export async function loadBullet() {
  const sprite = await loadSpriteSheet('bullet');
  return createBulletFactory(sprite);
}

class Behavior extends Trait {
  private readonly gravity = new Gravity();

  collides(us: Entity, them: Entity) {
    if (us.get(Killable).dead) {
      return;
    }

    if (them.has(Stomper)) {
      if (them.vel.y > us.vel.y) {
        us.get(Killable).kill();
        us.vel.set(100, -200);
      } else {
        them.get(Killable).kill();
      }
    }
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if (entity.get(Killable).dead) {
      this.gravity.update(entity, gameContext, level);
    }
  }
}

function createBulletFactory(sprite: SpriteSheet) {
  function drawBullet(this: Entity, context: CanvasRenderingContext2D) {
    sprite.draw('bullet', context, 0, 0, this.vel.x < 0);
  }

  return function createBullet() {
    const bullet = new Entity();
    bullet.size.set(16, 14);

    bullet.addTrait(new Velocity());
    bullet.addTrait(new Behavior());
    bullet.addTrait(new Killable());

    bullet.draw = drawBullet;

    return bullet;
  };
}
