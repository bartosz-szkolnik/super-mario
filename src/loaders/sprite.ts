import { createAnimation } from '../animation';
import { loadImage, loadJSON } from '../loaders';
import { SpriteSheet } from '../spritesheet';
import type { SpriteSpec } from '../types';

export async function loadSpriteSheet(name: string) {
  const sheetSpec = await loadJSON<SpriteSpec>(`assets/sprites/${name}.json`);
  const { imageUrl, tileHeight, tileWidth, tiles, frames, animations } = sheetSpec;
  const image = await loadImage(imageUrl);

  const sprites = new SpriteSheet(image, tileWidth, tileHeight);

  if (tiles) {
    tiles.forEach(({ name, index: [x, y] }) => sprites.defineTile(name, x, y));
  }

  if (frames) {
    frames.forEach(({ name, rect }) => sprites.define(name, ...rect));
  }

  if (animations) {
    animations.forEach(({ name, frames, frameLength }) => {
      const animation = createAnimation(frames, frameLength);
      sprites.defineAnimation(name, animation);
    });
  }

  return sprites;
}
