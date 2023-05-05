import type { Camera } from './camera';
import { Compositor, type Layer } from './compositor';
import type { Entity } from './entity';
import type { Matrix } from './math';
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
  readonly entities = new Set<Entity>();
  tileCollider: TileCollider | null = null;

  totalTime = 0;

  addLayer(layer: Layer) {
    this.compositor.addLayer(layer);
  }

  addEntity(entity: Entity) {
    this.entities.add(entity);
  }

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    this.compositor.draw(context, camera);
  }

  update(deltaTime: number) {
    this.entities.forEach(entity => {
      // fixme: delete later
      if (!this.tileCollider) {
        throw new Error('Tile collider not found.');
      }

      entity.update(deltaTime);

      entity.pos.x += entity.vel.x * deltaTime;
      this.tileCollider.checkX(entity);
      entity.pos.y += entity.vel.y * deltaTime;
      this.tileCollider.checkY(entity);

      entity.vel.y += GRAVITY * deltaTime;
    });

    this.totalTime += deltaTime;
  }

  setCollisionGrid(matrix: Matrix<CollisionTile>) {
    this.tileCollider = new TileCollider(matrix);
  }
}
