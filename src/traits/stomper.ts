import { Killable } from '.';
import { type Entity, Trait } from '../entity';

const BOUNCE_SPEED = 400;

export class Stomper extends Trait {
  onStomp = () => {};

  collides(us: Entity, them: Entity) {
    if (!them.has(Killable) || them.get(Killable).dead) {
      return;
    }

    if (us.vel.y > them.vel.y) {
      this.bounce(us, them);
      this.sounds.add('stomp');
      this.onStomp();
    }
  }

  private bounce(us: Entity, them: Entity) {
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -BOUNCE_SPEED;
  }
}
