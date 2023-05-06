import { Killable } from '.';
import { type Entity, Trait } from '../entity';

const BOUNCE_SPEED = 400;

export class Stomper extends Trait {
  collides(us: Entity, them: Entity) {
    if (them.has(Killable) && us.vel.y > them.vel.y) {
      this.bounce(us, them);
    }
  }

  private bounce(us: Entity, them: Entity) {
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -BOUNCE_SPEED;
  }
}