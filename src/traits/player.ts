import { Stomper } from './stomper';
import { Trait } from '../entity';

export class Player extends Trait {
  lives = 3;
  score = 0;
  coins = 0;

  constructor() {
    super();

    this.listen(Stomper.EVENT_STOMP, () => {
      this.score += 100;
      console.log('Score', this.score);
    });
  }
}
