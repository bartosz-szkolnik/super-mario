import type { Camera } from './camera';
import { Compositor, type Layer } from './compositor';
import type { Entity } from './entity';
import { EntityCollider } from './entity-collider';
import type { GameContext } from './main';
import { MusicController } from './music-controller';
import { TileCollider } from './tile-collider';

export type CollisionTile = {
  type?: 'ground';
};

export type BackgroundTile = {
  // name: string;
  name: 'sky' | 'ground' | 'chance';
};

export type Tile = BackgroundTile & CollisionTile;

const GRAVITY = 1500;

export class Level {
  private readonly compositor = new Compositor();
  // fixme make private
  readonly entities = new Set<Entity>();
  readonly gravity = GRAVITY;

  private readonly entityCollider = new EntityCollider(this.entities);
  readonly tileCollider = new TileCollider();

  totalTime = 0;

  readonly musicController = new MusicController();

  addLayer(layer: Layer) {
    this.compositor.addLayer(layer);
  }

  addEntity(entity: Entity) {
    this.entities.add(entity);
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity);
  }

  hasEntity(entity: Entity) {
    return this.entities.has(entity);
  }

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    this.compositor.draw(context, camera);
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

    this.totalTime += gameContext.deltaTime ?? 0;
  }
}
