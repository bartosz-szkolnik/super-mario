import type { Vec2 } from './math';

export class BoundingBox {
  constructor(private readonly pos: Vec2, private readonly size: Vec2, private readonly offset: Vec2) {}

  get bottom() {
    return this.pos.y + this.size.y + this.offset.y;
  }

  set bottom(y: number) {
    this.pos.y = y - (this.size.y + this.offset.y);
  }

  get top() {
    return this.pos.y + this.offset.y;
  }

  set top(y: number) {
    this.pos.y = y - this.offset.y;
  }

  get left() {
    return this.pos.x + this.offset.x;
  }

  set left(x: number) {
    this.pos.x = x - this.offset.x;
  }

  get right() {
    return this.pos.x + this.size.x + this.offset.x;
  }

  set right(x: number) {
    this.pos.x = x - (this.size.x + this.offset.x);
  }

  overlaps(box: BoundingBox) {
    // prettier-ignore
    return this.bottom > box.top
      && this.top < box.bottom 
      && this.left < box.right 
      && this.right > box.left;
  }
}
