import { createBackgroundLayer, createSpriteLayer } from '../layers';
import { CollisionTile, Level, Tile } from '../level';
import { loadJSON, loadSpriteSheet } from '../loaders';
import { Matrix } from '../math';
import type { LevelSpec, TileSpec } from '../types';

export async function loadLevel(name: string) {
  const levelSpec = await loadJSON<LevelSpec>(`assets/levels/${name}.json`);
  const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);

  const level = new Level();

  const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
    return mergedTiles.concat(layerSpec.tiles);
  }, [] as TileSpec[]);
  const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
  level.setCollisionGrid(collisionGrid);

  levelSpec.layers.forEach(layer => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
    const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
    level.addLayer(backgroundLayer);
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.addLayer(spriteLayer);

  return level;
}

function createCollisionGrid(tiles: TileSpec[], patterns: LevelSpec['patterns']) {
  const grid = new Matrix<CollisionTile>();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { type: tile.behavior });
  }

  return grid;
}

function createBackgroundGrid(tiles: TileSpec[], patterns: LevelSpec['patterns']) {
  const grid = new Matrix<Tile>();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    // fixme: remove later
    if (tile.type === 'PATTERN') {
      throw new Error('Found a pattern somewhere it should not be found.');
    }
    grid.set(x, y, { name: tile.name });
  }

  return grid;
}

function* expandSpan(xStart: number, xLen: number, yStart: number, yLen: number) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;

  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x, y };
    }
  }
}

function expandRange(range: TileSpec['ranges'][0]) {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);
  }

  if (range.length === 3) {
    const [xStart, xLen, yStart] = range;
    return expandSpan(xStart, xLen, yStart, 1);
  }

  if (range.length === 2) {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }

  throw new Error('You have more than 4 or less than 2 numbers in your ranges prop.');
}

function* expandRanges(ranges: TileSpec['ranges']) {
  for (const range of ranges) {
    for (const item of expandRange(range)!) {
      yield item;
    }
  }
}

function expandTiles(tiles: TileSpec[], patterns: LevelSpec['patterns']) {
  const expandedTiles: { tile: TileSpec; x: number; y: number }[] = [];

  function walkTiles(tiles: TileSpec[], offsetX: number, offsetY: number) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.type === 'PATTERN') {
          const tiles = patterns[tile.pattern].tiles;
          walkTiles(tiles, derivedX, derivedY);
        } else {
          expandedTiles.push({
            tile,
            x: derivedX,
            y: derivedY,
          });
        }
      }
    }
  }

  walkTiles(tiles, 0, 0);

  return expandedTiles;
}
