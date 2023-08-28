import { Camera } from './camera';
import type { Entity } from './entity';
import { EntityCollider } from './entity-collider';
import type { GameContext } from './main';
import { MusicController } from './music-controller';
import { findPlayers } from './player';
import { Scene } from './scene';
import { TileCollider } from './tile-collider';

export type CollisionTile = {
  type?: string;
};

export type BackgroundTile = {
  name: string;
};

export type Tile = BackgroundTile & CollisionTile;

const GRAVITY = 1500;

export class Level extends Scene {
  static EVENT_TRIGGER = Symbol('trigger');

  readonly entities = new Set<Entity>();
  readonly gravity = GRAVITY;

  readonly music = new MusicController();
  readonly camera = new Camera();

  private readonly entityCollider = new EntityCollider(this.entities);
  readonly tileCollider = new TileCollider();

  totalTime = 0;
  name = '';

  addEntity(entity: Entity) {
    this.entities.add(entity);
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity);
  }

  hasEntity(entity: Entity) {
    return this.entities.has(entity);
  }

  draw({ videoContext }: GameContext) {
    this.compositor.draw(videoContext, this.camera);
  }

  update(gameContext: GameContext) {
    this.entities.forEach(entity => {
      entity.update(gameContext, this);
    });

    this.entities.forEach(entity => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach(entity => {
      entity.finalize();
    });

    focusPlayer(this);

    this.totalTime += gameContext.deltaTime ?? 0;
  }

  pause() {
    this.music.pause();
  }
}

function focusPlayer(level: Level) {
  for (const player of findPlayers(level.entities)) {
    level.camera.pos.x = Math.max(0, player.pos.x - 100);
  }
}
