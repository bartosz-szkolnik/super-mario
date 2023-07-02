export class Matrix<T = unknown> {
  // fixme make me private again
  readonly grid: Array<Array<T>> = [];

  forEach(fn: (tile: T, x: number, y: number) => void) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        fn(value, x, y);
      });
    });
  }

  get(x: number, y: number) {
    const col = this.grid[x];
    if (col) {
      return col[y];
    }

    return undefined;
  }

  set(x: number, y: number, value: T) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }

  delete(x: number, y: number) {
    const col = this.grid[x];
    if (col) {
      delete col[y];
    }
  }
}

export class Vec2 {
  constructor(public x: number, public y: number) {}

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy(vec2: Vec2) {
    this.x = vec2.x;
    this.y = vec2.y;
  }

  static isVec2(value: unknown): value is Vec2 {
    if (!value) {
      return false;
    }

    return typeof value === 'object' && Object.hasOwn(value, 'x') && Object.hasOwn(value, 'y');
  }
}
