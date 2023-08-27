import type { EntityFactory } from '../entities';
import { Entity } from '../entity';
import { createBackgroundLayer } from '../layers/background';
import { createSpriteLayer } from '../layers/sprites';
import { Level, type Tile } from '../level';
import { loadJSON } from '../loaders';
import { Matrix } from '../math';
import type { SpriteSheet } from '../spritesheet';
import { LevelTimer } from '../traits/level-timer';
import type { LevelSpec, PatternSheetSpec, TilePatternSpec } from '../types';
import { loadMusicSheet } from './music';
import { loadSpriteSheet } from './sprite';

export function createLevelLoader(entityFactory: EntityFactory) {
  return async function loadLevel(name: string) {
    const levelSpec = await loadJSON<LevelSpec>(`assets/levels/${name}.json`);

    const [backgroundSprites, musicPlayer, patterns] = await Promise.all([
      loadSpriteSheet(levelSpec.spriteSheet),
      loadMusicSheet(levelSpec.musicSheet),
      loadPatterns(levelSpec.patternSheet),
    ]);

    const level = new Level();
    level.music.setPlayer(musicPlayer);

    setupBackgrounds(levelSpec, level, backgroundSprites, patterns);
    setupEntities(levelSpec, level, entityFactory);
    setupBehavior(level);

    return level;
  };
}

function setupBackgrounds(
  levelSpec: LevelSpec,
  level: Level,
  backgroundSprites: SpriteSheet,
  patterns: PatternSheetSpec,
) {
  levelSpec.layers.forEach(layer => {
    const grid = createGrid(layer.tiles, patterns);
    const backgroundLayer = createBackgroundLayer(level, grid, backgroundSprites);
    level.addLayer(backgroundLayer);
    level.tileCollider.addGrid(grid);
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

function createGrid(tiles: TilePatternSpec[], patterns: PatternSheetSpec) {
  const grid = new Matrix<Tile>();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    // fixme: remove later
    if (tile.type === 'PATTERN') {
      throw new Error('Found a pattern somewhere it should not be found.');
    }
    grid.set(x, y, { ...tile, type: tile.behavior });
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

function expandRange(range: TilePatternSpec['ranges'][0]) {
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

function* expandRanges(ranges: TilePatternSpec['ranges']) {
  for (const range of ranges) {
    yield* expandRange(range);
  }
}

type ExpandedTiles = { tile: TilePatternSpec; x: number; y: number };

function* expandTiles(tiles: TilePatternSpec[], patterns: PatternSheetSpec) {
  function* walkTiles(tiles: TilePatternSpec[], offsetX: number, offsetY: number): Generator<ExpandedTiles> {
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

function createTimer() {
  const timer = new Entity();
  timer.addTrait(new LevelTimer());

  return timer;
}

function setupBehavior(level: Level) {
  const timer = createTimer();
  level.entities.add(timer);

  level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
    level.music.playTheme();
  });
  level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
    level.music.playHurryTheme();
  });
}

function loadPatterns(name: string): Promise<PatternSheetSpec> {
  if (!name) {
    console.warn(`No patterns file called ${name} found.`);
    return Promise.resolve({});
  }

  return loadJSON<PatternSheetSpec>(`assets/sprites/patterns/${name}.json`);
}
