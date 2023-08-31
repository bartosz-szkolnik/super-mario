import type { Entity, Side } from '../entity';
import type { GameContext } from '../main';
import { Trait } from '../trait';

const ALLOWED_JUMP_DURATION = 0.3;
const JUMP_VELOCITY = 200;
const GRACE_PERIOD = 0.1;
const SPEED_BOOST = 0.3;

export class Jump extends Trait {
  private engageTime = 0;
  private requestTime = 0;
  ready = 0;
  velocity = JUMP_VELOCITY;

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

  update(entity: Entity, { deltaTime }: GameContext) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        entity.sounds.add('jump');
        this.engageTime = ALLOWED_JUMP_DURATION;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime ?? 0;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -(this.velocity + Math.abs(entity.vel.x * SPEED_BOOST));
      this.engageTime -= deltaTime ?? 0;
    }

    this.ready--;
  }
}
