import { createAnimation } from './animation';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { Level } from './level';
import { SpriteSheet } from './spritesheet';
import type { Background, LevelSpec, SpriteSet } from './types';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image), { once: true });
    image.src = url;
  });
}

export async function loadLevel(name: string) {
  const levelSpec = await loadJSON<LevelSpec>(`assets/levels/${name}.json`);
  const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);

  const level = new Level();
  createTiles(level, levelSpec.backgrounds);

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
  level.addLayer(backgroundLayer);
  const spriteLayer = createSpriteLayer(level.entities);
  level.addLayer(spriteLayer);

  return level;
}

export async function loadSpriteSheet(name: string) {
  const sheetSpec = await loadJSON<SpriteSet>(`assets/sprites/${name}.json`);
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

function createTiles(level: Level, backgrounds: Background[]) {
  function applyRange(background: Background, xStart: number, xLen: number, yStart: number, yLen: number) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;

    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        level.tiles.set(x, y, {
          name: background.tile,
          type: background.type,
        });
      }
    }
  }

  backgrounds.forEach(background => {
    background.ranges.forEach(range => {
      if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        applyRange(background, xStart, xLen, yStart, yLen);
        return;
      }

      if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        applyRange(background, xStart, xLen, yStart, 1);
        return;
      }

      if (range.length === 2) {
        const [xStart, yStart] = range;
        applyRange(background, xStart, 1, yStart, 1);
      }
    });
  });
}

async function loadJSON<T = unknown>(url: string): Promise<T> {
  const resp = await fetch(url);
  return resp.json();
}
