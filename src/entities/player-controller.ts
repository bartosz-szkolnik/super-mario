import type { Level } from '../level';
import { type Entity, Trait } from '../entity';
import type { GameContext } from '../main';
import { Vec2 } from '../math';
import { Killable, Stomper } from '../traits';

export class PlayerController extends Trait {
  player: Entity | null = null;
  checkpoint = new Vec2(0, 0);
  time = 300;
  score = 0;

  setPlayer(entity: Entity) {
    this.player = entity;

    this.player.get(Stomper).events.listen('stomp', () => {
      this.score += 100;
    });
  }

  update(_entity: Entity, { deltaTime }: GameContext, level: Level) {
    if (this.player && !level.hasEntity(this.player)) {
      this.player.get(Killable).revive();

      const { x, y } = this.checkpoint;
      this.player.pos.set(x, y);
      level.addEntity(this.player);
    } else {
      this.time -= (deltaTime ?? 0) * 2;
    }
  }
}
