import { type Entity, Trait } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';

type Condition = (entity: Entity, touches: Set<Entity>, gameContext: GameContext, level: Level) => void;

export class Trigger extends Trait {
  private readonly touches = new Set<Entity>();
  private readonly conditions: Condition[] = [];

  collides(_us: Entity, them: Entity) {
    this.touches.add(them);
  }

  update(entity: Entity, gameContext: GameContext, level: Level) {
    if (this.touches.size > 0) {
      for (const condition of this.conditions) {
        condition(entity, this.touches, gameContext, level);
      }

      this.touches.clear();
    }
  }

  addCondition(condition: Condition) {
    this.conditions.push(condition);
  }
}
