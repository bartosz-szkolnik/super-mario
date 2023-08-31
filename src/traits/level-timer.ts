import type { Entity } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';
import { Trait } from '../trait';

const TOTAL_TIME = 400;
const HURRY_TIME = 100;

export const LEVEL_TIMER_EARMARK = Symbol('level timer earmark');

export class LevelTimer extends Trait {
  static readonly EVENT_TIMER_HURRY = Symbol('timer hurry');
  static readonly EVENT_TIMER_OK = Symbol('timer ok');

  private hurryEmitted: boolean | null = null;
  currentTime = TOTAL_TIME;

  reset() {
    this.currentTime = TOTAL_TIME;
  }

  update(_entity: Entity, { deltaTime }: GameContext, level: Level) {
    this.currentTime -= (deltaTime ?? 0) * 2.5;

    // if (!level[LEVEL_TIMER_EARMARK]) {
    //   this.hurryEmitted = null;
    // }

    if (this.hurryEmitted !== true && this.currentTime < HURRY_TIME) {
      level.events.emit(LevelTimer.EVENT_TIMER_HURRY);
      this.hurryEmitted = true;
    }

    if (this.hurryEmitted !== false && this.currentTime > HURRY_TIME) {
      level.events.emit(LevelTimer.EVENT_TIMER_OK);
      this.hurryEmitted = false;
    }

    // level[MARK] = true;
  }
}
