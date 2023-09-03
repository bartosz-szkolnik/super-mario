import type { Entity } from '../entity';
import type { Level } from '../level';
import type { GameContext } from '../main';
import { Vec2 } from '../math';
import type { TileCollisionContext } from '../tile-collider';
import type { Match } from '../tile-resolver';
import { Player } from '../traits';

function centerEntity(entity: Entity, pos: Vec2) {
  entity.pos.set(pos.x - entity.size.x / 2, pos.y - entity.size.y / 2);
}

function getMatchCenter(match: Match) {
  return new Vec2(match.x1 + (match.x2 - match.x1) / 2, match.y1 + (match.y2 - match.y1) / 2);
}

function addShrapnel(level: Level, { entityFactories }: GameContext, match: Match) {
  const center = getMatchCenter(match);

  const bricks: Entity[] = [];
  for (let i = 0; i < 4; i++) {
    const brick = entityFactories.brickShrapnel();
    centerEntity(brick, center);
    level.addEntity(brick);
    bricks.push(brick);
  }

  const spreadH = 60;
  const spreadV = 400;

  bricks[0].sounds.add('break');
  bricks[0].vel.set(-spreadH, -spreadV * 1.2);
  bricks[1].vel.set(-spreadH, -spreadV);
  bricks[2].vel.set(spreadH, -spreadV * 1.2);
  bricks[3].vel.set(spreadH, -spreadV);
}

function handleX({ entity, match }: TileCollisionContext) {
  const { vel, bounds } = entity;
  if (vel.x > 0) {
    if (bounds.right > match.x1) {
      entity.obstruct('right', match);
    }
  } else if (vel.x < 0) {
    if (bounds.left < match.x2) {
      entity.obstruct('left', match);
    }
  }
}

function handleY({ entity, match, gameContext, level, resolver }: TileCollisionContext) {
  const { vel, bounds } = entity;
  if (vel.y > 0) {
    if (bounds.bottom > match.y1) {
      entity.obstruct('bottom', match);
    }
  } else if (vel.y < 0) {
    if (entity.has(Player)) {
      const grid = resolver.matrix;
      grid.delete(match.indexX, match.indexY);
      addShrapnel(level, gameContext, match);
    }

    if (bounds.top < match.y2) {
      entity.obstruct('top', match);
    }
  }
}

export const brick = [handleX, handleY];
