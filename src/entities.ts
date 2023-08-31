import { loadBullet } from './entities/bullet';
import { loadCannon } from './entities/cannon';
import { loadGoombaBrown, loadGoombaBlue } from './entities/goomba';
import { loadKoopaGreen, loadKoopaBlue } from './entities/koopa';
import { loadMario } from './entities/mario';

// fixme decide whether to use kebab-case or camelCase

export type EntityFactory = {
  mario: Awaited<ReturnType<typeof loadMario>>;
  'goomba-brown': Awaited<ReturnType<typeof loadGoombaBrown>>;
  'goomba-blue': Awaited<ReturnType<typeof loadGoombaBlue>>;
  'koopa-green': Awaited<ReturnType<typeof loadKoopaGreen>>;
  'koopa-blue': Awaited<ReturnType<typeof loadKoopaBlue>>;
  goombaBrown: Awaited<ReturnType<typeof loadGoombaBrown>>;
  goombaBlue: Awaited<ReturnType<typeof loadGoombaBlue>>;
  koopaGreen: Awaited<ReturnType<typeof loadKoopaGreen>>;
  koopaBlue: Awaited<ReturnType<typeof loadKoopaBlue>>;
  bullet: Awaited<ReturnType<typeof loadBullet>>;
  cannon: Awaited<ReturnType<typeof loadCannon>>;
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
  ]).then(
    ([
      createMario,
      createGoombaBrown,
      createGoombaBlue,
      createKoopaGreen,
      createKoopaBlue,
      createBullet,
      createCannon,
    ]) => {
      return {
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
      } satisfies EntityFactory;
    },
  );
}
