import { type Entity, Trait } from '../entity';

const CHARACTER_SPEED = 6000;

export class Go extends Trait {
  dir = 0;

  update(entity: Entity, deltaTime: number) {
    entity.vel.x = CHARACTER_SPEED * this.dir * deltaTime;
  }
}
