import type { Camera } from '../camera';
import type { Layer } from '../compositor';
import type { BackgroundTile, Level } from '../level';
import type { Matrix } from '../math';
import type { SpriteSheet } from '../spritesheet';
import { toIndex } from '../tile-resolver';

export function createBackgroundLayer(level: Level, tiles: Matrix<BackgroundTile>, sprites: SpriteSheet): Layer {
  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240;
  const context = buffer.getContext('2d')!;

  function redraw(startIndex: number, endIndex: number) {
    context.clearRect(0, 0, buffer.width, buffer.height);

    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.hasAnimation(tile.name)) {
            sprites.drawAnimation(tile.name, context, x - startIndex, y, level.totalTime);
            return;
          }

          sprites.drawTile(tile.name, context, x - startIndex, y);
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

    context.drawImage(buffer, -x % 16, -y);
  };
}
