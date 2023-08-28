import type { Entity } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';
import { Trait } from '../trait';

type EmitterFn = (entity: Entity, gameContext: GameContext, level: Level) => void;

const INTERVAL = 4;

export class Emitter extends Trait {
  private coolDown = INTERVAL;
  private readonly emitters: EmitterFn[] = [];

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    this.coolDown -= deltaTime ?? 0;
    if (this.coolDown <= 0) {
      this.emit(entity, gameContext, level);
      this.coolDown = INTERVAL;
    }
  }

  addEmitter(emitter: EmitterFn) {
    this.emitters.push(emitter);
  }

  private emit(entity: Entity, gameContext: GameContext, level: Level) {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, level);
    }
  }
}
