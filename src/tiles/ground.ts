import { TileCollisionContext } from '../tile-collider';

function handleX({ entity, match }: TileCollisionContext) {
  const { vel, bounds } = entity;
  if (vel.x > 0) {
    if (bounds.right > match.x1) {
      entity.obstruct('right', match);
    }
  } else if (vel.x < 0) {
    if (bounds.left < match.x2) {
      entity.obstruct('left', match);
    }
  }
}

function handleY({ entity, match }: TileCollisionContext) {
  const { vel, bounds } = entity;
  if (vel.y > 0) {
    if (bounds.bottom > match.y1) {
      entity.obstruct('bottom', match);
    }
  } else if (vel.y < 0) {
    if (bounds.top < match.y2) {
      entity.obstruct('top', match);
    }
  }
}

export const ground = [handleX, handleY];
