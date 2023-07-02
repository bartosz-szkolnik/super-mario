import { type Entity, Trait } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';

type EmitterFn = (entity: Entity, level: Level) => void;

const INTERVAL = 4;

export class Emitter extends Trait {
  private coolDown = INTERVAL;
  private readonly emitters: EmitterFn[] = [];

  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    this.coolDown -= deltaTime ?? 0;
    if (this.coolDown <= 0) {
      this.emit(entity, level);
      this.coolDown = INTERVAL;
    }
  }

  addEmitter(emitter: EmitterFn) {
    this.emitters.push(emitter);
  }

  private emit(entity: Entity, level: Level) {
    for (const emitter of this.emitters) {
      emitter(entity, level);
    }
  }
}
