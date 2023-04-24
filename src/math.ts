export class Vec2 {
  constructor(public x: number, public y: number) {}

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export function isVec2(value: unknown): value is Vec2 {
  if (!value) {
    return false;
  }

  return typeof value === 'object' && Object.hasOwn(value, 'x') && Object.hasOwn(value, 'y');
}
