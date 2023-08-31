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

export function bootstrap(entity: Entity, level: Level) {
  entity.get(LevelTimer).reset();
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
