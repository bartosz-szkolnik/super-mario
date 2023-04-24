import { loadImage, loadLevel } from './loaders';
import { SpriteSheet } from './spritesheet';
import { Level } from './types';

function drawBackground(background: Level['backgrounds'][0], context: CanvasRenderingContext2D, sprites: SpriteSheet) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; ++x) {
      for (let y = y1; y < y2; ++y) {
        sprites.drawTile(background.tile, context, x, y);
      }
    }
  });
}

const canvas = document.getElementById('screen') as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error('Canvas element not initialized properly. Could not find it in the document.');
}

const context = canvas.getContext('2d');
if (!context) {
  throw new Error('Context on the canvas not initialized properly.');
}

context.fillRect(0, 0, 50, 50);

loadImage('assets/tiles.png').then(image => {
  const sprites = new SpriteSheet(image, 16, 16);
  sprites.define('ground', 0, 0);
  sprites.define('sky', 3, 23);

  loadLevel('1-1').then((level: Level) => {
    level.backgrounds.forEach(background => {
      drawBackground(background, context, sprites);
    });
  });
});
