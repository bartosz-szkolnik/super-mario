import type { Camera } from '../camera';
import type { Layer } from '../compositor';
import type { Tile, Level } from '../level';
import type { Matrix } from '../math';
import type { SpriteSheet } from '../spritesheet';
import { toIndex } from '../tile-resolver';

export function createBackgroundLayer(level: Level, tiles: Matrix<Tile>, sprites: SpriteSheet): Layer {
  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240;
  const context = buffer.getContext('2d')!;

  function redraw(startIndex: number, endIndex: number) {
    context.clearRect(0, 0, buffer.width, buffer.height);
    const grid = tiles.getGrid();

    for (let x = startIndex; x <= endIndex; ++x) {
      const col = grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.hasAnimation(tile.style)) {
            sprites.drawAnimation(tile.style, context, x - startIndex, y, level.totalTime);
            return;
          }

          sprites.drawTile(tile.style, context, x - startIndex, y);
        });
      }
    }
  }

  return function drawBackgroundLayer(context: CanvasRenderingContext2D, camera: Camera) {
    const { x, y } = camera.pos;

    const drawWidth = toIndex(camera.size.x);
    const drawFrom = toIndex(x);
    const drawTo = drawFrom + drawWidth;
    redraw(drawFrom, drawTo);

    context.drawImage(buffer, Math.floor(-x % 16), Math.floor(-y));
  };
}
