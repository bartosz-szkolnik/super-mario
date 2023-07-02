import { loadBullet } from './entities/bullet';
import { loadCannon } from './entities/cannon';
import { loadGoomba } from './entities/goomba';
import { loadKoopa } from './entities/koopa';
import { loadMario } from './entities/mario';

export type EntityFactory = {
  mario: Awaited<ReturnType<typeof loadMario>>;
  goomba: Awaited<ReturnType<typeof loadGoomba>>;
  koopa: Awaited<ReturnType<typeof loadKoopa>>;
  bullet: Awaited<ReturnType<typeof loadBullet>>;
  cannon: Awaited<ReturnType<typeof loadCannon>>;
};

export async function loadEntities(audioContext: AudioContext) {
  // fixme later
  let entityFactory = {} as any;

  return Promise.all([
    loadMario(audioContext),
    loadGoomba(),
    loadKoopa(),
    loadBullet(),
    loadCannon(audioContext, entityFactory),
  ]).then(([createMario, createGoomba, createKoopa, createBullet, createCannon]) => {
    const e = {
      mario: createMario,
      goomba: createGoomba,
      koopa: createKoopa,
      bullet: createBullet,
      cannon: createCannon,
    } satisfies EntityFactory;
    entityFactory = Object.assign(entityFactory, e);

    return e;
  });
}
