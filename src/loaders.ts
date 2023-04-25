import { createBackgroundLayer, createSpriteLayer } from './layers';
import { Level } from './level';
import { loadBackgroundSprites } from './sprites';
import type { Background, LevelSpec } from './types';

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image), { once: true });
    image.src = url;
  });
}

export async function loadLevel(name: string) {
  const [spec, backgroundSprites] = await Promise.all([loadLevelSpec(name), loadBackgroundSprites()]);
  const level = new Level();
  createTiles(level, spec.backgrounds);

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
  level.addLayer(backgroundLayer);
  const spriteLayer = createSpriteLayer(level.entities);
  level.addLayer(spriteLayer);

  return level;
}

function createTiles(level: Level, backgrounds: Background[]) {
  backgrounds.forEach(background => {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          level.tiles.set(x, y, {
            name: background.tile,
          });
        }
      }
    });
  });
}

async function loadLevelSpec(name: string): Promise<LevelSpec> {
  const resp = await fetch(`assets/levels/${name}.json`);
  return resp.json();
}
