import type { Entity } from './entity';
import type { Level, Tile } from './level';
import { GameContext } from './main';
import type { Matrix } from './math';
import { Match, TileResolver } from './tile-resolver';
import { brick } from './tiles/brick';
import { coin } from './tiles/coin';
import { ground } from './tiles/ground';

export type TileCollisionContext = {
  entity: Entity;
  match: Match;
  resolver: TileResolver;
  gameContext: GameContext;
  level: Level;
};

const handlers = {
  ground,
  brick,
  coin,
} as const;

export class TileCollider {
  readonly resolvers: TileResolver[] = [];

  addGrid(tileMatrix: Matrix<Tile>) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  checkX(entity: Entity, gameContext: GameContext, level: Level) {
    const { vel, bounds } = entity;
    let x = 0;
    if (vel.x > 0) {
      x = bounds.right;
    } else if (vel.x < 0) {
      x = bounds.left;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(x, x, bounds.top, bounds.bottom);
      matches.forEach(match => {
        this.handle(0, entity, match, resolver, gameContext, level);
      });
    }
  }

  checkY(entity: Entity, gameContext: GameContext, level: Level) {
    const { vel, bounds } = entity;
    let y = 0;
    if (vel.y > 0) {
      y = bounds.bottom;
    } else if (vel.y < 0) {
      y = bounds.top;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(bounds.left, bounds.right, y, y);
      matches.forEach(match => {
        this.handle(1, entity, match, resolver, gameContext, level);
      });
    }
  }

  handle(index: number, entity: Entity, match: Match, resolver: TileResolver, gameContext: GameContext, level: Level) {
    const context = {
      entity,
      gameContext,
      level,
      match,
      resolver,
    } satisfies TileCollisionContext;

    const behavior = match.tile.behavior;
    if (!behavior || !handlers[behavior]) {
      return;
    }

    const handlerGroup = handlers[behavior];
    handlerGroup[index](context);
  }
}
