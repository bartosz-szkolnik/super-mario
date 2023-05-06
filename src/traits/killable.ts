import { Entity, Trait } from '../entity';
import { Level } from '../level';

// const REMOVE_AFTER_TIME = 2;

export class Killable extends Trait {
  private deadTime = 0;
  dead = false;
  removeAfter = 2;

  kill() {
    this.queue(() => (this.dead = true));
  }

  revive() {
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity: Entity, deltaTime: number, level: Level) {
    if (this.dead) {
      this.deadTime += deltaTime;

      if (this.deadTime > this.removeAfter) {
        this.queue(() => level.removeEntity(entity));
      }
    }
  }
}
