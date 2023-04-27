import { type Entity, Trait, type Side } from '../entity';

const ALLOWED_JUMP_DURATION = 0.3;
const JUMP_VELOCITY = 200;
const GRACE_PERIOD = 0.1;
const SPEED_BOOST = 0.3;

export class Jump extends Trait {
  private engageTime = 0;
  private requestTime = 0;
  ready = 0;

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = GRACE_PERIOD;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  obstruct(_entity: Entity, side: Side) {
    if (side === 'bottom') {
      this.ready = 1;
    } else if (side === 'top') {
      this.cancel();
    }
  }

  update(entity: Entity, deltaTime: number) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = ALLOWED_JUMP_DURATION;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -(JUMP_VELOCITY + Math.abs(entity.vel.x * SPEED_BOOST));
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }
}
