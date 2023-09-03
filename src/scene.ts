import { Compositor, type Layer } from './compositor';
import { EventEmitter } from './event-emitter';
import type { GameContext } from './main';

export class Scene {
  static EVENT_COMPLETE = Symbol('scene complete');

  protected readonly compositor = new Compositor();
  readonly events = new EventEmitter();

  draw({ videoContext }: GameContext) {
    this.compositor.draw(videoContext);
  }

  pause() {}

  addLayer(layer: Layer) {
    this.compositor.addLayer(layer);
  }

  getCompositor() {
    return this.compositor;
  }

  update(_gameContext: GameContext) {}
}
