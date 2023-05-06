import { type Entity, Trait } from '../entity';

const BOUNCE_SPEED = 400;

export class Stomper extends Trait {
  queueBounce = false;

  bounce() {
    this.queueBounce = true;
  }

  update(entity: Entity) {
    if (this.queueBounce) {
      entity.vel.y = -BOUNCE_SPEED;
      this.queueBounce = false;
    }
  }
}
