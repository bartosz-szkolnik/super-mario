import type { Entity } from './entity';
import type { Tile } from './level';
import type { Matrix } from './math';
import { TileResolver } from './tile-resolver';

export class TileCollider {
  // fixme change to private
  readonly tiles: TileResolver;

  constructor(readonly tileMatrix: Matrix<Tile>) {
    this.tiles = new TileResolver(tileMatrix);
  }

  test(entity: Entity) {
    this.checkX(entity);
    this.checkY(entity);
  }

  // fixme: make private
  checkX({ pos, size, vel }: Entity) {
    let x = 0;
    if (vel.x > 0) {
      x = pos.x + size.x;
    } else if (vel.x < 0) {
      x = pos.x;
    } else {
      return;
    }

    const matches = this.tiles.searchByRange(x, x, pos.y, pos.y + size.y);
    matches.forEach(match => {
      if (match.tile.type !== 'ground') {
        return;
      }

      if (vel.x > 0) {
        if (pos.x + size.x > match.x1) {
          pos.x = match.x1 - size.x;
          vel.x = 0;
        }
      } else if (vel.x < 0) {
        if (pos.x < match.x2) {
          pos.x = match.x2;
          vel.x = 0;
        }
      }
    });
  }

  // fixme: make private
  checkY(entity: Entity) {
    const { pos, size, vel } = entity;
    let y = 0;
    if (vel.y > 0) {
      y = pos.y + size.y;
    } else if (vel.y < 0) {
      y = pos.y;
    } else {
      return;
    }

    const matches = this.tiles.searchByRange(pos.x, pos.x + size.x, y, y);
    matches.forEach(match => {
      if (match.tile.type !== 'ground') {
        return;
      }

      if (vel.y > 0) {
        if (pos.y + size.y > match.y1) {
          pos.y = match.y1 - size.y;
          vel.y = 0;

          entity.obstruct('bottom');
        }
      } else if (vel.y < 0) {
        if (pos.y < match.y2) {
          pos.y = match.y2;
          vel.y = 0;

          entity.obstruct('top');
        }
      }
    });
  }
}
