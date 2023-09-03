import { Vec2 } from '../math';
import { Trait } from '../trait';

export class PipeTraveller extends Trait {
  readonly direction = new Vec2(0, 0);
  readonly movement = new Vec2(0, 0);
  readonly distance = new Vec2(0, 0);
}
