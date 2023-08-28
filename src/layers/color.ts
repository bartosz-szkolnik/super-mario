import type { Layer } from '../compositor';

export function createColorLayer(color: string): Layer {
  return function drawColor(context: CanvasRenderingContext2D) {
    context.fillStyle = color;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  };
}
