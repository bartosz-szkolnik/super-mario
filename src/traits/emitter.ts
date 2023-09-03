import type { Entity } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';
import { Trait } from '../trait';

type EmitterFn = (entity: Entity, gameContext: GameContext, level: Level) => void;

const EMIT_INTERVAL = 2;

export class Emitter extends Trait {
  private interval = EMIT_INTERVAL;
  private coolDown = this.interval;

  private readonly emitters: EmitterFn[] = [];

  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    this.coolDown -= deltaTime ?? 0;
    if (this.coolDown <= 0) {
      this.emit(entity, gameContext, level);
      this.coolDown = this.interval;
    }
  }

  addEmitter(emitter: EmitterFn) {
    this.emitters.push(emitter);
  }

  setInterval(interval: number) {
    this.interval = interval;
  }

  private emit(entity: Entity, gameContext: GameContext, level: Level) {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, level);
    }
  }
}
