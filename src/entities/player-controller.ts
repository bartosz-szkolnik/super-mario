import type { Level } from '../level';
import type { Entity } from '../entity';
import type { GameContext } from '../main';
import { Vec2 } from '../math';
import { Killable } from '../traits';
import { Trait } from '../trait';

export class PlayerController extends Trait {
  player: Entity | null = null;
  checkpoint = new Vec2(0, 0);

  setPlayer(entity: Entity) {
    this.player = entity;
  }

  update(_entity: Entity, _gameContext: GameContext, level: Level) {
    if (this.player && !level.hasEntity(this.player)) {
      this.player.get(Killable).revive();

      const { x, y } = this.checkpoint;
      this.player.pos.set(x, y);
      level.addEntity(this.player);
    }
  }
}
