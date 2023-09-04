import type { EntityFactories } from '../entities';
import { isPipePortalEntitySpec } from '../entities/pipe-portal';
import { Entity } from '../entity';
import { createBackgroundLayer } from '../layers/background';
import { createSpriteLayer } from '../layers/sprites';
import { Level, type Tile } from '../level';
import { loadJSON } from '../loaders';
import { GameContext } from '../main';
import { Matrix, Vec2 } from '../math';
import { SpriteSheet } from '../spritesheet';
import { Trait } from '../trait';
import { LevelTimer, Trigger } from '../traits';
import type { LevelSpec, PatternSheetSpec, TilePatternSpec } from '../types';
import { loadMusicSheet } from './music';
import { loadSpriteSheet } from './sprite';

const CHARACTER_BEHIND_BACKGROUND = false;

export function createLevelLoader(entityFactories: EntityFactories) {
  return async function loadLevel(name: string) {
    const levelSpec = await loadJSON<LevelSpec>(`assets/levels/${name}.json`);

    const { spriteSheet, musicSheet, patternSheet } = levelSpec;
    const [backgroundSprites, musicPlayer, patterns] = await Promise.all([
      loadSpriteSheet(spriteSheet),
      loadMusicSheet(musicSheet),
      loadPatterns(patternSheet),
    ]);

    const level = new Level();
    level.name = name;
    level.music.setPlayer(musicPlayer);

    setupBackgrounds(levelSpec, level, backgroundSprites, patterns);
    setupEntities(levelSpec, level, entityFactories);
    setupTriggers(levelSpec, level);
    setupCheckpoints(levelSpec, level);

    setupBehavior(level);
    setupCamera(level);

    if (CHARACTER_BEHIND_BACKGROUND) {
      for (const resolver of level.tileCollider.resolvers) {
        const backgroundLayer = createBackgroundLayer(level, resolver.matrix, backgroundSprites);
        level.addLayer(backgroundLayer);
      }

      const spriteLayer = createSpriteLayer(level.entities);
      const layers = level.getCompositor().getLayers();
      layers.splice(layers.length - 1, 0, spriteLayer);
    }

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
    if (!CHARACTER_BEHIND_BACKGROUND) {
      const backgroundLayer = createBackgroundLayer(level, grid, backgroundSprites);
      level.addLayer(backgroundLayer);
    }
    level.tileCollider.addGrid(grid);
  });
}

function createSpawner() {
  class Spawner extends Trait {
    private readonly entities: Entity[] = [];
    private readonly offsetX = 64;

    addEntity(entity: Entity) {
      this.entities.push(entity);
      this.entities.sort((a, b) => (a.pos.x < b.pos.x ? -1 : 1));
    }

    update(_entity: Entity, _gameContext: GameContext, level: Level) {
      const { pos, size } = level.camera;
      const cameraMaxX = pos.x + size.x + this.offsetX;
      while (this.entities[0]) {
        if (cameraMaxX > this.entities[0].pos.x) {
          level.addEntity(this.entities.shift()!);
        } else {
          break;
        }
      }
    }
  }

  return new Spawner();
}

function setupEntities(levelSpec: LevelSpec, level: Level, entityFactories: EntityFactories) {
  const spawner = createSpawner();

  levelSpec.entities.forEach(entitySpec => {
    if (isPipePortalEntitySpec(entitySpec)) {
      // prettier-ignore
      const { name, pos: [x, y] } = entitySpec;

      const createEntity = entityFactories[name];
      const entity = createEntity(entitySpec.props);
      entity.pos.set(x, y);

      entity.id = entitySpec.id ?? null;
      level.addEntity(entity);
      return;
    }

    // prettier-ignore
    const { name, pos: [x, y] } = entitySpec;

    const createEntity = entityFactories[name];
    if (!createEntity) {
      throw new Error(`No entity named ${name} found.`);
    }

    const entity = createEntity();
    entity.pos.set(x, y);
    spawner.addEntity(entity);
  });

  const entityProxy = new Entity();
  entityProxy.addTrait(spawner);
  level.entities.add(entityProxy);

  if (!CHARACTER_BEHIND_BACKGROUND) {
    const spriteLayer = createSpriteLayer(level.entities);
    level.addLayer(spriteLayer);
  }
}

function setupTriggers(levelSpec: LevelSpec, level: Level) {
  if (!levelSpec.triggers) {
    return;
  }

  for (const triggerSpec of levelSpec.triggers) {
    const trigger = new Trigger();

    trigger.addCondition((entity, touches, _gc, level) => {
      level.events.emit(Level.EVENT_TRIGGER, triggerSpec, entity, touches);
    });

    const entity = new Entity();
    entity.addTrait(trigger);
    entity.size.set(16, 32);
    entity.pos.set(...triggerSpec.pos);
    level.addEntity(entity);
  }
}

function createGrid(tiles: TilePatternSpec[], patterns: PatternSheetSpec) {
  const grid = new Matrix<Tile>();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    if (tile.type === 'PATTERN') {
      throw new Error('Found a pattern somewhere it should not be found.');
    }

    grid.set(x, y, { ...tile, behavior: tile.behavior });
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

function setupBehavior(level: Level) {
  level.events.listen(LevelTimer.EVENT_TIMER_OK, () => {
    level.music.playTheme();
  });
  level.events.listen(LevelTimer.EVENT_TIMER_HURRY, () => {
    level.music.playHurryTheme();
  });
}

function setupCamera(level: Level) {
  let maxX = 0;
  let maxTileSize = 0;

  for (const resolver of level.tileCollider.resolvers) {
    if (resolver.tileSize > maxTileSize) {
      maxTileSize = resolver.tileSize;
    }

    resolver.matrix.forEach((_, x) => {
      if (x > maxX) {
        maxX = x;
      }
    });
  }

  level.camera.max.x = (maxX + 1) * maxTileSize;
}

function setupCheckpoints(levelSpec: LevelSpec, level: Level) {
  if (!levelSpec.checkpoints) {
    level.checkpoints.push(new Vec2(0, 0));
    return;
  }

  levelSpec.checkpoints.forEach(([x, y]) => {
    level.checkpoints.push(new Vec2(x, y));
  });
}

function loadPatterns(name: string): Promise<PatternSheetSpec> {
  if (!name) {
    console.warn(`No patterns file called ${name} found.`);
    return Promise.resolve({});
  }

  return loadJSON<PatternSheetSpec>(`assets/sprites/patterns/${name}.json`);
}
