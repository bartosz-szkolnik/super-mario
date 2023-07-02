import { TileCollisionContext } from '../tile-collider';
import { Player } from '../traits';

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

function handleY({ entity, match, gameContext, level, resolver }: TileCollisionContext) {
  const { vel, bounds } = entity;
  if (vel.y > 0) {
    if (bounds.bottom > match.y1) {
      entity.obstruct('bottom', match);
    }
  } else if (vel.y < 0) {
    if (entity.has(Player)) {
      const grid = resolver['matrix'];
      grid.delete(match.indexX, match.indexY);

      const goomba = gameContext.entityFactory.goomba();
      goomba.vel.set(50, -400);
      goomba.pos.set(entity.pos.x, match.y1);
      level.addEntity(goomba);
    }

    if (bounds.top < match.y2) {
      entity.obstruct('top', match);
    }
  }
}

export const brick = [handleX, handleY];
