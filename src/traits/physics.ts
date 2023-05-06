import { type Entity, Trait } from '../entity';
import { Level } from '../level';

export class Physics extends Trait {
  update(entity: Entity, deltaTime: number, level: Level) {
    // fixme: delete later
    if (!level.tileCollider) {
      throw new Error('Tile collider not found.');
    }

    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider.checkX(entity);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider.checkY(entity);

    entity.vel.y += level.gravity * deltaTime;
  }
}
