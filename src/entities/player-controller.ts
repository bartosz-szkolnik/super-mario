import { Entity, Trait } from '../entity';
import { Level } from '../level';
import { Vec2 } from '../math';
import { Killable } from '../traits';

export class PlayerController extends Trait {
  player: Entity | null = null;
  checkpoint = new Vec2(0, 0);

  setPlayer(entity: Entity) {
    this.player = entity;
  }

  update(_entity: Entity, _deltaTime: number, level: Level): void {
    if (this.player && !level.hasEntity(this.player)) {
      this.player.get(Killable).revive();

      const { x, y } = this.checkpoint;
      this.player.pos.set(x, y);
      level.addEntity(this.player);
    }
  }
}
