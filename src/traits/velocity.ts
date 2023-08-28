import type { Entity } from '../entity';
import type { GameContext } from '../main';
import { Trait } from '../trait';

export class Velocity extends Trait {
  update(entity: Entity, { deltaTime }: GameContext) {
    entity.pos.x += entity.vel.x * (deltaTime ?? 0);
    entity.pos.y += entity.vel.y * (deltaTime ?? 0);
  }
}
