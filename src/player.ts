import { Entity } from './entity';
import { Player } from './traits';

export function makePlayer(entity: Entity, name: string) {
  const player = new Player();
  player.name = name;
  entity.addTrait(player);
}

export function* findPlayers(entities: Set<Entity>) {
  for (const entity of entities) {
    if (entity.has(Player)) {
      yield entity;
    }
  }
}
