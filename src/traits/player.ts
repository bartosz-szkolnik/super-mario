import { Stomper } from './stomper';
import { type Entity, Trait } from '../entity';

const COIN_LIFE_THRESHOLD = 100;

export class Player extends Trait {
  name = 'UNNAMED';
  lives = 3;
  score = 0;
  coins = 0;

  constructor() {
    super();

    this.listen(Stomper.EVENT_STOMP, () => {
      this.score += 100;
    });
  }

  addCoins(count: number) {
    this.coins += count;
    this.queue((entity: Entity) => entity.sounds.add('coin'));

    while (this.coins >= COIN_LIFE_THRESHOLD) {
      this.addLives(1);
      this.coins -= COIN_LIFE_THRESHOLD;
    }
  }

  addLives(count: number) {
    this.lives += count;
  }
}
