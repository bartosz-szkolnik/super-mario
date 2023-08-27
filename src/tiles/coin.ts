import { TileCollisionContext } from '../tile-collider';
import { Player } from '../traits';

function handle({ entity, match, resolver }: TileCollisionContext) {
  if (entity.has(Player)) {
    entity.get(Player).addCoins(1);

    const grid = resolver['matrix'];
    grid.delete(match.indexX, match.indexY);
  }
}

export const coin = [handle, handle];
