import { Compositor, type Layer } from './compositor';
import type { Entity } from './entity';
import { Matrix } from './math';

export type Tile = {
  name: string;
};

export class Level {
  private readonly compositor = new Compositor();
  readonly entities = new Set<Entity>();
  readonly tiles = new Matrix<Tile>();

  addLayer(layer: Layer) {
    this.compositor.addLayer(layer);
  }

  addEntity(entity: Entity) {
    this.entities.add(entity);
  }

  draw(context: CanvasRenderingContext2D) {
    this.compositor.draw(context);
  }

  update(deltaTime: number) {
    this.entities.forEach(entity => {
      entity.update(deltaTime);
    });
  }
}
