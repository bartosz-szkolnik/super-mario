import { type Entity, Trait } from '../entity';

export class Velocity extends Trait {
  update(entity: Entity, deltaTime: number) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}
