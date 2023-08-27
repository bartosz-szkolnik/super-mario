import type { Level } from '../level';
import type { Font } from '../loaders/font';
import { findPlayers } from '../player';
import { Player } from '../traits';
import { LevelTimer } from '../traits/level-timer';

const FIRST_LINE = 8;
const SECOND_LINE = 16;

export function createDashboardLayer(font: Font, level: Level) {
  return function drawDashboard(context: CanvasRenderingContext2D) {
    const { score, coins, name } = getPlayerTrait(level) ?? { score: 0, coins: 0, name: 'UNNAMED' };
    const { currentTime } = getTimerTrait(level) ?? { currentTime: 300 };

    font.print(name, context, 16, FIRST_LINE);
    font.print(String(score).padStart(6, '0'), context, 16, SECOND_LINE);

    font.print('@x' + coins.toString().padStart(2, '0'), context, 96, SECOND_LINE);

    font.print('WORLD', context, 152, FIRST_LINE);
    font.print('1-1', context, 152, SECOND_LINE);

    font.print('TIME', context, 208, FIRST_LINE);
    font.print(String(currentTime.toFixed()).padStart(3, '0'), context, 216, SECOND_LINE);
  };
}

function getPlayerTrait(level: Level) {
  for (const entity of findPlayers(level)) {
    return entity.get(Player);
  }
}

function getTimerTrait(level: Level) {
  for (const entity of level.entities.values()) {
    if (entity.has(LevelTimer)) {
      return entity.get(LevelTimer);
    }
  }
}
