import type { Layer } from '../compositor';
import type { Level } from '../level';
import type { Font } from '../loaders/font';
import { findPlayers } from '../player';
import { Player } from '../traits';

export function createPlayerProgressLayer(font: Font, level: Level): Layer {
  const { size } = font;

  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = 32;
  spriteBuffer.height = 32;

  const spriteBufferContext = spriteBuffer.getContext('2d')!;

  return function drawPlayerProgress(context: CanvasRenderingContext2D) {
    const entity = getPlayer(level)!;
    const player = entity.get(Player);

    font.print(`WORLD ${level.name}`, context, 12 * size, 12 * size);
    font.print(`×${player.lives.toString().padStart(3, ' ')}`, context, 16 * size, 15.5 * size);

    spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
    entity.draw(spriteBufferContext);
    context.drawImage(spriteBuffer, size * 13, size * 15);
  };
}

function getPlayer(level: Level) {
  for (const entity of findPlayers(level.entities)) {
    return entity;
  }
}
