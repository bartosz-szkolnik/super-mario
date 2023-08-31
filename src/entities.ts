import { loadBrickShrapnel } from './entities/brick-shrapnel';
import { loadBullet } from './entities/bullet';
import { loadCannon } from './entities/cannon';
import { loadGoombaBrown, loadGoombaBlue } from './entities/goomba';
import { loadKoopaGreen, loadKoopaBlue } from './entities/koopa';
import { loadMario } from './entities/mario';
import type { Entity } from './entity';

// fixme decide whether to use kebab-case or camelCase

type EntityFactory = () => Entity;

function createPool(size: number) {
  const pool: Entity[] = [];

  return function createPooledFactory(factory: EntityFactory) {
    for (let i = 0; i < size; i++) {
      pool.push(factory());
    }

    let count = 0;
    return function pooledFactory() {
      const entity = pool[count++ % pool.length];
      entity.lifetime = 0;
      return entity;
    };
  };
}

export type EntityFactories = {
  mario: EntityFactory;
  'goomba-brown': EntityFactory;
  'goomba-blue': EntityFactory;
  'koopa-green': EntityFactory;
  'koopa-blue': EntityFactory;
  goombaBrown: EntityFactory;
  goombaBlue: EntityFactory;
  koopaGreen: EntityFactory;
  koopaBlue: EntityFactory;
  bullet: EntityFactory;
  cannon: EntityFactory;
  brickShrapnel: EntityFactory;
};

export async function loadEntities(audioContext: AudioContext) {
  return Promise.all([
    loadMario(audioContext),
    loadGoombaBrown(),
    loadGoombaBlue(),
    loadKoopaGreen(),
    loadKoopaBlue(),
    loadBullet(),
    loadCannon(audioContext),
    loadBrickShrapnel(audioContext).then(createPool(8)),
  ]).then(
    ([
      createMario,
      createGoombaBrown,
      createGoombaBlue,
      createKoopaGreen,
      createKoopaBlue,
      createBullet,
      createCannon,
      createBrickShrapnel,
    ]) =>
      ({
        mario: createMario,
        'goomba-brown': createGoombaBrown,
        'goomba-blue': createGoombaBlue,
        'koopa-green': createKoopaGreen,
        'koopa-blue': createKoopaBlue,
        goombaBrown: createGoombaBrown,
        goombaBlue: createGoombaBlue,
        koopaGreen: createKoopaGreen,
        koopaBlue: createKoopaBlue,
        bullet: createBullet,
        cannon: createCannon,
        brickShrapnel: createBrickShrapnel,
      } satisfies EntityFactories),
  );
}
