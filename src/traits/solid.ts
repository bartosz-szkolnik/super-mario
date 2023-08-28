import type { Entity, Side } from '../entity';
import type { Match } from '../tile-resolver';
import { Trait } from '../trait';

export class Solid extends Trait {
  obstructs = true;

  obstruct(entity: Entity, side: Side, match: Match) {
    if (!this.obstructs) {
      return;
    }

    const { bounds, vel } = entity;
    if (side === 'bottom') {
      bounds.bottom = match.y1;
      vel.y = 0;
    } else if (side === 'top') {
      bounds.top = match.y2;
      vel.y = 0;
    } else if (side === 'left') {
      bounds.left = match.x2;
      vel.x = 0;
    } else if (side === 'right') {
      bounds.right = match.x1;
      vel.x = 0;
    }
  }
}
