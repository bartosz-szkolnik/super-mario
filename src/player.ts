import { PlayerController } from './entities/player-controller';
import { Entity } from './entity';
import type { Level } from './level';
import { Player } from './traits';

export function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.checkpoint.set(64, 64);

  playerController.setPlayer(playerEntity);
  playerEnv.addTrait(playerController);

  return playerEnv;
}

export function createPlayer(entity: Entity) {
  entity.addTrait(new Player());

  return entity;
}

export function* findPlayers(level: Level) {
  for (const entity of level.entities) {
    if (entity.has(Player)) {
      yield entity;
    }
  }
}
