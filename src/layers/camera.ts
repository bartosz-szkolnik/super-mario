import type { Camera } from '../camera';
import type { Layer } from '../compositor';

export function createCameraLayer(cameraToDraw: Camera): Layer {
  return function drawCameraRect(context: CanvasRenderingContext2D, fromCamera: Camera) {
    context.strokeStyle = 'purple';
    context.beginPath();
    context.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y,
    );
    context.stroke();
  };
}
