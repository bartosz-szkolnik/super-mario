import { loadFlagPole } from './entities/flag-pole';
import { loadBrickShrapnel } from './entities/brick-shrapnel';
import { loadBullet } from './entities/bullet';
import { loadCannon } from './entities/cannon';
import { loadGoombaBrown, loadGoombaBlue } from './entities/goomba';
import { loadKoopaGreen, loadKoopaBlue } from './entities/koopa';
import { loadMario } from './entities/mario';
import { loadPipePortal } from './entities/pipe-portal';
import type { Entity, EntityProps } from './entity';
import { PipePortalPropsSpec } from './types';

// fixme decide whether to use kebab-case or camelCase

type EntityFactory = (props?: EntityProps) => Entity;
type PipePortalFactory = (props: PipePortalPropsSpec) => Entity;

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
  flagPole: EntityFactory;
  'flag-pole': EntityFactory;
  pipePortal: PipePortalFactory;
  'pipe-portal': PipePortalFactory;
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
    loadFlagPole(audioContext),
    loadPipePortal(audioContext),
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
      createFlagPole,
      createPipePortal,
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
        flagPole: createFlagPole,
        'flag-pole': createFlagPole,
        pipePortal: createPipePortal,
        'pipe-portal': createPipePortal,
      } satisfies EntityFactories),
  );
}
