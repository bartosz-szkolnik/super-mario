import { PlayerController } from '../entities/player-controller';
import type { Entity } from '../entity';
import type { Font } from '../loaders/font';

const FIRST_LINE = 8;
const SECOND_LINE = 16;

export function createDashboardLayer(font: Font, playerEnv: Entity) {
  const coins = 13;

  return function drawDashboard(context: CanvasRenderingContext2D) {
    const { time, score } = playerEnv.get(PlayerController);
    font.print('MARIO', context, 16, FIRST_LINE);
    font.print(String(score).padStart(6, '0'), context, 16, SECOND_LINE);

    font.print('@x' + coins.toString().padStart(2, '0'), context, 96, SECOND_LINE);

    font.print('WORLD', context, 152, FIRST_LINE);
    font.print('1-1', context, 152, SECOND_LINE);

    font.print('TIME', context, 208, FIRST_LINE);
    font.print(String(time.toFixed()).padStart(3, '0'), context, 216, SECOND_LINE);
  };
}
