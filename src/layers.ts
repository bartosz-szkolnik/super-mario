import type { Camera } from './camera';
import type { Layer } from './compositor';
import type { Entity } from './entity';
import type { Level } from './level';
import type { SpriteSheet } from './spritesheet';
import { toIndex } from './tile-resolver';

export function createBackgroundLayer(level: Level, sprites: SpriteSheet): Layer {
  const tiles = level.tiles;

  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240;
  const context = buffer.getContext('2d')!;

  function redraw(startIndex: number, endIndex: number) {
    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
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

export function createSpriteLayer(entities: Set<Entity>, width = 64, height = 64): Layer {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;

  const spriteBufferContext = spriteBuffer.getContext('2d')!;

  return function drawSpriteLayer(context: CanvasRenderingContext2D, camera: Camera) {
    entities.forEach(entity => {
      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext);
      context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
    });
  };
}

export function createCollisionLayer(level: Level): Layer {
  let resolvedTiles: { x: number; y: number }[] = [];

  const tileResolver = level.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexFake(x: number, y: number) {
    resolvedTiles.push({ x, y });

    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawCollision(context: CanvasRenderingContext2D, camera: Camera) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = 'green';
    level.entities.forEach(entity => {
      context.beginPath();
      context.rect(entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y, entity.size.x, entity.size.y);
      context.stroke();
    });

    resolvedTiles = [];
  };
}

export function createCameraLayer(cameraToDraw: Camera): Layer {
  return function drawCameraRect(context: CanvasRenderingContext2D, fromCamera: Camera) {
    context.strokeStyle = 'purple';
    context.beginPath();
    context.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y,
    );
    context.stroke();
  };
}
