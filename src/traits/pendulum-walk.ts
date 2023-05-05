import { type Entity, type Side, Trait } from '../entity';

export class PendulumWalk extends Trait {
  private speed = -30;

  obstruct(_entity: Entity, side: Side) {
    if (side === 'left' || side === 'right') {
      this.speed = -this.speed;
    }
  }

  update(entity: Entity) {
    entity.vel.x = this.speed;
  }
}
