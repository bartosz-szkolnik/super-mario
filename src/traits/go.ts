import { Jump } from '.';
import { type Entity, Trait } from '../entity';

const ACCELERATION = 400;
const DECELERATION = 300;
const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export class Go extends Trait {
  dir = 0;
  distance = 0;
  heading = 1;
  isRunning = false;

  update(entity: Entity, deltaTime: number) {
    const absX = Math.abs(entity.vel.x);

    if (this.dir !== 0) {
      entity.vel.x += ACCELERATION * deltaTime * this.dir;

      if (entity.has(Jump)) {
        if (entity.get(Jump).falling === false) {
          this.heading = this.dir;
        }
      } else {
        this.heading = this.dir;
      }
    } else if (entity.vel.x !== 0) {
      const decel = Math.min(absX, DECELERATION * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    const dragFactor = this.isRunning ? FAST_DRAG : SLOW_DRAG;
    const drag = dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;
    this.distance += absX * deltaTime;
  }
}
