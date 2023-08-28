import type { Entity, Side } from '../entity';
import { Trait } from '../trait';

const PENDULUM_MOVE_SPEED = -30;

export class PendulumMove extends Trait {
  speed = PENDULUM_MOVE_SPEED;
  enabled = true;

  obstruct(_entity: Entity, side: Side) {
    if (side === 'left' || side === 'right') {
      this.speed = -this.speed;
    }
  }

  update(entity: Entity) {
    if (this.enabled) {
      entity.vel.x = this.speed;
    }
  }
}
