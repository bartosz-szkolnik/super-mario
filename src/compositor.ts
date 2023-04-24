export type Layer = (context: CanvasRenderingContext2D) => void;

export class Compositor {
  private readonly layers: Layer[] = [];

  addLayer(layer: Layer) {
    this.layers.push(layer);
  }

  draw(context: CanvasRenderingContext2D) {
    this.layers.forEach(layer => {
      layer(context);
    });
  }
}
