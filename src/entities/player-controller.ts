import { Entity, Trait } from '../entity';
import { Level } from '../level';
import { Vec2 } from '../math';
import { Killable, Stomper } from '../traits';

export class PlayerController extends Trait {
  player: Entity | null = null;
  checkpoint = new Vec2(0, 0);
  time = 300;
  score = 0;

  setPlayer(entity: Entity) {
    this.player = entity;

    this.player.get(Stomper).onStomp = () => {
      this.score += 100;
    };
  }

  update(_entity: Entity, deltaTime: number, level: Level) {
    if (this.player && !level.hasEntity(this.player)) {
      this.player.get(Killable).revive();

      const { x, y } = this.checkpoint;
      this.player.pos.set(x, y);
      level.addEntity(this.player);
    } else {
      this.time -= deltaTime * 2;
    }
  }
}
