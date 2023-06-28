import { type Entity, Trait } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';

export class Physics extends Trait {
  update(entity: Entity, { deltaTime }: GameContext, level: Level) {
    // fixme: delete later
    if (!level.tileCollider) {
      throw new Error('Tile collider not found.');
    }

    entity.pos.x += entity.vel.x * (deltaTime ?? 0);
    level.tileCollider.checkX(entity);

    entity.pos.y += entity.vel.y * (deltaTime ?? 0);
    level.tileCollider.checkY(entity);

    entity.vel.y += level.gravity * (deltaTime ?? 0);
  }
}
