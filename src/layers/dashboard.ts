import type { Entity } from '../entity';
import type { Level } from '../level';
import type { Font } from '../loaders/font';
import { findPlayers } from '../player';
import { Player, LevelTimer } from '../traits';

// should be based on font.size... fix later
const FIRST_LINE = 8;
const SECOND_LINE = 16;

export function createDashboardLayer(font: Font, level: Level) {
  const timerTrait = getTimerTrait(level.entities) ?? { currentTime: 300 };

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const playerTrait = getPlayerTrait(level.entities) ?? { score: 0, coins: 0, name: 'UNNAMED', lives: 3 };

    const { score, coins, name, lives } = playerTrait;
    const { currentTime } = timerTrait;

    font.print(name, context, 16, FIRST_LINE);
    font.print(String(score).padStart(6, '0'), context, 16, SECOND_LINE);

    font.print('+ ' + String(lives).padStart(2, '0'), context, 96, FIRST_LINE);
    font.print('@x' + coins.toString().padStart(2, '0'), context, 96, SECOND_LINE);

    font.print('WORLD', context, 152, FIRST_LINE);
    font.print(level.name, context, 152, SECOND_LINE);

    font.print('TIME', context, 208, FIRST_LINE);
    font.print(String(currentTime.toFixed()).padStart(3, '0'), context, 216, SECOND_LINE);
  };
}

function getPlayerTrait(entities: Set<Entity>) {
  for (const entity of findPlayers(entities)) {
    return entity.get(Player);
  }
}

function getTimerTrait(entities: Set<Entity>) {
  for (const entity of entities.values()) {
    if (entity.has(LevelTimer)) {
      return entity.get(LevelTimer);
    }
  }
}
