import type { Entity } from '../entity';
import type { Font } from '../loaders/font';
import { Player, LevelTimer } from '../traits';

const DEFAULT_PLAYER = { score: 0, coins: 0, name: 'UNNAMED', lives: 3, world: 'UNKNOWN' };

export function createDashboardLayer(font: Font, entity: Entity) {
  const firstLine = font.size * 2;
  const secondLine = font.size * 3;

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const { score, coins, name, lives, world } = entity?.get(Player) ?? DEFAULT_PLAYER;
    const { currentTime } = entity?.get(LevelTimer) ?? { currentTime: 300 };

    font.print(name, context, 24, firstLine);
    font.print(String(score).padStart(6, '0'), context, 24, secondLine);

    font.print('! ' + String(lives).padStart(2, '0'), context, 96, firstLine);
    font.print('×' + String(coins).padStart(2, '0'), context, 96, secondLine);

    font.print('WORLD', context, 144, firstLine);
    font.print(world, context, 152, secondLine);

    font.print('TIME', context, 200, firstLine);
    font.print(String(currentTime.toFixed()).padStart(3, '0'), context, 208, secondLine);
  };
}
