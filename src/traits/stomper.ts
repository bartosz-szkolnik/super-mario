import { Killable } from '.';
import { type Entity, Trait } from '../entity';

const BOUNCE_SPEED = 400;

export class Stomper extends Trait {
  static readonly EVENT_STOMP = Symbol('symbol');

  collides(us: Entity, them: Entity) {
    if (!them.has(Killable) || them.get(Killable).dead) {
      return;
    }

    if (us.vel.y > them.vel.y) {
      this.queue(() => this.bounce(us, them));
      us.sounds.add('stomp');
      us.events.emit(Stomper.EVENT_STOMP);
    }
  }

  private bounce(us: Entity, them: Entity) {
    us.bounds.bottom = them.bounds.top;
    us.vel.y = -BOUNCE_SPEED;
  }
}
