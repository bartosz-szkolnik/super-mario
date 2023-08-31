import type { Entity } from '../entity';
import type { Level } from '../level';
import type { Font } from '../loaders/font';
import { findPlayers } from '../player';
import { Player, LevelTimer } from '../traits';

export function createDashboardLayer(font: Font, level: Level) {
  const firstLine = font.size * 2;
  const secondLine = font.size * 3;
  const timerTrait = getTimerTrait(level.entities) ?? { currentTime: 300 };

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const playerTrait = getPlayerTrait(level.entities) ?? { score: 0, coins: 0, name: 'UNNAMED', lives: 3 };

    const { score, coins, name, lives } = playerTrait;
    const { currentTime } = timerTrait;

    font.print(name, context, 24, firstLine);
    font.print(String(score).padStart(6, '0'), context, 24, secondLine);

    font.print('+ ' + String(lives).padStart(2, '0'), context, 88, firstLine);
    font.print('@x' + coins.toString().padStart(2, '0'), context, 88, secondLine);

    font.print('WORLD', context, 136, firstLine);
    font.print(level.name, context, 136, secondLine);

    font.print('TIME', context, 200, firstLine);
    font.print(String(currentTime.toFixed()).padStart(3, '0'), context, 208, secondLine);
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
