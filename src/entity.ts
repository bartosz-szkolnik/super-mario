import { Vec2 } from './math';

export class Entity {
  readonly pos = new Vec2(0, 0);
  readonly vel = new Vec2(0, 0);

  update(_deltaTime: number) {}
  draw(_context: CanvasRenderingContext2D) {}
}
