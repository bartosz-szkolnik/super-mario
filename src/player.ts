import { PlayerController } from './entities/player-controller';
import { Entity } from './entity';
import { Player } from './traits';

export function createPlayerEnv(playerEntity: Entity) {
  const playerEnv = new Entity();
  const playerController = new PlayerController();
  playerController.checkpoint.set(64, 64);

  playerController.setPlayer(playerEntity);
  playerEnv.addTrait(playerController);

  return playerEnv;
}

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
