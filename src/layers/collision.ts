import type { Camera } from '../camera';
import type { Layer } from '../compositor';
import type { Entity } from '../entity';
import type { Level } from '../level';
import type { TileResolver } from '../tile-resolver';

export function createCollisionLayer(level: Level): Layer {
  const drawTileCandidateFns = level.tileCollider['resolvers'].map(createTileCandidateLayer);
  const drawBoundingBoxes = createEntityLayer(level.entities);

  return function drawCollision(context: CanvasRenderingContext2D, camera: Camera) {
    drawTileCandidateFns.forEach(draw => draw(context, camera));
    drawBoundingBoxes(context, camera);
  };
}

function createEntityLayer(entities: Set<Entity>) {
  return function drawBoundingBox(context: CanvasRenderingContext2D, camera: Camera) {
    context.strokeStyle = 'green';
    entities.forEach(entity => {
      context.beginPath();
      context.rect(entity.bounds.left - camera.pos.x, entity.bounds.top - camera.pos.y, entity.size.x, entity.size.y);
      context.stroke();
    });
  };
}

function createTileCandidateLayer(tileResolver: TileResolver | null) {
  let resolvedTiles: { x: number; y: number }[] = [];
  const tileSize = tileResolver?.tileSize ?? 16;

  const getByIndexOriginal = tileResolver?.getByIndex;
  (tileResolver ?? ({} as any)).getByIndex = function getByIndexFake(x: number, y: number) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal?.call(tileResolver, x, y);
  };

  return function drawTileCandidates(context: CanvasRenderingContext2D, camera: Camera) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
      context.stroke();
    });

    resolvedTiles = [];
  };
}
