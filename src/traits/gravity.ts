import { type Entity, Trait } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';

export class Gravity extends Trait {
  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    entity.vel.y += level.gravity * (deltaTime ?? 0);
  }
}
