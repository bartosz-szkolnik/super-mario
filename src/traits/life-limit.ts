import { Entity } from '../entity';
import { Level } from '../level';
import { GameContext } from '../main';
import { Trait } from '../trait';

const DEFAULT_TIME_LIMIT = 2;

export class LifeLimit extends Trait {
  private readonly time = DEFAULT_TIME_LIMIT;

  update(entity: Entity, _gameContext: GameContext, level: Level) {
    if (entity.lifetime > this.time) {
      this.queue(() => {
        level.entities.delete(entity);
      });
    }
  }
}
