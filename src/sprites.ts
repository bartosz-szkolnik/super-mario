import { loadImage } from './loaders';
import { SpriteSheet } from './spritesheet';

export async function loadMarioSprites() {
  const image = await loadImage('assets/characters.gif');
  const sprites = new SpriteSheet(image, 16, 16);
  sprites.define('idle', 276, 44, 16, 16);
  return sprites;
}
