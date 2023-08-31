import { Vec2 } from './math';

export class Camera {
  readonly pos = new Vec2(0, 0);
  readonly size = new Vec2(256, 224);

  readonly min = new Vec2(0, 0);
  readonly max = new Vec2(Infinity, Infinity);
}
