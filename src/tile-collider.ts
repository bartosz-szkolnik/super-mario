import type { Entity } from './entity';
import type { CollisionTile } from './level';
import type { Matrix } from './math';
import { TileResolver } from './tile-resolver';

export class TileCollider {
  // fixme change to private
  readonly tiles: TileResolver;

  constructor(readonly tileMatrix: Matrix<CollisionTile>) {
    this.tiles = new TileResolver(tileMatrix);
  }

  test(entity: Entity) {
    this.checkX(entity);
    this.checkY(entity);
  }

  // fixme: make private
  checkX(entity: Entity) {
    const { vel, bounds } = entity;
    let x = 0;
    if (vel.x > 0) {
      x = bounds.right;
    } else if (vel.x < 0) {
      x = bounds.left;
    } else {
      return;
    }

    const matches = this.tiles.searchByRange(x, x, bounds.top, bounds.bottom);
    matches.forEach(match => {
      if (match.tile.type !== 'ground') {
        return;
      }

      if (vel.x > 0) {
        if (bounds.right > match.x1) {
          bounds.right = match.x1;
          vel.x = 0;

          entity.obstruct('right');
        }
      } else if (vel.x < 0) {
        if (bounds.left < match.x2) {
          bounds.left = match.x2;
          vel.x = 0;

          entity.obstruct('left');
        }
      }
    });
  }

  // fixme: make private
  checkY(entity: Entity) {
    const { vel, bounds } = entity;
    let y = 0;
    if (vel.y > 0) {
      y = bounds.bottom;
    } else if (vel.y < 0) {
      y = bounds.top;
    } else {
      return;
    }

    const matches = this.tiles.searchByRange(bounds.left, bounds.right, y, y);
    matches.forEach(match => {
      if (match.tile.type !== 'ground') {
        return;
      }

      if (vel.y > 0) {
        if (bounds.bottom > match.y1) {
          bounds.bottom = match.y1;
          vel.y = 0;

          entity.obstruct('bottom');
        }
      } else if (vel.y < 0) {
        if (bounds.top < match.y2) {
          bounds.top = match.y2;
          vel.y = 0;

          entity.obstruct('top');
        }
      }
    });
  }
}
