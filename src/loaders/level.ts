import type { EntityFactory } from '../entities';
import { createBackgroundLayer, createSpriteLayer } from '../layers';
import { type CollisionTile, Level, type Tile } from '../level';
import { loadJSON, loadSpriteSheet } from '../loaders';
import { Matrix } from '../math';
import type { SpriteSheet } from '../spritesheet';
import type { LevelSpec, TileSpec } from '../types';

export function createLevelLoader(entityFactory: EntityFactory) {
  return async function loadLevel(name: string) {
    const levelSpec = await loadJSON<LevelSpec>(`assets/levels/${name}.json`);
    const backgroundSprites = await loadSpriteSheet(levelSpec.spriteSheet);

    const level = new Level();

    setupCollision(levelSpec, level);
    setupBackgrounds(levelSpec, level, backgroundSprites);
    setupEntities(levelSpec, level, entityFactory);

    return level;
  };
}

function setupCollision(levelSpec: LevelSpec, level: Level) {
  const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
    return mergedTiles.concat(layerSpec.tiles);
  }, [] as TileSpec[]);
  const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
  level.setCollisionGrid(collisionGrid);
}

function setupBackgrounds(levelSpec: LevelSpec, level: Level, backgroundSprites: SpriteSheet) {
  levelSpec.layers.forEach(layer => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
    const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
    level.addLayer(backgroundLayer);
  });
}

function setupEntities(levelSpec: LevelSpec, level: Level, entityFactory: EntityFactory) {
  levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.pos.set(x, y);
    level.entities.add(entity);
  });

  const spriteLayer = createSpriteLayer(level.entities);
  level.addLayer(spriteLayer);
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
    yield* expandRange(range);
  }
}

type ExpandedTiles = { tile: TileSpec; x: number; y: number };

function* expandTiles(tiles: TileSpec[], patterns: LevelSpec['patterns']) {
  function* walkTiles(tiles: TileSpec[], offsetX: number, offsetY: number): Generator<ExpandedTiles> {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.type === 'PATTERN') {
          const tiles = patterns[tile.pattern].tiles;
          yield* walkTiles(tiles, derivedX, derivedY);
        } else {
          yield { tile, x: derivedX, y: derivedY };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}
