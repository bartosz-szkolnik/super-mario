import { type Entity, Trait } from '../entity';

const ALLOWED_JUMP_DURATION = 0.5;
const JUMP_VELOCITY = 200;

export class Jump extends Trait {
  private engageTime = 0;

  start() {
    this.engageTime = ALLOWED_JUMP_DURATION;
  }

  cancel() {
    this.engageTime = 0;
  }

  update(entity: Entity, deltaTime: number) {
    if (this.engageTime > 0) {
      entity.vel.y = -JUMP_VELOCITY;
      this.engageTime -= deltaTime;
    }
  }
}
