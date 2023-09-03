import type { Entity } from './entity';
import type { Level } from './level';
import { LevelTimer, Player } from './traits';

export function makePlayer(entity: Entity, name: string) {
  const player = new Player();
  player.name = name;
  entity.addTrait(player);

  const timer = new LevelTimer();
  entity.addTrait(timer);
}

export function resetPlayer(entity: Entity, worldName: string) {
  entity.get(LevelTimer).reset();
  entity.get(Player).world = worldName;
}

export function bootstrapPlayer(entity: Entity, level: Level) {
  entity.get(LevelTimer).hurryEmitted = null;
  entity.pos.copy(level.checkpoints[0]);
  level.addEntity(entity);
}

export function* findPlayers(entities: Set<Entity>) {
  for (const entity of entities) {
    if (entity.has(Player)) {
      yield entity;
    }
  }
}
