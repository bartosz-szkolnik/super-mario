import { type Entity, type Side, Trait } from '../entity';

export class PendulumMove extends Trait {
  speed = -30;
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
