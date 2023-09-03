import type { Entity } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';
import { Trait } from '../trait';

export class Physics extends Trait {
  update(entity: Entity, gameContext: GameContext, level: Level) {
    const { deltaTime } = gameContext;
    entity.pos.x += entity.vel.x * (deltaTime ?? 0);
    level.tileCollider.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * (deltaTime ?? 0);
    level.tileCollider.checkY(entity, gameContext, level);

    entity.vel.y += level.gravity * (deltaTime ?? 0);
  }
}
