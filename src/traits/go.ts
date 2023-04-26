import { type Entity, Trait } from '../entity';

const CHARACTER_SPEED = 6000;

export class Go extends Trait {
  dir = 0;
  distance = 0;
  heading = 1;

  update(entity: Entity, deltaTime: number) {
    entity.vel.x = CHARACTER_SPEED * this.dir * deltaTime;

    if (this.dir) {
      this.heading = this.dir;
      this.distance += Math.abs(entity.vel.x * deltaTime);
    } else {
      this.distance = 0;
    }
  }
}
