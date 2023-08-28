import type { GameContext } from './main';
import { Scene } from './scene';

export class TimedScene extends Scene {
  private countDown = 2;

  update({ deltaTime }: GameContext) {
    this.countDown -= deltaTime ?? 0;
    if (this.countDown <= 0) {
      this.events.emit(Scene.EVENT_COMPLETE);
    }
  }
}
