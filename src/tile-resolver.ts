import type { CollisionTile } from './level';
import type { Matrix } from './math';

export type Match = {
  tile: CollisionTile;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  indexX: number;
  indexY: number;
};

export function toIndex(pos: number, tileSize = 16) {
  return Math.floor(pos / tileSize);
}

export class TileResolver {
  // fixme: change to private
  constructor(private readonly matrix: Matrix<CollisionTile>, public readonly tileSize = 16) {}

  // fixme: should this be private?
  searchByPosition(posX: number, posY: number) {
    return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
  }

  searchByRange(x1: number, x2: number, y1: number, y2: number) {
    const matches: Match[] = [];
    this.toIndexRange(x1, x2).forEach(indexX => {
      this.toIndexRange(y1, y2).forEach(indexY => {
        const match = this.getByIndex(indexX, indexY);
        if (match) {
          matches.push(match);
        }
      });
    });

    return matches;
  }

  private toIndexRange(pos1: number, pos2: number) {
    const { tileSize } = this;
    const pMax = Math.ceil(pos2 / tileSize) * tileSize;
    const range = [];

    let pos = pos1;
    do {
      range.push(this.toIndex(pos));
      pos += tileSize;
    } while (pos < pMax);

    return range;
  }

  private toIndex(pos: number) {
    return toIndex(pos, this.tileSize);
  }

  // fixme change to private
  getByIndex(indexX: number, indexY: number): Match | undefined {
    const { tileSize, matrix } = this;
    const tile = matrix.get(indexX, indexY);

    if (tile) {
      const x1 = indexX * tileSize;
      const x2 = x1 + tileSize;
      const y1 = indexY * tileSize;
      const y2 = y1 + tileSize;

      return { tile, x1, x2, y1, y2, indexX, indexY };
    }
  }
}
